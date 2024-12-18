import { create } from 'zustand'
import { useTeamsStore } from './teamsStore'

type GameState = {
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: boolean[]
  setInning: (inning: number) => void
  setIsTopInning: (isTop: boolean) => void
  setBalls: (balls: number) => void
  setStrikes: (strikes: number) => void
  setOuts: (outs: number) => void
  setBases: (bases: boolean[]) => void
  changeInning: (increment: boolean) => void
  handleOutsChange: (newOuts: number) => void
  handleStrikeChange: (newStrikes: number) => void
  handleBallChange: (newBalls: number) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  inning: 1,
  isTopInning: true,
  balls: 0,
  strikes: 0,
  outs: 0,
  bases: [false, false, false],
  setInning: (inning) => set({ inning }),
  setIsTopInning: (isTop) => set({ isTopInning: isTop }),
  setBalls: (balls) => set({ balls }),
  setStrikes: (strikes) => set({ strikes }),
  setOuts: (outs) => set({ outs }),
  setBases: (bases) => set({ bases }),
  changeInning: (increment) => {
    const { inning, isTopInning } = get()
    if (increment) {
      if (!isTopInning) {
        set({ 
          inning: inning + 1, 
          isTopInning: true,
          balls: 0,
          strikes: 0,
          outs: 0,
          bases: [false, false, false]
        })
      } else {
        set({ 
          isTopInning: false,
          balls: 0,
          strikes: 0,
          outs: 0,
          bases: [false, false, false]
        })
      }
    } else {
      if (isTopInning) {
        if (inning > 1) {
          set({ 
            inning: inning - 1, 
            isTopInning: false,
            balls: 0,
            strikes: 0,
            outs: 0,
            bases: [false, false, false]
          })
        }
      } else {
        set({ 
          isTopInning: true,
          balls: 0,
          strikes: 0,
          outs: 0,
          bases: [false, false, false]
        })
      }
    }
  },
  handleOutsChange: (newOuts) => {
    const { changeInning } = get()
    if (newOuts === 3) {
      set({ outs: 0, balls: 0, strikes: 0 })
      changeInning(true)
    } else {
      set({ outs: newOuts, balls: 0, strikes: 0 })
    }
  },
  handleStrikeChange: (newStrikes) => {
    const { handleOutsChange, outs } = get()
    if (newStrikes === 3) {
      set({ strikes: 0 })
      handleOutsChange(outs + 1)
    } else {
      set({ strikes: newStrikes })
    }
  },
  handleBallChange: (newBalls) => {
    const { bases, isTopInning } = get()
    if (newBalls === 4) {
      set({ balls: 0 })
      const newBases = [...bases]
      for (let i = 2; i >= 0; i--) {
        if (newBases[i]) {
          if (i === 2) {
            // Runner on third scores
            useTeamsStore.getState().incrementRuns(isTopInning ? 0 : 1)
          } else {
            newBases[i + 1] = true
          }
        }
      }
      newBases[0] = true
      set({ bases: newBases })
    } else {
      set({ balls: newBalls })
    }
  },
}))

