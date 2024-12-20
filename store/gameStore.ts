import { create } from 'zustand'
import { getGame, updateGameService, changeBallCount, changeStrikeCount, changeOutCount, changeInningService, changeBaseRunner, changeGameStatus, changeRunsByInningService } from '@/service/api'
import { TeamsState, useTeamsStore } from './teamsStore'
import { SetOverlayContent, updateOverlayContent } from '@/service/apiOverlays'
import { useConfigStore } from './configStore';

export interface Game {
  id: string | null;
  status: 'upcoming' | 'in_progress' | 'finished';
  teams: {
    name: string;
    runs: number;
    color: string;
    textColor: string;
    logo?: string;
  }[];
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: boolean[];
  runsByInning: RunsByInning
}

export interface RunsByInning {
  [inning: string]: number;
}

export type GameState = {
  id: string | null
  userId: string | null
  date: Date | null
  status: 'upcoming' | 'in_progress' | 'finished'
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: boolean[]
  runsByInning: RunsByInning;
  setGame: (game: Game) => void
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
  loadGame: (id: string) => Promise<void>
  updateGame: () => Promise<void>
  setScoreBug: (content: any) => Promise<void>
  changeIsTopInning: (isTopInning: boolean) => Promise<void>
  changeRunsByInning: (teamIndex: number, newRuns: number, isSaved?: boolean) => Promise<void>
  setScoreBoard: (content: any) => Promise<void>
  setScoreBoardMinimal: (content: any) => Promise<void>
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
  setGame: (game) => set(game),
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
    let bases = [...get().bases]
    let overlayId = useConfigStore.getState().currentConfig?.scorebug.overlayId as string;
    let contentId = useConfigStore.getState().currentConfig?.scorebug.modelId as string;
    bases[index] = base
    set({ bases })
    if (get().id) {
      let baseStr = index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"
      await SetOverlayContent(overlayId, contentId, { [`${baseStr} Base Runner`]: base })
      await changeBaseRunner(get().id!, index, base)
    }
  },
  setBases: async (bases) => {
    set({ bases })
  },
  changeInning: async (increment, isSaved=true) => {
    const { inning, isTopInning, id, setScoreBug: setOverLayOne } = get()

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
      bases: [false, false, false]
    })
    let contend = {
      "1st Base Runner": false,
      "2nd Base Runner": false,
      "3rd Base Runner": false,
      "Balls": 0,
      "Inning": newInning,
      "Outs": "0 OUT",
      "Strikes": 0,
      "topOrBottomInning": newIsTopInning ? "top" : "bottom",
    }
    if (id && isSaved) {
      await setOverLayOne(contend)
      await changeInningService(id, newInning, newIsTopInning)
    }
  },
  handleOutsChange: async (newOuts, isSaved=true) => {
    const { changeInning, updateGame, setScoreBug: setOverLayOne } = get()

    if (newOuts === 3) {
      set({ outs: 0, balls: 0, strikes: 0 })
      await changeInning(true, false)

      if (isSaved) {
        await updateGame()
      }

    } else {
      set({ outs: newOuts, balls: 0, strikes: 0 })
      if (get().id, isSaved) {
        await changeOutCount(get().id!, newOuts)
        await setOverLayOne({ Outs: `${newOuts} OUT` })
      }
    }
  },
  handleStrikeChange: async (newStrikes, isSaved=true) => {
    const { outs, id, handleOutsChange, updateGame, setScoreBug: setOverLayOne } = get()

    if (newStrikes === 3) {
      await handleOutsChange(outs + 1, false)

      if (isSaved) {
        await updateGame()
      }
    } else {
      set({ strikes: newStrikes })
      await setOverLayOne({ Strikes: newStrikes })
      await changeStrikeCount(id!, newStrikes)
    }
  },
  handleBallChange: async (newBalls, isSaved=true) => {
    const { bases, isTopInning, id, updateGame, setScoreBug: setOverLayOne } = get()
   
    if (newBalls === 4) {
      set({ balls: 0, strikes: 0 })
      const newBases = [...bases]
      for (let i = 2; i >= 0; i--) {
        if (newBases[i]) {
          if (i === 2) {
            // Runner on third scores
            await useTeamsStore.getState().incrementRuns(isTopInning ? 0 : 1, 1, false)
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
      await setOverLayOne({ Balls: newBalls })
      await changeBallCount(id!, newBalls)
    }
  },
  changeGameStatus: async (newStatus) => {
    set({ status: newStatus })
    if (get().id) {
      await changeGameStatus(get().id!, newStatus)
    }
  },
  changeIsTopInning: async (isTopInning) => {
    const { setScoreBug: setOverLayOne, id } = get()
    set({ isTopInning })
    if (get().id) {
      let content = { "topOrBottomInning": isTopInning ? "top" : "bottom" }
      await setOverLayOne(content)
      await changeInningService(id!, get().inning, isTopInning)
    }
  },
  changeRunsByInning: async (teamIndex, newRuns, isSaved=true) => {
    const { id, runsByInning, inning, setScoreBoard } = get()

    const inningKey = `${inning}T${teamIndex + 1}`; // Ejemplo: "3T1" o "3T2"

    // Actualiza las carreras por inning
    const updatedRunsByInning = {
      ...runsByInning,
      [inningKey]: (runsByInning[inningKey] || 0) + newRuns,
    };
    set({ runsByInning: updatedRunsByInning });
    
    setScoreBoard({[inningKey]: (runsByInning[inningKey] || 0) + newRuns})

    if (id && isSaved) {
      await changeRunsByInningService(id, runsByInning)
    }
  },
  loadGame: async (id) => {
    const game = await getGame(id)
    useTeamsStore.getState().setGameId(id)
    useTeamsStore.getState().setTeams(game.teams)
    useConfigStore.getState().setCurrentConfig(game.configId)
    set({...game, id: game._id})
  },
  updateGame: async () => {
    const teamState = useTeamsStore.getState()
    const gameState = get()
    const id = gameState.id

    let game:Game = {
      balls: gameState.balls,
      strikes: gameState.strikes,
      outs: gameState.outs,
      inning: gameState.inning,
      isTopInning: gameState.isTopInning,
      teams: teamState.teams,
      status: gameState.status,
      bases: gameState.bases,
      runsByInning: gameState.runsByInning,
      id: gameState.id
    }

    let overlayId = useConfigStore.getState().currentConfig?.scorebug.overlayId as string;
    let contentId = useConfigStore.getState().currentConfig?.scorebug.modelId as string;

    await updateOverlayContent(overlayId, contentId, game)

    await updateGameService(id!, game)
  },

  setScoreBug: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scorebug.overlayId as string;
    let contentId = useConfigStore.getState().currentConfig?.scorebug.modelId as string;

    await SetOverlayContent(overlayId, contentId, content)
  },
  setScoreBoard: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scoreboard.overlayId as string;
    let contentId = useConfigStore.getState().currentConfig?.scoreboard.modelId as string;

    await SetOverlayContent(overlayId, contentId, content)
  },
  setScoreBoardMinimal: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scoreboardMinimal.overlayId as string;
    let contentId = useConfigStore.getState().currentConfig?.scoreboardMinimal.modelId as string;

    await SetOverlayContent(overlayId, contentId, content)
  }
}))