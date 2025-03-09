'use client';
import { IBannerSettings } from '@/app/types/Banner';
import { ISponsor } from '@/app/types/sponsor';
import { motion } from 'framer-motion';
import type React from 'react';
import FieldBanner from '../FieldBanner';

interface ModernProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  isAnimating: boolean;
  isExiting: boolean;
}

export default function Modern({ sponsor, settings, isAnimating, isExiting }: ModernProps) {
  const { displayFields, styleSettings } = settings;

  // Generate background style based on enhanced gradient settings
  const backgroundStyle = (() => {
    if (styleSettings.backgroundType === 'gradient') {
      if (styleSettings.gradient) {
        const { type, angle, stops } = styleSettings.gradient;
        if (type === 'linear') {
          return `linear-gradient(${angle}deg, ${stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;
        } else if (type === 'radial') {
          return `radial-gradient(circle, ${stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;
        } else if (type === 'conic') {
          return `conic-gradient(from ${angle}deg, ${stops
            .map((stop) => `${stop.color} ${stop.position}%`)
            .join(', ')})`;
        }
      }
      // Fallback to legacy gradient
      return `linear-gradient(135deg, ${styleSettings.backgroundColor}, ${
        styleSettings.gradientColor || styleSettings.backgroundColor
      })`;
    }
    return styleSettings.backgroundColor;
  })();

  return (
    <div className="relative">
      {/* Efecto de resplandor */}
      <div
        className="absolute inset-0 blur-xl opacity-30 rounded-xl"
        style={{
          background: backgroundStyle,
          transform: 'scale(0.85) translateY(20%)',
        }}
      ></div>

      {/* Contenedor principal */}
      <div
        className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/10"
        style={{
          background: backgroundStyle,
        }}
      >
        <div className="flex items-center p-4">
          {displayFields.some((field) => field === 'logo') && (
            <FieldBanner
              field={'logo'}
              index={displayFields.indexOf('logo')}
              settings={settings}
              isAnimating={isAnimating}
              isExiting={isExiting}
            >
              <div className="mr-4 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <img
                  src={sponsor.logo || '/placeholder.svg?height=64&width=64'}
                  alt={sponsor.name}
                  className="w-14 h-14 object-cover"
                />
              </div>
            </FieldBanner>
          )}
          <div className="space-y-0.5">
            {displayFields.filter((field) => field !== 'logo').map((field, index) => {
              return (
                <div key={field} className="relative overflow-hidden">
                  <FieldBanner
                    field={field}
                    index={index}
                    settings={settings}
                    isAnimating={isAnimating}
                    isExiting={isExiting}
                  >
                    {sponsor[field]}
                  </FieldBanner>
                </div>
              );
            })}
          </div>
        </div>

        {/* Elemento decorativo */}
        <div
          className="absolute top-0 right-0 h-full w-16"
          style={{
            background:
              styleSettings.backgroundType === 'gradient'
                ? styleSettings.gradient
                  ? `${
                      styleSettings.gradient.type === 'linear'
                        ? 'linear-gradient'
                        : styleSettings.gradient.type === 'radial'
                        ? 'radial-gradient'
                        : 'conic-gradient'
                    }(${styleSettings.gradient.stops[styleSettings.gradient.stops.length - 1].color})`
                  : styleSettings.gradientColor || styleSettings.backgroundColor
                : styleSettings.backgroundColor,
            opacity: 0.6,
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          }}
        ></div>
      </div>
    </div>
  );
}
