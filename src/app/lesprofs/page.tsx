import React from 'react';
import { createClient } from '@/lib/supabase/server';
import AddProf from '@/components/addprof';
import Link from 'next/link';

const ProfPage = async () => {
    const supabase = createClient();
    
    const {data:profs, error}=await supabase.from('profs').select('*');
    

    return     (
        <div>
            <div className='text-3xl m-4'>Page des Profs</div>
            <div className='text-xl m-4'>Liste des professeurs</div>
            {profs?.map((prof)=>(
                <div key={prof.id} className='m-2 italic flex items-center'>
                    {prof.portrait && (
                        <img 
                            src={prof.portrait} 
                            alt={`Photo de ${prof.nom}`}
                            className="w-10 h-10 rounded-full mr-2 object-cover"
                        />
                    )}
                    {prof.nom} - {prof.specialite} 
                    <Link 
                        className='ml-2 bg-blue-500 text-white px-2 py-1 rounded'
                        href={`/lesprofs/${prof.id}`}  
                        >Détail
                    </Link>
                    <Link 
                        className='ml-2 bg-blue-500 text-white px-2 py-1 rounded'
                        href={`/lesprofs/${prof.id}/modifier`}  
                        >Modifier
                    </Link>
                    <Link 
                        className='ml-2 bg-blue-500 text-white px-2 py-1 rounded'
                        href={`/lesprofs/${prof.id}/supprimer`}  
                        >supprimer
                    </Link>
                </div>
            )) ?? <p>Aucun professeur trouvé.</p>}  

            <AddProf />
        </div>
        
    );

};   
export default ProfPage