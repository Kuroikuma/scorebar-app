import axios from 'axios';
import { IOverlayType, SportCategory } from '../types/overlay';
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

export const overlayTypeService = {
  // Obtener tipos por deporte
  getTypesBySport: async (sport: SportCategory, onlyActive = true): Promise<IOverlayType[]> => {
    try {
      const response = await api.get(`/overlay/types/sport/${sport}?onlyActive=${onlyActive}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error loading overlay types');
    }
  },

  // Crear nuevo tipo
  createType: async (typeData: Partial<IOverlayType>): Promise<IOverlayType> => {
    try {
      const response = await api.post('/overlay/types', typeData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error creating overlay type');
    }
  },

  // Obtener todos los tipos
  getAllTypes: async (): Promise<IOverlayType[]> => {
    try {
      const response = await api.get(`/overlay/types/sport/${SportCategory.Baseball}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error loading all overlay types');
    }
  },

  // Obtener tipo por ID
  getTypeById: async (typeId: string): Promise<IOverlayType> => {
    try {
      const response = await api.get(`/overlay/types/${typeId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error loading overlay type');
    }
  },

  // Actualizar tipo
  updateType: async (typeId: string, updates: Partial<IOverlayType>): Promise<IOverlayType> => {
    try {
      const response = await api.patch(`/overlay/types/${typeId}`, updates);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating overlay type');
    }
  },

  // Eliminar tipo
  deleteType: async (typeId: string): Promise<boolean> => {
    try {
      await api.delete(`/overlay/types/${typeId}`);
      return true;
    } catch (error) {
      return handleApiError(error, 'Error deleting overlay type');
    }
  },

  // Obtener diseños disponibles
  getAvailableDesigns: async (overlayTypeId: string): Promise<string[]> => {
    try {
      const response = await api.get(`/overlay/types/${overlayTypeId}/designs`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error loading available designs');
    }
  },

  // Agregar diseño a tipo
  addDesign: async (overlayTypeId: string, design: string): Promise<IOverlayType> => {
    try {
      const response = await api.post(`/overlay/types/${overlayTypeId}/designs`, { design });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error adding design');
    }
  },

  // Eliminar diseño
  removeDesign: async (overlayTypeId: string, design: string): Promise<IOverlayType> => {
    try {
      const response = await api.delete(`/overlay/types/${overlayTypeId}/designs/${design}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error removing design');
    }
  },
};