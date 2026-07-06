import { create } from 'zustand'

interface AppState {
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

export const useStore = create<AppState>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date) => set({ currentDate: date }),
}))
