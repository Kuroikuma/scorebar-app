# 🔄 Guía de Uso: Sistema de Sustituciones y Banca (Regla 5.10)

## Descripción General

El sistema de sustituciones implementa la Regla 5.10 de las Reglas Oficiales de Béisbol, que establece:

> "Un jugador, o jugadores, pueden ser sustituidos durante un juego en cualquier momento en que la bola esté muerta"

Este sistema incluye:
- **Gestión de Banca**: Administra jugadores sustitutos que no están en el lineup activo
- **Sustituciones**: Reemplaza jugadores del lineup con jugadores de la banca
- **Validaciones**: Cumple con las reglas oficiales de béisbol

## Arquitectura del Sistema

### Estructura de Datos

```typescript
export type Team = {
  // ... campos existentes ...
  lineup: Player[]  // Jugadores activos en el juego
  bench: Player[]   // Jugadores sustitutos disponibles
}

export type Player = {
  // ... campos existentes ...
  isSubstituted?: boolean      // Marca si fue sustituido
  substitutedBy?: string       // ID del jugador que lo reemplazó
  substituteFor?: string       // ID del jugador al que reemplazó
  canReturnAsFielder?: boolean // Para pitchers (configurable)
}
```

## Funciones Disponibles

### Gestión de Banca

#### 1. `addPlayerToBench()`

Agrega un jugador a la banca del equipo.

**Firma**:
```typescript
addPlayerToBench: (teamIndex: number, player: Player) => Promise<void>
```

**Ejemplo de uso**:
```typescript
import { useTeamsStore } from '@/app/store/teamsStore'

const { addPlayerToBench } = useTeamsStore()

await addPlayerToBench(0, {
  _id: 'player-789',
  name: 'Carlos Rodríguez',
  position: 'RF',
  number: '15',
  battingOrder: 0,
  defensiveOrder: 0,
  turnsAtBat: [],
})
```

**Validaciones**:
- El jugador no debe estar ya en el lineup activo
- El jugador no debe estar ya en la banca
- Inicializa todas las estadísticas en 0

#### 2. `removePlayerFromBench()`

Remueve un jugador de la banca.

**Firma**:
```typescript
removePlayerFromBench: (teamIndex: number, playerId: string) => Promise<void>
```

**Ejemplo de uso**:
```typescript
const { removePlayerFromBench } = useTeamsStore()

await removePlayerFromBench(0, 'player-789')
```

#### 3. `updateBenchPlayer()`

Actualiza los datos de un jugador en la banca.

**Firma**:
```typescript
updateBenchPlayer: (
  teamIndex: number, 
  playerId: string, 
  player: Player
) => Promise<void>
```

**Ejemplo de uso**:
```typescript
const { updateBenchPlayer } = useTeamsStore()

await updateBenchPlayer(0, 'player-789', {
  ...existingPlayer,
  position: 'CF', // Cambiar posición
})
```

### Sustituciones

#### 4. `substituteWithBenchPlayer()`

Sustituye un jugador del lineup con un jugador de la banca (función principal).

**Firma**:
```typescript
substituteWithBenchPlayer: (
  teamIndex: number,
  playerToRemoveId: string,
  benchPlayerId: string
) => Promise<{ success: boolean; error?: string }>
```

**Ejemplo de uso**:
```typescript
const { substituteWithBenchPlayer } = useTeamsStore()

const result = await substituteWithBenchPlayer(
  0,                    // Team home
  'lineup-player-123',  // Jugador del lineup a sustituir
  'bench-player-789'    // Jugador de la banca que entra
)

if (result.success) {
  console.log('Sustitución exitosa')
} else {
  console.error('Error:', result.error)
}
```

**Comportamiento**:
1. Valida que el jugador del lineup pueda ser sustituido
2. Valida que el jugador de la banca exista
3. Marca al jugador original como `isSubstituted: true`
4. Mueve al jugador de la banca al lineup
5. El sustituto hereda la posición en el batting order
6. Remueve al jugador de la banca
7. Agrega al jugador sustituido a la banca (para tracking)
8. Actualiza el backend y muestra notificación

#### 5. `substitutePlayer()`

Sustituye un jugador por otro (versión genérica, sin usar la banca).

**Firma**:
```typescript
substitutePlayer: (
  teamIndex: number,
  playerToRemoveId: string,
  newPlayer: Player
) => Promise<{ success: boolean; error?: string }>
```

**Nota**: Se recomienda usar `substituteWithBenchPlayer()` en lugar de esta función para mantener consistencia con la gestión de banca.

### Validaciones

#### 6. `canPlayerBeSubstituted()`

Valida si un jugador puede ser sustituido.

**Firma**:
```typescript
canPlayerBeSubstituted: (teamIndex: number, playerId: string) => boolean
```

**Ejemplo de uso**:
```typescript
const { canPlayerBeSubstituted } = useTeamsStore()

if (canPlayerBeSubstituted(0, 'player-123-id')) {
  // Mostrar botón de sustitución
} else {
  // Deshabilitar botón (jugador ya fue sustituido)
}
```

**Retorna**:
- `true`: El jugador está activo y puede ser sustituido
- `false`: El jugador ya fue sustituido y no puede ser removido nuevamente

#### 7. `canPlayerReturn()`

Valida si un jugador sustituido puede regresar al juego.

**Firma**:
```typescript
canPlayerReturn: (teamIndex: number, playerId: string) => boolean
```

**Ejemplo de uso**:
```typescript
const { canPlayerReturn } = useTeamsStore()

if (canPlayerReturn(0, 'player-123-id')) {
  // Permitir que el jugador regrese (excepcional)
} else {
  // Bloquear regreso (regla estándar)
}
```

**Retorna**:
- `false`: Siempre (Regla 5.10(a) - jugador sustituido no puede regresar)
- `true`: Solo si `canReturnAsFielder: true` y `position === 'P'` (configurable por liga)

## Campos Agregados a la Interfaz `Player`

```typescript
export type Player = {
  // ... campos existentes ...
  
  // ── Regla 5.10: Control de sustituciones ─────────────────────────────────
  // Indica si el jugador ha sido sustituido y no puede regresar al juego
  isSubstituted?: boolean
  
  // ID del jugador que reemplazó a este jugador (si fue sustituido)
  substitutedBy?: string
  
  // ID del jugador al que este jugador reemplazó (si es sustituto)
  substituteFor?: string
  
  // Indica si un pitcher que salió puede regresar solo como jugador de posición
  canReturnAsFielder?: boolean
}
```

## Validaciones Implementadas

### ✅ Regla 5.10(a): No Regreso
Un jugador que ha sido sustituido **no puede regresar al juego**.

```typescript
// Esto fallará si el jugador ya fue sustituido
const result = await substitutePlayer(0, 'already-substituted-id', newPlayer)
// result.error: "El jugador ya ha sido sustituido y no puede ser removido nuevamente (Regla 5.10)"
```

### ✅ Herencia de Batting Order
El sustituto hereda la posición en el orden de bateo del jugador original.

```typescript
// Jugador original: battingOrder = 5
// Después de la sustitución:
// - Nuevo jugador: battingOrder = 5 (heredado)
// - Jugador original: isSubstituted = true
```

### ✅ Preservación de Historial
El historial de turnos al bat del jugador original se mantiene intacto.

```typescript
// El jugador original conserva su array turnsAtBat[]
// El nuevo jugador comienza con turnsAtBat: []
```

### ✅ Pitcher Especial
Si el jugador sustituido es pitcher, se marca `canReturnAsFielder: true`.

```typescript
// Esto permite implementar reglas de ligas que permiten
// que un pitcher regrese como jugador de posición
// (no aplicable en MLB, pero sí en algunas ligas amateur)
```

## Casos de Uso Comunes

### Caso 1: Agregar Jugadores a la Banca al Inicio del Juego

```typescript
const { addPlayerToBench } = useTeamsStore()

// Agregar varios jugadores sustitutos
const benchPlayers = [
  { name: 'Pedro Martínez', number: '45', position: 'P' },
  { name: 'Luis García', number: '12', position: 'C' },
  { name: 'Miguel Sánchez', number: '8', position: 'OF' },
]

for (const playerData of benchPlayers) {
  await addPlayerToBench(0, {
    _id: `bench-${Date.now()}-${Math.random()}`,
    ...playerData,
    battingOrder: 0,
    defensiveOrder: 0,
    turnsAtBat: [],
  })
}
```

### Caso 2: Sustitución Ofensiva (Pinch Hitter)

```typescript
// Sustituir al bateador actual por un pinch hitter de la banca
const { teams, substituteWithBenchPlayer } = useTeamsStore()
const { isTopInning } = useGameStore()

const teamIndex = isTopInning ? 0 : 1
const currentBatter = teams[teamIndex].lineup[teams[teamIndex].currentBatter]

// Seleccionar un jugador de la banca
const benchPlayer = teams[teamIndex].bench.find(p => p.position === 'DH')

if (benchPlayer) {
  await substituteWithBenchPlayer(
    teamIndex, 
    currentBatter._id!, 
    benchPlayer._id!
  )
}
```

### Caso 3: Cambio de Pitcher

```typescript
// Sustituir pitcher con un relevista de la banca
const { teams, substituteWithBenchPlayer } = useTeamsStore()

const teamIndex = 1 // Away team
const currentPitcher = teams[teamIndex].lineup.find(p => p.position === 'P')
const reliefPitcher = teams[teamIndex].bench.find(p => p.position === 'P')

if (currentPitcher && reliefPitcher) {
  await substituteWithBenchPlayer(
    teamIndex,
    currentPitcher._id!,
    reliefPitcher._id!
  )
}
```

### Caso 4: Sustitución Defensiva Tardía

```typescript
// Cambiar un jugador defensivo en las últimas entradas
const { teams, substituteWithBenchPlayer } = useTeamsStore()
const { inning } = useGameStore()

if (inning >= 7) {
  const teamIndex = 0
  const outfielder = teams[teamIndex].lineup.find(p => p.position === 'LF')
  const defensiveSpecialist = teams[teamIndex].bench.find(p => 
    p.position === 'LF' && !p.isSubstituted
  )
  
  if (outfielder && defensiveSpecialist) {
    await substituteWithBenchPlayer(
      teamIndex,
      outfielder._id!,
      defensiveSpecialist._id!
    )
  }
}
```

### Caso 5: Validación Antes de Sustituir

```typescript
// Verificar disponibilidad antes de mostrar opciones
const { teams, canPlayerBeSubstituted } = useTeamsStore()

const teamIndex = 0
const availableLineupPlayers = teams[teamIndex].lineup.filter(p => 
  canPlayerBeSubstituted(teamIndex, p._id!)
)

const availableBenchPlayers = teams[teamIndex].bench.filter(p => 
  !p.isSubstituted
)

console.log(`Jugadores sustituibles: ${availableLineupPlayers.length}`)
console.log(`Jugadores disponibles en banca: ${availableBenchPlayers.length}`)
```

## Integración con UI

### Componente BenchManager

El sistema incluye un componente completo para gestionar la banca y realizar sustituciones:

```typescript
import { BenchManager } from '@/components/gameComponent/BenchManager'

// En tu página de control del juego
export default function GameControlPage() {
  return (
    <div>
      {/* Otros componentes */}
      
      {/* Gestión de banca para equipo home */}
      <BenchManager teamIndex={0} />
      
      {/* Gestión de banca para equipo away */}
      <BenchManager teamIndex={1} />
    </div>
  )
}
```

### Características del Componente

- **Tabs**: Alterna entre vista de banca y lineup activo
- **Agregar jugadores**: Diálogo para agregar nuevos jugadores a la banca
- **Realizar sustituciones**: Interfaz intuitiva para seleccionar jugadores
- **Validaciones visuales**: Deshabilita opciones no válidas
- **Indicadores**: Muestra jugador actual bateando y jugadores sustituidos
- **Notificaciones**: Toast messages para feedback inmediato

### Ejemplo de Componente Personalizado

```typescript
'use client'

import { useState } from 'react'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function QuickSubstitute({ teamIndex }: { teamIndex: number }) {
  const { teams, substituteWithBenchPlayer, canPlayerBeSubstituted } = useTeamsStore()
  const [lineupPlayerId, setLineupPlayerId] = useState('')
  const [benchPlayerId, setBenchPlayerId] = useState('')
  
  const team = teams[teamIndex]
  
  const handleQuickSubstitute = async () => {
    if (!lineupPlayerId || !benchPlayerId) return
    
    const result = await substituteWithBenchPlayer(
      teamIndex,
      lineupPlayerId,
      benchPlayerId
    )
    
    if (result.success) {
      setLineupPlayerId('')
      setBenchPlayerId('')
    }
  }
  
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="text-sm">Jugador a Sustituir</label>
        <Select value={lineupPlayerId} onValueChange={setLineupPlayerId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona..." />
          </SelectTrigger>
          <SelectContent>
            {team.lineup
              .filter(p => canPlayerBeSubstituted(teamIndex, p._id!))
              .map(p => (
                <SelectItem key={p._id} value={p._id!}>
                  #{p.number} {p.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <label className="text-sm">Jugador Sustituto</label>
        <Select value={benchPlayerId} onValueChange={setBenchPlayerId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona..." />
          </SelectTrigger>
          <SelectContent>
            {team.bench
              .filter(p => !p.isSubstituted)
              .map(p => (
                <SelectItem key={p._id} value={p._id!}>
                  #{p.number} {p.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleQuickSubstitute}
        disabled={!lineupPlayerId || !benchPlayerId}
      >
        Sustituir
      </Button>
    </div>
  )
}
```

## Notas Importantes

### ⚠️ Validación de "Bola Muerta"

La Regla 5.10 establece que las sustituciones solo pueden hacerse cuando la bola está muerta. Actualmente, el sistema **no valida** este estado automáticamente. Es responsabilidad del operador asegurarse de que la sustitución se realice en el momento apropiado.

**Implementación futura**: Agregar validación de estado de juego antes de permitir sustituciones.

### ⚠️ Regla DH

Si un Designated Hitter (DH) entra a jugar defensivamente, pierde su designación y el pitcher debe batear. Esta lógica **no está implementada** actualmente y requiere desarrollo adicional.

### ✅ Sincronización en Tiempo Real

Todas las sustituciones se sincronizan automáticamente con el backend vía `updatePlayerService()` y se propagan a través de Socket.io a todos los clientes conectados.

## Referencias

- **Reglas Oficiales de Béisbol 2023**: Regla 5.10 (Sustituciones)
- **Archivo de implementación**: `app/store/teamsStore.ts`
- **Documento de análisis**: `.kiro/doc/ANALISIS_VALIDACION_BEISBOL_SCOREBAR.md`
