'use client';

import type React from 'react';

import LowerThirdBanner from './LowerThirdBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Play, RefreshCw, Move } from 'lucide-react';
import { useBannerStore } from '@/app/store/useBannerStore';
import { ISponsor } from '@/app/types/sponsor';
import { IBannerSettings } from '@/app/types/Banner';
import { useBannerManagerStore } from '@/app/store/useBannerManagerStore';

interface IProps {
  isManagerView: boolean;
}

export default function BannerPreview({ isManagerView }: IProps) {
  const { toggleVisibility, updatePosition, bannerSelected } = useBannerStore();
  const { sponsorId, bannerSettingsId, isVisible, position } = bannerSelected;
  const { bannerManager, updateBannerManager, updatePositionBanner } = useBannerManagerStore();

  const isVisibleBanner = isManagerView ? (bannerManager?.isVisible as boolean) : isVisible;
  const positionManager = isManagerView ? bannerManager?.position : position;

  const [background, setBackground] = useState<'dark' | 'light' | 'video'>('dark');
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Efecto para mostrar brevemente un indicador de actualización cuando cambian los ajustes
  useEffect(() => {
    setShowUpdateIndicator(true);
    const timer = setTimeout(() => {
      setShowUpdateIndicator(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleVisibility = () => {
    setIsExiting(isVisibleBanner);

    setTimeout(() => {
      if (isManagerView && bannerManager) {
        updateBannerManager(bannerManager._id, { isVisible: !bannerManager.isVisible });
      } else {
        toggleVisibility(true);
      }
    }, 1000);
  };

  const handlePlayAnimation = () => {
    setIsExiting(isVisibleBanner);

    setTimeout(() => {
      toggleVisibility(false);
    }, 1000);
  };

  const backgroundStyles = {
    dark: 'bg-gradient-to-br from-slate-800 to-slate-900',
    light: 'bg-gradient-to-br from-slate-100 to-white',
    video: "bg-[url('/placeholder.svg?height=720&width=1280')] bg-cover bg-center",
  };

  // Función para iniciar el arrastre
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isVisibleBanner) return;

    // Capturar el tamaño actual del banner antes de iniciar el arrastre

    setIsDragging(true);
    e.preventDefault(); // Prevenir comportamiento predeterminado
  };

  // Función para manejar el movimiento durante el arrastre
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewContainerRef.current) return;

    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    // Calcular la posición relativa dentro del contenedor (0-100%)
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    if (isManagerView && bannerManager) {
      updatePositionBanner({ x, y });
    } else {
      updatePosition({ x, y });
    }
  };

  // Función para finalizar el arrastre
  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);

    if (!previewContainerRef.current) return;

    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    // Calcular la posición relativa dentro del contenedor (0-100%)
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    if (isManagerView && bannerManager) {
      updateBannerManager(bannerManager._id, { position: { x, y } });
    }

  };

  // Asegurarse de que el arrastre se detenga incluso si el mouse sale del contenedor
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="m22 8-6 4 6 4V8Z"></path>
            <rect x="2" y="6" width="14" height="12" rx="2" ry="2"></rect>
          </svg>
          Vista Previa
          {showUpdateIndicator && (
            <span className="inline-flex items-center ml-2 text-xs font-medium text-green-600 dark:text-green-400">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Actualizado
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>Visualiza cómo se verá tu banner</span>
          <div className="flex gap-1 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBackground('dark')}
              className={`px-2 py-1 h-auto ${background === 'dark' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 mr-1"></span>
              Oscuro
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBackground('light')}
              className={`px-2 py-1 h-auto ${background === 'light' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 mr-1"></span>
              Claro
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBackground('video')}
              className={`px-2 py-1 h-auto ${background === 'video' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
            >
              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-1"></span>
              Video
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={previewContainerRef}
          className={`relative aspect-video overflow-hidden ${backgroundStyles[background]}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseMove}
        >
          <div
            className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              left: `${positionManager?.x ?? 50}%`,
              top: `${positionManager?.y ?? 50}%`,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
              // Fijar el ancho y alto durante el arrastre si tenemos las dimensiones
              width: '80%',
              height: 'auto',
              maxWidth: 'md',
            }}
            onMouseDown={handleMouseDown}
          >
            <div className={`relative ${isDragging ? 'ring-2 ring-blue-500 ring-opacity-70' : ''}`}>
              {isDragging && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Move className="w-3 h-3 mr-1" />
                  Arrastrando
                </div>
              )}
              <LowerThirdBanner
                sponsor={sponsorId as ISponsor}
                isVisible={isVisibleBanner}
                settings={bannerSettingsId as IBannerSettings}
                isExiting={isExiting}
              />
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              onClick={handleVisibility}
              size="sm"
              variant="outline"
              className={`${
                isVisibleBanner
                  ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                  : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
              }`}
            >
              {isVisibleBanner ? (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Visible
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Oculto
                </>
              )}
            </Button>

            <Button onClick={handlePlayAnimation} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="w-4 h-4 mr-1" />
              Reproducir
            </Button>
          </div>

          {isVisibleBanner && (
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
              <div className="flex items-center">
                <Move className="w-3 h-3 mr-1.5" />
                <span>Arrastra el banner para posicionarlo</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
