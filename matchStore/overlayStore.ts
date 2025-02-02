import { OverlayState, PlayerFootball, TeamRole } from "@/matchStore/interfaces"
import { create } from "zustand"
import { useTeamStore } from "./useTeam";
import { useMatchStore } from "./matchStore";


let __initOverlays__ = {
  x: 20,
  y: 75,
  scale: 100,
  visible: false,
};

const initialState: OverlayState = {
  scoreboardUpOverlay: {...__initOverlays__, id: "scoreboardUp", y:5, x:10},
  formationOverlay: {...__initOverlays__, id: "formation", y:0, x:0},
  goalsDownOverlay: {...__initOverlays__, id: "goalsDown", y: 75},
  scoreBoardDownOverlay: {...__initOverlays__, id: "scoreBoardDown", y: 45},
  previewOverlay: {...__initOverlays__, id: "preview", y: 10, x: 10},
}

interface OverlaysStore extends OverlayState {
  handlePositionOverlay: (id: string, data: { x: number; y: number; }, isSaved?: boolean) => Promise<void>
  handleScaleOverlay: (id: string, scale: number, isSaved?: boolean) => Promise<void>
  handleVisibleOverlay: (id: string, visible: boolean, isSaved?: boolean) => Promise<void>
  loadOverlays: (overlays: OverlayState) => void
  addPlayerOverlay: (teamRole: TeamRole, player: PlayerFootball) => void
}

export const useOverlaysStore = create<OverlaysStore>((set, get) => ({
  ...initialState,
  handlePositionOverlay: async (
    id: string,
    data: { x: number; y: number },
    isSaved = true
  ) => {
    const { formationOverlay, scoreboardUpOverlay, goalsDownOverlay, scoreBoardDownOverlay, previewOverlay } = get()

    if (id === formationOverlay.id) {
      set({ formationOverlay: { ...formationOverlay, x: data.x, y: data.y } })
    } else if (id === scoreboardUpOverlay.id) {
      set({ scoreboardUpOverlay: { ...scoreboardUpOverlay, x: data.x, y: data.y } })
    } else if (id === "goalsDown") {
      set({ goalsDownOverlay: { ...goalsDownOverlay, x: data.x, y: data.y } })
    } else if (id === "scoreBoardDown") {
      set({ scoreBoardDownOverlay: { ...scoreBoardDownOverlay, x: data.x, y: data.y } })
    } else if (id === "preview") {
      set({ previewOverlay: { ...previewOverlay, x: data.x, y: data.y } })
    }
  },
  handleScaleOverlay: async (
    id: string,
    scale: number,
    isSaved = true
  ) => {
    const { formationOverlay, scoreboardUpOverlay, goalsDownOverlay, scoreBoardDownOverlay, previewOverlay } = get()

    if (id === formationOverlay.id) {
      set({ formationOverlay: { ...formationOverlay, scale } })
    } else if (id === scoreboardUpOverlay.id) {
      set({ scoreboardUpOverlay: { ...scoreboardUpOverlay, scale } })
    } else if (id === "goalsDown") {
      set({ goalsDownOverlay: { ...goalsDownOverlay, scale } })
    } else if (id === "scoreBoardDown") {
      set({ scoreBoardDownOverlay: { ...scoreBoardDownOverlay, scale } })
    } else if (id === "preview") {
      set({ previewOverlay: { ...previewOverlay, scale } })
    }
  },
  handleVisibleOverlay: async (
    id: string,
    visible: boolean,
    isSaved = true
  ) => {
    const { formationOverlay, scoreboardUpOverlay, goalsDownOverlay, scoreBoardDownOverlay, previewOverlay } = get()

    if (id === formationOverlay.id) {
      set({ formationOverlay: { ...formationOverlay, visible } })
    } else if (id === scoreboardUpOverlay.id) {
      set({ scoreboardUpOverlay: { ...scoreboardUpOverlay, visible } })
    } else if (id === "goalsDown") {
      set({ goalsDownOverlay: { ...goalsDownOverlay, visible } })
    } else if (id === "scoreBoardDown") {
      set({ scoreBoardDownOverlay: { ...scoreBoardDownOverlay, visible } })
    } else if (id === "preview") {
      set({ previewOverlay: { ...previewOverlay, visible } })
    }
  },
  loadOverlays: (overlays) => set(({ ...overlays })),

  addPlayerOverlay: async (teamRole, playerData) => {
    const { homeTeam, awayTeam } = useTeamStore.getState()

    let team = teamRole === "home" ? homeTeam : awayTeam;

    const updatedFormation = team.formation.positions.map((pos) => {
      if (!pos.assigned && pos.name === playerData.position) {
        return { ...pos, assigned: true };
      }
      return pos;
    });

    set(({
      [teamRole === "home" ? "homeTeam" : "awayTeam"]: {
        ...team,
        players: [
          ...team.players,
          { ...playerData },
        ],
        formation: {
          ...team.formation,
          positions: updatedFormation,
        },
      },
    }))
  },
}))

