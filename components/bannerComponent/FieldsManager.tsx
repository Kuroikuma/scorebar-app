'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Eye,
  Palette,
  Type,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { SponsorBanner, ISponsor } from '@/app/types/sponsor';
import { IBannerSettings } from '@/app/types/Banner';
import { motion, AnimatePresence } from 'framer-motion';
import FieldEditorDialog from './FieldEditorDialog';

interface FieldConfig {
  key: keyof SponsorBanner;
  label: string;
  description: string;
  icon: string;
  category: 'essential' | 'contact' | 'extra';
}

const FIELD_CONFIGS: FieldConfig[] = [
  {
    key: 'name',
    label: 'Nombre',
    description: 'Nombre del sponsor o empresa',
    icon: '🏢',
    category: 'essential',
  },
  {
    key: 'logo',
    label: 'Logo',
    description: 'Logotipo o imagen',
    icon: '🖼️',
    category: 'essential',
  },
  {
    key: 'ad',
    label: 'Anuncio',
    description: 'Texto publicitario o eslogan',
    icon: '💬',
    category: 'essential',
  },
  {
    key: 'phone',
    label: 'Teléfono',
    description: 'Número de contacto',
    icon: '📞',
    category: 'contact',
  },
  {
    key: 'email',
    label: 'Correo',
    description: 'Email de contacto',
    icon: '📧',
    category: 'contact',
  },
  {
    key: 'link',
    label: 'Sitio Web',
    description: 'URL del sitio web',
    icon: '🌐',
    category: 'contact',
  },
  {
    key: 'address',
    label: 'Dirección',
    description: 'Ubicación física',
    icon: '📍',
    category: 'extra',
  },
  {
    key: 'owner',
    label: 'Propietario',
    description: 'Nombre del responsable',
    icon: '👤',
    category: 'extra',
  },
];

const CATEGORY_LABELS = {
  essential: { label: 'Esenciales', color: 'blue' },
  contact: { label: 'Contacto', color: 'green' },
  extra: { label: 'Adicionales', color: 'purple' },
};

interface FieldsManagerProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>;
}

export default function FieldsManager({
  sponsor,
  settings,
  onUpdateSettings,
}: FieldsManagerProps) {
  const [selectedField, setSelectedField] = useState<keyof SponsorBanner | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['essential', 'contact'])
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const displayFields = settings.displayFields;

  // Agrupar campos por categoría
  const fieldsByCategory = useMemo(() => {
    const grouped: Record<string, FieldConfig[]> = {
      essential: [],
      contact: [],
      extra: [],
    };

    FIELD_CONFIGS.forEach((field) => {
      grouped[field.category].push(field);
    });

    return grouped;
  }, []);

  const handleFieldToggle = (field: keyof SponsorBanner) => {
    const newFields = displayFields.includes(field)
      ? displayFields.filter((f) => f !== field)
      : [...displayFields, field];

    onUpdateSettings({
      ...settings,
      displayFields: newFields,
    });
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleEditField = (field: keyof SponsorBanner) => {
    setSelectedField(field);
    setDialogOpen(true);
  };

  const visibleCount = displayFields.length;
  const totalCount = FIELD_CONFIGS.length;

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Campos del Banner
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {visibleCount} de {totalCount} campos visibles
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Eye className="w-3 h-3 mr-1" />
          {visibleCount}
        </Badge>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const allFields = FIELD_CONFIGS.map((f) => f.key);
            onUpdateSettings({ ...settings, displayFields: allFields });
          }}
        >
          Mostrar Todos
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const essentialFields = FIELD_CONFIGS.filter(
              (f) => f.category === 'essential'
            ).map((f) => f.key);
            onUpdateSettings({ ...settings, displayFields: essentialFields });
          }}
        >
          Solo Esenciales
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            onUpdateSettings({ ...settings, displayFields: [] });
          }}
        >
          Limpiar
        </Button>
      </div>

      {/* Campos agrupados por categoría */}
      <div className="space-y-3">
        {Object.entries(fieldsByCategory).map(([category, fields]) => {
          const categoryInfo = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS];
          const isExpanded = expandedCategories.has(category);
          const visibleInCategory = fields.filter((f) =>
            displayFields.includes(f.key)
          ).length;

          return (
            <Card key={category} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full bg-${categoryInfo.color}-500`}
                  />
                  <div className="text-left">
                    <h4 className="font-medium text-sm text-slate-800 dark:text-white">
                      {categoryInfo.label}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {visibleInCategory} de {fields.length} activos
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="p-4 space-y-2">
                      {fields.map((field) => {
                        const isVisible = displayFields.includes(field.key);
                        const hasCustomStyle =
                          settings.styleSettings.fieldStyles?.[field.key];

                        return (
                          <div
                            key={field.key}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                              isVisible
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span className="text-2xl">{field.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Label className="font-medium text-sm cursor-pointer">
                                  {field.label}
                                </Label>
                                {hasCustomStyle && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Palette className="w-3 h-3 mr-1" />
                                    Personalizado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {sponsor[field.key] || field.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isVisible && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditField(field.key)}
                                    className="h-8 w-8 p-0"
                                    title="Editar estilo"
                                  >
                                    <Palette className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditField(field.key)}
                                    className="h-8 w-8 p-0"
                                    title="Editar animación"
                                  >
                                    <Sparkles className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Switch
                                checked={isVisible}
                                onCheckedChange={() => handleFieldToggle(field.key)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Field Editor Dialog */}
      {selectedField && (
        <FieldEditorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          fieldKey={selectedField}
          fieldLabel={FIELD_CONFIGS.find((f) => f.key === selectedField)?.label || ''}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          isFieldVisible={displayFields.includes(selectedField)}
        />
      )}

      {/* Tip */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>Tip:</strong> Activa solo los campos necesarios para un banner más limpio y profesional
        </p>
      </div>
    </div>
  );
}
