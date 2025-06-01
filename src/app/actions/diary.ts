'use server';

import { revalidatePath } from 'next/cache';
import { createDiaryEntry, updateDiaryEntry, deleteDiaryEntry } from '#lib/dal';
import type { DiaryData } from '#lib/dal';
import { requireAuth } from '#lib/auth';
import { redirect } from '#i18n/navigation';
import { type ActionState } from './types';

import { z } from 'zod';

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

export async function createDiaryEntryAction(
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = {
      content: formData.get('content') as string,
      date: formData.get('date') as string,
      mentions: JSON.parse((formData.get('mentions') as string) || '[]'),
      locations: JSON.parse((formData.get('locations') as string) || '[]'),
    };

    const result = diarySchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }
    await createDiaryEntry({ ...result.data });
    revalidatePath('/diary');
  } catch (error) {
    console.error('Error creating diary entry:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create diary entry',
    };
  }
  return redirect({
    href: '/diary',
    locale: 'en',
  });
}

export async function updateDiaryEntryAction(
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = formData.get('id') as string;
    const data = {
      content: formData.get('content') as string,
      date: formData.get('date') as string,
      mentions: JSON.parse((formData.get('mentions') as string) || '[]'),
      locations: JSON.parse((formData.get('locations') as string) || '[]'),
    };

    const result = diarySchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }
    await updateDiaryEntry(id, { ...result.data });
    revalidatePath('/diary');
    revalidatePath(`/diary/${id}`);
  } catch (error) {
    console.error('Error updating diary entry:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update diary entry',
    };
  }
  return redirect({
    href: '/diary',
    locale: 'en',
  });
}

export async function deleteDiaryEntryAction(
  state: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get('id') as string;
  try {
    await requireAuth();
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
