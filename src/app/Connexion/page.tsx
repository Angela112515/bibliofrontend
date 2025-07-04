'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen, Sparkles, Bookmark } from 'lucide-react';

export default function HomePage() {
    const [showPassword, setShowPassword] = useState(false);

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = {
        email: (value) => {
            if (!value) return 'L\'email est requis';
            if (!/\S+@\S+\.\S+/.test(value)) return 'Format d\'email invalide';
            return null;
        },
        password: (value) => {
            if (!value) return 'Le mot de passe est requis';
            if (value.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères';
            return null;
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            console.log('Tentative de connexion avec:', values); // Debug log
            
            // Simulation d'appel API - remplacez par votre axios réel
            const mockApiCall = async () => {
                // Simuler l'appel axios original
                // const res = await axios.post('http://localhost:4400/api/auth/login', values);

                // Simulation pour la démonstration
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Générer un faux JWT décodable (header.payload.signature)
                const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
                const payload = btoa(JSON.stringify({
                    nom: 'Utilisateur',
                    email: values.email,
                    id: '123',
                    role: 'etudiant',
                    exp: Math.floor(Date.now() / 1000) + 60 * 60
                }));
                const signature = 'simulatedsignature';
                const fakeToken = `${header}.${payload}.${signature}`;

                return {
                    data: {
                        token: fakeToken,
                        user: {
                            id: '123',
                            role: 'etudiant', // ou 'admin' pour tester
                            email: values.email
                        }
                    }
                };
            };

            const res = await mockApiCall();
            console.log('Réponse du serveur:', res.data); // Debug log

            if (res.data.token) {
                // Note: localStorage ne fonctionne pas dans l'environnement Claude.ai
                // Dans votre vraie application, ces lignes fonctionneront normalement
                try {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userRole', res.data.user?.role || 'etudiant');
                    localStorage.setItem('userId', res.data.user?.id || '');
                } catch (e) {
                    console.log('localStorage non disponible dans cet environnement');
                }
                
                // Redirige selon le rôle
                if (res.data.user?.role === 'admin') {
                    alert('Connexion réussie ! Redirection vers /Admin...');
                    window.location.href = '/Admin';
                } else {
                    alert('Connexion réussie ! Redirection vers /Environnement...');
                    window.location.href = '/Environnement';
                }
            } else {
                console.error('Pas de token reçu dans la réponse');
                alert('Erreur de connexion: Token non reçu');
            }
        } catch (err) {
            console.error('Erreur complète:', err);
            // Simulation de la gestion d'erreur axios
            if (err.response) {
                console.log('Status:', err.response?.status);
                console.log('Message:', err.response?.data);
            }
            alert('Échec de la connexion au serveur. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    // Composant Formik simplifié pour l'environnement Claude.ai
    const FormikSimulator = ({ children, initialValues, validationSchema, onSubmit }) => {
        const [values, setValues] = useState(initialValues);
        const [errors, setErrors] = useState({});
        const [isSubmitting, setIsSubmitting] = useState(false);

        const validate = () => {
            const newErrors = {};
            Object.keys(validationSchema).forEach(field => {
                const error = validationSchema[field](values[field]);
                if (error) newErrors[field] = error;
            });
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        const handleSubmit = async (e) => {
            if (e) e.preventDefault();
            if (!validate()) return;
            setIsSubmitting(true);
            await onSubmit(values, { setSubmitting: setIsSubmitting });
        };

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                {children({ values, errors, handleChange, handleSubmit, isSubmitting })}
            </form>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex">
                {/* Section Image à gauche */}
                <div className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 p-12 flex items-center justify-center relative overflow-hidden">
                    {/* Éléments flottants */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-16 text-blue-200 opacity-60 animate-bounce">
                            <Sparkles size={24} />
                        </div>
                        <div className="absolute bottom-32 right-20 text-blue-200 opacity-60 animate-pulse">
                            <Bookmark size={20} />
                        </div>
                        <div className="absolute top-40 right-16 text-blue-200 opacity-60 animate-bounce delay-1000">
                            <BookOpen size={28} />
                        </div>
                        <div className="absolute bottom-20 left-20 text-blue-200 opacity-40 animate-pulse delay-500">
                            <BookOpen size={32} />
                        </div>
                    </div>
                    
                    {/* Illustration du livre principal */}
                    <div className="relative transform -rotate-12 hover:rotate-0 transition-transform duration-700">
                        <div className="w-80 h-96 bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-2xl relative overflow-hidden">
                            {/* Couverture du livre */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 p-8 flex flex-col justify-center items-center">
                                <BookOpen className="text-white mb-6" size={56} />
                                <h3 className="text-white text-3xl font-bold text-center mb-3">
                                    BIBLIOTHÈQUE
                                </h3>
                                <p className="text-blue-200 text-lg text-center mb-4">
                                    Numérique
                                </p>
                                <div className="border-t border-blue-300 pt-4">
                                    <p className="text-blue-100 text-sm text-center">
                                        Portail d&apos;accès
                                    </p>
                                </div>
                            </div>
                            
                            {/* Tranche du livre */}
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-b from-blue-900 to-blue-800 rounded-l-lg shadow-inner"></div>
                            
                            {/* Pages du livre */}
                            <div className="absolute right-4 top-6 bottom-6 w-3 bg-gradient-to-b from-white to-gray-100 rounded-r-sm shadow-inner">
                                <div className="w-full h-full bg-white opacity-90 rounded-r-sm"></div>
                            </div>
                            
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
                        </div>
                        
                        {/* Ombre du livre */}
                        <div className="absolute -bottom-8 -right-8 w-80 h-96 bg-blue-900 opacity-20 rounded-lg transform rotate-3 -z-10"></div>
                    </div>
                    
                    {/* Texte d'accompagnement */}
                    <div className="absolute bottom-16 left-12 right-12 text-center">
                        <h2 className="text-white text-3xl font-bold mb-3">
                            Bienvenue
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Accédez à votre espace de travail numérique
                        </p>
                    </div>
                </div>
                
                {/* Section Formulaire à droite */}
                <div className="flex-1 p-12 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-blue-900 mb-3">Connexion</h1>
                            <p className="text-blue-600 text-lg">Connectez-vous à votre compte</p>
                        </div>

                        <FormikSimulator
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                                <>
                                    <div className="space-y-6">
                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-blue-800 mb-2">
                                                Adresse e-mail
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                                                    errors.email ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'
                                                }`}
                                                placeholder="votre@email.com"
                                            />
                                            {errors.email && (
                                                <div className="text-sm text-red-500 mt-1 flex items-center">
                                                    <span className="mr-1">⚠️</span>
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        {/* Mot de passe */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-semibold text-blue-800 mb-2">
                                                Mot de passe
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-12 ${
                                                        errors.password ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'
                                                    }`}
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    tabIndex={-1}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <div className="text-sm text-red-500 mt-1 flex items-center">
                                                    <span className="mr-1">⚠️</span>
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>

                                        {/* Options */}
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="rememberMe"
                                                    checked={!!values.rememberMe}
                                                    onChange={handleChange}
                                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                                />
                                                <span className="ml-2 text-sm text-blue-700 font-medium">Se souvenir de moi</span>
                                            </label>
                                            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>

                                        {/* Bouton de connexion */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Connexion en cours...
                                                </span>
                                            ) : (
                                                'Se connecter'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </FormikSimulator>

                        {/* Lien d'inscription */}
                        <div className="mt-8 text-center text-sm text-blue-600">
                            Vous n&apos;avez pas de compte ?{' '}
                            <a href="/Inscription" className="text-blue-700 hover:text-blue-900 font-semibold transition-colors">
                                Créer un compte
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}