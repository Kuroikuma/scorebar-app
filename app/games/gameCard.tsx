import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, Eye, EyeOff } from 'lucide-react'
import { Game, IOverlays } from '../store/gameStore'
import { Team } from '../store/teamsStore'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const OverlayToggle = ({
  overlay,
  onToggle,
}: {
  overlay: IOverlays
  onToggle: () => void
}) => (
  <Button
    variant="outline"
    size="icon"
    onClick={onToggle}
    className="absolute top-2 right-2"
  >
    {overlay.visible ? (
      <Eye className="h-4 w-4" />
    ) : (
      <EyeOff className="h-4 w-4" />
    )}
  </Button>
)

const TeamInfo = ({ team }: { team: Team }) => (
  <div className="flex items-center space-x-2">
    {team.logo && (
      <img
        src={team.logo || '/placeholder.svg'}
        alt={team.name}
        className="w-8 h-8 rounded-full"
      />
    )}
    <span className="font-semibold" style={{ color: '#000' }}>
      {team.name}
    </span>
    <Badge variant="secondary">{team.runs}</Badge>
  </div>
)

export const GameCard = ({ game }: { game: Game }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const toGame = () => router.push(`/games/${game.id}`)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Card onClick={toGame} className="w-full mb-4 overflow-hidden cursor-pointer ">
        <CardHeader className="bg-gradient-to-r from-red-500 to-blue-500 text-white">
          <CardTitle className="flex justify-between items-center">
            <span>
              {game.teams[0].name} vs {game.teams[1].name}
            </span>
            <Badge
              variant={
                game.status === 'in_progress' ? 'destructive' : 'secondary'
              }
            >
              {game.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <TeamInfo team={game.teams[0]} />
            <TeamInfo team={game.teams[1]} />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <Badge variant="outline" className="mr-2">
                Inning: {game.inning}
              </Badge>
              <Badge variant="outline">
                {game.isTopInning ? 'Top' : 'Bottom'}
              </Badge>
            </div>
            <Button variant="ghost" onClick={(event) => handleExpand(event)}>
              {isExpanded ? 'Hide Overlays' : 'Show Overlays'}
              <ChevronRight
                className={`ml-2 h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </Button>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <Card>
                  <CardContent className="p-2 relative">
                    <span className="font-semibold">Scoreboard</span>
                    <OverlayToggle
                      overlay={game.scoreboardOverlay}
                      onToggle={() => {
                        /* Toggle logic here */
                      }}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 relative">
                    <span className="font-semibold">Scorebug</span>
                    <OverlayToggle
                      overlay={game.scorebugOverlay}
                      onToggle={() => {
                        /* Toggle logic here */
                      }}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 relative">
                    <span className="font-semibold">Formation A</span>
                    <OverlayToggle
                      overlay={game.formationAOverlay}
                      onToggle={() => {
                        /* Toggle logic here */
                      }}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 relative">
                    <span className="font-semibold">Formation B</span>
                    <OverlayToggle
                      overlay={game.formationBOverlay}
                      onToggle={() => {
                        /* Toggle logic here */
                      }}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 relative">
                    <span className="font-semibold">Minimal Scoreboard</span>
                    <OverlayToggle
                      overlay={game.scoreboardMinimalOverlay}
                      onToggle={() => {
                        /* Toggle logic here */
                      }}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-2 relative">
                    <span className="font-semibold">Player Stats</span>
                    <OverlayToggle
                      overlay={game.playerStatsOverlay}
                      onToggle={() => {
                        /* Toggle logic here */
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
