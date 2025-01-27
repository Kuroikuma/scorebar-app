import { create } from 'zustand'
import { getGame, updateGameService, changeBallCount, changeStrikeCount, changeOutCount, changeInningService, changeBaseRunner, changeRunsByInningService, changeStatusService, setDHService, handlePositionOverlayServices, handleScaleOverlayServices, handleVisibleOverlayServices, getOverlay, handlePlayServices } from '@/app/service/api'
import { ITurnAtBat, Player, Team, TypeAbbreviatedBatting, TypeHitting, useTeamsStore } from './teamsStore'
import { ConfigGame, useConfigStore } from './configStore';
import { useHistoryStore } from './historiStore';
import { toast } from 'sonner';

export type Status = 'upcoming' | 'in_progress' | 'finished';

// Función auxiliar para registrar en el historial (evita repetición)
const registerHistory = (type: 'inning' | 'out' | 'strike') => {
  useHistoryStore.getState().handleStrikeFlowHistory(type);
};

let __initOverlays = {
  x: 100,
  y: 100,
  scale: 100,
  visible: false,
};

export type IOverlays = {
  visible: boolean;
  x: number;
  y: number;
  scale: number;
  id: string;
}

export interface Game {
  id: string | null;
  status: Status;
  teams: Team[];
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: boolean[];
  runsByInning: RunsByInning
  userId: string;
  configId: string | ConfigGame;
  date: string | Date;
  isDHEnabled: boolean;
  scoreboardOverlay: IOverlays;
  scorebugOverlay: IOverlays;
  formationAOverlay: IOverlays;
  formationBOverlay: IOverlays;
  scoreboardMinimalOverlay: IOverlays;
  playerStatsOverlay: IOverlays;
}

export interface RunsByInning {
  [inning: string]: number;
}

export type GameState = {
  id: string | null
  userId: string | null
  date: Date | string | null
  status: Status
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: boolean[]
  runsByInning: RunsByInning;
  setInning: (inning: number) => void
  setIsTopInning: (isTop: boolean) => void
  setBalls: (balls: number) => void
  setStrikes: (strikes: number) => void
  setOuts: (outs: number) => void
  setBases: (bases: boolean[]) => void
  setBase: (base: boolean, index: number) => void
  changeInning: (increment: boolean, isSaved?: boolean) => Promise<void>
  handleOutsChange: (newOuts: number, isSaved?: boolean) => Promise<void>
  handleStrikeChange: (newStrikes: number, isSaved?: boolean) => Promise<void>
  handleBallChange: (newBalls: number, isSaved?: boolean) => Promise<void>
  changeGameStatus: (newStatus: 'upcoming' | 'in_progress' | 'finished') => void
  loadGame: (id: string) => Promise<any>
  loadOverlay: (id: string) => Promise<any>
  updateGame: () => Promise<void>
  setScoreBug: (content: any) => Promise<void>
  changeIsTopInning: (isTopInning: boolean) => Promise<void>
  changeRunsByInning: (teamIndex: number, newRuns: number, isSaved?: boolean) => Promise<void>
  setScoreBoard: (content: any) => Promise<void>
  setScoreBoardMinimal: (content: any) => Promise<void>
  startGame: () => void
  endGame: () => void
  isDHEnabled: boolean
  setIsDHEnabled: (enabled: boolean) => Promise<void>
  getCurrentBatter: () => Player | null
  getCurrentPitcher: () => { name: string; number: string } | null
  advanceBatter: (isSaved?: boolean) => Promise<void>
  scoreboardOverlay: IOverlays;
  scorebugOverlay: IOverlays;
  formationAOverlay: IOverlays;
  formationBOverlay: IOverlays;
  scoreboardMinimalOverlay: IOverlays;
  playerStatsOverlay: IOverlays;
  handlePositionOverlay: (id: string, data: { x: number; y: number; }, isSaved?: boolean) => Promise<void>
  handleScaleOverlay: (id: string, scale: number, isSaved?: boolean) => Promise<void>
  handleVisibleOverlay: (id: string, visible: boolean, isSaved?: boolean) => Promise<void>
  handleSingle: () => Promise<void>
  handleDouble: () => Promise<void>
  handleTriple: () => Promise<void>
  handleHomeRun: () => Promise<void>
  handleHitByPitch: () => Promise<void>
  handleErrorPlay: (defensiveOrder: number) => Promise<void>
  handleOutPlay: ( isSaved:boolean) => Promise<void>
  handleBBPlay: () => Promise<void>
  loadGameHistory: (game: Partial<Omit<Game, "userId">>) => Promise<void>
}

export const useGameStore = create<GameState>((set, get) => ({
  id: null,
  userId: null,
  date: null,
  status: 'upcoming',
  inning: 1,
  isTopInning: true,
  balls: 0,
  strikes: 0,
  outs: 0,
  bases: [false, false, false],
  runsByInning: {},
  hits: 0,
  errorsGame: 0,
  scoreboardOverlay: {
    ...__initOverlays,
    id: 'scoreboard',
  },
  scorebugOverlay: {
    ...__initOverlays,
    id: 'scorebug',
  },
  formationAOverlay: {
    ...__initOverlays,
    id: 'formationA',
  },
  formationBOverlay: {
    ...__initOverlays,
    id: 'formationB',
  },
  scoreboardMinimalOverlay: {
    ...__initOverlays,
    id: 'scoreboardMinimal',
  },
  playerStatsOverlay: {
    ...__initOverlays,
    id: 'playerStats',
  },
  setInning: (inning) => set({ inning }),
  setIsTopInning: (isTop) => set({ isTopInning: isTop }),
  setBalls: async (balls) => {
    set({ balls })
    if (get().id) {
      await changeBallCount(get().id!, balls)
    }
  },
  setStrikes: async (strikes) => {
    set({ strikes })
    if (get().id) {
      await changeStrikeCount(get().id!, strikes)
    }
  },
  setOuts: async (outs) => {
    set({ outs })
    if (get().id) {
      await changeOutCount(get().id!, outs)
    }
  },
  setBase: async (base, index) => {
    useHistoryStore.getState().handleBasesHistory()
    let bases = [...get().bases]
    bases[index] = base
    set({ bases })
    if (get().id) {
      await changeBaseRunner(get().id!, index, base)
    }
  },
  setBases: async (bases) => {
    set({ bases })
  },
  changeInning: async (increment, isSaved = true) => {
    
    const { inning, isTopInning, id } = get()

    if (isSaved) {
      registerHistory('inning')
    }

    let newInning = inning
    let newIsTopInning = isTopInning
    if (increment) {
      if (!isTopInning) {
        newInning = inning + 1
        newIsTopInning = true
      } else {
        newIsTopInning = false
      }
    } else {
      if (isTopInning) {
        if (inning > 1) {
          newInning = inning - 1
          newIsTopInning = false
        }
      } else {
        newIsTopInning = true
      }
    }
    set({
      inning: newInning,
      isTopInning: newIsTopInning,
      balls: 0,
      strikes: 0,
      outs: 0,
      bases: [false, false, false],
    })
    
    if (id && isSaved) {
      await changeInningService(id, newInning, newIsTopInning)
    }
  },
  handleOutsChange: async (newOuts, isSaved = true) => {
    const { changeInning, updateGame, advanceBatter, handleOutPlay, id } = get()

    if (isSaved) registerHistory('out')

    await handleOutPlay(isSaved)
    await advanceBatter(isSaved)

    if (newOuts === 3) {
      set({ outs: 0, balls: 0, strikes: 0 })
      await changeInning(true, false)
      if (isSaved) {
        await updateGame()
      }
    } else {
      set({ outs: newOuts, balls: 0, strikes: 0 })
      if (id && isSaved) {
        await changeOutCount(get().id!, newOuts)
      }
    }
  },
  handleStrikeChange: async (newStrikes, isSaved = true) => {
    const { outs, id, handleOutsChange, updateGame } = get()

    const nextOuts = outs + 1;

    if (isSaved && nextOuts === 3) {
      registerHistory('strike')
    }

    if (isSaved && newStrikes < 3) {
      registerHistory('strike')
    }

    if (newStrikes === 3) {
      if (nextOuts === 3) {
        await handleOutsChange(nextOuts, false)
      } else {
        await handleOutsChange(nextOuts, true)
      }

      if (isSaved && nextOuts === 3) {
        await updateGame()
      } 

    } else {
      set({ strikes: newStrikes })
      await changeStrikeCount(id!, newStrikes)
    }
  },
  handleBallChange: async (newBalls, isSaved = true) => {
    const {
      bases,
      isTopInning,
      id,
      updateGame,
      advanceBatter,
      handleBBPlay,
    } = get()

    useHistoryStore.getState().handleBallFlowHistory()

    if (newBalls === 4) {
      set({ balls: 0, strikes: 0 })
      await handleBBPlay()
      await advanceBatter()
      const newBases = [...bases]

      const allBasesLoaded = newBases.every((base) => base);

      if (allBasesLoaded) {
        // Anotar carrera del corredor en tercera base
        await useTeamsStore
          .getState()
          .incrementRuns(isTopInning ? 0 : 1, 1, false);
      }

      for (let i = 2; i >= 0; i--) {
        if (newBases[i]) {
          if (i === 2) {
            
          } else {
            newBases[i + 1] = true
          }
        }
      }
      newBases[0] = true
      set({ bases: newBases })
      if (id) {
        await updateGame()
      }
    } else {
      set({ balls: newBalls })
      await changeBallCount(id!, newBalls)
    }
  },
  changeGameStatus: async (newStatus) => {
    set({ status: newStatus })
    if (get().id) {
      if (newStatus === 'finished') {
        // aqui se deben resetear los overlays
      }

      await changeStatusService(get().id!, newStatus)
    }
  },
  changeIsTopInning: async (isTopInning) => {
    const {  id } = get()
    set({ isTopInning })
    if (get().id) {
      await changeInningService(id!, get().inning, isTopInning)
    }
  },
  changeRunsByInning: async (teamIndex, newRuns, isSaved = true) => {
    const { id, runsByInning, inning, setScoreBoard } = get()

    const inningKey = `${inning}T${teamIndex + 1}` // Ejemplo: "3T1" o "3T2"

    // Actualiza las carreras por inning
    const updatedRunsByInning = {
      ...runsByInning,
      [inningKey]: (runsByInning[inningKey] || 0) + newRuns,
    }
    set({ runsByInning: updatedRunsByInning })

    // setScoreBoard({[inningKey]: (runsByInning[inningKey] || 0) + newRuns})

    if (id && isSaved) {
      await changeRunsByInningService(id, {
        ...runsByInning,
        [inningKey]: (runsByInning[inningKey] || 0) + newRuns,
      })
    }
  },
  loadGame: async (id) => {
    const game = await getGame(id)
    useTeamsStore.getState().setGameId(id)
    useTeamsStore.getState().setTeams(game.teams)
    useHistoryStore.getState().setPast(game.past)
    useHistoryStore.getState().setFuture(game.future)
    useConfigStore.getState().setCurrentConfig(game.configId)
    set({ ...game, id: game._id, scoreboardOverlay: game.scoreboardOverlay })

    return game
  },
  loadGameHistory: async (game) => {
    const { updateGame } = get();
    const { setTeams, teams } = useTeamsStore.getState();
  
    if (game?.teams) {
      let offensiveTeamIndex = game.isTopInning ? 0 : 1;
  
      const updatedTeams = teams.map((team, index) => {
        if (index === offensiveTeamIndex) {

          // Obtener el equipo correspondiente desde game.teams basado en el índice
          const matchingTeam = (game.teams as Team[])[0];
    
          // Solo actualizamos las propiedades del equipo que existen en game.teams
          const updatedTeam = Object.keys(team).reduce((acc, key) => {
            if (key in matchingTeam) {
              if (key !== 'lineup') {
                //@ts-ignore
                acc[key] = matchingTeam[key as keyof typeof matchingTeam];
              }
            } else {
              //@ts-ignore
              acc[key] = team[key];
            }
            return acc;
          }, {} as Team);
    
          // Actualizar la alineación si es el equipo ofensivo

          if (matchingTeam.hasOwnProperty('lineup')) {
            let newLineup = team.lineup.map((player) =>
              player.name === matchingTeam.lineup[0].name
                ? matchingTeam.lineup[0]
                : player
            )
  
            updatedTeam.lineup = newLineup;
          }

          return updatedTeam;
        } else {
          return team;
        }
      });
  
      // Actualizar los equipos en el estado global
      setTeams(updatedTeams);
    }
  
    // Actualizar el estado global con el juego cargado
    set({ ...game });
  
   await updateGame()
  },
  loadOverlay: async (id) => {
    const game = await getOverlay(id)
    useTeamsStore.getState().setGameId(id)
    useTeamsStore.getState().setTeams(game.teams)
    useConfigStore.getState().setCurrentConfig(game.configId)
    set({ ...game, id: game._id, scoreboardOverlay: game.scoreboardOverlay })

    return game
  },
  updateGame: async () => {
    const teamState = useTeamsStore.getState()
    const gameState = get()
    const id = gameState.id

    let game: Omit<Game, 'userId'> = {
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
      configId: useConfigStore.getState().currentConfig?._id as string,
      date: gameState.date as string,
      isDHEnabled: gameState.isDHEnabled,
      scoreboardOverlay: gameState.scoreboardOverlay,
      scorebugOverlay: gameState.scorebugOverlay,
      formationAOverlay: gameState.formationAOverlay,
      formationBOverlay: gameState.formationBOverlay,
      scoreboardMinimalOverlay: gameState.scoreboardMinimalOverlay,
      playerStatsOverlay: gameState.playerStatsOverlay,
    }

    await updateGameService(id!, game)
  },

  setScoreBug: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scorebug
      .overlayId as string
    let contentId = useConfigStore.getState().currentConfig?.scorebug
      .modelId as string
  },
  setScoreBoard: async (content) => {
   

  },
  setScoreBoardMinimal: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scoreboardMinimal
      .overlayId as string
    let contentId = useConfigStore.getState().currentConfig?.scoreboardMinimal
      .modelId as string

  },
  gameOver: async () => {
    const { id } = get()
    if (id) {
    }
  },
  startGame: () => {
    const { changeGameStatus } = get()
    changeGameStatus('in_progress')
  },
  endGame: () => {
    const { changeGameStatus } = get()
    changeGameStatus('finished')
  },
  isDHEnabled: false, //setDHService
  setIsDHEnabled: async (enabled) => {
    set({ isDHEnabled: enabled })
    await setDHService(get().id!)
  },
  getCurrentBatter: () => {
    const { isTopInning, isDHEnabled } = get()
    const teamIndex = isTopInning ? 0 : 1
    const team = useTeamsStore.getState().teams[teamIndex]
    const teams = useTeamsStore.getState().teams

    const isLineupComplete = teams[0].lineupSubmitted && teams[1].lineupSubmitted

    if (!isLineupComplete) return null

    let currentBatterIndex = team.currentBatter
    if (isDHEnabled) {
      // Skip pitcher if DH is enabled
      while (team.lineup[currentBatterIndex].position === 'P') {
        currentBatterIndex = (currentBatterIndex + 1) % team.lineup.length
      }
    }
    const currentBatter = team.lineup[currentBatterIndex]
    return currentBatter ? currentBatter : null
  },
  getCurrentPitcher: () => {
    const { isTopInning } = get()
    const teamIndex = isTopInning ? 1 : 0

    const teams = useTeamsStore.getState().teams

    const isLineupComplete = teams[0].lineupSubmitted && teams[1].lineupSubmitted

    if (!isLineupComplete) return null

    const team = useTeamsStore.getState().teams[teamIndex]
    const pitcher = team.lineup.find((player) => player.position === 'P')
    return pitcher ? { name: pitcher.name, number: pitcher.number } : null
  },
  advanceBatter: async (isSaved) => {
    const { isTopInning } = get()
    const teamIndex = isTopInning ? 0 : 1
    await useTeamsStore.getState().advanceBatter(teamIndex, isSaved)
  },

  handlePositionOverlay: async (
    id: string,
    data: { x: number; y: number },
    isSaved = true
  ) => {
    const {
      formationAOverlay,
      formationBOverlay,
      scoreboardOverlay,
      scoreboardMinimalOverlay,
      scorebugOverlay,
      playerStatsOverlay
    } = get()

    if (id === formationAOverlay.id) {
      set({ formationAOverlay: { ...formationAOverlay, x: data.x, y: data.y } })
    } else if (id === formationBOverlay.id) {
      set({ formationBOverlay: { ...formationBOverlay, x: data.x, y: data.y } })
    } else if (id === scoreboardOverlay.id) {
      set({ scoreboardOverlay: { ...scoreboardOverlay, x: data.x, y: data.y } })
    } else if (id === scoreboardMinimalOverlay.id) {
      set({
        scoreboardMinimalOverlay: {
          ...scoreboardMinimalOverlay,
          x: data.x,
          y: data.y,
        },
      })
    } else if (id === scorebugOverlay.id) {
      set({ scorebugOverlay: { ...scorebugOverlay, x: data.x, y: data.y } })
    } else if (id === playerStatsOverlay.id) {
      set({ playerStatsOverlay: { ...playerStatsOverlay, x: data.x, y: data.y } })
    }

    if (isSaved) {
      await handlePositionOverlayServices(id, data, useGameStore.getState().id!)
    }
  },
  handleScaleOverlay: async (id: string, scale: number, isSaved = true) => {
    const {
      scorebugOverlay,
      scoreboardOverlay,
      scoreboardMinimalOverlay,
      formationAOverlay,
      formationBOverlay,
      playerStatsOverlay
    } = get()

    if (id === scorebugOverlay.id) {
      set({ scorebugOverlay: { ...scorebugOverlay, scale: scale } })
    } else if (id === scoreboardOverlay.id) {
      set({ scoreboardOverlay: { ...scoreboardOverlay, scale: scale } })
    } else if (id === scoreboardMinimalOverlay.id) {
      set({
        scoreboardMinimalOverlay: { ...scoreboardMinimalOverlay, scale: scale },
      })
    } else if (id === formationAOverlay.id) {
      set({ formationAOverlay: { ...formationAOverlay, scale: scale } })
    } else if (id === formationBOverlay.id) {
      set({ formationBOverlay: { ...formationBOverlay, scale: scale } })
    } else if (id === playerStatsOverlay.id) {
      set({ playerStatsOverlay: { ...playerStatsOverlay, scale: scale } })
    }

    if (isSaved) {
      await handleScaleOverlayServices(id, scale, useGameStore.getState().id!)
    }
  },
  handleVisibleOverlay: async (
    id: string,
    visible: boolean,
    isSaved = true
  ) => {
    const {
      scorebugOverlay,
      scoreboardOverlay,
      scoreboardMinimalOverlay,
      formationAOverlay,
      formationBOverlay,
      playerStatsOverlay
    } = get()

    if (id === scorebugOverlay.id) {
      set({ scorebugOverlay: { ...scorebugOverlay, visible: visible } })
    } else if (id === scoreboardOverlay.id) {
      set({ scoreboardOverlay: { ...scoreboardOverlay, visible: visible } })
    } else if (id === scoreboardMinimalOverlay.id) {
      set({
        scoreboardMinimalOverlay: {
          ...scoreboardMinimalOverlay,
          visible: visible,
        },
      })
    } else if (id === formationAOverlay.id) {
      set({ formationAOverlay: { ...formationAOverlay, visible: visible } })
    } else if (id === formationBOverlay.id) {
      set({ formationBOverlay: { ...formationBOverlay, visible: visible } })
    } else if (id === playerStatsOverlay.id) {
      set({ playerStatsOverlay: { ...playerStatsOverlay, visible: visible } })
    }

    if (isSaved) {
      await handleVisibleOverlayServices(
        id,
        visible,
        useGameStore.getState().id!
      )
    }
  },

  // Acción para manejar un sencillo (Single)
  handleSingle: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const newBases = [true, bases[0], bases[1]]
    const runsScored = bases[2] ? 1 : 0



    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Single,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Single,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              lineup: newLineup,
            }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )
    advanceBatter(teamIndex)
  },

  // Acción para manejar un doble (Double)
  handleDouble: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const newBases = [false, true, bases[0]]
    const runsScored = (bases[2] ? 1 : 0) + (bases[1] ? 1 : 0)

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Double,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Double,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              newLineup,
            }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )

    advanceBatter(teamIndex)
  },

  // Acción para manejar un triple (Triple)
  handleTriple: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const newBases = [false, false, true]
    const runsScored =
      (bases[2] ? 1 : 0) + (bases[1] ? 1 : 0) + (bases[0] ? 1 : 0)
    

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Triple,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Triple,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              newLineup,
            }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )

    advanceBatter(teamIndex)
  },

  // Acción para manejar un cuadrangular (HomeRun)
  handleHomeRun: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const runsScored =
      1 + (bases[2] ? 1 : 0) + (bases[1] ? 1 : 0) + (bases[0] ? 1 : 0)

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.HomeRun,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.HomeRun,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              newLineup,
            }
          : team
      )
    )

    set({ bases: [false, false, false], strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(useGameStore.getState().id!, teamIndex, newTeam, [
      false,
      false,
      false,
    ])

    advanceBatter(teamIndex)
  },

  // Acción para manejar un golpe por lanzamiento (HitByPitch)
  handleHitByPitch: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const newBases = [...bases]
    let runsScored = 0

    if (!bases[0]) {
      newBases[0] = true
    } else if (!bases[1]) {
      newBases[1] = true
    } else if (!bases[2]) {
      newBases[2] = true
    } else {
      runsScored = 1
    }

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.HitByPitch,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.HitByPitch,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, runs: team.runs + runsScored, lineup: newLineup }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )

    advanceBatter(teamIndex)
  },
  handleErrorPlay: async (defensiveOrder: number) => {
    const { isTopInning, getCurrentBatter, bases } = get()
    const { teams, advanceBatter, setTeams } = useTeamsStore.getState()

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('error')

    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.ErrorPlay,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.ErrorPlay,
      errorPlay: `E${defensiveOrder}`,
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, lineup: newLineup, errorsGame: team.errorsGame + 1 }
          : team
      )
    )

    let newTeam = {
      ...teams[teamIndex],
      lineup: newLineup,
      errorsGame: teams[teamIndex].errorsGame + 1,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      bases
    )
    advanceBatter(teamIndex)
  },
  handleOutPlay: async (isSaved = true) => {
    const { isTopInning, getCurrentBatter, bases } = get()
    const { teams, setTeams } = useTeamsStore.getState()

    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Out,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Out,
      errorPlay: "",
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, lineup: newLineup }
          : team
      )
    )

    let newTeam = {
      ...teams[teamIndex],
      lineup: newLineup,
    }



    if (isSaved) {
      await handlePlayServices(
        useGameStore.getState().id!,
        teamIndex,
        newTeam,
        bases
      )
    }
  },
  handleBBPlay: async () => {
    const { isTopInning, getCurrentBatter, bases } = get()
    const { teams, setTeams } = useTeamsStore.getState()

    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if (!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.BaseByBall,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.BaseBayBall,
      errorPlay: "",
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, lineup: newLineup }
          : team
      )
    )

    let newTeam = {
      ...teams[teamIndex],
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      bases
    )
  },
}))