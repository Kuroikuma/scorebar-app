'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSponsorStore } from '../store/useSponsor';
import { IBanner } from '../types/Banner';
import { useAuth } from '../context/AuthContext';
import { IOrganization } from '../types/organization';
import { useBannerStore } from '../store/useBannerStore';
import { toast } from 'sonner';

interface CreateBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateBannerDialog({ open, onOpenChange }: CreateBannerDialogProps) {
  const { sponsors } = useSponsorStore();
  const { bannerSettings, createBanner } = useBannerStore();
  const { user } = useAuth();

  const __initialFormData__: IBanner = {
    _id: '',
    name: '',
    description: '',
    sponsorId: '',
    isVisible: false,
    position: { x: 50, y: 50 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    organizationId: (user?.organizationId as IOrganization)?._id || '',
    bannerSettingsId: '',
    userId: user?._id || '',
  };

  const [formData, setFormData] = useState<IBanner>(__initialFormData__);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (!formData.sponsorId) {
      newErrors.sponsorId = 'Debes seleccionar un patrocinador';
    }

    if (!formData.bannerSettingsId) {
      newErrors.bannerSettingsId = 'Debes seleccionar una configuracion de banner';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Here you would atypically save the banner data
      await createBanner(formData);
      toast.success('Banner creada exitosamente');

      // Close the dialog
      onOpenChange(false);

      // Reset form
      setFormData(__initialFormData__);
    }
  };

  useEffect(() => {
    setFormData(__initialFormData__);
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Banner</DialogTitle>
          <DialogDescription>Completa la información para crear un nuevo banner publicitario.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del Banner <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ingresa un nombre descriptivo"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el propósito o contexto del banner"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor">
              Patrocinador <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.sponsorId as string}
              onValueChange={(value) => handleInputChange('sponsorId', value)}
            >
              <SelectTrigger id="sponsor" className={errors.sponsorId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un patrocinador" />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((sponsor) => (
                  <SelectItem key={sponsor._id} value={sponsor._id}>
                    {sponsor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sponsorId && <p className="text-sm text-red-500">{errors.sponsorId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerSettingsId">
              Configuracion de banner <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.bannerSettingsId as string}
              onValueChange={(value) => handleInputChange('bannerSettingsId', value)}
            >
              <SelectTrigger id="bannerSettingsId" className={errors.bannerSettingsId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una configuracion de banner" />
              </SelectTrigger>
              <SelectContent>
                {bannerSettings.map((bannersSetting) => (
                  <SelectItem key={bannersSetting._id} value={bannersSetting._id}>
                    {bannersSetting.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bannerSettingsId && <p className="text-sm text-red-500">{errors.bannerSettingsId}</p>}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Crear Banner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
