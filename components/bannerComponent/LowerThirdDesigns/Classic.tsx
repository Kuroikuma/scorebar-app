'use client';
import { IBannerSettings } from '@/app/types/Banner';
import { ISponsor, SponsorBanner } from '@/app/types/sponsor';
import type React from 'react';
import FieldBanner from '../FieldBanner';

interface ClassicProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  isAnimating?: boolean;
  isExiting?: boolean;
}

export default function Classic({ sponsor, settings, isAnimating = false, isExiting = false }: ClassicProps) {
  const { displayFields, styleSettings } = settings;

  const backgroundStyle =
    styleSettings.backgroundType === 'gradient'
      ? `linear-gradient(to right, ${styleSettings.backgroundColor}, ${
          styleSettings.gradientColor || styleSettings.backgroundColor
        })`
      : styleSettings.backgroundColor;

  // Función para obtener el estilo de texto para un campo específico
  const getTextStyle = (field: keyof SponsorBanner, isTitle: boolean) => {
    // Check if there's a specific style for this field
    const fieldStyle = styleSettings.fieldStyles?.[field];

    const style: React.CSSProperties = {
      fontSize: fieldStyle?.fontSize || (isTitle ? `calc(${styleSettings.fontSize} * 1.2)` : styleSettings.fontSize),
      fontWeight: fieldStyle?.fontWeight || (isTitle ? 'bold' : 'normal'),
    };

    // Apply field-specific gradient if enabled
    if (fieldStyle?.useGradient && fieldStyle.gradient) {
      const { angle, stops, type } = fieldStyle.gradient;
      let gradientStyle: string;

      if (type === 'linear') {
        gradientStyle = `linear-gradient(${angle}deg, ${stops
          .map((stop) => `${stop.color} ${stop.position}%`)
          .join(', ')})`;
      } else if (type === 'radial') {
        gradientStyle = `radial-gradient(circle, ${stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;
      } else {
        gradientStyle = `conic-gradient(from ${angle}deg, ${stops
          .map((stop) => `${stop.color} ${stop.position}%`)
          .join(', ')})`;
      }

      return {
        ...style,
        background: gradientStyle,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      };
    }

    // Regular text color (field-specific or global)
    return {
      ...style,
      color: fieldStyle?.color || styleSettings.textColor,
    };
  };

  return (
    <div
      className="rounded-lg shadow-xl overflow-hidden"
      style={{
        background: backgroundStyle,
        fontFamily: styleSettings.fontFamily,
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
            <div className="mr-4 rounded-lg overflow-hidden shadow-lg">
              <img
                src={sponsor.logo || '/placeholder.svg?height=64&width=64'}
                alt={sponsor.name}
                className="w-16 h-16 object-contain"
              />
            </div>
          </FieldBanner>
        )}
        <div className="space-y-1">
          {displayFields
            .filter((field) => field !== 'logo')
            .map((field, index) => (
              <FieldBanner
                field={field}
                index={index}
                settings={settings}
                isAnimating={isAnimating}
                isExiting={isExiting}
              >
                {sponsor[field]}
              </FieldBanner>
            ))}
        </div>
      </div>
    </div>
  );
}
