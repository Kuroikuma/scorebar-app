import { Game, useGameStore } from '@/app/store/gameStore'
import { useUIStore } from '@/app/store/uiStore'
import TeamScore from './scorebug/TeamScore'
import GameInnings from './scorebug/GameInnings'
import GameOuts from './scorebug/GameOuts'
import GameScore from './scorebug/GameScore'
import Bases from './scorebug/Bases'

interface ClassicScoreboardProps {
  orientation?: 'horizontal' | 'vertical'
}

interface ISocketData {
  game: Omit<Game, "userId">
}

export function ClassicScoreboard({ orientation = 'vertical' }: ClassicScoreboardProps) {
  const { primaryColor, primaryTextColor } = useUIStore()

  let currrentOrientation = orientation === 'horizontal' ? 'flex-row' : 'flex-col'

  return (
    <div style={{ backgroundColor: primaryColor, color: primaryTextColor }} className={`flex ${currrentOrientation}`}>
      {/* Teams and Scores */}
      <div>
        <TeamScore />
        {/* Game Info Row */}
        <div className="flex items-center justify-between px-6 py-3">
          <GameInnings />
          <GameOuts />
          { orientation === 'vertical' && <GameScore /> }
        </div>
      </div>

      {/* Bases */}
      
      <Bases />
  
    </div>
  )
}
    