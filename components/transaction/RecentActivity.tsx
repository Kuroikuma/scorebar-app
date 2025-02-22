import { ITransaction, TransactionType } from "@/app/types/ITransaction"
import { format } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface RecentActivityProps {
  transactions: ITransaction[]
}

export default function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction._id} className="flex items-center">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              transaction.type === TransactionType.DEPOSIT ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {transaction.type === TransactionType.DEPOSIT ? (
              <ArrowUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
            <p className="text-sm text-gray-500">{format(new Date(transaction.createdAt), "MMM d, yyyy")}</p>
          </div>
          <div
            className={`flex-shrink-0 text-sm font-medium ${
              transaction.type === TransactionType.DEPOSIT ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type === TransactionType.DEPOSIT ? "+$" : "-$"} ${transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}

