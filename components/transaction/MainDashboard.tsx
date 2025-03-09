import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowUpIcon, ArrowDownIcon, AlertTriangleIcon } from "lucide-react"
import { ITransaction, TransactionType } from "@/app/types/ITransaction"
import { useAuth } from "@/app/context/AuthContext"
import { IOrganization } from "@/app/types/organization"

interface MainDashboardProps {
  transactions: ITransaction[]
}

export default function MainDashboard({ transactions }: MainDashboardProps) {
  const { user } = useAuth()
  const totalBalance = (user?.organizationId as IOrganization)?.totalBalance
  const latestTransactions = transactions.slice(0, 5)
  const rangeTotalIncome = transactions.filter((t) => t.type === TransactionType.DEPOSIT).reduce((acc, t) => acc + t.amount, 0)
  const rangeTotalExpenses = transactions.filter((t) => t.type === TransactionType.WITHDRAWAL).reduce((acc, t) => acc + t.amount, 0)
  const netIncome = rangeTotalIncome - rangeTotalExpenses
  const isPositiveNetIncome = netIncome >= 0

  // Calculate month-over-month growth
  const currentMonthTotal = transactions
    .filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth())
    .reduce((acc, t) => (t.type === TransactionType.DEPOSIT ? acc + t.amount : acc - t.amount), 0)

  const lastMonthTotal = transactions
    .filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth() - 1)
    .reduce((acc, t) => (t.type === TransactionType.DEPOSIT ? acc + t.amount : acc - t.amount), 0)

  const growthRate = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance?.$numberDecimal}</div>
            <p className="text-xs text-muted-foreground">+{growthRate.toFixed(2)}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingreso neto entre el rango</CardTitle>
            {isPositiveNetIncome ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{isPositiveNetIncome ? "Ganancia" : "Pérdida"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos entre el rango</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${rangeTotalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos entre el rango</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${rangeTotalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Financial Alert</AlertTitle>
        <AlertDescription>
          {totalBalance.$numberDecimal < 1000
            ? "Low balance alert: Your total balance is below $1,000."
            : rangeTotalExpenses > rangeTotalIncome
              ? "Expense alert: Your monthly expenses are higher than your monthly income."
              : "Your finances are in good standing."}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {latestTransactions.map((transaction) => (
              <li key={transaction._id} className="flex justify-between items-center">
                <span>{transaction.description}</span>
                <span className={transaction.type === TransactionType.DEPOSIT ? "text-green-500" : "text-red-500"}>
                  ${transaction.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

