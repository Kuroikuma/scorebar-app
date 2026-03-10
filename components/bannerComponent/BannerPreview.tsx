'use client';

import type React from 'react';
import LowerThirdBanner from './LowerThirdBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef, useCallback } from 'react';
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

  // Validación de datos antes de usar
  const isVisibleBanner = isManagerView 
    ? (bannerManager?.isVisible ?? false) 
    : (isVisible ?? false);
  const positionManager = isManagerView 
    ? (bannerManager?.position ?? { x: 50, y: 50 }) 
    : (position ?? { x: 50, y: 50 });

  const [background, setBackground] = useState<'dark' | 'light' | 'video'>('dark');
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  
  // Refs para manejar timeouts y evitar race conditions
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateIndicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragPositionRef = useRef({ x: positionManager.x, y: positionManager.y });

  // Cleanup de todos los timeouts al desmontar
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
      if (updateIndicatorTimeoutRef.current) clearTimeout(updateIndicatorTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setShowUpdateIndicator(true);
    if (updateIndicatorTimeoutRef.current) {
      clearTimeout(updateIndicatorTimeoutRef.current);
    }
    updateIndicatorTimeoutRef.current = setTimeout(() => {
      setShowUpdateIndicator(false);
    }, 500);
  }, [bannerSelected, bannerManager]);

  const handleVisibility = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    
    // Limpiar timeouts previos
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
    
    // Solo iniciar animación de salida si está visible
    if (isVisibleBanner) {
      setIsExiting(true);
      
      exitTimeoutRef.current = setTimeout(() => {
        setIsExiting(false);
      }, 1200); // Dar tiempo extra para la animación
    }
    
    visibilityTimeoutRef.current = setTimeout(() => {
      if (isManagerView && bannerManager) {
        updateBannerManager(bannerManager._id, { isVisible: !bannerManager.isVisible });
      } else {
        toggleVisibility(true);
      }
    }, isVisibleBanner ? 1000 : 0); // Sin delay si está oculto
  }, [isVisibleBanner, isManagerView, bannerManager, updateBannerManager, toggleVisibility]);

  const handlePlayAnimation = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    
    // Limpiar timeouts previos
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
    
    if (isVisibleBanner) {
      setIsExiting(true);
      
      exitTimeoutRef.current = setTimeout(() => {
        setIsExiting(false);
      }, 1200);
      
      visibilityTimeoutRef.current = setTimeout(() => {
        toggleVisibility(false);
      }, 1000);
    }
  }, [isVisibleBanner, toggleVisibility]);

  const backgroundStyles = {
    dark: 'bg-gradient-to-br from-slate-800 to-slate-900',
    light: 'bg-gradient-to-br from-slate-100 to-white',
    video: "bg-[url('/placeholder.svg?height=720&width=1280')] bg-cover bg-center",
  };

  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!isVisibleBanner) return;
    setIsDragging(true);
    dragPositionRef.current = { x: positionManager.x, y: positionManager.y };
  }, [isVisibleBanner, positionManager]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !previewContainerRef.current) return;

    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    // Actualizar ref para evitar re-renders
    dragPositionRef.current = { x, y };

    // Actualizar estado local (optimista)
    if (isManagerView && bannerManager) {
      updatePositionBanner({ x, y });
    } else {
      updatePosition({ x, y });
    }
  }, [isDragging, isManagerView, bannerManager, updatePositionBanner, updatePosition]);

  const handleDragEnd = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!previewContainerRef.current) return;
    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    // Persistir en el backend solo al finalizar el drag
    if (isManagerView && bannerManager) {
      updateBannerManager(bannerManager._id, { position: { x, y } });
    } else {
      // Para el modo normal, también persistir
      updatePosition({ x, y });
    }
  }, [isDragging, isManagerView, bannerManager, updateBannerManager, updatePosition]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
  
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);
  

  // Validar que tenemos los datos necesarios
  if (!sponsorId || !bannerSettingsId) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
            Vista Previa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <p>No hay datos de banner disponibles</p>
            <p className="text-sm mt-2">Selecciona un sponsor y configura el banner para ver la vista previa</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extraer sponsor y settings de forma segura
  const sponsor = typeof sponsorId === 'string' ? null : sponsorId;
  const settings = typeof bannerSettingsId === 'string' ? null : bannerSettingsId;

  if (!sponsor || !settings) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white">
            Vista Previa
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p>Cargando datos del banner...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center justify-between gap-2">
          Vista Previa

          <div className="flex gap-2">
            <Button 
              onClick={handleVisibility} 
              size="sm" 
              variant="outline"
              disabled={isExiting}
            >
              {isVisibleBanner ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
              {isVisibleBanner ? 'Visible' : 'Oculto'}
            </Button>

            <Button 
              onClick={handlePlayAnimation} 
              size="sm" 
              className="bg-blue-600 text-white"
              disabled={!isVisibleBanner || isExiting}
            >
              <Play className="w-4 h-4 mr-1" />
              Reproducir
            </Button>
          </div>
          {showUpdateIndicator && (
            <span className="inline-flex items-center ml-2 text-xs font-medium text-green-600 dark:text-green-400">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Actualizado
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={previewContainerRef}
          className={`relative aspect-video overflow-hidden ${backgroundStyles[background]}`}
          onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
          onMouseUp={(e) => handleDragEnd(e.clientX, e.clientY)}
          onTouchMove={(e) => e.touches[0] && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={(e) => e.changedTouches[0] && handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
        >
          <div
            className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${!isVisibleBanner ? 'pointer-events-none' : ''}`}
            style={{
              left: `${positionManager.x}%`,
              top: `${positionManager.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 'auto',
              maxWidth: 'md',
              touchAction: 'none',
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleDragStart(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              if (e.touches[0]) {
                handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
          >
            <LowerThirdBanner
              sponsor={sponsor}
              isVisible={isVisibleBanner}
              settings={settings}
              isExiting={isExiting}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
