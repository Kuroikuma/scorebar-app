import { useTeamsStore } from '@/app/store/teamsStore'
import TeamLogo from './TeamLogo'
import TeamName from './TeamName'
import Runs from './Runs'
import { useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import socket from '@/app/service/socket'
import { useEffect } from 'react'

interface ISocketTeamColor {
  teamIndex: number
  color: string
}

interface ISocketTeamTextColor {
  teamIndex: number
  textColor: string
}

const TeamScore = () => {
  const { teams } = useTeamsStore()

  const { id } = useGameStore()

  const { changeTeamColorOverlay, changeTeamTextColorOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:teamColor/${id}`
    const eventNameTextColor = `server:teamTextColor/${id}`
    
    const updateTeamColor = (socketData: ISocketTeamColor) => {
      changeTeamColorOverlay(socketData.teamIndex, socketData.color)
    }

    const updateTeamTextColor = (socketData: ISocketTeamTextColor) => {
      changeTeamTextColorOverlay(socketData.teamIndex, socketData.textColor)
    }

    socket.on(eventName, updateTeamColor)
    socket.on(eventNameTextColor, updateTeamTextColor)

    return () => {
      socket.off(eventName, updateTeamColor)
      socket.off(eventNameTextColor, updateTeamTextColor)
    }
  }, [ id ])


  return (
    <div className="flex flex-col">
      {teams.map((team) => (
        <div
          key={team.name}
          style={{ backgroundColor: team.color, color: team.textColor }}
          className="flex  justify-between items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <TeamLogo logo={team.logo} name={team.name} />
            <TeamName name={team.name} />
          </div>
          <Runs team={team} />
        </div>
      ))}
    </div>
  )
}

export default TeamScore
