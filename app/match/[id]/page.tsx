"use client"

import { useAuth } from '@/app/context/AuthContext';
import { ControlPanel } from '@/components/MatchComponents/ControlPanel'
import { ScoreboardOverlay } from '@/components/MatchComponents/overlays/ScoreboardOverlay';
import { useMatchStore } from '@/matchStore/matchStore';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Match = () => {

  const { user, loading } = useAuth();
  const paramas = useParams();
  const id = paramas?.id as string;

  const [gameId, setGameId] = useState<string | null>(id);

  const { getMatch } = useMatchStore()


  useEffect(() => {
    if (user && id) {
      getMatch(id);
      setGameId(id);
    }
  }, [user, gameId, getMatch, setGameId, loading, paramas, id]);

   if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <></>;
  }

  return (
    <main className="min-h-screen bg-[#13111a] text-white p-4">
      <div className="space-y-4 max-w-7xl mx-auto pt-24">
        <ControlPanel />
      </div>
    </main>
  )
}

export default Match
