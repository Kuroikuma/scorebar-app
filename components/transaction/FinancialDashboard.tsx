import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllTransactions, getOrganizationFinances, getStaffMembers, OrganizationFinances } from "@/app/service/organization.service"
import TransactionTable from "./TransactionTable"
import FinancialSummary from "./FinancialSummary"
import FinancialChart from "./FinancialChart"
import CategorySummary from "./CategorySummary"
import ReportGenerator from "./ReportGenerator"
import MainDashboard from "./MainDashboard"
import DepositWithdrawModal from "./DepositWithdrawModal"
import { StaffMember, User } from "@/app/types/user"
import { ITransaction } from "@/app/types/ITransaction"
import { useEffect, useState } from "react"

export default function FinancialDashboard({
  userId,
  organizationId,
}: { userId: string; organizationId: string }) {

  const [finances, setFinances] = useState<OrganizationFinances | null>(null)
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

  // Ensure finances has the expected structure
  const formattedFinances = {
    totalBalance: finances?.totalBalance ?? 0,
    totalDeposits: finances?.totalDeposits ?? 0,
    totalWithdrawals: finances?.totalWithdrawals ?? 0,
    monthlyIncome: finances?.monthlyIncome ?? 0,
    monthlyExpenses: finances?.monthlyExpenses ?? 0,
  }

  useEffect(() => {
    const fetchFinances = async () => {
      const finances = await getOrganizationFinances(organizationId)
      const transactions = await getAllTransactions(organizationId)
      const staffMembers = await getStaffMembers(organizationId)
      setFinances(finances)
      setTransactions(transactions)
      setStaffMembers(staffMembers)
    }

    fetchFinances()
  }, [organizationId]);


  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <DepositWithdrawModal
          userId={userId}
          organizationId={organizationId}
          staffMembers={staffMembers}
          isCEO={true}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <MainDashboard transactions={transactions} finances={formattedFinances} />
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialSummary finances={formattedFinances} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={transactions} showUserFilter={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportGenerator transactions={transactions} />
            </CardContent>
          </Card>
          <div className="mt-6">
            <FinancialChart transactions={transactions} />
          </div>
          <div className="mt-6">
            <CategorySummary transactions={transactions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

