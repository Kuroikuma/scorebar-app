'use client';

import { useGameSocket, useAdvanceBatterSocket } from './useGameSocket';

/**
 * Hook refactorizado que usa la nueva implementación unificada
 * Mantiene la misma interfaz para compatibilidad con código existente
 * 
 * @deprecated Usar useGameSocket directamente en nuevos componentes
 */
export const useSocketOverlayGame = (id: string) => {
  // Usar los nuevos hooks unificados
  useGameSocket(id);
  useAdvanceBatterSocket(id);
};

// Re-exportar tipos para compatibilidad
export type {
  ISocketDataPlayer,
  ISocketDataInning,
  ISocketDataAdvanceBatter,
  ISocketUpdatePlayer,
  ISocketBalls,
  ISocketBase,
  ISocketChangeCurrentBatter,
  ISocketChangeIsDHEnabled,
  ISocketErrorsGame,
  ISocketHits,
  ISocketOut,
  ISocketDataUpdateGame,
  ISocketDataPastAndFutureGame,
  ISocketStrikes,
  ISocketTeamColor,
  ISocketTeamTextColor,
  ISocketTeamName,
  ISocketShortName,
  ISocketRuns
} from '../types/SocketEvents';
