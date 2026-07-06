'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const pin = formData.get('pin') as string

  // Simple PIN verification before calling Supabase
  if (pin !== '1526') {
    redirect('/login?error=Invalid PIN')
  }

  // Hardcoded Supabase credentials since this is a private dashboard
  // and the user only wants a PIN interface
  const data = {
    email: 'nazalameen2634@gmail.com',
    password: 'Niyas@1100',
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=Authentication failed in Supabase')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
