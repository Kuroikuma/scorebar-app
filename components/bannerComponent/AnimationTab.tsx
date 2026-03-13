'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { IBannerSettings, AnimationType, EasingType, FieldAnimationType } from '@/app/types/Banner';

interface AnimationTabProps {
  settings: IBannerSettings;
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>;
}

// Nombres de animaciones en español
const animationNames: Record<AnimationType, string> = {
  fadeIn: 'Desvanecer',
  slideIn: 'Deslizar',
  zoomIn: 'Zoom',
  bounceIn: 'Rebotar',
  rotateIn: 'Rotar',
  slideUp: 'Deslizar arriba',
  slideDown: 'Deslizar abajo',
  flipIn: 'Voltear',
  expandIn: 'Expandir',
  blurIn: 'Desenfocar',
  flipCard: 'Voltear 3D',
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

export default function AnimationTab({ settings, onUpdateSettings }: AnimationTabProps) {
  const handleAnimationChange = (key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      animationSettings: {
        ...settings.animationSettings,
        [key]: value,
      },
    });
  };

  const handleFieldAnimationChange = (key: string, value: any) => {
    onUpdateSettings({
      ...settings,
      animationSettings: {
        ...settings.animationSettings,
        fieldAnimations: {
          ...settings.animationSettings.fieldAnimations,
          defaultConfig: {
            ...settings.animationSettings.fieldAnimations.defaultConfig,
            [key]: value,
          },
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
        Configuración de animación
      </h3>

      <Accordion type="single" collapsible defaultValue="main">
        {/* Main Animation */}
        <AccordionItem value="main">
          <AccordionTrigger className="text-base font-medium">
            Animación principal del banner
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <Label htmlFor="animationType">Tipo de animación</Label>
                <Select
                  value={settings.animationSettings.type}
                  onValueChange={(value) =>
                    handleAnimationChange('type', value as AnimationType)
                  }
                >
                  <SelectTrigger id="animationType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(animationNames).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="duration">Duración (segundos)</Label>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {settings.animationSettings.duration}s
                  </span>
                </div>
                <Slider
                  id="duration"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[settings.animationSettings.duration]}
                  onValueChange={(value) => handleAnimationChange('duration', value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Rápido (0.1s)</span>
                  <span>Lento (2.0s)</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="delay">Retraso (segundos)</Label>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {settings.animationSettings.delay}s
                  </span>
                </div>
                <Slider
                  id="delay"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[settings.animationSettings.delay]}
                  onValueChange={(value) => handleAnimationChange('delay', value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Sin retraso (0s)</span>
                  <span>Retraso máximo (1s)</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="easing">Función de aceleración</Label>
                <Select
                  value={settings.animationSettings.easing}
                  onValueChange={(value) =>
                    handleAnimationChange('easing', value as EasingType)
                  }
                >
                  <SelectTrigger id="easing">
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
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Field Animations */}
        <AccordionItem value="fields">
          <AccordionTrigger className="text-base font-medium">
            Animación de campos individuales
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fieldAnimationsEnabled" className="cursor-pointer">
                  Activar animaciones de campos
                </Label>
                <Switch
                  id="fieldAnimationsEnabled"
                  checked={settings.animationSettings.fieldAnimations.enabled}
                  onCheckedChange={(checked) =>
                    handleFieldAnimationChange('enabled', checked)
                  }
                />
              </div>

              {settings.animationSettings.fieldAnimations.enabled && (
                <>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 <strong>Tip:</strong> Personaliza la animación de cada campo
                      individualmente desde la pestaña de Campos haciendo clic en el icono de
                      animación.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                      Configuración predeterminada
                    </h4>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Esta configuración se aplicará a los campos que no tengan una
                      configuración personalizada.
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="defaultType">Tipo de animación predeterminado</Label>
                        <Select
                          value={settings.animationSettings.fieldAnimations.defaultConfig.type}
                          onValueChange={(value) =>
                            handleFieldAnimationChange('type', value as FieldAnimationType)
                          }
                        >
                          <SelectTrigger id="defaultType">
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
                          <Label htmlFor="defaultDuration">
                            Duración predeterminada (segundos)
                          </Label>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {settings.animationSettings.fieldAnimations.defaultConfig.duration}s
                          </span>
                        </div>
                        <Slider
                          id="defaultDuration"
                          min={0.1}
                          max={1}
                          step={0.1}
                          value={[
                            settings.animationSettings.fieldAnimations.defaultConfig.duration,
                          ]}
                          onValueChange={(value) =>
                            handleFieldAnimationChange('duration', value[0])
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="staggerAmount">
                            Intervalo entre campos (segundos)
                          </Label>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {settings.animationSettings.fieldAnimations.defaultConfig.staggerAmount}
                            s
                          </span>
                        </div>
                        <Slider
                          id="staggerAmount"
                          min={0}
                          max={0.5}
                          step={0.05}
                          value={[
                            settings.animationSettings.fieldAnimations.defaultConfig
                              .staggerAmount,
                          ]}
                          onValueChange={(value) =>
                            handleFieldAnimationChange('staggerAmount', value[0])
                          }
                        />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Simultáneo (0s)</span>
                          <span>Secuencial (0.5s)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Los cambios se aplican automáticamente en tiempo real
        </div>
      </div>
    </div>
  );
}
