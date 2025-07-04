import React from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white px-8 py-4 shadow-xl rounded-3xl border-b-4 border-blue-300 backdrop-blur-md ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo et nom */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-white drop-shadow-md" />
          <Link href="/Accueil" className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
            BiblioFlex
          </Link>
        </div>

        {/* Menu principal */}
        <ul className="hidden lg:flex items-center gap-6">
          <li>
            <Link href="/Accueil" className="hover:bg-blue-500 hover:bg-opacity-30 rounded-xl px-4 py-2 transition-all duration-300">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/Livres" className="hover:bg-blue-500 hover:bg-opacity-30 rounded-xl px-4 py-2 transition-all duration-300">
              Catalogue
            </Link>
          </li>
          <li>
            <Link href="/Apropos" className="hover:bg-blue-500 hover:bg-opacity-30 rounded-xl px-4 py-2 transition-all duration-300">
              À propos
            </Link>
          </li>
        </ul>

        {/* Menu mobile */}
        <div className="lg:hidden dropdown">
          <button tabIndex={0} className="p-2 rounded-lg hover:bg-blue-500 hover:bg-opacity-30 transition-all duration-300" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 w-48 bg-gradient-to-b from-blue-50 to-blue-100 text-blue-800 rounded-xl shadow-2xl border border-blue-200 backdrop-blur-lg">
            <li><Link href="/Accueil" className="hover:bg-blue-200 rounded-lg px-4 py-2 transition-colors duration-200">Accueil</Link></li>
            <li><Link href="/Livres" className="hover:bg-blue-200 rounded-lg px-4 py-2 transition-colors duration-200">Catalogue</Link></li>
            <li><Link href="/Apropos" className="hover:bg-blue-200 rounded-lg px-4 py-2 transition-colors duration-200">À propos</Link></li>
          </ul>
        </div>

        {/* Connexion / Inscription */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/Connexion" className="px-6 py-2 rounded-full border-2 border-blue-200 text-blue-100 hover:bg-blue-200 hover:text-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-xl">
            Connexion
          </Link>
          <Link href="/Inscription" className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300">
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
