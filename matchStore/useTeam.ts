import {
  FormationFootball,
  PlayerFootball,
  PositionFormationFootball,
  StaffFootball,
  TeamFootball,
  TeamRole,
  TeamState,
} from '@/matchStore/interfaces'
import { create } from 'zustand'
import { useMatchStore } from './matchStore'
import { addTeamPlayerService, updateTeamFormationService, updateTeamService } from '@/app/service/apiMatch'

const defaultFormation: FormationFootball = {
  name: '4-4-2',
  positions: [
    { name: 'GK', assigned: false, y: 5, x: 46 },
    { name: 'LB', assigned: false, y: 24, x: 24 },
    { name: 'CB1', assigned: false, y: 16, x: 38 },
    { name: 'CB2', assigned: false, y: 16, x: 55 },
    { name: 'RB', assigned: false, y: 24, x: 68 },
    { name: 'LM', assigned: false, y: 55, x: 24 },
    { name: 'CM1', assigned: false, y: 45, x: 38 },
    { name: 'CM2', assigned: false, y: 45, x: 55 },
    { name: 'RM', assigned: false, y: 55, x: 68 },
    { name: 'ST1', assigned: false, y: 75, x: 36 },
    { name: 'ST2', assigned: false, y: 75, x: 54 },
  ],
}

const defaultStaff: StaffFootball = {
  manager: 'Alexander Ampie',
  assistantManager: '',
  physio: '',
}

const initialState: TeamState = {
  homeTeam: {
    name: 'Home Team',
    score: 0,
    color: '#06c12',
    primaryColor: '#c2a770',
    secondaryColor: '',
    textColor: '#ffffff',
    logo: '/placeholder.svg',
    logoFit: 'contain',
    players: [],
    staff: defaultStaff,
    formation: defaultFormation,
    teamRole: 'home',
    shortName: 'H',
  },
  awayTeam: {
    name: 'Away Team',
    shortName: 'A',
    score: 0,
    color: '#b60218',
    textColor: '#ffffff',
    logo: '/placeholder.svg',
    primaryColor: '#852b35',
    secondaryColor: '#9da1a2',
    logoFit: 'contain',
    players: [],
    staff: defaultStaff,
    formation: defaultFormation,
    teamRole: 'away',
  },
}

interface TeamStore extends TeamState {
  addPlayer: (teamRole: TeamRole, player: Omit<PlayerFootball, 'id'>) => void
  updateTeam: (team: TeamRole, updates: Partial<TeamFootball>) => void
  updateStaff: (team: TeamRole, updates: Partial<StaffFootball>) => void
  updateFormation: (team: TeamRole, formation: FormationFootball) => void
  updateTeamName: (team: TeamRole, name: string) => void
  loadTeam: (teamState: TeamState) => void
  changeFormation: (newFormation: FormationFootball, teamRole: TeamRole, isSaved?: boolean) => Promise<void>
  updatePlayer: (teamRole: TeamRole, updatedPlayer: PlayerFootball, isSaved?: boolean) => Promise<void>
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  ...initialState,
  addPlayer: async (teamRole, playerData) => {
    const { homeTeam, awayTeam } = get()
    const { id } = useMatchStore.getState()
    const tempDataId = Date.now().toString()

    let team = teamRole === 'home' ? homeTeam : awayTeam

    const updatedFormation = team.formation.positions.map((pos) => {
      if (!pos.assigned && pos.name === playerData.position) {
        return { ...pos, assigned: true }
      }
      return pos
    })

    set({
      [teamRole === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...team,
        players: [...team.players, { ...playerData, id: tempDataId }],
        formation: {
          ...team.formation,
          positions: updatedFormation,
        },
      },
    })

    let addPlayerResponse = await addTeamPlayerService(id, { ...playerData, id: tempDataId }, teamRole)

    set((state) => ({
      [teamRole === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...state[teamRole === 'home' ? 'homeTeam' : 'awayTeam'],
        players: state[teamRole === 'home' ? 'homeTeam' : 'awayTeam'].players.map((player) =>
          player.id === tempDataId ? { ...addPlayerResponse } : player
        ),
      },
    }))
  },
  updateTeam: (team, updates) =>
    set((state) => ({
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...state[team === 'home' ? 'homeTeam' : 'awayTeam'],
        ...updates,
      },
    })),
  updateTeamName: (team, name) =>
    set((state) => ({
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...state[team === 'home' ? 'homeTeam' : 'awayTeam'],
        name,
      },
    })),
  updateStaff: (team, updates) =>
    set((state) => ({
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...state[team === 'home' ? 'homeTeam' : 'awayTeam'],
        staff: {
          ...state[team === 'home' ? 'homeTeam' : 'awayTeam'].staff,
          ...updates,
        },
      },
    })),
  updateFormation: (team, formation) =>
    set((state) => ({
      [team === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...state[team === 'home' ? 'homeTeam' : 'awayTeam'],
        formation,
      },
    })),
  loadTeam: (teamState) => set({ ...teamState }),
  changeFormation: async (newFormation, teamRole, isSaved = true) => {
    const { id } = useMatchStore.getState()

    const newPositions = newFormation.positions.map((position) => ({
      ...position,
      assigned: false, // Resetear estado inicial
    }))

    let currentTeam = teamRole === 'home' ? get().homeTeam : get().awayTeam

    // Mapear jugadores a nuevas posiciones
    const updatedPlayers = currentTeam.players.map((player) => {
      // Buscar si la posición actual del jugador existe en la nueva formación
      const existingPosition = newPositions.find((p) => p.name === player.position)

      if (existingPosition && !existingPosition.assigned) {
        existingPosition.assigned = true
        return player // Mantener posición si está disponible
      }

      // Asignar primera posición disponible si no coincide
      const availablePosition = newPositions.find((p) => !p.assigned)
      if (availablePosition) {
        availablePosition.assigned = true
        return {
          ...player,
          position: availablePosition.name,
        }
      }

      // Si no hay posiciones disponibles, dejar posición original (manejar según tu lógica)
      return player
    })

    set({
      [teamRole === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...currentTeam,
        formation: {
          ...newFormation,
          positions: newPositions,
        },
        players: updatedPlayers,
      },
    })

    if (isSaved) {
      await updateTeamFormationService(
        id,
        {
          ...newFormation,
          positions: newPositions,
        },
        updatedPlayers,
        teamRole
      )
    }
  },
  updatePlayer: async (teamRole, updatedPlayer, isSaved = true) => {

    const { awayTeam, homeTeam } = useTeamStore.getState()
    const { id } = useMatchStore.getState()

    const currentTeam = teamRole === 'home' ? homeTeam : awayTeam

    let player = currentTeam.players.find((p) => p.id === updatedPlayer.id) as PlayerFootball

    let updatePosition = currentTeam.formation.positions.map((pos) => {
      if (pos.name === updatedPlayer.position) {
        return {
          ...pos,
          assigned: true,
        }
      } else if (pos.name === player.position) {
        return {
          ...pos,
          assigned: false,
        }
      }
      return pos
    })

    let updatedPlayers = currentTeam.players.map((p) => {
      if (p.id === updatedPlayer.id) {
        return updatedPlayer
      }
      return p
    })

    set(({
      [teamRole === 'home' ? 'homeTeam' : 'awayTeam']: {
        ...currentTeam,
        players: updatedPlayers,
        formation: {name: currentTeam.formation.name, positions: updatePosition}
      },
    }))

    if (isSaved) {
      await updateTeamService(id!, { players: updatedPlayers, formation: {...currentTeam.formation, positions: updatePosition} }, teamRole)
    }
  }
}))
