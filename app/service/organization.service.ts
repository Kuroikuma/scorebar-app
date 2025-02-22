import axios from 'axios';
import { Player  } from '@/app/store/teamsStore';
import socket from './socket';

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

export const getAllGames = async (id: string) => {
  const response = await api.get(`/organizations/gameAndMatch/${id}`);
  return response.data;
};