# Sistema Unificado de Avance de Corredores - Resumen Visual

## 🎯 Concepto Principal

**Un solo botón, tres tipos de avance, flujo guiado**

```
┌─────────────────────────────────────────┐
│                                         │
│     🏃 AVANZAR CORREDORES               │
│                                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│  ¿Qué tipo de avance?                   │
├─────────────────────────────────────────┤
│  1️⃣  Avance Normal                      │
│  2️⃣  Wild Pitch / Passed Ball          │
│  3️⃣  Base Robada                        │
└─────────────────────────────────────────┘
```

---

## 📊 Flujo por Tipo de Avance

### 1️⃣ Avance Normal

```
Botón "Avanzar Corredores"
         ↓
   Seleccionar modo
         ↓
   "Avance Normal" 🟣
         ↓
Seleccionar corredores (múltiples)
         ↓
Seleccionar bases destino
         ↓
Resolver cada corredor
  ├─ Safe ✅
  └─ Out ❌
         ↓
   handleAdvanceRunners()
```

**Características**:
- 🟣 Color morado
- 👥 Múltiples corredores
- 🔗 Respeta dependencias
- ⚖️ Validación Regla 5.08(a)

---

### 2️⃣ Wild Pitch / Passed Ball

```
Botón "Avanzar Corredores"
         ↓
   Seleccionar modo
         ↓
"Wild Pitch / Passed Ball" 🔵
         ↓
   ¿WP o PB?
  ├─ WP (pitcher) 🌪️
  └─ PB (catcher) 🧤
         ↓
Seleccionar corredores (múltiples)
         ↓
Seleccionar bases destino
         ↓
Resolver cada corredor
  ├─ Safe ✅
  └─ Out ❌
         ↓
handleWildPitch() o handlePassedBall()
```

**Características**:
- 🔵 Color azul/naranja
- 👥 Múltiples corredores
- 📊 Registra WP o PB
- 🎯 Responsabilidad clara

**Regla 9.13**:
- **WP**: Lanzamiento tan desviado que el catcher no puede atraparlo
- **PB**: Lanzamiento catcheable que el catcher no retuvo

---

### 3️⃣ Base Robada

```
Botón "Avanzar Corredores"
         ↓
   Seleccionar modo
         ↓
   "Base Robada" 🟡
         ↓
Seleccionar corredor (solo uno) 👤
         ↓
Seleccionar base destino
         ↓
   ¿Fue exitoso?
  ├─ Safe (SB) ✅
  └─ Out (CS) ❌
         ↓
   handleStolenBase()
```

**Características**:
- 🟡 Color amarillo
- 👤 Solo un corredor
- 📊 Registra SB o CS
- 🎯 Acredita CS al catcher

**Regla 9.07**:
- Base robada sin ayuda de hit, error, WP, PB o balk
- Solo puede robar siguiente base o home

---

## 🎨 Interfaz Visual

### Paso 0: Selector de Modo

```
╔═══════════════════════════════════════════╗
║         Tipo de Avance                    ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🏃 Avance Normal                    │ ║
║  │ Por hit, error, jugada defensiva    │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🌪️ Wild Pitch / Passed Ball        │ ║
║  │ Lanzamiento no atrapado (WP/PB)    │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ ⚡ Base Robada                      │ ║
║  │ Corredor avanza por iniciativa     │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### Paso WP/PB: Selección de Responsabilidad

```
╔═══════════════════════════════════════════╗
║    Lanzamiento no atrapado                ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🌪️ Lanzamiento Salvaje (WP)        │ ║
║  │ Responsabilidad del pitcher         │ ║
║  │ Pitcher: Juan Pérez (WP: 2)        │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ 🧤 Passed Ball (PB)                 │ ║
║  │ Responsabilidad del catcher         │ ║
║  │ Catcher: Carlos López (PB: 1)      │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### Paso 1: Selección de Corredores

**Avance Normal / WP-PB**:
```
╔═══════════════════════════════════════════╗
║    Avanzar Corredores                     ║
╠═══════════════════════════════════════════╣
║                                           ║
║  🏃 Pedro García en 3ra                   ║
║  [Seleccionar] → [Home]                   ║
║  Depende de: ninguno                      ║
║                                           ║
║  🏃 Luis Martínez en 2da                  ║
║  [Seleccionar] → [3ra] [Home]             ║
║  Depende de: 3ra                          ║
║                                           ║
║  🏃 Juan López en 1ra                     ║
║  [Seleccionar] → [2da] [3ra]              ║
║  Depende de: 2da → 3ra                    ║
║                                           ║
╠═══════════════════════════════════════════╣
║  [Volver]              [Resolver Avances] ║
╚═══════════════════════════════════════════╝
```

**Base Robada**:
```
╔═══════════════════════════════════════════╗
║    Base Robada                            ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ⚡ Luis Martínez en 2da                  ║
║  SB: 5, CS: 2                             ║
║  [Seleccionar] → [3ra] [Home]             ║
║                                           ║
╠═══════════════════════════════════════════╣
║  [Volver]                  [Resolver Robo] ║
╚═══════════════════════════════════════════╝
```

### Paso 2: Resolución

**Avance Normal / WP-PB**:
```
╔═══════════════════════════════════════════╗
║    Resolver Avances                       ║
╠═══════════════════════════════════════════╣
║  Outs: ●●○                                ║
║                                           ║
║  3ra → Home                               ║
║  [✅ Safe]  [❌ Out]                      ║
║                                           ║
║  2da → 3ra                                ║
║  [✅ Safe]  [❌ Out]                      ║
║                                           ║
║  1ra → 2da                                ║
║  [✅ Safe]  [❌ Out]                      ║
║                                           ║
╠═══════════════════════════════════════════╣
║  [Volver]                                 ║
╚═══════════════════════════════════════════╝
```

**Base Robada**:
```
╔═══════════════════════════════════════════╗
║    ⚡ Intento de Base Robada              ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Luis Martínez → 2da → 3ra                ║
║                                           ║
║  Catcher: Carlos López (CS: 8)            ║
║                                           ║
║     [✅ Safe (SB)]  [❌ Out (CS)]         ║
║                                           ║
╠═══════════════════════════════════════════╣
║  [Volver]                                 ║
╚═══════════════════════════════════════════╝
```

---

## 📊 Comparación de Características

| Característica | Normal 🟣 | WP/PB 🔵 | Base Robada 🟡 |
|----------------|-----------|----------|----------------|
| **Corredores** | Múltiples | Múltiples | Solo uno |
| **Dependencias** | ✅ Sí | ✅ Sí | ❌ No |
| **Estadísticas** | ❌ No | ✅ WP/PB | ✅ SB/CS |
| **Resolución** | Safe/Out | Safe/Out | SB/CS |
| **Paso extra** | ❌ No | ✅ Tipo WP/PB | ❌ No |
| **Validación especial** | Regla 5.08(a) | Regla 9.13 | Regla 9.07 |

---

## 🎯 Guía Rápida para Operadores

### ¿Cuándo usar cada modo?

```
┌─────────────────────────────────────────────────┐
│  SITUACIÓN                    →  MODO           │
├─────────────────────────────────────────────────┤
│  Bateador conecta hit         →  Normal 🟣      │
│  Error defensivo              →  Normal 🟣      │
│  Jugada de elección           →  Normal 🟣      │
│  Catcher no atrapa            →  WP/PB 🔵       │
│  Lanzamiento desviado         →  WP/PB 🔵       │
│  Corredor sale con lanzam.    →  Base Robada 🟡 │
│  Robo de home                 →  Base Robada 🟡 │
└─────────────────────────────────────────────────┘
```

### Flujo de Decisión

```
¿Hay un bateador involucrado?
  ├─ Sí → ¿Conectó la bola?
  │        ├─ Sí → Normal 🟣
  │        └─ No → ¿Catcher no atrapó?
  │                 ├─ Sí → WP/PB 🔵
  │                 └─ No → Normal 🟣
  │
  └─ No → ¿Corredor por iniciativa propia?
           ├─ Sí → Base Robada 🟡
           └─ No → Normal 🟣
```

---

## 📈 Estadísticas Registradas

### Por Modo

```
┌─────────────────────────────────────────────────┐
│  MODO          OFENSIVAS         DEFENSIVAS     │
├─────────────────────────────────────────────────┤
│  Normal 🟣     -                 -               │
│  WP 🔵         -                 pitcher.WP++    │
│  PB 🔵         -                 catcher.PB++    │
│  SB 🟡         runner.SB++       -               │
│  CS 🟡         runner.CS++       catcher.CS++    │
└─────────────────────────────────────────────────┘
```

### Ejemplo Completo

```
Situación: Corredor en 2da, lanzamiento desviado

Operador:
1. Presiona "Avanzar Corredores"
2. Selecciona "Wild Pitch / Passed Ball" 🔵
3. Selecciona "Wild Pitch (WP)" 🌪️
4. Selecciona corredor en 2da
5. Selecciona destino: 3ra
6. Resuelve: Safe ✅

Resultado:
✅ Corredor en 3ra
✅ pitcher.wildPitches++
✅ Juego actualizado
```

---

## 🏆 Ventajas del Sistema

### Para Operadores
✅ Un solo botón para recordar
✅ Flujo guiado paso a paso
✅ Colores distintivos por tipo
✅ Validaciones automáticas
✅ Menos errores de operación

### Para Desarrolladores
✅ Código centralizado
✅ Lógica compartida
✅ Fácil de mantener
✅ Fácil de extender
✅ Menos duplicación

### Para el Sistema
✅ Estadísticas precisas
✅ Cumplimiento MLB 100%
✅ Escalable a futuro
✅ Consistente y confiable

---

## 🎓 Resultado

**Un componente, tres modos, infinitas posibilidades**

```
                 AdvanceRunners
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Normal 🟣      WP/PB 🔵    Base Robada 🟡
        │              │              │
   handleAdvance   handleWP/PB   handleStolenBase
        │              │              │
        └──────────────┴──────────────┘
                       │
              Estadísticas MLB
```

**Estado**: ✅ LISTO PARA PRODUCCIÓN
