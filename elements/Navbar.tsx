import React from 'react'
import Link from 'next/link'
import Image from 'next/image'


const Navbar = () => {
  return (
<nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl relative overflow-hidden rounded-4xl border-4 border-blue-300 h-24"> 
  <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-slate-800/10 to-blue-950/20 flex justify-center items-center"> </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center h-24">
        <div className="flex items-center w-full h-16 justify-between">
          {/* Logo et navigation principale alignés à gauche */}
          <div className="flex items-center w-auto">
            <Link href="/Accueil" className="flex-shrink-0 flex items-center group">
              <div className="text-2xl font-bold text-white hover:text-blue-300 transition-all duration-300 transform group-hover:scale-105 flex items-center gap-3">
                <div className="flex justify-center">
                  {/* Image personnalisée */}
                  <Image
                    src="/Assets/lecture.png"
                    alt="Logo bibliothèque"
                    width={50}
                    height={40}
                    className="mx-auto"
                    priority
                  />
                </div>
                <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent font-extrabold tracking-wide flex justify-center items-center">
                  BiblioFlex
                </span>
              </div>
            </Link>
            {/* Navigation desktop */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              <Link
                href="/Accueil"
                className="text-gray-300 hover:text-white hover:bg-blue-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-700/50"
              >
                Accueil
              </Link>
              <Link
                href="/Livres"
                className="text-gray-300 hover:text-white hover:bg-blue-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-700/50"
              >
                Catalogue
              </Link>
              <Link
                href="/Apropos"
                className="text-gray-300 hover:text-white hover:bg-blue-900/50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-700/50"
              >
                À propos
              </Link>
              {/* Lien Tableau de bord admin supprimé */}
            </div>
          </div>

          {/* Boutons de connexion/inscription alignés à droite */}
          <div className="hidden md:flex md:items-center md:space-x-3 justify-end">
            <Link 
              href="/Connexion" 
              className="text-gray-300 hover:text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-slate-800/50 border border-gray-600/30 hover:border-blue-600/50"
            >
              Connexion
            </Link>
            <Link 
              href="/Inscription" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-500/30"
            >
              Inscription
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center">
            <div className="dropdown dropdown-end">
              <button 
                tabIndex={0} 
                className="btn btn-ghost btn-circle text-white hover:bg-blue-900/30 hover:scale-105 transition-all duration-300"
                aria-label="Menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
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
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-slate-800/95 backdrop-blur-md rounded-xl w-52 border border-slate-700/50"
              >
                <li>
                  <Link 
                    href="/Accueil" 
                    className="text-gray-300 hover:text-white hover:bg-blue-900/50 rounded-lg transition-all duration-300 p-3"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Livres" 
                    className="text-gray-300 hover:text-white hover:bg-blue-900/50 rounded-lg transition-all duration-300 p-3"
                  >
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Apropos" 
                    className="text-gray-300 hover:text-white hover:bg-blue-900/50 rounded-lg transition-all duration-300 p-3"
                  >
                    À propos
                  </Link>
                </li>
                <li className="border-t border-slate-700 mt-2 pt-2">
                  <Link 
                    href="/Connexion" 
                    className="text-gray-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 p-3"
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Inscription" 
                    className="text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 p-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 mt-1"
                  >
                    Inscription
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ligne de séparation subtile */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent"></div>
    </nav>
  )
}

export default Navbar