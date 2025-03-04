"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ITransaction, TransactionCategory, TransactionType } from "@/app/types/ITransaction"

interface CategorySummaryProps {
  transactions: ITransaction[]
}

export default function CategorySummary({ transactions }: CategorySummaryProps) {
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([])

  const categorySummary = Object.values(TransactionCategory).reduce(
    (acc, category) => {
      const categoryTransactions = transactions.filter((t) => t.category === category)
      const totalDeposits = categoryTransactions
        .filter((t) => t.type === TransactionType.DEPOSIT)
        .reduce((sum, t) => sum + t.amount, 0)
      const totalWithdrawals = categoryTransactions
        .filter((t) => t.type === TransactionType.WITHDRAWAL)
        .reduce((sum, t) => sum + t.amount, 0)

      acc[category] = {
        totalDeposits,
        totalWithdrawals,
        netAmount: totalDeposits - totalWithdrawals,
      }
      return acc
    },
    {} as Record<TransactionCategory, { totalDeposits: number; totalWithdrawals: number; netAmount: number }>,
  )

  const toggleCategory = (category: TransactionCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(categorySummary).map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category as TransactionCategory) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleCategory(category as TransactionCategory)}
          >
            {category}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(categorySummary)
          .filter(([category]) => selectedCategories.includes(category as TransactionCategory))
          .map(([category, summary]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Deposits: ${summary.totalDeposits.toFixed(2)}</p>
                <p>Total Withdrawals: ${summary.totalWithdrawals.toFixed(2)}</p>
                <p>Net Amount: ${summary.netAmount.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

