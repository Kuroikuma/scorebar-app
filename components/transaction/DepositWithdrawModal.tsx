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
  isCEO: boolean
}

export default function DepositWithdrawModal({
  userId,
  organizationId,
  isCEO,
}: DepositWithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Depósito / Retirar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Depósito / Retirar</DialogTitle>
          <DialogDescription>Realice un depósito o retiro en su cuenta.</DialogDescription>
        </DialogHeader>
        <DepositWithdrawForm
          userId={userId}
          organizationId={organizationId}
          isCEO={isCEO}
          onComplete={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

