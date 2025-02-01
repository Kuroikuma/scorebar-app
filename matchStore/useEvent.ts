import { EventState, MatchEventFootball, SubstitutionFootball } from "@/matchStore/interfaces"
import { create } from "zustand"
import { useTeamStore } from "./useTeam"


const initialState: EventState = {
  events: [
    
    {
      id: "1",
      type: "substitution",
      minute: 5,
      teamId: "away",
      playerId: "1",
      assistById: "1",
      replacedById: "2",
    },
    {
      id: "2",
      type: "goal",
      minute: 5,
      teamId: "home",
      playerId: "1",
    },
    {
      id: "3",
      type: "goal",
      minute: 6,
      teamId: "away",
      playerId: "2",
    },
    {
      id: "4",
      type: "goal",
      minute: 5,
      teamId: "home",
      playerId: "1",
    },
    {
      id: "5",
      type: "goal",
      minute: 6,
      teamId: "away",
      playerId: "2",
    },
    {
      id: "6",
      type: "goal",
      minute: 5,
      teamId: "home",
      playerId: "1",
    },
    {
      id: "7",
      type: "goal",
      minute: 6,
      teamId: "away",
      playerId: "2",
    },
    {
      id: "8",
      type: "substitution",
      minute: 5,
      teamId: "home",
      playerId: "2",
      assistById: "2",
      replacedById: "1",
    },
  ],
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
  addEvent: (event: Omit<MatchEventFootball, "id">) => void
  addSubstitution: (substitution: Omit<SubstitutionFootball, "id">) => void
  removeSubstitution: (substitutionId: string) => void
  removeEvent: (eventId: string) => void
  removeAllEvents: () => void
  removeAllSubstitutions: () => void
}

export const useEventStore = create<MatchEventStore>((set, get) => ({
  ...initialState,

  addEvent: (eventData) =>
    set((state) => ({
      events: [...state.events, { ...eventData, id: Date.now().toString() }],
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
    })),
  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== eventId),
    })),

  addSubstitution: (substitutionData) =>
    set((state) => ({
      substitutions: [
        ...state.substitutions,
        { ...substitutionData, id: Date.now().toString() },
      ],
    })),
  removeSubstitution: (substitutionId) =>
    set((state) => ({
      substitutions: state.substitutions.filter(
        (sub) => sub.id !== substitutionId
      ),
    })),
    removeAllSubstitutions: () => set({ substitutions: [] }),
    removeAllEvents: () => set({ events: [] }),

}))

