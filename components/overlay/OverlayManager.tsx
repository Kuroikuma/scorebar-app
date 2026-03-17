'use client';

import React, { useState } from 'react';
import { useGameOverlays } from '@/app/hooks/useGameOverlays';
import { useOverlayStore } from '@/app/store/useOverlayStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Settings, Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IOverlay } from '@/app/types/overlay';
import { DesignSelector } from './DesignSelector';
import { cn } from '@/app/lib/utils';

interface OverlayManagerProps {
  gameId: string;
  isEditMode?: boolean;
}

export const OverlayManager: React.FC<OverlayManagerProps> = ({ 
  gameId, 
  isEditMode = true
}) => {
  const {
    overlays,
    loading,
    error,
    updateOverlayDesign,
    updateOverlayPosition,
    updateOverlayScale,
    updateOverlayVisibility,
    clearError,
  } = useGameOverlays(gameId);

  const { selectedOverlay, setSelectedOverlay, setEditMode } = useOverlayStore();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Set edit mode in store when prop changes
  React.useEffect(() => {
    setEditMode(isEditMode);
  }, [isEditMode, setEditMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  // Organizar overlays por categoría
  const overlaysByCategory = overlays.reduce((acc, overlay) => {
    const category = overlay.overlayTypeId?.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(overlay);
    return acc;
  }, {} as Record<string, IOverlay[]>);

  const selectedOverlayData = overlays.find(o => o._id === selectedOverlay);

  const handleOverlaySelect = (overlayId: string) => {
    setSelectedOverlay(overlayId);
    setShowSettingsModal(true);
  };

  const handleCloseModal = () => {
    setShowSettingsModal(false);
    setSelectedOverlay(null);
  };

  return (
    <div className="h-full overflow-y-auto pb-4">
      <Card className="bg-[#1a1625] border-[#2d2b3b] text-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Overlay Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-white font-semibold">Edit Mode</Label>
              <Switch 
                checked={isEditMode}
                onCheckedChange={setEditMode}
                className="data-[state=checked]:bg-[#4c3f82]" 
              />
            </div>
            <Button
              variant="outline"
              className="w-full bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() => window.open(`/overlay/game/${gameId}`, '_blank')}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Open Overlay View
            </Button>
          </div>

          {/* Overlays by Category */}
          {Object.entries(overlaysByCategory).map(([category, categoryOverlays]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2 pt-4 border-t border-[#2d2b3b]">
                <h4 className="text-sm font-semibold text-white">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h4>
                <Badge variant="secondary" className="text-xs bg-[#4c3f82] text-white">
                  {categoryOverlays.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {categoryOverlays.map(overlay => (
                  <OverlayCard
                    key={overlay._id}
                    overlay={overlay}
                    isSelected={selectedOverlay === overlay._id}
                    onSelect={() => handleOverlaySelect(overlay._id)}
                    onVisibilityChange={(visible) => updateOverlayVisibility(overlay._id, visible)}
                    onPositionChange={(x, y) => updateOverlayPosition(overlay._id, x, y)}
                    onScaleChange={(scale) => updateOverlayScale(overlay._id, scale)}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="bg-[#1a1625] border-[#2d2b3b] text-white max-w-lg h-[80vh] flex flex-col p-0">
          {/* Fixed Header */}
          <DialogHeader className="px-6 py-4 border-b border-[#2d2b3b] flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="p-2 bg-[#4c3f82] rounded-lg">
                <Settings className="h-5 w-5" />
              </div>
              Overlay Settings
            </DialogTitle>
          </DialogHeader>
          
          {/* Scrollable Content */}
          {selectedOverlayData && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Overlay Info Card */}
                <div className="bg-[#2d2b3b] rounded-lg p-4 border border-[#363447]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4c3f82] rounded-md">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">
                        {selectedOverlayData.overlayTypeId?.name || 'Unknown Overlay'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Design: {selectedOverlayData.design || 'Default'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Visible</span>
                      <Switch 
                        checked={selectedOverlayData.visible}
                        onCheckedChange={(visible) => updateOverlayVisibility(selectedOverlay!, visible)}
                        className="data-[state=checked]:bg-[#4c3f82]" 
                      />
                    </div>
                  </div>
                </div>

                {/* Position & Scale Controls */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Position Section */}
                  <div className="bg-[#2d2b3b] rounded-lg p-4 border border-[#363447]">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#4c3f82] rounded-full"></div>
                      Position
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400 uppercase tracking-wide">X (Horizontal)</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 bg-[#1a1625] hover:bg-[#363447] border-[#363447]"
                            onClick={() => updateOverlayPosition(selectedOverlay!, Math.max(0, selectedOverlayData.x - 10), selectedOverlayData.y)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            className="flex-1 bg-[#1a1625] border-[#363447] text-center text-white text-sm"
                            value={selectedOverlayData.x || 0}
                            onChange={(e) => updateOverlayPosition(selectedOverlay!, Number(e.target.value), selectedOverlayData.y)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99] border-[#4c3f82] text-white"
                            onClick={() => updateOverlayPosition(selectedOverlay!, (selectedOverlayData.x || 0) + 10, selectedOverlayData.y)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400 uppercase tracking-wide">Y (Vertical)</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 bg-[#1a1625] hover:bg-[#363447] border-[#363447]"
                            onClick={() => updateOverlayPosition(selectedOverlay!, selectedOverlayData.x, Math.max(0, selectedOverlayData.y - 10))}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            className="flex-1 bg-[#1a1625] border-[#363447] text-center text-white text-sm"
                            value={selectedOverlayData.y || 0}
                            onChange={(e) => updateOverlayPosition(selectedOverlay!, selectedOverlayData.x, Number(e.target.value))}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99] border-[#4c3f82] text-white"
                            onClick={() => updateOverlayPosition(selectedOverlay!, selectedOverlayData.x, (selectedOverlayData.y || 0) + 10)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scale Section */}
                  <div className="bg-[#2d2b3b] rounded-lg p-4 border border-[#363447]">
                    <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#4c3f82] rounded-full"></div>
                      Scale
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 bg-[#1a1625] hover:bg-[#363447] border-[#363447]"
                          onClick={() => updateOverlayScale(selectedOverlay!, Number(Math.max(0.1, (selectedOverlayData.scale || 1) - 0.1).toFixed(2)))}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="3"
                          className="flex-1 bg-[#1a1625] border-[#363447] text-center text-white text-sm"
                          value={selectedOverlayData.scale || 1}
                          onChange={(e) => updateOverlayScale(selectedOverlay!, Number(Math.max(0.1, Number(e.target.value)).toFixed(2)))}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99] border-[#4c3f82] text-white"
                          onClick={() => updateOverlayScale(selectedOverlay!, Number(Math.min(3, (selectedOverlayData.scale || 1) + 0.1).toFixed(2)))}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Min: 0.1x</span>
                        <span className="text-white font-medium">{((selectedOverlayData.scale || 1) * 100).toFixed(0)}%</span>
                        <span>Max: 3.0x</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Design Selector */}
                <div className="bg-[#2d2b3b] rounded-lg p-4 border border-[#363447]">
                  <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4c3f82] rounded-full"></div>
                    Design Options
                  </h4>
                  <DesignSelector
                    overlay={selectedOverlayData}
                    onDesignChange={(design, customConfig) => 
                      updateOverlayDesign(selectedOverlay!, design, customConfig)
                    }
                    onClose={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fixed Footer */}
          <div className="px-6 py-4 border-t border-[#2d2b3b] flex-shrink-0">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-[#2d2b3b] hover:bg-[#363447] border-[#363447] text-white"
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-[#4c3f82] hover:bg-[#5a4b99] text-white font-medium"
                onClick={() => {
                  window.open(`/overlay/game/${gameId}`, '_blank');
                  handleCloseModal();
                }}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente OverlayCard integrado para mantener consistencia
interface OverlayCardProps {
  overlay: IOverlay;
  isSelected: boolean;
  onSelect: () => void;
  onVisibilityChange: (visible: boolean) => void;
  onPositionChange: (x: number, y: number) => void;
  onScaleChange: (scale: number) => void;
}

const OverlayCard: React.FC<OverlayCardProps> = ({
  overlay,
  isSelected,
  onSelect,
  onVisibilityChange,
}) => {
  return (
    <div
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-all",
        isSelected 
          ? "bg-[#4c3f82] border-[#5a4b99]" 
          : "bg-[#2d2b3b] border-[#363447] hover:bg-[#363447]"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h5 className="text-sm font-medium text-white">
            {overlay.overlayTypeId?.name || 'Unknown Overlay'}
          </h5>
          <p className="text-xs text-gray-400">
            {overlay.design || 'Default Design'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityChange(!overlay.visible);
            }}
            className="h-8 w-8 p-0 text-white hover:bg-[#363447]"
          >
            {overlay.visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelect}
            className="h-8 w-8 p-0 text-white hover:bg-[#363447]"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};