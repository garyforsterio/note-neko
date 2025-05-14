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
import type { CreatePersonData, UpdatePersonData } from '@/lib/db';

export async function createPersonAction(data: {
  name: string;
  birthday: string | null;
  howWeMet: string | null;
  interests: string[];
  notes: string | null;
}) {
  try {
    await createPerson(data);
    revalidatePath('/people');
    return { success: true };
  } catch (error) {
    console.error('Error creating person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create person',
    };
  }
}

export async function updatePersonAction(
  id: string,
  data: {
    name?: string;
    birthday?: string | null;
    howWeMet?: string | null;
    interests?: string[];
    notes?: string | null;
  }
) {
  try {
    await updatePerson(id, data);
    revalidatePath('/people');
    revalidatePath(`/people/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update person',
    };
  }
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

export async function createDiaryEntryAction(data: {
  content: string;
  date: string;
  mentions?: string[];
}) {
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

export async function updateDiaryEntryAction(
  id: string,
  data: {
    content?: string;
    date?: string;
    mentions?: string[];
  }
) {
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
