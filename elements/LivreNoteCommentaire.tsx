import React, { useEffect, useState } from 'react';

interface LivreNoteCommentaireProps {
  livreId: number | string;
}

// Affiche la note moyenne (étoiles) et le dernier commentaire pour un livre
const LivreNoteCommentaire: React.FC<LivreNoteCommentaireProps> = ({ livreId }) => {
  const [note, setNote] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nbAvis, setNbAvis] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4400/api/commentaires/livre/${livreId}`)
      .then(res => res.ok ? res.json() : [])
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Moyenne des notes
          const notes = data.filter((c: any) => typeof c.note === 'number').map((c: any) => c.note);
          const moyenne = notes.length > 0 ? notes.reduce((a: number, b: number) => a + b, 0) / notes.length : null;
          setNote(moyenne ? Math.round(moyenne * 10) / 10 : null);
          setNbAvis(data.length);
          // Dernier commentaire
          const last = data.sort((a: any, b: any) => new Date(b.date_commentaire).getTime() - new Date(a.date_commentaire).getTime())[0];
          setCommentaire(last && last.commentaire ? last.commentaire : null);
        } else {
          setNote(null);
          setCommentaire(null);
          setNbAvis(0);
        }
      })
      .catch(() => {
        setNote(null);
        setCommentaire(null);
        setNbAvis(0);
      })
      .finally(() => setLoading(false));
  }, [livreId]);

  return (
    <div className="flex flex-col gap-1 mt-1">
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
          <span>Chargement avis...</span>
        </div>
      ) : note !== null ? (
        <div className="flex items-center gap-2 text-xs">
          <span className="flex text-yellow-400 text-base">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.round(note) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
            ))}
          </span>
          <span className="text-gray-700 font-semibold">{note}/5</span>
          <span className="text-gray-400">({nbAvis} avis)</span>
        </div>
      ) : (
        <div className="text-xs text-gray-400">Aucun avis</div>
      )}
      {commentaire && (
        <div className="text-xs text-gray-500 italic truncate max-w-xs" title={commentaire}>
          "{commentaire}"
        </div>
      )}
    </div>
  );
};

export default LivreNoteCommentaire;
