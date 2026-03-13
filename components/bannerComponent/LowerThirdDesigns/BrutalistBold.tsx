'use client';
import { IBannerSettings } from '@/app/types/Banner';
import { ISponsor } from '@/app/types/sponsor';
import type React from 'react';
import FieldBanner from '../FieldBanner';

interface BrutalistBoldProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  isAnimating: boolean;
  isExiting: boolean;
}

export default function BrutalistBold({ sponsor, settings, isAnimating, isExiting }: BrutalistBoldProps) {
  const { displayFields, styleSettings } = settings;

  // Usar colores personalizados o los predeterminados del tema Brutalist Bold
  const yellowColor = styleSettings.backgroundColor || '#f5f500'; // Amarillo brillante
  const blackColor = styleSettings.gradientColor || '#000000'; // Negro

  // Generate background style based on enhanced gradient settings
  const backgroundStyle = (() => {
    return yellowColor;
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
      className="relative overflow-hidden"
      style={{
        width: '100%',
        height: '120px',
        background: backgroundStyle,
        borderRadius: '0px',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: styleSettings.fontFamily || "'Bebas Neue', cursive",
        border: `3px solid ${blackColor}`,
        boxShadow: `6px 6px 0 ${blackColor}`,
      }}
    >
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
              width: 100,
              height: '120px',
              background: blackColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {sponsor.logo ? (
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                style={{ 
                  width: 72, 
                  height: 72, 
                  objectFit: 'contain',
                }}
              />
            ) : (
              <span style={{ fontSize: 38 }}>📚</span>
            )}
          </div>
        </FieldBanner>
      )}

      {/* Main content section */}
      <div
        style={{
          flex: 1,
          padding: '10px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: `3px solid ${blackColor}`,
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
                color: styleSettings.fieldStyles?.name?.color || blackColor,
                fontSize: styleSettings.fieldStyles?.name?.fontSize || '30px',
                fontWeight: styleSettings.fieldStyles?.name?.fontWeight || '400',
                lineHeight: 1,
                letterSpacing: '0.04em',
                fontFamily: styleSettings.fontFamily || "'Bebas Neue', cursive",
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
                color: styleSettings.fieldStyles?.owner?.color || blackColor,
                fontSize: styleSettings.fieldStyles?.owner?.fontSize || '16px',
                fontWeight: styleSettings.fieldStyles?.owner?.fontWeight || '400',
                opacity: 0.6,
                fontFamily: styleSettings.fontFamily || "'Bebas Neue', cursive",
              }}
            >
              {sponsor.owner}
            </div>
          </FieldBanner>
        )}
      </div>

      {/* Contact section */}
      {contactFields.length > 0 && (
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {contactFields.map((field) => {
            const fieldStyle = styleSettings.fieldStyles?.[field];
            
            // Default styles based on field type
            let defaultFontSize = '14px';
            let defaultFontFamily = "'DM Sans', sans-serif";
            let defaultFontWeight = '400';
            let defaultTextDecoration = 'none';
            let defaultColor = blackColor;

            if (field === 'phone') {
              defaultFontSize = '18px';
              defaultFontFamily = styleSettings.fontFamily || "'Bebas Neue', cursive";
            } else if (field === 'email') {
              defaultFontWeight = '700';
              defaultFontSize = '14px';
            } else if (field === 'link') {
              defaultFontSize = '16px';
              defaultTextDecoration = 'underline';
              defaultFontFamily = styleSettings.fontFamily || "'Bebas Neue', cursive";
            } else if (field === 'address') {
              defaultFontSize = '13px';
              defaultColor = '#333';
            }

            const textStyle: React.CSSProperties = {
              color: fieldStyle?.color || defaultColor,
              fontSize: fieldStyle?.fontSize || defaultFontSize,
              fontWeight: fieldStyle?.fontWeight || defaultFontWeight,
              fontFamily: defaultFontFamily,
              textDecoration: defaultTextDecoration,
              letterSpacing: field === 'email' ? '0.02em' : 'normal',
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
                <div style={textStyle}>{sponsor[field]}</div>
              </FieldBanner>
            );
          })}
        </div>
      )}
    </div>
  );
}