'use client';
import { IBannerSettings } from '@/app/types/Banner';
import { ISponsor } from '@/app/types/sponsor';
import type React from 'react';
import FieldBanner from '../FieldBanner';

interface DarkLuxuryProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  isAnimating: boolean;
  isExiting: boolean;
}

export default function DarkLuxury({ sponsor, settings, isAnimating, isExiting }: DarkLuxuryProps) {
  const { displayFields, styleSettings } = settings;

  // Usar colores personalizados o los predeterminados del tema Dark Luxury
  const darkColor = styleSettings.backgroundColor || '#0d0d0d'; // Negro oscuro
  const goldColor = styleSettings.gradientColor || '#d4af37'; // Dorado


  console.log("Colores" + styleSettings.backgroundColor);
  

  // Generate background style based on enhanced gradient settings
  const backgroundStyle = (() => {
    return darkColor;
  })();

  // Separate fields by type
  const logoField = displayFields.find((field) => field === 'logo');
  const nameField = displayFields.find((field) => field === 'name');
  const ownerField = displayFields.find((field) => field === 'owner');
  const contactFields = displayFields.filter(
    (field) => field !== 'logo' && field !== 'name' && field !== 'owner'
  );

  return (
    <div
      className="relative rounded overflow-hidden"
      style={{
        width: '100%',
        height: '120px',
        background: backgroundStyle,
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: styleSettings.fontFamily || "'Cormorant Garamond', serif",
        boxShadow: `0 4px 40px rgba(0,0,0,0.6), inset 0 0 0 1px ${goldColor}4d`, // 30% opacity
      }}
    >
      {/* Gold left accent */}
      <div
        style={{
          width: '5px',
          background: `linear-gradient(180deg, ${goldColor}, ${goldColor}dd, ${goldColor})`,
          flexShrink: 0,
        }}
      />

      {/* Logo section */}
      {logoField && (
        <FieldBanner
          field={'logo'}
          index={displayFields.indexOf('logo')}
          settings={settings}
          isAnimating={isAnimating}
          isExiting={isExiting}
        >
          <div
            style={{
              width: 110,
              height: '120px',
              background: `${goldColor}0f`, // 6% opacity
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: `1px solid ${goldColor}33`, // 20% opacity
              flexShrink: 0,
            }}
          >
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                style={{ width: 60, height: 60, objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: 30 }}>📚</span>
            )}
          </div>
        </FieldBanner>
      )}

      {/* Content section */}
      <div
        style={{
          flex: 1,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {/* Name field - Large title */}
        {nameField && (
          <FieldBanner
            field={'name'}
            index={displayFields.indexOf('name')}
            settings={settings}
            isAnimating={isAnimating}
            isExiting={isExiting}
          >
            <div
              style={{
                color: styleSettings.fieldStyles?.name?.color || goldColor,
                fontSize: styleSettings.fieldStyles?.name?.fontSize || '24px',
                fontWeight: styleSettings.fieldStyles?.name?.fontWeight || '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: styleSettings.fontFamily || "'Cormorant Garamond', serif",
                lineHeight: 1.2,
              }}
            >
              {sponsor.name}
            </div>
          </FieldBanner>
        )}

        {/* Owner field - Subtitle */}
        {ownerField && (
          <FieldBanner
            field={'owner'}
            index={displayFields.indexOf('owner')}
            settings={settings}
            isAnimating={isAnimating}
            isExiting={isExiting}
          >
            <div
              style={{
                color: styleSettings.fieldStyles?.owner?.color || `${goldColor}80`, // 50% opacity
                fontSize: styleSettings.fieldStyles?.owner?.fontSize || '11px',
                fontWeight: styleSettings.fieldStyles?.owner?.fontWeight || '400',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
                marginTop: '-2px',
              }}
            >
              {sponsor.owner}
            </div>
          </FieldBanner>
        )}

        {/* Contact fields - Horizontal layout */}
        {contactFields.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 20px',
              marginTop: '6px',
              alignItems: 'center',
            }}
          >
            {contactFields.map((field) => {
              const fieldStyle = styleSettings.fieldStyles?.[field];
              
              // Default colors based on field type
              let defaultColor = 'rgba(255,255,255,0.6)';
              if (field === 'link') {
                defaultColor = goldColor;
              } else if (field === 'address') {
                defaultColor = 'rgba(255,255,255,0.4)';
              }

              const textStyle: React.CSSProperties = {
                color: fieldStyle?.color || defaultColor,
                fontSize: fieldStyle?.fontSize || '12px',
                fontWeight: fieldStyle?.fontWeight || '400',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: 'normal',
              };

              return (
                <FieldBanner
                  key={field}
                  field={field}
                  index={displayFields.indexOf(field)}
                  settings={settings}
                  isAnimating={isAnimating}
                  isExiting={isExiting}
                >
                  <span style={textStyle}>{sponsor[field]}</span>
                </FieldBanner>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
