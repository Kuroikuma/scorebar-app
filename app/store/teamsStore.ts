import { create } from 'zustand'
import { advanceBatterService, changeErrors, changeHits, scoreRun, updateLineupTeamService, updatePlayerService } from '@/app/service/api'
import { useGameStore } from './gameStore'
import { useHistoryStore } from './historiStore';
import { toast } from 'sonner';

export enum TypeHitting {
  Single = "Sencillo",//1B
  Double = "Doble",//2B
  Triple = "Triple",//3B
  HomeRun = "Cuadrangular", //HR
  BaseByBall = "Base por bola",//BB
  Out = "Out", // También puedes incluir "Out" como un tipo de bateo
  HitByPitch = "Golpe por lanzamiento", // HBP 
  ErrorPlay = "Error de juego"
}

export enum TypeAbbreviatedBatting {
  Single = "1B",
  Double = "2B",
  Triple = "3B",
  HomeRun = "HR",
  Out = "O",
  BaseBayBall = "BB",
  HitByPitch = "HBP",
  ErrorPlay = "Err"
}

export interface ITurnAtBat {
  inning: number;
  typeHitting: TypeHitting
  typeAbbreviatedBatting: TypeAbbreviatedBatting
  errorPlay: string
}

export type Player = {
  name: string
  position: string
  number: string
  battingOrder: number
  turnsAtBat: ITurnAtBat[];
  defensiveOrder: number;
}

export type Team = {
  name: string
  shortName: string
  runs: number
  color: string
  textColor: string
  logo: string | null
  lineup: Player[]
  currentBatter: number
  lineupSubmitted: boolean
  hits: number;
  errorsGame: number;
}

export type TeamsState = {
  gameId: string | null
  teams: Team[]
  setTeams: (teams: Team[]) => void
  incrementRuns: (teamIndex: number, newRuns: number, isSaved?: boolean) => Promise<void>
  incrementRunsOverlay: (teamIndex: number, runs: number, newRuns: number) => Promise<void>
  changeTeamName: (teamIndex: number, newName: string) => void
  setGameId: (id: string) => void
  changeTeamColor: (teamIndex: any, newColor: any) => Promise<void>
  changeTeamTextColor: (teamIndex: any, newTextColor: any) => Promise<void>
  incrementHits: (newHits: number) => Promise<void>
  incrementErrors: (newErrors: number) => Promise<void>
  updateHits: (newHits: number, teamIndex:number) => Promise<void>
  updateErrors: (newErrors: number, teamIndex:number) => Promise<void>
  decrementHits: (newHits:number) => Promise<void>
  decrementErrors: (newErrors:number) => Promise<void>
  updateLineup: (teamIndex: number, lineup: Player[]) => void
  advanceBatter: (teamIndex: number, isSaved?: boolean) => Promise<void>
  updatePlayer: (teamIndex: number, playerIndex: number, player: Player | null) => void
  submitLineup: (teamIndex: number) => Promise<void>
  changeTeamShortName: (teamIndex: any, newShortName: any) => Promise<void>
}

export const useTeamsStore = create<TeamsState>((set, get) => ({
  gameId: null,
  teams: [
    {
      name: 'HOME',
      runs: 0,
      color: '#2057D1',
      textColor: '#ffffff',
      logo: '',
      hits: 0,
      errorsGame: 0,
      lineup: [],
      currentBatter: 0,
      lineupSubmitted: false,
      shortName: 'HOME',
    },
    {
      name: 'AWAY',
      runs: 0,
      color: '#A31515',
      textColor: '#ffffff',
      logo: '',
      hits: 0,
      errorsGame: 0,
      lineup: [],
      currentBatter: 0,
      lineupSubmitted: false,
      shortName: 'AWAY',
    },
  ],
  setTeams: (teams) => set({ teams }),
  incrementRunsOverlay: async (teamIndex, runs, newRuns) => {
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, runs } : team)),
    }));

    useGameStore.getState().changeRunsByInning(teamIndex, newRuns, false);
  },
  incrementRuns: async (teamIndex, newRuns, isSaved = true) => {
    if (isSaved) {
      useHistoryStore.getState().handleRunsHistory(teamIndex);
    }

    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, runs: team.runs + newRuns } : team)),
    }));

    await useGameStore.getState().changeRunsByInning(teamIndex, newRuns, isSaved);

    let runs = get().teams[teamIndex].runs;

    let contendName = `${teamIndex + 1 === 1 ? 'a' : 'b'}Score`;
    let content = {
      [contendName]: runs,
    };
    // useGameStore.getState().setScoreBoardMinimal(content)

    if (get().gameId && isSaved) {
      let contendName = `Team ${teamIndex + 1} Runs`;
      let content = {
        [contendName]: runs,
      };

      try {
        // Enviar al overlay
        await useGameStore.getState().setScoreBug(content);
      } catch (error) {
        console.error('Failed to update overlay content:', error);
        // No detener la operación si el overlay falla
      }
      await scoreRun(get().gameId!, teamIndex, newRuns);
    }
  },
  changeTeamName: async (teamIndex, newName) => {
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, name: newName } : team)),
    }));
  },
  changeTeamShortName: async (teamIndex, newShortName) => {
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, shortName: newShortName } : team)),
    }));
  },
  changeTeamColor: async (teamIndex, newColor) => {
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, color: newColor } : team)),
    }));
  },
  changeTeamTextColor: async (teamIndex, newTextColor) => {
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, textColor: newTextColor } : team)),
    }));
  },
  setGameId: (id) => set({ gameId: id }),
  incrementHits: async (newHits) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1;
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, hits: team.hits + 1 } : team)),
    }));
    const { updateHits, advanceBatter } = get();
    updateHits(get().teams[teamIndex].hits, teamIndex);
    advanceBatter(teamIndex);
  },
  decrementHits: async (newHits) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1;
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, hits: team.hits - 1 } : team)),
    }));
    const { updateHits } = get();
    updateHits(get().teams[teamIndex].hits, teamIndex);
  },
  incrementErrors: async (newErrors) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1;
    set((state) => ({
      teams: state.teams.map((team, index) =>
        index === teamIndex ? { ...team, errorsGame: team.errorsGame + 1 } : team
      ),
    }));
    const { updateErrors } = get();
    updateErrors(get().teams[teamIndex].errorsGame, teamIndex);
  },
  decrementErrors: async (newErrors) => {
    const teamIndex = useGameStore.getState().isTopInning ? 0 : 1;
    set((state) => ({
      teams: state.teams.map((team, index) =>
        index === teamIndex ? { ...team, errorsGame: team.errorsGame - 1 } : team
      ),
    }));
    const { updateErrors } = get();
    updateErrors(get().teams[teamIndex].errorsGame, teamIndex);
  },
  updateHits: async (newHits, teamIndex) => {
    let { id } = useGameStore.getState();
    if (id) {
      await changeHits(id!, newHits, teamIndex);
    }
  },
  updateErrors: async (newErrors, teamIndex) => {
    let { id } = useGameStore.getState();
    if (id) {
      await changeErrors(id!, newErrors, teamIndex);
    }
  },
  updateLineup: (teamIndex, lineup) =>
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, lineup } : team)),
    })),
  advanceBatter: async (teamIndex, isSaved = true) => {
    let nextBatter = 1;

    const { getCurrentBatter } = useGameStore.getState();

    const currentBatter = getCurrentBatter();

    if (!currentBatter) {
      toast.error('El lineup no tiene jugador actualmente');
      return;
    }

    set((state) => {
      const isDHEnabled = useGameStore.getState().isDHEnabled;
      const team = state.teams[teamIndex];
      nextBatter = (team.currentBatter + 1) % team.lineup.length;

      if (isDHEnabled) {
        // Skip the pitcher if DH is enabled
        while (team.lineup[nextBatter].position === 'P') {
          nextBatter = (nextBatter + 1) % team.lineup.length;
        }
      }

      return {
        teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, currentBatter: nextBatter } : team)),
      };
    });
    // setActiveNumber((nextBatter + 1), teamIndex)
    if (isSaved) {
      await advanceBatterService(useGameStore.getState().id!, teamIndex, nextBatter);
    }
  },
  updatePlayer: async (teamIndex, playerIndex, player) => {
    const { teams } = get();
    const team = teams[teamIndex];
    let newLineup;

    if (player) {
      // If adding or updating a player
      newLineup = [...team.lineup.slice(0, playerIndex), player, ...team.lineup.slice(playerIndex + 1)];
    } else {
      // If removing a player
      newLineup = team.lineup.filter((_, i) => i !== playerIndex);
    }

    // Recalculate batting order
    const isDHEnabled = useGameStore.getState().isDHEnabled;
    newLineup = newLineup.map((p, index) => ({
      ...p,
      battingOrder: isDHEnabled && p.position === 'P' ? 0 : index + 1,
    }));

    await updatePlayerService(useGameStore.getState().id!, teamIndex, newLineup);

    set({ teams: teams.map((team, index) => (index === teamIndex ? { ...team, lineup: newLineup } : team)) });
  },
  submitLineup: async (teamIndex) => {
    const { teams } = get();
    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, lineupSubmitted: true } : team)),
    }));
    await updateLineupTeamService({ teamIndex, lineup: teams[teamIndex].lineup, id: useGameStore.getState().id! });
  },
}));