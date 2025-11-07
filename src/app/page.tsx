import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const { data: profs, error } = await supabase
   .from('profs')
   .select(`
      id,
      nom,
      specialite,
      cours (
        id,
        titre,
        code_cours
      )
    `);

  

  if (error) {
    console.error('Erreur lors de la récupération des données:', error);
    // Gérer l'erreur de manière appropriée dans l'UI
  }

  // Le reste du code pour afficher les données...
  return (
    <div>
      <div className='text-3xl'>Gestion Académique</div>
      <div className='text-xl'>   Affiche les cours    </div>
      {profs?.map(prof => (
        <div key={prof.id}>
          <div className='italic'>{prof.nom} - {prof.specialite} </div>
        </div>
      )) ?? <p>Aucun professeur trouvé.</p>}    
     
      {/* Ici, vous mapperez sur `profs` pour afficher la liste */}
    </div>
  );
}
