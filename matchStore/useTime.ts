import { TimeState } from '@/matchStore/interfaces'
import { create } from 'zustand'
import { useTeamStore } from './useTeam'
import { useEventStore } from './useEvent'
import { useMatchStore } from './matchStore'
import { updateTimeService } from '@/app/service/apiMatch'
import socket from '@/app/service/socket'
import { devtools } from 'zustand/middleware'

const initialState: TimeState = {
  time: {
    minutes: 0,
    seconds: 0,
    stoppage: 3,
    isRunning: false,
  },
  period: [
    { name: '1st Half', active: true },
    { name: '2nd Half', active: false },
    { name: '1st Extra', active: false },
    { name: '2nd Extra', active: false },
  ],
}

interface TimeStore extends TimeState {
  startMatch: () => void
  pauseMatch: () => void
  resetMatch: () => void
  updatePeriod: (periodName: string) => void
  updateTime: (timeUpdate: Partial<typeof initialState.time>) => void
  updateMinutes: (timeUpdate: Partial<typeof initialState.time>) => void
  updateSeconds: (timeUpdate: Partial<typeof initialState.time>) => void
  updateStoppage: (timeUpdate: Partial<typeof initialState.time>) => void
  loadTime: (timeState: TimeState) => void
  updateTimeOverlays: (timeUpdate: Partial<typeof initialState.time>) => void
}

export const useTimeStore = create<TimeStore>()(
  devtools((set, get) => ({
    ...initialState,
    startMatch: async () => {
      let { time } = get()
      let { id: matchId } = useMatchStore.getState()

      set((state) => ({
        time: { ...state.time, isRunning: true },
      }))

      // await updateTimeService(id, { ...time, isRunning: true })
      socket.emit('@client:startTimer', matchId)
    },
    pauseMatch: async () => {
      let { id: matchId } = useMatchStore.getState()
      let { time } = get()

      set((state) => ({
        time: { ...state.time, isRunning: false },
      }))
      // await updateTimeService(id, { ...time, isRunning: false })
      socket.emit('@client:stopTimer', matchId)
    },
    resetMatch: () => {
      set((state) => ({
        ...initialState,
        time: {
          minutes: 0,
          seconds: 0,
          stoppage: 0,
          isRunning: false,
        },
      }))

      useEventStore.getState().removeAllEvents()
      useEventStore.getState().removeAllSubstitutions()
      useTeamStore.getState().updateTeam('home', { score: 0 })
      useTeamStore.getState().updateTeam('away', { score: 0 })
    },
    updatePeriod: (periodName) =>
      set((state) => ({
        period: state.period.map((p) => ({
          ...p,
          active: p.name === periodName,
        })),
      })),
    updateTime: (timeUpdate) =>
      set((state) => ({
        time: {
          ...state.time,
          ...timeUpdate,
        },
      })),
    updateTimeOverlays: (timeUpdate) =>
      set((state) => ({
        time: {
          ...state.time,
          ...timeUpdate,
        },
      })),
    updateMinutes: async (timeUpdate) => {
      let { id: matchId } = useMatchStore.getState()

     let seconds = (timeUpdate.minutes as number) * 60

      socket.emit('@client:adjustTimer', matchId, seconds)
    },
    updateSeconds: async (timeUpdate) => {
      let { id: matchId } = useMatchStore.getState()
      
      let seconds = (timeUpdate.seconds as number)

      socket.emit('@client:adjustTimer', matchId, seconds)
    },
    updateStoppage: async (timeUpdate) => {
      let { id } = useMatchStore.getState()

      set((state) => ({
        time: {
          ...state.time,
          ...timeUpdate,
        },
      }))

      await updateTimeService(id, timeUpdate)
    },
    loadTime: (timeState) => set({ ...timeState }),
  }))
)
