import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        });
      }
    }
  };

  useEffect(() => {
    const fetchFinances = async () => {
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - 30);

      await getTransactionByOrganizationId({
        organizationId: (user?.organizationId as IOrganization)._id as string,
        startDatesStr: formatearFecha(pastDate),
        endDateStr: formatearFecha(now),
      });
    };

    fetchFinances();
  }, [organizationId]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Financiero</h1>
        <div className="md:flex hidden">
          <DepositWithdrawModal userId={userId} organizationId={organizationId} isCEO={true} />
        </div>
      </div>

      <div className="md:hidden flex justify-between items-center flex-col gap-2">
        <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
        <DepositWithdrawModal userId={userId} organizationId={organizationId} isCEO={true} />
      </div>

      <Tabs defaultValue="overview">
        <div className="flex gap-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>
          <div className="md:flex hidden">
            <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
          </div>
        </div>

        <TabsContent value="overview">
          <MainDashboard transactions={transactions} />
          {/* <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialSummary finances={formattedFinances} />
              </CardContent>
            </Card>
          </div> */}
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
              <CardTitle>Reportes Financieros</CardTitle>
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
