"use client";
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const page = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const testimonials = [
    { text: "Une bibliothèque moderne et intuitive, j'ai trouvé tous les livres que je cherchais !", author: "Alice", color: "text-blue-600" },
    { text: "Réserver un livre n'a jamais été aussi simple. Je recommande vivement !", author: "Karim", color: "text-blue-700" },
    { text: "L'interface est magnifique et très facile à utiliser. Parfait pour les passionnés de lecture !", author: "Sophie", color: "text-blue-800" },
    { text: "Un catalogue impressionnant et un service de qualité. Je ne peux plus m'en passer !", author: "Marc", color: "text-blue-900" }
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
        <div className="absolute inset-0 animate-gradient bg-[linear-gradient(120deg,_#e0f2fe,_#e1f5fe,_#b3e5fc,_#81d4fa)] bg-[length:200%_200%]" />
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

        {/* Hero Section with enhanced parallax effect */}
<section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
  {/* Background Image with dark overlay */}
  <div className="absolute inset-0">
    <Image 
      src="/Assets/biblio.jpg" 
      alt="Bibliothèque" 
      layout="fill"
      objectFit="cover"
      className="transform scale-110 blur-sm"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
  </div>

  {/* Content */}
  <div className="text-center max-w-4xl mx-auto relative z-10 text-white ">
    <div className="animate-bounce mb-8 flex justify-center">
      {/* Logo image */}
      <Image
        src="/Assets/lecture.png" 
        alt="Logo bibliothèque"
        width={100}
        height={100}
        className="mx-auto drop-shadow-xl"
        priority
      />
    </div>

    <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
      Bienvenue sur BiblioFlex
    </h1>
    <h2 className="text-2xl md:text-3xl font-medium mb-6 text-gray-200">
      Votre bibliothèque digitale, accessible partout et à tout moment.
    </h2>

    <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed text-gray-300">
      Explorez, réservez et découvrez des milliers d’ouvrages, romans, BD et documents scientifiques.
      <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 font-semibold">
        Une expérience de lecture moderne et magique.
      </span>
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href="/Livres" 
        className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span>🔍 Découvrir le catalogue</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </a>

      <a 
        href="#nouveautes" 
        className="px-8 py-4 bg-white/90 backdrop-blur-sm border-2 border-blue-300 text-blue-700 font-bold rounded-full shadow-xl hover:scale-105 hover:bg-white hover:shadow-2xl transition-all duration-300"
      >
        ✨ Voir les nouveautés
      </a>
    </div>
  </div>
</section>


        {/* Avantages avec animations */}
       <section id="avantages" className="py-20 px-4 bg-gradient-to-b from-white via-blue-50 to-white" data-animate>
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
      Pourquoi choisir BiblioFlex ?
    </h2>
    <p className="text-center text-gray-500 max-w-2xl mx-auto mb-16">
      Découvrez les avantages exclusifs qui font de BiblioFlex votre solution idéale pour gérer vos lectures et réservations en toute simplicité.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        { 
          icon: "📚", 
          title: "Catalogue riche", 
          desc: "Accédez à des milliers de livres, romans, bandes dessinées, documents scientifiques et plus encore, soigneusement organisés pour vos besoins.", 
          color: "from-blue-400 to-blue-600" 
        },
        { 
          icon: "⚡", 
          title: "Réservation instantanée", 
          desc: "Réservez en un clic vos ouvrages préférés depuis chez vous ou en déplacement, avec confirmation immédiate et notification en temps réel.", 
          color: "from-blue-500 to-blue-700" 
        },
        { 
          icon: "🌍", 
          title: "Accessible partout", 
          desc: "Profitez d'une plateforme optimisée accessible sur ordinateur, tablette et smartphone, où que vous soyez dans le monde.", 
          color: "from-blue-600 to-blue-800" 
        }
      ].map((item, index) => (
        <div key={index} className="group relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-2 border border-blue-100 flex flex-col justify-between h-full min-h-[420px]">
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
              </div>
              <h3 className={`text-2xl font-extrabold mb-4 bg-gradient-to-r ${item.color} bg-clip-text text-transparent text-center`}>
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



       {/* Nouveautés avec image principale amélioré et cards moins hautes */}
<section id="nouveautes" className="py-24 px-4 bg-gradient-to-b from-blue-50 to-blue-100/50 backdrop-blur-sm" data-animate>
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
      <div className="lg:w-1/2" data-aos="fade-right">
        <h2 className="text-5xl font-extrabold text-blue-800 mb-6 border-l-8 border-blue-500 pl-4">
          📖 Nos Nouveautés
        </h2>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
          Découvrez notre sélection des dernières parutions. Des romans captivants aux essais inspirants, 
          trouvez votre prochaine lecture favorite dans notre collection fraîchement enrichie.
        </p>
        <div className="flex flex-wrap gap-3">
          {["Fiction", "Science-Fiction", "Romance"].map((category, index) => (
            <span
              key={index}
              className={`px-4 py-2 rounded-full font-semibold bg-gradient-to-r 
                ${index === 0 ? "from-blue-100 to-blue-200 text-blue-800" : ""} 
                ${index === 1 ? "from-blue-200 to-blue-300 text-blue-900" : ""} 
                ${index === 2 ? "from-pink-200 to-pink-300 text-pink-900" : ""}
                shadow hover:scale-105 transition-transform duration-200`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="lg:w-1/2" data-aos="fade-left">
        <div className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-2xl">
          <Image 
            src="/Assets/biblio.jpg" 
            alt="Bibliothèque moderne" 
            width={600} 
            height={400} 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6">
            <p className="text-white font-bold text-2xl drop-shadow-md">Explorez notre bibliothèque moderne</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        { img: "/Assets/biblio1.jpg", title: "Le Livre des portes", author: "Garett Brown", genre: "Fantastique" },
        { img: "/Assets/biblio2.jpg", title: "La librairie disparue", author: "Elie Woods", genre: "Mystère" },
        { img: "/Assets/biblio3.jpg", title: "La disparue", author: "Daphné Milpiet", genre: "Thriller" }
      ].map((book, index) => (
        <div key={index} className="group relative" data-aos="zoom-in" data-aos-delay={index * 100}>
          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-2 flex flex-col items-center justify-between h-[320px] w-full">
            <div className="relative mt-8 mb-6">
              <Image 
                src={book.img} 
                alt={book.title} 
                width={100} 
                height={100} 
                className="mx-auto rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300" 
              />
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow">
                NOUVEAU
              </div>
            </div>
            <div className="px-4 text-center mt-2">
              <h3 className="font-bold text-lg text-gray-800 mb-1">{book.title}</h3>
              <p className="text-gray-600 mb-1">Par {book.author}</p>
              <p className="text-sm text-blue-600 font-semibold">{book.genre}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>




        {/* Témoignages avec carousel interactif */}
        <section className="py-20 px-4" data-animate>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-blue-700 mb-12">💬 Ce que disent nos lecteurs</h2>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 min-h-[200px] flex items-center justify-center border border-blue-100">
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
                      index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-blue-300'
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
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-700/10 backdrop-blur-sm rounded-3xl p-12 border border-blue-200">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6">
                🚀 Prêt à découvrir votre prochain livre ?
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Rejoignez des milliers de lecteurs qui ont déjà adopté BiblioFlex. 
                Votre prochaine aventure littéraire vous attend !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/Livres" className="group px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-full shadow-2xl hover:scale-110 hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
                  <span className="relative z-10">🎯 Accéder au catalogue</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                <a href="/Inscription" className="px-10 py-4 bg-white/90 backdrop-blur-sm border-2 border-blue-300 text-blue-700 font-bold rounded-full shadow-xl hover:scale-105 hover:bg-white hover:shadow-2xl transition-all duration-300">
                  ✨ S'inscrire 
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