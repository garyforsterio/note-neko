import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '#lib/db';
import { redirect } from '#i18n/navigation';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value;

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

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function ensureLoggedIn() {
  const user = await getCurrentUser();
  if (!user) {
    redirect({
      href: '/auth/login',
      locale: 'en',
    });
  }
}
