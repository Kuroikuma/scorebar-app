import { create } from 'zustand'
import { advanceBatterService, changeErrors, changeHits, scoreRun, updateLineupTeamService } from '@/app/service/api'
import { setLineupOverlay, SetOverlayContent } from '@/app/service/apiOverlays'
import { useGameStore } from './gameStore'
import { useConfigStore } from './configStore'

export type Player = {
  name: string
  position: string
  number: string
  battingOrder: number
}

export type Team = {
  name: string
  runs: number
  color: string
  textColor: string
  logo?: string
  lineup: Player[]
  currentBatter: number
  lineupSubmitted: boolean
  hits: number;
  errorsGame: number;
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
  incrementHits: (newHits: number) => Promise<void>
  incrementErrors: (newErrors: number) => Promise<void>
  updateHits: (newHits: number, teamIndex:number) => Promise<void>
  updateErrors: (newErrors: number, teamIndex:number) => Promise<void>
  decrementHits: (newHits:number) => Promise<void>
  decrementErrors: (newErrors:number) => Promise<void>
  updateLineup: (teamIndex: number, lineup: Player[]) => void
  advanceBatter: (teamIndex: number) => Promise<void>
  updatePlayer: (teamIndex: number, playerIndex: number, player: Player | null) => void
  submitLineup: (teamIndex: number) => Promise<void>
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
      hits: 0,
      errorsGame: 0,
      lineup: [],
      currentBatter: 0,
      lineupSubmitted: false
    },
    { 
      name: "AWAY", 
      runs: 0, 
      color: "#A31515",
      textColor: "#ffffff",
      logo: "",
      hits: 0,
      errorsGame: 0,
      lineup: [],
      currentBatter: 0,
      lineupSubmitted: false
    },
  ],
  setTeams: (teams) => set({ teams }),
  incrementRuns: async (teamIndex, newRuns, isSaved=true) => {
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, runs: team.runs + newRuns } : team
      )
    }))
    useGameStore.getState().changeRunsByInning(teamIndex, newRuns, isSaved)

    let runs = get().teams[teamIndex].runs

    let contendName = `${teamIndex + 1 === 1 ? "a" : "b"}Score`;
    let content = {
      [contendName]: runs
    };
    useGameStore.getState().setScoreBoardMinimal(content)

    if (get().gameId && isSaved) {

      let contendName = `Team ${teamIndex + 1} Runs`;
      let content = {
        [contendName]: runs
      };
  
      try {
        // Enviar al overlay
        await useGameStore.getState().setScoreBug(content);
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
  incrementHits: async (newHits) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, hits: team.hits + newHits } : team
      )
    }))
    const { updateHits } = get()
    updateHits(get().teams[teamIndex].hits, teamIndex)
  },
  decrementHits: async (newHits) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, hits: team.hits - newHits } : team
      )
    }))
    const { updateHits } = get()
    updateHits(get().teams[teamIndex].hits, teamIndex)
  },
  incrementErrors: async (newErrors) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, errorsGame: team.errorsGame + newErrors } : team
      )
    }))
    const { updateErrors } = get()
    updateErrors(get().teams[teamIndex].errorsGame, teamIndex)
  },
  decrementErrors: async (newErrors) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1
    set((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, errorsGame: team.errorsGame - newErrors } : team
      )
    }))
    const { updateErrors } = get()
    updateErrors(get().teams[teamIndex].errorsGame, teamIndex)
  },
  updateHits: async (newHits, teamIndex) => {
    let { id, } = useGameStore.getState()
    if (id) {
      const overlayId = useConfigStore.getState().currentConfig?.scoreboard.overlayId as string;
      const modelId = useConfigStore.getState().currentConfig?.scoreboard.modelId as string;
      let content = {
        [`Team ${teamIndex + 1} Hits`]: newHits
      }
      SetOverlayContent(overlayId, modelId, content)
      await changeHits(id!, newHits, teamIndex)
    }
  },
  updateErrors: async (newErrors, teamIndex) => {
    let { id } = useGameStore.getState()
    if (id) {
      const overlayId = useConfigStore.getState().currentConfig?.scoreboard.overlayId as string;
      const modelId = useConfigStore.getState().currentConfig?.scoreboard.modelId as string;
      let content = {
        [`Team ${teamIndex + 1} Errors`]: newErrors
      }
      SetOverlayContent(overlayId, modelId, content)
      await changeErrors(id!, newErrors, teamIndex)
    }
  },
  updateLineup: (teamIndex, lineup) => set((state) => ({
    teams: state.teams.map((team, index) =>
      index === teamIndex ? { ...team, lineup } : team
    )
  })),//advanceBatterService
  advanceBatter: async (teamIndex) => {
    const { teams } = get()
    let team = teams[teamIndex];
    const currentBatter = (team.currentBatter + 1) % team.lineup.length;

    set((state) => {
      const isDHEnabled = useGameStore.getState().isDHEnabled;
      const team = state.teams[teamIndex];
      let nextBatter = (team.currentBatter + 1) % team.lineup.length;
  
      if (isDHEnabled) {
        // Skip the pitcher if DH is enabled
        while (team.lineup[nextBatter].position === 'P') {
          nextBatter = (nextBatter + 1) % team.lineup.length;
        }
      }
  
      return {
        teams: state.teams.map((team, index) =>
          index === teamIndex ? { ...team, currentBatter: nextBatter } : team
        )
      };
    })
    
    await advanceBatterService(useGameStore.getState().id!, teamIndex, currentBatter)
  },
  updatePlayer: (teamIndex, playerIndex, player) => set((state) => {
    const team = state.teams[teamIndex];
    let newLineup;

    if (player) {
      // If adding or updating a player
      newLineup = [
        ...team.lineup.slice(0, playerIndex),
        player,
        ...team.lineup.slice(playerIndex + 1)
      ];
    } else {
      // If removing a player
      newLineup = team.lineup.filter((_, i) => i !== playerIndex);
    }

    // Recalculate batting order
    const isDHEnabled = useGameStore.getState().isDHEnabled;
    newLineup = newLineup.map((p, index) => ({
      ...p,
      battingOrder: isDHEnabled && p.position === 'P' ? 0 : index + 1
    }));

    return {
      teams: state.teams.map((team, index) =>
        index === teamIndex ? { ...team, lineup: newLineup } : team
      )
    };
  }),
  submitLineup: async (teamIndex) => {
    const { teams} = get()
    set((state) => ({
      teams: state.teams.map((team, index) =>
        index === teamIndex ? { ...team, lineupSubmitted: true } : team
      )
    }))
    setLineupOverlay(teams[teamIndex].lineup, teamIndex)
    await updateLineupTeamService({ teamIndex, lineup: teams[teamIndex].lineup, id: useGameStore.getState().id! })
  },
}))