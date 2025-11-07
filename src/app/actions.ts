'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addProfessor(formData: FormData) {
  const supabase = createClient();
  const rawFormData = {
    nom: formData.get('nom') as string,
    specialite: formData.get('specialite') as string,
  };

  const { error } = await supabase.from('profs').insert([rawFormData]);

  if (error) {
    console.error('Erreur lors de l\'ajout du professeur:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/'); // Rafraîchit les données sur la page d'accueil
  return { success: true };
}
export async function updateProfessor(formData: FormData) {
  const supabase = createClient();
  const id = formData.get('id') as string;
  const rawFormData = {
    nom: formData.get('nom') as string,
    specialite: formData.get('specialite') as string,
  };

  const { error } = await supabase
   .from('profs')
   .update(rawFormData)
   .eq('id', id);

  if (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
export async function deleteProfessor(id: string) {
  const supabase = createClient();

  const { error } = await supabase
   .from('profs')
   .delete()
   .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/');
  return { success: true };
}
