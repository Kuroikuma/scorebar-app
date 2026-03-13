'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useBannerStore } from '@/app/store/useBannerStore';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import BannerPreview from '@/components/bannerComponent/BannerPreview';
import { useBannerManagerStore } from '@/app/store/useBannerManagerStore';
import BannerList from './bannerList';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react'

export default function BannerManager() {
  const { user, loading } = useAuth();
  const { fetchBannerManagerById, bannerManager } = useBannerManagerStore();
  const { getById, findByOrganizationId } = useBannerStore();

  const paramas = useParams();
  const id = paramas?.id as string;

   const copyToClipboard = async (): Promise<void> => {
    try {
      let overlaURL = `https://scoreboard-app-pi.vercel.app/overlay/banner/${id}`
      await navigator.clipboard.writeText(overlaURL);
      toast.info("Overlay URL copiado al portapapeles");
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };


  useEffect(() => {
    if (user && id) {
      const fetchBanner = async () => {
        let bannerManager = await fetchBannerManagerById(id);
        let banners = await findByOrganizationId(bannerManager.organizationId);
        await getById(bannerManager.bannerId || banners[0]._id);
      };
      fetchBanner();
    }
  }, [user, loading, paramas, id]);

  if (!bannerManager) {
    return <div>No se encontró el bannerManager</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center relative">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
            {bannerManager.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Gestiona tus banners publicitarios profesionales para tus transmisiones y presentaciones
          </p>
        </header>

        <Button variant="ghost" onClick={() => copyToClipboard()}>
            <Clipboard className="h-4 w-4" />
            Copiar Overlay
          </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <BannerPreview isManagerView={true} />
              </div>
              <div className="lg:col-span-7">
                <BannerList />
              </div>
            </div>
      </div>
    </div>
  );
}
