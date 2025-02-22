"use client"

import { useState } from "react"
import { Line, Bar } from "react-chartjs-2"
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
} from "chart.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ITransaction, TransactionCategory, TransactionType } from "@/app/types/ITransaction"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface FinancialChartProps {
  transactions: ITransaction[]
}

export default function FinancialChart({ transactions }: FinancialChartProps) {
  const [timeRange, setTimeRange] = useState("7days")

  const filterTransactions = () => {
    const now = new Date()
    const pastDate = new Date()
    switch (timeRange) {
      case "7days":
        pastDate.setDate(now.getDate() - 7)
        break
      case "30days":
        pastDate.setDate(now.getDate() - 30)
        break
      case "90days":
        pastDate.setDate(now.getDate() - 90)
        break
      default:
        pastDate.setDate(now.getDate() - 7)
    }
    return transactions.filter((t) => new Date(t.createdAt) >= pastDate)
  }

  const filteredTransactions = filterTransactions()

  const balanceData = {
    labels: filteredTransactions.map((t) => new Date(t.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Balance",
        data: filteredTransactions.map((_, index) => {
          return filteredTransactions.slice(0, index + 1).reduce((acc, t) => {
            return t.type === TransactionType.DEPOSIT ? acc + t.amount : acc - t.amount
          }, 0)
        }),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const incomeVsExpenseData = {
    labels: filteredTransactions.map((t) => new Date(t.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Income",
        data: filteredTransactions.map((t) => (t.type === TransactionType.DEPOSIT ? t.amount : 0)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Expense",
        data: filteredTransactions.map((t) => (t.type === TransactionType.WITHDRAWAL ? t.amount : 0)),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  }

  const categoryData = Object.values(TransactionCategory).reduce(
    (acc, category) => {
      const total = filteredTransactions.filter((t) => t.category === category).reduce((sum, t) => sum + t.amount, 0)
      acc.labels.push(category)
      acc.datasets[0].data.push(total)
      return acc
    },
    {
      labels: [] as string[],
      datasets: [
        {
          label: "Total by Category",
          data: [] as number[],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    },
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Financial Overview",
      },
    },
  }

  return (
    <div className="space-y-4">
      <Select onValueChange={setTimeRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
      <Tabs defaultValue="balance">
        <TabsList>
          <TabsTrigger value="balance">Balance Trend</TabsTrigger>
          <TabsTrigger value="incomeVsExpense">Income vs Expense</TabsTrigger>
          <TabsTrigger value="category">Category Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="balance">
          <Card>
            <CardHeader>
              <CardTitle>Balance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Line options={options} data={balanceData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="incomeVsExpense">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={options} data={incomeVsExpenseData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar options={options} data={categoryData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

