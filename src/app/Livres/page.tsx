"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

type Livre = {
  id: number;
  titre: string;
  auteur: string;
  genre?: string;
  image?: string;
};

const Page = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [filtreTitre, setFiltreTitre] = useState('');
  const [filtreAuteur, setFiltreAuteur] = useState('');
  const [filtreGenre, setFiltreGenre] = useState('');
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    // Récupère tous les livres
    axios.get('http://localhost:4400/api/livres')
      .then(res => {
        setLivres(res.data);
        // Récupère la liste unique des genres
        const uniqueGenres = Array.from(new Set(res.data.map((l: Livre) => l.genre).filter(Boolean)));
        setGenres(uniqueGenres as string[]);
      })
      .catch(() => setLivres([]));
  }, []);

  const livresFiltres = livres.filter((livre: Livre) =>
    livre.titre.toLowerCase().includes(filtreTitre.toLowerCase()) &&
    livre.auteur.toLowerCase().includes(filtreAuteur.toLowerCase()) &&
    (filtreGenre === '' || livre.genre === filtreGenre)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Catalogue des livres</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Filtrer par titre..."
          value={filtreTitre}
          onChange={e => setFiltreTitre(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Filtrer par auteur..."
          value={filtreAuteur}
          onChange={e => setFiltreAuteur(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        />
        <select
          value={filtreGenre}
          onChange={e => setFiltreGenre(e.target.value)}
          className="select select-bordered w-full md:w-1/3"
        >
          <option value="">Tous les genres</option>
          {genres.map((g, idx) => (
            <option key={idx} value={g}>{g}</option>
          ))}
        </select>
      </div>
      {livresFiltres.length === 0 ? (
        <div className="text-gray-500 italic">Aucun livre trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livresFiltres.map((livre) => (
            <div key={livre.id} className="card card-side bg-base-100 shadow-sm">
              <figure>
                <Image
                  src={livre.image || 'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp'}
                  alt={livre.titre}
                  width={120}
                  height={160}
                  className="rounded"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{livre.titre}</h2>
                <p className="text-sm text-gray-600">Auteur : {livre.auteur}</p>
                <p className="text-sm text-gray-500">Genre : {livre.genre || 'N/A'}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Réserver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Page