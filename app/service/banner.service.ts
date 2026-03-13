import axios, { AxiosError } from 'axios';
import socket from './socket';
import { IBannerSettings } from '../types/Banner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

// Helper para manejar errores de forma consistente
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message || axiosError.message || defaultMessage;
    console.error('API Error:', message, axiosError.response?.status);
    throw new Error(message);
  }
  console.error('Unexpected error:', error);
  throw new Error(defaultMessage);
};

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

export const createBanner = async (bannerData: Partial<IBannerSettings>) => {
  try {
    const response = await api.post('/banners', bannerData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al crear el banner');
  }
};

export const update = async (bannerId: string, bannerData: Partial<IBannerSettings>) => {
  try {
    const response = await api.put(`/banners/${bannerId}`, bannerData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al actualizar el banner');
  }
};

export const getById = async (bannerId: string) => {
  try {
    const response = await api.get(`/banners/${bannerId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al obtener el banner');
  }
};

export const findSettingTemplate = async (organizationId: string) => {
  try {
    const response = await api.get(`/banners/findSettingTemplate/${organizationId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al obtener las plantillas de configuración');
  }
};

export const findByOrganizationId = async (organizationId: string) => {
  try {
    const response = await api.get(`/banners/findByOrganizationId/${organizationId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al obtener los banners de la organización');
  }
};

export const updateSettings = async (bannerSettingId: string, settings: IBannerSettings) => {
  try {
    const response = await api.put(`/banners/settings/${bannerSettingId}`, settings);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al actualizar la configuración del banner');
  }
};

export const updateSponsor = async (bannerId: string, sponsorId: string) => {
  try {
    const response = await api.put(`/banners/sponsor/${bannerId}`, { sponsorId });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al actualizar el sponsor del banner');
  }
};

export const toggleVisibility = async (bannerId: string, isVisible: boolean) => {
  try {
    const response = await api.put(`/banners/visibility/${bannerId}`, { isVisible });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al cambiar la visibilidad del banner');
  }
};

export const updatePosition = async (bannerId: string, x: number, y: number) => {
  try {
    const response = await api.put(`/banners/position/${bannerId}`, { x, y });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al actualizar la posición del banner');
  }
};

export const copiedSettingTemplate = async (organizationId: string, bannerSettingsId: string) => {
  try {
    const response = await api.put(`/banners/templateCopy/${bannerSettingsId}`, { organizationId });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al copiar la plantilla de configuración');
  }
};

export const createSettingTemplate = async (bannerSettingsId: string) => {
  try {
    const response = await api.put(`/banners/createTemplate/${bannerSettingsId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al crear la plantilla de configuración');
  }
};
