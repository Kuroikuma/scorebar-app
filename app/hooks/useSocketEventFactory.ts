import { useEffect } from 'react';
import socket from '../service/socket';
import { createSocketMiddleware, createEventName, handleSocketError } from '../service/socketMiddleware';
import { SocketEventName, SocketEventMap } from '../types/SocketEvents';

export interface SocketEventConfig<T extends SocketEventName> {
  eventName: T;
  gameId: string;
  handler: (data: SocketEventMap[T]) => void;
  suffix?: string;
  validateSocketId?: boolean;
  enableLogging?: boolean;
}

/**
 * Factory para crear handlers de eventos de socket de forma consistente
 */
export const useSocketEvent = <T extends SocketEventName>(
  config: SocketEventConfig<T>
) => {
  const { eventName, gameId, handler, suffix, validateSocketId = true, enableLogging = true } = config;

  useEffect(() => {
    if (!gameId) return;

    const middleware = createSocketMiddleware(gameId, { enableLogging, validateSocketId });
    const fullEventName = createEventName(eventName, gameId, suffix);

    const wrappedHandler = (data: SocketEventMap[T]) => {
      try {
        if (middleware(eventName, data)) {
          handler(data);
        }
      } catch (error) {
        handleSocketError(fullEventName, error);
      }
    };

    socket.on(fullEventName, wrappedHandler);

    return () => {
      socket.off(fullEventName, wrappedHandler);
    };
  }, [eventName, gameId, suffix, validateSocketId, enableLogging]);
};

/**
 * Hook para manejar múltiples eventos de socket
 */
export const useSocketEvents = (gameId: string, events: Array<{
  eventName: SocketEventName;
  handler: (data: any) => void;
  suffix?: string;
}>) => {
  useEffect(() => {
    if (!gameId || !events.length) return;

    const middleware = createSocketMiddleware(gameId);
    const cleanupFunctions: Array<() => void> = [];

    events.forEach(({ eventName, handler, suffix }) => {
      const fullEventName = createEventName(eventName, gameId, suffix);

      const wrappedHandler = (data: any) => {
        try {
          if (middleware(eventName, data)) {
            handler(data);
          }
        } catch (error) {
          handleSocketError(fullEventName, error);
        }
      };

      socket.on(fullEventName, wrappedHandler);
      cleanupFunctions.push(() => socket.off(fullEventName, wrappedHandler));
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [gameId, events]);
};