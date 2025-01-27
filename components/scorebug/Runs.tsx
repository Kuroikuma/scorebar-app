import { Team } from '@/app/store/teamsStore'
import AnimatePopLayout from '../ui/AnimatePopLayout'
import { useGameStore } from '@/app/store/gameStore'
import { useEffect } from 'react'
import socket from '@/app/service/socket'
import { useOverlayStore } from '@/app/store/overlayStore'

interface RunsProps {
  team: Team
  classes?: string
}

interface ISocketRuns {
  teamIndex: number
  runs: number
  runsInning: number
}

const Runs = ({ team, classes = "" }: RunsProps) => {
  const { id } = useGameStore();
  const { incrementRunsOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:scoreRun/${id}`
    
    const updateRuns = (socketData: ISocketRuns) => {
      incrementRunsOverlay(socketData.teamIndex, socketData.runs, socketData.runsInning)
    }

    socket.on(eventName, updateRuns)

    return () => {
      socket.off(eventName, updateRuns)
    }
  }, [ id ])
  return (
    <AnimatePopLayout dataNumber={team.runs}>
      <span className={`text-3xl font-bold ${classes}`}>{team.runs}</span>
    </AnimatePopLayout>
  )
}

export default Runs
