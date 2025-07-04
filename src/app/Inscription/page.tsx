'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const schema = yup.object().shape({
  nom: yup.string().required('Le nom est requis'),
  prenom: yup.string().required('Le prénom est requis'),
  sexe: yup.string().oneOf(['Homme', 'Femme'], 'Le sexe est requis').required('Le sexe est requis'),
  telephone: yup.string().required('Le téléphone est requis'),
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  mot_de_passe: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
  role: yup.string().oneOf(['admin', 'etudiant'], 'Le rôle est requis').required('Le rôle est requis'),
});

type FormData = yup.InferType<typeof schema>;

export default function InscriptionForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const userData = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.mot_de_passe,
        telephone: data.telephone,
        sexe: data.sexe,
        role: data.role
      };

      console.log('Envoi des données:', userData);

      const response = await axios.post('http://localhost:4400/api/auth/signup', userData);
      
      console.log('Réponse du serveur:', response.data);

      if (response.data.error === true) {
        alert(response.data.message);
        return;
      }

      if (response.data.message && response.data.message.toLowerCase().includes('inscription réussie')) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        router.push('/Connexion');
      } else if (response.data.message && response.data.message.toLowerCase().includes('déjà utilisée')) {
        alert('Cette adresse email est déjà utilisée.');
      } else {
        alert(response.data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert('Cette adresse email est déjà utilisée.');
        } else {
          alert('Erreur lors de l\'inscription : ' + (error.response?.data?.Message || error.message));
        }
      } else {
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden h-[600px]">
        {/* Section image avec des livres - Prend toute la hauteur et largeur */}
        <div className="hidden md:block md:w-1/2 relative">
          <Image 
            src="/Assets/biblio.jpg" 
            alt="Livres pour l'éducation"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-blue-800/20 flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Bienvenue sur notre plateforme</h2>
              <p className="text-white/90">Rejoignez notre communauté d'apprentissage</p>
            </div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Créer un compte
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Rôle</label>
              <select
                {...register('role')}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                defaultValue="etudiant"
              >
                <option value="" disabled>Choisissez un rôle</option>
                <option value="etudiant">Étudiant</option>
                <option value="admin">Administrateur</option>
              </select>
              <p className="text-sm text-red-500 mt-1">{errors.role?.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Nom</label>
                <input
                  type="text"
                  {...register('nom')}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Votre nom"
                />
                <p className="text-sm text-red-500 mt-1">{errors.nom?.message}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">Prénom</label>
                <input
                  type="text"
                  {...register('prenom')}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Votre prénom"
                />
                <p className="text-sm text-red-500 mt-1">{errors.prenom?.message}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Sexe</label>
              <select
                {...register('sexe')}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                defaultValue=""
              >
                <option value="" disabled>Choisissez votre sexe</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
              <p className="text-sm text-red-500 mt-1">{errors.sexe?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Téléphone</label>
              <input
                type="text"
                {...register('telephone')}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Votre numéro"
              />
              <p className="text-sm text-red-500 mt-1">{errors.telephone?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="exemple@email.com"
              />
              <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Mot de passe</label>
              <input
                type="password"
                {...register('mot_de_passe')}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
              />
              <p className="text-sm text-red-500 mt-1">{errors.mot_de_passe?.message}</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md"
            >
              S'inscrire
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-600">
              Déjà un compte?{' '}
              <a href="/Connexion" className="font-medium text-blue-800 hover:underline">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}