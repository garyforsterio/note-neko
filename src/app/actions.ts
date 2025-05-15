'use server';

import { revalidatePath } from 'next/cache';
import {
  createPerson,
  updatePerson,
  deletePerson,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} from '#lib/dal';
import type { DiaryData, PersonData } from '#lib/dal';
import { redirect } from 'next/navigation';

import { z } from 'zod';

const personSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  birthday: z.string().optional(),
  howWeMet: z.string().optional(),
  interests: z.array(z.string()),
  notes: z.string().optional(),
});

const diaryLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  placeId: z.string().min(1, 'Place ID is required'),
  lat: z.number(),
  lng: z.number(),
});

const diarySchema = z.object({
  content: z.string().min(1, 'Content is required'),
  date: z.string().min(1, 'Date is required'),
  mentions: z.array(z.string()),
  locations: z.array(diaryLocationSchema),
});

function getPersonFormFormData(formData: FormData): PersonData {
  const data = Object.fromEntries(formData);
  return {
    ...data,
    interests: (data.interests as string)
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean),
  } as PersonData;
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
    const data = getPersonFormFormData(formData);
    const result = personSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }
    await createPerson(result.data);
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
    const data = getPersonFormFormData(formData);
    const result = personSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }

    await updatePerson(result.data.id, result.data);

    revalidatePath('/people');
    revalidatePath(`/people/${result.data.id}`);
  } catch (error) {
    console.error('Error updating person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update person',
    };
  }
  redirect('/people');
}

export async function deletePersonAction(
  state: State,
  formData: FormData
): Promise<State> {
  const id = formData.get('id') as string;
  try {
    await deletePerson(id);
    revalidatePath('/people');
  } catch (error) {
    console.error('Error deleting person:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete person',
    };
  }
  redirect('/people');
}

export async function createDiaryEntryAction(data: DiaryData) {
  try {
    const result = diarySchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }
    await createDiaryEntry(result.data);
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
    const result = diarySchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }
    await updateDiaryEntry(id, result.data);
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
