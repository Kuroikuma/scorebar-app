'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionCategory, TransactionType } from '@/app/types/ITransaction';
import { toast } from 'sonner';
import { useSponsorStore } from '@/app/store/useSponsor';
import { useAuth } from '@/app/context/AuthContext';
import { IOrganization } from '@/app/types/organization';
import { useStaffStore } from '@/app/store/useStaffStore';
import { useTransactionStore } from '@/app/store/useTransactionStore';
import { Textarea } from '../ui/textarea';
import { User } from '@/app/types/user';

interface DepositWithdrawFormProps {
  userId: string;
  organizationId: string;
  isCEO: boolean;
  onComplete?: () => void;
}

export default function DepositWithdrawForm({ userId, organizationId, isCEO, onComplete }: DepositWithdrawFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.DEPOSIT);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState('');
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.OTHER_INCOME);
  const { sponsors, getSponsorsByOrganizationId } = useSponsorStore();
  const { staffs, getStaffByOrganizationId } = useStaffStore();
  const { user, setUser } = useAuth();
  const { createTransaction } = useTransactionStore();

  useEffect(() => {
    if (!user) return;
    let organization = (user.organizationId as IOrganization)._id as string;
    getSponsorsByOrganizationId(organization);
    getStaffByOrganizationId(organization);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let newTransaction = {
        organization: organizationId,
        amount:
          category === TransactionCategory.SPONSOR_PAYMENT && selectedSponsor
            ? sponsors.find((s) => s._id === selectedSponsor)?.sponsorshipFee.$numberDecimal
            : Number.parseFloat(amount),
        description,
        category,
        type,
        user: isCEO && selectedStaff ? selectedStaff : userId,
        sponsor: selectedSponsor ? selectedSponsor : null,
        date: new Date(),
      };

      let newTransactionService = await createTransaction(newTransaction);
      let totalBalance = (newTransactionService.organization as IOrganization).totalBalance

      let updatedUser = {
        ...{
          ...(user as User),
          organizationId: {
            ...((user as User).organizationId as IOrganization),
            totalBalance: totalBalance,
          },
        },
      }

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success(
        `Transaction Successful: ${type === TransactionType.DEPOSIT ? 'Depositado' : 'Retirado'} $${amount}`
      );
      // Reset form
      setAmount('');
      setDescription('');
      setSelectedStaff('');
      setSelectedSponsor('');
      setCategory(TransactionCategory.OTHER_INCOME);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast.error('An error occurred while processing your transaction.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select onValueChange={(value) => setType(value as TransactionType)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el tipo de transacción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TransactionType.DEPOSIT}>{TransactionType.DEPOSIT}</SelectItem>
            <SelectItem value={TransactionType.WITHDRAWAL}>{TransactionType.WITHDRAWAL}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isCEO && (
        <div className="space-y-2">
          <Label htmlFor="staff">Asignar a Miembro del Staff</Label>
          <Select onValueChange={setSelectedStaff}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un miembro del staff" />
            </SelectTrigger>
            <SelectContent>
              {staffs?.map((staff) => (
                <SelectItem key={staff._id} value={staff._id}>
                  {staff.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {type === TransactionType.DEPOSIT && category === TransactionCategory.SPONSOR_PAYMENT && (
        <div className="space-y-2">
          <Label htmlFor="staff">Cuota de patrocinador</Label>
          <Select onValueChange={setSelectedSponsor}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el patrocinador" />
            </SelectTrigger>
            <SelectContent>
              {sponsors?.map((sponsor) => (
                <SelectItem key={sponsor._id} value={sponsor._id}>
                  {sponsor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Monto</Label>
        <Input
          id="amount"
          disabled={category === TransactionCategory.SPONSOR_PAYMENT && selectedSponsor ? true : false}
          type="number"
          value={
            category === TransactionCategory.SPONSOR_PAYMENT && selectedSponsor
              ? sponsors.find((s) => s._id === selectedSponsor)?.sponsorshipFee.$numberDecimal
              : amount
          }
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select onValueChange={(value) => setCategory(value as TransactionCategory)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione la categoría" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TransactionCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        {type === TransactionType.DEPOSIT ? 'Depositar' : 'Retirar'}
      </Button>
    </form>
  );
}
