import { create } from 'zustand';
import { PlayResultType } from '@/components/overlay/designs/baseball_play_result/PlayResultOverlay';
import { useOverlayStore } from './useOverlayStore';

interface PlayResultState {
  // Current play result state
  visible: boolean;
  playType: PlayResultType | null;
  playerName?: string;
  detail?: string;
  autoDismissMs: number;

  // Actions
  showPlayResult: (
    playType: PlayResultType,
    playerName?: string,
    detail?: string,
    autoDismissMs?: number
  ) => Promise<void>;
  hidePlayResult: () => void;
  setVisible: (visible: boolean) => void;
}

export const usePlayResultStore = create<PlayResultState>((set, get) => ({
  // Initial state
  visible: false,
  playType: null,
  playerName: undefined,
  detail: undefined,
  autoDismissMs: 7000,

  // Actions
  showPlayResult: async (playType, playerName, detail, autoDismissMs = 7000) => {
   const { overlays, updateOverlay } = useOverlayStore.getState();
   const overlayPlayResult = overlays.find((o => o.overlayTypeId?.name === 'baseball_play_result'));

   const customConfig =  {
      playType,
      playerName,
      detail,
      autoDismissMs
    };
   
    if (overlayPlayResult) {
      await updateOverlay(overlayPlayResult._id, { visible: true, customConfig, design: playType });
    }
    
    set({
      visible: true,
      playType,
      playerName,
      detail,
      autoDismissMs,
    });
  },

  hidePlayResult: () => {
    set({
      visible: false,
      playType: null,
      playerName: undefined,
      detail: undefined,
    });
  },

  setVisible: (visible) => {
    set({ visible });
  },
}));