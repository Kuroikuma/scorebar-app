import { MatchState } from '@/matchStore/interfaces'
import { create } from 'zustand'

const initialState: MatchState = {
  leagueLogo: '',
  leagueName: '',
  stadiumName: '',
  matchDate: '',
  id: '',
  status: '',
  userId: '',
}

interface MatchStore extends MatchState {}

export const useMatchStore = create<MatchStore>((set, get) => ({
  ...initialState,
}))
