import { Game, RunsByInning, Status } from '@/app/store/gameStore';
import axios from 'axios';
import { Player, Team, useTeamsStore } from '@/app/store/teamsStore';
import { ConfigGame } from '../store/configStore';
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

export const login = async (email: string, password: string) => {
  const response = await api.post('/users/login', { email, password });
  console.log("succes");
  
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/users/register', { username, email, password });
  return response.data;
};

export const createGame = async (gameData: Omit<Game, "id">) => {
  const response = await api.post('/games', gameData);
  return response.data;
};

export const updateGameService = async (id: string, gameData: Omit<Game, "userId">) => {
  const response = await api.put(`/games/${id}`, gameData);
  return response.data;
};

export const getGame = async (id: string) => {
  const response = await api.get(`/games/${id}`);
  return response.data;
};

export const getOverlay = async (id: string) => {
  const response = await api.get(`/overlay/${id}`);
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
  const newColor = useTeamsStore.getState().teams[teamIndex].color;
  const newTextColor = useTeamsStore.getState().teams[teamIndex].textColor;
  const response = await api.put(`/games/${id}/team/${teamIndex}`, { newName });
  return response.data;
};

export const changeTeamShortNameService = async (id: string, teamIndex: number, newName: string) => {
  const response = await api.put(`/games/${id}/teamShortName/${teamIndex}`, { newName });
  return response.data;
};

export const changeTeamColorService = async (id: string, teamIndex: number, newColor: string) => {
  const newName = useTeamsStore.getState().teams[teamIndex].name;
  const newTextColor = useTeamsStore.getState().teams[teamIndex].textColor;
  const response = await api.put(`/games/${id}/team/${teamIndex}/color`, { newColor });
  return response.data;
};

export const changeTeamTextColorService = async (id: string, teamIndex: number, newTextColor: string) => {
  const newName = useTeamsStore.getState().teams[teamIndex].name;
  const newColor = useTeamsStore.getState().teams[teamIndex].color;
  const response = await api.put(`/games/${id}/team/${teamIndex}/textColor`, { newTextColor: newTextColor });
  return response.data;
};

export const changeStatusService = async (id: string, newStatus: Status) => {
  const response = await api.put(`/games/status/${id}`, { newStatus });
  return response.data;
};

export const updateLineupTeamService = async (data: IUpdateLineupTeam) => {
  const { teamIndex, lineup, id } = data;
  let response = await api.put(`/games/lineup/${id}`, { teamIndex, lineup });
  return response.data;
};

export const advanceBatterService = async (id: string, teamIndex: number, currentBatter: number) => {
  const response = await api.put(`/games/advanceBatter/${id}`, { teamIndex, currentBatter });
  return response.data;
};

export const setDHService = async (id: string) => {
  const response = await api.put(`/games/dh/${id}`);
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

export const createConfigService = async (configData: Omit<ConfigGame, "_id">) => {
  const response = await api.post('/configs', configData);
  return response.data;
};

export const updateConfig = async (id: string, configData: Partial<ConfigGame>) => {
  const response = await api.put(`/configs/${id}`, configData);
  return response.data;
};

export const deleteConfig = async (id: string) => {
  await api.delete(`/configs/${id}`);
};

export const changeHits = async (id: string, newHits: number, teamIndex: number) => {
  const response = await api.put(`/games/hits/${id}`, { newHits, teamIndex });
  return response.data;
};

export const changeErrors = async (id: string, newErrors: number, teamIndex: number) => {
  const response = await api.put(`/games/errors/${id}`, { newErrors, teamIndex });
  return response.data;
};

export const changePastAndFutureGame = async (id: string, past:Partial<Omit<Game, "userId">>[] , future:Partial<Omit<Game, "userId">>[]) => {
  const response = await api.put(`/games/pastAndFuture/game`, { past, future, gameId: id });
  return response.data;
};

export const handlePositionOverlayServices = async (id: string, data: { x: number; y: number; }, gameId: string) => {
  const response = await api.put(`/overlay/position`, { x: data.x, y: data.y, gameId, id });
  return response.data;
};

export const handleScaleOverlayServices = async (id: string, scale: number, gameId: string) => {
  const response = await api.put(`/overlay/scale`, { scale, id, gameId });
  return response.data;
};

export const handleVisibleOverlayServices = async (id: string, visible: boolean, gameId: string) => {
  const response = await api.put(`/overlay/visible`, { visible, id, gameId });
  return response.data;
};

export const handlePlayServices = async (id: string, teamIndex: number, team: Team, bases: boolean[]) => {
  const response = await api.put(`/overlay/play`, {  id, teamIndex, team, bases });
  return response.data;
};

export default api;

