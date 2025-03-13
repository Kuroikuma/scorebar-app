import { create } from 'zustand';
import { IBanner, IBannerManager } from '../types/Banner';
import { 
  createBannerManagerService, 
  updateBannerManagerService, 
  getBannerManagerById, 
  getBannersManagerByOrganization 
} from '../service/bannerManager.service';
import { toast } from 'sonner';
import { useBannerStore } from './useBannerStore';
import { log } from 'console';

type BannerManagerStore = {
  bannerManager: IBannerManager | null;
  bannersManagers: IBannerManager[];
  isLoading: boolean;
  error: string | null;
  createBannerManager: (bannerData: Partial<IBannerManager>) => Promise<void>;
  updateBannerManager: (bannerId: string, bannerData: Partial<IBannerManager>) => Promise<void>;
  fetchBannerManagerById: (bannerId: string) => Promise<IBannerManager>;
  fetchBannersByOrganization: (organizationId: string) => Promise<void>;
  setSelectedBannerInManager: (id: string) => Promise<void>;
  setSelectedBannerInManagerOverlay: (bannerId: string, bannerData: IBannerManager) => void;
  updateBannerManagerOverlay: (bannerId: string, bannerData: IBannerManager) => void;
  updatePositionBanner:(newPosition: { x: number; y: number }) => Promise<void>;
};

export const useBannerManagerStore = create<BannerManagerStore>((set, get) => ({
  bannerManager: null,
  bannersManagers: [],
  isLoading: false,
  error: null,
  updatePositionBanner: async (newPosition) => {
    
    const { bannerManager } = get();

    const updateBanner = {
      ...(bannerManager as IBannerManager),
      position: newPosition
    };

    set({ bannerManager: updateBanner });
  },

  setSelectedBannerInManager: async (id) => {
    const { updateBannerManager, bannerManager } = get();
    const { banners, setSelectedBanner } = useBannerStore.getState();

    const banner = banners.find((b) => b._id === id);
    if (!banner || !bannerManager) return;

    setSelectedBanner(banner);
    
    const updatedManager: IBannerManager = {
      ...bannerManager,
      bannerId: banner._id,
      _id: bannerManager._id,
    };

    set({ bannerManager: updatedManager });
    await updateBannerManager(bannerManager._id, { bannerId: banner._id });
  },

  // Crea un nuevo banner y lo agrega a la lista
  createBannerManager: async (bannerData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await createBannerManagerService(bannerData);
      set((state) => ({
        bannersManagers: [...state.bannersManagers, data],
        isLoading: false,
      }));

      toast.success('Sala de anuncios creada correctamente');
    } catch (error: any) {
      set({ error: error.message || 'Error creando el banner', isLoading: false });
    }
  },

  // Actualiza un banner existente y actualiza el estado
  updateBannerManager: async (bannerId, bannerData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await updateBannerManagerService(bannerId, bannerData);
      set((state) => ({
        bannerManager: data,
        bannersManagers: state.bannersManagers.map((b) => (b._id === bannerId ? data : b)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Error actualizando el banner', isLoading: false });
    }
  },

  // Obtiene un banner por su ID
  fetchBannerManagerById: async (bannerId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBannerManagerById(bannerId);
      set({ bannerManager: data, isLoading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message || 'Error obteniendo el banner', isLoading: false });
    }
  },

  // Obtiene todos los bannersManagers de una organización específica
  fetchBannersByOrganization: async (organizationId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getBannersManagerByOrganization(organizationId);
      set({ bannersManagers: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Error obteniendo los bannersManagers por organización', isLoading: false });
    }
  },
  setSelectedBannerInManagerOverlay: (bannerId, bannerData) => {
    set({ isLoading: true, error: null });
    try {

      const { banners, setSelectedBanner } = useBannerStore.getState();

      const banner = banners.find((b) => b._id === bannerData.bannerId);
      if (!banner) return;

      setSelectedBanner(banner);

      set((state) => ({
        bannerManager: bannerData,
        bannersManagers: state.bannersManagers.map((b) => (b._id === bannerId ? bannerData : b)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || 'Error actualizando el banner', isLoading: false });
    }
  },
  updateBannerManagerOverlay: (bannerId, bannerData) => {
    set((state) => ({
      bannerManager: bannerData,
      bannersManagers: state.bannersManagers.map((b) => (b._id === bannerId ? bannerData : b)),
      isLoading: false,
    }));
  },
}));
