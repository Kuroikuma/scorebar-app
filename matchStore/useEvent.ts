import {
  EventState,
  MatchEventFootball,
  PlayerFootball,
  SubstitutionFootball,
} from '@/matchStore/interfaces'
import { create } from 'zustand'
import { useTeamStore } from './useTeam'
import { useMatchStore } from './matchStore'
import { addEventService, addSubstitutionService, deleteEventService, deleteSubstitutionService, updateTeamService } from '@/app/service/apiMatch'
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
      const { updateTeam, homeTeam, awayTeam } = useTeamStore.getState()

      let tempSubstitutionsId = Date.now().toString()

      let tempSubstitutionsTeam = substitutionData.teamId
      let team = tempSubstitutionsTeam === 'home' ? homeTeam : awayTeam

      let playerInId = team.players.find((player) => player.id === substitutionData.playerInId) as PlayerFootball
      let playerOutId = team.players.find((player) => player.id === substitutionData.playerOutId) as PlayerFootball
      
      let partialTeamUpdate = {
        players: team.players.map((player) =>
          player.id === playerInId.id
            ? {
                ...player,
                position: playerOutId.position,
              }
            : player.id === playerOutId.id
            ? {
                ...player,
                position: 'SUP',
              }
            : player
        ),
      }

      updateTeam(tempSubstitutionsTeam, partialTeamUpdate)

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

      await updateTeamService(id, partialTeamUpdate, tempSubstitutionsTeam)
    },
    removeSubstitution: async (substitutionId) => {

      const { id } = useMatchStore.getState()
      const { substitutions } = get()
      const { updateTeam, homeTeam, awayTeam } = useTeamStore.getState()

      let substitution = substitutions.find((sub) => sub.id === substitutionId) as SubstitutionFootball 

      let tempSubstitutionsTeam = substitution.teamId
      let team = tempSubstitutionsTeam === 'home' ? homeTeam : awayTeam

      let playerInId = team.players.find((player) => player.id === substitution.playerInId) as PlayerFootball
      let playerOutId = team.players.find((player) => player.id === substitution.playerOutId) as PlayerFootball
      
      let partialTeamUpdate = {
        players: team.players.map((player) =>
          player.id === playerOutId.id
            ? {
                ...player,
                position: playerInId.position,
              }
            : player.id === playerInId.id
            ? {
                ...player,
                position: 'SUP',
              }
            : player
        ),
      }

      updateTeam(tempSubstitutionsTeam, partialTeamUpdate)
      
      set((state) => ({
        substitutions: state.substitutions.filter(
          (sub) => sub.id !== substitutionId
        ),
      }))

      await deleteSubstitutionService(id, substitutionId)
      await updateTeamService(id, partialTeamUpdate, tempSubstitutionsTeam)
    },
    removeAllSubstitutions: () => set({ substitutions: [] }),
    removeAllEvents: () => set({ events: [] }),
    loadEvents: (events) =>
      set({ events: events.events, substitutions: events.substitutions }),
  }))
)
