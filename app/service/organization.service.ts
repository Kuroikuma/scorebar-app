import axios from 'axios';
import socket from './socket';

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

export const getAllGamesServices = async (id: string) => {
  const response = await api.get(`/organizations/gameAndMatch/${id}`);
  return response.data;
};

export const getSponsorsByOrganizationIdService = async (id: string) => {
  const response = await api.get(`/organizations/sponsors/${id}`);
  return response.data;
};

export const getStaffsByOrganizationIdService = async (id: string) => {
  const response = await api.get(`/organizations/staffs/${id}`);
  return response.data;
};


