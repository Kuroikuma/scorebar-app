import { getMatcheService, getMatchOverlayService, updateMatcheService } from '@/app/service/apiMatch'
import { IFootballMatch, MatchState } from '@/matchStore/interfaces'
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
  status: 'upcoming',
  userId: '',
  future: [],
  past: [],
}

interface MatchStore extends MatchState {
  getMatch: (id: string) => Promise<void>
  getMatchOverlay: (id: string) => Promise<void>
  setMatch: (match: Partial<MatchState>, isSaved?: boolean) => Promise<void>
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  ...initialState,
  getMatch: async (id) => {
    let match = await getMatcheService(id)

    set(({
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

  getMatchOverlay: async (id) => {
    let match = await getMatchOverlayService(id)

    set(({
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
  setMatch: async (match, isSaved = true) => {

    const { id } = useMatchStore.getState()

    set(({ ...match }))

    if(isSaved) await updateMatcheService(id, match)
  },
}))