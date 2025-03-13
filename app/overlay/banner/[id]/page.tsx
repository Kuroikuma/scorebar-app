'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBannerManagerStore } from '@/app/store/useBannerManagerStore';
import { useBannerStore } from '@/app/store/useBannerStore';
import LowerThirdBanner from '@/components/bannerComponent/LowerThirdBanner';
import { ISponsor } from '@/app/types/sponsor';
import { IBannerSettings } from '@/app/types/Banner';
import { useBannerSocket } from '@/app/overlay/banner/[id]/useBannerSocket';

export default function OverlayPage() {
  const paramas = useParams();
  const id = paramas?.id as string;

  const { fetchBannerManagerById, bannerManager, setSelectedBannerInManagerOverlay: updateBannerManagerOverlay } = useBannerManagerStore();
  const { getById, findByOrganizationId } = useBannerStore();
  const [isExiting, setIsExiting] = useState(false);

  const { bannerSelected } = useBannerStore();
  const [mounted, setMounted] = useState(false);

  const { sponsorId, bannerSettingsId } = bannerSelected;

  const isVisibleBanner = bannerManager?.isVisible as boolean;
  const positionManager = bannerManager?.position;

  useEffect(() => {
    if (id) {
      const fetchBanner = async () => {
        let bannerManager = await fetchBannerManagerById(id);
        let banners = await findByOrganizationId(bannerManager.organizationId);
        await getById(bannerManager.bannerId || banners[0]._id);
      };
      fetchBanner();
    }
  }, [paramas, id]);

  useBannerSocket({ setIsExiting });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!bannerManager) {
    return <div>No se encontró el bannerManager</div>;
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-screen h-[calc(100vh)] bg-[#1a472a00] overflow-hidden">
      <div className={`relative aspect-video overflow-hidden`}>
        <div
          className={`absolute cursor-grab`}
          style={{
            left: `${positionManager?.x ?? 50}%`,
            top: `${positionManager?.y ?? 50}%`,
            transform: 'translate(-50%, -50%)',
            touchAction: 'none',
            // Fijar el ancho y alto durante el arrastre si tenemos las dimensiones
            width: '80%',
            height: 'auto',
            maxWidth: 'md',
          }}
        >
          <div className={`relative`}>
            <LowerThirdBanner
              sponsor={sponsorId as ISponsor}
              isVisible={isVisibleBanner}
              settings={bannerSettingsId as IBannerSettings}
              isExiting={isExiting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
