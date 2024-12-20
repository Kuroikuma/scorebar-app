import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllConfigs } from '@/service/api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "@/styles/fonts.css"
import "../../app/globals.css";
import { CreateConfigModal } from '@/components/config/CreateConfigModal';

export default function ConfigList() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState([]);

  const fetchCallBack = useCallback(() => {
    fetchConfigs();
  }, [user]);

  const fetchConfigs = async () => {
    if (user) {
      const fetchedConfigs = await getAllConfigs();
      setConfigs(fetchedConfigs);
    }
  };

  useEffect(() => {
    fetchCallBack();
  }, [user ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Game Configurations</h1>
        <CreateConfigModal onConfigCreated={fetchConfigs} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((config: any) => (
          <Card key={config.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Configuration {config.id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Scorebug Model: {config.scorebug.modelId}
              </p>
              <p className="text-xs text-muted-foreground">
                Scoreboard Model: {config.scoreboard.modelId}
              </p>
              <p className="text-xs text-muted-foreground">
                Minimal Scoreboard Model: {config.scoreboardMinimal.modelId}
              </p>
              <Link href={`/config/${config.id}`}>
                <Button variant="link" className="mt-2 p-0">Edit Configuration</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

