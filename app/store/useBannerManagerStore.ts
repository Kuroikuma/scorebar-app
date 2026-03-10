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
    
    if (!bannerManager) {
      console.error('No banner manager available to update position');
      return;
    }

    // Actualización optimista del estado local
    const updatedBanner: IBannerManager = {
      ...bannerManager,
      position: newPosition
    };

    set({ bannerManager: updatedBanner });
    
    // Persistir en el backend (sin await para no bloquear la UI durante el drag)
    try {
      await updateBannerManagerService(bannerManager._id, { position: newPosition });
    } catch (error) {
      console.error('Error updating banner position:', error);
      // Revertir en caso de error
      set({ bannerManager });
    }
  },

  setSelectedBannerInManager: async (id) => {
    const { updateBannerManager, bannerManager } = get();
    const { banners, setSelectedBanner } = useBannerStore.getState();

    const banner = banners.find((b) => b._id === id);
    if (!banner) {
      console.error('Banner not found:', id);
      return;
    }
    
    if (!bannerManager) {
      console.error('No banner manager available');
      return;
    }

    setSelectedBanner(banner);
    
    const updatedManager: IBannerManager = {
      ...bannerManager,
      bannerId: banner._id,
    };

    set({ bannerManager: updatedManager });
    
    try {
      await updateBannerManager(bannerManager._id, { bannerId: banner._id });
    } catch (error) {
      console.error('Error updating banner manager:', error);
      // Revertir en caso de error
      set({ bannerManager });
    }
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
        bannerManager: state.bannerManager?._id === bannerId ? data : state.bannerManager,
        bannersManagers: state.bannersManagers.map((b) => (b._id === bannerId ? data : b)),
        isLoading: false,
      }));
      return data;
    } catch (error: any) {
      const errorMessage = error.message || 'Error actualizando el banner';
      set({ error: errorMessage, isLoading: false });
      console.error('Error in updateBannerManager:', error);
      throw error; // Re-throw para que el componente pueda manejarlo
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
      const errorMessage = error.message || 'Error obteniendo el banner';
      set({ error: errorMessage, isLoading: false });
      console.error('Error in fetchBannerManagerById:', error);
      throw error;
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
