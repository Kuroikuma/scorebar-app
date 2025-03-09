import axios from 'axios';
import socket from './socket';
import { IBannerSettings } from '../types/Banner';

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

export const createBanner = async (bannerData: Partial<IBannerSettings>) => {
  const response = await api.post('/banners', bannerData);
  return response.data;
};

export const update = async (bannerId: string, bannerData: Partial<IBannerSettings>) => {
  const response = await api.put(`/banners/${bannerId}`, bannerData);
  return response.data;
};

export const getById = async (bannerId: string) => {
  const response = await api.get(`/banners/${bannerId}`);
  return response.data;
};

export const findSettingTemplate = async (organizationId: string) => {
  const response = await api.get(`/banners/findSettingTemplate/${organizationId}`);
  return response.data;
};

export const findByOrganizationId = async (organizationId: string) => {
  const response = await api.get(`/banners/findByOrganizationId/${organizationId}`);
  return response.data;
};

export const updateSettings = async (bannerSettingId: string, settings: IBannerSettings) => {
  const response = await api.put(`/banners/settings/${bannerSettingId}`, settings);
  return response.data;
};

export const updateSponsor = async (bannerId: string, sponsorId: string) => {
  const response = await api.put(`/banners/sponsor/${bannerId}`, { sponsorId });
  return response.data;
};

export const toggleVisibility = async (bannerId: string, isVisible: boolean) => {
  const response = await api.put(`/banners/visibility/${bannerId}`, { isVisible });
  return response.data;
};

export const updatePosition = async (bannerId: string, x: number, y: number) => {
  const response = await api.put(`/banners/position/${bannerId}`, { x, y });
  return response.data;
};

export const copiedSettingTemplate = async (organizationId: string, bannerSettingsId: string) => {
  const response = await api.put(`/banners/templateCopy/${bannerSettingsId}`, { organizationId });
  return response.data;
};

export const createSettingTemplate = async (bannerSettingsId: string) => {
  const response = await api.put(`/banners/createTemplate/${bannerSettingsId}`);
  return response.data;
};
