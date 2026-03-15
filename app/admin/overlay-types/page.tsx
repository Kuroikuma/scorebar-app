'use client';

import React, { useState } from 'react';
import { OverlayTypeManager } from '@/components/overlay/OverlayTypeManager';
import { SportCategory } from '@/app/types/overlay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useOverlayTypes } from '@/app/hooks/useOverlayTypes';

export default function OverlayTypesAdminPage() {
  const { overlayTypes: allTypes } = useOverlayTypes();
  
  const baseballTypes = allTypes.filter(type => type.category === SportCategory.Baseball);
  const footballTypes = allTypes.filter(type => type.category === SportCategory.Football);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Administración de Overlays</h1>
        <p className="text-muted-foreground">
          Gestiona los tipos de overlays disponibles para cada deporte
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              Tipos de overlay configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Béisbol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{baseballTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              {baseballTypes.filter(t => t.isActive).length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fútbol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{footballTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              {footballTypes.filter(t => t.isActive).length} activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sports */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Todos 
            <Badge variant="secondary" className="ml-2">
              {allTypes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="baseball">
            Béisbol
            <Badge variant="secondary" className="ml-2">
              {baseballTypes.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="football">
            Fútbol
            <Badge variant="secondary" className="ml-2">
              {footballTypes.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <OverlayTypeManager />
        </TabsContent>

        <TabsContent value="baseball">
          <OverlayTypeManager sport={SportCategory.Baseball} />
        </TabsContent>

        <TabsContent value="football">
          <OverlayTypeManager sport={SportCategory.Football} />
        </TabsContent>
      </Tabs>
    </div>
  );
}