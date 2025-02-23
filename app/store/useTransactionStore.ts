import { create } from 'zustand';
import { IGetTransactionByOrganizationIdParams, ITransaction } from '../types/ITransaction';
import { createTransactionServices, getTransactionByIdServices, getTransactionByOrganizationIdServices,  } from '../service/transaction.service';

type TransactionState = {
  transactions: ITransaction[];
  currentTransaction: ITransaction | null;
  setCurrentTransaction: (staff: ITransaction) => void;
  getTransactionByOrganizationId: ({ organizationId, startDatesStr, endDateStr }: IGetTransactionByOrganizationIdParams) => Promise<ITransaction[]>;
  getTransactionById: (id: string) => Promise<void>;
  createTransaction: (staff: Partial<ITransaction>) => Promise<ITransaction>;
};

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  currentTransaction: null,

  // Actions
  setCurrentTransaction: (staff) => set({ currentTransaction: staff }),

  getTransactionByOrganizationId: async (data) => {
    const transaction = (await getTransactionByOrganizationIdServices(data)) as ITransaction[];
    set({ transactions: transaction });

    return transaction;
  },

  getTransactionById: async (id) => {
    const transaction = await getTransactionByIdServices(id);
    set({ currentTransaction: transaction });
  },

  createTransaction: async (transaction) => {

    delete transaction._id;
    const newTransaction = await createTransactionServices({...transaction});
    const { transactions } = get();
    set({ transactions: [...transactions, newTransaction] });
    return newTransaction;
  },
}));
