'use client';

import { useSocketEvents } from './useSocketEventFactory';
import { useGameStore } from '../store/gameStore';
import { useTeamsStore } from '../store/teamsStore';
import { useBaseballSocketEvents } from './useSocketEventFactory';
import { toast } from 'sonner';

/**
 * Hook unificado para manejar todos los eventos de socket del juego
 * Reemplaza a useSocketOverlayGame con una implementación más limpia y tipada
 */
export const useGameSocket = (gameId: string) => {
  // Configuración de todos los eventos de socket
  const socketEvents = [
    // ── Eventos del estado del juego ──────────────────────────────────────
    {
      eventName: 'ballCount' as const,
      handler: (data: { balls: number }) => {
        useGameStore.getState().setBalls(data.balls, true);
      }
    },
    {
      eventName: 'strikeCount' as const,
      handler: (data: { strikes: number }) => {
        useGameStore.getState().setStrikes(data.strikes, true);
      }
    },
    {
      eventName: 'outCount' as const,
      handler: (data: { outs: number; strikes: number; balls: number }) => {
        const gameStore = useGameStore.getState();
        gameStore.handleSocketInning({
          inning: gameStore.inning,
          isTopInning: gameStore.isTopInning,
          balls: data.balls,
          strikes: data.strikes,
          outs: data.outs,
          bases: gameStore.bases
        });
      }
    },
    {
      eventName: 'inning' as const,
      handler: (data: any) => {
        useGameStore.getState().handleSocketInning(data);
      }
    },
    {
      eventName: 'baseRunner' as const,
      handler: (data: { baseIndex: number; isOccupied: boolean }) => {
        useGameStore.getState().handleSocketBases(data.baseIndex, data.isOccupied);
      }
    },

    // ── Eventos de jugadores y equipos ────────────────────────────────────
    {
      eventName: 'updatePlayer' as const,
      handler: (data: { teamIndex: number; lineup: any[]; lineupSubmitted: boolean }) => {
        useTeamsStore.getState().handleSocketLineup(data.teamIndex, data.lineup, data.lineupSubmitted);
      }
    },
    {
      eventName: 'handlePlay' as const,
      handler: (data: { teamIndex: number; team: any; bases: any[] }) => {
        const teamsStore = useTeamsStore.getState();
        const gameStore = useGameStore.getState();
        
        teamsStore.handleSocketPlayer(data.teamIndex, data.team);
        gameStore.handleSocketInning({
          inning: gameStore.inning,
          isTopInning: gameStore.isTopInning,
          balls: gameStore.balls,
          strikes: gameStore.strikes,
          outs: gameStore.outs,
          bases: data.bases
        });
      }
    },
    {
      eventName: 'changeCurrentBatter' as const,
      handler: (data: { currentBatter: number }) => {
        useGameStore.getState().handleSocketCurrentBatter(data.currentBatter);
      }
    },
    {
      eventName: 'DHEnable' as const,
      handler: (data: { isDHEnabled: boolean }) => {
        useGameStore.getState().handleSocketDHEnabled(data.isDHEnabled);
      }
    },

    // ── Eventos de estadísticas ───────────────────────────────────────────
    {
      eventName: 'hitsCount' as const,
      handler: (data: { hits: number; teamIndex: number }) => {
        useTeamsStore.getState().handleSocketHits(data.teamIndex, data.hits);
      }
    },
    {
      eventName: 'errorsCount' as const,
      handler: (data: { errors: number; teamIndex: number }) => {
        useTeamsStore.getState().handleSocketErrors(data.teamIndex, data.errors);
      }
    },
    {
      eventName: 'scoreRun' as const,
      handler: (data: { teamIndex: number; runs: number; runsInning: number }) => {
        useTeamsStore.getState().handleSocketRuns(data.teamIndex, data.runs, data.runsInning);
      }
    },

    // ── Eventos de equipos ─────────────────────────────────────────────────
    {
      eventName: 'teamColor' as const,
      handler: (data: { teamIndex: number; color: string }) => {
        useTeamsStore.getState().handleSocketTeamColor(data.teamIndex, data.color);
      }
    },
    {
      eventName: 'teamTextColor' as const,
      handler: (data: { teamIndex: number; textColor: string }) => {
        useTeamsStore.getState().handleSocketTeamTextColor(data.teamIndex, data.textColor);
      }
    },
    {
      eventName: 'teamName' as const,
      handler: (data: { teamIndex: number; name: string }) => {
        useTeamsStore.getState().handleSocketTeamName(data.teamIndex, data.name);
      }
    },
    {
      eventName: 'teamShortName' as const,
      handler: (data: { teamIndex: number; shortName: string }) => {
        useTeamsStore.getState().handleSocketShortName(data.teamIndex, data.shortName);
      }
    },

    // ── Eventos del juego completo ────────────────────────────────────────
    {
      eventName: 'updateGame' as const,
      handler: (data: { game: any }) => {
        useGameStore.getState().handleSocketGameUpdate(data.game);
      }
    },
    {
      eventName: 'changePastAndFutureGame' as const,
      handler: (data: { past: any[]; future: any[] }) => {
        useGameStore.getState().handleSocketPastAndFutureGame(data.past, data.future);
      }
    }
  ];

  // Usar el hook de eventos múltiples
  useSocketEvents(gameId, socketEvents);
};

/**
 * Hook específico para eventos de avance de bateador
 * Se mantiene separado porque usa un sufijo dinámico basado en el teamIndex
 */
export const useAdvanceBatterSocket = (gameId: string) => {
  const { isTopInning } = useGameStore();
  const { advanceBatter } = useTeamsStore();
  
  const teamIndex = isTopInning ? 0 : 1;

  useSocketEvents(gameId, [
    {
      eventName: 'AdvanceBatter' as const,
      handler: (data: { teamIndex: number; currentBatter: number }) => {
        advanceBatter(data.teamIndex, false);
      },
      suffix: teamIndex.toString()
    }
  ]);
};


export const useBaseballGameSocket = (gameId: string) => {
  const baseballEvents = [
    {
      eventName: 'baseballGameStateUpdate',
      handler: (data: { gameId: string; game: any; timestamp: string }) => {
        useGameStore.getState().handleSocketGameUpdate(data.game);
      }
    },
    {
      eventName: 'teamLineupUpdate',
      handler: (data: {
        gameId: string;
        teamIndex: number;
        lineup: any[];
        bench: any[];
        currentBatter: number;
        lineupSubmitted: boolean;
        timestamp: string;
      }) => {
        useTeamsStore.getState().handleSocketLineup(
          data.teamIndex,
          data.lineup,
          data.lineupSubmitted
        );
      }
    },
    {
      eventName: 'playerStatsUpdate',
      handler: (data: {
        gameId: string;
        teamIndex: number;
        playerId: string;
        player: any;
        timestamp: string;
      }) => {
        const { teams, setTeams } = useTeamsStore.getState();
        const team = teams[data.teamIndex];
        
        // Actualizar el jugador en el lineup
        const updatedLineup = team.lineup.map((p) => 
          p._id === data.playerId ? { ...p, ...data.player } : p
        );
        
        setTeams(
          teams.map((t, index) => 
            index === data.teamIndex ? { ...t, lineup: updatedLineup } : t
          )
        );
      }
    },
    {
      eventName: 'playerSubstitution',
      handler: async (data: {
        gameId: string;
        teamIndex: number;
        originalPlayer: any;
        substitutePlayer: any;
        timestamp: string;
      }) => {
        // Usar el método substitutePlayer del store pero sin persistir al backend
        // ya que este evento viene del socket (actualización local para overlays)
        const { teams, setTeams } = useTeamsStore.getState();
        const team = teams[data.teamIndex];
        
        const playerToRemoveIndex = team.lineup.findIndex((p) => p._id === data.originalPlayer._id);
        
        if (playerToRemoveIndex === -1) {
          console.warn('Jugador a sustituir no encontrado en el lineup');
          return;
        }
        
        const playerToRemove = team.lineup[playerToRemoveIndex];
        
        // Marcar jugador original como sustituido
        const updatedPlayerToRemove = {
          ...playerToRemove,
          isSubstituted: true,
          substitutedBy: data.substitutePlayer._id,
          canReturnAsFielder: playerToRemove.position === 'P',
        };
        
        // Configurar nuevo jugador heredando posición en el batting order
        const configuredNewPlayer = {
          ...data.substitutePlayer,
          battingOrder: playerToRemove.battingOrder,
          defensiveOrder: playerToRemove.defensiveOrder,
          substituteFor: data.originalPlayer._id,
        };
        
        // Actualizar lineup
        const updatedLineup = team.lineup.map((p, index) =>
          index === playerToRemoveIndex ? configuredNewPlayer : p
        );
        
        // Actualizar banca (agregar jugador sustituido si no está)
        const updatedBench = team.bench.some((p) => p._id === data.originalPlayer._id)
          ? team.bench
          : [...team.bench, updatedPlayerToRemove];
        
        // Actualizar currentBatter si es necesario
        let updatedCurrentBatter = team.currentBatter;
        if (team.currentBatter === playerToRemoveIndex) {
          updatedCurrentBatter = playerToRemoveIndex;
        }
        
        setTeams(
          teams.map((t, index) =>
            index === data.teamIndex
              ? { ...t, lineup: updatedLineup, bench: updatedBench, currentBatter: updatedCurrentBatter }
              : t
          )
        );
        
        console.log(`🔄 Sustitución (overlay): ${data.originalPlayer.name} → ${data.substitutePlayer.name}`);
      }
    },
    {
      eventName: 'benchUpdate',
      handler: (data: {
        gameId: string;
        teamIndex: number;
        bench: any[];
        action: 'added' | 'removed';
        playerId: string;
        timestamp: string;
      }) => {
        const { teams, setTeams } = useTeamsStore.getState();
        
        setTeams(
          teams.map((team, index) => 
            index === data.teamIndex ? { ...team, bench: data.bench } : team
          )
        );
        
        const player = data.bench.find((p) => p._id === data.playerId);
        const playerName = player?.name || 'Jugador';
        
        if (data.action === 'added') {
          console.log(`➕ ${playerName} agregado a la banca`);
        } else {
          console.log(`➖ ${playerName} removido de la banca`);
        }
      }
    },
    {
      eventName: 'notification',
      handler: (data: {
        message: string;
        type: 'info' | 'warning' | 'error' | 'success';
        timestamp: string;
      }) => {
        console.log(`📢 [${data.type}] ${data.message}`);
        
        // Mostrar notificación usando sonner
        switch (data.type) {
          case 'success':
            toast.success(data.message);
            break;
          case 'error':
            toast.error(data.message);
            break;
          case 'warning':
            toast.warning(data.message);
            break;
          case 'info':
          default:
            toast.info(data.message);
            break;
        }
      }
    },
    {
      eventName: 'error',
      handler: (data: { message: string; details?: any; timestamp: string }) => {
        console.error(`❌ Socket error: ${data.message}`, data.details);
      }
    }
  ];

  useBaseballSocketEvents(gameId, baseballEvents);
};