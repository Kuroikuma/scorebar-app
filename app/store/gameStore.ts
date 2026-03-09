import { create } from 'zustand'
import { getGame, updateGameService, changeBallCount, changeStrikeCount, changeOutCount, changeInningService, changeBaseRunner, changeRunsByInningService, changeStatusService, setDHService, handlePositionOverlayServices, handleScaleOverlayServices, handleVisibleOverlayServices, getOverlay, handlePlayServices, updatePlayerService } from '@/app/service/api'
import { ITurnAtBat, Player, Team, TypeAbbreviatedBatting, TypeHitting, useTeamsStore } from './teamsStore'
import { ConfigGame, useConfigStore } from './configStore';
import { useHistoryStore } from './historiStore';
import { toast } from 'sonner';

export type Status = 'upcoming' | 'in_progress' | 'finished';

// Función auxiliar para registrar en el historial (evita repetición)
const registerHistory = (type: 'inning' | 'out' | 'strike') => {
  useHistoryStore.getState().handleStrikeFlowHistory(type);
};

/**
 * Valida si una carrera cuenta cuando ocurre el tercer out
 * Implementa Regla 5.08(a) EXCEPCIÓN de MLB
 * 
 * Regla: No se anotará una carrera si el corredor avanza hasta home durante 
 * una jugada en la cual se realiza el tercer out:
 * 1. Sobre el bateador-corredor antes de que toque primera base
 * 2. Sobre cualquier corredor que haya sido out forzado
 * 3. Sobre un corredor precedente (que estaba en base anterior)
 * 
 * @param runnerAdvance - El avance del corredor que anotó
 * @param thirdOutAdvance - El avance donde ocurrió el tercer out
 * @param allAdvances - Todos los avances en la jugada
 * @returns true si la carrera cuenta, false si no cuenta
 */
const validateRunOnThirdOut = (
  runnerAdvance: RunnerAdvance,
  thirdOutAdvance: RunnerAdvance,
  allAdvances: RunnerAdvance[]
): boolean => {
  // CASO 1: Tercer out sobre bateador-corredor antes de tocar 1ra
  // fromBase: -1 representa al bateador
  if (thirdOutAdvance.fromBase === -1) {
    console.log('❌ Carrera invalidada: Tercer out en bateador antes de tocar 1ra (Regla 5.08(a)-1)');
    return false;
  }

  // CASO 2: Tercer out fue un out forzado
  if (thirdOutAdvance.isForced) {
    console.log('❌ Carrera invalidada: Tercer out fue forzado (Regla 5.08(a)-2)');
    return false;
  }

  // CASO 3: Tercer out en corredor precedente
  // Un corredor es precedente si estaba en una base anterior (número menor)
  if (thirdOutAdvance.fromBase < runnerAdvance.fromBase) {
    console.log('❌ Carrera invalidada: Tercer out en corredor precedente (Regla 5.08(a)-3)');
    return false;
  }

  // Si ninguna condición se cumple, la carrera SÍ cuenta
  console.log('✅ Carrera válida: Tercer out no invalida la carrera');
  return true;
};

let __initOverlays = {
  x: 100,
  y: 100,
  scale: 100,
  visible: false,
};

export type IOverlays = {
  visible: boolean;
  x: number;
  y: number;
  scale: number;
  id: string;
}

interface RunnerAdvance {
  fromBase: number // -1 para bateador, 0-2 para bases (0=1ra, 1=2da, 2=3ra)
  toBase: number | null // 0-2 para bases, 3 para home, null si es out
  isOut?: boolean
  isForced?: boolean // Indica si el out fue forzado (necesario para Regla 5.08(a))
  playerId?: string
}

export interface Game {
  id: string | null;
  status: Status;
  teams: Team[];
  inning: number;
  isTopInning: boolean;
  balls: number;
  strikes: number;
  outs: number;
  bases: IBase[];
  runsByInning: RunsByInning
  organizationId: string;
  date: string | Date;
  isDHEnabled: boolean;
  scoreboardOverlay: IOverlays;
  scorebugOverlay: IOverlays;
  formationAOverlay: IOverlays;
  formationBOverlay: IOverlays;
  scoreboardMinimalOverlay: IOverlays;
  playerStatsOverlay: IOverlays;
}

export interface RunsByInning {
  [inning: string]: number;
}

export interface IBase {
  isOccupied: boolean
  playerId: string | null
}

export type GameState = {
  id: string | null
  organizationId: string | null
  date: Date | string | null
  status: Status
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: IBase[]
  runsByInning: RunsByInning;
  setInning: (inning: number) => void
  setIsTopInning: (isTop: boolean) => void
  setBalls: (balls: number) => void
  setStrikes: (strikes: number) => void
  setOuts: (outs: number) => void
  setBases: (bases: IBase[]) => void
  setBase: (base: IBase, index: number) => void
  changeInning: (increment: boolean, isSaved?: boolean) => Promise<void>
  handleOutsChange: (newOuts: number, isSaved?: boolean, isAbvancedbatter?: boolean) => Promise<void>
  handleStrikeChange: (newStrikes: number, isSaved?: boolean) => Promise<void>
  handleBallChange: (newBalls: number, isSaved?: boolean) => Promise<void>
  changeGameStatus: (newStatus: 'upcoming' | 'in_progress' | 'finished') => void
  loadGame: (id: string) => Promise<any>
  loadOverlay: (id: string) => Promise<any>
  updateGame: () => Promise<void>
  setScoreBug: (content: any) => Promise<void>
  changeIsTopInning: (isTopInning: boolean) => Promise<void>
  changeRunsByInning: (teamIndex: number, newRuns: number, isSaved?: boolean) => Promise<void>
  setScoreBoard: (content: any) => Promise<void>
  setScoreBoardMinimal: (content: any) => Promise<void>
  startGame: () => void
  endGame: () => void
  isDHEnabled: boolean
  setIsDHEnabled: (enabled: boolean) => Promise<void>
  getCurrentBatter: () => Player | null
  getCurrentPitcher: () => { name: string; number: string } | null
  advanceBatter: (isSaved?: boolean) => Promise<void>
  scoreboardOverlay: IOverlays;
  scorebugOverlay: IOverlays;
  formationAOverlay: IOverlays;
  formationBOverlay: IOverlays;
  scoreboardMinimalOverlay: IOverlays;
  playerStatsOverlay: IOverlays;
  handlePositionOverlay: (id: string, data: { x: number; y: number; }, isSaved?: boolean) => Promise<void>
  handleScaleOverlay: (id: string, scale: number, isSaved?: boolean) => Promise<void>
  handleVisibleOverlay: (id: string, visible: boolean, isSaved?: boolean) => Promise<void>
  handleSingle: (runsScored:number, isStay:boolean) => Promise<void>
  handleDouble: (runsScored:number, isStay:boolean) => Promise<void>
  handleTriple: (runsScored:number) => Promise<void>
  handleHomeRun: () => Promise<void>
  handleHitByPitch: () => Promise<void>
  handleErrorPlay: (defensiveOrder: number) => Promise<void>
  handleOutPlay: ( isSaved:boolean) => Promise<void>
  handleBBPlay: () => Promise<void>
  loadGameHistory: (game: Partial<Omit<Game, "userId">>) => Promise<void>
  handleAdvanceRunners: (advances: RunnerAdvance[]) => Promise<void>
  // Maneja avance de corredores por Wild Pitch (Regla 9.13)
  handleWildPitch: (advances: RunnerAdvance[]) => Promise<void>
  // Maneja avance de corredores por Passed Ball (Regla 9.13)
  handlePassedBall: (advances: RunnerAdvance[]) => Promise<void>
  // Maneja intento de base robada (Regla 9.07)
  handleStolenBase: (
    runnerId: string,
    fromBase: number,
    toBase: number,
    wasSuccessful: boolean
  ) => Promise<void>
  // Maneja balk del pitcher (Regla 6.02(a))
  handleBalk: () => Promise<void>
    // ── Dropped Third Strike ────────────────────────────────────────────────
  // true cuando strike 3 ocurre y la condición de dropped third strike aplica.
  // La UI lo observa para mostrar el modal de resolución.
  pendingDroppedThirdStrike: boolean
  setPendingDroppedThirdStrike: (value: boolean) => void
  /**
   * Resuelve un dropped third strike (K-WP o K-PB).
   * 
   * @param type        'WP' si el lanzamiento fue wild pitch, 'PB' si fue passed ball
   * @param batterSafe  true si el bateador llegó safe a 1ra base
   * 
   * Regla 5.05(a)(2): el bateador puede correr a 1ra solo si:
   *   - 1ra base está desocupada, O
   *   - hay 2 outs (sin importar si 1ra está ocupada)
   * En cualquier otro caso es out normal (pero WP/PB igual se registra).
   */
  handleDroppedThirdStrike: (type: 'WP' | 'PB', batterSafe: boolean) => Promise<void>
}

const __initBase__ = {
  isOccupied: false,
  playerId: null,
}

export const __initBases__ = [
  {
    isOccupied: false,
    playerId: null,
  },
  {
    isOccupied: false,
    playerId: null,
  },
  {
    isOccupied: false,
    playerId: null,
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  id: null,
  organizationId: null,
  date: null,
  status: 'upcoming',
  inning: 1,
  isTopInning: true,
  balls: 0,
  strikes: 0,
  outs: 0,
  bases: __initBases__,
  runsByInning: {},
  hits: 0,
  errorsGame: 0,
  scoreboardOverlay: {
    ...__initOverlays,
    id: 'scoreboard',
  },
  scorebugOverlay: {
    ...__initOverlays,
    id: 'scorebug',
  },
  formationAOverlay: {
    ...__initOverlays,
    id: 'formationA',
  },
  formationBOverlay: {
    ...__initOverlays,
    id: 'formationB',
  },
  scoreboardMinimalOverlay: {
    ...__initOverlays,
    id: 'scoreboardMinimal',
  },
  playerStatsOverlay: {
    ...__initOverlays,
    id: 'playerStats',
  },
   pendingDroppedThirdStrike: false,
  setPendingDroppedThirdStrike: (value) => set({ pendingDroppedThirdStrike: value }),
  handleAdvanceRunners: async (advances: RunnerAdvance[]) => {
    console.log('🔄 Procesando avances de corredores:', advances);
    
    const { isTopInning, updateGame, outs, changeInning } = get()
    const { teams, setTeams } = useTeamsStore.getState()

    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]
    
    // Filtrar solo los avances safe
    const safeAdvances = advances.filter((advance) => advance.toBase !== null)
    
    // Contar outs en la jugada
    const outsInPlay = advances.filter((advance) => advance.isOut).length
    const newOuts = outs + outsInPlay
    const isThirdOut = newOuts >= 3

    console.log(`📊 Outs antes: ${outs}, Outs en jugada: ${outsInPlay}, Outs después: ${newOuts}`);

    // 🔴 VALIDACIÓN REGLA 5.08(a) EXCEPCIÓN
    let validRuns = 0
    
    if (isThirdOut && outsInPlay > 0) {
      console.log('⚠️ Tercer out detectado - Validando Regla 5.08(a)');
      
      // Encontrar el momento del tercer out (el último out en la jugada)
      const outsAdvances = advances.filter(a => a.isOut);
      const thirdOutAdvance = outsAdvances[outsAdvances.length - 1];
      
      console.log('🎯 Tercer out en:', {
        fromBase: thirdOutAdvance.fromBase === -1 ? 'Bateador' : `Base ${thirdOutAdvance.fromBase + 1}`,
        isForced: thirdOutAdvance.isForced
      });
      
      // Verificar cada carrera potencial
      for (const advance of advances) {
        if (!advance.isOut && advance.toBase === 3) { // Corredor anotando
          console.log(`🏃 Evaluando carrera desde base ${advance.fromBase + 1}`);
          const shouldCount = validateRunOnThirdOut(
            advance,
            thirdOutAdvance,
            advances
          );
          if (shouldCount) {
            validRuns++;
          }
        }
      }
      
      console.log(`✅ Carreras válidas: ${validRuns} de ${advances.filter(a => !a.isOut && a.toBase === 3).length} potenciales`);
    } else {
      // Si no es tercer out, contar todas las carreras normalmente
      validRuns = advances.filter((advance) => !advance.isOut && advance.toBase === 3).length;
      console.log(`✅ No hay tercer out - Todas las carreras cuentan: ${validRuns}`);
    }

    const runsScored = currentTeam.runs + validRuns

    // Crear nuevo estado de bases
    const newBases = [...get().bases]

    // Procesar los avances en orden inverso (de home a primera) para evitar sobreescribir
    safeAdvances
      .sort((a, b) => b.fromBase - a.fromBase)
      .forEach((advance) => {
        // Marcar la base original como vacía
        newBases[advance.fromBase].isOccupied = false

        // Si el avance no es a home (base 3), marcar la nueva base como ocupada
        if (advance.toBase! < 3 && !advance.isOut) {
          newBases[advance.toBase!].isOccupied = true
          newBases[advance.toBase!].playerId = newBases[advance.fromBase].playerId
        }

        newBases[advance.fromBase].playerId = null
      })

      currentTeam.runs = runsScored

    // Actualizar el estado
    set({
      bases: newBases,
      outs: newOuts,
    })

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...currentTeam }
          : team
      )
    )

    newOuts === 3 && changeInning(true, false)
    await updateGame()
  },

  /**
   * Maneja avance de corredores por Wild Pitch (Regla 9.13).
   * 
   * Registra WP en estadísticas del pitcher y procesa los avances.
   * Úsalo cuando el lanzamiento es tan desviado que el catcher
   * no puede detenerlo con esfuerzo ordinario.
   */
  handleWildPitch: async (advances: RunnerAdvance[]) => {
    console.log('🌪️ Wild Pitch - Registrando estadística del pitcher');
    
    // Registrar WP en estadísticas del pitcher
    await useTeamsStore.getState().recordWildPitchOrPassedBall('WP')
    
    // Procesar avances de corredores
    await get().handleAdvanceRunners(advances)
  },

  /**
   * Maneja avance de corredores por Passed Ball (Regla 9.13).
   * 
   * Registra PB en estadísticas del catcher y procesa los avances.
   * Úsalo cuando el catcher no retiene un lanzamiento catcheable
   * con esfuerzo ordinario.
   */
  handlePassedBall: async (advances: RunnerAdvance[]) => {
    console.log('🧤 Passed Ball - Registrando estadística del catcher');
    
    // Registrar PB en estadísticas del catcher
    await useTeamsStore.getState().recordWildPitchOrPassedBall('PB')
    
    // Procesar avances de corredores
    await get().handleAdvanceRunners(advances)
  },

  /**
   * Maneja intento de base robada (Regla 9.07).
   * 
   * Regla 9.07: Una base robada es acreditada cuando el corredor avanza
   * sin ayuda de hit, out, error, fielder's choice, PB, WP o balk.
   * 
   * @param runnerId - ID del corredor
   * @param fromBase - Base de origen (0=1ra, 1=2da, 2=3ra)
   * @param toBase - Base destino (1=2da, 2=3ra, 3=home)
   * @param wasSuccessful - true si SB, false si CS (caught stealing)
   */
  handleStolenBase: async (runnerId, fromBase, toBase, wasSuccessful) => {
    console.log(`🏃 Intento de robo: Base ${fromBase + 1} → ${toBase === 3 ? 'Home' : `Base ${toBase + 1}`}`)
    
    const { bases, outs, updateGame, changeInning } = get()

    // Registrar estadísticas del intento
    await useTeamsStore.getState().recordStolenBaseAttempt(
      runnerId,
      fromBase,
      toBase,
      wasSuccessful
    )

    if (wasSuccessful) {
      // ── Base robada exitosa ────────────────────────────────────────────
      console.log('✅ Base robada exitosa')
      
      const newBases = [...bases]
      
      // Si roba home, anotar carrera
      if (toBase === 3) {
        const { isTopInning } = get()
        const teamIndex = isTopInning ? 0 : 1
        await useTeamsStore.getState().incrementRuns(teamIndex, 1, false)
        newBases[fromBase] = { isOccupied: false, playerId: null }
      } else {
        // Mover corredor a la nueva base
        newBases[toBase] = { ...newBases[fromBase] }
        newBases[fromBase] = { isOccupied: false, playerId: null }
      }

      set({ bases: newBases })
      await updateGame()
      
    } else {
      // ── Caught stealing (out) ──────────────────────────────────────────
      console.log('❌ Caught stealing - Out')
      
      const newBases = [...bases]
      newBases[fromBase] = { isOccupied: false, playerId: null }
      
      const newOuts = outs + 1
      
      if (newOuts >= 3) {
        set({ bases: __initBases__, outs: 0 })
        await changeInning(true, false)
      } else {
        set({ bases: newBases, outs: newOuts })
      }
      
      await updateGame()
    }
  },

  /**
   * Maneja balk del pitcher (Regla 6.02(a)).
   * 
   * Regla 6.02(a): Es un balk cuando el pitcher, mientras está tocando
   * la goma, hace cualquier movimiento naturalmente asociado con su
   * lanzamiento y no realiza tal lanzamiento.
   * 
   * Efecto: Todos los corredores avanzan una base automáticamente.
   * Si hay corredor en 3ra, anota carrera.
   * El bateador NO avanza (a menos que sea ball 4).
   * 
   * Registra estadística de balk en el pitcher.
   */
  handleBalk: async () => {
    console.log('⚠️ Balk - Todos los corredores avanzan una base')
    
    const { bases, isTopInning, updateGame } = get()
    const { teams, setTeams } = useTeamsStore.getState()
    
    // Verificar si hay corredores en base
    const hasRunners = bases.some(base => base.isOccupied)
    
    if (!hasRunners) {
      console.log('⚠️ No hay corredores en base - Balk sin efecto')
      return
    }

    const offensiveTeamIndex = isTopInning ? 0 : 1
    const defensiveTeamIndex = isTopInning ? 1 : 0
    const defensiveTeam = teams[defensiveTeamIndex]

    let runsScored = 0
    const newBases: IBase[] = [
      { isOccupied: false, playerId: null },
      { isOccupied: false, playerId: null },
      { isOccupied: false, playerId: null },
    ]

    // Procesar corredores en orden inverso (3ra → 2da → 1ra)
    for (let i = 2; i >= 0; i--) {
      if (bases[i].isOccupied) {
        if (i === 2) {
          // Corredor en 3ra anota
          runsScored++
          console.log(`✅ Corredor de 3ra anota por balk`)
        } else {
          // Corredor avanza una base
          newBases[i + 1] = { isOccupied: true, playerId: bases[i].playerId }
          console.log(`🏃 Corredor de ${i === 0 ? '1ra' : '2da'} avanza a ${i === 0 ? '2da' : '3ra'}`)
        }
      }
    }

    // ── Registrar balk en estadísticas del pitcher ──────────────────────────
    const updatedDefensiveLineup = defensiveTeam.lineup.map((player) => {
      if (player.position === 'P') {
        return {
          ...player,
          balks: (player.balks ?? 0) + 1,
        }
      }
      return player
    })

    // Actualizar bases y carreras
    set({ bases: newBases })
    
    if (runsScored > 0) {
      await useTeamsStore.getState().incrementRuns(offensiveTeamIndex, runsScored, false)
    }

    // Actualizar lineup defensivo con estadística de balk
    setTeams(
      teams.map((team, index) => {
        if (index === defensiveTeamIndex) {
          return { ...team, lineup: updatedDefensiveLineup }
        }
        return team
      })
    )

    // Persistir cambios en el backend
    const gameId = get().id!
    if (gameId) {
      await updatePlayerService(gameId, defensiveTeamIndex, updatedDefensiveLineup)
    }

    await updateGame()
  },

  setInning: (inning) => set({ inning }),
  setIsTopInning: (isTop) => set({ isTopInning: isTop }),
  setBalls: async (balls) => {
    set({ balls })
    if (get().id) {
      await changeBallCount(get().id!, balls)
    }
  },
  setStrikes: async (strikes) => {
    set({ strikes })
    if (get().id) {
      await changeStrikeCount(get().id!, strikes)
    }
  },
  setOuts: async (outs) => {
    set({ outs })
    if (get().id) {
      await changeOutCount(get().id!, outs)
    }
  },
  setBase: async (base, index) => {
    useHistoryStore.getState().handleBasesHistory()
    let bases = [...get().bases]
    bases[index] = base
    set({ bases })
    if (get().id) {
      await changeBaseRunner(get().id!, index, base.isOccupied)
    }
  },
  setBases: async (bases) => {
    set({ bases })
  },
  changeInning: async (increment, isSaved = true) => {
    
    const { inning, isTopInning, id } = get()

    if (isSaved) {
      registerHistory('inning')
    }

    let newInning = inning
    let newIsTopInning = isTopInning
    if (increment) {
      if (!isTopInning) {
        newInning = inning + 1
        newIsTopInning = true
      } else {
        newIsTopInning = false
      }
    } else {
      if (isTopInning) {
        if (inning > 1) {
          newInning = inning - 1
          newIsTopInning = false
        }
      } else {
        newIsTopInning = true
      }
    }
    set({
      inning: newInning,
      isTopInning: newIsTopInning,
      balls: 0,
      strikes: 0,
      outs: 0,
      bases: __initBases__,
    })
    
    if (id && isSaved) {
      await changeInningService(id, newInning, newIsTopInning)
    }
  },
  handleOutsChange: async (newOuts, isSaved = true, isAbvancedbatter = true) => {
    const { changeInning, updateGame, advanceBatter, handleOutPlay, id } = get()

    if (isSaved) registerHistory('out')

    await handleOutPlay(isSaved)
    if (isAbvancedbatter) await advanceBatter(isSaved)

    if (newOuts === 3) {
      set({ outs: 0, balls: 0, strikes: 0 })
      await changeInning(true, false)
      if (isSaved) {
        await updateGame()
      }
    } else {
      set({ outs: newOuts, balls: 0, strikes: 0 })
      if (id && isSaved) {
        await changeOutCount(get().id!, newOuts)
      }
    }
  },
  handleStrikeChange: async (newStrikes, isSaved = true) => {
    const { outs, id, bases, handleOutsChange, updateGame } = get()

    const nextOuts = outs + 1;

    if (isSaved && nextOuts === 3) {
      registerHistory('strike')
    }

    if (isSaved && newStrikes < 3) {
      registerHistory('strike')
    }

    if (newStrikes === 3) {
      // ── Regla 5.05(a)(2): Dropped Third Strike ─────────────────────────
      // Antes de procesar el out, verificar si aplica la condición.
      // El modal siempre aparece para que el operador indique WP o PB,
      // incluso cuando el bateador no puede correr (1ra ocupada <2 outs).
      const firstBaseEmpty = !bases[0].isOccupied
      const twoOuts = outs === 2  // outs actual, el 3er strike aún no suma

      if (firstBaseEmpty || twoOuts) {
        // El bateador PUEDE intentar correr → el operador decide si llegó safe
        set({ pendingDroppedThirdStrike: true })
        // No procesamos el out aquí — el handler handleDroppedThirdStrike
        // lo hará según la respuesta del operador en el modal
        return
      }

      // 1ra ocupada con <2 outs → bateador es out de todas formas,
      // pero igual registramos WP/PB para estadísticas
      // Mostramos el modal solo para WP/PB, sin opción de batterSafe
      set({ pendingDroppedThirdStrike: true })
      return

    } else {
      set({ strikes: newStrikes })
      await changeStrikeCount(id!, newStrikes)
    }
  },
  handleBallChange: async (newBalls, isSaved = true) => {
    const {
      bases,
      isTopInning,
      id,
      updateGame,
      advanceBatter,
      handleBBPlay,
      getCurrentBatter
    } = get()

    useHistoryStore.getState().handleBallFlowHistory()

    if (newBalls === 4) {
      set({ balls: 0, strikes: 0 })
      const player = getCurrentBatter()
      await handleBBPlay()
      await advanceBatter()
      const newBases = [...bases]

      // Avanzar corredores forzados de tercera a primera (en orden inverso)
      for (let i = 2; i >= 0; i--) {
        if (newBases[i].isOccupied) {
          if (i === 2) {
            // Corredor en tercera anota
            await useTeamsStore
              .getState()
              .incrementRuns(isTopInning ? 0 : 1, 1, false);
            newBases[i] = { isOccupied: false, playerId: null }
          } else {
            // Avanzar corredor a la siguiente base
            newBases[i + 1] = { ...newBases[i], playerId: newBases[i].playerId }
            newBases[i] = { isOccupied: false, playerId: null }
          }
        }
      }

      // Colocar al bateador en primera base
      newBases[0] = {
        isOccupied: true,
        playerId: player?._id as string
      }

      set({ bases: newBases })
      if (id) {
        await updateGame()
      }
    } else {
      set({ balls: newBalls })
      await changeBallCount(id!, newBalls)
    }
  },
  changeGameStatus: async (newStatus) => {
    set({ status: newStatus })
    if (get().id) {
      if (newStatus === 'finished') {
        // aqui se deben resetear los overlays
      }

      await changeStatusService(get().id!, newStatus)
    }
  },
  changeIsTopInning: async (isTopInning) => {
    const {  id } = get()
    set({ isTopInning })
    if (get().id) {
      await changeInningService(id!, get().inning, isTopInning)
    }
  },
  changeRunsByInning: async (teamIndex, newRuns, isSaved = true) => {
    const { id, runsByInning, inning, setScoreBoard } = get()

    const inningKey = `${inning}T${teamIndex + 1}` // Ejemplo: "3T1" o "3T2"

    // Actualiza las carreras por inning
    const updatedRunsByInning = {
      ...runsByInning,
      [inningKey]: (runsByInning[inningKey] || 0) + newRuns,
    }
    set({ runsByInning: updatedRunsByInning })

    // setScoreBoard({[inningKey]: (runsByInning[inningKey] || 0) + newRuns})

    if (id && isSaved) {
      await changeRunsByInningService(id, {
        ...runsByInning,
        [inningKey]: (runsByInning[inningKey] || 0) + newRuns,
      })
    }
  },
  loadGame: async (id) => {
    const game = await getGame(id)
    useTeamsStore.getState().setGameId(id)
    useTeamsStore.getState().setTeams(game.teams)
    useHistoryStore.getState().setPast(game.past)
    useHistoryStore.getState().setFuture(game.future)
    useConfigStore.getState().setCurrentConfig(game.configId)
    set({ ...game, id: game._id, scoreboardOverlay: game.scoreboardOverlay })

    return game
  },
  loadGameHistory: async (game) => {
    const { updateGame } = get();
    const { setTeams, teams } = useTeamsStore.getState();
  
    if (game?.teams) {
      let offensiveTeamIndex = game.isTopInning ? 0 : 1;
  
      const updatedTeams = teams.map((team, index) => {
        if (index === offensiveTeamIndex) {

          // Obtener el equipo correspondiente desde game.teams basado en el índice
          const matchingTeam = (game.teams as Team[])[0];
    
          // Solo actualizamos las propiedades del equipo que existen en game.teams
          const updatedTeam = Object.keys(team).reduce((acc, key) => {
            if (key in matchingTeam) {
              if (key !== 'lineup') {
                //@ts-ignore
                acc[key] = matchingTeam[key as keyof typeof matchingTeam];
              }
            } else {
              //@ts-ignore
              acc[key] = team[key];
            }
            return acc;
          }, {} as Team);
    
          // Actualizar la alineación si es el equipo ofensivo

          if (matchingTeam.hasOwnProperty('lineup')) {
            let newLineup = team.lineup.map((player) =>
              player.name === matchingTeam.lineup[0].name
                ? matchingTeam.lineup[0]
                : player
            )
  
            updatedTeam.lineup = newLineup;
          }

          return updatedTeam;
        } else {
          return team;
        }
      });
  
      // Actualizar los equipos en el estado global
      setTeams(updatedTeams);
    }
  
    // Actualizar el estado global con el juego cargado
    set({ ...game });
  
   await updateGame()
  },
  loadOverlay: async (id) => {
    const game = await getOverlay(id)
    useTeamsStore.getState().setGameId(id)
    useTeamsStore.getState().setTeams(game.teams)
    useConfigStore.getState().setCurrentConfig(game.configId)
    set({ ...game, id: game._id, scoreboardOverlay: game.scoreboardOverlay })

    return game
  },
  updateGame: async () => {
    const teamState = useTeamsStore.getState()
    const gameState = get()
    const id = gameState.id

    let game: Partial<Game> = {
      balls: gameState.balls,
      strikes: gameState.strikes,
      outs: gameState.outs,
      inning: gameState.inning,
      isTopInning: gameState.isTopInning,
      teams: teamState.teams,
      status: gameState.status,
      bases: gameState.bases,
      runsByInning: gameState.runsByInning,
      id: gameState.id,
      date: gameState.date as string,
      isDHEnabled: gameState.isDHEnabled,
      scoreboardOverlay: gameState.scoreboardOverlay,
      scorebugOverlay: gameState.scorebugOverlay,
      formationAOverlay: gameState.formationAOverlay,
      formationBOverlay: gameState.formationBOverlay,
      scoreboardMinimalOverlay: gameState.scoreboardMinimalOverlay,
      playerStatsOverlay: gameState.playerStatsOverlay,
    }

    await updateGameService(id!, game)
  },

  setScoreBug: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scorebug
      .overlayId as string
    let contentId = useConfigStore.getState().currentConfig?.scorebug
      .modelId as string
  },
  setScoreBoard: async (content) => {
   

  },
  setScoreBoardMinimal: async (content) => {
    let overlayId = useConfigStore.getState().currentConfig?.scoreboardMinimal
      .overlayId as string
    let contentId = useConfigStore.getState().currentConfig?.scoreboardMinimal
      .modelId as string

  },
  gameOver: async () => {
    const { id } = get()
    if (id) {
    }
  },
  startGame: () => {
    const { changeGameStatus } = get()
    changeGameStatus('in_progress')
  },
  endGame: () => {
    const { changeGameStatus } = get()
    changeGameStatus('finished')
  },
  isDHEnabled: false, //setDHService
  setIsDHEnabled: async (enabled) => {
    set({ isDHEnabled: enabled })
    await setDHService(get().id!)
  },
  getCurrentBatter: () => {
    const { isTopInning, isDHEnabled } = get()
    const teamIndex = isTopInning ? 0 : 1
    const team = useTeamsStore.getState().teams[teamIndex]
    const teams = useTeamsStore.getState().teams

    const isLineupComplete = teams[0].lineupSubmitted && teams[1].lineupSubmitted

    if (!isLineupComplete) return null

    let currentBatterIndex = team.currentBatter
    if (isDHEnabled) {
      // Skip pitcher if DH is enabled
      while (team.lineup[currentBatterIndex].position === 'P') {
        currentBatterIndex = (currentBatterIndex + 1) % team.lineup.length
      }
    }
    const currentBatter = team.lineup[currentBatterIndex]
    return currentBatter ? currentBatter : null
  },
  getCurrentPitcher: () => {
    const { isTopInning } = get()
    const teamIndex = isTopInning ? 1 : 0

    const teams = useTeamsStore.getState().teams

    const isLineupComplete = teams[0].lineupSubmitted && teams[1].lineupSubmitted

    if (!isLineupComplete) return null

    const team = useTeamsStore.getState().teams[teamIndex]
    const pitcher = team.lineup.find((player) => player.position === 'P')
    return pitcher ? { name: pitcher.name, number: pitcher.number } : null
  },
  advanceBatter: async (isSaved) => {
    const { isTopInning } = get()
    const teamIndex = isTopInning ? 0 : 1
    await useTeamsStore.getState().advanceBatter(teamIndex, isSaved)
  },

  handlePositionOverlay: async (
    id: string,
    data: { x: number; y: number },
    isSaved = true
  ) => {
    const {
      formationAOverlay,
      formationBOverlay,
      scoreboardOverlay,
      scoreboardMinimalOverlay,
      scorebugOverlay,
      playerStatsOverlay
    } = get()

    if (id === formationAOverlay.id) {
      set({ formationAOverlay: { ...formationAOverlay, x: data.x, y: data.y } })
    } else if (id === formationBOverlay.id) {
      set({ formationBOverlay: { ...formationBOverlay, x: data.x, y: data.y } })
    } else if (id === scoreboardOverlay.id) {
      set({ scoreboardOverlay: { ...scoreboardOverlay, x: data.x, y: data.y } })
    } else if (id === scoreboardMinimalOverlay.id) {
      set({
        scoreboardMinimalOverlay: {
          ...scoreboardMinimalOverlay,
          x: data.x,
          y: data.y,
        },
      })
    } else if (id === scorebugOverlay.id) {
      set({ scorebugOverlay: { ...scorebugOverlay, x: data.x, y: data.y } })
    } else if (id === playerStatsOverlay.id) {
      set({ playerStatsOverlay: { ...playerStatsOverlay, x: data.x, y: data.y } })
    }

    if (isSaved) {
      await handlePositionOverlayServices(id, data, useGameStore.getState().id!)
    }
  },
  handleScaleOverlay: async (id: string, scale: number, isSaved = true) => {
    const {
      scorebugOverlay,
      scoreboardOverlay,
      scoreboardMinimalOverlay,
      formationAOverlay,
      formationBOverlay,
      playerStatsOverlay
    } = get()

    if (id === scorebugOverlay.id) {
      set({ scorebugOverlay: { ...scorebugOverlay, scale: scale } })
    } else if (id === scoreboardOverlay.id) {
      set({ scoreboardOverlay: { ...scoreboardOverlay, scale: scale } })
    } else if (id === scoreboardMinimalOverlay.id) {
      set({
        scoreboardMinimalOverlay: { ...scoreboardMinimalOverlay, scale: scale },
      })
    } else if (id === formationAOverlay.id) {
      set({ formationAOverlay: { ...formationAOverlay, scale: scale } })
    } else if (id === formationBOverlay.id) {
      set({ formationBOverlay: { ...formationBOverlay, scale: scale } })
    } else if (id === playerStatsOverlay.id) {
      set({ playerStatsOverlay: { ...playerStatsOverlay, scale: scale } })
    }

    if (isSaved) {
      await handleScaleOverlayServices(id, scale, useGameStore.getState().id!)
    }
  },
  handleVisibleOverlay: async (
    id: string,
    visible: boolean,
    isSaved = true
  ) => {
    const {
      scorebugOverlay,
      scoreboardOverlay,
      scoreboardMinimalOverlay,
      formationAOverlay,
      formationBOverlay,
      playerStatsOverlay
    } = get()

    if (id === scorebugOverlay.id) {
      set({ scorebugOverlay: { ...scorebugOverlay, visible: visible } })
    } else if (id === scoreboardOverlay.id) {
      set({ scoreboardOverlay: { ...scoreboardOverlay, visible: visible } })
    } else if (id === scoreboardMinimalOverlay.id) {
      set({
        scoreboardMinimalOverlay: {
          ...scoreboardMinimalOverlay,
          visible: visible,
        },
      })
    } else if (id === formationAOverlay.id) {
      set({ formationAOverlay: { ...formationAOverlay, visible: visible } })
    } else if (id === formationBOverlay.id) {
      set({ formationBOverlay: { ...formationBOverlay, visible: visible } })
    } else if (id === playerStatsOverlay.id) {
      set({ playerStatsOverlay: { ...playerStatsOverlay, visible: visible } })
    }

    if (isSaved) {
      await handleVisibleOverlayServices(
        id,
        visible,
        useGameStore.getState().id!
      )
    }
  },

  // Acción para manejar un sencillo (Single)
  handleSingle: async (runsScored, isStay) => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')


    const segunda = isStay ? bases[1].isOccupied ? bases[1] : bases[0] : bases[0]
    
    const newBases: IBase[] = isStay
      ? [{ isOccupied: true, playerId: currentBatter._id as string }, segunda, bases[2]] 
      : [{ isOccupied: true, playerId: currentBatter._id as string }, bases[0], bases[1]]

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Single,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Single,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    // ✅ Regla 9.05(a): Hit legítimo incrementa contador de hits
    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              lineup: newLineup,
            }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )
    advanceBatter(teamIndex)
  },

  // Acción para manejar un doble (Double)
  handleDouble: async (runsScored:number, isStay:boolean) => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const tercera = isStay ? bases[1] : bases[0]

    const newBases = [__initBase__ , { isOccupied:true, playerId: currentBatter._id as string }, tercera]

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Double,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Double,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    // ✅ Regla 9.05(a): Hit legítimo incrementa contador de hits
    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              lineup: newLineup,
            }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )

    advanceBatter(teamIndex)
  },

  // Acción para manejar un triple (Triple)
  handleTriple: async (runsScored) => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const newBases = [__initBase__, __initBase__, { isOccupied:true, playerId: currentBatter._id as string }]

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Triple,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Triple,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    // ✅ Regla 9.05(a): Hit legítimo incrementa contador de hits
    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              lineup: newLineup,
            }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )

    advanceBatter(teamIndex)
  },

  // Acción para manejar un cuadrangular (HomeRun)
  handleHomeRun: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const runsScored =
      1 + (bases[2].isOccupied ? 1 : 0) + (bases[1].isOccupied ? 1 : 0) + (bases[0].isOccupied ? 1 : 0)

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.HomeRun,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.HomeRun,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    // ✅ Regla 9.05(a): Hit legítimo incrementa contador de hits
    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? {
              ...team,
              runs: team.runs + runsScored,
              hits: team.hits + 1,
              lineup: newLineup,
            }
          : team
      )
    )

    set({ bases: __initBases__, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      hits: teams[teamIndex].hits + 1,
      lineup: newLineup,
    }
    await handlePlayServices(useGameStore.getState().id!, teamIndex, newTeam, __initBases__)

    advanceBatter(teamIndex)
  },

  // Acción para manejar un golpe por lanzamiento (HitByPitch)
  handleHitByPitch: async () => {
    const { bases, isTopInning, getCurrentBatter } = get()
    const { teams, setTeams, advanceBatter } = useTeamsStore.getState()
    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    useHistoryStore.getState().handleStrikeFlowHistory('hit')

    const newBases:IBase[] = [{ isOccupied:true, playerId: currentBatter._id as string }, bases[0], bases[1]]
    const runsScored = bases[2].isOccupied ? 1 : 0

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.HitByPitch,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.HitByPitch,
      errorPlay: '',
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, runs: team.runs + runsScored, lineup: newLineup }
          : team
      )
    )

    set({ bases: newBases, strikes: 0, balls: 0 })

    let newTeam = {
      ...teams[teamIndex],
      runs: teams[teamIndex].runs + runsScored,
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      newBases
    )

    advanceBatter(teamIndex)
  },
  handleErrorPlay: async (defensiveOrder: number) => {
  const { isTopInning, getCurrentBatter, bases } = get()
  const { teams, advanceBatter, setTeams } = useTeamsStore.getState()

  const currentBatter = getCurrentBatter()

  if (!currentBatter) {
    toast.error("El lineup no tiene jugador actualmente")
    return
  }

  useHistoryStore.getState().handleStrikeFlowHistory('error')

  const teamIndex = isTopInning ? 0 : 1
  const defensiveTeamIndex = isTopInning ? 1 : 0
  const currentTeam = teams[teamIndex]

  let turnsAtBat: ITurnAtBat = {
    inning: useGameStore.getState().inning,
    typeHitting: TypeHitting.ErrorPlay,
    typeAbbreviatedBatting: TypeAbbreviatedBatting.ErrorPlay,
    errorPlay: `E${defensiveOrder}`,
  }

  let newCurrentBatter = {
    ...currentBatter,
    turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
  }

  let newLineup = currentTeam.lineup.map((player) =>
    player.name === currentBatter?.name ? newCurrentBatter : player
  )

  // ⚠️ Regla 9.05(a): Error NO incrementa hits del equipo ofensivo
  // ✅ Regla 9.12(a): Error incrementa contador del equipo DEFENSIVO
  setTeams(
    teams.map((team, index) =>
      index === teamIndex
        ? { ...team, lineup: newLineup }
        : index === defensiveTeamIndex
        ? { ...team, errorsGame: team.errorsGame + 1 }
        : team
    )
  )

  // ✅ CORRECCIÓN: Regla 5.06(b)(3) — Avance forzado en cascada
  //
  // Un error NO es un force play automático. El bateador llega a 1ra,
  // y los corredores SOLO avanzan forzados si la secuencia de bases lo exige.
  //
  // Escenarios:
  //   - Solo 2da ocupada:         bateador a 1ra, corredor en 2da QUEDA EN 2DA (no forzado)
  //   - Solo 1ra ocupada:         bateador a 1ra, corredor de 1ra FORZADO a 2da
  //   - 1ra y 2da ocupadas:       cascada: bateador→1ra, 1ra→2da, 2da→3ra
  //   - Bases llenas:             cascada completa + corredor de 3ra ANOTA
  //
  // Los corredores NO forzados pueden avanzar bajo su propio riesgo
  // usando el botón "Avanzar Corredores" después de esta jugada.

  let newBases: IBase[] = [...bases] // Copiar bases actuales (runners no forzados quedan donde están)
  let runsScored = 0

  const first = bases[0]   // 1ra base
  const second = bases[1]  // 2da base
  const third = bases[2]   // 3ra base

  if (!first.isOccupied) {
    // 1ra vacía → el bateador simplemente ocupa 1ra. Nadie más es forzado.
    newBases[0] = { isOccupied: true, playerId: currentBatter._id as string }
    // newBases[1] y newBases[2] no cambian (quedan como estaban)
    console.log('⚙️ Error: 1ra vacía. Bateador a 1ra. Corredores en 2da/3ra quedan en su lugar.')

  } else if (!second.isOccupied) {
    // 1ra ocupada, 2da vacía → forzado: bateador a 1ra, corredor de 1ra a 2da.
    // El corredor en 3ra (si existe) NO es forzado.
    newBases[0] = { isOccupied: true, playerId: currentBatter._id as string }
    newBases[1] = first  // Corredor de 1ra forzado a 2da
    // newBases[2] no cambia
    console.log('⚙️ Error: 1ra ocupada, 2da vacía. Forzado: bateador→1ra, 1ra→2da.')

  } else if (!third.isOccupied) {
    // 1ra y 2da ocupadas, 3ra vacía → cascada: bateador→1ra, 1ra→2da, 2da→3ra
    newBases[0] = { isOccupied: true, playerId: currentBatter._id as string }
    newBases[1] = first   // 1ra forzado a 2da
    newBases[2] = second  // 2da forzado a 3ra
    console.log('⚙️ Error: 1ra y 2da ocupadas. Cascada: bateador→1ra, 1ra→2da, 2da→3ra.')

  } else {
    // Bases llenas → todos forzados, corredor de 3ra anota
    runsScored = 1
    newBases[0] = { isOccupied: true, playerId: currentBatter._id as string }
    newBases[1] = first   // 1ra forzado a 2da
    newBases[2] = second  // 2da forzado a 3ra
    // El corredor de 3ra (third) anota — se elimina de las bases
    console.log('⚙️ Error: Bases llenas. Cascada completa + 1 carrera anotada.')
  }

  set({ bases: newBases, strikes: 0, balls: 0 })

  let newTeam = {
    ...teams[teamIndex],
    runs: teams[teamIndex].runs + runsScored,
    lineup: newLineup,
  }

  // Actualizar carreras si aplica (bases llenas)
  if (runsScored > 0) {
    setTeams(
      teams.map((team, index) =>
        index === teamIndex
          ? { ...team, runs: team.runs + runsScored }
          : team
      )
    )
  }

  await handlePlayServices(
    useGameStore.getState().id!,
    teamIndex,
    newTeam,
    newBases
  )

  advanceBatter(teamIndex)
},
  handleOutPlay: async (isSaved = true) => {
    const { isTopInning, getCurrentBatter, bases } = get()
    const { teams, setTeams } = useTeamsStore.getState()

    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if(!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.Out,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.Out,
      errorPlay: "",
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, lineup: newLineup }
          : team
      )
    )

    let newTeam = {
      ...teams[teamIndex],
      lineup: newLineup,
    }



    if (isSaved) {
      await handlePlayServices(
        useGameStore.getState().id!,
        teamIndex,
        newTeam,
        bases
      )
    }
  },
  handleBBPlay: async () => {
    const { isTopInning, getCurrentBatter, bases } = get()
    const { teams, setTeams } = useTeamsStore.getState()

    const teamIndex = isTopInning ? 0 : 1
    const currentTeam = teams[teamIndex]

    const currentBatter = getCurrentBatter()

    if (!currentBatter) {
      toast.error("El lineup no tiene jugador actualmente")
      return
    }

    let turnsAtBat: ITurnAtBat = {
      inning: useGameStore.getState().inning,
      typeHitting: TypeHitting.BaseByBall,
      typeAbbreviatedBatting: TypeAbbreviatedBatting.BaseBayBall,
      errorPlay: "",
    }

    let newCurrentBatter = {
      ...currentBatter,
      turnsAtBat: [...currentBatter.turnsAtBat, turnsAtBat],
    }

    let newLineup = currentTeam.lineup.map((player) =>
      player.name === currentBatter?.name ? newCurrentBatter : player
    )

    setTeams(
      teams.map((team) =>
        team === currentTeam
          ? { ...team, lineup: newLineup }
          : team
      )
    )

    let newTeam = {
      ...teams[teamIndex],
      lineup: newLineup,
    }
    await handlePlayServices(
      useGameStore.getState().id!,
      teamIndex,
      newTeam,
      bases
    )
  },

   /**
   * Resuelve un Dropped Third Strike completo (Fase 3 — estadísticas por jugador).
   *
   * Responsabilidades:
   * 1. Registra WP en pitcher O PB en catcher (vía teamsStore)
   * 2. Siempre registra K en strikeoutsThrown del pitcher
   * 3. Registra el turno al bat del bateador con tipo K-WP / K-PB
   * 4. Si batterSafe Y la condición aplica (1ra vacía o 2 outs):
   *    → bateador a 1ra, corredores forzados avanzan (igual que BB)
   * 5. Si !batterSafe O condición no aplica:
   *    → out normal
   * 6. Cierra el modal limpiando el flag
   */
  handleDroppedThirdStrike: async (type, batterSafe) => {
    const { outs, bases, isTopInning, handleOutsChange, updateGame } = get()

    const firstBaseEmpty = !bases[0].isOccupied
    const twoOuts = outs === 2
    const batterCanRun = firstBaseEmpty || twoOuts

    // 1. Estadísticas por jugador (bateador + pitcher o catcher)
    await useTeamsStore
      .getState()
      .recordDroppedThirdStrikeStats(type, batterSafe && batterCanRun)

    const nextOuts = outs + 1

    if (batterSafe && batterCanRun) {
      // ── Bateador llega safe a 1ra ──────────────────────────────────────
      registerHistory('strike')

      const { teams, advanceBatter } = useTeamsStore.getState()
      const teamIndex = isTopInning ? 0 : 1
      const currentBatter = get().getCurrentBatter()
      const newBases = [...bases]

      // Avanzar solo corredores forzados (cadena continua desde 1ra)
      for (let i = 2; i >= 0; i--) {
        if (newBases[i].isOccupied) {
          let forced = true
          for (let b = 0; b < i; b++) {
            if (!newBases[b].isOccupied) { forced = false; break }
          }
          if (forced) {
            if (i === 2) {
              await useTeamsStore.getState().incrementRuns(teamIndex, 1, false)
              newBases[i] = { isOccupied: false, playerId: null }
            } else {
              newBases[i + 1] = { ...newBases[i] }
              newBases[i] = { isOccupied: false, playerId: null }
            }
          }
        }
      }

      newBases[0] = { isOccupied: true, playerId: currentBatter?._id as string }

      set({ bases: newBases, balls: 0, strikes: 0, pendingDroppedThirdStrike: false })
      await advanceBatter(teamIndex)
      await updateGame()

    } else {
      // ── Out normal ─────────────────────────────────────────────────────
      set({ pendingDroppedThirdStrike: false })
      if (nextOuts === 3) {
        await handleOutsChange(nextOuts, false)
        await updateGame()
      } else {
        await handleOutsChange(nextOuts, true)
      }
    }
  },
}))