import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getAllTransactions,
  getOrganizationFinances,
  getStaffMembers,
  OrganizationFinances,
} from '@/app/service/organization.service';
import TransactionTable from './TransactionTable';
import FinancialSummary from './FinancialSummary';
import FinancialChart from './FinancialChart';
import CategorySummary from './CategorySummary';
import ReportGenerator from './ReportGenerator';
import MainDashboard from './MainDashboard';
import DepositWithdrawModal from './DepositWithdrawModal';
import { useEffect, useState } from 'react';
import { DatePickerWithRange } from '../DatePickerWithRange';
import { useAuth } from '@/app/context/AuthContext';
import { useTransactionStore } from '@/app/store/useTransactionStore';
import { IOrganization } from '@/app/types/organization';
import { format } from 'date-fns';

export default function FinancialDashboard({ userId, organizationId }: { userId: string; organizationId: string }) {
  const [finances, setFinances] = useState<OrganizationFinances | null>(null);
  const { user } = useAuth();
  const { transactions, getTransactionByOrganizationId } = useTransactionStore();

  const formatearFecha = (fecha: Date) => format(fecha, 'dd-MM-yyyy');

  const handleDateRangeChange = async (range: { from: Date; to: Date } | undefined) => {
    if (range) {
      if (range.from && range.to) {
        await getTransactionByOrganizationId({
          organizationId: (user?.organizationId as IOrganization)._id as string,
          startDatesStr: formatearFecha(range.from),
          endDateStr: formatearFecha(range.to),
        })
      }
    }
  }

  // Ensure finances has the expected structure
  const formattedFinances = {
    totalBalance: finances?.totalBalance ?? 0,
    totalDeposits: finances?.totalDeposits ?? 0,
    totalWithdrawals: finances?.totalWithdrawals ?? 0,
    monthlyIncome: finances?.monthlyIncome ?? 0,
    monthlyExpenses: finances?.monthlyExpenses ?? 0,
  };

  useEffect(() => {
    const fetchFinances = async () => {

      const now = new Date()
      const pastDate = new Date()
      pastDate.setDate(now.getDate() - 30)

      await getTransactionByOrganizationId({
        organizationId: (user?.organizationId as IOrganization)._id as string,
        startDatesStr: formatearFecha(pastDate),
        endDateStr: formatearFecha(now),
      })

      const finances = await getOrganizationFinances(organizationId);

      setFinances(finances);
    };

    fetchFinances();
  }, [organizationId]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Financiero</h1>
        <DepositWithdrawModal
          userId={userId}
          organizationId={organizationId}
          isCEO={true}
        />
      </div>

      <Tabs defaultValue="overview">
        <div className="flex gap-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
        </div>

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
              <CardTitle>Historial de transacciones</CardTitle>
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
  );
}
