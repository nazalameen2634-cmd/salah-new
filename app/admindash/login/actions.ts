'use server'

import { redirect } from 'next/navigation'
import { setAdminCookie, removeAdminCookie } from '@/lib/auth'

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Hardcoded credentials for the admin dashboard
  if (email === 'admin@salahnazal' && password === 'SALAH-deendash2026') {
    await setAdminCookie()
    redirect('/admindash')
  } else {
    return { error: 'Invalid admin credentials' }
  }
}

export async function adminLogout() {
  await removeAdminCookie()
  redirect('/admindash/login')
}
