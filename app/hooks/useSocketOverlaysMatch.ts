import { useEffect } from 'react'
import socket from '../service/socket'
import { IOverlays, MatchEventFootball, PlayerFootball, TeamFootball, TeamRole } from '@/matchStore/interfaces'
import { useOverlaysStore } from '@/matchStore/overlayStore'
import { useTimeStore } from '@/matchStore/useTime'
import { useMatchStore } from '@/matchStore/matchStore'
import { useTeamStore } from '@/matchStore/useTeam'

interface ISocketAddPlayer {
  playerUpdate: PlayerFootball
  teamRole: TeamRole
}

export const useOverlayMatchSockets = () => {
  const { addPlayerOverlay, addEventOverlay } = useOverlaysStore()
  const { id: matchId } = useMatchStore()
  const { resetMatch } = useTimeStore()
  const { updateTeam } = useTeamStore()

  // socket de resetMatch
  useEffect(() => {
    // Escuchar actualizaciones del servidor
    socket.on(`@server:resetMatch`, () => {
      resetMatch(false)
    })

    return () => {
      console.log('desmontando socket de resetMatch')
      socket.off(`@server:resetMatch`)
    }
  }, [matchId, resetMatch])

  // socket de updateTeam
  useEffect(() => {
    socket.on(`server:UpdateTeam/${matchId}`, (time: Partial<TeamFootball>) => {
      updateTeam(time.teamRole!, time)
    })

    return () => {
      console.log('desmontando socket de updateTeam')

      socket.off(`server:UpdateTeam/${matchId}`)
    }
  }, [matchId, updateTeam])

  // socket de AddPlayer
  useEffect(() => {
    socket.on(`server:AddPlayer/${matchId}`, (data: ISocketAddPlayer) => {
      console.log('addPlayer', data)

      addPlayerOverlay(data.teamRole, data.playerUpdate)
    })

    return () => {
      console.log('desmontando socket de addPlayer')
      socket.off(`server:AddPlayer/${matchId}`)
    }
  }, [matchId, addPlayerOverlay])

  // socket de AddEvent
  useEffect(() => {
    socket.on(`server:AddEvent/${matchId}`, (data: MatchEventFootball) => {
      addEventOverlay(data)
    })

    return () => {
      console.log('desmontando socket de AddEvent')
      socket.off(`server:AddEvent/${matchId}`)
    }
  }, [matchId, addEventOverlay])
}
