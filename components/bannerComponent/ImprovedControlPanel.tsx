'use client';

import { ISponsor } from '@/app/types/sponsor';
import { IBannerSettings, LowerThirdDesign } from '@/app/types/Banner';
import DesignSelector from './DesignSelector';
import FieldsManager from './FieldsManager';
import ColorsTab from './ColorsTab';
import AnimationTab from './AnimationTab';
import SponsorSelector from './SponsorSelector';

interface ImprovedControlPanelProps {
  sponsor: ISponsor;
  settings: IBannerSettings;
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>;
  activeTab: string;
}

export default function ImprovedControlPanel({
  sponsor,
  settings,
  onUpdateSettings,
  activeTab,
}: ImprovedControlPanelProps) {
  const handleDesignChange = (design: LowerThirdDesign) => {
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        design,
      },
    });
  };

  const handleQuickCustomize = (preset: any) => {
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        backgroundColor: preset.colors.primary,
        gradientColor: preset.colors.secondary,
        gradient: {
          type: 'linear' as any,
          angle: 135,
          stops: [
            { color: preset.colors.primary, position: 0 },
            { color: preset.colors.secondary, position: 100 },
          ],
        },
      },
    });
  };

  // Renderizar según el tab activo
  switch (activeTab) {
    case 'sponsors':
      return (
        <div className="space-y-6">
          <SponsorSelector />
        </div>
      );

    case 'design':
      return (
        <DesignSelector
          currentDesign={settings.styleSettings.design}
          onDesignChange={handleDesignChange}
          onQuickCustomize={handleQuickCustomize}
        />
      );

    case 'colors':
      return <ColorsTab settings={settings} onUpdateSettings={onUpdateSettings} />;

    case 'animation':
      return <AnimationTab settings={settings} onUpdateSettings={onUpdateSettings} />;

    case 'fields':
      return (
        <FieldsManager
          sponsor={sponsor}
          settings={settings}
          onUpdateSettings={onUpdateSettings}
        />
      );

    default:
      return (
        <div className="text-center py-8 text-slate-500">
          Selecciona una pestaña para comenzar
        </div>
      );
  }
}
