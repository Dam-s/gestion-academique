import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditCoursPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // On attend les params (Next 15 / React 19)
  const { id } = await params;

  const supabase = createClient();

  // Récupération du cours actuel
  const { data: cours, error: coursError} = await supabase
    .from("cours")
    .select("*")
    .eq("id", id)
    .single();
  
  // Récupération des profs
  const {data: profs, error: profsError} = await supabase
    .from("profs")
    .select("id, nom")
    .order("nom");

  if (coursError) {
    console.error("Erreur Supabase (load):", coursError);
    return (
      <div className="m-4 text-red-600">
        Erreur lors du chargement du cours.
      </div>
    );
  }

  if (!cours) {
    return (
      <div className="m-4">
        Aucun cours trouvé.
        <div className="mt-4">
          <Link
            href="/lescours"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

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

  // --- Server Action locale (PAS dans actions.ts) ---
  async function updateCours(formData: FormData) {
    "use server";

    const idFromForm = formData.get("id") as string;
    const titre = formData.get("titre") as string;
    const code_cours = formData.get("code_cours") as string;
    const prof_id = formData.get("prof_id") as string;
    // const prof_id = prof_id_str ? parseInt(prof_id_str, 10) : null;

    if (!idFromForm) {
      throw new Error("ID du cours manquant.");
    }

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("cours")
      .update({
        titre,
        code_cours,
        prof_id
      })
      .eq("id", idFromForm);

    if (updateError) {
      console.error("Erreur Supabase (update):", updateError);
      throw new Error("Impossible de mettre à jour le cours.");
    }

    // Retour à la fiche du cours après sauvegarde
    redirect(`/lescours/${idFromForm}`);
  }

  return (
    <div className="m-4 max-w-lg">
      <h1 className="text-3xl mb-4">Modifier le cours</h1>

      <form
        action={updateCours}
        className="space-y-4 border rounded p-4 shadow-sm bg-white"
      >
        {/* on garde l'id caché pour l'action */}
        <input type="hidden" name="id" defaultValue={cours.id} />

        <div className="flex flex-col">
          <label className="font-semibold mb-1" htmlFor="nom">
            Titre
          </label>
          <input
            id="titre"
            name="titre"
            type="text"
            required
            defaultValue={cours.titre ?? ""}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1" htmlFor="specialite">
            Code du cours
          </label>
          <input
            id="code_cours"
            name="code_cours"
            type="text"
            required
            defaultValue={cours.code_cours ?? ""}
            className="border rounded px-2 py-1"
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
            defaultValue={cours.prof_id ?? ""}
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

        <div className="flex items-center gap-2 pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Enregistrer
          </button>

          <Link
            href={`/lescours/${cours.id}`}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}