import axios from 'axios';
import { Player  } from '@/app/store/teamsStore';
import socket from './socket';
import { ISponsor } from '../types/sponsor';

interface IUpdateLineupTeam {
  teamIndex: number;
  lineup: Player[];
  id: string;
}

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

export const createSponsorServices = async (sponsorData: Partial<ISponsor>) => {
  const response = await api.post(`/sponsors`, sponsorData);
  return response.data;
};

export const updateSponsorServices = async (id: string, sponsorData: Partial<ISponsor>) => {
  const response = await api.put(`/sponsors/${id}`, sponsorData);
  return response.data;
};

export const deleteSponsorServices = async (id: string) => {
  await api.put(`/sponsors/${id}`, { deleted_at: new Date().toISOString() });
};

export const restoreSponsorServices = async (id: string) => {
  await api.put(`/sponsors/${id}`, { deleted_at: null });
};

export const getSponsorByIdServices = async (id: string) => {
  const response = await api.get(`/sponsors/${id}`);
  return response.data;
};