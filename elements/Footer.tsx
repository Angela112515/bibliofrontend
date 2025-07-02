import React from 'react'

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply animate-pulse"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-cyan-500 rounded-full mix-blend-multiply animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10 px-8 py-10 mx-auto max-w-6xl">
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          
          {/* Navigation links */}
          <nav className="flex flex-wrap gap-8">
            <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200">
              À propos
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200">
              Contact
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200">
              Carrières
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200">
              Kit presse
            </a>
          </nav>
          
          {/* Social media */}
          <div className="flex space-x-4">
            <a href="#" className="group p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-cyan-500 transition-all duration-300 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current group-hover:text-white">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a href="#" className="group p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-cyan-500 transition-all duration-300 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current group-hover:text-white">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a href="#" className="group p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-cyan-500 transition-all duration-300 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current group-hover:text-white">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Quote and copyright */}
        <div className="text-center border-t border-white/20 pt-6">
          <blockquote className="text-cyan-200 italic mb-4">
            "La lecture est à l'esprit ce que l'exercice est au corps." — Joseph Addison
          </blockquote>
          <p className="text-sm text-gray-400">&copy; By Angela Eloïse Koua</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
