import { cookies } from 'next/headers'

export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('custom_auth_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('custom_auth_user_id')
  return cookie?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('custom_auth_user_id')
}

export async function setAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })
}

export async function getAdminCookie(): Promise<boolean> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('admin_session')
  return cookie?.value === 'true'
}

export async function removeAdminCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}