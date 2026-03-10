'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Palette, Zap } from 'lucide-react';
import { LowerThirdDesign, IBannerSettings } from '@/app/types/Banner';
import { motion, AnimatePresence } from 'framer-motion';

interface DesignPreset {
  design: LowerThirdDesign;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'minimal';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
  };
  tags: string[];
  // Nueva configuración completa de estilo
  stylePreset?: {
    backgroundColor: string;
    gradientColor?: string;
    backgroundType: 'solid' | 'gradient';
    textColor: string;
    fontFamily: string;
    fontSize: string;
    // Estilos específicos por campo
    fieldStyles?: Record<string, {
      color?: string;
      fontSize?: string;
      fontWeight?: string;
      fontFamily?: string;
      useGradient?: boolean;
      gradient?: any;
    }>;
    // Configuraciones de tipografía global
    typography?: {
      family: string;
      weight: string;
      letterSpacing: string;
      lineHeight: string;
      useGradient: boolean;
      textGradient?: any;
    };
  };
}

const DESIGN_PRESETS: DesignPreset[] = [
  {
    design: LowerThirdDesign.classic,
    name: 'Clásico',
    description: 'Diseño tradicional y profesional',
    category: 'professional',
    preview: '/placeholder.svg?height=120&width=200&text=Classic',
    colors: { primary: '#3b82f6', secondary: '#1e40af' },
    tags: ['Profesional', 'Limpio', 'Versátil'],
    stylePreset: {
      backgroundColor: '#3b82f6',
      gradientColor: '#1e40af',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      typography: {
        family: 'Inter, sans-serif',
        weight: '500',
        letterSpacing: 'normal',
        lineHeight: '1.5',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '20px', fontWeight: 'bold', color: '#ffffff' },
        owner: { fontSize: '14px', fontWeight: 'normal', color: '#e2e8f0' },
        phone: { fontSize: '14px', color: '#ffffff' },
        email: { fontSize: '14px', color: '#ffffff' },
        link: { fontSize: '14px', color: '#bfdbfe' },
        address: { fontSize: '12px', color: '#cbd5e1' },
      },
    },
  },
  {
    design: LowerThirdDesign.modern,
    name: 'Moderno',
    description: 'Estilo contemporáneo con efectos',
    category: 'professional',
    preview: '/placeholder.svg?height=120&width=200&text=Modern',
    colors: { primary: '#8b5cf6', secondary: '#6d28d9' },
    tags: ['Elegante', 'Actual', 'Dinámico'],
    stylePreset: {
      backgroundColor: '#8b5cf6',
      gradientColor: '#6d28d9',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      typography: {
        family: 'Inter, sans-serif',
        weight: '500',
        letterSpacing: 'normal',
        lineHeight: '1.5',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '18px', fontWeight: '600', color: '#ffffff' },
        owner: { fontSize: '14px', fontWeight: 'normal', color: '#e9d5ff' },
        phone: { fontSize: '14px', color: '#ffffff' },
        email: { fontSize: '14px', color: '#ffffff' },
        link: { fontSize: '14px', color: '#c4b5fd' },
        address: { fontSize: '12px', color: '#ddd6fe' },
      },
    },
  },
  {
    design: LowerThirdDesign.minimal,
    name: 'Minimalista',
    description: 'Simple y directo al punto',
    category: 'minimal',
    preview: '/placeholder.svg?height=120&width=200&text=Minimal',
    colors: { primary: '#64748b', secondary: '#475569' },
    tags: ['Simple', 'Limpio', 'Rápido'],
    stylePreset: {
      backgroundColor: '#64748b',
      gradientColor: '#475569',
      backgroundType: 'solid',
      textColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      typography: {
        family: 'Inter, sans-serif',
        weight: '400',
        letterSpacing: 'normal',
        lineHeight: '1.4',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '16px', fontWeight: '500', color: '#ffffff' },
        owner: { fontSize: '12px', fontWeight: 'normal', color: '#cbd5e1' },
        phone: { fontSize: '12px', color: '#ffffff' },
        email: { fontSize: '12px', color: '#ffffff' },
        link: { fontSize: '12px', color: '#e2e8f0' },
        address: { fontSize: '11px', color: '#94a3b8' },
      },
    },
  },
  {
    design: LowerThirdDesign.elegant,
    name: 'Elegante',
    description: 'Sofisticado con detalles refinados',
    category: 'professional',
    preview: '/placeholder.svg?height=120&width=200&text=Elegant',
    colors: { primary: '#ec4899', secondary: '#be185d' },
    tags: ['Sofisticado', 'Premium', 'Detallado'],
    stylePreset: {
      backgroundColor: '#ec4899',
      gradientColor: '#be185d',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      typography: {
        family: 'Georgia, serif',
        weight: '500',
        letterSpacing: '0.025em',
        lineHeight: '1.5',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '22px', fontWeight: '600', color: '#ffffff', fontFamily: 'Georgia, serif' },
        owner: { fontSize: '14px', fontWeight: 'normal', color: '#fce7f3', fontFamily: 'Georgia, serif' },
        phone: { fontSize: '14px', color: '#ffffff' },
        email: { fontSize: '14px', color: '#ffffff' },
        link: { fontSize: '14px', color: '#fbcfe8' },
        address: { fontSize: '12px', color: '#f9a8d4' },
      },
    },
  },
  {
    design: LowerThirdDesign.playful,
    name: 'Divertido',
    description: 'Colorido y llamativo',
    category: 'creative',
    preview: '/placeholder.svg?height=120&width=200&text=Playful',
    colors: { primary: '#f59e0b', secondary: '#d97706' },
    tags: ['Colorido', 'Alegre', 'Creativo'],
    stylePreset: {
      backgroundColor: '#f59e0b',
      gradientColor: '#d97706',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Comic Sans MS, cursive',
      fontSize: '16px',
      typography: {
        family: 'Comic Sans MS, cursive',
        weight: '600',
        letterSpacing: 'normal',
        lineHeight: '1.4',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Comic Sans MS, cursive' },
        owner: { fontSize: '14px', fontWeight: '600', color: '#fef3c7', fontFamily: 'Comic Sans MS, cursive' },
        phone: { fontSize: '15px', color: '#ffffff', fontWeight: '600' },
        email: { fontSize: '15px', color: '#ffffff', fontWeight: '600' },
        link: { fontSize: '15px', color: '#fed7aa', fontWeight: '600' },
        address: { fontSize: '13px', color: '#fbbf24', fontWeight: '500' },
      },
    },
  },
  {
    design: LowerThirdDesign.sports,
    name: 'Deportivo',
    description: 'Energético y dinámico',
    category: 'creative',
    preview: '/placeholder.svg?height=120&width=200&text=Sports',
    colors: { primary: '#10b981', secondary: '#059669' },
    tags: ['Energético', 'Deportivo', 'Impactante'],
    stylePreset: {
      backgroundColor: '#10b981',
      gradientColor: '#059669',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '16px',
      typography: {
        family: 'Arial Black, sans-serif',
        weight: '900',
        letterSpacing: '0.05em',
        lineHeight: '1.3',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '22px', fontWeight: '900', color: '#ffffff', fontFamily: 'Arial Black, sans-serif' },
        owner: { fontSize: '14px', fontWeight: '700', color: '#d1fae5', fontFamily: 'Arial Black, sans-serif' },
        phone: { fontSize: '15px', color: '#ffffff', fontWeight: '700' },
        email: { fontSize: '15px', color: '#ffffff', fontWeight: '700' },
        link: { fontSize: '15px', color: '#a7f3d0', fontWeight: '700' },
        address: { fontSize: '13px', color: '#6ee7b7', fontWeight: '600' },
      },
    },
  },
  {
    design: LowerThirdDesign.contact,
    name: 'Contacto',
    description: 'Enfocado en información de contacto',
    category: 'professional',
    preview: '/placeholder.svg?height=120&width=200&text=Contact',
    colors: { primary: '#0ea5e9', secondary: '#0284c7' },
    tags: ['Informativo', 'Claro', 'Directo'],
    stylePreset: {
      backgroundColor: '#0ea5e9',
      gradientColor: '#0284c7',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      typography: {
        family: 'Inter, sans-serif',
        weight: '500',
        letterSpacing: 'normal',
        lineHeight: '1.4',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '18px', fontWeight: '600', color: '#ffffff' },
        owner: { fontSize: '13px', fontWeight: 'normal', color: '#e0f2fe' },
        phone: { fontSize: '16px', color: '#ffffff', fontWeight: '600' },
        email: { fontSize: '14px', color: '#ffffff', fontWeight: '500' },
        link: { fontSize: '14px', color: '#bae6fd', fontWeight: '500' },
        address: { fontSize: '12px', color: '#7dd3fc' },
      },
    },
  },
  {
    design: LowerThirdDesign.flipCard,
    name: 'Tarjeta 3D',
    description: 'Efecto 3D impresionante',
    category: 'creative',
    preview: '/placeholder.svg?height=120&width=200&text=FlipCard',
    colors: { primary: '#6366f1', secondary: '#4f46e5' },
    tags: ['3D', 'Moderno', 'Impactante'],
    stylePreset: {
      backgroundColor: '#6366f1',
      gradientColor: '#4f46e5',
      backgroundType: 'gradient',
      textColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      typography: {
        family: 'Inter, sans-serif',
        weight: '600',
        letterSpacing: '0.025em',
        lineHeight: '1.4',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '20px', fontWeight: '700', color: '#ffffff' },
        owner: { fontSize: '14px', fontWeight: '500', color: '#e0e7ff' },
        phone: { fontSize: '15px', color: '#ffffff', fontWeight: '600' },
        email: { fontSize: '15px', color: '#ffffff', fontWeight: '600' },
        link: { fontSize: '15px', color: '#c7d2fe', fontWeight: '600' },
        address: { fontSize: '13px', color: '#a5b4fc', fontWeight: '500' },
      },
    },
  },
  {
    design: LowerThirdDesign.darkLuxury,
    name: 'Dark Luxury',
    description: 'Elegancia oscura con acentos dorados',
    category: 'professional',
    preview: '/placeholder.svg?height=120&width=200&text=DarkLuxury',
    colors: { primary: '#0d0d0d', secondary: '#d4af37' },
    tags: ['Lujo', 'Elegante', 'Premium'],
    stylePreset: {
      backgroundColor: '#0d0d0d',
      gradientColor: '#d4af37',
      backgroundType: 'solid',
      textColor: '#d4af37',
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: '16px',
      typography: {
        family: "'Cormorant Garamond', serif",
        weight: '500',
        letterSpacing: '0.05em',
        lineHeight: '1.4',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '24px', fontWeight: '700', color: '#d4af37', fontFamily: "'Cormorant Garamond', serif" },
        owner: { fontSize: '11px', fontWeight: '400', color: '#d4af3780', fontFamily: "'DM Sans', sans-serif" },
        phone: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" },
        email: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif" },
        link: { fontSize: '12px', color: '#d4af37', fontFamily: "'DM Sans', sans-serif" },
        address: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif" },
      },
    },
  },
  {
    design: LowerThirdDesign.brutalistBold,
    name: 'Brutalist Bold',
    description: 'Diseño audaz con colores contrastantes',
    category: 'creative',
    preview: '/placeholder.svg?height=120&width=200&text=BrutalistBold',
    colors: { primary: '#f5f500', secondary: '#000000' },
    tags: ['Audaz', 'Contrastante', 'Moderno'],
    stylePreset: {
      backgroundColor: '#f5f500',
      gradientColor: '#000000',
      backgroundType: 'solid',
      textColor: '#000000',
      fontFamily: "'Bebas Neue', cursive",
      fontSize: '16px',
      typography: {
        family: "'Bebas Neue', cursive",
        weight: '400',
        letterSpacing: '0.04em',
        lineHeight: '1',
        useGradient: false,
      },
      fieldStyles: {
        name: { fontSize: '14px', fontWeight: '400', color: '#000000', fontFamily: "'Bebas Neue', cursive" },
        owner: { fontSize: '14px', fontWeight: '400', color: '#000000', fontFamily: "'Bebas Neue', cursive" },
        phone: { fontSize: '18px', color: '#000000', fontFamily: "'Bebas Neue', cursive" },
        email: { fontSize: '14px', color: '#000000', fontFamily: "'DM Sans', sans-serif", fontWeight: '700' },
        link: { fontSize: '16px', color: '#000000', fontFamily: "'Bebas Neue', cursive" },
        address: { fontSize: '13px', color: '#333333', fontFamily: "'DM Sans', sans-serif" },
      },
    },
  },
];

const CATEGORIES = [
  { value: 'all', label: 'Todos', icon: Sparkles },
  { value: 'professional', label: 'Profesional', icon: Zap },
  { value: 'creative', label: 'Creativo', icon: Palette },
  { value: 'minimal', label: 'Minimalista', icon: Check },
];

interface DesignSelectorProps {
  currentDesign: LowerThirdDesign;
  onDesignChange: (design: LowerThirdDesign) => void;
  onQuickCustomize?: (preset: DesignPreset) => void;
}

export default function DesignSelector({ 
  currentDesign, 
  onDesignChange,
  onQuickCustomize 
}: DesignSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredDesign, setHoveredDesign] = useState<LowerThirdDesign | null>(null);

  const filteredDesigns = useMemo(() => {
    if (selectedCategory === 'all') return DESIGN_PRESETS;
    return DESIGN_PRESETS.filter(preset => preset.category === selectedCategory);
  }, [selectedCategory]);

  const currentPreset = DESIGN_PRESETS.find(p => p.design === currentDesign);

  return (
    <div className="space-y-6">
      {/* Header con categorías */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
          Elige un Diseño
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Selecciona un estilo base y personalízalo a tu gusto
        </p>

        {/* Filtros de categoría */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={selectedCategory === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(value)}
              className="transition-all"
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de diseños */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredDesigns.map((preset, index) => {
            const isSelected = preset.design === currentDesign;
            const isHovered = preset.design === hoveredDesign;

            return (
              <motion.div
                key={preset.design}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 shadow-lg'
                      : 'hover:shadow-md hover:scale-[1.02]'
                  }`}
                  onMouseEnter={() => setHoveredDesign(preset.design)}
                  onMouseLeave={() => setHoveredDesign(null)}
                  onClick={() => onDesignChange(preset.design)}
                >
                  {/* Preview */}
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                    {/* Color indicators */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                    </div>

                    {/* Selected badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 left-2"
                      >
                        <Badge className="bg-blue-500 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Activo
                        </Badge>
                      </motion.div>
                    )}

                    {/* Preview image placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-slate-300 dark:text-slate-700">
                        {preset.name[0]}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <AnimatePresence>
                      {isHovered && !isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center"
                        >
                          <Button size="sm" variant="secondary">
                            Seleccionar
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-white mb-1">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">
                      {preset.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {preset.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs px-2 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick customize section */}
      {currentPreset && onQuickCustomize && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                ✨ Configuración Completa
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Aplica el estilo completo de "{currentPreset.name}" (colores, fuentes, tamaños y estilos por campo)
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => onQuickCustomize(currentPreset)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Aplicar Estilo
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
