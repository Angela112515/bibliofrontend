"use client"
import React, { useEffect, useState } from 'react'

import Image from 'next/image';

const Page = () => {
  const [user, setUser] = useState<{ nom: string; email: string; image?: string; id?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<{ nom: string; email: string; imageFile?: File | null }>({ nom: '', email: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [emprunts, setEmprunts] = useState<any[]>([]);

  // Décoder le token JWT pour obtenir l'id utilisateur
  function parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        // Vérifie la présence du token dans localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          setError('Token manquant. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        // Récupère les infos utilisateur connecté via /api/users/me
        const response = await fetch('http://localhost:4400/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const userData = await response.json();
        if (!userData || !userData.nom || !userData.email) {
          setError('Réponse utilisateur invalide');
          setUser(null);
        } else {
          setUser(userData);
          // Charger les emprunts de l'utilisateur
          try {
            const empruntRes = await fetch('http://localhost:4400/api/emprunts/mes', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (empruntRes.ok) {
              const userEmprunts = await empruntRes.json();
              setEmprunts(Array.isArray(userEmprunts) ? userEmprunts : []);
            } else {
              setEmprunts([]);
            }
          } catch {
            setEmprunts([]);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Erreur lors de la récupération des données');
          console.error('Erreur API:', err.message);
        } else {
          setError('Erreur lors de la récupération des données');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-700 text-lg">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 text-center border border-gray-200 shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-gray-800 text-xl font-semibold mb-2">Accès refusé</h2>
          <p className="text-gray-600">{error || 'Utilisateur non connecté'}</p>
        </div>
      </div>
    );
  }

  // Déconnexion : supprime le token et recharge la page
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.image ? (
                  <Image
                    src={user.image.startsWith('/uploads/') ? `http://localhost:4400${user.image}` : user.image}
                    alt={user.nom}
                    width={96}
                    height={96}
                    className="rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
                    {user.nom.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Bienvenue, {user.nom} !
                </h1>
                <p className="text-purple-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm border border-green-200">
                    ✓ Connecté
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200">
                    📚 Lecteur
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 items-center">
                <button
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 border border-gray-200"
                  onClick={() => {
                    setEditForm({ nom: user.nom, email: user.email });
                    setShowEdit(true);
                  }}
                >
                  Modifier le profil
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 mt-2"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal édition profil */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <form
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border-2 border-purple-200"
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  if (!token) throw new Error('Non authentifié');
                  const formData = new FormData();
                  formData.append('nom', editForm.nom);
                  formData.append('email', editForm.email);
                  if (editForm.imageFile) formData.append('image', editForm.imageFile);
                  const res = await fetch('http://localhost:4400/api/users/me', {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                  });
                  if (!res.ok) throw new Error('Erreur lors de la modification');
                  const updated = await res.json();
                  setUser((u) => u ? { ...u, nom: updated.nom, email: updated.email, image: updated.image } : u);
                  setShowEdit(false);
                } catch (err) {
                  alert('Erreur lors de la modification du profil');
                } finally {
                  setEditLoading(false);
                }
              }}
              encType="multipart/form-data"
            >
              <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowEdit(false)} aria-label="Fermer">&times;</button>
              <h3 className="text-2xl font-bold mb-6 text-purple-700 text-center">Modifier le profil</h3>
              <div className="grid grid-cols-1 gap-4">
                <input
                  name="nom"
                  value={editForm.nom}
                  onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
                  placeholder="Nom complet"
                  className="input input-bordered"
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Adresse email"
                  className="input input-bordered"
                  required
                />
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={e => setEditForm(f => ({ ...f, imageFile: e.target.files?.[0] }))}
                  className="file-input file-input-bordered"
                />
              </div>
              <div className="mt-6 flex gap-2 justify-center">
                <button type="submit" className="btn btn-primary" disabled={editLoading}>{editLoading ? 'Enregistrement...' : 'Valider'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEdit(false)}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-2 border border-gray-200 shadow-lg">
            <div className="flex gap-2">
              {[
                { id: 'profile', label: 'Profil', icon: '👤' },
                { id: 'books', label: 'Mes Emprunts', icon: '📚' },
                { id: 'favorites', label: 'Retour de livres', icon: '↩️' },
                { id: 'stats', label: 'Statistiques', icon: '📊' },
                { id: 'settings', label: 'Commentaires', icon: '💬 ' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 shadow-xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations du profil</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <label className="text-purple-600 text-sm font-medium">Nom complet</label>
                      <p className="text-gray-800 text-lg font-medium">{user.nom}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <label className="text-purple-600 text-sm font-medium">Adresse email</label>
                      <p className="text-gray-800 text-lg font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <label className="text-purple-600 text-sm font-medium">Date d'inscription</label>
                      <p className="text-gray-800 text-lg font-medium">Janvier 2025</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <label className="text-purple-600 text-sm font-medium">Statut du compte</label>
                      <p className="text-green-600 text-lg font-medium">Actif</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'books' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes emprunts</h2>
                {emprunts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Aucun emprunt en cours.</div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emprunts.map((emprunt) => (
                      <div key={emprunt.id_emprunt || emprunt.id || emprunt._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-all duration-300 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          {emprunt.livre_image ? (
                            <Image
                              src={emprunt.livre_image.startsWith('/uploads/') ? `http://localhost:4400${emprunt.livre_image}` : emprunt.livre_image}
                              alt={emprunt.titre_livre || 'Livre'}
                              width={56}
                              height={80}
                              className="rounded shadow"
                            />
                          ) : (
                            <div className="w-14 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-white font-bold">
                              📚
                            </div>
                          )}
                          <div>
                            <h3 className="text-gray-800 font-semibold">{emprunt.titre_livre || emprunt.titre || 'Livre inconnu'}</h3>
                            <p className="text-gray-600 text-sm">Auteur : {emprunt.auteur_livre || emprunt.auteur || 'Inconnu'}</p>
                          </div>
                        </div>
                        <div className="flex-1" />
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-sm text-gray-500">Date d'emprunt : {emprunt.date_emprunt ? new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                          <span className="text-sm text-gray-500">Date de retour : {emprunt.date_retour ? new Date(emprunt.date_retour).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                          <span className={`text-xs font-semibold ${emprunt.statut === 'retourné' ? 'text-green-600' : 'text-orange-500'}`}>Statut : {emprunt.statut || 'En cours'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Retour de livres</h2>
                {emprunts.filter(e => e.statut !== 'retourné').length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Aucun livre à retourner.</div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emprunts.filter(e => e.statut !== 'retourné').map((emprunt) => (
                      <div key={emprunt.id_emprunt || emprunt.id || emprunt._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          {emprunt.livre_image ? (
                            <Image
                              src={emprunt.livre_image.startsWith('/uploads/') ? `http://localhost:4400${emprunt.livre_image}` : emprunt.livre_image}
                              alt={emprunt.titre_livre || 'Livre'}
                              width={56}
                              height={80}
                              className="rounded shadow"
                            />
                          ) : (
                            <div className="w-14 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-white font-bold">
                              📚
                            </div>
                          )}
                          <div>
                            <h3 className="text-gray-800 font-semibold">{emprunt.titre_livre || emprunt.titre || 'Livre inconnu'}</h3>
                            <p className="text-gray-600 text-sm">Auteur : {emprunt.auteur_livre || emprunt.auteur || 'Inconnu'}</p>
                          </div>
                        </div>
                        <div className="flex-1" />
                        <div className="flex flex-col gap-1 mt-2">
                          <span className="text-sm text-gray-500">Date d'emprunt : {emprunt.date_emprunt ? new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                          <span className="text-sm text-gray-500">Date de retour prévue : {emprunt.date_retour ? new Date(emprunt.date_retour).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                          <span className={`text-xs font-semibold ${emprunt.statut === 'retourné' ? 'text-green-600' : 'text-orange-500'}`}>Statut : {emprunt.statut || 'En cours'}</span>
                        </div>
                        <button
                          className="btn btn-success mt-4"
                          onClick={async () => {
                            if (!window.confirm('Confirmer le retour de ce livre ?')) return;
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) throw new Error('Non authentifié');
                              const res = await fetch(`http://localhost:4400/api/emprunts/retour/${emprunt.id_emprunt || emprunt.id || emprunt._id}`,
                                { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
                              if (!res.ok) throw new Error('Erreur lors du retour du livre');
                              // Met à jour le statut localement
                              setEmprunts((prev) => prev.map(e => (e.id_emprunt || e.id || e._id) === (emprunt.id_emprunt || emprunt.id || emprunt._id) ? { ...e, statut: 'retourné' } : e));
                            } catch (err) {
                              alert('Erreur lors du retour du livre');
                            }
                          }}
                          disabled={emprunt.statut === 'retourné'}
                        >
                          Rendre ce livre
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistiques de lecture</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center shadow-sm">
                    <div className="text-3xl mb-2">📖</div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{emprunts.length}</div>
                    <div className="text-purple-600">Livres lus</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Commentaires et notation des livres lus</h2>
                {emprunts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Aucun livre lu pour le moment.</div>
                ) : (
                  <div className="space-y-4">
                    {emprunts.filter(e => e.statut === 'retourné').length === 0 ? (
                      <div className="text-center text-gray-500 py-8">Aucun livre retourné pour le moment.</div>
                    ) : (
                      emprunts.filter(e => e.statut === 'retourné').map((emprunt) => (
                        <CommentaireForm key={emprunt.id_emprunt || emprunt.id || emprunt._id} emprunt={emprunt} user={user} />
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulaire de commentaire pour un livre lu
function CommentaireForm({ emprunt, user }: { emprunt: any, user: any }) {
  const [commentaire, setCommentaire] = React.useState('');
  const [note, setNote] = React.useState<number|null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string|null>(null);
  const [commentaires, setCommentaires] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch(`http://localhost:4400/api/commentaires/livre/${emprunt.livre_id || emprunt.id_livre || emprunt.livre?.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCommentaires(Array.isArray(data) ? data : []));
  }, [emprunt.livre_id, emprunt.id_livre, emprunt.livre?.id, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non authentifié');
      // Debug: afficher les valeurs envoyées
      console.log('DEBUG emprunt:', emprunt);
      const livreId = emprunt.livre_id || emprunt.id_livre || emprunt.livre?.id;
      console.log('Envoi commentaire:', { livreId, commentaire, note });
      const body: any = {
        livre_id: livreId,
        commentaire
      };
      if (note !== null) body.note = note;
      const res = await fetch('http://localhost:4400/api/commentaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        let errorMsg = 'Erreur lors de l\'envoi du commentaire';
        try {
          const errData = await res.json();
          if (errData && errData.message) errorMsg = errData.message;
        } catch {}
        throw new Error(errorMsg);
      }
      setSuccess(true);
      setCommentaire('');
      setNote(null);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex items-center gap-3 w-48">
        {emprunt.livre_image ? (
          <Image
            src={emprunt.livre_image.startsWith('/uploads/') ? `http://localhost:4400${emprunt.livre_image}` : emprunt.livre_image}
            alt={emprunt.titre_livre || 'Livre'}
            width={48}
            height={68}
            className="rounded shadow"
          />
        ) : (
          <div className="w-12 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded flex items-center justify-center text-white font-bold">
            📚
          </div>
        )}
        <div>
          <h3 className="text-gray-800 font-semibold text-base">{emprunt.titre_livre || emprunt.titre || 'Livre inconnu'}</h3>
          <p className="text-gray-600 text-xs">Auteur : {emprunt.auteur_livre || emprunt.auteur || 'Inconnu'}</p>
        </div>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <form className="flex flex-col md:flex-row gap-2 items-center" onSubmit={handleSubmit}>
          <textarea
            className="input input-bordered w-full md:w-64 resize-none text-sm"
            placeholder="Votre commentaire..."
            rows={2}
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            required
          />
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(star => (
              <button
                type="button"
                key={star}
                className={`text-xl ${note !== null && star <= note ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => setNote(star)}
                tabIndex={-1}
                aria-label={`Attribuer la note ${star}`}
              >★</button>
            ))}
            {note !== null && (
              <button type="button" className="ml-2 text-xs text-gray-400 underline" onClick={() => setNote(null)}>
                Annuler la note
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
        </form>
        {success && <div className="text-green-600 text-xs mt-1">Commentaire envoyé !</div>}
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        <div className="mt-2">
          {commentaires.length > 0 && <div className="text-xs text-gray-500 mb-1">Commentaires précédents :</div>}
          {commentaires.map((c) => (
            <div key={c.id} className="bg-white rounded p-2 mb-1 border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-purple-700">{c.utilisateur_nom || 'Utilisateur'}</span>
                <span className="text-yellow-400 text-xs">{'★'.repeat(c.note)}</span>
                <span className="text-gray-400 text-xs">{new Date(c.date_commentaire).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="text-xs text-gray-700 mt-1">{c.commentaire}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;