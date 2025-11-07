import { createClient } from "@/lib/supabase/client";

async function AddCours ()  {
    
    const supabase = createClient()

    // Récupération des profs dans la base de données           
    const {data: profs, error: profsError} = await supabase
        .from("profs")
        .select("id, nom") 
        .order("nom");

    if (profsError) {
        console.error("Erreur Supabase (load):", profsError);
        return (
            <div className="m-4 text-red-600">
                Erreur lors du chargement du cours.
            </div>
        );
    }

    // Listes des professeurs récupérés
    const profsList = profs || [];

    return (    

<form action={async (formData) => {
                'use server';
                const supabase = createClient();
                const titre = formData.get('titre') as string;
                const code_cours = formData.get('code_cours') as string;
                const prof_id = formData.get('prof_id') as string
                
                if (titre && code_cours && prof_id) {
                    await supabase.from('cours').insert([{ titre, code_cours, prof_id}]);
                }
            }}>
                <div className="m-2">
                    <label className="block mb-1">titre:</label>
                    <input
                        type="text"
                        name="titre"
                        required
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <div className="m-2">
                    <label className="block mb-1">Code du cours:</label>
                    <input
                        type="text"
                        name="code_cours"
                        required
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                 {/* --- Ajout de la combobox --- */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-1" htmlFor="prof_id">
                        Professeur
                    </label>
                    <select
                        id="prof_id"
                        name="prof_id"
                        className="border rounded px-2 py-1 bg-white"
                    >
                    {/* Option pour "aucun prof" */}
                        <option value="">-- Aucun --</option>
                        {/* Mapper la liste des profs récupérée (cette partie était correcte) */}
                        {profsList.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                            {prof.nom}
                        </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded m-2"
                >
                    Ajouter
                </button>
</form>
    )}
    export default AddCours;