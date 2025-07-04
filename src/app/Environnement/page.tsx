"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// ...existing code...

const Page = () => {
  const [user, setUser] = useState<{ nom?: string; prenom?: string; email: string; image?: string; id?: number } | null>(null);
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
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          setError('Token manquant. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }


        // Essayer d'appeler l'API réelle
        let userData = null;
        let apiOk = false;
        try {
          const response = await fetch('http://localhost:4400/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const apiUser = await response.json();
            // Correction : toujours garder nom/prenom/email même si vide
            userData = {
              nom: apiUser.nom || '',
              prenom: apiUser.prenom || '',
              email: apiUser.email || '',
              id: apiUser.id,
              image: apiUser.image || ''
            };
            apiOk = true;
          }
        } catch {}

        // Si l'API ne répond pas, décoder le token côté client (mode démo)
        if (!apiOk) {
          try {
            const payload = token.split('.')[1];
            // Corrige le padding base64 si besoin
            const pad = payload.length % 4;
            const payloadFixed = pad ? payload + '='.repeat(4 - pad) : payload;
            const decoded = JSON.parse(atob(payloadFixed));
            // Fallback nom/email uniquement en mode démo
            let nom = decoded.nom;
            if (!nom || nom === '') {
              if (decoded.email && typeof decoded.email === 'string') {
                nom = decoded.email.split('@')[0];
              } else {
                nom = 'Utilisateur';
              }
            }
            userData = {
              nom,
              email: decoded.email || '',
              id: decoded.id || '',
              image: decoded.image || '',
            };
            // Simuler des emprunts pour l'utilisateur mocké
            setEmprunts([
              {
                id: 1,
                titre: 'Le Petit Prince',
                auteur: 'Antoine de Saint-Exupéry',
                date_emprunt: '2025-06-01',
                date_retour: '2025-07-01',
                statut: 'En cours'
              },
              {
                id: 2,
                titre: "L'Étranger",
                auteur: 'Albert Camus',
                date_emprunt: '2025-05-15',
                date_retour: '2025-06-15',
                statut: 'Rendu'
              }
            ]);
          } catch (e) {
            setError('Token invalide. Veuillez vous reconnecter.');
            setUser(null);
            setLoading(false);
            return;
          }
        }

        if (!userData || !userData.nom || !userData.email) {
          setError('Réponse utilisateur invalide');
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (err) {
        setError('Erreur lors de la récupération des données');
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
                  Bienvenue, {(user.prenom && user.prenom.trim() ? user.prenom + ' ' : '')}{(user.nom && user.nom.trim()) ? user.nom : (user.email ? user.email.split('@')[0] : 'Utilisateur')} !
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
  <div className="space-y-8 animate-fade-in">
    {/* En-tête avec statistiques */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          📚 Mes emprunts
        </h2>
        <p className="text-gray-600">Gérez vos livres empruntés en un coup d'œil</p>
      </div>
      
      {emprunts.length > 0 && (
        <div className="flex gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
            <div className="text-lg font-bold">{emprunts.length}</div>
            <div className="text-xs opacity-90">Total</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md">
            <div className="text-lg font-bold">{emprunts.filter(e => e.statut === 'retourné').length}</div>
            <div className="text-xs opacity-90">Retournés</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-md">
            <div className="text-lg font-bold">{emprunts.filter(e => e.statut !== 'retourné').length}</div>
            <div className="text-xs opacity-90">En cours</div>
          </div>
        </div>
      )}
    </div>

    {emprunts.length === 0 ? (
      /* État vide amélioré */
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun emprunt en cours</h3>
        <p className="text-gray-500 mb-6 max-w-md">Vous n'avez pas encore emprunté de livres. Explorez notre catalogue pour découvrir de nouveaux ouvrages !</p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Explorer le catalogue
        </button>
      </div>
    ) : (
      /* Grille des emprunts */
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {emprunts.map((emprunt, index) => {
          const isOverdue = emprunt.date_retour && new Date(emprunt.date_retour) < new Date() && emprunt.statut !== 'retourné';
          const daysUntilReturn = emprunt.date_retour ? Math.ceil((new Date(emprunt.date_retour) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
          
          return (
            <div 
              key={emprunt.id_emprunt || emprunt.id || emprunt._id} 
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Indicateur de statut animé */}
              <div className={`absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full ${
                emprunt.statut === 'retourné' 
                  ? 'bg-gradient-to-br from-green-400 to-green-500' 
                  : isOverdue 
                    ? 'bg-gradient-to-br from-red-400 to-red-500 animate-pulse' 
                    : 'bg-gradient-to-br from-orange-400 to-orange-500'
              } opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>

              {/* En-tête avec image et détails du livre */}
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="relative">
                  {emprunt.livre_image ? (
                    <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={emprunt.livre_image.startsWith('/uploads/') ? `http://localhost:4400${emprunt.livre_image}` : emprunt.livre_image}
                        alt={emprunt.titre_livre || 'Livre'}
                        width={64}
                        height={90}
                        className="rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                  ) : (
                    <div className="w-16 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">
                      📚
                    </div>
                  )}
                  
                  {/* Badge de statut */}
                  <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                    emprunt.statut === 'retourné' 
                      ? 'bg-green-500' 
                      : isOverdue 
                        ? 'bg-red-500 animate-bounce' 
                        : 'bg-orange-500'
                  }`}>
                    {emprunt.statut === 'retourné' ? '✓' : isOverdue ? '⚠' : '⏰'}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-800 font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {emprunt.titre_livre || emprunt.titre || 'Livre inconnu'}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="truncate">{emprunt.auteur_livre || emprunt.auteur || 'Inconnu'}</span>
                  </p>
</div>
              </div>

              {/* Informations de dates avec icônes */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-600">Emprunté le :</span>
                  <span className="font-medium text-gray-800">
                    {emprunt.date_emprunt ? new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <svg className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-600">Retour prévu :</span>
                  <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                    {emprunt.date_retour ? new Date(emprunt.date_retour).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'short',
                      year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>

                {/* Alerte pour les retards */}
                {isOverdue && emprunt.statut !== 'retourné' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span className="text-red-700 text-xs font-medium">
                      Retard de {Math.abs(daysUntilReturn)} jour{Math.abs(daysUntilReturn) > 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Temps restant pour les emprunts en cours */}
                {!isOverdue && emprunt.statut !== 'retourné' && daysUntilReturn > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-blue-700 text-xs font-medium">
                      {daysUntilReturn} jour{daysUntilReturn > 1 ? 's' : ''} restant{daysUntilReturn > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Badge de statut en bas */}
              <div className="mt-4 flex justify-between items-center relative z-10">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${
                  emprunt.statut === 'retourné' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : isOverdue
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    emprunt.statut === 'retourné' 
                      ? 'bg-green-500' 
                      : isOverdue
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-orange-500'
                  }`}></div>
                  {emprunt.statut === 'retourné' ? 'Retourné' : isOverdue ? 'En retard' : 'En cours'}
                </div>

                {/* Bouton d'action contextuel */}
                {emprunt.statut !== 'retourné' && (
                  <button className="text-blue-500 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200">
                    {isOverdue ? 'Renouveler' : 'Prolonger'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
  <div className="space-y-8 animate-fade-in">
    {/* En-tête avec période */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          📊 Statistiques de lecture
        </h2>
        <p className="text-gray-600">Découvrez vos habitudes de lecture en détail</p>
      </div>
      
      {/* Sélecteur de période */}
      <div className="flex bg-white rounded-xl p-1 shadow-md border border-gray-200">
        {['7 jours', '30 jours', 'Cette année', 'Tout'].map((period, index) => (
          <button
            key={period}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              index === 2 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>

    {/* Métriques principales */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total des livres */}
      <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📚</div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 animate-pulse">{emprunts.length}</div>
          <div className="text-blue-100 text-sm">Livres empruntés</div>
          <div className="text-xs text-blue-200 mt-2">+12% ce mois</div>
        </div>
      </div>

      {/* Livres terminés */}
      <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">✅</div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{emprunts.filter(e => e.statut === 'retourné').length}</div>
          <div className="text-green-100 text-sm">Livres terminés</div>
          <div className="text-xs text-green-200 mt-2">
            {emprunts.length > 0 ? Math.round((emprunts.filter(e => e.statut === 'retourné').length / emprunts.length) * 100) : 0}% complétés
          </div>
        </div>
      </div>

      {/* En cours de lecture */}
      <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📖</div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{emprunts.filter(e => e.statut !== 'retourné').length}</div>
          <div className="text-orange-100 text-sm">En cours</div>
          <div className="text-xs text-orange-200 mt-2">Lectures actives</div>
        </div>
      </div>

      {/* Moyenne mensuelle */}
      <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">📈</div>
            <div className="bg-white bg-opacity-20 rounded-lg p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{Math.max(1, Math.round(emprunts.length / 3))}</div>
          <div className="text-purple-100 text-sm">Par mois</div>
          <div className="text-xs text-purple-200 mt-2">Moyenne estimée</div>
        </div>
      </div>
    </div>

    {/* Graphiques et analyses */}
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Progression mensuelle */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Progression mensuelle</h3>
          <div className="text-2xl">📊</div>
        </div>
        
        {/* Graphique en barres simulé */}
        <div className="space-y-4">
          {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'].map((month, index) => {
            const value = Math.floor(Math.random() * emprunts.length) + 1;
            const percentage = emprunts.length > 0 ? (value / emprunts.length) * 100 : 0;
            
            return (
              <div key={month} className="flex items-center gap-4">
                <div className="w-8 text-sm text-gray-600 font-medium">{month}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${Math.max(5, percentage)}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
                <div className="w-8 text-sm text-gray-800 font-bold text-right">{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Répartition par statut */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Répartition des lectures</h3>
          <div className="text-2xl">🎯</div>
        </div>
        
        {/* Graphique circulaire simulé */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="45"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              <circle
                cx="60" cy="60" r="45"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="10"
                strokeDasharray={`${(emprunts.filter(e => e.statut === 'retourné').length / Math.max(emprunts.length, 1)) * 283} 283`}
                className="transition-all duration-1000"
              />
              <circle
                cx="60" cy="60" r="35"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="10"
                strokeDasharray={`${(emprunts.filter(e => e.statut !== 'retourné').length / Math.max(emprunts.length, 1)) * 220} 220`}
                className="transition-all duration-1000"
                strokeDashoffset="-70"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{emprunts.length}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Légende */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              <span className="text-sm text-gray-700">Terminés</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{emprunts.filter(e => e.statut === 'retourné').length}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
              <span className="text-sm text-gray-700">En cours</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{emprunts.filter(e => e.statut !== 'retourné').length}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Objectifs et badges */}
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-3xl">🏆</div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Objectifs et récompenses</h3>
          <p className="text-gray-600 text-sm">Continuez à lire pour débloquer des badges !</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Badge Lecteur débutant */}
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
          emprunts.length >= 1 
            ? 'bg-yellow-50 border-yellow-200 shadow-md' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-3xl ${emprunts.length >= 1 ? 'animate-bounce' : 'opacity-50'}`}>
            🥉
          </div>
          <div>
            <div className={`font-bold ${emprunts.length >= 1 ? 'text-yellow-700' : 'text-gray-500'}`}>
              Lecteur débutant
            </div>
            <div className="text-sm text-gray-600">Premier livre emprunté</div>
            {emprunts.length >= 1 && <div className="text-xs text-yellow-600 font-medium">Débloqué ! 🎉</div>}
          </div>
        </div>

        {/* Badge Lecteur assidu */}
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
          emprunts.length >= 5 
            ? 'bg-blue-50 border-blue-200 shadow-md' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-3xl ${emprunts.length >= 5 ? 'animate-bounce' : 'opacity-50'}`}>
            🥈
          </div>
          <div>
            <div className={`font-bold ${emprunts.length >= 5 ? 'text-blue-700' : 'text-gray-500'}`}>
              Lecteur assidu
            </div>
            <div className="text-sm text-gray-600">5 livres empruntés</div>
            {emprunts.length >= 5 ? (
              <div className="text-xs text-blue-600 font-medium">Débloqué ! 🎉</div>
            ) : (
              <div className="text-xs text-gray-500">Progrès : {emprunts.length}/5</div>
            )}
          </div>
        </div>

        {/* Badge Bibliophile */}
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
          emprunts.length >= 10 
            ? 'bg-purple-50 border-purple-200 shadow-md' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-3xl ${emprunts.length >= 10 ? 'animate-bounce' : 'opacity-50'}`}>
            🥇
          </div>
          <div>
            <div className={`font-bold ${emprunts.length >= 10 ? 'text-purple-700' : 'text-gray-500'}`}>
              Bibliophile
            </div>
            <div className="text-sm text-gray-600">10 livres empruntés</div>
            {emprunts.length >= 10 ? (
              <div className="text-xs text-purple-600 font-medium">Débloqué ! 🎉</div>
            ) : (
              <div className="text-xs text-gray-500">Progrès : {emprunts.length}/10</div>
            )}
          </div>
        </div>
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
  <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-6 items-start group hover:scale-[1.02] backdrop-blur-sm">
    {/* Section livre avec animation */}
    <div className="flex items-center gap-4 w-full md:w-80 group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
      <div className="relative">
        {emprunt.livre_image ? (
          <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <Image
              src={emprunt.livre_image.startsWith('/uploads/') ? `http://localhost:4400${emprunt.livre_image}` : emprunt.livre_image}
              alt={emprunt.titre_livre || 'Livre'}
              width={56}
              height={80}
              className="rounded-lg transform hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </div>
        ) : (
          <div className="w-14 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:rotate-3 hover:scale-110">
            📚
          </div>
        )}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-gray-800 font-bold text-lg mb-1 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
          {emprunt.titre_livre || emprunt.titre || 'Livre inconnu'}
        </h3>
        <p className="text-gray-600 text-sm flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Auteur : {emprunt.auteur_livre || emprunt.auteur || 'Inconnu'}
        </p>
      </div>
    </div>

    {/* Section commentaire avec animations */}
    <div className="flex-1 w-full space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Zone de commentaire améliorée */}
        <div className="relative">
          <textarea
            className="w-full p-4 border-2 border-blue-200 rounded-xl resize-none text-sm placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white focus:bg-white shadow-sm hover:shadow-md"
            placeholder="Partagez votre avis sur ce livre... ✨"
            rows={3}
            value={commentaire}
            onChange={e => setCommentaire(e.target.value)}
            required
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {commentaire.length}/500
          </div>
        </div>

        {/* Système de notation interactif */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Votre note :</span>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  type="button"
                  key={star}
                  className={`text-2xl transition-all duration-200 hover:scale-125 ${
                    note !== null && star <= note 
                      ? 'text-yellow-400 drop-shadow-lg animate-pulse' 
                      : 'text-gray-300 hover:text-yellow-300'
                  }`}
                  onClick={() => setNote(star)}
                  tabIndex={-1}
                  aria-label={`Attribuer la note ${star}`}
                  onMouseEnter={() => {
                    // Effet de survol pour preview
                  }}
                >★</button>
              ))}
            </div>
            {note !== null && (
              <button 
                type="button" 
                className="ml-3 text-xs text-blue-500 hover:text-blue-700 underline transition-colors duration-200 hover:bg-blue-50 px-2 py-1 rounded-full" 
                onClick={() => setNote(null)}
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Bouton d'envoi stylisé */}
          <button 
            type="submit" 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                Publier l'avis
              </>
            )}
          </button>
        </div>
      </form>

      {/* Messages de statut avec animations */}
      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Commentaire publié avec succès !
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 animate-shake">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {error}
        </div>
      )}

      {/* Section commentaires améliorée */}
      {commentaires.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Avis des lecteurs ({commentaires.length})
          </h4>
          
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
            {commentaires.map((c, index) => (
              <div 
                key={c.id} 
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white group/comment"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(c.utilisateur_nom || 'U')[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm text-purple-700 group-hover/comment:text-purple-800">
                      {c.utilisateur_nom || 'Utilisateur'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(c.note)}
                      {'☆'.repeat(5 - c.note)}
                    </div>
                    <span>{new Date(c.date_commentaire).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed group-hover/comment:text-gray-800 transition-colors duration-200">
                  {c.commentaire}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default Page;