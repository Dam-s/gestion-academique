import Link from "next/link";
import React from 'react';
import { createClient } from '@/lib/supabase/server';

interface idProf {
    params: {
        id: string
    };
}

export default async function ProfDetailPage({params} : { params : Promise<{id: string}>}) {
    
    const {id} = await params;

    console.log("ID du professeur:",id);

    const supabase = createClient();
    const { data: prof, error } = await supabase
        .from('profs')
        .select('*')
        .eq('id', id)
        .single();  

    if (error) {
        return <div>Erreur lors de la récupération des détails du professeur.</div>;
    }   

    return (
        <div>
            <h1 className="text-3xl m-4">Détails du Professeur</h1> 
            {prof ? (
                <div className="m-4">
                    <p><strong>Nom:</strong> {prof.nom}</p> 
                    <p><strong>Spécialité:</strong> {prof.specialite}</p>

                    <Link 
                        className='mt-4 mr-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
                        href={`/lesprofs/`}  
                        >Retour à la liste des professeurs
                    </Link>
                    <Link 
                        className='mt-4 mr-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
                        href={`/lesprofs/${prof.id}/modifier`}  
                        >Modifier le Professeur
                    </Link>
                    <Link 
                        className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded'
                        href={`/lesprofs/${prof.id}/supprimer`}  
                        >Supprimer le Professeur
                    </Link>
                </div>  
            ) : (
                <p>Aucun professeur trouvé.</p>
            )}   
        </div>  
    );  
}