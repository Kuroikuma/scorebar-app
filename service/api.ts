import { RunsByInning } from '@/store/gameStore';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/users/login', { email, password });
  console.log("succes");
  
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/users/register', { username, email, password });
  return response.data;
};

export const createGame = async (gameData: any) => {
  const response = await api.post('/games', gameData);
  return response.data;
};

export const updateGameService = async (id: string, gameData: any) => {
  const response = await api.put(`/games/${id}`, gameData);
  return response.data;
};

export const getGame = async (id: string) => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};

export const getAllGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const deleteGame = async (id: string) => {
  await api.delete(`/games/${id}`);
};

export const scoreRun = async (id: string, teamIndex: number, newRuns: number) => {
  const response = await api.post(`/games/${id}/score/${teamIndex}/${newRuns}`);
  return response.data;
};

export const changeTeamNameService = async (id: string, teamIndex: number, newName: string) => {
  const response = await api.put(`/games/${id}/team/${teamIndex}`, { newName });
  return response.data;
};

export const changeTeamColorService = async (id: string, teamIndex: number, newColor: string) => {
  const response = await api.put(`/games/${id}/team/${teamIndex}/color`, { newColor });
  return response.data;
};

export const changeTeamTextColorService = async (id: string, teamIndex: number, newTextColor: string) => {
  const response = await api.put(`/games/${id}/team/${teamIndex}/textColor`, { newTextColor: newTextColor });
  return response.data;
};


export const changeBallCount = async (id: string, newCount: number) => {
  const response = await api.put(`/games/${id}/balls`, { newCount });
  return response.data;
};

export const changeStrikeCount = async (id: string, newCount: number) => {
  const response = await api.put(`/games/${id}/strikes`, { newCount });
  return response.data;
};

export const changeOutCount = async (id: string, newCount: number) => {
  const response = await api.put(`/games/${id}/outs`, { newCount });
  return response.data;
};

export const changeRunsByInningService = async (id: string, runsByInning: RunsByInning) => {
  const response = await api.put(`/games/runsByInning/${id}`, { runsByInning });
  return response.data;
};

export const changeInningService = async (id: string, newInning: number, isTopInning: boolean) => {
  const response = await api.put(`/games/${id}/inning`, { newInning, isTopInning });
  return response.data;
};

export const changeBaseRunner = async (id: string, baseIndex: number, isOccupied: boolean) => {
  const response = await api.put(`/games/${id}/base/${baseIndex}`, { isOccupied });
  return response.data;
};

export const changeGameStatus = async (id: string, newStatus: 'upcoming' | 'in_progress' | 'finished') => {
  const response = await api.put(`/games/${id}/status`, { status: newStatus });
  return response.data;
};

export const getAllConfigs = async () => {
  const response = await api.get('/configs');
  return response.data;
};

export const getConfig = async (id: string) => {
  const response = await api.get(`/configs/${id}`);
  return response.data;
};

export const getConfigByUserId = async (userId: string) => {
  const response = await api.get(`/configs/user/${userId}`);
  return response.data;
}

export const createConfig = async (configData: any) => {
  const response = await api.post('/configs', configData);
  return response.data;
};

export const updateConfig = async (id: string, configData: any) => {
  const response = await api.put(`/configs/${id}`, configData);
  return response.data;
};

export const deleteConfig = async (id: string) => {
  await api.delete(`/configs/${id}`);
};

export default api;

