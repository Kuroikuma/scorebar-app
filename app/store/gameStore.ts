import { create } from 'zustand'
import { getGame, updateGameService, changeBallCount, changeStrikeCount, changeOutCount, changeInningService, changeBaseRunner, changeRunsByInningService, changeStatusService, setDHService } from '@/app/service/api'
import { Team, useTeamsStore } from './teamsStore'
import { resetOverlays, setInningMinimal, SetOverlayContent, updateOverlayContent } from '@/app/service/apiOverlays'
import { ConfigGame, useConfigStore } from './configStore';

export type Status = 'upcoming' | 'in_progress' | 'finished';

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
  loadGame: (id: string) => Promise<void>
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
  getCurrentBatter: () => { name: string; number: string } | null
  getCurrentPitcher: () => { name: string; number: string } | null
  advanceBatter: () => Promise<void>
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
        setInningMinimal(newInning)
      } else {
        newIsTopInning = false
      }
    } else {
      if (isTopInning) {
        if (inning > 1) {
          newInning = inning - 1
          newIsTopInning = false
          setInningMinimal(newInning)
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
    const { changeInning, updateGame, setScoreBug: setOverLayOne, advanceBatter  } = get()

    await advanceBatter()

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
        await setOverLayOne({ Outs: `${newOuts} OUT`, Strikes: 0, Balls: 0 })
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
    const { bases, isTopInning, id, updateGame, setScoreBug: setOverLayOne, advanceBatter } = get()
   
    if (newBalls === 4) {
      set({ balls: 0, strikes: 0 })
      await advanceBatter()
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
      if (newStatus === "finished") {
        resetOverlays()
      }

      await changeStatusService(get().id!, newStatus)
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

    debugger

    // Actualiza las carreras por inning
    const updatedRunsByInning = {
      ...runsByInning,
      [inningKey]: (runsByInning[inningKey] || 0) + newRuns,
    };
    set({ runsByInning: updatedRunsByInning });
    
    setScoreBoard({[inningKey]: (runsByInning[inningKey] || 0) + newRuns})

    if (id && isSaved) {
      await changeRunsByInningService(id, {[inningKey]: (runsByInning[inningKey] || 0) + newRuns})
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

    let game:Omit<Game, 'userId'> = {
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
  },
  gameOver: async () => {
    const { id } = get()
    if (id) {
      resetOverlays()
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
  isDHEnabled: false,//setDHService
  setIsDHEnabled: async (enabled) => {
    set({ isDHEnabled: enabled })
    await setDHService(get().id!)
  },
  getCurrentBatter: () => {
    const { isTopInning, isDHEnabled } = get()
    const teamIndex = isTopInning ? 0 : 1
    const team = useTeamsStore.getState().teams[teamIndex]
    let currentBatterIndex = team.currentBatter
    if (isDHEnabled) {
      // Skip pitcher if DH is enabled
      while (team.lineup[currentBatterIndex].position === 'P') {
        currentBatterIndex = (currentBatterIndex + 1) % team.lineup.length
      }
    }
    const currentBatter = team.lineup[currentBatterIndex]
    return currentBatter ? { name: currentBatter.name, number: currentBatter.number } : null
  },
  getCurrentPitcher: () => {
    const { isTopInning } = get()
    const teamIndex = isTopInning ? 1 : 0
    const team = useTeamsStore.getState().teams[teamIndex]
    const pitcher = team.lineup.find(player => player.position === 'P')
    return pitcher ? { name: pitcher.name, number: pitcher.number } : null
  },
  advanceBatter: async () => {
    const { isTopInning } = get()
    const teamIndex = isTopInning ? 0 : 1
    await useTeamsStore.getState().advanceBatter(teamIndex)
  },
}))