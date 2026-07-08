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
          username: string | null
          email: string | null
          profile_picture: string | null
          country: string | null
          time_zone: string | null
          language: string | null
          role: string | null
          theme_preferences: Json | null
          notification_preferences: Json | null
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          username?: string | null
          email?: string | null
          profile_picture?: string | null
          country?: string | null
          time_zone?: string | null
          language?: string | null
          role?: string | null
          theme_preferences?: Json | null
          notification_preferences?: Json | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          username?: string | null
          email?: string | null
          profile_picture?: string | null
          country?: string | null
          time_zone?: string | null
          language?: string | null
          role?: string | null
          theme_preferences?: Json | null
          notification_preferences?: Json | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      prayers: {
        Row: {
          id: string
          user_id?: string | null
          date: string
          prayer_name: string
          completed: boolean
          completed_time: string | null
          jamaah: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          prayer_name: string
          completed?: boolean
          completed_time?: string | null
          jamaah?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
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
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id?: string | null
          name: string
          icon: string | null
          color: string | null
          category: string | null
          frequency: string
          target: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          icon?: string | null
          color?: string | null
          category?: string | null
          frequency?: string
          target?: number
          active?: boolean
          created_at?: string
          updated_at?: string
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
          updated_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          user_id?: string | null
          date: string
          completed: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id?: string | null
          date: string
          completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          date?: string
          completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      journal: {
        Row: {
          id: string
          user_id?: string | null
          date: string
          mood: string | null
          reflection: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          mood?: string | null
          reflection?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: string | null
          reflection?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fitness_logs: {
        Row: {
          id: string
          user_id?: string | null
          date: string
          calories_burned: number | null
          active_minutes: number | null
          steps: number | null
          water_intake_ml: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date: string
          calories_burned?: number | null
          active_minutes?: number | null
          steps?: number | null
          water_intake_ml?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          calories_burned?: number | null
          active_minutes?: number | null
          steps?: number | null
          water_intake_ml?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Prayer = Tables<'prayers'>
export type Habit = Tables<'habits'>
export type HabitLog = Tables<'habit_logs'>
export type Journal = Tables<'journal'>
export type FitnessLog = Tables<'fitness_logs'>
