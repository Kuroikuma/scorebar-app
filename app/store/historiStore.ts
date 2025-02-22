import { create } from 'zustand'
import { Game, useGameStore } from './gameStore'
import { Team, useTeamsStore } from './teamsStore'
import { useConfigStore } from './configStore'
import { changePastAndFutureGame } from '../service/api'


type HistoryState = {
  past: Partial<Omit<Game, "userId">>[]
  future: Partial<Omit<Game, "userId">>[]
  undo: () => void
  redo: () => void
  setStateWithHistory: (newPast: any) => void
  handleStrikeFlowHistory: (action: string) => void
  handleBallFlowHistory: () => void
  handleRunsHistory: (teamIndex: number) => void
  setPast: (past: Partial<Omit<Game, "userId">>[]) => void
  setFuture: (future: Partial<Omit<Game, "userId">>[]) => void
  handleBasesHistory: () => void
}


export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  setPast: (past) => set({ past }),
  setFuture: (future) => set({ future }),
  // Sets state with undo/redo history
  setStateWithHistory: (newPast) => {
    const past = get().past
    // Save the current state in 'past' before updating

    if (past.length > 10) {
      past.shift(); // Elimina el estado más antiguo
    }

    set((state) => ({
      ...state,
      past: [...past, newPast],
      future: [], // Clear future on new change
    }));

    changePastAndFutureGame(useGameStore.getState().id!, [...past, newPast], [])
  },

  // Undo last change
  undo: () => {
    const { past, future } = get();

    const teamState = useTeamsStore.getState()
    const gameState = useGameStore.getState()

    let game: Partial<Game> = {
      balls: gameState.balls,
      strikes: gameState.strikes,
      outs: gameState.outs,
      inning: gameState.inning,
      isTopInning: gameState.isTopInning,
      teams: teamState.teams,
      status: gameState.status,
      bases: gameState.bases,
      runsByInning: gameState.runsByInning,
      id: gameState.id,
      date: gameState.date as string,
      isDHEnabled: gameState.isDHEnabled,
      scoreboardOverlay: gameState.scoreboardOverlay,
      scorebugOverlay: gameState.scorebugOverlay,
      formationAOverlay: gameState.formationAOverlay,
      formationBOverlay: gameState.formationBOverlay,
      scoreboardMinimalOverlay: gameState.scoreboardMinimalOverlay,
      playerStatsOverlay: gameState.playerStatsOverlay,
    }

    if (past.length === 0) return; // Nothing to undo

    const previousState = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    const newFuture = Object.keys(previousState).reduce((acc, key) => {
      if (key in game) {
        if (key !== 'teams') {
          //@ts-ignore
          acc[key] = game[key as keyof typeof game];
        }
        
      }
      return acc;
    }, {} as Partial<typeof game>);

    if (previousState?.teams) {
      let offensiveTeamIndex = game.isTopInning ? 0 : 1;

      const updatedTeams = game?.teams?.map((team, index) => {
        if (index === offensiveTeamIndex) {

          // Obtener el equipo correspondiente desde game.teams basado en el índice
          const matchingTeam = (game?.teams as Team[])[offensiveTeamIndex];
    
          // Solo actualizamos las propiedades del equipo que existen en game.teams
          const updatedTeam = Object.keys(team).reduce((acc, key) => {
            if (key in (previousState.teams as Team[])[0]) {
              if (key !== 'lineup') {
                //@ts-ignore
                acc[key] = matchingTeam[key as keyof typeof matchingTeam];
              }
            } 
            return acc;
          }, {} as Team);

          if (matchingTeam.hasOwnProperty('lineup')) {
            updatedTeam.lineup = [matchingTeam.lineup[matchingTeam.currentBatter]];
          }

          return updatedTeam;
        } 
      });
  
      // Actualizar los equipos en el estado global
      newFuture.teams = (updatedTeams as Team[]).filter(item => item !== undefined) as Team[];
    }

    useGameStore.getState().loadGameHistory(previousState);
    set(() => ({
      past: newPast,
      future: [newFuture, ...future],
    }));

    changePastAndFutureGame(useGameStore.getState().id!, newPast, [newFuture, ...future])
  },

  // Redo last undone change
  redo: () => {
    const { future, past } = get();

    const teamState = useTeamsStore.getState()
    const gameState = useGameStore.getState()
    const id = gameState.id

    let game: Omit<Game, 'organizationId'> = {
      balls: gameState.balls,
      strikes: gameState.strikes,
      outs: gameState.outs,
      inning: gameState.inning,
      isTopInning: gameState.isTopInning,
      teams: teamState.teams,
      status: gameState.status,
      bases: gameState.bases,
      runsByInning: gameState.runsByInning,
      id: gameState.id,
      date: gameState.date as string,
      isDHEnabled: gameState.isDHEnabled,
      scoreboardOverlay: gameState.scoreboardOverlay,
      scorebugOverlay: gameState.scorebugOverlay,
      formationAOverlay: gameState.formationAOverlay,
      formationBOverlay: gameState.formationBOverlay,
      scoreboardMinimalOverlay: gameState.scoreboardMinimalOverlay,
      playerStatsOverlay: gameState.playerStatsOverlay,
    }

    if (future.length === 0) return; // Nothing to redo

    const nextState = future[0];
    const newFuture = future.slice(1);

    


    const newPast = Object.keys(nextState).reduce((acc, key) => {
      if (key in game) {
        if (key !== 'teams') {
          //@ts-ignore
          acc[key] = game[key as keyof typeof game];
        }
        
      }
      return acc;
    }, {} as Partial<typeof game>);

    if (nextState?.teams) {
      let offensiveTeamIndex = game.isTopInning ? 0 : 1;

      const updatedTeams = game.teams.map((team, index) => {
        if (index === offensiveTeamIndex) {

          // Obtener el equipo correspondiente desde game.teams basado en el índice
          const matchingTeam = game.teams[offensiveTeamIndex];
    
          // Solo actualizamos las propiedades del equipo que existen en game.teams
          const updatedTeam = Object.keys(team).reduce((acc, key) => {
            if (key in (nextState.teams as Team[])[0]) {
              if (key !== 'lineup') {
                //@ts-ignore
                acc[key] = matchingTeam[key as keyof typeof matchingTeam];
              }
            } 
            return acc;
          }, {} as Team);

          if (matchingTeam.hasOwnProperty('lineup')) {
            updatedTeam.lineup = [matchingTeam.lineup[matchingTeam.currentBatter]];
          }

          return updatedTeam;
        } 
      });
  
      // Actualizar los equipos en el estado global
      newPast.teams = updatedTeams.filter(item => item !== undefined) as Team[];
    }

    useGameStore.getState().loadGameHistory(nextState);

    set(() => ({
      past: [...past, newPast],
      future: newFuture,
    }));

    changePastAndFutureGame(useGameStore.getState().id!, [...past, newPast], newFuture)
  },
  handleStrikeFlowHistory: (action) => {
    const { strikes, balls, outs, bases, isTopInning, inning } = useGameStore.getState()
    const { teams } = useTeamsStore.getState()
    const { setStateWithHistory } = get()

    let newState:Partial<Omit<Game, "userId">> = {
      strikes: strikes,
    }

    if (((strikes + 1) === 3) || action === 'out' || action === 'inning' || action === 'error' || action === 'hit') {
      newState.outs = outs
      newState.strikes = strikes
      newState.balls = balls
      let cureentTeam = isTopInning ? 0 : 1
      newState.isTopInning = isTopInning
      //@ts-ignore
      newState.teams = [{
        name: teams[cureentTeam].name,
        currentBatter: teams[cureentTeam].currentBatter,
        lineup: [teams[cureentTeam].lineup[teams[cureentTeam].currentBatter]],
        runs: teams[cureentTeam].runs,
        hits: teams[cureentTeam].hits,
        errorsGame: teams[cureentTeam].errorsGame,
      }]
      
    }

    if (((strikes + 1) === 3 && outs + 1 === 3) || action === 'inning' || action === 'error' || action === 'hit') {
      newState.bases = bases
      newState.inning = inning
    }

    setStateWithHistory(newState)
  },
  handleBallFlowHistory: () => {
    const { balls, strikes, bases, isTopInning, runsByInning } = useGameStore.getState()
    const { teams } = useTeamsStore.getState()
    const { setStateWithHistory } = get()

    let newState:Partial<Omit<Game, "userId">> = {
      balls: balls,
    }

    if ((balls + 1) === 4) {
      newState.strikes = strikes
      newState.bases = bases
      let cureentTeam = isTopInning ? 0 : 1
      newState.isTopInning = isTopInning
      newState.runsByInning = runsByInning
      //@ts-ignore
      newState.teams = [{
        name: teams[cureentTeam].name,
        currentBatter: teams[cureentTeam].currentBatter,
        lineup: [teams[cureentTeam].lineup[teams[cureentTeam].currentBatter]],
        runs: teams[cureentTeam].runs,
      }]
      
    }

    setStateWithHistory(newState)
  },
  handleRunsHistory: (teamIndex) => {
    const { runsByInning } = useGameStore.getState()
    const { teams } = useTeamsStore.getState()
    const { setStateWithHistory } = get()

    let newState:Partial<Omit<Game, "userId">> = {
    //@ts-ignore
      teams: [{
        name: teams[teamIndex].name,
        runs: teams[teamIndex].runs,
      }],
      runsByInning: runsByInning,
    }
      
    setStateWithHistory(newState)
  },
  handleBasesHistory: () => {
    const { bases } = useGameStore.getState()
    const { setStateWithHistory } = get()

    let newState:Partial<Omit<Game, "userId">> = { bases}
      
    setStateWithHistory(newState)
  }
}));

