import { getMatcheService } from '@/app/service/apiMatch'
import { MatchState } from '@/matchStore/interfaces'
import { create } from 'zustand'
import { useOverlaysStore } from './overlayStore'
import { useEventStore } from './useEvent'
import { useTeamStore } from './useTeam'
import { useTimeStore } from './useTime'

const initialState: MatchState = {
  leagueLogo: '',
  leagueName: '',
  stadiumName: '',
  matchDate: '',
  id: '',
  status: '',
  userId: '',
  future: [],
  past: [],
}

interface MatchStore extends MatchState {
  getMatch: (id: string) => Promise<void>
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  ...initialState,
  getMatch: async (id) => {
    let match = await getMatcheService(id)

    set((state) => ({
      ...match,
      id: match.id,
    }))
    const { loadOverlays } = useOverlaysStore.getState()
    const { loadEvents } = useEventStore.getState()
    const { loadTeam } = useTeamStore.getState()
    const { loadTime } = useTimeStore.getState()

    loadOverlays({...match})
    loadEvents({...match})
    loadTeam({...match})
    loadTime({...match})

  },
}))
