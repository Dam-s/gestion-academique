import React from 'react';
import { createClient } from '@/lib/supabase/server';

const CoursPasProfPage = async () => {
    const supabase = createClient();
    
    const {data:cours,error}=(await supabase.from('cours').select('*').is('prof_id',null));
     

    return     (
        <div>
            <div className='text-xl m-4'>Liste des cours pas de prof</div>
            {cours?.map((c)=>(
                <div key={c.id} className='m-2 '> {c.code_cours} - {c.titre} </div>
            )) ?? <p>Aucun cours trouvé.</p>}  

            
        </div>

        
    );

};   
export default CoursPasProfPage