'use client';

import { useSocketEvents } from './useSocketEventFactory';
import { useGameStore } from '../store/gameStore';
import { useTeamsStore } from '../store/teamsStore';
import { useBaseballSocketEvents } from './useSocketEventFactory';

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
        // Mapear a tu store según corresponda
      }
    },
    {
      eventName: 'playerSubstitution',
      handler: (data: {
        gameId: string;
        teamIndex: number;
        originalPlayer: any;
        substitutePlayer: any;
        timestamp: string;
      }) => {
        // Mapear a tu store
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
        // Mapear a tu store
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
        // Conectar a tu sistema de toasts/notificaciones
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