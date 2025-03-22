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

  useEffect(() => {
    setShowUpdateIndicator(true);
    const timer = setTimeout(() => {
      setShowUpdateIndicator(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleVisibility = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    
    
    setIsExiting(isVisibleBanner);
    setTimeout(() => {
      if (isManagerView && bannerManager) {
        updateBannerManager(bannerManager._id, { isVisible: !bannerManager.isVisible });
      } else {
        toggleVisibility(true);
      }
    }, 1000);
  };

  const handlePlayAnimation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
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

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!isVisibleBanner) return;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !previewContainerRef.current) return;

    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    if (isManagerView && bannerManager) {
      updatePositionBanner({ x, y });
    } else {
      updatePosition({ x, y });
    }
  };

  const handleDragEnd = (clientX: number, clientY: number) => {
    setIsDragging(false);

    if (!previewContainerRef.current) return;
    const container = previewContainerRef.current;
    const rect = container.getBoundingClientRect();

    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    if (isManagerView && bannerManager) {
      updateBannerManager(bannerManager._id, { position: { x, y } });
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center justify-between gap-2">
          Vista Previa

          <div className="flex gap-2">
            <Button onClick={handleVisibility} size="sm" variant="outline">
              {isVisibleBanner ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
              {isVisibleBanner ? 'Visible' : 'Oculto'}
            </Button>

            <Button onClick={handlePlayAnimation} size="sm" className="bg-blue-600 text-white">
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
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
        >
          <div
            className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              left: `${positionManager?.x ?? 50}%`,
              top: `${positionManager?.y ?? 50}%`,
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 'auto',
              maxWidth: 'md',
            }}
            onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
          >
            <LowerThirdBanner
              sponsor={sponsorId as ISponsor}
              isVisible={isVisibleBanner}
              settings={bannerSettingsId as IBannerSettings}
              isExiting={isExiting}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
