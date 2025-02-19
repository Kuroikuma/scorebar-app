import socket from '@/app/service/socket'
import { TimeFootball } from '@/matchStore/interfaces'
import { useMatchStore } from '@/matchStore/matchStore'
import { useTimeStore } from '@/matchStore/useTime'
import { useEffect } from 'react'

export function Time() {

  const { updateTime, time } = useTimeStore()

  const { id: matchId } = useMatchStore()
  

  useEffect(() => {
    // Unirse a la sala del partido
    socket.emit("@client:joinMatchRoom", matchId, false);

    // Escuchar actualizaciones del servidor
    socket.on("@server:timeUpdate", (serverTime: TimeFootball) => {
      updateTime(serverTime);
    });

    return () => {
      socket.off("@server:timeUpdate");
    };
  }, [matchId, updateTime]);


  const formatTime = (minutes: number, seconds: number) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`
  }


  useEffect(() => {
    // Escuchar actualizaciones del servidor
    socket.on(`server:UpdateTime/${matchId}`, (time:Partial<TimeFootball>) => {
      updateTime(time);
    });

    return () => {
      socket.off(`server:UpdateTime/${matchId}`);
    };
  }, [matchId, updateTime]);

  return (
    <div className="flex flex-col items-end justify-start gap-1">
      <div
        className="flex items-center h-[50px] justify-center bg-white text-2xl font-bold px-4 "
        style={{ color: '#00003d' }}
      >
        {formatTime(time.minutes, time.seconds)}
      </div>
      {time.stoppage > 0 && (
        <div
          className="flex items-center flex-1 h-[50%] bg-white text-2xl px-3 font-bold"
          style={{ color: '#00003d' }}
        >
          +{time.stoppage}
        </div>
      )}
    </div>
  )
}
