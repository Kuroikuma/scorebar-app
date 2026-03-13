import axios, { AxiosError } from 'axios';
import socket from './socket';
import { IBannerManager } from '../types/Banner';

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

export const createBannerManagerService = async (bannerData: Partial<IBannerManager>) => {
  try {
    const response = await api.post('/bannerManagers', bannerData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al crear el gestor de banners');
  }
};

export const updateBannerManagerService = async (bannerId: string, bannerData: Partial<IBannerManager>) => {
  try {
    const response = await api.put(`/bannerManagers/${bannerId}`, bannerData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al actualizar el gestor de banners');
  }
};

export const getBannerManagerById = async (bannerId: string) => {
  try {
    const response = await api.get(`/bannerManagers/${bannerId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al obtener el gestor de banners');
  }
};

export async function getBannersManagerByOrganization(organizationId: string) {
  try {
    const response = await api.get('/bannerManagers', {
      params: { organizationId }
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al obtener los gestores de banners de la organización');
  }
}