import axios from 'axios';
import { Player } from '@/app/store/teamsStore';
import socket from './socket';
import { ISponsor } from '../types/sponsor';
import { IGetTransactionByOrganizationIdParams, ITransaction } from '../types/ITransaction';

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

    config.data.socketId = socket.id || '';
  }
  return config;
});

export const createTransactionServices = async (transactionData: Partial<ITransaction>) => {
  const response = await api.post(`/transactions`, transactionData);
  return response.data;
};

export const getTransactionByOrganizationIdServices = async ({
  organizationId,
  startDatesStr,
  endDateStr,
}: IGetTransactionByOrganizationIdParams) => {
  const response = await api.get(`/transactions/findByOrganization`, {
    params: {
      organizationId,
      startDatesStr,
      endDateStr,
    },
  });
  return response.data;
};

export const getTransactionByIdServices = async (id: string) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};
