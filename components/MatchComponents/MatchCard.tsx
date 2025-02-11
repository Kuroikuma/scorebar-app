import { IFootballMatch, IOverlays, TeamFootball } from "@/matchStore/interfaces"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ChevronRight, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"


const TeamInfo = ({ team }: { team: TeamFootball }) => (
  <div className="flex items-center space-x-2">
     {team.logo && (
      <img
        src={team.logo || '/placeholder.svg'}
        alt={team.name}
        className="w-8 h-8 rounded-full"
      />
    )}

    <span className="font-semibold">{team.name}</span>
    <Badge variant="secondary">{team.score}</Badge>
  </div>
)

const OverlayToggle = ({ overlay, onToggle }: { overlay: IOverlays; onToggle: () => void }) => (
  <Button variant="outline" size="icon" onClick={onToggle} className="absolute top-2 right-2">
    {overlay.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
  </Button>
)

const OverlayCard = ({ title, overlay }: { title: string; overlay: IOverlays }) => (
  <Card>
    <CardContent className="p-2 relative">
      <span className="font-semibold">{title}</span>
      <OverlayToggle
        overlay={overlay}
        onToggle={() => {
          /* Toggle logic here */
        }}
      />
    </CardContent>
  </Card>
)

export const MatchCard = ({ match }: { match: IFootballMatch }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const router = useRouter()

  const handleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const toMatch = () => router.push(`/match/${match.id}`)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full mb-4 overflow-hidden" onClick={toMatch}>
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardTitle className="flex justify-between items-center">
            <span>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </span>
            <Badge variant={match.status === "in_progress" ? "destructive" : "secondary"}>
              {match.status.replace("_", " ")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <TeamInfo team={match.homeTeam} />
            <TeamInfo team={match.awayTeam} />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <Badge variant="outline" className="mr-2">
                {match.period.find((p) => p.active)?.name || "Not Started"}
              </Badge>
              <Badge variant="outline">
                {`${match.time.minutes}:${match.time.seconds.toString().padStart(2, "0")}`}
              </Badge>
            </div>
            <Button variant="ghost" onClick={(event) => handleExpand(event)}>
              {isExpanded ? "Hide Overlays" : "Show Overlays"}
              <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            </Button>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="mt-4 space-y-2">
                  <OverlayCard title="Scoreboard Up" overlay={match.scoreboardUpOverlay} />
                  <OverlayCard title="Formation" overlay={match.formationAOverlay} />
                  <OverlayCard title="Goals Down" overlay={match.goalsDownOverlay} />
                  <OverlayCard title="Scoreboard Down" overlay={match.scoreboardDownOverlay} />
                  <OverlayCard title="Preview" overlay={match.previewOverlay} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}