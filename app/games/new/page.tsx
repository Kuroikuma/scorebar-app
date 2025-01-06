"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createGame, getConfigByUserId } from '@/app/service/api';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ConfigGame } from '@/app/store/configStore';
import { Game } from '@/app/store/gameStore';

export default function NewGame() {
  const { user } = useAuth();
  const router = useRouter();
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [configId, setConfigId] = useState('');
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    const fetchConfigs = async () => {
      if (user) {
        const fetchedConfigs = await getConfigByUserId(user._id);
        setConfigs(fetchedConfigs);
      }
    };
    fetchConfigs();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {

      const dataCreate:Omit<Game, 'id'> = {
        userId: user._id,
        date: new Date(gameDate),
        status: 'upcoming',
        teams: [
          { name: team1Name, runs: 0, color: '#000000', textColor: '#ffffff', hits: 0, errorsGame: 0, currentBatter: 0, lineupSubmitted: false, lineup: [], shortName:"home" },
          { name: team2Name, runs: 0, color: '#ffffff', textColor: '#000000', hits: 0, errorsGame: 0, currentBatter: 0, lineupSubmitted: false, lineup: [], shortName:"away" },
        ],
        inning: 1,
        isTopInning: true,
        balls: 0,
        strikes: 0,
        outs: 0,
        bases: [false, false, false],
        configId: configId,
        runsByInning: {},
        isDHEnabled: false,
        scoreboardOverlay: {
          x: 100,
          y: 100,
          scale: 100,
          visible: false,
          id: "scoreboard"
        },
        scorebugOverlay: {
          x: 200,
          y: 90,
          scale: 70,
          visible: false,
          id: "scorebug"
        },
        formationAOverlay: {
          x: 0,
          y: 0,
          scale: 100,
          visible: false,
          id: "formationA"
        },
        formationBOverlay: {
          x: 0,
          y: 0,
          scale: 100,
          visible: false,
          id: "formationB"
        },
        scoreboardMinimalOverlay: {
          x: 0,
          y: 0,
          scale: 100,
          visible: false,
          id: "scoreboardMinimal"
        },
      }
      
      const newGame = await createGame(dataCreate);
      router.push(`/games/${newGame._id}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="team1">Team 1 Name</Label>
              <Input
                id="team1"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="team2">Team 2 Name</Label>
              <Input
                id="team2"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Game Date</Label>
              <Input
                id="date"
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="config">Game Configuration</Label>
              <Select onValueChange={setConfigId} required>
                <SelectTrigger id="config">
                  <SelectValue placeholder="Select a configuration" />
                </SelectTrigger>
                <SelectContent>
                  {configs.length > 0 && configs.map((config:ConfigGame) => (
                    <SelectItem key={config._id} value={config._id}>
                      Configuration {config._id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Create Game</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

