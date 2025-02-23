'use client';

import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ITransaction, TransactionCategory, TransactionType } from '@/app/types/ITransaction';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface FinancialChartProps {
  transactions: ITransaction[];
}

export default function FinancialChart({ transactions }: FinancialChartProps) {
  const balanceData = {
    labels: transactions.map((t) => new Date(t.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Balance',
        data: transactions.map((_, index) => {
          return transactions.slice(0, index + 1).reduce((acc, t) => {
            return t.type === TransactionType.DEPOSIT ? acc + t.amount : acc - t.amount;
          }, 0);
        }),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const incomeVsExpenseData = {
    labels: transactions.map((t) => new Date(t.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Ingresos',
        data: transactions.map((t) => (t.type === TransactionType.DEPOSIT ? t.amount : 0)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gastos',
        data: transactions.map((t) => (t.type === TransactionType.WITHDRAWAL ? t.amount : 0)),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const abbreviate = (text: string, maxLength: number = 10): string => {
    const words = text.trim().split(/\s+/);
  
    // Si hay espacios, tomar la primera letra de cada palabra
    if (words.length > 1) {
      const acronym = words.map(word => word[0].toUpperCase()).join("");
      return acronym.length <= maxLength ? acronym : acronym.substring(0, maxLength);
    }
  
    // Si es una sola palabra larga, devolver solo las primeras 3 letras
    return text.length > maxLength ? text.substring(0, 3) : text;
  };

  const categoryData = {
    labels: Object.values(TransactionCategory).map(abbreviate),
    datasets: [
      {
        label: 'Ingresos',
        data: Object.values(TransactionCategory).map((category) =>
          transactions
            .filter((t) => t.category === category && t.type === TransactionType.DEPOSIT)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: 'rgba(75, 192, 92, 0.6)', // Green for deposits
      },
      {
        label: 'Gastos',
        data: Object.values(TransactionCategory).map((category) =>
          transactions
            .filter((t) => t.category === category && t.type === TransactionType.WITHDRAWAL)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red for withdrawals
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Panorama financiero',
      },
    },
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="balance">
        <TabsList>
          <TabsTrigger value="balance">Tendencia del saldo</TabsTrigger>
          <TabsTrigger value="incomeVsExpense">Ingresos vs Gastos</TabsTrigger>
          <TabsTrigger value="category">Desglose por categorías</TabsTrigger>
        </TabsList>
        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia del saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <Line options={options} data={balanceData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incomeVsExpense">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos vs Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={options} data={incomeVsExpenseData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Desglose por categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                options={{
                  ...options,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                      beginAtZero: true,
                    },
                  },
                }}
                data={categoryData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
