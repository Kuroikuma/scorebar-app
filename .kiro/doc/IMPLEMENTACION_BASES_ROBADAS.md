# Implementación de Bases Robadas (Regla 9.07)

## 📋 Resumen

Se ha implementado un sistema completo para registrar intentos de bases robadas (Stolen Bases - SB) y corredores atrapados robando (Caught Stealing - CS) según la Regla 9.07 de MLB.

## 🎯 Regla MLB 9.07

### Base Robada (SB)
> "Una base robada es una estadística acreditada a un corredor siempre que avance una base sin la ayuda de un hit, un out puesto, un error, un fielder's choice, un passed ball, un wild pitch o un balk"

**Características**:
- El corredor avanza por su propia iniciativa
- No hay ayuda de jugadas ofensivas (hit, error, etc.)
- No hay ayuda de jugadas defensivas (WP, PB, etc.)
- Puede ser de cualquier base a la siguiente (incluyendo robo de home)

### Caught Stealing (CS)
> "Un corredor es caught stealing cuando es puesto out intentando robar una base"

**Características**:
- Se registra como out
- Se acredita al catcher defensivo
- Cuenta como intento fallido para el corredor

## 🔧 Componentes Implementados

### 1. `teamsStore.ts` - Estadísticas de Jugadores

#### Nuevas propiedades en `Player`
```typescript
interface Player {
  // Estadísticas ofensivas
  stolenBases?: number        // Bases robadas exitosas (SB)
  caughtStealing?: number     // Intentos fallidos (CS)
  
  // Estadísticas defensivas (catcher)
  caughtStealingBy?: number   // Corredores atrapados robando
}
```

#### Nueva función
```typescript
recordStolenBaseAttempt: async (
  runnerId: string,
  fromBase: number,
  toBase: number,
  wasSuccessful: boolean
) => Promise<void>
```

**Funcionalidad**:
- Si `wasSuccessful = true`:
  - Incrementa `stolenBases` del corredor
- Si `wasSuccessful = false`:
  - Incrementa `caughtStealing` del corredor
  - Incrementa `caughtStealingBy` del catcher defensivo
- Persiste cambios en el backend

### 2. `gameStore.ts` - Handler de Juego

```typescript
handleStolenBase: async (
  runnerId: string,
  fromBase: number,
  toBase: number,
  wasSuccessful: boolean
) => Promise<void>
```

**Flujo**:
1. Registra estadísticas del intento (vía `recordStolenBaseAttempt`)
2. Si exitoso:
   - Si roba home → anota carrera
   - Si roba otra base → mueve corredor
3. Si caught stealing:
   - Elimina corredor de las bases
   - Incrementa outs
   - Si 3 outs → cambia de inning
4. Actualiza el juego en el backend

### 3. `StolenBase.tsx` - Componente UI

**Características**:
- Modal de 3 pasos:
  1. Seleccionar corredor en base
  2. Seleccionar base destino
  3. Indicar resultado (Safe/Out)
- Muestra estadísticas actuales del corredor (SB/CS)
- Muestra estadísticas del catcher defensivo
- Validación de bases disponibles
- Botón deshabilitado si no hay corredores en base

**Props**: Ninguna (lee directamente del store)

## 📊 Estadísticas Registradas

### Corredor Ofensivo
```typescript
{
  stolenBases: 5,      // 5 bases robadas exitosas
  caughtStealing: 2    // 2 intentos fallidos
}
```

### Catcher Defensivo
```typescript
{
  caughtStealingBy: 8  // 8 corredores atrapados robando
}
```

## 🎮 Casos de Uso

### Caso 1: Robo exitoso de 2da base
```typescript
// Corredor en 1ra intenta robar 2da
handleStolenBase(
  'player123',  // ID del corredor
  0,            // fromBase: 1ra (índice 0)
  1,            // toBase: 2da (índice 1)
  true          // wasSuccessful: Safe
)

// Resultado:
// - corredor.stolenBases++
// - Corredor se mueve de 1ra a 2da
// - Bases actualizadas
```

### Caso 2: Caught stealing en 3ra
```typescript
// Corredor en 2da intenta robar 3ra, es out
handleStolenBase(
  'player456',
  1,            // fromBase: 2da
  2,            // toBase: 3ra
  false         // wasSuccessful: Out
)

// Resultado:
// - corredor.caughtStealing++
// - catcher.caughtStealingBy++
// - Corredor eliminado de las bases
// - outs++
```

### Caso 3: Robo de home
```typescript
// Corredor en 3ra roba home exitosamente
handleStolenBase(
  'player789',
  2,            // fromBase: 3ra
  3,            // toBase: home
  true          // wasSuccessful: Safe
)

// Resultado:
// - corredor.stolenBases++
// - Carrera anotada
// - Corredor eliminado de las bases (anotó)
```

## 🔄 Diferencias con `handleAdvanceRunners`

### `handleAdvanceRunners` (uso general)
- Para avances por hit, error, WP, PB, etc.
- Puede involucrar múltiples corredores
- Requiere especificar safe/out para cada corredor
- NO registra estadísticas de SB/CS

### `handleStolenBase` (específico)
- Solo para bases robadas (Regla 9.07)
- Un corredor a la vez
- Registra SB o CS en estadísticas
- Acredita CS al catcher defensivo
- Validación de bases disponibles

## 📝 Validaciones Implementadas

### 1. Bases Disponibles
```typescript
getAvailableBases(fromBase: number): number[]
```
- Solo puede robar la siguiente base o home
- Si la siguiente base está ocupada, no puede robar más allá
- Ejemplo: Corredor en 1ra con 2da ocupada → solo puede robar 2da

### 2. Corredores en Base
- Botón deshabilitado si no hay corredores en base
- Solo muestra corredores con `playerId` válido

### 3. Flujo de 3 Pasos
- No puede seleccionar base destino sin seleccionar corredor
- No puede confirmar resultado sin seleccionar ambos

## 🎨 UI/UX

### Botón Principal
```tsx
<Button className="bg-[#d97706]">
  <Zap /> Base Robada
</Button>
```
- Color naranja distintivo
- Icono de rayo (velocidad)
- Deshabilitado si no hay corredores

### Modal
- **Paso 1**: Lista de corredores con estadísticas actuales
- **Paso 2**: Botones de bases disponibles
- **Paso 3**: Resumen del intento + botones Safe/Out
- Información del catcher defensivo
- Referencia a Regla 9.07

### Feedback Visual
- Corredor seleccionado: borde amarillo
- Base seleccionada: fondo amarillo
- Botón Safe: verde
- Botón Out: rojo

## ✅ Cumplimiento de Reglas MLB

- ✅ **Regla 9.07**: Base robada sin ayuda externa
- ✅ **Regla 10.07(a)**: SB acreditada al corredor
- ✅ **Regla 10.07(b)**: CS acreditada al corredor
- ✅ **Regla 10.09(b)**: CS asistida por catcher
- ✅ **Regla 5.06(b)(3)(A)**: Corredor puede avanzar bajo su propio riesgo

## 🚀 Integración con Control Panel

### Ubicación Sugerida
```tsx
// En control-panel.tsx, sección de acciones de corredores
<div className="space-y-2">
  <AdvanceRunners />
  <StolenBase />  {/* ← Nuevo botón */}
</div>
```

### Orden Lógico
1. **Avanzar Corredores**: Para avances por jugadas (hit, error, WP, PB)
2. **Base Robada**: Para robos específicos sin ayuda externa

## 📈 Reportes y Estadísticas

### Estadísticas del Corredor
```typescript
// Porcentaje de éxito en robos
const successRate = (stolenBases / (stolenBases + caughtStealing)) * 100

// Ejemplo: 5 SB, 2 CS = 71.4% de éxito
```

### Estadísticas del Catcher
```typescript
// Efectividad defensiva
const catcherEfficiency = (caughtStealingBy / totalStealAttempts) * 100

// Ejemplo: 8 CS de 15 intentos = 53.3% de efectividad
```

## 🎯 Próximos Pasos Sugeridos

1. **Visualización**: Mostrar SB/CS en tarjetas de jugadores
2. **Historial**: Registrar intentos de robo en el historial de jugadas
3. **Alertas**: Notificar cuando un corredor tiene alto % de SB
4. **Reportes**: Incluir SB/CS en estadísticas del juego
5. **Doble robo**: Permitir múltiples corredores robando simultáneamente
6. **Timing**: Registrar el momento del robo (cuenta, outs, etc.)

## 🔍 Diferenciación de Jugadas

### Base Robada (usar `handleStolenBase`)
- Corredor avanza por iniciativa propia
- No hay error defensivo
- No hay lanzamiento desviado (WP/PB)
- No hay jugada ofensiva (hit, balk)

### Avance por WP/PB (usar `handleWildPitch/handlePassedBall`)
- Lanzamiento no atrapado por el catcher
- Responsabilidad del pitcher (WP) o catcher (PB)
- Corredor aprovecha el error

### Avance por Hit (usar `handleSingle/handleDouble/etc`)
- Bateador conecta la bola
- Corredor avanza forzado o por decisión
- Se registra hit en estadísticas ofensivas

### Avance por Error (usar `handleErrorPlay`)
- Error defensivo permite el avance
- Se registra error en equipo defensivo
- NO se registra hit

## 🎓 Notas para Operadores

### ¿Cuándo usar "Base Robada"?
✅ Corredor sale con el lanzamiento y llega safe
✅ Corredor roba home en squeeze play fallido
✅ Corredor avanza sin ayuda de jugada ofensiva/defensiva

### ¿Cuándo NO usar "Base Robada"?
❌ Corredor avanza por wild pitch → usar WP/PB
❌ Corredor avanza por error → usar Error Play
❌ Corredor avanza por hit → automático en hit
❌ Corredor avanza por balk → usar Balk (pendiente)

## 🎯 Resultado Final

La implementación cumple completamente con la Regla 9.07 de MLB, permitiendo registrar bases robadas y caught stealing con estadísticas precisas para corredores y catchers.
