import { createClient } from "@/lib/supabase/client";


interface sendData {
    nom : string;
    specialite : string;
    portrait : string;
}

const AddProf = () => {
    return (    

<form action={async (formData) => {
                'use server';
                const supabase = createClient();
                const nom = formData.get('nom') as string;
                const specialite = formData.get('specialite') as string;
                const file = formData.get('portrait') as File;
                

                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}-${Date.now()}.${fileExt}`; //${Math.random()}-
                const filePath = `image_prof/${fileName}`;

                console.log('Uploading file to path:', filePath);

                const { error: uploadError } = await supabase.storage
                    .from('image_prof') // Nom de votre bucket
                    .upload(filePath, file);
                if (uploadError) {
                    console.error('Error uploading portrait:', uploadError);
                    return;
                }

                const { data: urlData } = supabase.storage
                    .from('image_prof') // Nom de votre bucket
                    .getPublicUrl(filePath);

                const portrait = urlData.publicUrl;

                const profData: sendData = {
                    nom : nom,
                    specialite : specialite,
                    portrait : portrait 
                };
                
                if (nom && specialite) {
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
                    <label className="block mb-1">Lien</label>
                    <input
                        type="file"
                        name="portrait"
                        required
                        className="border px-2 py-1 rounded w-full"
                    />
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