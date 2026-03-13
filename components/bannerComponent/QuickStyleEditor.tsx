'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Sparkles,
  Type,
  Zap,
  RotateCcw,
  Wand2,
} from 'lucide-react';
import { IBannerSettings, AnimationType, EasingType, GradientType } from '@/app/types/Banner';
import { ColorPicker } from '../ui/color-picker';
import { motion } from 'framer-motion';

interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  text: string;
  category: 'professional' | 'vibrant' | 'elegant';
}

const COLOR_PRESETS: ColorPreset[] = [
  // Professional
  { name: 'Azul Corporativo', primary: '#3b82f6', secondary: '#1e40af', text: '#ffffff', category: 'professional' },
  { name: 'Gris Elegante', primary: '#64748b', secondary: '#334155', text: '#ffffff', category: 'professional' },
  { name: 'Verde Profesional', primary: '#10b981', secondary: '#047857', text: '#ffffff', category: 'professional' },
  
  // Vibrant
  { name: 'Naranja Energético', primary: '#f59e0b', secondary: '#d97706', text: '#ffffff', category: 'vibrant' },
  { name: 'Rosa Vibrante', primary: '#ec4899', secondary: '#be185d', text: '#ffffff', category: 'vibrant' },
  { name: 'Púrpura Moderno', primary: '#8b5cf6', secondary: '#6d28d9', text: '#ffffff', category: 'vibrant' },
  
  // Elegant
  { name: 'Azul Marino', primary: '#1e3a8a', secondary: '#1e40af', text: '#ffffff', category: 'elegant' },
  { name: 'Borgoña', primary: '#9f1239', secondary: '#881337', text: '#ffffff', category: 'elegant' },
  { name: 'Verde Esmeralda', primary: '#059669', secondary: '#047857', text: '#ffffff', category: 'elegant' },
];

const ANIMATION_PRESETS = [
  { value: 'fadeIn', label: 'Desvanecer', description: 'Suave y sutil', speed: 'medium' },
  { value: 'slideIn', label: 'Deslizar', description: 'Dinámico desde el lado', speed: 'medium' },
  { value: 'zoomIn', label: 'Zoom', description: 'Crece desde el centro', speed: 'fast' },
  { value: 'bounceIn', label: 'Rebotar', description: 'Efecto elástico', speed: 'medium' },
  { value: 'flipIn', label: 'Voltear', description: 'Giro 3D', speed: 'slow' },
  { value: 'expandIn', label: 'Expandir', description: 'Crece desde abajo', speed: 'medium' },
];

const SPEED_PRESETS = {
  fast: { duration: 0.3, label: 'Rápida' },
  medium: { duration: 0.5, label: 'Media' },
  slow: { duration: 0.8, label: 'Lenta' },
};

interface QuickStyleEditorProps {
  settings: IBannerSettings;
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>;
}

export default function QuickStyleEditor({ settings, onUpdateSettings }: QuickStyleEditorProps) {
  const [activeColorTab, setActiveColorTab] = useState<'presets' | 'custom'>('presets');

  const applyColorPreset = (preset: ColorPreset) => {
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        backgroundColor: preset.primary,
        gradientColor: preset.secondary,
        textColor: preset.text,
        gradient: {
          type: GradientType.linear,
          angle: 135,
          stops: [
            { color: preset.primary, position: 0 },
            { color: preset.secondary, position: 100 },
          ],
        },
      },
    });
  };

  const applyAnimationPreset = (animationType: AnimationType, speed: keyof typeof SPEED_PRESETS) => {
    const speedConfig = SPEED_PRESETS[speed];
    onUpdateSettings({
      ...settings,
      animationSettings: {
        ...settings.animationSettings,
        type: animationType,
        duration: speedConfig.duration,
        easing: 'easeOut' as EasingType,
      },
    });
  };

  const handleColorChange = (key: 'backgroundColor' | 'gradientColor' | 'textColor', color: string) => {
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        [key]: color,
      },
    });
  };

  const resetToDefaults = () => {
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        backgroundColor: '#3b82f6',
        gradientColor: '#1e40af',
        textColor: '#ffffff',
      },
      animationSettings: {
        ...settings.animationSettings,
        type: 'fadeIn' as AnimationType,
        duration: 0.5,
        easing: 'easeOut' as EasingType,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-500" />
            Personalización Rápida
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aplica estilos predefinidos o personaliza a tu gusto
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={resetToDefaults}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Restablecer
        </Button>
      </div>

      {/* Colores */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-blue-500" />
          <h4 className="font-semibold text-sm">Colores</h4>
        </div>

        <Tabs value={activeColorTab} onValueChange={(v) => setActiveColorTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Personalizado</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            {/* Presets por categoría */}
            {(['professional', 'vibrant', 'elegant'] as const).map((category) => {
              const categoryPresets = COLOR_PRESETS.filter((p) => p.category === category);
              const categoryLabels = {
                professional: 'Profesional',
                vibrant: 'Vibrante',
                elegant: 'Elegante',
              };

              return (
                <div key={category}>
                  <Label className="text-xs text-slate-500 mb-2 block">
                    {categoryLabels[category]}
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {categoryPresets.map((preset) => (
                      <motion.button
                        key={preset.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => applyColorPreset(preset)}
                        className="relative p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group"
                      >
                        <div className="flex gap-1 mb-2">
                          <div
                            className="w-full h-8 rounded"
                            style={{
                              background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                            }}
                          />
                        </div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                          {preset.name}
                        </p>
                        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm mb-2 block">Color Principal</Label>
                <div className="flex gap-3 items-center">
                  <ColorPicker
                    color={settings.styleSettings.backgroundColor}
                    onChange={(color) => handleColorChange('backgroundColor', color)}
                  />
                  <div className="flex-1 text-sm font-mono text-slate-600 dark:text-slate-400">
                    {settings.styleSettings.backgroundColor}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Color Secundario</Label>
                <div className="flex gap-3 items-center">
                  <ColorPicker
                    color={settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor}
                    onChange={(color) => handleColorChange('gradientColor', color)}
                  />
                  <div className="flex-1 text-sm font-mono text-slate-600 dark:text-slate-400">
                    {settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Color de Texto</Label>
                <div className="flex gap-3 items-center">
                  <ColorPicker
                    color={settings.styleSettings.textColor}
                    onChange={(color) => handleColorChange('textColor', color)}
                  />
                  <div className="flex-1 text-sm font-mono text-slate-600 dark:text-slate-400">
                    {settings.styleSettings.textColor}
                  </div>
                </div>
              </div>
            </div>

            {/* Vista previa */}
            <div className="p-4 rounded-lg" style={{
              background: `linear-gradient(135deg, ${settings.styleSettings.backgroundColor}, ${settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor})`,
            }}>
              <p className="text-center font-semibold" style={{ color: settings.styleSettings.textColor }}>
                Vista Previa
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Animaciones */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <h4 className="font-semibold text-sm">Animación de Entrada</h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ANIMATION_PRESETS.map((preset) => {
            const isActive = settings.animationSettings.type === preset.value;
            const speedConfig = SPEED_PRESETS[preset.speed as keyof typeof SPEED_PRESETS];

            return (
              <motion.button
                key={preset.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyAnimationPreset(preset.value as AnimationType, preset.speed as any)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-sm text-slate-800 dark:text-white">
                    {preset.label}
                  </p>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Activa
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {preset.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  {speedConfig.label}
                </Badge>
              </motion.button>
            );
          })}
        </div>

        {/* Control de velocidad */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between mb-2">
            <Label className="text-sm">Velocidad de Animación</Label>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {settings.animationSettings.duration.toFixed(1)}s
            </span>
          </div>
          <Slider
            min={0.1}
            max={1.5}
            step={0.1}
            value={[settings.animationSettings.duration]}
            onValueChange={(value) => {
              onUpdateSettings({
                ...settings,
                animationSettings: {
                  ...settings.animationSettings,
                  duration: value[0],
                },
              });
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Rápida (0.1s)</span>
            <span>Lenta (1.5s)</span>
          </div>
        </div>
      </Card>

      {/* Tip */}
      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-xs text-purple-700 dark:text-purple-300">
          ✨ <strong>Tip:</strong> Los cambios se aplican en tiempo real. Prueba diferentes combinaciones para encontrar tu estilo perfecto.
        </p>
      </div>
    </div>
  );
}
