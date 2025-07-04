"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

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
  // Notifications retards
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);
  // Notifier les retards (appel backend)
  const handleNotifierRetards = async () => {
    setNotifLoading(true);
    setNotifMessage(null);
    try {
      const res = await axios.post('http://localhost:4400/api/emprunts/notifier-retards');
      setNotifMessage(res.data?.message || 'Notifications envoyées avec succès.');
    } catch (err: any) {
      setNotifMessage(err.response?.data?.message || "Erreur lors de l'envoi des notifications.");
    } finally {
      setNotifLoading(false);
    }
  };
  // UI
  const [tab, setTab] = useState<'livres' | 'etudiants' | 'emprunts' | 'commentaires' | 'dashboard'>('dashboard');
  // Commentaires globaux (admin)
  const [commentairesLivres, setCommentairesLivres] = useState<{ [livreId: number]: any[] }>({});

  // Charger les commentaires pour tous les livres (pour l'admin)
  const fetchCommentairesLivres = async (livresList: Livre[]) => {
    const allCommentaires: { [livreId: number]: any[] } = {};
    await Promise.all(livresList.map(async (livre) => {
      try {
        const res = await axios.get(`http://localhost:4400/api/commentaires/livre/${livre.id}`);
        allCommentaires[livre.id] = res.data;
      } catch {
        allCommentaires[livre.id] = [];
      }
    }));
    setCommentairesLivres(allCommentaires);
  };
  const [loading, setLoading] = useState(false);

  // Charger les livres et étudiants
  useEffect(() => {
    fetchLivres();
    fetchEtudiants();
    fetchEmprunts();
    fetchStatsUsers();
  }, []);

  // Statistiques pour les courbes utilisateurs
  const [userStats, setUserStats] = useState<{ date: string; count: number }[]>([]);
  const fetchStatsUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4400/api/users/stats');
      setUserStats(res.data);
    } catch {
      setUserStats([]);
    }
  };

  // Charger les commentaires quand les livres changent
  useEffect(() => {
    if (livres.length > 0) {
      fetchCommentairesLivres(livres);
    }
  }, [livres]);

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
{/* Recherche de commentaire par livre */}
  const [searchLivre, setSearchLivre] = useState('');

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="w-full flex justify-end p-4">
        <a href="/Accueil" className="bg-blue-400 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all">Aller à la page d'accueil</a>
      </div>
      {/* Effets de fond décoratifs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10">
        <h1 className="text-5xl font-black mb-12 bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-900 bg-clip-text text-transparent text-center tracking-tight drop-shadow-sm">
          Tableau de bord Administrateur
        </h1>

        {/* Statistiques Emprunts */}
<div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Carte 1 */}
  <div className="group bg-gradient-to-br from-cyan-100 via-blue-100 to-cyan-200 rounded-2xl p-4 text-blue-900 shadow-md hover:shadow-cyan-300 transform hover:-translate-y-1 transition-all duration-300 border border-blue-200 backdrop-blur-sm w-52">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-white/50 rounded-xl">
        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xl font-bold group-hover:scale-105 transition-transform duration-300">{empruntStats.totalEmpruntes}</span>
        <span className="text-sm font-medium opacity-80 mt-1">Livres empruntés</span>
      </div>
    </div>
    <div className="w-full bg-cyan-200 rounded-full h-1 mt-2">
      <div className="bg-cyan-500 h-1 rounded-full w-3/4"></div>
    </div>
  </div>

  {/* Carte 2 */}
  <div className="group bg-gradient-to-br from-cyan-100 via-blue-100 to-cyan-200 rounded-2xl p-4 text-blue-900 shadow-md hover:shadow-cyan-300 transform hover:-translate-y-1 transition-all duration-300 border border-blue-200 backdrop-blur-sm w-52">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-white/50 rounded-xl">
        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xl font-bold group-hover:scale-105 transition-transform duration-300">{empruntStats.totalRetard}</span>
        <span className="text-sm font-medium opacity-80 mt-1">Livres en retard</span>
      </div>
    </div>
    <div className="w-full bg-cyan-200 rounded-full h-1 mt-2">
      <div className="bg-cyan-500 h-1 rounded-full w-2/4"></div>
    </div>
  </div>

  {/* Carte 3 */}
  <div className="group bg-gradient-to-br from-cyan-100 via-blue-100 to-cyan-200 rounded-2xl p-4 text-blue-900 shadow-md hover:shadow-cyan-300 transform hover:-translate-y-1 transition-all duration-300 border border-blue-200 backdrop-blur-sm w-52">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-white/50 rounded-xl">
        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xl font-bold group-hover:scale-105 transition-transform duration-300">{empruntStats.totalActifs}</span>
        <span className="text-sm font-medium opacity-80 mt-1">Emprunts actifs</span>
      </div>
    </div>
    <div className="w-full bg-cyan-200 rounded-full h-1 mt-2">
      <div className="bg-cyan-500 h-1 rounded-full w-4/5"></div>
    </div>
  </div>

  {/* Carte 4 */}
  <div className="group bg-gradient-to-br from-cyan-100 via-blue-100 to-cyan-200 rounded-2xl p-4 text-blue-900 shadow-md hover:shadow-cyan-300 transform hover:-translate-y-1 transition-all duration-300 border border-blue-200 backdrop-blur-sm w-52">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-white/50 rounded-xl">
        <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xl font-bold group-hover:scale-105 transition-transform duration-300">{etudiants.length > 0 ? etudiants.length : '...'}</span>
        <span className="text-sm font-medium opacity-80 mt-1">Étudiants inscrits</span>
      </div>
    </div>
    <div className="w-full bg-cyan-200 rounded-full h-1 mt-2">
      <div className="bg-cyan-500 h-1 rounded-full w-4/5"></div>
    </div>
  </div>
</div>


        {/* Navigation Tabs */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center p-2 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 max-w-4xl mx-auto">
          
          
          <button 
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
              tab === 'livres' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30' 
                : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
            }`} 
            onClick={() => setTab('livres')}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
              Livres
            </div>
          </button>
          <button 
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
              tab === 'etudiants' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30' 
                : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
            }`} 
            onClick={() => setTab('etudiants')}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5.783 14.077c.82-.131 1.692-.229 2.674-.14a6.01 6.01 0 001.084.086c.647-.146 1.348-.31 2.136-.421a3.26 3.26 0 00-.644 1.041 22.81 22.81 0 01-5.25.374c-.834-.126-1.653-.26-2.653-.372a1.451 1.451 0 01.653-.568z"/>
              </svg>
              Étudiants
            </div>
          </button>
          <button 
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
              tab === 'emprunts' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30' 
                : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
            }`} 
            onClick={() => setTab('emprunts')}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              Emprunts
            </div>
          </button>
          <button 
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
              tab === 'commentaires' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30' 
                : 'text-blue-700 hover:bg-blue-50 hover:shadow-md'
            }`} 
            onClick={() => setTab('commentaires')}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              Commentaires & Notes
            </div>
          </button>
        </div>

       

       {/* Commentaires & Notes */}
{tab === 'commentaires' && (
  <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/40">

    <h2 className="text-2xl font-bold mb-8 text-blue-800 flex items-center gap-3">
      <div className="p-2 bg-blue-100 rounded-lg">
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
        </svg>
      </div>
      Commentaires et notes des utilisateurs par livre
    </h2>

    {/* 🔍 Barre de recherche par titre */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="Rechercher un livre par son titre..."
        value={searchLivre}
        onChange={(e) => setSearchLivre(e.target.value)}
        className="w-full p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />
    </div>

    {livres.length === 0 && (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
        </svg>
        Aucun livre disponible.
      </div>
    )}

    {/* 🔎 Filtrage selon la recherche */}
    {livres
      .filter((livre) =>
        livre.titre.toLowerCase().includes(searchLivre.toLowerCase())
      )
      .map((livre) => (
        <div key={livre.id} className="mb-12 bg-white/90 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-blue-100">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-xl text-blue-800">{livre.titre}</div>
              <div className="text-blue-600 font-medium">par {livre.auteur}</div>
            </div>
          </div>

          {/* 📝 Table des commentaires */}
          {commentairesLivres[livre.id] && commentairesLivres[livre.id].length > 0 ? (
            <div className="overflow-hidden rounded-2xl shadow-lg border border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Commentaire</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Note</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {commentairesLivres[livre.id].map((com: any) => (
                    <tr key={com.id} className="hover:bg-blue-50/60 transition-colors duration-200">
                      <td className="px-6 py-4 font-bold text-blue-800">{com.utilisateur_nom || com.utilisateur_id}</td>
                      <td className="px-6 py-4 text-gray-700">{com.commentaire}</td>
                      <td className="px-6 py-4">
                        {com.note ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-blue-700">{com.note}/5</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < com.note ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className='text-gray-400 italic'>Pas de note</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {com.date_commentaire ? new Date(com.date_commentaire).toLocaleDateString() : <span className='text-gray-400 italic'>Date inconnue</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="italic">Aucun commentaire pour ce livre.</span>
            </div>
          )}
        </div>
      ))}
  </div>
)}


        {/* Emprunts */}
        {tab === 'emprunts' && (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/40">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                Livres empruntés &amp; Emprunts
              </h2>
              <button
                className={`bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 ${notifLoading ? 'opacity-60 pointer-events-none' : ''}`}
                onClick={handleNotifierRetards}
                disabled={notifLoading}
              >
                {notifLoading ? (
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                )}
                Notifier les retards
              </button>
            </div>
            {notifMessage && (
              <div className={`mb-6 p-4 rounded-xl font-semibold shadow-lg ${notifMessage.startsWith('Erreur') ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200' : 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200'}`}>
                <div className="flex items-center gap-3">
                  {notifMessage.startsWith('Erreur') ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                  {notifMessage}
                </div>
              </div>
            )}
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Livre</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Étudiant</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Date emprunt</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Date retour</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {emprunts.map((emprunt) => (
                    <tr key={emprunt.id} className={`transition-colors duration-200 ${
                      emprunt.statut === 'en_retard' 
                        ? 'bg-gradient-to-r from-red-50 to-red-100/60 hover:from-red-100 hover:to-red-150' 
                        : emprunt.statut === 'en_cours' 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-100/60 hover:from-green-100 hover:to-emerald-150' 
                        : 'hover:bg-blue-50/60'
                    }`}>
                      <td className="px-6 py-4 font-bold text-blue-900">#{emprunt.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-800">{emprunt.livre_titre}</div>
                        <div className="text-sm text-blue-600">{emprunt.livre_auteur}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-blue-800">{emprunt.etudiant_nom} {emprunt.etudiant_prenom}</div>
                        <div className="text-sm text-blue-600">{emprunt.etudiant_email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{emprunt.date_emprunt ? new Date(emprunt.date_emprunt).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{emprunt.date_retour ? new Date(emprunt.date_retour).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4">
                        {emprunt.statut === 'en_retard' && (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            En retard
                          </span>
                        )}
                        {emprunt.statut === 'en_cours' && (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Actif
                          </span>
                        )}
                        {emprunt.statut !== 'en_retard' && emprunt.statut !== 'en_cours' && (
                          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                            {emprunt.statut}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Livres */}
        {tab === 'livres' && (
          <>
            {showLivreForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
                <form onSubmit={handleLivreSubmit} className="w-full max-w-md p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 border-2 border-blue-200 rounded-3xl shadow-2xl flex flex-col gap-5 animate-fade-in">
                  <h3 className="text-2xl font-extrabold text-blue-800 mb-2 text-center tracking-tight">{editLivreId ? 'Modifier le livre' : 'Ajouter un livre'}</h3>
                  <input name="titre" value={livreForm.titre || ''} onChange={handleLivreFormChange} placeholder="Titre" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
                  <input name="auteur" value={livreForm.auteur || ''} onChange={handleLivreFormChange} placeholder="Auteur" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
                  <input name="genre" value={livreForm.genre || ''} onChange={handleLivreFormChange} placeholder="Genre" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
                  <input name="statut" value={livreForm.statut || ''} onChange={handleLivreFormChange} placeholder="Statut" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
                  <input name="image" type="file" accept="image/*" onChange={handleLivreFormChange} className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
                  <div className="flex gap-4 justify-end mt-2">
                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-bold shadow transition-all">{editLivreId ? 'Modifier' : 'Ajouter'}</button>
                    <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold shadow transition-all" onClick={() => setShowLivreForm(false)}>Annuler</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/40">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                  </div>
                  Gestion des livres
                </h2>
                <button 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3" 
                  onClick={() => { setShowLivreForm(true); setLivreForm({}); setEditLivreId(null); }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Ajouter un livre
                </button>
              </div>
              <div className="overflow-hidden rounded-2xl shadow-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Auteur</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Genre</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {livres.map((livre) => (
                      <tr key={livre.id} className="hover:bg-blue-50/60 transition-colors duration-200">
                        <td className="px-6 py-4 font-bold text-blue-900">#{livre.id}</td>
                        <td className="px-6 py-4 font-bold text-blue-800">{livre.titre}</td>
                        <td className="px-6 py-4 text-blue-700">{livre.auteur}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {livre.genre}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {livre.image ? (
                            <div className="relative group">
                              <Image
                                src={livre.image.startsWith('/uploads/') ? `http://localhost:4400${livre.image}` : livre.image}
                                alt={livre.titre}
                                width={56}
                                height={80}
                                className="object-cover rounded-lg shadow-lg border-2 border-blue-200 group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          ) : (
                            <div className="w-14 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            livre.statut === 'disponible' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {livre.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5" 
                              onClick={() => handleEditLivre(livre)}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                              </svg>
                            </button>
                            <button 
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-0.5" 
                              onClick={() => handleDeleteLivre(livre.id)}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3l5.25 5.25a.75.75 0 01-1.06 1.06L10 10.06 4.81 15.25a.75.75 0 01-1.06-1.06L9 9.06V6a1 1 0 011-1z" clipRule="evenodd"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Étudiants */}
        {tab === 'etudiants' && (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/40">
            {showEtudiantForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
                <form onSubmit={handleEtudiantSubmit} className="w-full max-w-md p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 border-2 border-blue-200 rounded-3xl shadow-2xl flex flex-col gap-5 animate-fade-in">
                  <h3 className="text-2xl font-extrabold text-blue-800 mb-2 text-center tracking-tight">{editEtudiantId ? 'Modifier l\'étudiant' : 'Ajouter un étudiant'}</h3>
                  <input name="nom" value={etudiantForm.nom || ''} onChange={handleEtudiantFormChange} placeholder="Nom" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
                  <input name="prenom" value={etudiantForm.prenom || ''} onChange={handleEtudiantFormChange} placeholder="Prénom" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
                  <input name="email" value={etudiantForm.email || ''} onChange={handleEtudiantFormChange} placeholder="Email" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" type="email" required />
                  <input name="telephone" value={etudiantForm.telephone || ''} onChange={handleEtudiantFormChange} placeholder="Téléphone" className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
                  <select name="sexe" value={etudiantForm.sexe || ''} onChange={handleEtudiantFormChange} className="border-2 border-blue-200 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg">
                    <option value="">Sexe</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                  <div className="flex gap-4 justify-end mt-2">
                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-bold shadow transition-all">{editEtudiantId ? 'Modifier' : 'Ajouter'}</button>
                    <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold shadow transition-all" onClick={() => setShowEtudiantForm(false)}>Annuler</button>
                  </div>
                </form>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM5.783 14.077c.82-.131 1.692-.229 2.674-.14a6.01 6.01 0 001.084.086c.647-.146 1.348-.31 2.136-.421a3.26 3.26 0 00-.644 1.041 22.81 22.81 0 01-5.25.374c-.834-.126-1.653-.26-2.653-.372a1.451 1.451 0 01.653-.568z"/>
                  </svg>
                </div>
                Gestion des étudiants
              </h2>
              <button 
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3" 
                onClick={() => { setShowEtudiantForm(true); setEtudiantForm({}); setEditEtudiantId(null); }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Ajouter un étudiant
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Prénom</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Sexe</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {etudiants.map((etudiant) => (
                    <tr key={etudiant.id} className="hover:bg-blue-50/60 transition-colors duration-200">
                      <td className="px-6 py-4 font-bold text-blue-900">#{etudiant.id}</td>
                      <td className="px-6 py-4 font-bold text-blue-800">{etudiant.nom}</td>
                      <td className="px-6 py-4 text-blue-700">{etudiant.prenom}</td>
                      <td className="px-6 py-4 text-gray-700">{etudiant.email}</td>
                      <td className="px-6 py-4">
                        {etudiant.sexe ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            etudiant.sexe === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {etudiant.sexe}
                          </span>
                        ) : (
                          <span className='text-gray-400 italic'>Non spécifié</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{etudiant.telephone || <span className='text-gray-400 italic'>Non renseigné</span>}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5" 
                            onClick={() => handleEditEtudiant(etudiant)}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                          </button>
                          <button 
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-0.5" 
                            onClick={() => handleDeleteEtudiant(etudiant.id)}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3l5.25 5.25a.75.75 0 01-1.06 1.06L10 10.06 4.81 15.25a.75.75 0 01-1.06-1.06L9 9.06V6a1 1 0 011-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
