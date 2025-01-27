import { create } from 'zustand'
import { Game, useGameStore } from './gameStore';
import { Player, useTeamsStore } from './teamsStore';
import { ISocketData } from '@/components/scorebug/GameInnings';
import { ISocketDataPlayer } from '@/components/overlay/player-stats-overlay';



type OverlayState = {
  changeRunsByInningOverlay: (teamIndex: number, runsInning: number) => void
  incrementRunsOverlay: (teamIndex: number, runs: number, runsInning: number) => void
  changeOutCountOverlay: (out: number, strikes: number, balls: number) => void
  changeBallsCountOveraly: (balls: number) => void
  changeStrikesCountOveraly: (strikes: number) => void
  changeInningCountOverlay: (socketData: ISocketData) => void
  changeBasesRunnersOverlay: (baseIndex: number, isOccupied: boolean) => void
  changeHitsCountOverlay: (hits: number, teamIndex: number) => void
  changeErrorsGameOverlay: (errorsGame: number, teamIndex: number) => void
  updateGameOverlay: (game: Omit<Game, 'userId'>) => void
  changeShortNameOverlay: (shortName: string, teamIndex: number) => void
  changeTeamColorOverlay: (teamIndex: number, color: string) => void
  changeTeamTextColorOverlay: (teamIndex: number, textColor: string) => void
  changeTeamNameOverlay: (teamIndex: number, name: string) => void
  changeLineupOverlay: (teamIndex: number, lineup: Player[], lineupSubmitted: boolean) => void
  handlePlayerOverlay: (socketData: ISocketDataPlayer) => void
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
  changeOutCountOverlay: (out:number, strikes:number, balls:number) => {
    useGameStore.setState(({
      outs: out,
      strikes: strikes,
      balls: balls
    }))
  },
  changeBallsCountOveraly: (balls:number) => {
    useGameStore.setState(({
      balls: balls
    }))
  },
  changeStrikesCountOveraly: (strikes:number) => {
    useGameStore.setState(({
      strikes: strikes
    }))
  },
  changeInningCountOverlay: (socketData: ISocketData) => {
    useGameStore.setState(({
      inning: socketData.inning,
      isTopInning: socketData.isTopInning,
      balls: socketData.balls,
      strikes: socketData.strikes,
      outs: socketData.outs,
      bases: socketData.bases
    }))
  },
  changeBasesRunnersOverlay: (baseIndex, isOccupied) => {
    useGameStore.setState((state) => ({
      bases: state.bases.map((base, index) => index === baseIndex ? isOccupied : base)
    }))
  },
  changeHitsCountOverlay: (hits, teamIndex) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => index === teamIndex ? { ...team, hits } : team)
    }))
  },

  changeErrorsGameOverlay: (errorsGame, teamIndex) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => index === teamIndex ? { ...team, errorsGame } : team)
    }))
  },
  updateGameOverlay: (game) => {
    useGameStore.setState((state) => ({
      ...state,
      ...game
    }))

    useTeamsStore.setState((state) => ({
      ...state,
      ...game
    }))
  },
  changeShortNameOverlay: (shortName, teamIndex) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, shortName: shortName } : team
      )
    }))
  },
  changeTeamColorOverlay: (teamIndex, color) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, color: color } : team
      )
    }))
  },
  changeTeamTextColorOverlay: (teamIndex, textColor) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, textColor: textColor } : team
      )
    }))
  },
  changeTeamNameOverlay: (teamIndex, name) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, name: name } : team
      )
    }))
  },
  changeLineupOverlay: (teamIndex, lineup, lineupSubmitted) => {
    useTeamsStore.setState((state) => ({
      teams: state.teams.map((team, index) => 
        index === teamIndex ? { ...team, lineup: lineup, lineupSubmitted: lineupSubmitted } : team
      )
    }))
  },
  handlePlayerOverlay: (socketData: ISocketDataPlayer) => {
    useGameStore.setState((state) => ({
      ...state,
      bases: socketData.bases,
      strikes: socketData.strikes,
      balls: socketData.balls,
    }))

    useTeamsStore.setState((state) => ({
      ...state,
      teams: state.teams.map((team, index) => 
        index === socketData.teamIndex ? socketData.team : team
      )
    }))
  }
}));

