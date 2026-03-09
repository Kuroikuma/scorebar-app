# 📝 Ejemplo de Integración: Sistema de Banca y Sustituciones

## Integración en Página de Control del Juego

Este ejemplo muestra cómo integrar el sistema de banca en la página de control del juego existente.

### Opción 1: Integración en Match Control Page

```typescript
// app/match/[id]/page.tsx
'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { BenchManager } from '@/components/gameComponent/BenchManager'
import { ControlPanel } from '@/components/control-panel'
import { Scoreboard } from '@/components/classic-scoreboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MatchControlPage() {
  const params = useParams()
  const gameId = params.id as string
  
  const { loadGame } = useGameStore()
  const { teams } = useTeamsStore()
  
  useEffect(() => {
    if (gameId) {
      loadGame(gameId)
    }
  }, [gameId])
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Scoreboard */}
      <Scoreboard />
      
      {/* Tabs principales */}
      <Tabs defaultValue="control" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="control">Control del Juego</TabsTrigger>
          <TabsTrigger value="bench-home">Banca - {teams[0].name}</TabsTrigger>
          <TabsTrigger value="bench-away">Banca - {teams[1].name}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="control">
          <ControlPanel />
        </TabsContent>
        
        <TabsContent value="bench-home">
          <BenchManager teamIndex={0} />
        </TabsContent>
        
        <TabsContent value="bench-away">
          <BenchManager teamIndex={1} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### Opción 2: Panel Lateral con Banca

```typescript
// app/match/[id]/page.tsx
'use client'

import { useState } from 'react'
import { BenchManager } from '@/components/gameComponent/BenchManager'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Users } from 'lucide-react'

export default function MatchControlPage() {
  const [selectedTeam, setSelectedTeam] = useState<0 | 1>(0)
  
  return (
    <div className="container mx-auto p-4">
      {/* Control principal del juego */}
      <div className="space-y-6">
        {/* ... otros componentes ... */}
        
        {/* Botones de acceso rápido a la banca */}
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                onClick={() => setSelectedTeam(0)}
              >
                <Users className="h-4 w-4 mr-2" />
                Banca Home
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Gestión de Banca</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <BenchManager teamIndex={0} />
              </div>
            </SheetContent>
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline"
                onClick={() => setSelectedTeam(1)}
              >
                <Users className="h-4 w-4 mr-2" />
                Banca Away
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Gestión de Banca</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <BenchManager teamIndex={1} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
```

### Opción 3: Integración en Lineup Management

```typescript
// components/gameComponent/LineupManager.tsx
'use client'

import { useState } from 'react'
import { useTeamsStore } from '@/app/store/teamsStore'
import { BenchManager } from '@/components/gameComponent/BenchManager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export function LineupManager({ teamIndex }: { teamIndex: number }) {
  const { teams } = useTeamsStore()
  const team = teams[teamIndex]
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{team.name}</span>
            <div className="flex gap-2">
              <Badge variant="outline">
                Lineup: {team.lineup.length}
              </Badge>
              <Badge variant="secondary">
                Banca: {team.bench.length}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lineup">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lineup">Lineup Activo</TabsTrigger>
              <TabsTrigger value="bench">Gestión de Banca</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lineup">
              {/* Componente existente de lineup */}
              <LineupEditor teamIndex={teamIndex} />
            </TabsContent>
            
            <TabsContent value="bench">
              <BenchManager teamIndex={teamIndex} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Flujo de Trabajo Recomendado

### 1. Preparación Pre-Juego

```typescript
// Antes de iniciar el juego, agregar jugadores a la banca
const { addPlayerToBench } = useTeamsStore()

// Roster completo del equipo (ejemplo: 25 jugadores)
const fullRoster = [
  // 9 jugadores en el lineup inicial
  // 16 jugadores en la banca
]

// Agregar jugadores sustitutos a la banca
for (const player of benchPlayers) {
  await addPlayerToBench(teamIndex, player)
}
```

### 2. Durante el Juego

```typescript
// El operador puede realizar sustituciones en cualquier momento
// usando el componente BenchManager o mediante código:

const { substituteWithBenchPlayer } = useTeamsStore()

// Ejemplo: Cambio de pitcher en la 7ma entrada
if (inning === 7 && outs === 0) {
  const pitcher = teams[1].lineup.find(p => p.position === 'P')
  const reliever = teams[1].bench.find(p => 
    p.position === 'P' && p.name === 'Closer'
  )
  
  if (pitcher && reliever) {
    await substituteWithBenchPlayer(1, pitcher._id!, reliever._id!)
  }
}
```

### 3. Post-Juego

```typescript
// Generar reporte de sustituciones realizadas
const { teams } = useTeamsStore()

const substitutions = teams.flatMap((team, teamIndex) => 
  team.bench
    .filter(p => p.isSubstituted)
    .map(p => ({
      team: team.name,
      playerOut: p.name,
      playerIn: team.lineup.find(l => l.substituteFor === p._id)?.name,
      inning: p.turnsAtBat[p.turnsAtBat.length - 1]?.inning
    }))
)

console.log('Sustituciones realizadas:', substitutions)
```

## Sincronización con Backend

### Actualizar Endpoint de API

Necesitarás actualizar el backend para soportar la banca:

```typescript
// app/service/api.ts

// Agregar endpoint para guardar banca
export const updateBenchService = async (
  gameId: string,
  teamIndex: number,
  bench: Player[]
) => {
  return await api.put(`/games/${gameId}/teams/${teamIndex}/bench`, { bench })
}

// Modificar updatePlayerService para incluir banca
export const updatePlayerService = async (
  gameId: string,
  teamIndex: number,
  lineup: Player[],
  bench?: Player[]
) => {
  return await api.put(`/games/${gameId}/teams/${teamIndex}`, { 
    lineup,
    ...(bench && { bench })
  })
}
```

### Cargar Banca al Iniciar Juego

```typescript
// app/store/teamsStore.ts

// Modificar la función que carga el juego
const loadGameData = async (gameId: string) => {
  const response = await api.get(`/games/${gameId}`)
  const gameData = response.data
  
  set({
    teams: gameData.teams.map((team: any) => ({
      ...team,
      bench: team.bench || [], // Cargar banca desde el backend
    }))
  })
}
```

## Consideraciones de UX

### Indicadores Visuales

- **Jugador actual bateando**: Resaltar con borde o badge
- **Jugadores sustituidos**: Mostrar con badge "Sustituido" y deshabilitar
- **Banca vacía**: Mostrar mensaje informativo
- **Validaciones**: Deshabilitar botones cuando no sea posible sustituir

### Notificaciones

```typescript
// Ejemplos de mensajes toast
toast.success('Juan Pérez (#15) agregado a la banca')
toast.success('Pedro Martínez (#45) sustituido por Luis García (#12)')
toast.error('El jugador ya ha sido sustituido y no puede regresar (Regla 5.10)')
toast.warning('No hay jugadores disponibles en la banca')
```

### Confirmaciones

```typescript
// Agregar confirmación antes de sustituciones importantes
import { AlertDialog } from '@/components/ui/alert-dialog'

const confirmSubstitution = async (lineupPlayer: Player, benchPlayer: Player) => {
  const confirmed = await showConfirmDialog({
    title: '¿Confirmar sustitución?',
    description: `${lineupPlayer.name} será sustituido por ${benchPlayer.name}. Esta acción no se puede deshacer según la Regla 5.10.`,
  })
  
  if (confirmed) {
    await substituteWithBenchPlayer(teamIndex, lineupPlayer._id!, benchPlayer._id!)
  }
}
```

## Testing

### Casos de Prueba

```typescript
// tests/bench-substitution.test.ts

describe('Sistema de Banca y Sustituciones', () => {
  test('Agregar jugador a la banca', async () => {
    const { addPlayerToBench, teams } = useTeamsStore.getState()
    
    await addPlayerToBench(0, mockPlayer)
    
    expect(teams[0].bench).toHaveLength(1)
    expect(teams[0].bench[0].name).toBe(mockPlayer.name)
  })
  
  test('No permitir agregar jugador duplicado', async () => {
    const { addPlayerToBench } = useTeamsStore.getState()
    
    await addPlayerToBench(0, mockPlayer)
    await addPlayerToBench(0, mockPlayer) // Duplicado
    
    // Debe mostrar error y no agregar
  })
  
  test('Sustituir jugador correctamente', async () => {
    const { substituteWithBenchPlayer, teams } = useTeamsStore.getState()
    
    const result = await substituteWithBenchPlayer(0, lineupPlayerId, benchPlayerId)
    
    expect(result.success).toBe(true)
    expect(teams[0].lineup.find(p => p._id === benchPlayerId)).toBeDefined()
    expect(teams[0].bench.find(p => p._id === benchPlayerId)).toBeUndefined()
  })
  
  test('No permitir sustituir jugador ya sustituido', async () => {
    const { substituteWithBenchPlayer } = useTeamsStore.getState()
    
    // Primera sustitución
    await substituteWithBenchPlayer(0, playerId, benchPlayerId1)
    
    // Intentar sustituir el mismo jugador nuevamente
    const result = await substituteWithBenchPlayer(0, playerId, benchPlayerId2)
    
    expect(result.success).toBe(false)
    expect(result.error).toContain('Regla 5.10')
  })
})
```

## Referencias

- **Componente**: `components/gameComponent/BenchManager.tsx`
- **Store**: `app/store/teamsStore.ts`
- **Documentación**: `.kiro/doc/USO_SUSTITUCIONES.md`
- **Reglas Oficiales**: Regla 5.10 (Sustituciones)
