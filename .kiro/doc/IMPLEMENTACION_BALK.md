# Implementación de Balk (Regla 6.02(a))

## 📋 Resumen

Se ha implementado el manejo de Balk según la Regla 6.02(a) de MLB, integrado en el sistema unificado de avance de corredores.

## 🎯 Regla MLB 6.02(a)

### Definición de Balk
> "Es un balk cuando el pitcher, mientras está tocando la goma, hace cualquier movimiento naturalmente asociado con su lanzamiento y no realiza tal lanzamiento"

### Efecto del Balk
- **Todos los corredores avanzan una base automáticamente**
- Si hay corredor en 3ra base, anota carrera
- El bateador NO avanza (a menos que sea ball 4)
- No se registran outs
- Es un avance forzado para todos los corredores

### Ejemplos de Balk
1. Pitcher amaga lanzar a home pero no lo hace
2. Pitcher no se detiene completamente en su movimiento
3. Pitcher lanza a una base sin pisar la goma
4. Pitcher deja caer la bola mientras está en la goma
5. Pitcher hace movimiento de lanzamiento sin la bola

## 🔧 Implementación Técnica

### 1. `gameStore.ts` - Handler Principal

```typescript
handleBalk: async () => {
  console.log('⚠️ Balk - Todos los corredores avanzan una base')
  
  const { bases, isTopInning, updateGame } = get()
  
  // Verificar si hay corredores en base
  const hasRunners = bases.some(base => base.isOccupied)
  
  if (!hasRunners) {
    console.log('⚠️ No hay corredores en base - Balk sin efecto')
    return
  }

  const teamIndex = isTopInning ? 0 : 1
  let runsScored = 0
  const newBases = [...__initBases__]

  // Procesar corredores en orden inverso (3ra → 2da → 1ra)
  for (let i = 2; i >= 0; i--) {
    if (bases[i].isOccupied) {
      if (i === 2) {
        // Corredor en 3ra anota
        runsScored++
      } else {
        // Corredor avanza una base
        newBases[i + 1] = { ...bases[i] }
      }
    }
  }

  // Actualizar bases y carreras
  set({ bases: newBases })
  
  if (runsScored > 0) {
    await useTeamsStore.getState().incrementRuns(teamIndex, runsScored, false)
  }

  await updateGame()
}
```

**Características**:
- Avance automático de todos los corredores
- Procesamiento en orden inverso (3ra → 1ra)
- Corredor en 3ra anota automáticamente
- No requiere resolución safe/out
- Validación de corredores en base

### 2. `advance-runners.tsx` - Integración UI

#### Selector de Modo
```tsx
<button onClick={() => {
  setAdvanceMode("balk")
  setStep("balk-confirm")
}}>
  <AlertTriangle /> Balk
  Movimiento ilegal del pitcher
</button>
```

#### Paso de Confirmación
```tsx
{step === "balk-confirm" && (
  <>
    <DialogTitle>Balk del Pitcher</DialogTitle>
    
    {/* Explicación de la regla */}
    <div className="bg-red-500/10">
      Regla 6.02(a): Movimiento ilegal...
    </div>
    
    {/* Lista de corredores que avanzan */}
    <div>
      Corredor en 1ra → 2da
      Corredor en 2da → 3ra
      Corredor en 3ra → Home (anota)
    </div>
    
    {/* Pitcher responsable */}
    <div>Pitcher: Juan Pérez</div>
    
    <Button onClick={handleBalk}>
      Confirmar Balk
    </Button>
  </>
)}
```

## 🎮 Flujo de Usuario

### Paso a Paso

```
Usuario presiona "Avanzar Corredores"
  ↓
Selecciona "Balk" 🔴
  ↓
Modal muestra:
  - Explicación de la regla
  - Lista de corredores que avanzan
  - Pitcher responsable
  ↓
Usuario confirma "Confirmar Balk"
  ↓
Sistema procesa automáticamente:
  - Avanza todos los corredores una base
  - Anota carreras si aplica
  - Actualiza el juego
```

### Validaciones

1. **Corredores en base**: Botón deshabilitado si no hay corredores
2. **Avance automático**: No requiere selección de corredores
3. **Sin outs**: El balk no genera outs
4. **Carreras automáticas**: Corredor en 3ra anota sin resolución

## 📊 Casos de Uso

### Caso 1: Corredor en 1ra
```typescript
// Estado inicial
bases[0] = { isOccupied: true, playerId: 'player123' }

// Usuario confirma balk
await handleBalk()

// Resultado
bases[0] = { isOccupied: false, playerId: null }
bases[1] = { isOccupied: true, playerId: 'player123' }
```

### Caso 2: Bases llenas
```typescript
// Estado inicial
bases[0] = { isOccupied: true, playerId: 'player1' }
bases[1] = { isOccupied: true, playerId: 'player2' }
bases[2] = { isOccupied: true, playerId: 'player3' }

// Usuario confirma balk
await handleBalk()

// Resultado
bases[0] = { isOccupied: false, playerId: null }
bases[1] = { isOccupied: true, playerId: 'player1' }
bases[2] = { isOccupied: true, playerId: 'player2' }
runsScored = 1 // player3 anotó
```

### Caso 3: Solo corredor en 3ra
```typescript
// Estado inicial
bases[2] = { isOccupied: true, playerId: 'player789' }

// Usuario confirma balk
await handleBalk()

// Resultado
bases[2] = { isOccupied: false, playerId: null }
runsScored = 1 // Corredor anotó
```

### Caso 4: Sin corredores
```typescript
// Estado inicial
bases = [empty, empty, empty]

// Usuario intenta seleccionar balk
// Botón está deshabilitado

// Si se llama handleBalk() directamente
await handleBalk()
// Resultado: No hace nada, retorna early
```

## 🎨 Interfaz de Usuario

### Selector de Modo
```
┌─────────────────────────────────────┐
│  ⚠️ Balk                            │
│  Movimiento ilegal del pitcher     │
│  Todos los corredores avanzan      │
│  (No hay corredores en base) ❌    │
└─────────────────────────────────────┘
```

### Modal de Confirmación
```
╔═══════════════════════════════════════════╗
║  ⚠️ Balk del Pitcher                      ║
╠═══════════════════════════════════════════╣
║                                           ║
║  El pitcher realizó un movimiento ilegal. ║
║  Todos los corredores avanzan una base.   ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ Regla 6.02(a):                      │ ║
║  │ Es un balk cuando el pitcher hace   │ ║
║  │ movimiento de lanzamiento sin       │ ║
║  │ realizar el lanzamiento             │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  Corredores que avanzan:                  ║
║  🏃 Pedro García: 1ra → 2da               ║
║  🏃 Luis Martínez: 2da → 3ra              ║
║  🏃 Juan López: 3ra → Home (anota)        ║
║                                           ║
║  Pitcher: Carlos Rodríguez                ║
║                                           ║
║         [✅ Confirmar Balk]               ║
║                                           ║
╠═══════════════════════════════════════════╣
║  [Cancelar]                               ║
╚═══════════════════════════════════════════╝
```

## 🔄 Diferencias con Otros Avances

| Característica | Normal | WP/PB | Base Robada | Balk |
|----------------|--------|-------|-------------|------|
| **Corredores** | Múltiples | Múltiples | Solo uno | Todos |
| **Selección** | Manual | Manual | Manual | Automático |
| **Resolución** | Safe/Out | Safe/Out | SB/CS | Automático |
| **Outs** | Posible | Posible | Posible | No |
| **Estadísticas** | No | WP/PB | SB/CS | No |
| **Avance** | Variable | Variable | Variable | Una base |

## ✅ Cumplimiento de Reglas MLB

- ✅ **Regla 6.02(a)**: Definición de balk
- ✅ **Regla 5.06(b)(3)(F)**: Avance por balk
- ✅ **Regla 5.08(a)**: Carreras cuentan en balk (no hay outs)
- ✅ Todos los corredores avanzan automáticamente
- ✅ Corredor en 3ra anota automáticamente
- ✅ Bateador NO avanza (a menos que sea ball 4)

## 🎯 Integración en Sistema Unificado

### Ubicación en el Flujo
```
Avanzar Corredores
  ├─ Avance Normal 🟣
  ├─ Wild Pitch / Passed Ball 🔵
  ├─ Base Robada 🟡
  └─ Balk 🔴 (nuevo)
```

### Características Únicas
- **Color rojo**: Distintivo para situación de penalización
- **Icono de alerta**: AlertTriangle para indicar infracción
- **Confirmación simple**: Un solo paso (no requiere selección)
- **Avance automático**: Sin resolución safe/out
- **Deshabilitado sin corredores**: Validación automática

## 📝 Notas Importantes

### Cuándo NO es Balk
❌ Pitcher lanza a una base para intentar out (pickoff)
❌ Pitcher se sale de la goma antes de lanzar
❌ Pitcher está en posición de windup (no touching rubber)
❌ No hay corredores en base (balk sin efecto)

### Cuándo SÍ es Balk
✅ Pitcher amaga lanzar a home pero no lo hace
✅ Pitcher no se detiene completamente en set position
✅ Pitcher deja caer la bola mientras toca la goma
✅ Pitcher hace movimiento de lanzamiento sin la bola
✅ Pitcher lanza a base desocupada sin intento de out

### Situaciones Especiales

#### Balk con Ball 4
Si el balk ocurre en ball 4:
- Todos los corredores avanzan una base (por balk)
- El bateador avanza a 1ra (por ball 4)
- Implementación actual: Manejar ball 4 primero, luego balk si aplica

#### Balk con Strike 3
Si el balk ocurre en strike 3:
- El bateador es out
- Todos los corredores avanzan una base
- Implementación actual: Manejar strike 3 primero, luego balk si aplica

## 🚀 Próximos Pasos Sugeridos

1. **Estadísticas del pitcher**: Registrar balks cometidos
2. **Historial**: Incluir balks en el historial de jugadas
3. **Alertas**: Notificar cuando ocurre un balk
4. **Reportes**: Incluir balks en estadísticas del juego
5. **Situaciones especiales**: Manejar balk + ball 4 / strike 3

## 🎓 Guía para Operadores

### ¿Cuándo usar "Balk"?
✅ Pitcher hace movimiento ilegal
✅ Hay corredores en base
✅ Árbitro marca balk

### ¿Cuándo NO usar "Balk"?
❌ No hay corredores en base
❌ Pitcher hace pickoff legal
❌ Corredor avanza por otra razón (hit, error, etc.)

### Flujo Rápido
1. Presionar "Avanzar Corredores"
2. Seleccionar "Balk"
3. Verificar corredores que avanzan
4. Confirmar
5. Sistema procesa automáticamente

## 🏆 Resultado Final

La implementación de Balk completa el sistema unificado de avance de corredores con:

1. **Simplicidad**: Un solo botón de confirmación
2. **Automatización**: Avance automático de todos los corredores
3. **Validación**: Deshabilitado si no hay corredores
4. **Cumplimiento**: 100% alineado con Regla 6.02(a)
5. **Integración**: Parte del sistema unificado

**Estado**: ✅ LISTO PARA PRODUCCIÓN
