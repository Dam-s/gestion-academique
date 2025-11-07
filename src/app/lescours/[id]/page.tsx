import Link from "next/link";
import React from 'react';
import { createClient } from '@/lib/supabase/server';

interface idCours {
    params: {
        id: string
    };
}

export default async function CoursDetailPage({params} : { params : Promise<{id: string}>}) {
    
    const {id} = await params;

    console.log("ID du cours:",id);

    const supabase = createClient();
    const { data: cours, error } = await supabase
        .from('cours')
        .select('*, profs(nom)')
        .eq('id', id)
        .single();  

    if (error) {
        return <div>Erreur lors de la récupération des détails du cours.</div>;
    }   

    return (
        <div>
            <h1 className="text-3xl m-4">Détails du cours</h1> 
            {cours ? (
                <div className="m-4">
                    <p><strong>Nom:</strong> {cours.titre}</p> 
                    <p><strong>code du cours:</strong> {cours.code_cours}</p>
                    <p><strong>Professeur:</strong>{cours.profs.nom}</p>
                    <Link 
                        className='mt-4 mr-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
                        href={`/lescours/`}  
                        >Retour à la liste des cours
                    </Link>
                    <Link 
                        className='mt-4 mr-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
                        href={`/lescours/${cours.id}/modifier`}  
                        >Modifier le Cours
                    </Link>
                    <Link 
                        className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
                        href={`/lescours/${cours.id}/supprimer`}  
                        >Supprimer le Cours
                    </Link>
                </div>  
            ) : (
                <p>Aucun cours trouvé.</p>
            )}   
        </div>  
    );  
}