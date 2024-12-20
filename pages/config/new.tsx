import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createConfig } from '@/service/api';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewConfig() {
  const { user } = useAuth();
  const router = useRouter();
  const [scorebugModelId, setScorebugModelId] = useState('');
  const [scoreboardModelId, setScoreboardModelId] = useState('');
  const [scoreboardMinimalModelId, setScoreboardMinimalModelId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newConfig = await createConfig({
        userId: user.id,
        scorebug: { overlayId: 'scorebug', modelId: scorebugModelId },
        scoreboard: { overlayId: 'scoreboard', modelId: scoreboardModelId },
        scoreboardMinimal: { overlayId: 'scoreboardMinimal', modelId: scoreboardMinimalModelId },
      });
      router.push(`/config/${newConfig.id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="scoreboardModelId">Scoreboard Model ID</Label>
              <Input
                id="scoreboardModelId"
                value={scoreboardModelId}
                onChange={(e) => setScoreboardModelId(e.target.value)}
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
        </CardContent>
      </Card>
    </div>
  );
}

