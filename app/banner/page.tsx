'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import BannerList from './BannerList';
import CreateBannerDialog from './CreateBannerDialog';
import { BannerManagerModal } from '@/components/bannerComponent/BannerManagerList';

export default function BannersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isModalBannerOpen, setIsModalBannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between relative">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 p-0 h-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Volver</span>
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
              Lista de banners
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              Mira tus banners publicitarios para diferentes transmisiones y presentaciones
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Banner
            </Button>

            <Button onClick={() => setIsModalBannerOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <MonitorPlay className="w-4 h-4 mr-2" />
              Ver salas de control
            </Button>
          </div>
        </header>

        <BannerList />
        <CreateBannerDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        <BannerManagerModal isOpen={isModalBannerOpen} onClose={() => setIsModalBannerOpen(false)} />
      </div>
    </div>
  );
}
