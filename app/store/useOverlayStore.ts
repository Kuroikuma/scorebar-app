import { create } from 'zustand';
import { IOverlay, IOverlayType, SportCategory, IOverlayUpdate } from '../types/overlay';
import { overlayService } from '../service/overlay.service';
import { overlayTypeService } from '../service/overlayType.service';

interface OverlayState {
  // State
  overlays: IOverlay[];
  overlayTypes: IOverlayType[];
  selectedOverlay: string | null;
  editMode: boolean;
  loading: boolean;
  error: string | null;

  // Actions - Overlay Management
  loadGameOverlays: (gameId: string) => Promise<void>;
  initializeGameOverlays: (gameId: string, sport: SportCategory) => Promise<void>;
  updateOverlay: (overlayId: string, updates: IOverlayUpdate, saved?: boolean) => Promise<void>;
  updateOverlayDesign: (overlayId: string, design: string, customConfig?: Record<string, any>) => Promise<void>;
  updateOverlayPosition: (overlayId: string, x: number, y: number) => Promise<void>;
  updateOverlayScale: (overlayId: string, scale: number) => Promise<void>;
  updateOverlayVisibility: (overlayId: string, visible: boolean) => Promise<void>;
  deleteOverlay: (overlayId: string) => Promise<void>;

  // Actions - Overlay Types
  loadOverlayTypes: (sport?: SportCategory) => Promise<void>;
  createOverlayType: (typeData: Partial<IOverlayType>) => Promise<void>;
  updateOverlayType: (typeId: string, updates: Partial<IOverlayType>) => Promise<void>;
  deleteOverlayType: (typeId: string) => Promise<void>;

  // Actions - UI State
  setSelectedOverlay: (overlayId: string | null) => void;
  setEditMode: (editMode: boolean) => void;
  clearError: () => void;

  // Getters
  getOverlayByType: (typeName: string) => IOverlay | undefined;
  getOverlaysByCategory: (category: string) => IOverlay[];
  getVisibleOverlays: () => IOverlay[];
}

export const useOverlayStore = create<OverlayState>((set, get) => ({
  // Initial State
  overlays: [],
  overlayTypes: [],
  selectedOverlay: null,
  editMode: false,
  loading: false,
  error: null,

  // Overlay Management Actions
  loadGameOverlays: async (gameId: string) => {
    set({ loading: true, error: null });
    try {
      const overlays = await overlayService.getGameOverlays(gameId);
      set({ overlays, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading overlays',
        loading: false 
      });
    }
  },

  initializeGameOverlays: async (gameId: string, sport: SportCategory) => {
    set({ loading: true, error: null });
    try {
      const overlays = await overlayService.initializeGameOverlays(gameId, sport);
      set({ overlays, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error initializing overlays',
        loading: false 
      });
    }
  },

  updateOverlay: async (overlayId: string, updates: IOverlayUpdate, saved: boolean = true) => {
    try {
      if (saved) {
        // Save to backend and update with response
        const updatedOverlay = await overlayService.updateOverlay(overlayId, updates);
        set(state => ({
          overlays: state.overlays.map(overlay => 
            overlay._id === overlayId ? { ...updatedOverlay, overlayTypeId: overlay.overlayTypeId } : overlay
          )
        }));
      } else {
        // Local update only (for socket events)
        set(state => ({
          overlays: state.overlays.map(overlay => 
            overlay._id === overlayId ? { ...overlay, ...updates } : overlay
          )
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating overlay' });
    }
  },

  updateOverlayDesign: async (overlayId: string, design: string, customConfig?: Record<string, any>) => {
    try {
      const updatedOverlay = await overlayService.updateDesign(overlayId, design, customConfig);
      set(state => ({
        overlays: state.overlays.map(overlay => 
          overlay._id === overlayId ? { ...updatedOverlay, overlayTypeId: overlay.overlayTypeId } : overlay
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating design' });
    }
  },

  updateOverlayPosition: async (overlayId: string, x: number, y: number) => {
    // Optimistic update
    set(state => ({
      overlays: state.overlays.map(overlay => 
        overlay._id === overlayId ? { ...overlay, x, y } : overlay
      )
    }));

    try {
      const updatedOverlay = await overlayService.updatePosition(overlayId, x, y);
      set(state => ({
        overlays: state.overlays.map(overlay => 
          overlay._id === overlayId ? { ...updatedOverlay, overlayTypeId: overlay.overlayTypeId } : overlay
        )
      }));
    } catch (error) {
      // Revert optimistic update on error
      get().loadGameOverlays(get().overlays[0]?.gameId || '');
      set({ error: error instanceof Error ? error.message : 'Error updating position' });
    }
  },

  updateOverlayScale: async (overlayId: string, scale: number) => {
    // Optimistic update
    set(state => ({
      overlays: state.overlays.map(overlay => 
        overlay._id === overlayId ? { ...overlay, scale } : overlay
      )
    }));

    try {
      const updatedOverlay = await overlayService.updateScale(overlayId, scale);
      set(state => ({
        overlays: state.overlays.map(overlay => 
          overlay._id === overlayId ? { ...updatedOverlay, overlayTypeId: overlay.overlayTypeId } : overlay
        )
      }));
    } catch (error) {
      // Revert optimistic update on error
      get().loadGameOverlays(get().overlays[0]?.gameId || '');
      set({ error: error instanceof Error ? error.message : 'Error updating scale' });
    }
  },

  updateOverlayVisibility: async (overlayId: string, visible: boolean) => {
    // Optimistic update
    set(state => ({
      overlays: state.overlays.map(overlay => 
        overlay._id === overlayId ? { ...overlay, visible } : overlay
      )
    }));

    try {
      const updatedOverlay = await overlayService.updateVisibility(overlayId, visible);
      set(state => ({
        overlays: state.overlays.map(overlay => 
          overlay._id === overlayId ? { ...updatedOverlay, overlayTypeId: overlay.overlayTypeId } : overlay
        )
      }));
    } catch (error) {
      // Revert optimistic update on error
      get().loadGameOverlays(get().overlays[0]?.gameId || '');
      set({ error: error instanceof Error ? error.message : 'Error updating visibility' });
    }
  },

  deleteOverlay: async (overlayId: string) => {
    try {
      await overlayService.deleteOverlay(overlayId);
      set(state => ({
        overlays: state.overlays.filter(overlay => overlay._id !== overlayId),
        selectedOverlay: state.selectedOverlay === overlayId ? null : state.selectedOverlay
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error deleting overlay' });
    }
  },

  // Overlay Types Actions
  loadOverlayTypes: async (sport?: SportCategory) => {
    set({ loading: true, error: null });
    try {
      const overlayTypes = sport 
        ? await overlayTypeService.getTypesBySport(sport)
        : await overlayTypeService.getAllTypes();
      set({ overlayTypes, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error loading overlay types',
        loading: false 
      });
    }
  },

  createOverlayType: async (typeData: Partial<IOverlayType>) => {
    try {
      const newType = await overlayTypeService.createType(typeData);
      set(state => ({
        overlayTypes: [...state.overlayTypes, newType]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error creating overlay type' });
    }
  },

  updateOverlayType: async (typeId: string, updates: Partial<IOverlayType>) => {
    try {
      const updatedType = await overlayTypeService.updateType(typeId, updates);
      set(state => ({
        overlayTypes: state.overlayTypes.map(type => 
          type._id === typeId ? updatedType : type
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating overlay type' });
    }
  },

  deleteOverlayType: async (typeId: string) => {
    try {
      await overlayTypeService.deleteType(typeId);
      set(state => ({
        overlayTypes: state.overlayTypes.filter(type => type._id !== typeId)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error deleting overlay type' });
    }
  },

  // UI State Actions
  setSelectedOverlay: (overlayId: string | null) => {
    set({ selectedOverlay: overlayId });
  },

  setEditMode: (editMode: boolean) => {
    set({ editMode });
  },

  clearError: () => {
    set({ error: null });
  },

  // Getters
  getOverlayByType: (typeName: string) => {
    const { overlays } = get();
    return overlays.find(overlay => overlay.overlayTypeId?.name === typeName);
  },

  getOverlaysByCategory: (category: string) => {
    const { overlays } = get();
    return overlays.filter(overlay => overlay.overlayTypeId?.category === category);
  },

  getVisibleOverlays: () => {
    const { overlays } = get();
    return overlays.filter(overlay => overlay.visible);
  },
}));