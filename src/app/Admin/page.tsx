
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

// TypeScript types
interface Livre {
  id: number;
  titre: string;
  auteur: string;
  genre?: string;
  image?: string;
  statut?: string;
}
interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  sexe?: string;
  telephone?: string;
}

interface Emprunt {
  id: number;
  date_emprunt: string;
  date_retour?: string | null;
  statut: string;
  livre_titre: string;
  livre_auteur: string;
  livre_genre?: string;
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_email: string;
}

const AdminPage = () => {
  // Sécurité : accès réservé à l'admin
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      if (role !== 'admin') {
        window.location.href = '/Connexion';
      }
    }
  }, []);
  // Livres
  const [livres, setLivres] = useState<Livre[]>([]);
  const [showLivreForm, setShowLivreForm] = useState(false);
  const [livreForm, setLivreForm] = useState<Partial<Livre> & { imageFile?: File | null }>({});
  const [editLivreId, setEditLivreId] = useState<number | null>(null);
  // Étudiants
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [showEtudiantForm, setShowEtudiantForm] = useState(false);
  const [etudiantForm, setEtudiantForm] = useState<Partial<Etudiant>>({});
  const [editEtudiantId, setEditEtudiantId] = useState<number | null>(null);
  // Emprunts
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [empruntStats, setEmpruntStats] = useState<{ totalEmpruntes: number; totalRetard: number; totalActifs: number }>({ totalEmpruntes: 0, totalRetard: 0, totalActifs: 0 });
  // UI
  const [tab, setTab] = useState<'livres' | 'etudiants' | 'emprunts'>('livres');
  const [loading, setLoading] = useState(false);

  // Charger les livres et étudiants
  useEffect(() => {
    fetchLivres();
    fetchEtudiants();
    fetchEmprunts();
  }, []);

  const fetchEmprunts = async () => {
    try {
      const res = await axios.get('http://localhost:4400/api/emprunts');
      setEmprunts(res.data.emprunts);
      setEmpruntStats(res.data.stats);
    } catch {
      setEmprunts([]);
      setEmpruntStats({ totalEmpruntes: 0, totalRetard: 0, totalActifs: 0 });
    }
  };

  const fetchLivres = async () => {
    try {
      const res = await axios.get("http://localhost:4400/api/livres");
      setLivres(res.data);
    } catch {
      setLivres([]);
    }
  };
  const fetchEtudiants = async () => {
    try {
      const res = await axios.get("http://localhost:4400/api/users");
      setEtudiants(res.data);
    } catch {
      setEtudiants([]);
    }
  };

  // Gestion Livres
  const handleLivreFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files) {
      setLivreForm((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setLivreForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleLivreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SUBMIT LIVRE', livreForm, editLivreId);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titre", livreForm.titre || "");
      formData.append("auteur", livreForm.auteur || "");
      formData.append("genre", livreForm.genre || "");
      if (livreForm.imageFile) formData.append("image", livreForm.imageFile);
      if (editLivreId) {
        if (livreForm.imageFile) {
          // Si une nouvelle image est sélectionnée, envoyer en multipart/form-data
          const formDataEdit = new FormData();
          formDataEdit.append("titre", livreForm.titre || "");
          formDataEdit.append("auteur", livreForm.auteur || "");
          formDataEdit.append("genre", livreForm.genre || "");
          formDataEdit.append("image", livreForm.imageFile);
          await axios.put(`http://localhost:4400/api/livres/${editLivreId}`, formDataEdit, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          // Sinon, envoyer en JSON et inclure l'ancienne image si présente
          await axios.put(`http://localhost:4400/api/livres/${editLivreId}`, {
            titre: livreForm.titre,
            auteur: livreForm.auteur,
            genre: livreForm.genre,
            image: livreForm.image // garder l'ancienne image si pas de nouvelle
          });
        }
      } else {
        await axios.post("http://localhost:4400/api/livres", formData);
      }
      setShowLivreForm(false);
      setLivreForm({});
      setEditLivreId(null);
      fetchLivres();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement du livre.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditLivre = (livre: Livre) => {
    console.log('EDIT LIVRE', livre);
    setLivreForm(livre);
    setEditLivreId(livre.id);
    setShowLivreForm(true);
  };
  const handleDeleteLivre = async (id: number) => {
    console.log('DELETE LIVRE', id);
    if (!window.confirm("Supprimer ce livre ?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4400/api/livres/${id}`);
      fetchLivres();
    } finally {
      setLoading(false);
    }
  };

  // Gestion Étudiants (CRUD simplifié)
  const handleEtudiantFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEtudiantForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEtudiantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editEtudiantId) {
        await axios.put(`http://localhost:4400/api/users/${editEtudiantId}`, etudiantForm);
      } else {
        await axios.post("http://localhost:4400/api/users", etudiantForm);
      }
      setShowEtudiantForm(false);
      setEtudiantForm({});
      setEditEtudiantId(null);
      fetchEtudiants();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement de l'étudiant.");
    } finally {
      setLoading(false);
    }
  };
  const handleEditEtudiant = (etudiant: Etudiant) => {
    setEtudiantForm(etudiant);
    setEditEtudiantId(etudiant.id);
    setShowEtudiantForm(true);
  };
  const handleDeleteEtudiant = async (id: number) => {
    if (!window.confirm("Supprimer cet étudiant ?")) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4400/api/users/${id}`);
      fetchEtudiants();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Tableau de bord Administrateur</h1>
      {/* Statistiques Emprunts */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="bg-blue-100 rounded-xl px-6 py-3 text-blue-800 font-semibold shadow">
          Livres empruntés : <span className="text-2xl">{empruntStats.totalEmpruntes}</span>
        </div>
        <div className="bg-red-100 rounded-xl px-6 py-3 text-red-800 font-semibold shadow">
          Livres en retard : <span className="text-2xl">{empruntStats.totalRetard}</span>
        </div>
        <div className="bg-green-100 rounded-xl px-6 py-3 text-green-800 font-semibold shadow">
          Emprunts actifs : <span className="text-2xl">{empruntStats.totalActifs}</span>
        </div>
      </div>
      <div className="mb-8 flex gap-4">
        <button className={`btn ${tab === 'livres' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('livres')}>Livres</button>
        <button className={`btn ${tab === 'etudiants' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('etudiants')}>Étudiants</button>
        <button className={`btn ${tab === 'emprunts' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('emprunts')}>Emprunts</button>
      </div>
      {/* Emprunts */}
      {tab === 'emprunts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Livres empruntés &amp; Emprunts</h2>
          </div>
          <table className="table w-full mb-6">
            <thead>
              <tr>
                <th>ID</th>
                <th>Livre</th>
                <th>Étudiant</th>
                <th>Date emprunt</th>
                <th>Date retour</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {emprunts.map((emprunt) => (
                <tr key={emprunt.id} className={emprunt.statut === 'en_retard' ? 'bg-red-50' : emprunt.statut === 'en_cours' ? 'bg-green-50' : ''}>
                  <td>{emprunt.id}</td>
                  <td>
                    <div className="font-semibold">{emprunt.livre_titre}</div>
                    <div className="text-xs text-gray-500">{emprunt.livre_auteur}</div>
                  </td>
                  <td>
                    <div className="font-semibold">{emprunt.etudiant_nom} {emprunt.etudiant_prenom}</div>
                    <div className="text-xs text-gray-500">{emprunt.etudiant_email}</div>
                  </td>
                  <td>{emprunt.date_emprunt ? new Date(emprunt.date_emprunt).toLocaleDateString() : '-'}</td>
                  <td>{emprunt.date_retour ? new Date(emprunt.date_retour).toLocaleDateString() : '-'}</td>
                  <td>
                    {emprunt.statut === 'en_retard' && <span className="badge badge-error">En retard</span>}
                    {emprunt.statut === 'en_cours' && <span className="badge badge-success">Actif</span>}
                    {emprunt.statut !== 'en_retard' && emprunt.statut !== 'en_cours' && <span className="badge">{emprunt.statut}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Livres */}
      {tab === 'livres' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestion des livres</h2>
            <button className="btn btn-success" onClick={() => { setShowLivreForm(true); setLivreForm({}); setEditLivreId(null); }}>+ Ajouter un livre</button>
          </div>
          <table className="table w-full mb-6">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Auteur</th>
                <th>Genre</th>
                <th>Image</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {livres.map((livre) => (
                <tr key={livre.id}>
                  <td>{livre.id}</td>
                  <td>{livre.titre}</td>
                  <td>{livre.auteur}</td>
                  <td>{livre.genre}</td>
                  <td>{livre.image ? (
                    <Image
                      src={livre.image.startsWith('/uploads/') ? `http://localhost:4400${livre.image}` : livre.image}
                      alt={livre.titre}
                      width={48}
                      height={64}
                      className="object-cover rounded"
                    />
                  ) : '-'}</td>
                  <td>{livre.statut}</td>
                  <td>
                    <button className="btn btn-xs btn-info mr-2" onClick={() => handleEditLivre(livre)}>Modifier</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDeleteLivre(livre.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Formulaire Livre en modal */}
          {showLivreForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
              {/* Overlay chic : flou + dégradé bleu/violet translucide */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-white/70 to-violet-200/60 backdrop-blur-[2px] pointer-events-none"></div>
              <form className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border-2 border-blue-200 animate-fade-in" onSubmit={handleLivreSubmit} encType="multipart/form-data">
                <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => { setShowLivreForm(false); setLivreForm({}); setEditLivreId(null); }} aria-label="Fermer">&times;</button>
                <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center drop-shadow">{editLivreId ? 'Modifier' : 'Ajouter'} un livre</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input name="titre" value={livreForm.titre || ''} onChange={handleLivreFormChange} placeholder="Titre" className="input input-bordered" required />
                  <input name="auteur" value={livreForm.auteur || ''} onChange={handleLivreFormChange} placeholder="Auteur" className="input input-bordered" required />
                  <input name="genre" value={livreForm.genre || ''} onChange={handleLivreFormChange} placeholder="Genre" className="input input-bordered" />
                  <input name="image" type="file" accept="image/*" onChange={handleLivreFormChange} className="file-input file-input-bordered" />
                </div>
                <div className="mt-6 flex gap-2 justify-center">
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement...' : 'Valider'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowLivreForm(false); setLivreForm({}); setEditLivreId(null); }}>Annuler</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Étudiants */}
      {tab === 'etudiants' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Gestion des étudiants</h2>
            <button className="btn btn-success" onClick={() => { setShowEtudiantForm(true); setEtudiantForm({}); setEditEtudiantId(null); }}>+ Ajouter un étudiant</button>
          </div>
          <table className="table w-full mb-6">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Sexe</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((etudiant) => (
                <tr key={etudiant.id}>
                  <td>{etudiant.id}</td>
                  <td>{etudiant.nom}</td>
                  <td>{etudiant.prenom}</td>
                  <td>{etudiant.email}</td>
                  <td>{etudiant.sexe || '-'}</td>
                  <td>{etudiant.telephone || '-'}</td>
                  <td>
                    <button className="btn btn-xs btn-info mr-2" onClick={() => handleEditEtudiant(etudiant)}>Modifier</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDeleteEtudiant(etudiant.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Formulaire Étudiant en modal */}
          {showEtudiantForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
              {/* Overlay chic : flou + dégradé bleu/violet translucide */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-white/70 to-violet-200/60 backdrop-blur-[2px] pointer-events-none"></div>
              <form className="bg-white/95 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border-2 border-blue-200 animate-fade-in" onSubmit={handleEtudiantSubmit}>
                <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => { setShowEtudiantForm(false); setEtudiantForm({}); setEditEtudiantId(null); }} aria-label="Fermer">&times;</button>
                <h3 className="text-2xl font-bold mb-6 text-blue-700 text-center drop-shadow">{editEtudiantId ? 'Modifier' : 'Ajouter'} un étudiant</h3>
                <div className="grid grid-cols-1 gap-4">
                  <input name="nom" value={etudiantForm.nom || ''} onChange={handleEtudiantFormChange} placeholder="Nom" className="input input-bordered" required />
                  <input name="prenom" value={etudiantForm.prenom || ''} onChange={handleEtudiantFormChange} placeholder="Prénom" className="input input-bordered" required />
                  <input name="email" value={etudiantForm.email || ''} onChange={handleEtudiantFormChange} placeholder="Email" className="input input-bordered" required />
                  <input name="telephone" value={etudiantForm.telephone || ''} onChange={handleEtudiantFormChange} placeholder="Téléphone" className="input input-bordered" />
                  <select name="sexe" value={etudiantForm.sexe || ''} onChange={handleEtudiantFormChange} className="input input-bordered">
                    <option value="">Sexe</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
                <div className="mt-6 flex gap-2 justify-center">
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement...' : 'Valider'}</button>
                  <button type="button" className="btn btn-ghost" onClick={() => { setShowEtudiantForm(false); setEtudiantForm({}); setEditEtudiantId(null); }}>Annuler</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
