"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { Search, Filter, Book, User, Calendar, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react'
import LivreNoteCommentaire from '../../../elements/LivreNoteCommentaire';

type Livre = {
  id: number;
  titre: string;
  auteur: string;
  genre?: string;
  image?: string;
  statut?: string; // Ajout du statut pour indiquer la disponibilité
};

const Page = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [filtreTitre, setFiltreTitre] = useState('');
  const [filtreAuteur, setFiltreAuteur] = useState('');
  const [filtreGenre, setFiltreGenre] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  // Pour la gestion du formulaire d'emprunt
  const [livreSelectionne, setLivreSelectionne] = useState<Livre | null>(null);
  const [dateEmprunt, setDateEmprunt] = useState<string>('');
  const [dateRetour, setDateRetour] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  // Ouvre le formulaire d'emprunt
  const ouvrirFormulaireEmprunt = (livre: Livre) => {
    setLivreSelectionne(livre);
    const today = new Date();
    setDateEmprunt(today.toISOString().split('T')[0]);
    // Par défaut, date de retour = aujourd'hui + 14 jours
    const retour = new Date();
    retour.setDate(today.getDate() + 14);
    setDateRetour(retour.toISOString().split('T')[0]);
  };

  // Ferme le formulaire
  const fermerFormulaireEmprunt = () => {
    setLivreSelectionne(null);
    setDateEmprunt('');
    setDateRetour('');
  };

  // Confirme l'emprunt
  const confirmerEmprunt = async () => {
    if (!livreSelectionne) return;
    // Validation côté client : dates obligatoires et retour max 14 jours après emprunt
    if (!dateEmprunt || !dateRetour) {
      alert("Veuillez renseigner la date d'emprunt et la date de retour.");
      return;
    }
    const dateE = new Date(dateEmprunt);
    const dateR = new Date(dateRetour);
    const diffDays = Math.ceil((dateR.getTime() - dateE.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      alert("La date de retour doit être postérieure à la date d'emprunt.");
      return;
    }
    if (diffDays > 14) {
      alert("La date de retour ne peut pas dépasser 14 jours après la date d'emprunt.");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté pour emprunter un livre.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:4400/api/livres/${livreSelectionne.id}/emprunter`,
        { date_emprunt: dateEmprunt, date_retour: dateRetour },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Livre emprunté avec succès !');
      // Rafraîchir la liste des livres pour mettre à jour le statut
      const res = await axios.get('http://localhost:4400/api/livres');
      setLivres(res.data);
      fermerFormulaireEmprunt();
    } catch (err) {
      // @ts-ignore
      alert(
        // @ts-ignore
        err.response?.data?.message ||
        "Erreur lors de l'emprunt du livre."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatutIcon = (statut: string) => {
    return statut === 'disponible' 
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <XCircle className="w-4 h-4 text-red-600" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header avec titre et description */}
<div className="relative overflow-hidden bg-gradient-to-r from-emerald-200 via-blue-400 to-blue-800 text-white py-16 px-6">
  {/* Décoration animée en arrière-plan */}
  <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-2xl animate-pulse"></div>

  <div className="relative max-w-7xl mx-auto text-center">
    <div className="inline-flex items-center gap-4 mb-6">
      <div className="p-4 bg-white/20 rounded-full border border-white/30 shadow-lg animate-bounce-slow">
        <Book className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg transition-all duration-500 hover:scale-105">
        Catalogue des Livres
      </h1>
    </div>
    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
      Découvrez notre collection de <span className="font-bold text-white">{livres.length}</span> ouvrages et empruntez vos livres préférés en quelques clics.
    </p>
    {/* Bouton CTA */}
    <div className="mt-8">
      <button className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-50 transition transform hover:scale-105">
        <Book className="w-5 h-5" />
        Explorer maintenant
      </button>
    </div>
  </div>
</div>


      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Barre de filtres améliorée */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filtres de recherche</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre par titre */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                value={filtreTitre}
                onChange={e => setFiltreTitre(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
            
            {/* Filtre par auteur */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par auteur..."
                value={filtreAuteur}
                onChange={e => setFiltreAuteur(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {/* Filtre par genre */}
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filtreGenre}
                onChange={e => setFiltreGenre(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
              >
                <option value="">Tous les genres</option>
                {genres.map((g, idx) => (
                  <option key={idx} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Statistiques des résultats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-blue-600">{livresFiltres.length}</span> livre(s) trouvé(s) 
              {(filtreTitre || filtreAuteur || filtreGenre) && (
                <span className="ml-2 text-gray-500">
                  • Filtres actifs
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Grille des livres */}
        {livresFiltres.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Aucun livre trouvé avec ces critères.</p>
              <p className="text-gray-500 text-sm mt-2">Essayez de modifier vos filtres de recherche.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {livresFiltres.map((livre) => (
              <div key={livre.id} className="group relative">
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-blue-300 
    flex flex-col h-full">
    {/* Image du livre */}
    <div className="relative h-48 overflow-hidden">
      <Image
        src={livre.image && livre.image.startsWith('/uploads/')
          ? `http://localhost:4400${livre.image}`
          : (livre.image || 'https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp')}
        alt={livre.titre}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      {/* Badge de statut */}
      <div className="absolute top-3 right-3">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          livre.statut === 'disponible' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {getStatutIcon(livre.statut || '')}
          {livre.statut || 'Non défini'}
        </div>
      </div>
    </div>

    {/* Contenu de la carte */}
    <div className="p-5 flex flex-col flex-grow justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {livre.titre}
        </h3>
        <LivreNoteCommentaire livreId={livre.id} />
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <User className="w-4 h-4 text-blue-600" />
            <span>{livre.auteur}</span>
          </div>
          {livre.genre && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{livre.genre}</span>
            </div>
          )}
        </div>
      </div>
      {/* Note et commentaire */}
      <LivreNoteCommentaire livreId={livre.id} />
      {/* Bouton d'emprunt */}
      <button
        onClick={() => ouvrirFormulaireEmprunt(livre)}
        disabled={livre.statut !== 'disponible'}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 mt-4 ${
          livre.statut === 'disponible'
            ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 shadow-md hover:shadow-blue-500/25'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {livre.statut === 'disponible' ? 'Emprunter' : 'Non disponible'}
      </button>
    </div>
  </div>
</div>

            ))}
            {/* Modal global pour l'emprunt */}
            {livreSelectionne && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Confirmer l'emprunt</h2>
                  </div>
                  {/* Informations du livre */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Titre&nbsp;:</span>
                        <span className="text-gray-800 font-medium">{livreSelectionne.titre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Auteur&nbsp;:</span>
                        <span className="text-gray-800">{livreSelectionne.auteur}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Genre&nbsp;:</span>
                        <span className="text-gray-800">{livreSelectionne.genre || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={e => { e.preventDefault(); confirmerEmprunt(); }} className="space-y-4">
                    {/* Date d'emprunt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d&apos;emprunt
                      </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      value={dateEmprunt}
                      onChange={e => setDateEmprunt(e.target.value)}
                      required
                      max={dateRetour}
                      disabled={loading}
                    />
                    </div>
                    {/* Date de retour */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de retour
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        value={dateRetour}
                        onChange={e => setDateRetour(e.target.value)}
                        required
                        min={dateEmprunt}
                        max={(() => {
                          if (!dateEmprunt) return '';
                          const d = new Date(dateEmprunt);
                          d.setDate(d.getDate() + 14);
                          return d.toISOString().split('T')[0];
                        })()}
                        disabled={loading}
                      />
                    </div>
                    {/* Boutons d'action */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Clock className="w-4 h-4 animate-spin" />
                            Validation...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Confirmer
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={fermerFormulaireEmprunt}
                        disabled={loading}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page