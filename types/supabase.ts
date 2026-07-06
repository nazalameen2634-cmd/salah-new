export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          settings: Json
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          settings?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          settings?: Json
          created_at?: string
        }
      }
      prayers: {
        Row: {
          id: string
          user_id: string
          date: string
          prayer_name: string
          completed: boolean
          completed_time: string | null
          jamaah: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          prayer_name: string
          completed?: boolean
          completed_time?: string | null
          jamaah?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          prayer_name?: string
          completed?: boolean
          completed_time?: string | null
          jamaah?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          color: string | null
          category: string | null
          frequency: string
          target: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          color?: string | null
          category?: string | null
          frequency?: string
          target?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string | null
          color?: string | null
          category?: string | null
          frequency?: string
          target?: number
          active?: boolean
          created_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          date: string
          completed: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          date: string
          completed?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          date?: string
          completed?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      journal: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: string | null
          reflection: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood?: string | null
          reflection?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: string | null
          reflection?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Prayer = Tables<'prayers'>
export type Habit = Tables<'habits'>
export type HabitLog = Tables<'habit_logs'>
export type Journal = Tables<'journal'>
