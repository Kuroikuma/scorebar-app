'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { ColorPicker } from '../ui/color-picker';
import { GradientEditor } from '../ui/gradient-editor';
import { TypographyEditor } from '../ui/typography-editor';
import { IBannerSettings, GradientType } from '@/app/types/Banner';

interface ColorsTabProps {
  settings: IBannerSettings;
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>;
}

export default function ColorsTab({ settings, onUpdateSettings }: ColorsTabProps) {
  const handleStyleChange = (key: string, value: string) => {
    onUpdateSettings({
      ...settings,
      styleSettings: { ...settings.styleSettings, [key]: value },
    });
  };

  const handleGradientChange = (updates: {
    stops?: any[];
    type?: GradientType;
    angle?: number;
  }) => {
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        gradient: {
          ...(settings.styleSettings.gradient || {
            type: GradientType.linear,
            angle: 135,
            stops: [
              { color: settings.styleSettings.backgroundColor, position: 0 },
              {
                color:
                  settings.styleSettings.gradientColor ||
                  settings.styleSettings.backgroundColor,
                position: 100,
              },
            ],
          }),
          ...updates,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">
          Colores y Tipografía
        </h3>

        <div className="space-y-6">
          {/* Background Type */}
          <div className="space-y-2">
            <Label htmlFor="backgroundType" className="flex items-center gap-1">
              Tipo de fondo
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Elige entre un color sólido o un degradado para el fondo del banner</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select
              value={settings.styleSettings.backgroundType}
              onValueChange={(value) => handleStyleChange('backgroundType', value)}
            >
              <SelectTrigger id="backgroundType">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Sólido</SelectItem>
                <SelectItem value="gradient">Gradiente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Solid Color */}
          {settings.styleSettings.backgroundType === 'solid' ? (
            <div className="space-y-2">
              <Label htmlFor="backgroundColor" className="flex items-center gap-1">
                Color de fondo
              </Label>
              <div className="flex gap-3 items-center">
                <ColorPicker
                  color={settings.styleSettings.backgroundColor}
                  onChange={(color) => handleStyleChange('backgroundColor', color)}
                />
                <Input
                  type="text"
                  value={settings.styleSettings.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          ) : (
            /* Gradient Editor */
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                <h4 className="text-sm font-medium mb-3">Editor de gradiente</h4>
                <GradientEditor
                  stops={
                    settings.styleSettings.gradient?.stops || [
                      { color: settings.styleSettings.backgroundColor, position: 0 },
                      {
                        color:
                          settings.styleSettings.gradientColor ||
                          settings.styleSettings.backgroundColor,
                        position: 100,
                      },
                    ]
                  }
                  type={settings.styleSettings.gradient?.type || GradientType.linear}
                  angle={settings.styleSettings.gradient?.angle || 135}
                  onChange={handleGradientChange}
                />
              </div>
            </div>
          )}

          {/* Text Color */}
          <div className="space-y-2">
            <Label htmlFor="textColor" className="flex items-center gap-1">
              Color de texto principal
            </Label>
            <div className="flex gap-3 items-center">
              <ColorPicker
                color={settings.styleSettings.textColor}
                onChange={(color) => handleStyleChange('textColor', color)}
              />
              <Input
                type="text"
                value={settings.styleSettings.textColor}
                onChange={(e) => handleStyleChange('textColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Typography Editor */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium mb-3">Tipografía</h4>
            <TypographyEditor
              settings={
                settings.styleSettings.typography || {
                  family: settings.styleSettings.fontFamily,
                  weight: '500',
                  letterSpacing: 'normal',
                  lineHeight: '1.5',
                  useGradient: false,
                }
              }
              onChange={(typographyUpdates) => {
                onUpdateSettings({
                  ...settings,
                  styleSettings: {
                    ...settings.styleSettings,
                    fontFamily:
                      typographyUpdates.family ||
                      settings.styleSettings.typography?.family ||
                      settings.styleSettings.fontFamily,
                    typography: {
                      ...(settings.styleSettings.typography || {
                        family: settings.styleSettings.fontFamily,
                        weight: '500',
                        letterSpacing: 'normal',
                        lineHeight: '1.5',
                        useGradient: false,
                      }),
                      ...typographyUpdates,
                    },
                  },
                });
              }}
            />
          </div>

          {/* Color Preview */}
          <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium mb-3">Vista previa de colores</h4>
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-md shadow-sm"
                  style={{ backgroundColor: settings.styleSettings.backgroundColor }}
                ></div>
                <span className="text-xs mt-1">Principal</span>
              </div>

              {settings.styleSettings.backgroundType === 'gradient' && (
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-md shadow-sm"
                    style={{
                      background: settings.styleSettings.gradient
                        ? `linear-gradient(${settings.styleSettings.gradient.angle}deg, ${settings.styleSettings.gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`
                        : `linear-gradient(135deg, ${settings.styleSettings.backgroundColor}, ${settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor})`,
                    }}
                  ></div>
                  <span className="text-xs mt-1">Gradiente</span>
                </div>
              )}

              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-md shadow-sm flex items-center justify-center"
                  style={{
                    background:
                      settings.styleSettings.backgroundType === 'gradient'
                        ? settings.styleSettings.gradient
                          ? `linear-gradient(${settings.styleSettings.gradient.angle}deg, ${settings.styleSettings.gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`
                          : `linear-gradient(135deg, ${settings.styleSettings.backgroundColor}, ${settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor})`
                        : settings.styleSettings.backgroundColor,
                  }}
                >
                  <span
                    style={{
                      color: settings.styleSettings.textColor,
                      fontFamily:
                        settings.styleSettings.typography?.family ||
                        settings.styleSettings.fontFamily,
                      fontWeight: settings.styleSettings.typography?.weight || 'normal',
                    }}
                  >
                    Aa
                  </span>
                </div>
                <span className="text-xs mt-1">Combinado</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-md shadow-sm flex items-center justify-center bg-white dark:bg-slate-800">
                  <span
                    style={{
                      color: settings.styleSettings.textColor,
                      fontFamily:
                        settings.styleSettings.typography?.family ||
                        settings.styleSettings.fontFamily,
                      fontWeight: settings.styleSettings.typography?.weight || 'normal',
                    }}
                  >
                    Aa
                  </span>
                </div>
                <span className="text-xs mt-1">Texto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          Los cambios se aplican automáticamente en tiempo real
        </div>
      </div>
    </div>
  );
}
