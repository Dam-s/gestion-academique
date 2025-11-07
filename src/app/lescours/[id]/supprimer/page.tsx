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

  // On va chercher le cours pour afficher son nom dans l'écran de confirmation
  const { data: cours, error } = await supabase
    .from("cours")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur Supabase (load):", error);
    return (
      <div className="m-4 text-red-600">
        Erreur lors du chargement du cours.
      </div>
    );
  }

  if (!cours) {
    return (
      <div className="m-4">
        Cours introuvable.
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

  // --- Server Action locale pour suppression ---
  async function deleteCours(formData: FormData) {
    "use server";

    const idToDelete = formData.get("id") as string;

    if (!idToDelete) {
      throw new Error("ID du cours manquant pour la suppression.");
    }

    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("cours")
      .delete()
      .eq("id", idToDelete);

    if (deleteError) {
      console.error("Erreur Supabase (delete):", deleteError);
      throw new Error("Impossible de supprimer le cours.");
    }

    // Après suppression : retour à la liste des profs
    redirect("/lescours");
  }

  return (
    <div className="m-4 max-w-lg border rounded p-4 bg-white shadow-sm">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Supprimer le cours
      </h1>

      <p className="mb-2">
        Voulez-vous vraiment supprimer ce cours ?
      </p>

      <p className="mb-4 italic">
        <strong>{cours.titre}</strong> — {cours.code_cours}
      </p>

      <form action={deleteCours} className="flex items-center gap-2">
        {/* Champ caché pour envoyer l'ID à l'action */}
        <input type="hidden" name="id" defaultValue={cours.id} />

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          Oui, supprimer
        </button>

        <Link
          href={`/lescours/${cours.id}`}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:opacity-90"
        >
          Annuler
        </Link>
      </form>
    </div>
  );
}