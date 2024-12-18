import { create } from 'zustand'

type UIState = {
  activeTab: string
  scoreboardStyle: "classic" | "modern"
  primaryColor: string
  primaryTextColor: string
  accentColor: string
  horizontalPosition: number
  verticalPosition: number
  setActiveTab: (tab: string) => void
  setScoreboardStyle: (style: "classic" | "modern") => void
  setPrimaryColor: (color: string) => void
  setPrimaryTextColor: (color: string) => void
  setAccentColor: (color: string) => void
  setHorizontalPosition: (position: number) => void
  setVerticalPosition: (position: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "controls",
  scoreboardStyle: "classic",
  primaryColor: "#000000",
  primaryTextColor: "#ffffff",
  accentColor: "#b70606",
  horizontalPosition: 0,
  verticalPosition: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setScoreboardStyle: (style) => set({ scoreboardStyle: style }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setPrimaryTextColor: (color) => set({ primaryTextColor: color }),
  setAccentColor: (color) => set({ accentColor: color }),
  setHorizontalPosition: (position) => set({ horizontalPosition: position }),
  setVerticalPosition: (position) => set({ verticalPosition: position }),
}))

