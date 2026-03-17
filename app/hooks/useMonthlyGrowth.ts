import { useMemo } from "react"
import { TransactionType } from "../types/ITransaction"

interface Transaction {
  createdAt: string | Date
  type: TransactionType
  amount: number
}

interface MonthlyGrowthResult {
  currentMonthTotal: number
  lastMonthTotal: number
  growthRate: number | null
}

function calcMonthTotal(transactions: Transaction[], month: number, year: number): number {
  return transactions
    .filter((t) => {
      const d = new Date(t.createdAt)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .reduce(
      (acc, t) => (t.type === TransactionType.DEPOSIT ? acc + t.amount : acc - t.amount),
      0
    )
}

export function useMonthlyGrowth(transactions: Transaction[]): MonthlyGrowthResult {
  return useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
    const lastMonth = lastMonthDate.getMonth()
    const lastYear = lastMonthDate.getFullYear()

    const currentMonthTotal = calcMonthTotal(transactions, currentMonth, currentYear)
    const lastMonthTotal = calcMonthTotal(transactions, lastMonth, lastYear)

    const growthRate =
      lastMonthTotal === 0
        ? 0
        : ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100

    return { currentMonthTotal, lastMonthTotal, growthRate }
  }, [transactions])
}