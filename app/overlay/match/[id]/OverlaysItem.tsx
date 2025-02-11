import { useEffect } from 'react'
import { IOverlays, MatchEventFootball, PlayerFootball, TeamFootball, TeamRole } from '@/matchStore/interfaces'
import { useOverlaysStore } from '@/matchStore/overlayStore'
// import socket from '@/services/socket'
import { ScoreboardOverlay } from '@/components/MatchComponents/overlays/ScoreboardOverlay'
import { FormationOverlay } from '@/components/MatchComponents/overlays/FormationOverlay'
import GoalsDownOverlay from '@/components/MatchComponents/overlays/GoalsDownOverlay'
import ScoreBoardDown from '@/components/MatchComponents/overlays/ScoreBoardOverlayDown'
import PreviewOverlay from '@/components/MatchComponents/overlays/PreviewOverlay'
import { useMatchStore } from '@/matchStore/matchStore'
import { useTimeStore } from '@/matchStore/useTime'
import { useTeamStore } from '@/matchStore/useTeam'
import socket from '@/app/service/socket'

interface IOverlaysItemProps {
  item: IOverlays
  gameId: string
}

interface ISocketPosition {
  x: number
  y: number
}

interface ISocketScale {
  scale: number
}

interface ISocketVisible {
  visible: boolean
}

interface ISocketAddPlayer {
  playerUpdate: PlayerFootball
  teamRole: TeamRole
}

interface ScorebugProps {
  item: IOverlays
}

export const OverlaysItem = ({ item, gameId }: IOverlaysItemProps) => {
  const { handlePositionOverlay, handleVisibleOverlay, handleScaleOverlay, addPlayerOverlay, addEventOverlay } =
    useOverlaysStore()
    const { id: matchId } = useMatchStore()
    const { resetMatch } = useTimeStore()
    const { updateTeam,  } = useTeamStore()

  useEffect(() => {
    const eventName = `server:handlePositionOverlay/${gameId}/${item.id}`
    const eventNameScale = `server:handleScaleOverlay/${gameId}/${item.id}`
    const eventNameVisible = `server:handleVisibleOverlay/${gameId}/${item.id}`

    const handlePosition = (imagesSocket: ISocketPosition) => {
      handlePositionOverlay(
        item.id,
        { x: imagesSocket.x, y: imagesSocket.y },
        false
      )
    }

    const handleScale = (scale:number) => {
      handleScaleOverlay(item.id, scale, false)
    }

    const handleVisible = (visible: boolean) => {
      handleVisibleOverlay(item.id, visible, false)
    }

    socket.on(eventName, handlePosition)
    socket.on(eventNameScale, handleScale)
    socket.on(eventNameVisible, handleVisible)

    return () => {
      socket.off(eventName, handlePosition)
      socket.off(eventNameScale, handleScale)
      socket.off(eventNameVisible, handleVisible)
    }
  }, [gameId, item.id])



  // socket de resetMatch
  useEffect(() => {
    // Escuchar actualizaciones del servidor
    socket.on(`@server:resetMatch`, () => {
      resetMatch(false);
    });

    return () => {
      console.log("desmontando socket de resetMatch")
      socket.off(`@server:resetMatch`);
    };
  }, [matchId, resetMatch]);

  // socket de updateTeam
  useEffect(() => {
    socket.on(`server:UpdateTeam/${matchId}`, (time:Partial<TeamFootball>) => {
      updateTeam(time.teamRole!, time);
    });

    return () => {
      console.log("desmontando socket de updateTeam")
      
      socket.off(`server:UpdateTeam/${matchId}`);
    };
  }, [matchId, updateTeam]);

  // socket de AddPlayer
  useEffect(() => {
    socket.on(`server:AddPlayer/${matchId}`, (data:ISocketAddPlayer) => {
      console.log("addPlayer", data)
      
      addPlayerOverlay(data.teamRole, data.playerUpdate);
    });

    return () => {
      console.log("desmontando socket de addPlayer")
      socket.off(`server:AddPlayer/${matchId}`);
    };
  }, [matchId, addPlayerOverlay]);

  // socket de AddEvent
  useEffect(() => {
    socket.on(`server:AddEvent/${matchId}`, (data:MatchEventFootball) => {
      console.log("AddEvent", data)
      
      addEventOverlay(data);
    });

    return () => {
      console.log("desmontando socket de AddEvent")
      socket.off(`server:AddEvent/${matchId}`);
    };
  }, [matchId, addEventOverlay]);

  return item.id === 'scoreboardUp' ? (
    <ScoreboardOverlay item={item} />
  ) : item.id === 'formationA' ? (
    <FormationOverlay overlayId='formationA' visible={item.visible} />
  ) : item.id === 'scoreboardDown' ? (
    <ScoreBoardDown item={item} />
  ) : item.id === 'preview' ? (
    <PreviewOverlay item={item} />
  ) : item.id === 'formationB' ? (
    <FormationOverlay overlayId='formationB' visible={item.visible} />
  ) : <></>
}