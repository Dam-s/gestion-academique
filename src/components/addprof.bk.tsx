import { createClient } from "@/lib/supabase/client";


interface sendData {
    nom : string;
    specialite : string;
    portraits : string[]; // Changé pour supporter plusieurs images
}

const AddProf = () => {
    return (    

<form action={async (formData) => {
                'use server';
                const supabase = createClient();
                const nom = formData.get('nom') as string;
                const specialite = formData.get('specialite') as string;
                const files = formData.getAll('portraits') as File[];
                
                // Tableau pour stocker toutes les URLs des images
                const portraitUrls: string[] = [];

                // Traitement de chaque fichier
                for (const file of files) {
                    if (file && file.size > 0) {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
                        const filePath = `image_prof/${fileName}`;

                        console.log('Uploading file to path:', filePath);

                        const { error: uploadError } = await supabase.storage
                            .from('image_prof')
                            .upload(filePath, file);
                        
                        if (uploadError) {
                            console.error('Error uploading portrait:', uploadError);
                            continue; // Continue avec le fichier suivant en cas d'erreur
                        }

                        const { data: urlData } = supabase.storage
                            .from('image_prof')
                            .getPublicUrl(filePath);

                        portraitUrls.push(urlData.publicUrl);
                    }
                }

                const profData: sendData = {
                    nom : nom,
                    specialite : specialite,
                    portraits : portraitUrls 
                };
                
                if (nom && specialite && portraitUrls.length > 0) {
                    await supabase.from('profs').insert([profData]);
                }
            }}>
                <div className="m-2">
                    <label className="block mb-1">Nom:</label>
                    <input
                        type="text"
                        name="nom"
                        required
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <div className="m-2">
                    <label className="block mb-1">Spécialité:</label>
                    <input
                        type="text"
                        name="specialite"
                        required
                        className="border px-2 py-1 rounded w-full"
                    />
                </div>
                <div className="m-2">
                    <label className="block mb-1">Images (sélectionnez plusieurs images)</label>
                    <input
                        type="file"
                        name="portraits"
                        multiple
                        accept="image/*"
                        required
                        className="border px-2 py-1 rounded w-full"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                        Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs images
                    </p>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded m-2"
                >
                    Ajouter
                </button>
            </form>
    )}
    export default AddProf;