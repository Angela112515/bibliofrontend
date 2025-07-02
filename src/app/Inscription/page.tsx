'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
      // Modification du corps de la requête pour correspondre à l'attente du backend
      const userData = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        password: data.mot_de_passe, // Changement de mot_de_passe à password pour correspondre au backend
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Inscription
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              {...register('role')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              defaultValue="etudiant"
            >
              <option value="" disabled>Choisissez un rôle</option>
              <option value="etudiant">Étudiant</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-sm text-red-500">{errors.role?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              {...register('nom')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Votre nom"
            />
            <p className="text-sm text-red-500">{errors.nom?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              {...register('prenom')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Votre prénom"
            />
            <p className="text-sm text-red-500">{errors.prenom?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
            <select
              {...register('sexe')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              defaultValue=""
            >
              <option value="" disabled>Choisissez votre sexe</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
            <p className="text-sm text-red-500">{errors.sexe?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="text"
              {...register('telephone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Votre téléphone"
            />
            <p className="text-sm text-red-500">{errors.telephone?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Votre email"
            />
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              {...register('mot_de_passe')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Votre mot de passe"
            />
            <p className="text-sm text-red-500">{errors.mot_de_passe?.message}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}