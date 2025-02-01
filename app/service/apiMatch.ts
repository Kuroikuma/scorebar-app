import axios from 'axios'
import socket from './socket'
import {
  FormationFootball,
  IFootballMatch,
  MatchEventFootball,
  PlayerFootball,
  StaffFootball,
  SubstitutionFootball,
  TeamFootball,
  TimeFootball,
} from '@/matchStore/interfaces'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers.Authorization = `Bearer ${token}`

    if (!config.data) {
      config.data = {}
    }

    config.data.socketId = socket.id || ''
  }
  return config
})

export const createMatchService = async (
  matcheData: Omit<IFootballMatch, 'id'>
) => {
  const response = await api.post('/matches', matcheData)
  return response.data
}

export const updateMatcheService = async (
  id: string,
  matcheData: Omit<IFootballMatch, 'userId'>
) => {
  const response = await api.put(`/matches/${id}`, matcheData)
  return response.data
}

export const getMatcheService = async (id: string) => {
  const response = await api.get(`/matches/${id}`)
  return response.data
}

export const getMatchOverlayService = async (id: string) => {
  const response = await api.get(`/matches/overlay/${id}`)
  return response.data
}

export const addEventService = async (
  matchId: string,
  event: MatchEventFootball
) => {
  const response = await api.post(`/matches/event/${matchId}`, { addedEvent: event })
  return response.data
}

export const deleteEventService = async (
  matchId: string,
  eventId: string
) => {
  const response = await api.delete(`/matches/event/${matchId}/${eventId}`)
  return response.data
}

export const addSubstitutionService = async (
  matchId: string,
  substitution: SubstitutionFootball
) => {
  const response = await api.post(
    `/matches/substitution/${matchId}`,
    { addedSubstitution: substitution }
  )
  return response.data
}

export const deleteSubstitutionService = async (
  matchId: string,
  substitutionId: string
) => {
  const response = await api.delete(
    `/matches/substitution/${matchId}/${substitutionId}`
  )
  return response.data
}

export const addTeamPlayerService = async (
  matchId: string,
  player: PlayerFootball,
  teamRole: string
) => {
  const response = await api.put(`/matches/team/addPlayer/${matchId}`, {
    player,
    teamRole,
  })
  return response.data
}

export const updateTeamFormationService = async (
  matchId: string,
  formation: FormationFootball,
  teamRole: string
) => {
  const response = await api.put(`/matches/team/formation/${matchId}`, {
    formation,
    teamRole,
  })
  return response.data
}

export const updateTeamNameService = async (
  matchId: string,
  newName: string,
  teamRole: string
) => {
  const response = await api.put(`/matches/team/name/${matchId}`, {
    newName,
    teamRole,
  })
  return response.data
}

export const updateTeamStaffService = async (
  matchId: string,
  updateStaff: StaffFootball,
  teamRole: string
) => {
  const response = await api.put(`/matches/team/staff/${matchId}`, {
    updateStaff,
    teamRole,
  })
  return response.data
}

export const updateTeamService = async (
  matchId: string,
  team: TeamFootball,
  teamRole: string
) => {
  const response = await api.put(`/matches/team/${matchId}`, { team, teamRole })
  return response.data
}

export const resetMatchService = async (matchId: string) => {
  const response = await api.delete(`/matches/reset/${matchId}`)
  return response.data
}

export const updateTimeService = async (
  matchId: string,
  time: Partial<TimeFootball>
) => {
  const response = await api.put(`/matches/time/${matchId}`, { time })
  return response.data
}

export const changePastAndFutureMatchService = async (
  matchId: string,
  past: Partial<Omit<IFootballMatch, 'userId'>>[],
  future: Partial<Omit<IFootballMatch, 'userId'>>[]
) => {
  const response = await api.put(`/matches/pastAndFuture/${matchId}`, {
    past,
    future,
  })
  return response.data
}

interface PositionOverlay {
  matchId: string
  id: string
  x: number
  y: number
}

export const handlePositionMatchService = async(data: PositionOverlay) => {
  const response = await api.put(`/matches/overlay/position/${data.matchId}`, data)
  return response.data
}

interface ScaleOverlay {
  matchId: string
  id: string
  scale: number
}

export const updateScaleOverlay = async (data: ScaleOverlay) => {
  const response = await api.put(`/matches/overlay/scale/${data.matchId}`, data)
  return response.data
}

interface VisibleOverlay {
  matchId: string
  id: string
  visible: boolean
}

export const updateVisibleOverlay = async (data: VisibleOverlay) => {
  const response = await api.put(`/matches/overlay/visible/${data.matchId}`, data)
  return response.data
}


//hace falta lo overlays de futbol