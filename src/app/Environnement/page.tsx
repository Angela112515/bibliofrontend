"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Page = () => {
  const [user, setUser] = useState<{ nom: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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
        const userRes = await axios.get('http://localhost:4400/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = userRes.data;
        if (!userData || !userData.nom || !userData.email) {
          setError('Réponse utilisateur invalide');
          setUser(null);
        } else {
          setUser(userData);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            (err.response?.status === 404
              ? `404 sur ${err.config?.url}`
              : err.response?.data?.Message || err.message || 'Erreur lors de la récupération des données')
          );
          console.error('Erreur API:', err.response?.data, 'URL:', err.config?.url);
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
    // Empêche le rendu côté serveur pour éviter le mismatch
    return null;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Utilisateur non connecté'}</div>;
  }

  // Déconnexion : supprime le token et recharge la page
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mb-8 flex flex-col items-center gap-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Bienvenue, {user.nom} !</h2>
        <p className="text-gray-600 mb-1">Email : {user.email}</p>
        <div className="mt-4 text-green-600 font-semibold">Vous êtes connecté avec succès !</div>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </main>
  );
}

export default Page