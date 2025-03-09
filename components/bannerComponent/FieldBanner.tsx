import { EasingType, FieldAnimationType, IBannerSettings } from '@/app/types/Banner';
import { ISponsor, SponsorBanner } from '@/app/types/sponsor';
import { motion } from 'framer-motion';

interface FieldBannerProps {
  field: keyof SponsorBanner;
  index: number;
  settings: IBannerSettings;
  isAnimating: boolean;
  isExiting: boolean;
  children: React.ReactNode;
}

const fieldAnimations: Record<FieldAnimationType, any> = {
  none: {
    initial: {},
    animate: {},
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  zoomIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  typewriter: {
    initial: { width: 0, opacity: 0 },
    animate: { width: '100%', opacity: 1 },
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  blurIn: {
    initial: { filter: 'blur(8px)', opacity: 0 },
    animate: { filter: 'blur(0px)', opacity: 1 },
  },
  flipIn: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
  },
  bounceIn: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
};

// Mapeo de tipos de easing a funciones de Framer Motion
const easingFunctions: Record<EasingType, any> = {
  linear: 'linear',
  easeOut: 'easeOut',
  easeIn: 'easeIn',
  easeInOut: 'easeInOut',
  circIn: 'circIn',
  circOut: 'circOut',
  circInOut: 'circInOut',
  backIn: 'backIn',
  backOut: 'backOut',
  backInOut: 'backInOut',
  anticipate: 'anticipate',
  bounce: [0.175, 0.885, 0.32, 1.275], // Función personalizada para efecto de rebote
};

const FieldBanner = ({ field, index, settings, isAnimating, isExiting, children }: FieldBannerProps) => {
  const { displayFields, styleSettings, animationSettings } = settings;
  const { fieldAnimations: fieldAnimConfig } = animationSettings;
  const typography = styleSettings.typography || {
    family: styleSettings.fontFamily,
    weight: '500',
    letterSpacing: 'normal',
    lineHeight: '1.5',
    useGradient: false,
  };

  const getTextStyle = (field: keyof SponsorBanner, isTitle: boolean) => {
    // Check if there's a specific style for this field
    const fieldStyle = styleSettings.fieldStyles?.[field];

    const baseStyle: React.CSSProperties = {
      fontSize: fieldStyle?.fontSize || (isTitle ? `calc(${styleSettings.fontSize} * 1.2)` : styleSettings.fontSize),
      fontFamily: typography.family,
      fontWeight: fieldStyle?.fontWeight || (isTitle ? 'bold' : typography.weight),
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
        ...baseStyle,
        backgroundImage: gradientStyle,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      };
    }

    // Apply text gradient if enabled (global setting)
    else if (typography.useGradient && typography.textGradient) {
      const { angle, stops, type } = typography.textGradient;
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
        ...baseStyle,
        background: gradientStyle,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      };
    }

    // Regular text color (field-specific or global)
    return {
      ...baseStyle,
      color: fieldStyle?.color || styleSettings.textColor,
    };
  };

  const getFieldAnimation = (field: keyof SponsorBanner, index: number) => {
    if (!fieldAnimConfig.enabled || isAnimating) {
      return {};
    }

    // Si está saliendo, aplicar animación de salida
    if (isExiting) {
      const fieldConfig = fieldAnimConfig.perFieldConfig[field] || {
        type: fieldAnimConfig.defaultConfig.type,
        duration: fieldAnimConfig.defaultConfig.duration,
        delay: (displayFields.length - index - 1) * fieldAnimConfig.defaultConfig.staggerAmount,
        easing: 'easeIn' as EasingType,
      };

      const animation = fieldAnimations[fieldConfig.type];
      return {
        ...animation,
        animate: animation.initial, // Invertir la animación para la salida
        transition: {
          duration: fieldConfig.duration * 0.8, // Hacer la salida un poco más rápida
          delay: fieldConfig.delay,
          ease: easingFunctions[fieldConfig.easing] || 'easeIn',
        },
      };
    }

    // Usar configuración específica del campo si existe, o la configuración predeterminada
    const fieldConfig = fieldAnimConfig.perFieldConfig[field] || {
      type: fieldAnimConfig.defaultConfig.type,
      duration: fieldAnimConfig.defaultConfig.duration,
      delay: index * fieldAnimConfig.defaultConfig.staggerAmount,
      easing: 'easeOut' as EasingType,
    };

    const animation = fieldAnimations[fieldConfig.type];
    return {
      ...animation,
      transition: {
        duration: fieldConfig.duration,
        delay: fieldConfig.delay,
        ease: easingFunctions[fieldConfig.easing] || 'easeOut',
      },
    };
  };

  return (
    <motion.p
      key={settings._id}
      custom={index}
      className={index === 0 ? 'font-bold tracking-wide' : 'font-medium'}
      {...getFieldAnimation(field, index)}
    >
      <p style={getTextStyle(field, index === 0)}>{children}</p>
    </motion.p>
  );
};

export default FieldBanner;
