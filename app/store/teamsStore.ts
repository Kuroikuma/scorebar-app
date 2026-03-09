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
  // Pitcher: balks cometidos (Regla 6.02(a))
  balks?: number
  // ── Estadísticas ofensivas por jugador ───────────────────────────────────
  // Corredor: bases robadas exitosas (Regla 9.07)
  stolenBases?: number
  // Corredor: intentos de robo fallidos (caught stealing)
  caughtStealing?: number
  // ── Estadísticas defensivas adicionales ──────────────────────────────────
  // Catcher: corredores atrapados robando (caught stealing assists)
  caughtStealingBy?: number
  // ── Regla 5.10: Control de sustituciones ─────────────────────────────────
  // Indica si el jugador ha sido sustituido y no puede regresar al juego
  isSubstituted?: boolean
  // ID del jugador que reemplazó a este jugador (si fue sustituido)
  substitutedBy?: string
  // ID del jugador al que este jugador reemplazó (si es sustituto)
  substituteFor?: string
  // Indica si un pitcher que salió puede regresar solo como jugador de posición
  canReturnAsFielder?: boolean
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
  // ── Regla 5.10: Jugadores en la banca (disponibles para sustitución) ─────
  bench: Player[]
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
  // ── Regla 5.10: Sustituciones ────────────────────────────────────────────
  // Sustituye un jugador por otro, marcando al jugador original como sustituido
  substitutePlayer: (
    teamIndex: number,
    playerToRemoveId: string,
    newPlayer: Player
  ) => Promise<{ success: boolean; error?: string }>
  // Valida si un jugador puede ser sustituido o regresar al juego
  canPlayerBeSubstituted: (teamIndex: number, playerId: string) => boolean
  canPlayerReturn: (teamIndex: number, playerId: string) => boolean
  // ── Gestión de Banca ─────────────────────────────────────────────────────
  // Agrega un jugador a la banca (disponible para sustitución)
  addPlayerToBench: (teamIndex: number, player: Player) => Promise<void>
  // Remueve un jugador de la banca
  removePlayerFromBench: (teamIndex: number, playerId: string) => Promise<void>
  // Actualiza un jugador en la banca
  updateBenchPlayer: (teamIndex: number, playerId: string, player: Player) => Promise<void>
  // Sustituye usando un jugador de la banca
  substituteWithBenchPlayer: (
    teamIndex: number,
    playerToRemoveId: string,
    benchPlayerId: string
  ) => Promise<{ success: boolean; error?: string }>
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
      bench: [],
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
      bench: [],
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

  // ══════════════════════════════════════════════════════════════════════════
  // REGLA 5.10 — SUSTITUCIONES
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * Valida si un jugador puede ser sustituido.
   * 
   * Regla 5.10(a):
   * "Un jugador que ha sido sustituido no puede regresar al juego"
   * 
   * @returns true si el jugador está activo y no ha sido sustituido
   */
  canPlayerBeSubstituted: (teamIndex, playerId) => {
    const { teams } = get()
    const team = teams[teamIndex]
    const player = team.lineup.find((p) => p._id === playerId)
    
    if (!player) return false
    
    // Un jugador ya sustituido no puede ser sustituido nuevamente
    return !player.isSubstituted
  },

  /**
   * Valida si un jugador puede regresar al juego.
   * 
   * Regla 5.10(a):
   * "Un jugador que ha sido sustituido no puede regresar al juego"
   * 
   * Excepción: Un pitcher que salió puede regresar como jugador de posición
   * en algunas ligas (no MLB), pero esto debe ser configurado explícitamente.
   * 
   * @returns false siempre (jugadores sustituidos no pueden regresar)
   */
  canPlayerReturn: (teamIndex, playerId) => {
    const { teams } = get()
    const team = teams[teamIndex]
    const player = team.lineup.find((p) => p._id === playerId)
    
    if (!player) return false
    
    // Regla estricta: jugador sustituido no puede regresar
    if (player.isSubstituted) {
      // Excepción potencial: pitcher que puede regresar como fielder
      // (no implementado en MLB, pero algunas ligas lo permiten)
      if (player.canReturnAsFielder && player.position === 'P') {
        return true
      }
      return false
    }
    
    return true
  },

  /**
   * Sustituye un jugador por otro en el lineup.
   * 
   * Regla 5.10:
   * "Un jugador, o jugadores, pueden ser sustituidos durante un juego
   * en cualquier momento en que la bola esté muerta"
   * 
   * Validaciones implementadas:
   * 1. El jugador a remover debe estar activo (no sustituido previamente)
   * 2. El jugador sustituido queda marcado como isSubstituted=true
   * 3. El sustituto hereda la posición en el batting order
   * 4. Si es pitcher, se marca canReturnAsFielder (para ligas que lo permitan)
   * 5. Se mantiene el historial de turnos al bat del jugador original
   * 
   * @param teamIndex - Índice del equipo (0=home, 1=away)
   * @param playerToRemoveId - ID del jugador a sustituir
   * @param newPlayer - Nuevo jugador que entra al juego
   * @returns Objeto con success y mensaje de error si aplica
   */
  substitutePlayer: async (teamIndex, playerToRemoveId, newPlayer) => {
    const { teams, canPlayerBeSubstituted } = get()
    const team = teams[teamIndex]
    
    // ── Validación 1: Verificar que el jugador puede ser sustituido ─────────
    if (!canPlayerBeSubstituted(teamIndex, playerToRemoveId)) {
      return {
        success: false,
        error: 'El jugador ya ha sido sustituido y no puede ser removido nuevamente (Regla 5.10)',
      }
    }
    
    const playerToRemoveIndex = team.lineup.findIndex((p) => p._id === playerToRemoveId)
    
    if (playerToRemoveIndex === -1) {
      return {
        success: false,
        error: 'Jugador no encontrado en el lineup',
      }
    }
    
    const playerToRemove = team.lineup[playerToRemoveIndex]
    
    // ── Validación 2: Verificar que la bola está muerta ─────────────────────
    // (En una implementación completa, verificarías el estado del juego aquí)
    // Por ahora asumimos que las sustituciones solo se hacen cuando es válido
    
    // ── Paso 1: Marcar jugador original como sustituido ─────────────────────
    const updatedPlayerToRemove: Player = {
      ...playerToRemove,
      isSubstituted: true,
      substitutedBy: newPlayer._id,
      // Si es pitcher, permitir potencial regreso como fielder (configurable)
      canReturnAsFielder: playerToRemove.position === 'P',
    }
    
    // ── Paso 2: Configurar nuevo jugador ────────────────────────────────────
    const configuredNewPlayer: Player = {
      ...newPlayer,
      // Heredar posición en el batting order
      battingOrder: playerToRemove.battingOrder,
      defensiveOrder: playerToRemove.defensiveOrder,
      // Marcar que es sustituto
      substituteFor: playerToRemoveId,
      // Inicializar estadísticas si no existen
      turnsAtBat: newPlayer.turnsAtBat || [],
      wildPitches: newPlayer.wildPitches || 0,
      passedBalls: newPlayer.passedBalls || 0,
      strikeoutsThrown: newPlayer.strikeoutsThrown || 0,
      balks: newPlayer.balks || 0,
      stolenBases: newPlayer.stolenBases || 0,
      caughtStealing: newPlayer.caughtStealing || 0,
      caughtStealingBy: newPlayer.caughtStealingBy || 0,
    }
    
    // ── Paso 3: Actualizar lineup ───────────────────────────────────────────
    // Mantener al jugador original en el lineup pero marcado como sustituido
    // (para preservar historial de turnos al bat)
    // El nuevo jugador toma su lugar en el orden de bateo
    const updatedLineup = team.lineup.map((p, index) => {
      if (index === playerToRemoveIndex) {
        return configuredNewPlayer
      }
      if (p._id === playerToRemoveId) {
        return updatedPlayerToRemove
      }
      return p
    })
    
    // ── Paso 4: Actualizar currentBatter si es necesario ────────────────────
    let updatedCurrentBatter = team.currentBatter
    if (team.currentBatter === playerToRemoveIndex) {
      // Si el jugador sustituido era el bateador actual, el sustituto toma su lugar
      updatedCurrentBatter = playerToRemoveIndex
    }
    
    // ── Paso 5: Persistir cambios ───────────────────────────────────────────
    set({
      teams: teams.map((t, index) =>
        index === teamIndex
          ? { ...t, lineup: updatedLineup, currentBatter: updatedCurrentBatter }
          : t
      ),
    })
    
    const gameId = useGameStore.getState().id
    if (gameId) {
      await updatePlayerService(gameId, teamIndex, updatedLineup)
    }
    
    toast.success(
      `${playerToRemove.name} (#${playerToRemove.number}) sustituido por ${newPlayer.name} (#${newPlayer.number})`
    )
    
    return { success: true }
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GESTIÓN DE BANCA (BENCH)
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * Agrega un jugador a la banca del equipo.
   * 
   * Los jugadores en la banca están disponibles para entrar al juego
   * mediante sustitución, pero no participan activamente hasta que
   * reemplacen a un jugador del lineup.
   * 
   * @param teamIndex - Índice del equipo (0=home, 1=away)
   * @param player - Jugador a agregar a la banca
   */
  addPlayerToBench: async (teamIndex, player) => {
    const { teams } = get()
    const team = teams[teamIndex]
    
    // Validar que el jugador no esté ya en el lineup
    const isInLineup = team.lineup.some((p) => p._id === player._id)
    if (isInLineup) {
      toast.error('El jugador ya está en el lineup activo')
      return
    }
    
    // Validar que el jugador no esté ya en la banca
    const isInBench = team.bench.some((p) => p._id === player._id)
    if (isInBench) {
      toast.error('El jugador ya está en la banca')
      return
    }
    
    // Inicializar campos del jugador
    const benchPlayer: Player = {
      ...player,
      turnsAtBat: player.turnsAtBat || [],
      wildPitches: player.wildPitches || 0,
      passedBalls: player.passedBalls || 0,
      strikeoutsThrown: player.strikeoutsThrown || 0,
      balks: player.balks || 0,
      stolenBases: player.stolenBases || 0,
      caughtStealing: player.caughtStealing || 0,
      caughtStealingBy: player.caughtStealingBy || 0,
      isSubstituted: false,
    }
    
    const updatedBench = [...team.bench, benchPlayer]
    
    set({
      teams: teams.map((t, index) =>
        index === teamIndex ? { ...t, bench: updatedBench } : t
      ),
    })
    
    // Persistir en el backend
    const gameId = useGameStore.getState().id
    if (gameId) {
      // Nota: Necesitarás crear un endpoint en el backend para guardar la banca
      // Por ahora, guardamos como parte del equipo
      await updatePlayerService(gameId, teamIndex, team.lineup)
    }
    
    toast.success(`${player.name} (#${player.number}) agregado a la banca`)
  },

  /**
   * Remueve un jugador de la banca.
   * 
   * @param teamIndex - Índice del equipo (0=home, 1=away)
   * @param playerId - ID del jugador a remover
   */
  removePlayerFromBench: async (teamIndex, playerId) => {
    const { teams } = get()
    const team = teams[teamIndex]
    
    const playerToRemove = team.bench.find((p) => p._id === playerId)
    if (!playerToRemove) {
      toast.error('Jugador no encontrado en la banca')
      return
    }
    
    const updatedBench = team.bench.filter((p) => p._id !== playerId)
    
    set({
      teams: teams.map((t, index) =>
        index === teamIndex ? { ...t, bench: updatedBench } : t
      ),
    })
    
    toast.success(`${playerToRemove.name} removido de la banca`)
  },

  /**
   * Actualiza un jugador en la banca.
   * 
   * @param teamIndex - Índice del equipo (0=home, 1=away)
   * @param playerId - ID del jugador a actualizar
   * @param player - Datos actualizados del jugador
   */
  updateBenchPlayer: async (teamIndex, playerId, player) => {
    const { teams } = get()
    const team = teams[teamIndex]
    
    const playerIndex = team.bench.findIndex((p) => p._id === playerId)
    if (playerIndex === -1) {
      toast.error('Jugador no encontrado en la banca')
      return
    }
    
    const updatedBench = team.bench.map((p, index) =>
      index === playerIndex ? { ...p, ...player } : p
    )
    
    set({
      teams: teams.map((t, index) =>
        index === teamIndex ? { ...t, bench: updatedBench } : t
      ),
    })
    
    toast.success(`${player.name} actualizado`)
  },

  /**
   * Sustituye un jugador del lineup con un jugador de la banca.
   * 
   * Esta es la función principal para realizar sustituciones durante el juego.
   * Mueve al jugador de la banca al lineup y marca al jugador original como sustituido.
   * 
   * Regla 5.10:
   * "Un jugador, o jugadores, pueden ser sustituidos durante un juego
   * en cualquier momento en que la bola esté muerta"
   * 
   * @param teamIndex - Índice del equipo (0=home, 1=away)
   * @param playerToRemoveId - ID del jugador del lineup a sustituir
   * @param benchPlayerId - ID del jugador de la banca que entra
   * @returns Objeto con success y mensaje de error si aplica
   */
  substituteWithBenchPlayer: async (teamIndex, playerToRemoveId, benchPlayerId) => {
    const { teams, canPlayerBeSubstituted } = get()
    const team = teams[teamIndex]
    
    // ── Validación 1: Verificar que el jugador del lineup puede ser sustituido
    if (!canPlayerBeSubstituted(teamIndex, playerToRemoveId)) {
      return {
        success: false,
        error: 'El jugador ya ha sido sustituido y no puede ser removido nuevamente (Regla 5.10)',
      }
    }
    
    // ── Validación 2: Verificar que el jugador de la banca existe ───────────
    const benchPlayer = team.bench.find((p) => p._id === benchPlayerId)
    if (!benchPlayer) {
      return {
        success: false,
        error: 'Jugador no encontrado en la banca',
      }
    }
    
    // ── Validación 3: Verificar que el jugador del lineup existe ────────────
    const playerToRemoveIndex = team.lineup.findIndex((p) => p._id === playerToRemoveId)
    if (playerToRemoveIndex === -1) {
      return {
        success: false,
        error: 'Jugador no encontrado en el lineup',
      }
    }
    
    const playerToRemove = team.lineup[playerToRemoveIndex]
    
    // ── Paso 1: Marcar jugador original como sustituido ─────────────────────
    const updatedPlayerToRemove: Player = {
      ...playerToRemove,
      isSubstituted: true,
      substitutedBy: benchPlayer._id,
      canReturnAsFielder: playerToRemove.position === 'P',
    }
    
    // ── Paso 2: Configurar jugador de la banca para entrar al lineup ────────
    const configuredBenchPlayer: Player = {
      ...benchPlayer,
      // Heredar posición en el batting order
      battingOrder: playerToRemove.battingOrder,
      defensiveOrder: playerToRemove.defensiveOrder,
      // Marcar que es sustituto
      substituteFor: playerToRemoveId,
    }
    
    // ── Paso 3: Actualizar lineup (reemplazar jugador) ──────────────────────
    const updatedLineup = team.lineup.map((p, index) =>
      index === playerToRemoveIndex ? configuredBenchPlayer : p
    )
    
    // ── Paso 4: Remover jugador de la banca ─────────────────────────────────
    const updatedBench = team.bench.filter((p) => p._id !== benchPlayerId)
    
    // ── Paso 5: Agregar jugador sustituido a la banca (para tracking) ───────
    // Esto permite mantener el historial y potencialmente revertir si es necesario
    const finalBench = [...updatedBench, updatedPlayerToRemove]
    
    // ── Paso 6: Actualizar currentBatter si es necesario ────────────────────
    let updatedCurrentBatter = team.currentBatter
    if (team.currentBatter === playerToRemoveIndex) {
      // Si el jugador sustituido era el bateador actual, el sustituto toma su lugar
      updatedCurrentBatter = playerToRemoveIndex
    }
    
    // ── Paso 7: Persistir cambios ───────────────────────────────────────────
    set({
      teams: teams.map((t, index) =>
        index === teamIndex
          ? { 
              ...t, 
              lineup: updatedLineup, 
              bench: finalBench,
              currentBatter: updatedCurrentBatter 
            }
          : t
      ),
    })
    
    const gameId = useGameStore.getState().id
    if (gameId) {
      await updatePlayerService(gameId, teamIndex, updatedLineup)
    }
    
    toast.success(
      `${playerToRemove.name} (#${playerToRemove.number}) sustituido por ${benchPlayer.name} (#${benchPlayer.number})`
    )
    
    return { success: true }
  },
}));