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
    .select('id, password_hash, is_temp_password')
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
  
  if (user.is_temp_password) {
    redirect('/change-password')
  } else {
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const phone = formData.get('phone') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string
  const security_q1 = formData.get('security_q1') as string
  const security_a1 = formData.get('security_a1') as string
  const security_q2 = formData.get('security_q2') as string
  const security_a2 = formData.get('security_a2') as string

  if (!phone || !name || !password || !security_q1 || !security_a1 || !security_q2 || !security_a2) {
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
      password_hash: hashedPassword,
      security_q1,
      security_a1: security_a1.toLowerCase().trim(),
      security_q2,
      security_a2: security_a2.toLowerCase().trim()
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

// --- Password Recovery & Temp Passwords ---

export async function checkPhoneAndGetQuestions(phone: string) {
  const supabase = await createClient()
  const { data: user, error } = await (supabase as any)
    .from('app_users')
    .select('id, security_q1, security_q2')
    .eq('phone_number', phone)
    .single()

  if (error || !user) {
    return { error: 'No account found with this phone number.' }
  }
  
  if (!user.security_q1 || !user.security_q2) {
    return { error: 'Security questions were not set up for this account. Please request admin help.', userId: user.id }
  }

  return { 
    userId: user.id, 
    questions: { q1: user.security_q1, q2: user.security_q2 } 
  }
}

export async function verifyAnswers(userId: string, a1: string, a2: string) {
  const supabase = await createClient()
  const { data: user, error } = await (supabase as any)
    .from('app_users')
    .select('security_a1, security_a2')
    .eq('id', userId)
    .single()
    
  if (error || !user) {
    return { error: 'User not found.' }
  }
  
  if (user.security_a1 !== a1.toLowerCase().trim() || user.security_a2 !== a2.toLowerCase().trim()) {
    return { error: 'Incorrect answers.' }
  }
  
  return { token: Buffer.from(userId).toString('base64') }
}

export async function requestAdminReset(userId: string) {
  const supabase = await createClient()
  const { error } = await (supabase as any)
    .from('app_users')
    .update({ reset_requested: true })
    .eq('id', userId)
    
  if (error) return { error: 'Failed to request reset.' }
  return { success: true }
}

export async function resetPassword(userId: string, token: string, newPassword: string) {
  if (Buffer.from(token, 'base64').toString() !== userId) {
    return { error: 'Invalid token.' }
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  const supabase = await createClient()
  const { error } = await (supabase as any)
    .from('app_users')
    .update({ 
      password_hash: hashedPassword, 
      is_temp_password: false,
      reset_requested: false
    })
    .eq('id', userId)
    
  if (error) return { error: 'Failed to reset password.' }
  
  redirect('/login')
}

export async function changeTempPassword(newPassword: string) {
  const { cookies } = await import('next/headers')
  const authCookie = (await cookies()).get('auth-token')
  if (!authCookie) return { error: 'Not authenticated.' }
  
  const userId = authCookie.value
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  const supabase = await createClient()
  const { error } = await (supabase as any)
    .from('app_users')
    .update({ 
      password_hash: hashedPassword, 
      is_temp_password: false 
    })
    .eq('id', userId)
    
  if (error) return { error: 'Failed to change password.' }
  
  redirect('/')
}