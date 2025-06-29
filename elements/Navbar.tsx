import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="navbar bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg text-white px-8 py-4 rounded-b-2xl border-b-4 border-pink-300 animate-fade-in">
      <div className="flex-1 flex items-center gap-4">
        <Link className="btn btn-ghost text-2xl font-bold tracking-wide hover:scale-110 transition-transform duration-200" href="/Accueil">BiblioApp</Link>
        <div className="dropdown lg:hidden">
          <button tabIndex={0} className="btn btn-ghost p-2" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 w-48 bg-white text-gray-800 rounded-box shadow-lg animate-fade-in">
            <li><Link href="/Accueil" className="hover:bg-blue-100">Accueil</Link></li>
            <li tabIndex={0}>
              <Link href="/Livres" className="justify-between hover:bg-blue-100">Livres</Link>
            </li>
            <li><a href="#reservation" className="hover:bg-blue-100">Réservation</a></li>
          </ul>
        </div>
      </div>

      <div className="flex-none hidden lg:flex items-center">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link href="/Accueil" className="hover:bg-white hover:text-blue-600 transition-colors duration-200 rounded">Accueil</Link></li>
          <li tabIndex={0}>
            <Link href="/Livres" className="hover:bg-white hover:text-blue-600 transition-colors duration-200 rounded cursor-pointer">Livres</Link>
          </li>
          <li><a href="#reservation" className="hover:bg-white hover:text-blue-600 transition-colors duration-200 rounded">Réservation</a></li>
        </ul>
      </div>
      
      
    </nav>
  )
}

export default Navbar