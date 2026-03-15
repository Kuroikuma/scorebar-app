'use client';

import React, { useState } from 'react';
import { useOverlayTypes } from '@/app/hooks/useOverlayTypes';
import { SportCategory, IOverlayType } from '@/app/types/overlay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OverlayTypeManagerProps {
  sport?: SportCategory;
}

export const OverlayTypeManager: React.FC<OverlayTypeManagerProps> = ({ sport }) => {
  const { overlayTypes, loading, error, createOverlayType, updateOverlayType, deleteOverlayType } = useOverlayTypes(sport);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<IOverlayType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    category: SportCategory.Baseball,
    description: '',
    defaultConfig: {
      visible: true,
      x: 0,
      y: 0,
      scale: 1,
      design: 'default'
    },
    availableDesigns: ['default'],
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      category: SportCategory.Baseball,
      description: '',
      defaultConfig: {
        visible: true,
        x: 0,
        y: 0,
        scale: 1,
        design: 'default'
      },
      availableDesigns: ['default'],
      isActive: true
    });
  };

  const handleCreate = async () => {
    try {
      await createOverlayType(formData);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating overlay type:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingType) return;
    
    try {
      await updateOverlayType(editingType._id, formData);
      setEditingType(null);
      resetForm();
    } catch (error) {
      console.error('Error updating overlay type:', error);
    }
  };

  const handleDelete = async (typeId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de overlay?')) {
      try {
        await deleteOverlayType(typeId);
      } catch (error) {
        console.error('Error deleting overlay type:', error);
      }
    }
  };

  const handleEdit = (type: IOverlayType) => {
    setFormData({
      name: type.name,
      displayName: type.displayName,
      category: type.category,
      description: type.description || '',
      defaultConfig: type.defaultConfig,
      availableDesigns: type.availableDesigns,
      isActive: type.isActive
    });
    setEditingType(type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tipos de Overlay</h2>
          <p className="text-muted-foreground">
            Gestiona los tipos de overlays disponibles para {sport || 'todos los deportes'}
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Tipo de Overlay</DialogTitle>
            </DialogHeader>
            <OverlayTypeForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              onCancel={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Overlay Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overlayTypes.map((type) => (
          <Card key={type._id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{type.displayName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{type.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(type._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={type.isActive ? "default" : "secondary"}>
                  {type.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
                <Badge variant="outline">
                  {type.category}
                </Badge>
              </div>

              {type.description && (
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {type.availableDesigns.length} diseños
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {type.availableDesigns.map((design) => (
                    <Badge key={design} variant="outline" className="text-xs">
                      {design}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Posición por defecto: ({type.defaultConfig.x}, {type.defaultConfig.y})
                <br />
                Escala: {type.defaultConfig.scale}x
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tipo de Overlay</DialogTitle>
          </DialogHeader>
          <OverlayTypeForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditingType(null);
              resetForm();
            }}
            isEditing
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Form Component
interface OverlayTypeFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const OverlayTypeForm: React.FC<OverlayTypeFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [newDesign, setNewDesign] = useState('');

  const addDesign = () => {
    if (newDesign && !formData.availableDesigns.includes(newDesign)) {
      setFormData({
        ...formData,
        availableDesigns: [...formData.availableDesigns, newDesign]
      });
      setNewDesign('');
    }
  };

  const removeDesign = (design: string) => {
    setFormData({
      ...formData,
      availableDesigns: formData.availableDesigns.filter((d: string) => d !== design)
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre (ID)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="baseball_scoreboard"
          />
        </div>
        <div>
          <Label htmlFor="displayName">Nombre para mostrar</Label>
          <Input
            id="displayName"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="Marcador de Béisbol"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SportCategory.Baseball}>Béisbol</SelectItem>
            <SelectItem value={SportCategory.Football}>Fútbol</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del overlay..."
        />
      </div>

      {/* Default Config */}
      <div className="space-y-3">
        <Label>Configuración por defecto</Label>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label htmlFor="x" className="text-xs">X</Label>
            <Input
              id="x"
              type="number"
              value={formData.defaultConfig.x}
              onChange={(e) => setFormData({
                ...formData,
                defaultConfig: { ...formData.defaultConfig, x: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div>
            <Label htmlFor="y" className="text-xs">Y</Label>
            <Input
              id="y"
              type="number"
              value={formData.defaultConfig.y}
              onChange={(e) => setFormData({
                ...formData,
                defaultConfig: { ...formData.defaultConfig, y: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div>
            <Label htmlFor="scale" className="text-xs">Escala</Label>
            <Input
              id="scale"
              type="number"
              step="0.1"
              value={formData.defaultConfig.scale}
              onChange={(e) => setFormData({
                ...formData,
                defaultConfig: { ...formData.defaultConfig, scale: parseFloat(e.target.value) || 1 }
              })}
            />
          </div>
          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.defaultConfig.visible}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  defaultConfig: { ...formData.defaultConfig, visible: checked }
                })}
              />
              <Label className="text-xs">Visible</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Available Designs */}
      <div className="space-y-3">
        <Label>Diseños disponibles</Label>
        <div className="flex gap-2">
          <Input
            value={newDesign}
            onChange={(e) => setNewDesign(e.target.value)}
            placeholder="Nombre del diseño"
            onKeyPress={(e) => e.key === 'Enter' && addDesign()}
          />
          <Button type="button" onClick={addDesign}>
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.availableDesigns.map((design: string) => (
            <Badge key={design} variant="outline" className="cursor-pointer" onClick={() => removeDesign(design)}>
              {design} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Activo</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </div>
  );
};