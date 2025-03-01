"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createGame, getConfigByUserId } from '@/app/service/api';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ConfigGame } from '@/app/store/configStore';
import { __initBases__, Game } from '@/app/store/gameStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoaderCircle, PlusCircle, Upload } from 'lucide-react';
import { useFileStorage } from '@/app/hooks/useUploadFile';
import { User } from '../types/user';
import { IOrganization } from '../types/organization';

interface NewGameProps {
  open: boolean
}

export default function NewGame({ open }: NewGameProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [team1Name, setTeam1Name] = useState('');
  const [team1ShortName, setTeam1ShortName] = useState('');
  const [team1Color, setTeam1Color] = useState('#000000');
  const [team1TextColor, setTeam1TextColor] = useState('#ffffff');
  const [team2Name, setTeam2Name] = useState('');
  const [team2ShortName, setTeam2ShortName] = useState('');
  const [team2Color, setTeam2Color] = useState('#ffffff');
  const [team2TextColor, setTeam2TextColor] = useState('#000000');
  const [gameDate, setGameDate] = useState('');
  const [configId, setConfigId] = useState('');
  const [configs, setConfigs] = useState<ConfigGame[]>([]);
  const { file: team1Logo, fileHandler: handleTeam1Logo } = useFileStorage();
  const { file: team2Logo, fileHandler: handleTeam2Logo } = useFileStorage();

  const handleLogoChange = (team: 'team1' | 'team2', event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {

      if (team === 'team1') {
        handleTeam1Logo(event.target.files[0]);
      } else {
        handleTeam2Logo(event.target.files[0]);
      }
    }
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      if (user) {
        const fetchedConfigs = await getConfigByUserId(user._id);
        setConfigs(fetchedConfigs);
      }
    };
    fetchConfigs();
  }, [user]);

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (user) {

      const dataCreate:Omit<Game, 'id'> = {
        organizationId: ((user as User).organizationId as IOrganization)._id, 
        date: new Date(gameDate),
        status: 'upcoming',
        teams: [{ 
          name: team1Name, 
          runs: 0, 
          color: team1Color, 
          textColor: team1TextColor, 
          hits: 0, 
          errorsGame: 0, 
          currentBatter: 0, 
          lineupSubmitted: false, 
          lineup: [], 
          shortName: team1ShortName,
          logo: team1Logo ? team1Logo : null
        },
        { 
          name: team2Name, 
          runs: 0, 
          color: team2Color, 
          textColor: team2TextColor, 
          hits: 0, 
          errorsGame: 0, 
          currentBatter: 0, 
          lineupSubmitted: false, 
          lineup: [], 
          shortName: team2ShortName,
          logo: team2Logo ? team2Logo : null
        },],
        inning: 1,
        isTopInning: true,
        balls: 0,
        strikes: 0,
        outs: 0,
        bases: __initBases__,
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
        playerStatsOverlay: {
          x: 0,
          y: 0,
          scale: 100,
          visible: false,
          id: "playerStats"
        },
      }
      
      const newGame = await createGame(dataCreate);
      router.push(`/games/${newGame._id}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Nuevo Partido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#fafafa] dark:bg-[#18181b]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Juego</DialogTitle>
          <DialogDescription className="text-white">
            Rellene los detalles para crear un nuevo juego.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="team1" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="team1">Equipo 1 (Home)</TabsTrigger>
              <TabsTrigger value="team2">Equipo 2 (Away)</TabsTrigger>
            </TabsList>
            <TabsContent value="team1" className="space-y-4">
              <div>
                <Label htmlFor="team1Name">Nombre del Equipo 1</Label>
                <Input
                  id="team1Name"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="team1ShortName">Nombre corto del Equipo 1</Label>
                <Input
                  id="team1ShortName"
                  value={team1ShortName}
                  onChange={(e) => setTeam1ShortName(e.target.value)}
                  required
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  Team 1 Logo
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    className="hidden"
                    id={`team-${0}-logo`}
                    accept="image/*"
                    onChange={(e) => handleLogoChange("team1", e)}
                  />
                  <Button
                    variant="outline"
                    className="bg-[#2d2b3b] hover:bg-[#363447] hover:text-white border-0 text-white"
                    onClick={() =>
                      document.getElementById(`team-${0}-logo`)?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  {team1Logo && (
                    <div className="relative w-10 h-10">
                      <img
                        src={team1Logo}
                        alt={`${team1Name} logo`}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team1Color">Color del Equipo 1</Label>
                  <Input
                    id="team1Color"
                    type="color"
                    value={team1Color}
                    onChange={(e) => setTeam1Color(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team1TextColor">Color del texto del Equipo 1</Label>
                  <Input
                    id="team1TextColor"
                    type="color"
                    value={team1TextColor}
                    onChange={(e) => setTeam1TextColor(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="team2" className="space-y-4">
              <div>
                <Label htmlFor="team2Name">Nombre del Equipo 2</Label>
                <Input
                  id="team2Name"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="team2ShortName">Nombre corto del Equipo 2</Label>
                <Input
                  id="team2ShortName"
                  value={team2ShortName}
                  onChange={(e) => setTeam2ShortName(e.target.value)}
                  required
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">
                  Team 2 Logo
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="file"
                    className="hidden"
                    id={`team-${1}-logo`}
                    accept="image/*"
                    onChange={(e) => handleLogoChange("team2", e)}
                  />
                  <Button
                    variant="outline"
                    className="bg-[#2d2b3b] hover:bg-[#363447] border-0 text-white"
                    onClick={() =>
                      document.getElementById(`team-${1}-logo`)?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  {team2Logo && (
                    <div className="relative w-10 h-10">
                      <img
                        src={team2Logo}
                        alt={`${team2Name} logo`}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team2Color">Color del Equipo 2</Label>
                  <Input
                    id="team2Color"
                    type="color"
                    value={team2Color}
                    onChange={(e) => setTeam2Color(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team2TextColor">Color del texto del Equipo 2</Label>
                  <Input
                    id="team2TextColor"
                    type="color"
                    value={team2TextColor}
                    onChange={(e) => setTeam2TextColor(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div>
            <Label htmlFor="date">Fecha del Juego</Label>
            <Input
              id="date"
              type="date"
              value={gameDate}
              onChange={(e) => setGameDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {
              loading ? <LoaderCircle className="animate-spin" /> : 'Crear Juego'
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

