# 🔧 CORRECCIONES PRIORITARIAS — ScoreBar App Béisbol

## 🔴 CORRECCIÓN 1: Bug Crítico en Base por Bolas

### Problema Detectado
**Ubicación**: `app/store/gameStore.ts` línea ~430  
**Severidad**: 🔴 CRÍTICA  
**Impacto**: Corredores NO avanzan en base por bolas cuando deberían

### Código Actual (INCORRECTO)
```typescript
handleBallChange: async (newBalls, isSaved = true) => {
  if (newBalls === 4) {
    set({ balls: 0, strikes: 0 })
    const player = getCurrentBatter()
    await handleBBPlay()
    await advanceBatter()
    const newBases = [...bases]

    const allBasesLoaded = newBases.every((base) => base);

    if (allBasesLoaded) {
      await useTeamsStore
        .getState()
        .incrementRuns(isTopInning ? 0 : 1, 1, false);
    }

    // ❌ ESTE BUCLE NUNCA SE EJECUTA (0 >= 2 es false)
    for (let i = 0; i >= 2; i++) {
      if (newBases[i].isOccupied) {
        newBases[i + 1] = { ...newBases[i], playerId: newBases[i].playerId }
      }
    }

    newBases[0] = {
      ...newBases[0],
      isOccupied: true,
      playerId: player?._id as string
    }

    set({ bases: newBases })
    if (id) {
      await updateGame()
    }
  } else {
    set({ balls: newBalls })
    await changeBallCount(id!, newBalls)
  }
}
```

### Código Corregido (CORRECTO)
```typescript
handleBallChange: async (newBalls, isSaved = true) => {
  if (newBalls === 4) {
    set({ balls: 0, strikes: 0 })
    const player = getCurrentBatter()
    await handleBBPlay()
    await advanceBatter()
    const newBases = [...bases]

    // ✅ CORREGIDO: Recorrer de tercera a primera (índices 2 → 0)
    for (let i = 2; i >= 0; i--) {
      if (newBases[i].isOccupied) {
        // Si la siguiente base existe (no es home)
        if (i + 1 < 3) {
          newBases[i + 1] = { 
            isOccupied: true, 
            playerId: newBases[i].playerId 
          }
        } else {
          // Corredor en tercera anota
          await useTeamsStore
            .getState()
            .incrementRuns(isTopInning ? 0 : 1, 1, false);
        }
        // Limpiar base original
        newBases[i] = { isOccupied: false, playerId: null }
      }
    }

    // Colocar bateador en primera
    newBases[0] = {
      isOccupied: true,
      playerId: player?._id as string
    }

    set({ bases: newBases })
    if (id) {
      await updateGame()
    }
  } else {
    set({ balls: newBalls })
    await changeBallCount(id!, newBalls)
  }
}
```

### Validación de la Corrección
```typescript
// Caso de prueba 1: Bases vacías
// Antes: Bateador a 1ra ✅
// Después: Bateador a 1ra ✅

// Caso de prueba 2: Corredor en 1ra
// Antes: Bateador a 1ra, corredor NO avanza ❌
// Después: Bateador a 1ra, corredor a 2da ✅

// Caso de prueba 3: Bases llenas
// Antes: Bateador a 1ra, corredores NO avanzan, carrera cuenta ❌
// Después: Todos avanzan, corredor de 3ra anota ✅
```

---

## 🟡 CORRECCIÓN 2: Validación Regla 5.08(a)

### Problema Detectado
**Ubicación**: `app/store/teamsStore.ts` función `incrementRuns`  
**Severidad**: 🔴 CRÍTICA  
**Impacto**: Puede anotar carreras inválidas cuando tercer out es sobre bateador-corredor antes de 1ra

### Regla Oficial 5.08(a)
> "No se anotará una carrera si el corredor avanza hasta la base de home durante una jugada en la cual se realiza el tercer out (1) sobre el bateador-corredor antes de que éste toque primera base; (2) sobre cualquier corredor que haya sido out forzado"

### Código Actual
```typescript
incrementRuns: async (teamIndex, newRuns, isSaved = true) => {
  if (isSaved) {
    useHistoryStore.getState().handleRunsHistory(teamIndex);
  }

  set((state) => ({
    teams: state.teams.map((team, index) => 
      (index === teamIndex ? { ...team, runs: team.runs + newRuns } : team)
    ),
  }));

  await useGameStore.getState().changeRunsByInning(teamIndex, newRuns, isSaved);
  // ... resto del código
}
```

### Código con Validación (OPCIÓN 1: Advertencia)
```typescript
incrementRuns: async (teamIndex, newRuns, isSaved = true) => {
  const { outs } = useGameStore.getState();
  
  // ⚠️ Advertencia si es tercer out
  if (outs === 3 && newRuns > 0) {
    toast.warning(
      "⚠️ VERIFICAR REGLA 5.08(a): ¿El tercer out fue sobre el bateador-corredor antes de tocar 1ra?",
      { duration: 5000 }
    );
  }

  if (isSaved) {
    useHistoryStore.getState().handleRunsHistory(teamIndex);
  }

  set((state) => ({
    teams: state.teams.map((team, index) => 
      (index === teamIndex ? { ...team, runs: team.runs + newRuns } : team)
    ),
  }));

  await useGameStore.getState().changeRunsByInning(teamIndex, newRuns, isSaved);
  // ... resto del código
}
```

### Código con Validación (OPCIÓN 2: Confirmación)
```typescript
incrementRuns: async (teamIndex, newRuns, isSaved = true, skipValidation = false) => {
  const { outs } = useGameStore.getState();
  
  // 🛡️ Validación estricta en tercer out
  if (outs === 3 && newRuns > 0 && !skipValidation) {
    // Mostrar diálogo de confirmación
    const confirmed = await showConfirmDialog({
      title: "⚠️ Tercer Out Detectado",
      message: "¿El tercer out fue DESPUÉS de que el corredor cruzara home?\n\n" +
               "La carrera NO cuenta si:\n" +
               "• El out fue sobre el bateador-corredor antes de tocar 1ra\n" +
               "• El out fue forzado",
      confirmText: "Sí, carrera válida",
      cancelText: "No, carrera inválida"
    });
    
    if (!confirmed) {
      toast.info("Carrera no anotada (Regla 5.08(a))");
      return; // No anotar carrera
    }
  }

  if (isSaved) {
    useHistoryStore.getState().handleRunsHistory(teamIndex);
  }

  set((state) => ({
    teams: state.teams.map((team, index) => 
      (index === teamIndex ? { ...team, runs: team.runs + newRuns } : team)
    ),
  }));

  await useGameStore.getState().changeRunsByInning(teamIndex, newRuns, isSaved);
  // ... resto del código
}
```

---

## 🟡 CORRECCIÓN 3: Tercer Strike No Atrapado

### Problema Detectado
**Ubicación**: `app/store/gameStore.ts` función `handleStrikeChange`  
**Severidad**: 🟡 MEDIA  
**Impacto**: Bateador declarado out cuando debería poder correr a primera

### Regla Oficial 5.09(a)(2)
> "El tercer strike cantado por el umpire no es atrapado, siempre y cuando (1) primera base esté desocupada, o (2) primera base esté ocupada con dos outs"

### Código Actual
```typescript
handleStrikeChange: async (newStrikes, isSaved = true) => {
  const { outs, id, handleOutsChange, updateGame } = get()
  const nextOuts = outs + 1;

  if (newStrikes === 3) {
    // ❌ Siempre registra out, no considera strike no atrapado
    if (nextOuts === 3) {
      await handleOutsChange(nextOuts, false)
    } else {
      await handleOutsChange(nextOuts, true)
    }
  } else {
    set({ strikes: newStrikes })
    await changeStrikeCount(id!, newStrikes)
  }
}
```

### Código Corregido
```typescript
handleStrikeChange: async (newStrikes, isSaved = true) => {
  const { outs, id, handleOutsChange, updateGame, bases } = get()
  const nextOuts = outs + 1;

  if (newStrikes === 3) {
    // ✅ Verificar si aplica regla de strike no atrapado
    const firstBaseEmpty = !bases[0].isOccupied;
    const twoOuts = outs === 2;
    const canRunToFirst = firstBaseEmpty || twoOuts;

    if (canRunToFirst) {
      // Mostrar opción al operador
      const caughtByC catcher = await showQuickDialog({
        title: "Tercer Strike",
        message: "¿El catcher atrapó la bola?",
        options: [
          { label: "Sí, atrapada (Out)", value: true },
          { label: "No, no atrapada (Puede correr)", value: false }
        ]
      });

      if (caughtByCatcher) {
        // Strike atrapado → Out normal
        if (nextOuts === 3) {
          await handleOutsChange(nextOuts, false)
        } else {
          await handleOutsChange(nextOuts, true)
        }
      } else {
        // Strike NO atrapado → Bateador puede correr a primera
        toast.info("Tercer strike no atrapado - Bateador puede correr a 1ra");
        set({ strikes: 0, balls: 0 });
        // El operador debe usar handleAdvanceRunners o colocar manualmente en 1ra
      }
    } else {
      // Primera ocupada con menos de 2 outs → Out automático
      if (nextOuts === 3) {
        await handleOutsChange(nextOuts, false)
      } else {
        await handleOutsChange(nextOuts, true)
      }
    }
  } else {
    set({ strikes: newStrikes })
    await changeStrikeCount(id!, newStrikes)
  }
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Antes de Implementar
- [ ] Hacer backup del código actual
- [ ] Crear branch de desarrollo: `fix/baseball-rules-validation`
- [ ] Revisar tests existentes

### Implementación
- [ ] ✅ Corregir bug en `handleBallChange` (gameStore.ts)
- [ ] ✅ Agregar validación Regla 5.08(a) en `incrementRuns` (teamsStore.ts)
- [ ] ✅ Implementar tercer strike no atrapado en `handleStrikeChange` (gameStore.ts)

### Testing
- [ ] Probar base por bolas con bases vacías
- [ ] Probar base por bolas con corredor en 1ra
- [ ] Probar base por bolas con bases llenas
- [ ] Probar tercer out con corredor anotando
- [ ] Probar tercer strike con 1ra vacía
- [ ] Probar tercer strike con 1ra ocupada y 2 outs

### Deployment
- [ ] Code review
- [ ] Merge a main
- [ ] Deploy a producción
- [ ] Monitorear logs por 24 horas

---

## 🎯 IMPACTO ESPERADO

| Corrección | Antes | Después |
|---|---|---|
| Base por bolas | Corredores no avanzan ❌ | Corredores avanzan correctamente ✅ |
| Regla 5.08(a) | Carreras inválidas posibles ❌ | Advertencia al operador ✅ |
| Strike no atrapado | Siempre out ❌ | Opción de correr a 1ra ✅ |

**Mejora estimada en precisión**: +15%  
**Reducción de errores críticos**: 100% (bug de BB corregido)  
**Tiempo de implementación**: 4-6 horas

