import axios from 'axios';
import socket from './socket';
import { IBannerManager, IBannerSettings } from '../types/Banner';

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

export const createBannerManagerService = async (bannerData: Partial<IBannerManager>) => {
  const response = await api.post('/bannerManagers', bannerData);
  return response.data;
};

export const updateBannerManagerService = async (bannerId: string, bannerData: Partial<IBannerManager>) => {
  const response = await api.put(`/bannerManagers/${bannerId}`, bannerData);
  return response.data;
};

export const getBannerManagerById = async (bannerId: string) => {
  const response = await api.get(`/bannerManagers/${bannerId}`);
  return response.data;
};

export async function getBannersManagerByOrganization(organizationId: string) {
  try {
    const response = await api.get('/bannerManagers', {
      params: { organizationId }
    });
    console.log('Banners:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
}