'use server';

import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { redirect } from '#i18n/navigation';
import { type ActionState } from '#actions/types';

const schema = z.object({
  // Add validation schema
});

export async function actionName(state: ActionState, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const result = schema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map((e) => e.message).join(', '),
      };
    }

    // Process data
    revalidateTag('path');
    redirect({
      href: '/success',
      locale: 'en',
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
