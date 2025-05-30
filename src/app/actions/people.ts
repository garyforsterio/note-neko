'use server';

import { createPerson, deletePerson, PersonData, updatePerson } from '#lib/dal';
import { requireAuth } from '#lib/auth';
import { z } from 'zod';
import { ActionState } from './types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const personSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  birthday: z.string().optional(),
  howWeMet: z.string().optional(),
  interests: z.array(z.string()),
  notes: z.string().optional(),
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

export async function createPersonAction(
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = getPersonFormFormData(formData);
    const result = personSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }
    await createPerson({ ...result.data });
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
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = getPersonFormFormData(formData);
    const result = personSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }

    await updatePerson(result.data.id, { ...result.data });

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
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  try {
    await requireAuth();
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
