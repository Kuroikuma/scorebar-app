import { useGameStore } from '@/app/store/gameStore'
import AnimatePopLayout from '../ui/AnimatePopLayout'

interface ISocketOut {
  outs: number;
  strikes: number;
  balls: number;
}

export default function GameOuts() {

  const { outs } = useGameStore()

  return (
    <div className="flex items-center">
      <AnimatePopLayout dataNumber={outs}>
        <span className="text-2xl">{outs}</span>
      </AnimatePopLayout>
      <span className="text-2xl ml-2">OUTS</span>
    </div>
  )
}
