'use client';
import { IBannerSettings } from '@/app/types/Banner';
import { ISponsor, SponsorBanner } from '@/app/types/sponsor';
import { motion } from 'framer-motion';

interface FlipCardProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  isAnimating?: boolean;
  isExiting?: boolean;
}

export default function FlipCard({ sponsor, settings, isAnimating = false, isExiting = false }: FlipCardProps) {
  const { displayFields, styleSettings } = settings;

  const backgroundStyle =
    styleSettings.backgroundType === 'gradient'
      ? `linear-gradient(135deg, ${styleSettings.backgroundColor}, ${
          styleSettings.gradientColor || styleSettings.backgroundColor
        })`
      : styleSettings.backgroundColor;

  // Variantes para la animación de la tarjeta
  const cardVariants = {
    initial: {
      rotateY: 90,
      opacity: 0,
      transformPerspective: 1000,
    },
    animate: {
      rotateY: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: isExiting ? 1 : 0,
      },
    },
    exit: {
      rotateY: -90,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: 'easeIn',
        delay: isExiting ? 1 : 0,
      },
    },
  };

  // Variantes para los elementos internos
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: isExiting ? 0 : 0.6,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        delay: isExiting ? 0 : 0.6,
        duration: 0.2,
      },
    },
  };

  return (
    <div className="perspective-1000">
      <motion.div
        key={settings._id}
        className="relative w-full"
        initial={{
          rotateY: 90,
          opacity: 0,
          transformPerspective: 1000,
        }}
        animate={{
          rotateY: 0,
          opacity: 1,
        }}
        exit={{
          rotateY: -90,
          opacity: 0,
        }}
        transition={{ duration: 1, delay: isExiting ? 1 : 0 }}
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
      >
        {/* Cara frontal */}
        <div
          className="rounded-xl shadow-xl overflow-hidden"
          style={{
            background: backgroundStyle,
            fontFamily: styleSettings.fontFamily,
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="p-5">
            <div className="flex items-start">
              {displayFields.includes('logo') && sponsor.logo && (
                <div className="mr-4 rounded-lg overflow-hidden shadow-lg transform -rotate-3">
                  <img
                    src={sponsor.logo || '/placeholder.svg?height=64&width=64'}
                    alt={sponsor.name}
                    className="w-16 h-16 object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                {displayFields.filter((field) => field !== 'logo').map((field, index) => (
                  <motion.div
                    key={settings._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -20,
                    }}
                    transition={{ duration: 0.4, delay: isExiting ? 0 : 0.6 }}
                  >
                    <p
                      className={index === 0 ? 'font-bold text-xl' : 'font-medium'}
                      style={{
                        color: styleSettings.textColor,
                        fontSize: index === 0 ? `calc(${styleSettings.fontSize} * 1.3)` : styleSettings.fontSize,
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {sponsor[field]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Efecto de brillo 3D */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Borde brillante */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)',
            }}
          />
        </div>
      </motion.div>

      {/* Sombra 3D */}
      <motion.div
        key={settings._id}
        className="w-full h-4 mx-auto mt-2 rounded-full"
        style={{
          background: 'rgba(0,0,0,0.2)',
          filter: 'blur(8px)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: isExiting ? 0 : 0.5,
          scale: isExiting ? 0.6 : 1,
          transition: { duration: 0.5 },
        }}
      />
    </div>
  );
}
