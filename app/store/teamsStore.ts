import { create } from 'zustand'
import { advanceBatterService, changeCurrentBatterService, changeErrors, changeHits, scoreRun, updateLineupTeamService, updatePlayerService } from '@/app/service/api'
import { useGameStore } from './gameStore'
import { useHistoryStore } from './historiStore';
import { toast } from 'sonner';

export enum TypeHitting {
  Single = "Sencillo",//1B
  Double = "Doble",//2B
  Triple = "Triple",//3B
  HomeRun = "Cuadrangular", //HR
  BaseByBall = "Base por bola",//BB
  Out = "Out",
  HitByPitch = "Golpe por lanzamiento", // HBP 
  ErrorPlay = "Error de juego",
  // Dropped Third Strike — el pitcher siempre recibe crédito de K
  // El bateador puede o no haber llegado a 1ra
  StruckOutWildPitch = "K - Lanzamiento Salvaje",  // WP: responsabilidad del pitcher
  StruckOutPassedBall = "K - Passed Ball",          // PB: responsabilidad del catcher
}

export enum TypeAbbreviatedBatting {
  Single = "1B",
  Double = "2B",
  Triple = "3B",
  HomeRun = "HR",
  Out = "O",
  BaseBayBall = "BB",
  HitByPitch = "HBP",
  ErrorPlay = "Err",
  StruckOutWildPitch = "K-WP",   // K + lanzamiento salvaje
  StruckOutPassedBall = "K-PB",  // K + passed ball
}

export interface ITurnAtBat {
  inning: number;
  typeHitting: TypeHitting
  typeAbbreviatedBatting: TypeAbbreviatedBatting
  errorPlay: string
  // Solo para K-WP y K-PB: indica si el bateador llegó safe a 1ra
  // (afecta las bases pero el pitcher igual recibe crédito de K)
  batterReachedBase?: boolean
}

export type Player = {
  _id?: string
  name: string
  position: string
  number: string
  battingOrder: number
  turnsAtBat: ITurnAtBat[];
  defensiveOrder: number;
  // ── Estadísticas defensivas por jugador ──────────────────────────────────
  // Pitcher: lanzamientos que pasaron al backstop por responsabilidad propia
  wildPitches?: number
  // Catcher: lanzamientos catcheables que dejó pasar
  passedBalls?: number
  // Pitcher: ponches propinados (incluye K-WP y K-PB, el pitcher siempre recibe K)
  strikeoutsThrown?: number
  // ── Estadísticas ofensivas por jugador ───────────────────────────────────
  // Corredor: bases robadas exitosas (Regla 9.07)
  stolenBases?: number
  // Corredor: intentos de robo fallidos (caught stealing)
  caughtStealing?: number
  // ── Estadísticas defensivas adicionales ──────────────────────────────────
  // Catcher: corredores atrapados robando (caught stealing assists)
  caughtStealingBy?: number
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
  changeCurrentBatter: (newCurrentBatterIndex: number) => void
  // Registra WP o PB en el jugador defensivo responsable (pitcher o catcher)
  // y anota el turno al bat del bateador con el tipo correcto
  recordDroppedThirdStrikeStats: (
    type: 'WP' | 'PB',
    batterReachedBase: boolean
  ) => Promise<void>
  // Registra WP o PB en estadísticas defensivas (uso general, no solo K)
  recordWildPitchOrPassedBall: (type: 'WP' | 'PB') => Promise<void>
  // Registra intento de base robada (Regla 9.07)
  recordStolenBaseAttempt: (
    runnerId: string,
    fromBase: number,
    toBase: number,
    wasSuccessful: boolean
  ) => Promise<void>
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
  /**
   * Registra WP o PB en estadísticas defensivas (uso general).
   * 
   * Regla 9.13:
   * - WP: se carga al pitcher cuando el lanzamiento es tan desviado
   *   que el catcher no puede detenerlo con esfuerzo ordinario
   * - PB: se carga al catcher cuando no retiene un lanzamiento
   *   que debió haber atrapado con esfuerzo ordinario
   * 
   * Esta función NO registra turno al bat del bateador.
   * Úsala cuando corredores avanzan por WP/PB sin que el bateador batee.
   */
  recordWildPitchOrPassedBall: async (type) => {
    const { isTopInning } = useGameStore.getState()
    const { teams, setTeams } = get()

    const defensiveTeamIndex = isTopInning ? 1 : 0
    const defensiveTeam = teams[defensiveTeamIndex]

    let updatedDefensiveLineup = [...defensiveTeam.lineup]

    if (type === 'WP') {
      // WP → pitcher: +1 wildPitches
      updatedDefensiveLineup = updatedDefensiveLineup.map((p) => {
        if (p.position === 'P') {
          return {
            ...p,
            wildPitches: (p.wildPitches ?? 0) + 1,
          }
        }
        return p
      })
    } else {
      // PB → catcher: +1 passedBalls
      updatedDefensiveLineup = updatedDefensiveLineup.map((p) => {
        if (p.position === 'C') {
          return { ...p, passedBalls: (p.passedBalls ?? 0) + 1 }
        }
        return p
      })
    }

    setTeams(
      teams.map((team, index) => {
        if (index === defensiveTeamIndex)
          return { ...team, lineup: updatedDefensiveLineup }
        return team
      })
    )

    // Persistir lineup defensivo en el backend
    const gameId = useGameStore.getState().id!
    if (gameId) {
      await updatePlayerService(gameId, defensiveTeamIndex, updatedDefensiveLineup)
    }
  },

  /**
   * Registra las estadísticas de un Dropped Third Strike en los jugadores
   * defensivos responsables y en el turno al bat del bateador.
   *
   * Reglas de asignación:
   * - WP (Wild Pitch): se carga al PITCHER  — Regla 9.13(a)
   *   "Se anotará lanzamiento salvaje cuando el pitcher lanza tan alto,
   *   tan bajo o tan lejos del home que el catcher no puede detenerlo
   *   con un esfuerzo ordinario"
   * - PB (Passed Ball): se carga al CATCHER — Regla 9.13(b)
   *   "Se anotará passed ball cuando el catcher no logra retener un
   *   lanzamiento que, con un esfuerzo ordinario, debió haber retenido"
   * - En ambos casos el PITCHER recibe crédito de ponche (strikeoutsThrown)
   */
  recordDroppedThirdStrikeStats: async (type, batterReachedBase) => {
    const { isTopInning } = useGameStore.getState()
    const { teams, setTeams } = get()

    const offensiveTeamIndex = isTopInning ? 0 : 1
    const defensiveTeamIndex = isTopInning ? 1 : 0

    const offensiveTeam = teams[offensiveTeamIndex]
    const defensiveTeam = teams[defensiveTeamIndex]

    // ── 1. Turno al bat del bateador ─────────────────────────────────────
    const currentBatterIndex = offensiveTeam.currentBatter
    const currentBatter = offensiveTeam.lineup[currentBatterIndex]

    if (!currentBatter) return

    const turnAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting:
        type === 'WP'
          ? TypeHitting.StruckOutWildPitch
          : TypeHitting.StruckOutPassedBall,
      typeAbbreviatedBatting:
        type === 'WP'
          ? TypeAbbreviatedBatting.StruckOutWildPitch
          : TypeAbbreviatedBatting.StruckOutPassedBall,
      errorPlay: '',
      batterReachedBase,
    }

    const updatedBatter: Player = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnAtBat],
    }

    const updatedOffensiveLineup = offensiveTeam.lineup.map((p, i) =>
      i === currentBatterIndex ? updatedBatter : p
    )

    // ── 2. Stats del jugador defensivo responsable ───────────────────────
    let updatedDefensiveLineup = [...defensiveTeam.lineup]

    if (type === 'WP') {
      // WP → pitcher: +1 wildPitches, +1 strikeoutsThrown
      updatedDefensiveLineup = updatedDefensiveLineup.map((p) => {
        if (p.position === 'P') {
          return {
            ...p,
            wildPitches: (p.wildPitches ?? 0) + 1,
            strikeoutsThrown: (p.strikeoutsThrown ?? 0) + 1,
          }
        }
        return p
      })
    } else {
      // PB → catcher: +1 passedBalls
      // Pitcher de todas formas recibe +1 strikeoutsThrown
      updatedDefensiveLineup = updatedDefensiveLineup.map((p) => {
        if (p.position === 'C') {
          return { ...p, passedBalls: (p.passedBalls ?? 0) + 1 }
        }
        if (p.position === 'P') {
          return { ...p, strikeoutsThrown: (p.strikeoutsThrown ?? 0) + 1 }
        }
        return p
      })
    }

    setTeams(
      teams.map((team, index) => {
        if (index === offensiveTeamIndex)
          return { ...team, lineup: updatedOffensiveLineup }
        if (index === defensiveTeamIndex)
          return { ...team, lineup: updatedDefensiveLineup }
        return team
      })
    )

    // Persistir ambos lineups en el backend
    const gameId = useGameStore.getState().id!
    if (gameId) {
      await updatePlayerService(gameId, offensiveTeamIndex, updatedOffensiveLineup)
      await updatePlayerService(gameId, defensiveTeamIndex, updatedDefensiveLineup)
    }
  },
  /**
   * Registra un intento de base robada (Regla 9.07).
   * 
   * Regla 9.07:
   * "Una base robada es una estadística acreditada a un corredor siempre que
   * avance una base sin la ayuda de un hit, un out puesto, un error,
   * un fielder's choice, un passed ball, un wild pitch o un balk"
   * 
   * @param runnerId - ID del corredor que intenta robar
   * @param fromBase - Base de origen (0=1ra, 1=2da, 2=3ra)
   * @param toBase - Base destino (1=2da, 2=3ra, 3=home)
   * @param wasSuccessful - true si robó exitosamente, false si fue out (caught stealing)
   */
  recordStolenBaseAttempt: async (runnerId, fromBase, toBase, wasSuccessful) => {
    const { isTopInning } = useGameStore.getState()
    const { teams, setTeams } = get()

    const offensiveTeamIndex = isTopInning ? 0 : 1
    const defensiveTeamIndex = isTopInning ? 1 : 0

    const offensiveTeam = teams[offensiveTeamIndex]
    const defensiveTeam = teams[defensiveTeamIndex]

    // ── 1. Actualizar estadísticas del corredor ─────────────────────────────
    let updatedOffensiveLineup = offensiveTeam.lineup.map((player) => {
      if (player._id === runnerId) {
        if (wasSuccessful) {
          // Base robada exitosa
          return {
            ...player,
            stolenBases: (player.stolenBases ?? 0) + 1,
          }
        } else {
          // Caught stealing
          return {
            ...player,
            caughtStealing: (player.caughtStealing ?? 0) + 1,
          }
        }
      }
      return player
    })

    // ── 2. Si fue caught stealing, dar crédito al catcher ───────────────────
    let updatedDefensiveLineup = [...defensiveTeam.lineup]
    
    if (!wasSuccessful) {
      updatedDefensiveLineup = updatedDefensiveLineup.map((player) => {
        if (player.position === 'C') {
          return {
            ...player,
            caughtStealingBy: (player.caughtStealingBy ?? 0) + 1,
          }
        }
        return player
      })
    }

    setTeams(
      teams.map((team, index) => {
        if (index === offensiveTeamIndex)
          return { ...team, lineup: updatedOffensiveLineup }
        if (index === defensiveTeamIndex)
          return { ...team, lineup: updatedDefensiveLineup }
        return team
      })
    )

    // Persistir ambos lineups en el backend
    const gameId = useGameStore.getState().id!
    if (gameId) {
      await updatePlayerService(gameId, offensiveTeamIndex, updatedOffensiveLineup)
      if (!wasSuccessful) {
        await updatePlayerService(gameId, defensiveTeamIndex, updatedDefensiveLineup)
      }
    }
  },

  changeCurrentBatter: async (newCurrentBatterIndex) => {

    const { isTopInning } = useGameStore.getState()
    const teamIndex = isTopInning ? 0 : 1

    set((state) => ({
      teams: state.teams.map((team, index) => (index === teamIndex ? { ...team, currentBatter: newCurrentBatterIndex } : team)),
    }));
    
    await changeCurrentBatterService(useGameStore.getState().id!, newCurrentBatterIndex, teamIndex)
  },
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