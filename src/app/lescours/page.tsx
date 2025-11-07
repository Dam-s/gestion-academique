import React from 'react';
import { createClient } from '@/lib/supabase/server';
import CoursPasProfPage from '@/components/courspasprof';
import Link from 'next/link';
import AddCours from '@/components/addcours';

const CoursPage = async () => {
    const supabase = createClient();
    
    const {data:cours,error}=await supabase.from('cours').select('*');
     

    return     (
        <div>
            <div className='text-3xl m-4'>Page des cours</div>
            <div className='text-xl m-4'>Liste des cours</div>
            {cours?.map((c)=>(
                <div key={c.id} className='m-2 flex items-center'> {c.code_cours} - {c.titre}
                    <Link 
                        className='ml-2 bg-blue-500 text-white px-2 py-1 rounded'
                        href={`/lescours/${c.id}`}  
                        >Détail
                    </Link>
                    <Link 
                        className='ml-2 bg-blue-500 text-white px-2 py-1 rounded'
                        href={`/lescours/${c.id}/modifier`}  
                        >Modifier
                    </Link>
                    <Link 
                        className='ml-2 bg-blue-500 text-white px-2 py-1 rounded'
                        href={`/lescours/${c.id}/supprimer`}  
                        >supprimer
                    </Link>   
                </div>
            )) ?? <p>Aucun cours trouvé.</p>}  

            <AddCours/>
       {/* <CoursPasProfPage /> */}
        </div>

        
    );

};   
export default CoursPage