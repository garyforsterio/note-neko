'use server';

import { hash, compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { db } from '#lib/db';
import { redirect } from 'next/navigation';
import { sendEmail } from '#lib/email';
import { jwtVerify } from 'jose';
import { getTranslations } from 'next-intl/server';
import { ActionState } from './types';
import { z } from 'zod';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export async function signUp(state: ActionState, formData: FormData) {
  const t = await getTranslations();

  const result = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(', '),
    };
  }
  const existingUser = await db.user.findUnique({
    where: { email: result.data.email },
  });

  if (existingUser) {
    return {
      success: false,
      error: t('auth.signup.error.emailExists'),
    };
  }

  const passwordHash = await hash(result.data.password, 12);

  await db.user.create({
    data: {
      email: result.data.email,
      passwordHash,
    },
  });

  redirect('/auth/login?registered=true');
}

export async function login(state: ActionState, formData: FormData) {
  const t = await getTranslations();
  const result = loginSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(', '),
    };
  }
  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });

  if (!user) {
    return {
      success: false,
      error: t('auth.login.error.invalidCredentials'),
    };
  }

  const isValid = await compare(result.data.password, user.passwordHash);

  if (!isValid) {
    return {
      success: false,
      error: t('auth.login.error.invalidCredentials'),
    };
  }

  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/auth/login');
}

export async function requestPasswordReset(
  state: ActionState,
  formData: FormData
) {
  const t = await getTranslations();
  const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(', '),
    };
  }
  const user = await db.user.findUnique({
    where: { email: result.data.email },
  });

  if (!user) {
    // Don't reveal that the user doesn't exist
    return {
      success: true,
    };
  }

  const resetToken = crypto.randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await db.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  await sendEmail({
    to: result.data.email,
    subject: t('auth.forgotPassword.title'),
    text: t('auth.forgotPassword.emailText', { url: resetUrl }),
    html: t('auth.forgotPassword.emailHtml', { url: resetUrl }),
  });

  return {
    success: true,
  };
}

export async function resetPassword(state: ActionState, formData: FormData) {
  const t = await getTranslations();
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map((e) => e.message).join(', '),
    };
  }
  const user = await db.user.findFirst({
    where: {
      resetToken: result.data.token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return {
      success: false,
      error: t('auth.resetPassword.error.invalidToken'),
    };
  }

  const passwordHash = await hash(result.data.password, 12);

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  redirect('/auth/login?reset=true');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = await db.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
