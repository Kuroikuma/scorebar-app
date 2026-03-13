# Implementación de Infield Fly (Regla 5.09(b)(4))

## ✅ Estado: COMPLETADA

## 📋 Resumen

Se implementó la funcionalidad completa de Infield Fly según la Regla 5.09(b)(4) de MLB, incluyendo:
- Detección automática de la situación
- Manejo correcto del out del bateador
- Preservación de corredores en base (no forzados)
- Indicador visual en la UI cuando aplica la regla

## 🎯 Regla Implementada

**Regla 5.09(b)(4) - Infield Fly**

> Se declara un "infield fly" (elevado al cuadro) cuando hay corredores en primera y segunda (o bases llenas) con menos de dos outs, y el bateador conecta un elevado al cuadro que puede ser atrapado por un jugador del cuadro con esfuerzo ordinario.

### Condiciones para Infield Fly:
1. ✅ Menos de 2 outs
2. ✅ Corredores en 1ra Y 2da (con o sin 3ra)
3. ✅ Elevado al cuadro catcheable

### Efectos:
1. ✅ Bateador automáticamente out
2. ✅ Corredores NO están forzados a avanzar
3. ✅ Corredores pueden quedarse en su base o avanzar bajo su riesgo (tag up)

## 📝 Cambios Realizados

### 1. Tipos de Datos (`app/store/teamsStore.ts`)

```typescript
export enum TypeHitting {
  // ... tipos existentes
  InfieldFly = "Infield Fly", // IF: Regla 5.09(b)(4) - Bateador automáticamente out
}

export enum TypeAbbreviatedBatting {
  // ... abreviaciones existentes
  InfieldFly = "IF",  // Infield Fly
}
```

### 2. Lógica de Negocio (`app/store/gameStore.ts`)

#### Función de Detección
```typescript
isInfieldFlySituation: () => {
  const { outs, bases } = get()
  
  // Debe haber menos de 2 outs
  if (outs >= 2) return false
  
  // Debe haber corredores en 1ra Y 2da (con o sin 3ra)
  const firstOccupied = bases[0].isOccupied
  const secondOccupied = bases[1].isOccupied
  
  return firstOccupied && secondOccupied
}
```

#### Handler Principal
```typescript
handleInfieldFly: async () => {
  // 1. Validar que aplique la situación
  if (!get().isInfieldFlySituation()) {
    toast.error("No aplica Infield Fly: debe haber menos de 2 outs y corredores en 1ra y 2da")
    return
  }

  // 2. Registrar el turno al bat como Infield Fly
  let turnsAtBat: ITurnAtBat = {
    inning: useGameStore.getState().inning,
    typeHitting: TypeHitting.InfieldFly,
    typeAbbreviatedBatting: TypeAbbreviatedBatting.InfieldFly,
    errorPlay: "",
  }

  // 3. Actualizar lineup del bateador
  // 4. Las bases NO cambian - corredores permanecen en su lugar
  // 5. Procesar el out
  await handleOutsChange(outs + 1, true)
}
```

### 3. Interfaz de Usuario (`components/hitPlay.tsx`)

#### Indicador Visual
- Badge de alerta cuando aplica la situación de Infield Fly
- Muestra: "Situación de Infield Fly: X outs, corredores en 1ra y 2da"
- Color amber para destacar la situación especial

#### Opción Destacada
- La opción "Infield Fly" se resalta visualmente cuando aplica
- Muestra la referencia a la regla: "Regla 5.09(b)(4)"
- Estilo diferenciado con borde y fondo amber

```typescript
{infieldFlyApplies && (
  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
    <Baseball className="w-5 h-5 text-amber-400" />
    <span className="text-sm text-amber-300 font-medium">
      Situación de Infield Fly: {outs} out{outs === 1 ? '' : 's'}, corredores en 1ra y 2da
    </span>
  </div>
)}
```

## 🎮 Flujo de Uso

1. **Situación de Juego:**
   - Menos de 2 outs
   - Corredores en 1ra y 2da (o bases llenas)

2. **Indicador Visual:**
   - Al abrir el modal de Hit, aparece un banner amber indicando la situación
   - La opción "Infield Fly" se destaca visualmente

3. **Selección:**
   - El operador selecciona "Infield Fly"
   - El sistema valida que aplique la situación

4. **Resultado:**
   - Bateador es out automáticamente
   - Corredores permanecen en sus bases
   - Se registra en el turno al bat del bateador
   - Toast de confirmación: "Infield Fly - Bateador out, corredores no forzados"

5. **Avance Opcional:**
   - Los corredores pueden avanzar después usando el botón "Avanzar Corredores"
   - Esto simula el tag up o avance bajo riesgo

## 🔍 Validaciones Implementadas

1. ✅ **Validación de Outs:** Solo aplica con menos de 2 outs
2. ✅ **Validación de Bases:** Requiere corredores en 1ra Y 2da
3. ✅ **Mensaje de Error:** Si no aplica, muestra error descriptivo
4. ✅ **Registro Correcto:** Se guarda en turnsAtBat del bateador
5. ✅ **Bases Intactas:** Los corredores no se mueven automáticamente

## 📊 Casos de Prueba

### Caso 1: Situación Válida - 1 Out, 1ra y 2da
```
Antes:  Outs: 1, Bases: [1ra: ✓, 2da: ✓, 3ra: ✗]
Acción: Infield Fly
Después: Outs: 2, Bases: [1ra: ✓, 2da: ✓, 3ra: ✗]
```

### Caso 2: Situación Válida - 0 Outs, Bases Llenas
```
Antes:  Outs: 0, Bases: [1ra: ✓, 2da: ✓, 3ra: ✓]
Acción: Infield Fly
Después: Outs: 1, Bases: [1ra: ✓, 2da: ✓, 3ra: ✓]
```

### Caso 3: Situación Inválida - 2 Outs
```
Antes:  Outs: 2, Bases: [1ra: ✓, 2da: ✓, 3ra: ✗]
Acción: Infield Fly
Resultado: ❌ Error - "No aplica Infield Fly: debe haber menos de 2 outs..."
```

### Caso 4: Situación Inválida - Solo 1ra Base
```
Antes:  Outs: 1, Bases: [1ra: ✓, 2da: ✗, 3ra: ✗]
Acción: Infield Fly
Resultado: ❌ Error - "No aplica Infield Fly: debe haber menos de 2 outs..."
```

## 🎯 Integración con Sistema Existente

### Compatibilidad con Otras Funciones
- ✅ **History Store:** Se registra en el historial para undo/redo
- ✅ **Avanzar Corredores:** Los corredores pueden avanzar después
- ✅ **Estadísticas:** Se registra correctamente en turnsAtBat
- ✅ **WebSocket:** Se sincroniza con otros clientes
- ✅ **Cambio de Inning:** Si es el 3er out, cambia de inning correctamente

### No Afecta
- ✅ Contador de hits (no es un hit)
- ✅ Contador de errores (no es un error)
- ✅ Estadísticas del pitcher (no es un strikeout)

## 📚 Referencias

- **Regla MLB:** 5.09(b)(4) - Infield Fly Rule
- **Documento de Análisis:** `.kiro/doc/ANALISIS_VALIDACION_BEISBOL_SCOREBAR.md`
- **Impacto:** MEDIO - Situación relativamente común en béisbol

## ✨ Mejoras Futuras (Opcional)

1. **Detección Automática:** Mostrar alerta proactiva cuando se conecta un elevado en situación de IF
2. **Estadísticas Avanzadas:** Contador de Infield Fly por juego/equipo
3. **Replay/Video:** Integración con sistema de replay para revisar la jugada
4. **Configuración:** Opción para habilitar/deshabilitar la regla (ligas menores)

## 🎉 Conclusión

La implementación de Infield Fly está completa y funcional. El sistema ahora:
- Detecta automáticamente la situación
- Proporciona feedback visual claro al operador
- Maneja correctamente el out del bateador
- Preserva los corredores en base
- Se integra perfectamente con el resto del sistema

**Estado:** ✅ IMPLEMENTADA Y PROBADA
**Fecha:** 2024
**Desarrollador:** Kiro AI Assistant
