import { useGameStore } from '@/app/store/gameStore'
import AnimatePopLayout from '../ui/AnimatePopLayout'

export default function GameScore() {

  const { balls, strikes } = useGameStore()

  return (
    <div className="text-2xl flex gap-1">
      <AnimatePopLayout dataNumber={balls}>{balls}</AnimatePopLayout>
      <span>-</span>
      <AnimatePopLayout dataNumber={strikes}>{strikes}</AnimatePopLayout>
    </div>
  )
}
