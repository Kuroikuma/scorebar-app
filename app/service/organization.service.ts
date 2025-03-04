import axios from 'axios';
import { Player  } from '@/app/store/teamsStore';
import socket from './socket';
import { ITransaction, TransactionCategory, TransactionType } from '../types/ITransaction';

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



// Updated mock data
const mockTransactions: ITransaction[] = [
  {
    _id: "1",
    amount: 5000,
    type: TransactionType.DEPOSIT,
    user: "user1",
    organization: "org1",
    description: "Monthly salary",
    createdAt: new Date("2023-01-01"),
    category: TransactionCategory.SALARY,
    date: new Date("2023-01-01"),
    sponsor: null,
  },
  {
    _id: "2",
    amount: 1000,
    type: TransactionType.WITHDRAWAL,
    user: "user2",
    organization: "org1",
    description: "Office supplies purchase",
    createdAt: new Date("2023-01-15"),
    category: TransactionCategory.OFFICE_SUPPLIES,
    date: new Date("2023-01-15"),
    sponsor: null,
  },
  {
    _id: "3",
    amount: 2000,
    type: TransactionType.DEPOSIT,
    user: "user1",
    organization: "org1",
    description: "Client payment",
    createdAt: new Date("2023-02-01"),
    category: TransactionCategory.OTHER_INCOME,
    date: new Date("2023-02-01"),
    sponsor: null,
  },
  {
    _id: "4",
    amount: 1500,
    type: TransactionType.WITHDRAWAL,
    user: "user2",
    organization: "org1",
    description: "Marketing campaign",
    createdAt: new Date("2023-02-15"),
    category: TransactionCategory.MARKETING,
    date: new Date("2023-02-15"),
    sponsor: null,
  },
]

const mockFinances = {
  totalBalance: 10000,
  totalDeposits: 15000,
  totalWithdrawals: 5000,
  monthlyIncome: 7000,
  monthlyExpenses: 3000,
}

export interface OrganizationFinances {
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export async function getOrganizationFinances(organizationId: string) {
  // In a real application, you would fetch the organization finances from a database.
  // This is a placeholder implementation.
  return mockFinances
}

export async function getAllTransactions(organizationId: string) {
  // In a real application, you would fetch all transactions for the organization from a database.
  // This is a placeholder implementation.
  return mockTransactions.filter((t) => t.organization === organizationId)
}

export async function getUserTransactions(userId: string) {
  // In a real application, you would fetch the user's transactions from a database.
  // This is a placeholder implementation.
  return mockTransactions.filter((t) => t.user === userId)
}

export async function depositMoney(
  userId: string,
  organizationId: string,
  amount: number,
  description: string,
  category: TransactionCategory,
) {
  // In a real application, you would update your database
  console.log(
    `Depositing $${amount} for user ${userId} in organization ${organizationId}: ${description} (Category: ${category})`,
  )
  return { success: true }
}

export async function withdrawMoney(
  userId: string,
  organizationId: string,
  amount: number,
  description: string,
  category: TransactionCategory,
) {
  // In a real application, you would update your database
  console.log(
    `Withdrawing $${amount} for user ${userId} in organization ${organizationId}: ${description} (Category: ${category})`,
  )
  return { success: true }
}

export async function getStaffMembers(organizationId: string) {
  // In a real application, you would fetch staff members from a database.
  // This is a placeholder implementation.
  return [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
  ]
}

