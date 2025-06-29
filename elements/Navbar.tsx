import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl relative overflow-hidden">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link href="/Accueil" className="flex-shrink-0 flex items-center group">
              <div className="text-3xl font-bold text-white hover:text-yellow-300 transition-all duration-300 transform group-hover:scale-105 flex items-center gap-3">
                <span className="text-4xl animate-bounce">📚</span>
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  BiblioApp
                </span>
              </div>
            </Link>
            
            {/* Navigation desktop */}
            <div className="hidden md:ml-12 md:flex md:space-x-2">
              <Link 
                href="/Accueil" 
                className="text-white/90 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg hover:scale-105"
              >
                🏠 Accueil
              </Link>
              <Link 
                href="/Livres" 
                className="text-white/90 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg hover:scale-105"
              >
                📖 Catalogue
              </Link>
              <Link 
                href="/Apropos" 
                className="text-white/90 hover:text-white hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:shadow-lg hover:scale-105"
              >
                ℹ️ À propos
              </Link>
            </div>
          </div>

          {/* Boutons de connexion/inscription */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link 
              href="/Connexion" 
              className="text-white/90 hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg"
            >
              🔑 Connexion
            </Link>
            <Link 
              href="/Inscription" 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 border-2 border-yellow-300/50"
            >
              ✨ Inscription
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <div className="dropdown dropdown-end">
              <button 
                tabIndex={0} 
                className="btn btn-ghost btn-circle text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                aria-label="Menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
              <ul 
                tabIndex={0} 
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl w-64 border border-white/20 animate-fade-in"
              >
                <li>
                  <Link 
                    href="/Accueil" 
                    className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">Accueil</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Livres" 
                    className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">📖</span>
                    <span className="font-medium">Catalogue</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Apropos" 
                    className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">ℹ️</span>
                    <span className="font-medium">À propos</span>
                  </Link>
                </li>
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <Link 
                    href="/Connexion" 
                    className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">🔑</span>
                    <span className="font-medium">Connexion</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Inscription" 
                    className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-300 p-3 flex items-center gap-3 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mt-2"
                  >
                    <span className="text-xl">✨</span>
                    <span>Inscription</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Effet de lumière en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 opacity-60"></div>
    </nav>
  )
}

export default Navbar