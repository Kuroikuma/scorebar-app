import { Balls } from './Balls'
import { Strikes } from './Strikes'

interface IGameScoreProps {
  classes?: string
}

export default function GameScore({ classes = "" }: IGameScoreProps) {
  return (
    <div className={`text-2xl flex gap-1 ${classes}`}>
      <Balls />
      <span>-</span>
      <Strikes />
    </div>
  )
}




