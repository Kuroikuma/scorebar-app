import { create } from 'zustand'
import { useGameStore } from './gameStore';
import { useTeamsStore } from './teamsStore';



type OverlayState = {
  changeRunsByInningOverlay: (teamIndex: number, runsInning: number) => void
  incrementRunsOverlay: (teamIndex: number, runs: number, runsInning: number) => void
}

export const useOverlayStore = create<OverlayState>((set, get) => ({
  changeRunsByInningOverlay: async (teamIndex, runs) => {
    const { runsByInning, inning } = useGameStore.getState()

    const inningKey = `${inning}T${teamIndex + 1}`; // Ejemplo: "3T1" o "3T2"

    // Actualiza las carreras por inning
    const updatedRunsByInning = {
      ...runsByInning,
      [inningKey]: runs,
    };
    useGameStore.setState({ runsByInning: updatedRunsByInning });
  },
  incrementRunsOverlay: async (teamIndex, runs, runsInning) => {
    const { changeRunsByInningOverlay } = get();
    
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, runs } : team
      )
    }))

    changeRunsByInningOverlay(teamIndex, runsInning)
  },
}));

