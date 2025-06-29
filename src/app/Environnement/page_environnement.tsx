import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

const PageEnvironnement = () => {
  const [user, setUser] = useState<{ nom: string; email: string; photo?: string } | null>(null);
  const [livres, setLivres] = useState<Array<{ titre: string; auteur: string; statut: string; image: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        // Récupère les infos utilisateur
        const userRes = await axios.get('http://localhost:4400/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data.user);
        // Récupère les livres réservés/empruntés
        const livresRes = await axios.get('http://localhost:4400/user/livres', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLivres(livresRes.data.livres || []);
      } catch (err) {
        setUser(null);
        setLivres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Utilisateur non connecté</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mb-8 flex flex-col md:flex-row items-center gap-8">
        <Image src={user.photo || '/Assets/biblio1.jpg'} alt="Photo utilisateur" width={100} height={100} className="rounded-full border-4 border-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Bienvenue, {user.nom} !</h2>
          <p className="text-gray-600 mb-1">Email : {user.email}</p>
          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Modifier mon profil</button>
        </div>
      </div>

      <section className="w-full max-w-3xl bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-xl font-semibold text-purple-700 mb-4">Mes livres</h3>
        {livres.length === 0 ? (
          <div className="text-gray-500 italic">Aucun livre réservé</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {livres.map((livre, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 shadow-sm">
                <Image src={livre.image} alt={livre.titre} width={60} height={60} className="rounded" />
                <div>
                  <h4 className="font-bold text-lg">{livre.titre}</h4>
                  <p className="text-gray-500 text-sm">Auteur : {livre.auteur}</p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${livre.statut === 'Emprunté' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>{livre.statut}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="w-full max-w-3xl flex flex-col md:flex-row gap-6">
        <button className="flex-1 bg-pink-500 text-white py-4 rounded-xl font-semibold shadow hover:bg-pink-600 transition-colors">Réserver un nouveau livre</button>
        <button className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-semibold shadow hover:bg-blue-600 transition-colors">Voir le catalogue</button>
      </section>
    </main>
  )
}

export default PageEnvironnement