import axios from 'axios';
import { Player  } from '@/app/store/teamsStore';
import socket from './socket';
import { User } from '../types/user';

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

export const createStaffServices = async (userData: Partial<User>) => {
  const response = await api.post(`/users/register`, userData);
  return response.data;
};

export const updateStaffServices = async (id: string, userData: Partial<User>) => {
  const response = await api.post(`/users/update/${id}`, userData);
  return response.data;
};

export const deleteStaffServices = async (id: string) => {
  await api.post(`/users/update/${id}`, { deleted_at: new Date().toISOString() });
};

export const restoreStaffServices = async (id: string) => {
  await api.post(`/users/update/${id}`, { deleted_at: null });
};

export const getStaffByOrganizationIdServices = async (id: string) => {
  const response = await api.get(`/users/staff/organization/${id}`);
  return response.data;
};

export const getUserByIdServices = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};