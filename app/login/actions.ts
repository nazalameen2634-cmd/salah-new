'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { setAuthCookie, removeAuthCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
  const phone = formData.get('phone') as string
  const password = formData.get('password') as string

  if (!phone || !password) {
    return { error: 'Phone number and password are required' }
  }
  
  if (!/^[0-9]{10}$/.test(phone)) {
    return { error: 'Please enter a valid 10-digit Indian phone number' }
  }

  const supabase = await createClient()

  // Find user by phone number
  const { data: user, error } = await (supabase as any)
    .from('app_users')
    .select('id, password_hash')
    .eq('phone_number', phone)
    .single()

  if (error || !user) {
    return { error: 'Invalid phone number or password.' }
  }

  // If user has a password set, verify it
  if (user.password_hash) {
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return { error: 'Invalid phone number or password.' }
    }
  }
  // (If no password_hash exists yet for legacy users, we allow login so they can set it later, 
  // or we could force them to reset it. For now, allow fallback for legacy accounts).

  await setAuthCookie(user.id)
  
  redirect('/')
}

export async function signup(formData: FormData) {
  const phone = formData.get('phone') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!phone || !name || !password) {
    return { error: 'All fields are required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return { error: 'Please enter a valid 10-digit Indian phone number' }
  }

  const supabase = await createClient()

  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const { data: user, error } = await (supabase as any)
    .from('app_users')
    .insert({
      phone_number: phone,
      name: name,
      password_hash: hashedPassword
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