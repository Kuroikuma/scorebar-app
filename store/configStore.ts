import { create } from 'zustand'
import { getConfig, createConfig, updateConfig, deleteConfig } from '@/service/api'

interface OverlayConfig {
  overlayId: string;
  modelId: string;
}

export interface ConfigGame {
  _id: string;
  userId: string;
  scorebug: OverlayConfig;
  scoreboard: OverlayConfig;
  scoreboardMinimal: OverlayConfig;
}

type ConfigState = {
  currentConfig: ConfigGame | null;
  setCurrentConfig: (config: ConfigGame) => void;
  loadConfig: (id: string) => Promise<void>;
  createConfig: (config: Omit<ConfigGame, 'id'>) => Promise<ConfigGame>;
  updateConfig: (id: string, config: Partial<ConfigGame>) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  currentConfig: null,
  setCurrentConfig: (config) => set({ currentConfig: config }),
  loadConfig: async (id) => {
    const config = await getConfig(id);
    set({ currentConfig: config });
  },
  createConfig: async (config) => {
    const newConfig = await createConfig(config);
    set({ currentConfig: newConfig });
    return newConfig;
  },
  updateConfig: async (id, config) => {
    await updateConfig(id, config);
    set((state) => ({
      currentConfig: state.currentConfig ? { ...state.currentConfig, ...config } : null
    }));
  },
  deleteConfig: async (id) => {
    await deleteConfig(id);
    set({ currentConfig: null });
  },
}));

