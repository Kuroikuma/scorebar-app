import { Balls } from './Balls'
import { Strikes } from './Strikes'

export default function GameScore() {
  return (
    <div className="text-2xl flex gap-1">
      <Balls />
      <span>-</span>
      <Strikes />
    </div>
  )
}




