'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/app/lib/utils';
import { Eye, EyeOff, Move, Scale } from 'lucide-react';

interface OverlayCardProps {
  overlay: IOverlay;
  isSelected: boolean;
  onSelect: () => void;
  onVisibilityChange: (visible: boolean) => void;
  onPositionChange: (x: number, y: number) => void;
  onScaleChange: (scale: number) => void;
}

export const OverlayCard: React.FC<OverlayCardProps> = ({
  overlay,
  isSelected,
  onSelect,
  onVisibilityChange,
  onPositionChange,
  onScaleChange,
}) => {

  console.log(overlay);
  
  const [localX, setLocalX] = React.useState(overlay.x.toString());
  const [localY, setLocalY] = React.useState(overlay.y.toString());
  const [localScale, setLocalScale] = React.useState(overlay.scale.toString());

  // Update local state when overlay changes
  React.useEffect(() => {
    setLocalX(overlay.x.toString());
    setLocalY(overlay.y.toString());
    setLocalScale(overlay.scale.toString());
  }, [overlay.x, overlay.y, overlay.scale]);

  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (axis === 'x') {
      setLocalX(value);
      onPositionChange(numValue, overlay.y);
    } else {
      setLocalY(value);
      onPositionChange(overlay.x, numValue);
    }
  };

  const handleScaleChange = (value: string) => {
    const numValue = parseFloat(value) || 0.1;
    setLocalScale(value);
    onScaleChange(Math.max(0.1, Math.min(3, numValue)));
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary bg-accent/50",
        !overlay.visible && "opacity-60"
      )}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-medium truncate">
              {overlay.overlayTypeId?.displayName || 'Unknown Overlay'}
            </h5>
            {overlay.visible ? (
              <Eye className="h-3 w-3 text-green-500" />
            ) : (
              <EyeOff className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          <Switch
            checked={overlay.visible}
            onCheckedChange={onVisibilityChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {overlay.design}
          </Badge>
        </div>

        {isSelected && (
          <div className="space-y-3 pt-2 border-t border-border">
            {/* Position Controls */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Move className="h-3 w-3" />
                Posición
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`x-${overlay._id}`} className="text-xs text-muted-foreground">
                    X
                  </Label>
                  <Input
                    id={`x-${overlay._id}`}
                    type="number"
                    value={localX}
                    onChange={(e) => handlePositionChange('x', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 text-xs"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor={`y-${overlay._id}`} className="text-xs text-muted-foreground">
                    Y
                  </Label>
                  <Input
                    id={`y-${overlay._id}`}
                    type="number"
                    value={localY}
                    onChange={(e) => handlePositionChange('y', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 text-xs"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Scale Control */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Scale className="h-3 w-3" />
                Escala
              </Label>
              <Input
                type="number"
                value={localScale}
                onChange={(e) => handleScaleChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="h-7 text-xs"
                min="0.1"
                max="3"
                step="0.1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};