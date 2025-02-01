import { TabsContent } from '@radix-ui/react-tabs'
import { Button } from '../../ui/button'
import { useTeamStore } from '@/matchStore/useTeam'

export function TabContentScore() {
  const { homeTeam, awayTeam, updateTeam } = useTeamStore()
  return (
    <TabsContent value="score" className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>{homeTeam.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl w-8 text-center">{homeTeam.score}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  updateTeam('home', { score: Math.max(0, homeTeam.score - 1) })
                }
                className="bg-[#2a2438] hover:bg-[#352d47]"
              >
                -
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  updateTeam('home', { score: homeTeam.score + 1 })
                }
                className="bg-[#2a2438] hover:bg-[#352d47]"
              >
                +
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>{awayTeam.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl w-8 text-center">{awayTeam.score}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  updateTeam('away', { score: Math.max(0, awayTeam.score - 1) })
                }
                className="bg-[#2a2438] hover:bg-[#352d47]"
              >
                -
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  updateTeam('away', { score: awayTeam.score + 1 })
                }
                className="bg-[#2a2438] hover:bg-[#352d47]"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
