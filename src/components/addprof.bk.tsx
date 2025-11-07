import { createClient } from "@/lib/supabase/client";

const AddProf = () => {
    return (    

<form action={async (formData) => {
                'use server';
                const supabase = createClient();
                const nom = formData.get('nom') as string;
                const specialite = formData.get('specialite') as string;                
                const portraitFile = formData.get('portrait') as File;
                let portraitUrl: string | null = null;

                if (portraitFile && portraitFile.size > 0) {
                    const fileExt = portraitFile.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const { data, error } = await supabase.storage
                        .from('image-prof')
                        .upload(fileName, portraitFile);

                    if (error) {
                        console.error('Error uploading portrait:', error);
                    } else {
                        portraitUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image-prof/${data.path}`;
                    }
                }
                
                if (nom && specialite) {
                    await supabase.from('profs').insert([{ nom, specialite, portrait: portraitUrl }]);
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
                    <label className="block mb-1">Portrait:</label>
                    <input
                        type="file"
                        name="portrait"
                        accept="image/*"
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