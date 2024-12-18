import { create } from 'zustand'

export type Team = {
  name: string
  runs: number
  color: string
  textColor: string
  logo?: string
}

type TeamsState = {
  teams: Team[]
  setTeams: (teams: Team[]) => void
  incrementRuns: (teamIndex: number) => void
}

export const useTeamsStore = create<TeamsState>((set) => ({
  teams: [
    { 
      name: "ST DOMINGO", 
      runs: 0, 
      color: "#2057D1",
      textColor: "#ffffff",
      logo: "",
    },
    { 
      name: "JUIGALPA", 
      runs: 0, 
      color: "#A31515",
      textColor: "#ffffff",
      logo: "",
    },
  ],
  setTeams: (teams) => set({ teams }),
  incrementRuns: (teamIndex) => set((state) => ({
    teams: state.teams.map((team, index) => 
      index === teamIndex ? { ...team, runs: team.runs + 1 } : team
    )
  })),
}))

