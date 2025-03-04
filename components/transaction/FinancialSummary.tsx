import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FinancialSummaryProps {
  finances: {
    totalBalance?: number
    totalDeposits?: number
    totalWithdrawals?: number
    monthlyIncome?: number
    monthlyExpenses?: number
  }
}

export default function FinancialSummary({ finances }: FinancialSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${finances.totalBalance?.toFixed(2) ?? "0.00"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Income</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${finances.monthlyIncome?.toFixed(2) ?? "0.00"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${finances.monthlyExpenses?.toFixed(2) ?? "0.00"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Net Monthly</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${((finances.monthlyIncome ?? 0) - (finances.monthlyExpenses ?? 0)).toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

