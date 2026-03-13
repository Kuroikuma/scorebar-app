import socket from './socket';
import { SocketEventName, SocketEventMap, BaseSocketEvent } from '../types/SocketEvents';

export interface SocketMiddlewareOptions {
  enableLogging?: boolean;
  validateSocketId?: boolean;
}

/**
 * Middleware para eventos de socket que proporciona:
 * - Logging centralizado
 * - Validación de socketId para evitar loops
 * - Manejo de errores
 */
export const createSocketMiddleware = (
  gameId: string, 
  options: SocketMiddlewareOptions = {}
) => {
  const { enableLogging = true, validateSocketId = true } = options;

  return <T extends SocketEventName>(
    eventName: T, 
    data: SocketEventMap[T]
  ): boolean => {
    // Logging centralizado
    if (enableLogging) {
      console.log(`🔄 Socket Event [${gameId}]: ${eventName}`, {
        ...data,
        socketId: (data as BaseSocketEvent).socketId ? `${(data as BaseSocketEvent).socketId.slice(0, 8)}...` : 'none'
      });
    }

    // Validación de socketId para evitar loops
    if (validateSocketId && (data as BaseSocketEvent).socketId === socket.id) {
      if (enableLogging) {
        console.log(`⏭️ Skipping own event [${gameId}]: ${eventName}`);
      }
      return false;
    }

    // Validación básica de datos
    if (!data) {
      console.warn(`⚠️ Empty data for event [${gameId}]: ${eventName}`);
      return false;
    }

    return true;
  };
};

/**
 * Utilidad para crear nombres de eventos consistentes
 */
export const createEventName = (eventName: SocketEventName, gameId: string, suffix?: string): string => {
  const base = `server:${eventName}/${gameId}`;
  return suffix ? `${base}/${suffix}` : base;
};

/**
 * Utilidad para manejar errores de socket de forma consistente
 */
export const handleSocketError = (eventName: string, error: any) => {
  console.error(`❌ Socket Error [${eventName}]:`, error);
  // Aquí podrías agregar reporting de errores, toast notifications, etc.
};