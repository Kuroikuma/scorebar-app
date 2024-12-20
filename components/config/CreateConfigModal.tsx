import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createConfig } from '@/service/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateConfigModalProps {
  onConfigCreated: () => void;
}

export function CreateConfigModal({ onConfigCreated }: CreateConfigModalProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scorebugOverlayId, setScorebugOverlayId] = useState('');
  const [scorebugModelId, setScorebugModelId] = useState('');
  const [scoreboardOverlayId, setScoreboardOverlayId] = useState('');
  const [scoreboardModelId, setScoreboardModelId] = useState('');
  const [scoreboardMinimalOverlayId, setScoreboardMinimalOverlayId] = useState('');
  const [scoreboardMinimalModelId, setScoreboardMinimalModelId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await createConfig({
        userId: user._id,
        scorebug: { overlayId: scorebugOverlayId, modelId: scorebugModelId },
        scoreboard: { overlayId: scoreboardOverlayId, modelId: scoreboardModelId },
        scoreboardMinimal: { overlayId: scoreboardMinimalOverlayId, modelId: scoreboardMinimalModelId },
      });
      setIsOpen(false);
      onConfigCreated();
    }
  };

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
          <div>
            <Label htmlFor="scoreboardMinimalOverlayId">Minimal Scoreboard Overlay ID</Label>
            <Input
              id="scoreboardMinimalOverlayId"
              value={scoreboardMinimalOverlayId}
              onChange={(e) => setScoreboardMinimalOverlayId(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="scoreboardMinimalModelId">Minimal Scoreboard Model ID</Label>
            <Input
              id="scoreboardMinimalModelId"
              value={scoreboardMinimalModelId}
              onChange={(e) => setScoreboardMinimalModelId(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Create Configuration</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

