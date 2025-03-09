'use client';

import { useAuth } from "@/app/context/AuthContext";
import { useBannerStore } from "@/app/store/useBannerStore";
import { useSponsorStore } from "@/app/store/useSponsor";
import { IOrganization } from "@/app/types/organization";
import BannerControlPanel from "@/components/bannerComponent/BannerControlPanel";
import BannerPreview from "@/components/bannerComponent/BannerPreview";
import { useParams } from "next/navigation";
import { useEffect } from "react";


export default function Banner() {

  const { user, loading } = useAuth();
  const { getById } = useBannerStore();
  const { getSponsorsByOrganizationId } = useSponsorStore();

  const paramas = useParams();
  const id = paramas?.id as string;

  useEffect(() => {
    if (user && id) {
      const fetchBanner = async () => {
        await getById(id);
        await getSponsorsByOrganizationId((user?.organizationId as IOrganization)._id);
      };
      fetchBanner();
    }
  }, [user, loading, paramas, id]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 py-12">
          <header className="mb-12 text-center relative">
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
              Banner Publicitario
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Crea y personaliza banners publicitarios profesionales para tus transmisiones y presentaciones
            </p>
          </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <BannerPreview />
              </div>
              <div className="lg:col-span-7">
                <BannerControlPanel />
              </div>
            </div>
        </div>
      </div>
  )
}

