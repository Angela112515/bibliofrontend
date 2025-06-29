'use client';

import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function HomePage() {

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        try {
            console.log('Tentative de connexion avec:', values); // Debug log
            const res = await axios.post('http://localhost:4400/api/auth/login', values);
            console.log('Réponse du serveur:', res.data); // Debug log

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                console.log('Token stocké:', res.data.token); // Debug log
                // Redirige vers la page environnement après connexion
                window.location.href = '/Environnement';
            } else {
                console.error('Pas de token reçu dans la réponse');
                alert('Erreur de connexion: Token non reçu');
            }
        } catch (err) {
            console.error('Erreur complète:', err);
            if (axios.isAxiosError(err)) {
                console.log('Status:', err.response?.status);
                console.log('Message:', err.response?.data);
            }
            alert('Échec de la connexion au serveur. Veuillez réessayer.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h2>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                            >
                                {isSubmitting ? 'Signing In...' : 'Sign In'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Do not have an account?{' '}
                    <a href="/Inscription" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
}