'use server';

import { revalidatePath } from 'next/cache';
import {
  createPerson,
  updatePerson,
  deletePerson,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} from '@/lib/db';
import type { DiaryData, PersonData } from '@/lib/db';
import { redirect } from 'next/navigation';

function processFormData(formData: FormData): PersonData {
  return {
    id: formData.get('id') as string,
    name: formData.get('name') as string,
    birthday: (formData.get('birthday') as string) || null,
    howWeMet: (formData.get('howWeMet') as string) || null,
    interests: (formData.get('interests') as string)
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean),
    notes: (formData.get('notes') as string) || null,
  };
}

export type State = {
  success?: boolean;
  error?: string;
};

export async function createPersonAction(
  state: State,
  formData: FormData
): Promise<State> {
  try {
    const data = processFormData(formData);

    await createPerson(data);

    revalidatePath('/people');
  } catch (error) {
    console.error('Error creating person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create person',
    };
  }
  redirect('/people');
}

export async function updatePersonAction(
  state: State,
  formData: FormData
): Promise<State> {
  try {
    const id = formData.get('id') as string;
    const data = processFormData(formData);
    console.log(data);

    await updatePerson(id, data);

    revalidatePath('/people');
    revalidatePath(`/people/${id}`);
  } catch (error) {
    console.error('Error updating person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update person',
    };
  }
  redirect('/people');
}

export async function deletePersonAction(id: string) {
  try {
    await deletePerson(id);
    revalidatePath('/people');
    return { success: true };
  } catch (error) {
    console.error('Error deleting person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete person',
    };
  }
}

export async function createDiaryEntryAction(data: DiaryData) {
  try {
    await createDiaryEntry(data);
    revalidatePath('/diary');
    return { success: true };
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create diary entry',
    };
  }
}

export async function updateDiaryEntryAction(id: string, data: DiaryData) {
  try {
    await updateDiaryEntry(id, data);
    revalidatePath('/diary');
    revalidatePath(`/diary/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update diary entry',
    };
  }
}

export async function deleteDiaryEntryAction(id: string) {
  try {
    await deleteDiaryEntry(id);
    revalidatePath('/diary');
    return { success: true };
  } catch (error) {
    console.error('Error deleting diary entry:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete diary entry',
    };
  }
}
