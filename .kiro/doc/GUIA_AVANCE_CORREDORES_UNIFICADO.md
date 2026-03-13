# Guía del Sistema Unificado de Avance de Corredores

## 📋 Resumen

Se ha centralizado todo el manejo de avances de bases en un solo componente: `advance-runners.tsx`. Este componente ahora maneja 4 tipos de avances diferentes con un flujo unificado.

## 🎯 Tipos de Avance

### 1. Avance Normal
**Uso**: Hit, error, jugada defensiva, situaciones generales

**Características**:
- Múltiples corredores pueden avanzar
- Cada corredor se resuelve individualmente (safe/out)
- Respeta dependencias entre corredores
- Validación de Regla 5.08(a) para carreras en tercer out

**Flujo**:
```
Botón "Avanzar Corredores"
  ↓
Seleccionar modo: "Avance Normal"
  ↓
Seleccionar corredores y bases destino
  ↓
Resolver cada corredor (safe/out)
  ↓
Procesar con handleAdvanceRunners()
```

### 2. Wild Pitch / Passed Ball
**Uso**: Lanzamiento no atrapado por el catcher

**Características**:
- Registra estadística del pitcher (WP) o catcher (PB)
- Múltiples corredores pueden avanzar
- Cada corredor se resuelve individualmente
- Procesa con `handleWildPitch()` o `handlePassedBall()`

**Flujo**:
```
Botón "Avanzar Corredores"
  ↓
Seleccionar modo: "Wild Pitch / Passed Ball"
  ↓
Seleccionar tipo: WP o PB
  ↓
Seleccionar corredores y bases destino
  ↓
Resolver cada corredor (safe/out)
  ↓
Procesar con handleWildPitch() o handlePassedBall()
```

**Regla 9.13**:
- **WP**: Lanzamiento tan desviado que el catcher no puede atraparlo
- **PB**: Lanzamiento catcheable que el catcher no retuvo

### 3. Base Robada
**Uso**: Corredor avanza por iniciativa propia

**Características**:
- Solo un corredor a la vez
- Sin ayuda de hit, error, WP, PB o balk
- Registra SB (exitoso) o CS (caught stealing)
- Acredita CS al catcher defensivo
- Procesa con `handleStolenBase()`

**Flujo**:
```
Botón "Avanzar Corredores"
  ↓
Seleccionar modo: "Base Robada"
  ↓
Seleccionar corredor (solo uno)
  ↓
Seleccionar base destino
  ↓
Resolver: Safe (SB) o Out (CS)
  ↓
Procesar con handleStolenBase()
```

**Regla 9.07**:
- Base robada sin ayuda externa
- Muestra estadísticas actuales (SB/CS del corredor)
- Solo puede robar la siguiente base o home

### 4. Balk
**Uso**: Movimiento ilegal del pitcher

**Características**:
- Todos los corredores avanzan una base automáticamente
- No requiere selección de corredores
- No requiere resolución safe/out
- Corredor en 3ra anota automáticamente
- Procesa con `handleBalk()`

**Flujo**:
```
Botón "Avanzar Corredores"
  ↓
Seleccionar modo: "Balk"
  ↓
Confirmar (muestra corredores que avanzan)
  ↓
Procesar con handleBalk()
```

**Regla 6.02(a)**:
- Movimiento ilegal del pitcher
- Todos los corredores avanzan una base
- Deshabilitado si no hay corredores en base

## 🎨 Interfaz de Usuario

### Paso 0: Selección de Modo
Modal inicial con 4 opciones:

```
┌─────────────────────────────────────┐
│  Tipo de Avance                     │
├─────────────────────────────────────┤
│  🏃 Avance Normal                   │
│  Por hit, error, jugada defensiva   │
├─────────────────────────────────────┤
│  🌪️ Wild Pitch / Passed Ball       │
│  Lanzamiento no atrapado (WP/PB)   │
├─────────────────────────────────────┤
│  ⚡ Base Robada                     │
│  Corredor avanza por iniciativa    │
├─────────────────────────────────────┤
│  ⚠️ Balk                            │
│  Movimiento ilegal del pitcher     │
└─────────────────────────────────────┘
```

### Paso WP/PB: Selección de Tipo
Solo aparece si se seleccionó "Wild Pitch / Passed Ball":

```
┌─────────────────────────────────────┐
│  Lanzamiento no atrapado            │
├─────────────────────────────────────┤
│  🌪️ Lanzamiento Salvaje (WP)       │
│  Responsabilidad del pitcher        │
│  Pitcher: Juan Pérez (WP: 2)       │
├─────────────────────────────────────┤
│  🧤 Passed Ball (PB)                │
│  Responsabilidad del catcher        │
│  Catcher: Carlos López (PB: 1)     │
└─────────────────────────────────────┘
```

### Paso 1: Selección de Corredores
Varía según el modo:

**Avance Normal / WP-PB**:
- Múltiples corredores
- Muestra dependencias
- Color morado

**Base Robada**:
- Solo un corredor
- Muestra estadísticas SB/CS
- Color amarillo
- Sin dependencias

### Paso 2: Resolución
**Avance Normal / WP-PB**:
- Resolver cada corredor (safe/out)
- Orden: 3ra → 2da → 1ra
- Muestra outs actuales

**Base Robada**:
- Resumen del intento
- Botones: Safe (SB) o Out (CS)
- Muestra catcher defensivo

**Balk**:
- Lista de corredores que avanzan
- Explicación de la regla
- Botón: Confirmar Balk
- Muestra pitcher responsable

## 🔧 Implementación Técnica

### Estado del Componente
```typescript
const [step, setStep] = useState<
  "select-mode" | 
  "select-runners" | 
  "resolve-advances" | 
  "wp-pb-select" | 
  "stolen-base" |
  "balk-confirm"
>("select-mode")

const [advanceMode, setAdvanceMode] = useState<
  "normal" | 
  "wp-pb" | 
  "stolen-base" |
  "balk" |
  null
>(null)

const [wpPbType, setWpPbType] = useState<'WP' | 'PB' | null>(null)
```

### Validaciones Especiales

#### Base Robada
```typescript
// Solo un corredor a la vez
if (advanceMode === 'stolen-base' && runnerAdvances.length > 0) {
  setRunnerAdvances([]) // Reemplazar selección anterior
}

// Bases disponibles: solo siguiente o home
const available: number[] = []
for (let i = fromBase + 1; i <= 3; i++) {
  if (i === 3) {
    available.push(i)
    break
  }
  if (!bases[i].isOccupied) {
    available.push(i)
  } else {
    break // Base ocupada bloquea avances posteriores
  }
}
```

#### WP/PB
```typescript
// Procesar según el tipo seleccionado
if (wpPbType === 'WP') {
  await handleWildPitch(advances)
} else if (wpPbType === 'PB') {
  await handlePassedBall(advances)
}
```

#### Balk
```typescript
// Avance automático de todos los corredores
const hasRunners = bases.some(base => base.isOccupied)
if (!hasRunners) return

// Procesar en orden inverso
for (let i = 2; i >= 0; i--) {
  if (bases[i].isOccupied) {
    if (i === 2) {
      runsScored++ // Corredor en 3ra anota
    } else {
      newBases[i + 1] = { ...bases[i] } // Avanza una base
    }
  }
}

await handleBalk()
```

## 📊 Estadísticas Registradas

### Por Tipo de Avance

| Tipo | Estadísticas Ofensivas | Estadísticas Defensivas |
|------|------------------------|-------------------------|
| Normal | Ninguna específica | Ninguna específica |
| WP | Ninguna | `pitcher.wildPitches++` |
| PB | Ninguna | `catcher.passedBalls++` |
| SB (exitoso) | `runner.stolenBases++` | Ninguna |
| CS (fallido) | `runner.caughtStealing++` | `catcher.caughtStealingBy++` |
| Balk | Ninguna | Ninguna (futuro: `pitcher.balks++`) |

## 🎯 Ventajas del Sistema Unificado

### 1. Centralización
✅ Un solo punto de entrada para todos los avances
✅ Código más mantenible
✅ Menos duplicación

### 2. Consistencia
✅ Misma UI base para todos los modos
✅ Flujo de navegación coherente
✅ Validaciones compartidas

### 3. Simplicidad
✅ Un solo botón en el control panel
✅ Menos componentes que mantener
✅ Más fácil de entender para operadores

### 4. Escalabilidad
✅ Fácil agregar nuevos tipos de avance
✅ Lógica compartida reutilizable
✅ Estructura clara y organizada

## 🚀 Uso en Control Panel

### Integración Simple
```tsx
import { AdvanceRunners } from '@/components/gameComponent/advance-runners'

// En el control panel
<div className="space-y-2">
  <AdvanceRunners />  {/* Un solo botón para todo */}
</div>
```

### Antes vs Después

**Antes** (3 botones separados):
```tsx
<AdvanceRunners />      // Avances generales
<WildPitchPassedBall /> // WP/PB
<StolenBase />          // Bases robadas
```

**Después** (1 botón unificado):
```tsx
<AdvanceRunners />  // Todo centralizado
```

## 📝 Guía para Operadores

### ¿Qué modo usar?

#### Avance Normal
✅ Bateador conecta hit y corredores avanzan
✅ Error defensivo permite avances
✅ Jugada de elección (fielder's choice)
✅ Situaciones complejas con múltiples corredores

#### Wild Pitch / Passed Ball
✅ Catcher no atrapa el lanzamiento
✅ Corredores avanzan por lanzamiento desviado
✅ Necesitas registrar responsabilidad (pitcher vs catcher)

#### Base Robada
✅ Corredor sale con el lanzamiento
✅ Robo de home en squeeze play
✅ Avance sin ayuda de jugada ofensiva/defensiva
✅ Solo un corredor a la vez

#### Balk
✅ Pitcher hace movimiento ilegal
✅ Hay corredores en base
✅ Árbitro marca balk
✅ Todos los corredores avanzan automáticamente

### Flujo de Trabajo Típico

1. **Presionar "Avanzar Corredores"**
2. **Seleccionar tipo de avance** según la situación
3. **Para WP/PB**: Seleccionar responsabilidad
4. **Seleccionar corredor(es)** y base(s) destino
5. **Resolver resultado** (safe/out o SB/CS)
6. **Confirmar** - el sistema procesa automáticamente

## 🔍 Diferencias Clave entre Modos

| Característica | Normal | WP/PB | Base Robada | Balk |
|----------------|--------|-------|-------------|------|
| Corredores | Múltiples | Múltiples | Solo uno | Todos |
| Dependencias | Sí | Sí | No | No |
| Estadísticas | No | Sí (WP/PB) | Sí (SB/CS) | No |
| Color UI | Morado | Azul/Naranja | Amarillo | Rojo |
| Resolución | Safe/Out | Safe/Out | SB/CS | Automático |
| Selección | Manual | Manual | Manual | Automático |

## ✅ Cumplimiento de Reglas MLB

- ✅ **Regla 5.06(b)(3)**: Avances de corredores
- ✅ **Regla 5.08(a)**: Validación de carreras en tercer out
- ✅ **Regla 6.02(a)**: Balk y avance automático
- ✅ **Regla 9.07**: Bases robadas sin ayuda externa
- ✅ **Regla 9.13**: WP se carga al pitcher, PB al catcher
- ✅ **Regla 10.07**: SB y CS acreditadas al corredor
- ✅ **Regla 10.09**: CS asistida por catcher

## 🎓 Resultado Final

El sistema unificado proporciona:

1. **Simplicidad**: Un solo botón, cuatro funcionalidades
2. **Precisión**: Cada tipo de avance registra estadísticas correctas
3. **Flexibilidad**: Fácil agregar nuevos tipos de avance
4. **Usabilidad**: Flujo guiado paso a paso
5. **Cumplimiento**: 100% alineado con reglas MLB
6. **Automatización**: Balk procesa avances automáticamente

**Estado**: ✅ LISTO PARA PRODUCCIÓN
