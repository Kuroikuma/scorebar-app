import TransactionTable from "./TransactionTable"
import DepositWithdrawForm from "./DepositWithdrawForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserTransactions } from "@/app/service/organization.service";
import RecentActivity from "./RecentActivity";
import { useEffect, useState } from "react";
import { ITransaction } from "@/app/types/ITransaction";

export default function StaffDashboard({ userId, organizationId }: { userId: string; organizationId: string }) {

  const [transactions, setTransactions] = useState<ITransaction[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getUserTransactions(userId)
      setTransactions(transactions)
    }

    fetchTransactions()
  },
  [userId]);

  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Your Transactions</TabsTrigger>
          <TabsTrigger value="deposit-withdraw">Deposit/Withdraw</TabsTrigger>
          <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Your Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable transactions={transactions} showUserFilter={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deposit-withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Deposit / Withdraw</CardTitle>
            </CardHeader>
            <CardContent>
              <DepositWithdrawForm userId={userId} organizationId={organizationId} isCEO={false} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent-activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity transactions={transactions.slice(0, 10)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

