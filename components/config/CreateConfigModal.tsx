import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { createConfigService } from '@/app/service/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfigGame } from '@/app/store/configStore'

interface CreateConfigModalProps {
  onConfigCreated: () => void
}

export function CreateConfigModal({ onConfigCreated }: CreateConfigModalProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scorebugOverlayId, setScorebugOverlayId] = useState('')
  const [scorebugModelId, setScorebugModelId] = useState('')
  const [scoreboardOverlayId, setScoreboardOverlayId] = useState('')
  const [scoreboardModelId, setScoreboardModelId] = useState('')
  const [scoreboardMinimalOverlayId, setScoreboardMinimalOverlayId] =
    useState('')
  const [scoreboardMinimalModelId, setScoreboardMinimalModelId] = useState('')

  const [formationAOverlayId, setFormationAOverlayId] = useState('')
  const [formationAModelId, setFormationAModelId] = useState('')

  const [formationBOverlayId, setFormationBOverlayId] = useState('')
  const [formationBModelId, setFormationBModelId] = useState('')
  const [battingOrderAOverlayId, setBattingOrderAOverlayId] = useState('')
  const [battiongOrderBOverlayId, setBattingOrderBOverlayId] = useState('')


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {

      let newConfig:Omit<ConfigGame, "_id"> = {
        userId: user._id,
        scorebug: { overlayId: scorebugOverlayId, modelId: scorebugModelId },
        scoreboard: { overlayId: scoreboardOverlayId, modelId: scoreboardModelId },
        scoreboardMinimal: { overlayId: scoreboardMinimalOverlayId, modelId: scoreboardMinimalModelId },
        formationA: { overlayId: formationAOverlayId, modelId: formationAModelId },
        formationB: { overlayId: formationBOverlayId, modelId: formationBModelId },
        battingOrderA: { overlayId: battingOrderAOverlayId },
        battingOrderB: { overlayId: battiongOrderBOverlayId },
      }

      await createConfigService(newConfig)
      setIsOpen(false)
      onConfigCreated()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Configuration</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Configuration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex w-full justify-between gap-4">
            <div>
              <Label htmlFor="scorebugOverlayId">Scorebug Overlay ID</Label>
              <Input
                id="scorebugOverlayId"
                value={scorebugOverlayId}
                onChange={(e) => setScorebugOverlayId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scorebugModelId">Scorebug Model ID</Label>
              <Input
                id="scorebugModelId"
                value={scorebugModelId}
                onChange={(e) => setScorebugModelId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex w-full justify-between gap-4">
            <div>
              <Label htmlFor="scoreboardOverlayId">Scoreboard Overlay ID</Label>
              <Input
                id="scoreboardOverlayId"
                value={scoreboardOverlayId}
                onChange={(e) => setScoreboardOverlayId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scoreboardModelId">Scoreboard Model ID</Label>
              <Input
                id="scoreboardModelId"
                value={scoreboardModelId}
                onChange={(e) => setScoreboardModelId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex w-full justify-between gap-4">
            <div>
              <Label htmlFor="scoreboardMinimalOverlayId">
                Mini Scoreboard Overlay
              </Label>
              <Input
                id="scoreboardMinimalOverlayId"
                value={scoreboardMinimalOverlayId}
                onChange={(e) => setScoreboardMinimalOverlayId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scoreboardMinimalModelId">
                Mini Scoreboard Model
              </Label>
              <Input
                id="scoreboardMinimalModelId"
                value={scoreboardMinimalModelId}
                onChange={(e) => setScoreboardMinimalModelId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex w-full justify-between gap-4">
            <div>
              <Label htmlFor="scoreboardMinimalOverlayId">
                Formation A Overlay
              </Label>
              <Input
                id="scoreboardMinimalOverlayId"
                value={scoreboardMinimalOverlayId}
                onChange={(e) => setFormationAOverlayId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scoreboardMinimalModelId">
                Formation B Model
              </Label>
              <Input
                id="scoreboardMinimalModelId"
                value={scoreboardMinimalModelId}
                onChange={(e) => setFormationAModelId(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex w-full justify-between gap-4">
            <div>
              <Label htmlFor="scoreboardMinimalOverlayId">
                Formation A Overlay
              </Label>
              <Input
                id="scoreboardMinimalOverlayId"
                value={scoreboardMinimalOverlayId}
                onChange={(e) => setFormationBOverlayId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scoreboardMinimalModelId">
                Formation B Model
              </Label>
              <Input
                id="scoreboardMinimalModelId"
                value={scoreboardMinimalModelId}
                onChange={(e) => setFormationBModelId(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex w-full justify-between gap-4">
            <div>
              <Label htmlFor="scoreboardMinimalOverlayId">
                Batting Order A Overlay
              </Label>
              <Input
                id="scoreboardMinimalOverlayId"
                value={battingOrderAOverlayId}
                onChange={(e) => setBattingOrderAOverlayId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="scoreboardMinimalModelId">
                Batting Order B Overlay
              </Label>
              <Input
                id="scoreboardMinimalModelId"
                value={battiongOrderBOverlayId}
                onChange={(e) => setBattingOrderBOverlayId(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit">Create Configuration</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
