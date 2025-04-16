'use server';
import { cookies } from 'next/headers';

export async function setJwtCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'jwt',
    value: jwt,
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7  // One week
  });
}
