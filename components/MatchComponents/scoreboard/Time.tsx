import { useTimeStore } from '@/matchStore/useTime'

export function Time() {
  const { time, period } = useTimeStore()
  const activePeriod = period.find((p) => p.active)?.name || '1st Half'

  const formatTime = (minutes: number, seconds: number) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`
  }

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
