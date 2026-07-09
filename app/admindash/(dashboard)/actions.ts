'use server'

import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

export async function generateTempPassword(userId: string) {
  // Simple random 6-character temp password
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let tempPassword = ''
  for (let i = 0; i < 6; i++) {
    tempPassword += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  const hashedPassword = await bcrypt.hash(tempPassword, 10)
  const supabase = await createClient()
  
  const { error } = await (supabase as any)
    .from('app_users')
    .update({ 
      password_hash: hashedPassword, 
      is_temp_password: true,
      reset_requested: false
    })
    .eq('id', userId)
    
  if (error) return { error: 'Failed to generate temp password.' }
  
  return { tempPassword }
}
