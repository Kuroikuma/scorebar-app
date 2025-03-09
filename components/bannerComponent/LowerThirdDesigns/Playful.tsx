'use client';

import { IBannerSettings } from '@/app/types/Banner';
import { ISponsor } from '@/app/types/sponsor';
import FieldBanner from '../FieldBanner';

interface PlayfulProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  isAnimating?: boolean;
  isExiting?: boolean;
}

export default function Playful({ sponsor, settings, isAnimating = false, isExiting = false }: PlayfulProps) {
  const { displayFields, styleSettings } = settings;

  const backgroundStyle =
    styleSettings.backgroundType === 'gradient'
      ? `linear-gradient(45deg, ${styleSettings.backgroundColor}, ${
          styleSettings.gradientColor || styleSettings.backgroundColor
        })`
      : styleSettings.backgroundColor;

  return (
    <div
      className="rounded-3xl shadow-xl overflow-hidden transform -rotate-1"
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
            <div className="mr-4 rounded-full overflow-hidden border-4 border-white/30 shadow-lg transform rotate-3">
              <img
                src={sponsor.logo || '/placeholder.svg?height=64&width=64'}
                alt={sponsor.name}
                className="w-16 h-16 object-contain"
              />
            </div>
          </FieldBanner>
        )}
        <div>
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
