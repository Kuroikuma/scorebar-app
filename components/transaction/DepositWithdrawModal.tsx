"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DepositWithdrawForm from "./DepositWithdrawForm"

interface DepositWithdrawModalProps {
  userId: string
  organizationId: string
  staffMembers: { id: string; name: string }[]
  isCEO: boolean
}

export default function DepositWithdrawModal({
  userId,
  organizationId,
  staffMembers,
  isCEO,
}: DepositWithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Deposit / Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit / Withdraw</DialogTitle>
          <DialogDescription>Make a deposit or withdrawal from your account.</DialogDescription>
        </DialogHeader>
        <DepositWithdrawForm
          userId={userId}
          organizationId={organizationId}
          staffMembers={staffMembers}
          isCEO={isCEO}
          onComplete={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

