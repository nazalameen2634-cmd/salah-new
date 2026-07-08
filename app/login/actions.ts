'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { setAuthCookie, removeAuthCookie } from '@/lib/auth'

export async function login(formData: FormData) {
  const phone = formData.get('phone') as string
  if (!phone) {
    return { error: 'Phone number is required' }
  }

  const supabase = await createClient()

  // Find user by phone number
  const { data: user, error } = await (supabase as any)
    .from('app_users')
    .select('id')
    .eq('phone_number', phone)
    .single()

  if (error || !user) {
    return { error: error ? `Login failed: ${error.message}` : 'No account found with this phone number. Please sign up.' }
  }

  await setAuthCookie(user.id)
  
  redirect('/')
}

export async function signup(formData: FormData) {
  const phone = formData.get('phone') as string
  const name = formData.get('name') as string

  if (!phone || !name) {
    return { error: 'Name and phone number are required' }
  }

  const supabase = await createClient()

  // Create new user
  const { data: user, error } = await (supabase as any)
    .from('app_users')
    .insert({
      phone_number: phone,
      name: name
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: 'An account with this phone number already exists. Please log in.' }
    }
    return { error: `Failed to create account: ${error.message}` }
  }

  if (user) {
    await setAuthCookie(user.id)
  }

  redirect('/')
}

export async function signout() {
  await removeAuthCookie()
  redirect('/login')
}