import { create } from 'zustand'
import { scoreRun } from '@/service/api'
import { SetOverlayContent } from '@/service/apiOverlays'

export type Team = {
  name: string
  runs: number
  color: string
  textColor: string
  logo?: string
}

export type TeamsState = {
  gameId: string | null
  teams: Team[]
  setTeams: (teams: Team[]) => void
  incrementRuns: (teamIndex: number, newRuns: number, isSaved?: boolean) => Promise<void>
  changeTeamName: (teamIndex: number, newName: string) => void
  setGameId: (id: string) => void
  changeTeamColor: (teamIndex: any, newColor: any) => Promise<void>
  changeTeamTextColor: (teamIndex: any, newTextColor: any) => Promise<void>
}

export const useTeamsStore = create<TeamsState>((set, get) => ({
  gameId: null,
  teams: [
    { 
      name: "HOME", 
      runs: 0, 
      color: "#2057D1",
      textColor: "#ffffff",
      logo: "",
    },
    { 
      name: "AWAY", 
      runs: 0, 
      color: "#A31515",
      textColor: "#ffffff",
      logo: "",
    },
  ],
  setTeams: (teams) => set({ teams }),
  incrementRuns: async (teamIndex, newRuns, isSaved=true) => {
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, runs: team.runs + newRuns } : team
      )
    }))
    if (get().gameId && isSaved) {
      let runs = get().teams[teamIndex].runs

      let overlayId = "6KkoM6UT5iTjby4XOpVAdT";
      let contentId = "fc28bef1-32f2-4088-85df-ba7fc3f10484";
  
      let contendName = `Team ${teamIndex + 1} Runs`;
      let content = {
        [contendName]: runs
      };
  
      try {
        // Enviar al overlay
        await SetOverlayContent(overlayId, contentId, content);
      } catch (error) {
        console.error('Failed to update overlay content:', error);
        // No detener la operación si el overlay falla
      }
      await scoreRun(get().gameId!, teamIndex, newRuns)
    }
  },
  changeTeamName: async (teamIndex, newName) => {
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, name: newName } : team
      )
    }))
  },
  changeTeamColor: async (teamIndex, newColor) => {
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, color: newColor } : team
      )
    }))
  },
  changeTeamTextColor: async (teamIndex, newTextColor) => {
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, textColor: newTextColor } : team
      )
    }))
  },
  setGameId: (id) => set({ gameId: id }),
}))