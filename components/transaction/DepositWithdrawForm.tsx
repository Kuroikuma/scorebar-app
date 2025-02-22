"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionCategory } from "@/app/types/ITransaction"
import { depositMoney, withdrawMoney } from "@/app/service/organization.service"
import { toast } from "sonner"

interface DepositWithdrawFormProps {
  userId: string
  organizationId: string
  staffMembers?: { id: string; name: string }[]
  isCEO: boolean
  onComplete?: () => void
}

export default function DepositWithdrawForm({
  userId,
  organizationId,
  staffMembers,
  isCEO,
  onComplete,
}: DepositWithdrawFormProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit")
  const [selectedStaff, setSelectedStaff] = useState("")
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.OTHER_INCOME)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (type === "deposit") {
        await depositMoney(userId, organizationId, Number.parseFloat(amount), description, category)
      } else {
        await withdrawMoney(
          isCEO && selectedStaff ? selectedStaff : userId,
          organizationId,
          Number.parseFloat(amount),
          description,
          category,
        )
      }
    
      toast.success(`Transaction Successful: ${type === "deposit" ? "Deposited" : "Withdrawn"} $${amount}`)
      // Reset form
      setAmount("")
      setDescription("")
      setSelectedStaff("")
      setCategory(TransactionCategory.OTHER_INCOME)
      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      toast.error("An error occurred while processing your transaction.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select onValueChange={(value) => setType(value as "deposit" | "withdrawal")}>
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isCEO && type === "withdrawal" && (
        <div className="space-y-2">
          <Label htmlFor="staff">Assign to Staff Member</Label>
          <Select onValueChange={setSelectedStaff}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers?.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => setCategory(value as TransactionCategory)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
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
        {type === "deposit" ? "Deposit" : "Withdraw"}
      </Button>
    </form>
  )
}

