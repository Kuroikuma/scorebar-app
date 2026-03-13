'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Palette, Sparkles } from 'lucide-react';
import { FieldStyleEditor } from '../ui/field-style-editor';
import { SponsorBanner } from '@/app/types/sponsor';
import { IBannerSettings, FieldAnimationType, EasingType, FieldAnimationConfig } from '@/app/types/Banner';

interface FieldEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldKey: keyof SponsorBanner;
  fieldLabel: string;
  settings: IBannerSettings;
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>;
  isFieldVisible: boolean;
}

// Nombres de animaciones de campo en español
const fieldAnimationNames: Record<FieldAnimationType, string> = {
  none: 'Ninguna',
  fadeIn: 'Desvanecer',
  slideIn: 'Deslizar',
  typewriter: 'Máquina de escribir',
  scaleIn: 'Escalar',
  blurIn: 'Desenfocar',
  flipIn: 'Voltear',
  bounceIn: 'Rebotar',
  zoomIn: 'Zoom',
};

// Nombres de easing en español
const easingNames: Record<EasingType, string> = {
  linear: 'Lineal',
  easeOut: 'Suavizado final',
  easeIn: 'Suavizado inicial',
  easeInOut: 'Suavizado completo',
  circIn: 'Circular inicial',
  circOut: 'Circular final',
  circInOut: 'Circular completo',
  backIn: 'Retroceso inicial',
  backOut: 'Retroceso final',
  backInOut: 'Retroceso completo',
  anticipate: 'Anticipado',
  bounce: 'Rebote',
};

export default function FieldEditorDialog({
  open,
  onOpenChange,
  fieldKey,
  fieldLabel,
  settings,
  onUpdateSettings,
  isFieldVisible,
}: FieldEditorDialogProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'animation'>('style');

  const handleFieldStyleChange = (fieldStyleUpdates: any) => {
    const currentFieldStyles = settings.styleSettings.fieldStyles || {};

    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        fieldStyles: {
          ...currentFieldStyles,
          [fieldKey]: {
            ...(currentFieldStyles[fieldKey] || {}),
            ...fieldStyleUpdates,
          },
        },
      },
    });
  };

  const handleFieldStyleReset = () => {
    const newFieldStyles = { ...settings.styleSettings.fieldStyles };
    if (newFieldStyles && newFieldStyles[fieldKey]) {
      delete newFieldStyles[fieldKey];
    }

    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        fieldStyles: newFieldStyles,
      },
    });
  };

  const handlePerFieldAnimationChange = (key: keyof FieldAnimationConfig, value: any) => {
    onUpdateSettings({
      ...settings,
      animationSettings: {
        ...settings.animationSettings,
        fieldAnimations: {
          ...settings.animationSettings.fieldAnimations,
          perFieldConfig: {
            ...settings.animationSettings.fieldAnimations.perFieldConfig,
            [fieldKey]: {
              ...settings.animationSettings.fieldAnimations.perFieldConfig[fieldKey],
              [key]: value,
            },
          },
        },
      },
    });
  };

  const handleResetFieldAnimation = () => {
    const newPerFieldConfig = { ...settings.animationSettings.fieldAnimations.perFieldConfig };
    if (newPerFieldConfig[fieldKey]) {
      delete newPerFieldConfig[fieldKey];
    }

    onUpdateSettings({
      ...settings,
      animationSettings: {
        ...settings.animationSettings,
        fieldAnimations: {
          ...settings.animationSettings.fieldAnimations,
          perFieldConfig: newPerFieldConfig,
        },
      },
    });
  };

  const fieldAnimationConfig = settings.animationSettings.fieldAnimations.perFieldConfig[fieldKey];
  const hasCustomStyle = !!settings.styleSettings.fieldStyles?.[fieldKey];
  const hasCustomAnimation = !!fieldAnimationConfig;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Personalizar Campo: {fieldLabel}
          </DialogTitle>
          <DialogDescription>
            Ajusta el estilo y animación específicos para este campo
          </DialogDescription>
        </DialogHeader>

        {!isFieldVisible && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              ⚠️ Este campo está oculto actualmente. Actívalo en la pestaña de Campos para verlo en el banner.
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'style' | 'animation')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Estilo
              {hasCustomStyle && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  ●
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Animación
              {hasCustomAnimation && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  ●
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Personaliza colores, fuentes y gradientes
              </p>
              {hasCustomStyle && (
                <Button size="sm" variant="outline" onClick={handleFieldStyleReset}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restablecer
                </Button>
              )}
            </div>

            <FieldStyleEditor
              fieldName={fieldLabel}
              settings={settings.styleSettings.fieldStyles?.[fieldKey] || {}}
              onChange={handleFieldStyleChange}
              onReset={handleFieldStyleReset}
              globalTextColor={settings.styleSettings.textColor}
            />
          </TabsContent>

          <TabsContent value="animation" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Configura la animación de entrada del campo
              </p>
              {hasCustomAnimation && (
                <Button size="sm" variant="outline" onClick={handleResetFieldAnimation}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restablecer
                </Button>
              )}
            </div>

            {!settings.animationSettings.fieldAnimations.enabled && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Las animaciones de campos están desactivadas. Actívalas en la pestaña de Animación para ver los efectos.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="fieldType">Tipo de animación</Label>
                <Select
                  value={fieldAnimationConfig?.type || 'none'}
                  onValueChange={(value) =>
                    handlePerFieldAnimationChange('type', value as FieldAnimationType)
                  }
                >
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fieldAnimationNames).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="fieldDuration">Duración (segundos)</Label>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {fieldAnimationConfig?.duration || 0.3}s
                  </span>
                </div>
                <Slider
                  id="fieldDuration"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[fieldAnimationConfig?.duration || 0.3]}
                  onValueChange={(value) => handlePerFieldAnimationChange('duration', value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Rápido (0.1s)</span>
                  <span>Lento (1.0s)</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="fieldDelay">Retraso (segundos)</Label>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {fieldAnimationConfig?.delay || 0}s
                  </span>
                </div>
                <Slider
                  id="fieldDelay"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[fieldAnimationConfig?.delay || 0]}
                  onValueChange={(value) => handlePerFieldAnimationChange('delay', value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Sin retraso (0s)</span>
                  <span>Retraso máximo (1s)</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="fieldEasing">Función de aceleración</Label>
                <Select
                  value={fieldAnimationConfig?.easing || 'easeOut'}
                  onValueChange={(value) =>
                    handlePerFieldAnimationChange('easing', value as EasingType)
                  }
                >
                  <SelectTrigger id="fieldEasing">
                    <SelectValue placeholder="Selecciona una función" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(easingNames).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium mb-2">Configuración actual</h4>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Animación:</span>
                    <span className="font-medium">
                      {fieldAnimationNames[fieldAnimationConfig?.type || 'none']}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duración:</span>
                    <span className="font-medium">{fieldAnimationConfig?.duration || 0.3}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retraso:</span>
                    <span className="font-medium">{fieldAnimationConfig?.delay || 0}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aceleración:</span>
                    <span className="font-medium">
                      {easingNames[fieldAnimationConfig?.easing || 'easeOut']}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
