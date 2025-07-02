import React from 'react';
import Head from 'next/head';
import { BookOpen, Users, Clock, Shield, Award, Heart, Zap, Globe } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Catalogue Numérique",
      description: "Accédez à plus de 50,000 livres numériques et ressources documentaires"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Communauté Active",
      description: "Rejoignez une communauté de 10,000+ lecteurs passionnés"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      title: "Disponible 24/7",
      description: "Consultez vos livres préférés à tout moment, où que vous soyez"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Sécurisé & Fiable",
      description: "Vos données sont protégées avec les dernières technologies de sécurité"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Livres disponibles" },
    { number: "10,000+", label: "Utilisateurs actifs" },
    { number: "500+", label: "Nouveautés par mois" },
    { number: "24/7", label: "Support disponible" }
  ];

  const team = [
    {
      name: "Marie Dubois",
      role: "Directrice de la Bibliothèque",
      description: "15 ans d'expérience en gestion documentaire",
      avatar: "MD"
    },
    {
      name: "Jean Martin",
      role: "Responsable Technique",
      description: "Expert en solutions numériques pour bibliothèques",
      avatar: "JM"
    },
    {
      name: "Sophie Laurent",
      role: "Responsable Collections",
      description: "Spécialisée en acquisition et catalogage",
      avatar: "SL"
    }
  ];

  return (
    <>
      <Head>
        <title>À propos - BiblioTech</title>
        <meta name="description" content="Découvrez BiblioTech, votre bibliothèque numérique moderne. Accédez à des milliers de livres en ligne." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-300 to-indigo-700 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <BookOpen className="w-10 h-10" />
              </div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                À propos de BiblioTech
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Nous révolutionnons l'accès à la connaissance en offrant une expérience de lecture numérique 
                moderne, intuitive et accessible à tous.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                BiblioTech a été créée avec une vision simple mais ambitieuse : démocratiser l'accès 
                à la connaissance en combinant la richesse du patrimoine littéraire avec les possibilités 
                infinies du numérique.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Nous croyons que chaque personne mérite d'avoir accès à une bibliothèque mondiale, 
                disponible à tout moment et adaptée à ses besoins spécifiques.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Passion pour la lecture</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Innovation technologique</span>
                </div>
                <div className="flex items-center gap-2 text-purple-700">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Accessibilité universelle</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-2xl h-full flex items-center justify-center transform -rotate-3">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Excellence</h3>
                    <p className="text-gray-600">Reconnue pour la qualité de nos services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir BiblioTech ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez les avantages qui font de notre plateforme le choix privilégié 
                des amoureux de la lecture.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">BiblioTech en Chiffres</h2>
              <p className="text-xl text-blue-100">
                Des statistiques qui témoignent de notre croissance et de votre confiance
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-blue-100 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Notre Équipe
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Rencontrez les passionnés qui donnent vie à BiblioTech chaque jour
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border border-gray-100">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        {member.avatar}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Rejoindre l'Aventure ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Découvrez des milliers de livres, rejoignez une communauté passionnée 
              et transformez votre façon de lire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Créer un Compte
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Explorer le Catalogue
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;