import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditProfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // On attend les params (Next 15 / React 19)
  const { id } = await params;

  const supabase = createClient();

  // Récupération du prof actuel
  const { data: prof, error } = await supabase
    .from("profs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur Supabase (load):", error);
    return (
      <div className="m-4 text-red-600">
        Erreur lors du chargement du professeur.
      </div>
    );
  }

  if (!prof) {
    return (
      <div className="m-4">
        Aucun professeur trouvé.
        <div className="mt-4">
          <Link
            href="/lesprofs"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  // --- Server Action locale (PAS dans actions.ts) ---
  async function updateProf(formData: FormData) {
    "use server";

    const idFromForm = formData.get("id") as string;
    const nom = formData.get("nom") as string;
    const specialite = formData.get("specialite") as string;

    if (!idFromForm) {
      throw new Error("ID du professeur manquant.");
    }

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("profs")
      .update({
        nom,
        specialite,
      })
      .eq("id", idFromForm);

    if (updateError) {
      console.error("Erreur Supabase (update):", updateError);
      throw new Error("Impossible de mettre à jour le professeur.");
    }

    // Retour à la fiche du prof après sauvegarde
    redirect(`/lesprofs/${idFromForm}`);
  }

  return (
    <div className="m-4 max-w-lg">
      <h1 className="text-3xl mb-4">Modifier le professeur</h1>

      <form
        action={updateProf}
        className="space-y-4 border rounded p-4 shadow-sm bg-white"
      >
        {/* on garde l'id caché pour l'action */}
        <input type="hidden" name="id" defaultValue={prof.id} />

        <div className="flex flex-col">
          <label className="font-semibold mb-1" htmlFor="nom">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            defaultValue={prof.nom ?? ""}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1" htmlFor="specialite">
            Spécialité
          </label>
          <input
            id="specialite"
            name="specialite"
            type="text"
            required
            defaultValue={prof.specialite ?? ""}
            className="border rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-2 pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Enregistrer
          </button>

          <Link
            href={`/lesprofs/${prof.id}`}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}