import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllGames } from '@/service/api';
import Link from 'next/link';
import "@/styles/fonts.css"
import "../../app/globals.css";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckIcon, PlayIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RunsByInning } from '@/store/gameStore';

interface Game {
  _id: string | null;
  status: 'upcoming' | 'in_progress' | 'finished';
  teams: {
    name: string;
    runs: number;
    color: string;
    textColor: string;
    logo?: string;
  }[];
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: boolean[];
  runsByInning: RunsByInning
  date: string
}

export default function GamesList() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState([]);


  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchGames = async () => {
      if (user) {
        const fetchedGames = await getAllGames();
        setGames(fetchedGames);
      }
    };
    fetchGames();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <CalendarIcon className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <PlayIcon className="w-5 h-5 text-green-500" />;
      case 'finished':
        return <CheckIcon className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Games</h1>
        <Link href="/games/new">
          <Button>Create New Game</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game: Game) => (
          <Card key={game._id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {game.teams[0].name} vs {game.teams[1].name}
              </CardTitle>
              {getStatusIcon(game.status)}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Date: {new Date(game.date).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Status: {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
              </p>
              <Link href={`/games/${game._id}`}>
                <Button variant="link" className="mt-2 p-0">View Game</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

