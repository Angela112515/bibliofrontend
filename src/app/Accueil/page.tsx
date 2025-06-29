"use client";
import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <main className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-[linear-gradient(120deg,_#e0e7ff,_#f3e8ff,_#fce7f3,_#e0e7ff)] bg-[length:200%_200%]" />
      {/* Hero Section */}
      <section className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 drop-shadow-lg">Bienvenue à la Bibliothèque en Ligne</h1>
        <p className="text-lg md:text-2xl text-gray-700 max-w-2xl mx-auto mb-6">Explorez, réservez et découvrez des milliers de livres depuis chez vous. Accédez à un vaste catalogue, gérez vos réservations et profitez d&apos;une expérience de lecture moderne et intuitive.</p>
        <a href="#catalogue" className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200">Découvrir le catalogue</a>
      </section>
      {/* Avantages */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-fade-in-up mb-16">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <Image src="/file.svg" alt="Catalogue" width={64} height={64} className="mb-4" />
          <h2 className="text-xl font-bold mb-2 text-blue-600">Catalogue riche</h2>
          <p className="text-gray-600">Des milliers de livres, romans, BD, et plus encore à portée de clic.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <Image src="/window.svg" alt="Réservation" width={64} height={64} className="mb-4" />
          <h2 className="text-xl font-bold mb-2 text-purple-600">Réservation facile</h2>
          <p className="text-gray-600">Réservez vos ouvrages préférés en quelques secondes, sans vous déplacer.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <Image src="/globe.svg" alt="Accessibilité" width={64} height={64} className="mb-4" />
          <h2 className="text-xl font-bold mb-2 text-pink-600">Accessible partout</h2>
          <p className="text-gray-600">Consultez votre bibliothèque et vos réservations depuis n&apos;importe quel appareil.</p>
        </div>
      </section>
      {/* Nouveautés */}
      <section className="w-full max-w-5xl mb-16 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Nouveautés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-200">
            <Image src="/Assets/biblio1.jpg" alt="Livre 1" width={80} height={80} className="mb-2" />
            <h3 className="font-semibold text-lg mb-1">Le Livre des portes</h3>
            <p className="text-gray-500 text-sm mb-2">Auteur : Garett Brown</p>
            <button className="btn btn-sm btn-primary">Réserver</button>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-200">
            <Image src="/Assets/biblio2.jpg" alt="Livre 2" width={80} height={80} className="mb-2" />
            <h3 className="font-semibold text-lg mb-1">La librairie disparue</h3>
            <p className="text-gray-500 text-sm mb-2">Auteur : Elie Woods</p>
            <button className="btn btn-sm btn-primary">Réserver</button>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-xl transition-shadow duration-200">
            <Image src="/Assets/biblio3.jpg" alt="Livre 3" width={80} height={80} className="mb-2" />
            <h3 className="font-semibold text-lg mb-1">La disparue</h3>
            <p className="text-gray-500 text-sm mb-2">Auteur : Daphné Milpiet</p>
            <button className="btn btn-sm btn-primary">Réserver</button>
          </div>
        </div>
      </section>

      {/* Boutons Inscription et Connexion côte à côte */}
      <div className="flex flex-row gap-4 justify-center mb-8">
        <a href="/Inscription" className="btn btn-outline border-indigo-500 text-white hover:bg-white hover:text-blue-600 transition-colors duration-200 bg-pink-400">Inscription</a>
        <a href="/Connexion" className="btn btn-outline border-indigo-500 text-white hover:bg-white hover:text-blue-600 transition-colors duration-200 bg-pink-400">Connexion</a>
      </div>
      
      {/* Section Témoignages */}
      <section className="w-full max-w-5xl mb-16 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Témoignages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <p className="italic text-gray-700 mb-2">&quot;Une bibliothèque moderne et intuitive, j&apos;ai trouvé tous les livres que je cherchais !&quot;</p>
            <span className="font-semibold text-blue-600">- Alice</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col">
            <p className="italic text-gray-700 mb-2">&quot;Réserver un livre n&apos;a jamais été aussi simple. Je recommande vivement !&quot;</p>
            <span className="font-semibold text-pink-600">- Karim</span>
          </div>
        </div>
      </section>
      {/* Section Appel à l&apos;action */}
      <section className="w-full max-w-3xl text-center animate-fade-in-up">
        <h2 className="text-2xl font-bold text-pink-700 mb-4">Prêt à découvrir votre prochain livre ?</h2>
        <a href="#catalogue" className="inline-block px-10 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200">Accéder au catalogue</a>
      </section>
      {/* Animation CSS */}
      <style jsx global>{`
        @keyframes gradientBG {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .animate-gradient {
          animation: gradientBG 12s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}

export default page