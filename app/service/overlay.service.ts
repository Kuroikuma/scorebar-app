import axios from 'axios';
import { IOverlay, IOverlayUpdate, SportCategory } from '../types/overlay';
import socket from './socket';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers.Authorization = `Bearer ${token}`;

    if (!config.data) {
      config.data = {};
    }

    config.data.socketId = socket.id || "";
  }
  return config;
});

const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error(defaultMessage);
};

export const overlayService = {
  // Obtener overlays de un juego (con información de tipo)
  getGameOverlays: async (gameId: string): Promise<IOverlay[]> => {
    try {
      const response = await api.get(`/games/${gameId}/overlays`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error loading game overlays');
    }
  },

  // Inicializar overlays para un juego (manual)
  initializeGameOverlays: async (gameId: string, sport: SportCategory): Promise<IOverlay[]> => {
    try {
      const response = await api.post(`/overlay/game/${gameId}/initialize`, { sport });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error initializing game overlays');
    }
  },

  // Crear overlay individual
  createOverlay: async (overlayData: Partial<IOverlay>): Promise<IOverlay> => {
    try {
      const response = await api.post('/overlay', overlayData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error creating overlay');
    }
  },

  // Obtener overlay por ID
  getOverlayById: async (overlayId: string): Promise<IOverlay> => {
    try {
      const response = await api.get(`/overlay/${overlayId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error loading overlay');
    }
  },

  // Actualizar overlay completo
  updateOverlay: async (overlayId: string, updates: IOverlayUpdate): Promise<IOverlay> => {
    try {
      const response = await api.patch(`/overlay/${overlayId}`, updates);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating overlay');
    }
  },

  // Actualizar diseño
  updateDesign: async (overlayId: string, design: string, customConfig?: Record<string, any>): Promise<IOverlay> => {
    try {
      const response = await api.patch(`/overlay/${overlayId}/design`, { design, customConfig });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating design');
    }
  },

  // Actualizar posición
  updatePosition: async (overlayId: string, x: number, y: number): Promise<IOverlay> => {
    try {
      const response = await api.patch(`/overlay/${overlayId}/position`, { x, y });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating position');
    }
  },

  // Actualizar escala
  updateScale: async (overlayId: string, scale: number): Promise<IOverlay> => {
    try {
      const response = await api.patch(`/overlay/${overlayId}/scale`, { scale });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating scale');
    }
  },

  // Actualizar visibilidad
  updateVisibility: async (overlayId: string, visible: boolean): Promise<IOverlay> => {
    try {
      const response = await api.patch(`/overlay/${overlayId}/visibility`, { visible });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating visibility');
    }
  },

  // Eliminar overlay
  deleteOverlay: async (overlayId: string): Promise<boolean> => {
    try {
      await api.delete(`/overlay/${overlayId}`);
      return true;
    } catch (error) {
      return handleApiError(error, 'Error deleting overlay');
    }
  },

  // Actualizar múltiples overlays
  updateMultipleOverlays: async (updates: Array<{ overlayId: string; updates: IOverlayUpdate }>): Promise<IOverlay[]> => {
    try {
      const response = await api.patch('/overlay/bulk', { updates });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating multiple overlays');
    }
  },
};