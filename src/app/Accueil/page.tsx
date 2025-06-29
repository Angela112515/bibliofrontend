"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const page = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    { text: "Une bibliothèque moderne et intuitive, j'ai trouvé tous les livres que je cherchais !", author: "Alice", color: "text-blue-600" },
    { text: "Réserver un livre n'a jamais été aussi simple. Je recommande vivement !", author: "Karim", color: "text-pink-600" },
    { text: "L'interface est magnifique et très facile à utiliser. Parfait pour les passionnés de lecture !", author: "Sophie", color: "text-purple-600" },
    { text: "Un catalogue impressionnant et un service de qualité. Je ne peux plus m'en passer !", author: "Marc", color: "text-indigo-600" }
  ];

  // Animation du carousel des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Intersection Observer pour les animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated background with floating elements */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 animate-gradient bg-[linear-gradient(120deg,_#e0e7ff,_#f3e8ff,_#fce7f3,_#e0e7ff)] bg-[length:200%_200%]" />
        {/* Floating books animation */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="text-4xl opacity-20">📚</div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delay-1">
          <div className="text-3xl opacity-20">📖</div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float-delay-2">
          <div className="text-5xl opacity-20">📓</div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delay-3">
          <div className="text-3xl opacity-20">📗</div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section with parallax effect */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Image 
              src="/Assets/biblio.jpg" 
              alt="Bibliothèque" 
              width={800} 
              height={600} 
              className="object-cover rounded-3xl transform scale-110 blur-sm"
            />
          </div>
          
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="animate-bounce mb-6">
              <span className="text-8xl">📚</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 drop-shadow-2xl animate-pulse">
              Bienvenue à BiblioApp
            </h1>
            <p className="text-xl md:text-3xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Explorez, réservez et découvrez des milliers de livres depuis chez vous. 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"> Une expérience de lecture moderne et magique.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#catalogue" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <span>🔍 Découvrir le catalogue</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a href="#nouveautes" className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-purple-300 text-purple-700 font-bold rounded-full shadow-xl hover:scale-105 hover:bg-white hover:shadow-2xl transition-all duration-300">
                ✨ Voir les nouveautés
              </a>
            </div>
          </div>
        </section>

        {/* Avantages avec animations */}
        <section id="avantages" className="py-20 px-4" data-animate>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Pourquoi choisir BiblioApp ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "📚", title: "Catalogue riche", desc: "Des milliers de livres, romans, BD, et plus encore à portée de clic.", color: "from-blue-500 to-blue-600" },
                { icon: "⚡", title: "Réservation instantanée", desc: "Réservez vos ouvrages préférés en quelques secondes, sans vous déplacer.", color: "from-purple-500 to-purple-600" },
                { icon: "🌍", title: "Accessible partout", desc: "Consultez votre bibliothèque et vos réservations depuis n'importe quel appareil.", color: "from-pink-500 to-pink-600" }
              ].map((item, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-2 border border-white/20">
                    <div className="text-6xl mb-6 group-hover:animate-bounce">{item.icon}</div>
                    <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nouveautés avec image principale */}
        <section id="nouveautes" className="py-20 px-4 bg-white/30 backdrop-blur-sm" data-animate>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              <div className="lg:w-1/2">
                <h2 className="text-4xl font-bold text-blue-700 mb-6">📖 Nos Nouveautés</h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Découvrez notre sélection des dernières parutions. Des romans captivants aux essais inspirants, 
                  trouvez votre prochaine lecture favorite dans notre collection fraîchement enrichie.
                </p>
                <div className="flex gap-4">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">Fiction</span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold">Science-Fiction</span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-semibold">Romance</span>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative group cursor-pointer">
                  <Image 
                    src="/Assets/biblio.jpg" 
                    alt="Bibliothèque moderne" 
                    width={600} 
                    height={400} 
                    className="rounded-3xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-bold text-xl">Explorez notre bibliothèque moderne</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { img: "/Assets/biblio1.jpg", title: "Le Livre des portes", author: "Garett Brown", genre: "Fantastique" },
                { img: "/Assets/biblio2.jpg", title: "La librairie disparue", author: "Elie Woods", genre: "Mystère" },
                { img: "/Assets/biblio3.jpg", title: "La disparue", author: "Daphné Milpiet", genre: "Thriller" }
              ].map((book, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-2">
                    <div className="relative mb-4">
                      <Image 
                        src={book.img} 
                        alt={book.title} 
                        width={120} 
                        height={120} 
                        className="mx-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300" 
                      />
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        NOUVEAU
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{book.title}</h3>
                    <p className="text-gray-600 mb-1">Par {book.author}</p>
                    <p className="text-sm text-purple-600 font-semibold mb-4">{book.genre}</p>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl">
                      📚 Emprunter maintenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages avec carousel interactif */}
        <section className="py-20 px-4" data-animate>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-purple-700 mb-12">💬 Ce que disent nos lecteurs</h2>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-h-[200px] flex items-center justify-center">
              <div className="transition-all duration-500 ease-in-out">
                <p className="text-2xl italic text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <span className={`font-bold text-xl ${testimonials[currentTestimonial].color}`}>
                  - {testimonials[currentTestimonial].author}
                </span>
              </div>
              
              {/* Indicateurs de carousel */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-purple-600 w-8' : 'bg-purple-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA finale */}
        <section className="py-20 px-4 text-center" data-animate>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-pink-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-600 mb-6">
                🚀 Prêt à découvrir votre prochain livre ?
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Rejoignez des milliers de lecteurs qui ont déjà adopté BiblioApp. 
                Votre prochaine aventure littéraire vous attend !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#catalogue" className="group px-10 py-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
                  <span className="relative z-10">🎯 Accéder au catalogue</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a href="/Inscription" className="px-10 py-4 bg-white/90 backdrop-blur-sm border-2 border-pink-300 text-pink-700 font-bold rounded-full shadow-xl hover:scale-105 hover:bg-white hover:shadow-2xl transition-all duration-300">
                  ✨ S'inscrire gratuitement
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Styles CSS améliorés */}
      <style jsx global>{`
        @keyframes gradientBG {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delay-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-3deg); }
        }
        
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }
        
        @keyframes float-delay-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        .animate-gradient {
          animation: gradientBG 12s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay-1 {
          animation: float-delay-1 8s ease-in-out infinite;
        }
        
        .animate-float-delay-2 {
          animation: float-delay-2 7s ease-in-out infinite;
        }
        
        .animate-float-delay-3 {
          animation: float-delay-3 9s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </main>
  )
}

export default page