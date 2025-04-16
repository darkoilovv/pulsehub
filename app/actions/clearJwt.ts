'use server'
import { cookies } from 'next/headers'

export async function clearJwt() {
  (await cookies()).delete('jwt')
}
