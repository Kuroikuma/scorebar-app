import {
  EventState,
  MatchEventFootball,
  SubstitutionFootball,
} from '@/matchStore/interfaces'
import { create } from 'zustand'
import { useTeamStore } from './useTeam'
import { useMatchStore } from './matchStore'
import { addEventService, addSubstitutionService, deleteEventService, deleteSubstitutionService } from '@/app/service/apiMatch'
import { devtools } from 'zustand/middleware'

const initialState: EventState = {
  events: [],
  overlay: {
    enabled: true,
    horizontalPosition: 0,
    verticalPosition: 0,
    showEvents: true,
    eventDuration: 5000,
  },
  substitutions: [],
}

interface MatchEventStore extends EventState {
  addEvent: (event: Omit<MatchEventFootball, 'id'>) => Promise<void>
  addSubstitution: (substitution: Omit<SubstitutionFootball, 'id'>) => void
  removeSubstitution: (substitutionId: string) => void
  removeEvent: (eventId: string) => Promise<void>
  removeAllEvents: () => void
  removeAllSubstitutions: () => void
  loadEvents: (events: EventState) => void
}

export const useEventStore = create<MatchEventStore>()(
  devtools((set, get) => ({
    ...initialState,

    addEvent: async (eventData) => {
      const { id } = useMatchStore.getState()

      let tempEventId = Date.now().toString()

      set((state) => ({
        events: [...state.events, { ...eventData, id: tempEventId }],
        ...(eventData.type === 'goal'
          ? useTeamStore
              .getState()
              .updateTeam(eventData.teamId === 'home' ? 'home' : 'away', {
                score:
                  eventData.teamId === 'home'
                    ? useTeamStore.getState().homeTeam.score + 1
                    : useTeamStore.getState().awayTeam.score + 1,
              })
          : {}),
      }))

      let addEventResponse = await addEventService(id, {
        ...eventData,
        id: tempEventId,
      })

      set((state) => ({
        events: state.events.map((event) =>
          event.id === tempEventId ? { ...addEventResponse } : event
        ),
      }))
    },
    removeEvent: async (eventId) => {
      const { id } = useMatchStore.getState()

      set((state) => ({
        events: state.events.filter((event) => event.id !== eventId),
      }))

      await deleteEventService(id, eventId)
    }
      ,

    addSubstitution: async (substitutionData) => {
      const { id } = useMatchStore.getState()

      let tempSubstitutionsId = Date.now().toString()

      set((state) => ({
        substitutions: [
          ...state.substitutions,
          { ...substitutionData, id: tempSubstitutionsId },
        ],
      }))


      let addSubstitutionResponse = await addSubstitutionService(id, {
        ...substitutionData,
        id: tempSubstitutionsId,
      })

      set((state) => ({
        events: state.events.map((event) =>
          event.id === tempSubstitutionsId ? { ...addSubstitutionResponse } : event
        ),
      }))
    }
      ,
    removeSubstitution: async (substitutionId) => {

      const { id } = useMatchStore.getState()
      
      set((state) => ({
        substitutions: state.substitutions.filter(
          (sub) => sub.id !== substitutionId
        ),
      }))

      await deleteSubstitutionService(id, substitutionId)
    },
    removeAllSubstitutions: () => set({ substitutions: [] }),
    removeAllEvents: () => set({ events: [] }),
    loadEvents: (events) =>
      set({ events: events.events, substitutions: events.substitutions }),
  }))
)
