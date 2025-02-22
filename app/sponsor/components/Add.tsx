import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ISponsor } from '@/app/types/sponsor';
import { useAuth } from '@/app/context/AuthContext';
import { Textarea } from "@/components/ui/textarea"


interface AddSponsorFormProps {
  onAddSponsor: (sponsor: ISponsor) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AddSponsorForm({ onAddSponsor, isOpen, onClose }: AddSponsorFormProps) {

  const { user } = useAuth();

  const [newSponsor, setNewSponsor] = useState<ISponsor>({
    name: '',
    logo: '/placeholder.svg?height=50&width=50',
    link: '',
    ad: '',
    phone: '',
    address: '',
    owner: '',
    email: '',
    organizationId: '',
    _id: '',
    transaction: [],
    paymentDate: 0,
    sponsorshipFee: { $numberDecimal: 0 },
    deleted_at: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSponsor((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSponsor((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewSponsor((prev) => ({ ...prev, [name]: value.split("-")[2] }));
  };

  const handleSponsorshipFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSponsor((prev) => ({ ...prev, [name]: { $numberDecimal: value } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSponsor({...newSponsor, organizationId: user?.organizationId._id as string,});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newSponsor.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Website
              </Label>
              <Input
                id="link"
                name="link"
                value={newSponsor.link}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ad" className="text-right">
                Ad
              </Label>
              <Textarea
                id="ad"
                name="ad"
                value={newSponsor.ad}
                onChange={handleTextareaChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Owner
              </Label>
              <Input
                id="owner"
                name="owner"
                value={newSponsor.owner}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newSponsor.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={newSponsor.phone}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={newSponsor.address}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="organizationId" className="text-right">
                Fecha de pago
              </Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type='date'
                onChange={handlePaymentDateChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Cuota de patrocinio
              </Label>
              <Input
                id="sponsorshipFee"
                name="sponsorshipFee"
                value={newSponsor.sponsorshipFee.$numberDecimal}
                onChange={handleSponsorshipFeeChange}
                className="col-span-3"
                type='number'
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Sponsor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
