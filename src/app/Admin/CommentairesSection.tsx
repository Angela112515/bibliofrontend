import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Commentaire {
  id: number;
  livre_id: number;
  utilisateur_id: number;
  commentaire: string;
  note: number | null;
  date_commentaire: string;
  utilisateur_nom?: string;
  livre_titre?: string;
}

const CommentairesSection = () => {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommentaires = async () => {
      try {
        const res = await axios.get('http://localhost:4400/api/commentaires/all');
        setCommentaires(res.data);
      } catch {
        setCommentaires([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommentaires();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Commentaires et notes des livres</h2>
      {loading ? (
        <div>Chargement...</div>
      ) : commentaires.length === 0 ? (
        <div className="text-gray-500">Aucun commentaire pour le moment.</div>
      ) : (
        <table className="table w-full mb-6">
          <thead>
            <tr>
              <th>Livre</th>
              <th>Utilisateur</th>
              <th>Commentaire</th>
              <th>Note</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {commentaires.map((c) => (
              <tr key={c.id}>
                <td>{c.livre_titre || c.livre_id}</td>
                <td>{c.utilisateur_nom || c.utilisateur_id}</td>
                <td>{c.commentaire}</td>
                <td>{c.note ? '★'.repeat(c.note) : '-'}</td>
                <td>{new Date(c.date_commentaire).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CommentairesSection;
