import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ISponsor } from "@/app/types/sponsor"

interface SponsorDetailModalProps {
  sponsor: ISponsor
  isOpen: boolean
  onClose: () => void
}

export function SponsorDetailModal({ sponsor, isOpen, onClose }: SponsorDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            {sponsor.name}
          </DialogTitle>
          <DialogDescription>{sponsor.ad}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <strong>Website:</strong>{" "}
            <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {sponsor.link}
            </a>
          </div>
          <div>
            <strong>Propietario:</strong> {sponsor.owner}
          </div>
          <div>
            <strong>Email:</strong> {sponsor.email}
          </div>
          <div>
            <strong>Teléfono:</strong> {sponsor.phone}
          </div>
          <div>
            <strong>Dirección:</strong> {sponsor.address}
          </div>
          <div>
            <strong>Fecha de pago:</strong> Los {sponsor.paymentDate} de cada mes
          </div>
          <div>
            <strong>Cuota de patrocinio:</strong> C$ {sponsor.sponsorshipFee.$numberDecimal}
          </div>
        </div>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

