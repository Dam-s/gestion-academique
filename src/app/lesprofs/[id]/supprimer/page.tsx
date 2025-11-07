import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DeleteCoursPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15 / React 19 : params est une Promise
  const { id } = await params;

  const supabase = createClient();

  // On va chercher le prof pour afficher son nom dans l'écran de confirmation
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
        Professeur introuvable.
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

  // --- Server Action locale pour suppression ---
  async function deleteProf(formData: FormData) {
    "use server";

    const idToDelete = formData.get("id") as string;

    if (!idToDelete) {
      throw new Error("ID du professeur manquant pour la suppression.");
    }

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("profs")
      .delete()
      .eq("id", idToDelete);

    if (deleteError) {
      console.error("Erreur Supabase (delete):", deleteError);
      throw new Error("Impossible de supprimer le professeur.");
    }

    // Après suppression : retour à la liste des profs
    redirect("/lesprofs");
  }

  return (
    <div className="m-4 max-w-lg border rounded p-4 bg-white shadow-sm">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Supprimer le professeur
      </h1>

      <p className="mb-2">
        Voulez-vous vraiment supprimer ce professeur ?
      </p>

      <p className="mb-4 italic">
        <strong>{prof.nom}</strong> — {prof.specialite}
      </p>

      <form action={deleteProf} className="flex items-center gap-2">
        {/* Champ caché pour envoyer l'ID à l'action */}
        <input type="hidden" name="id" defaultValue={prof.id} />

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          Oui, supprimer
        </button>

        <Link
          href={`/lesprofs/${prof.id}`}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:opacity-90"
        >
          Annuler
        </Link>
      </form>
    </div>
  );
}