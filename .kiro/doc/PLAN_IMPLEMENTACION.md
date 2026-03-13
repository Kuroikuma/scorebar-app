# 🚀 PLAN DE IMPLEMENTACIÓN — Correcciones Béisbol ScoreBar App

## 📅 SPRINT 1: Correcciones Críticas (1 semana)

### 🔴 DÍA 1: Bug Crítico - Base por Bolas

**Objetivo**: Corregir el bucle que impide el avance de corredores en BB

**Tareas**:
1. ✅ Abrir `app/store/gameStore.ts`
2. ✅ Localizar función `handleBallChange` (línea ~430)
3. ✅ Cambiar bucle:
   ```typescript
   // ANTES:
   for (let i = 0; i >= 2; i++)
   
   // DESPUÉS:
   for (let i = 2; i >= 0; i--)
   ```
4. ✅ Agregar lógica de anotación cuando corredor de 3ra avanza:
   ```typescript
   if (i + 1 < 3) {
     newBases[i + 1] = { isOccupied: true, playerId: newBases[i].playerId }
   } else {
     // Corredor en tercera anota
     await useTeamsStore.getState().incrementRuns(isTopInning ? 0 : 1, 1, false);
   }
   ```
5. ✅ Limpiar base original: `newBases[i] = { isOccupied: false, playerId: null }`

**Testing**:
- [ ] Caso 1: BB con bases vacías → Bateador a 1ra ✅
- [ ] Caso 2: BB con corredor en 1ra → Ambos avanzan ✅
- [ ] Caso 3: BB con bases llenas → Todos avanzan, carrera anota ✅

**Tiempo estimado**: 2 horas (1h implementación + 1h testing)

---

### 🟡 DÍA 2-3: Validación Regla 5.08(a)

**Objetivo**: Prevenir anotación de carreras inválidas en tercer out

**Opción A: Advertencia (Recomendada para Sprint 1)**

**Tareas**:
1. ✅ Abrir `app/store/teamsStore.ts`
2. ✅ Localizar función `incrementRuns`
3. ✅ Agregar validación:
   ```typescript
   incrementRuns: async (teamIndex, newRuns, isSaved = true) => {
     const { outs } = useGameStore.getState();
     
     if (outs === 3 && newRuns > 0) {
       toast.warning(
         "⚠️ VERIFICAR REGLA 5.08(a): ¿El tercer out fue sobre el bateador-corredor antes de tocar 1ra?",
         { duration: 5000 }
       );
     }
     // ... resto del código
   }
   ```

**Testing**:
- [ ] Caso 1: 2 outs, corredor anota, bateador out en 1ra → Mostrar advertencia ✅
- [ ] Caso 2: 2 outs, corredor anota, out en 2da → Mostrar advertencia ✅
- [ ] Caso 3: 1 out, corredor anota → No mostrar advertencia ✅

**Tiempo estimado**: 3 horas (1h implementación + 2h testing)

---

### 🟡 DÍA 4-5: Tercer Strike No Atrapado

**Objetivo**: Permitir al bateador correr a 1ra cuando aplique la regla

**Tareas**:
1. ✅ Abrir `app/store/gameStore.ts`
2. ✅ Localizar función `handleStrikeChange`
3. ✅ Agregar validación:
   ```typescript
   if (newStrikes === 3) {
     const firstBaseEmpty = !bases[0].isOccupied;
     const twoOuts = outs === 2;
     const canRunToFirst = firstBaseEmpty || twoOuts;

     if (canRunToFirst) {
       // Mostrar diálogo: ¿Atrapó el catcher?
       // Si NO atrapó: resetear conteo, permitir avance manual
     } else {
       // Out automático
       await handleOutsChange(nextOuts)
     }
   }
   ```
4. ✅ Crear componente de diálogo rápido (opcional)

**Testing**:
- [ ] Caso 1: 3er strike, 1ra vacía, 0 outs → Preguntar si atrapó ✅
- [ ] Caso 2: 3er strike, 1ra ocupada, 2 outs → Preguntar si atrapó ✅
- [ ] Caso 3: 3er strike, 1ra ocupada, 1 out → Out automático ✅

**Tiempo estimado**: 4 horas (2h implementación + 2h testing)

---

## 📅 SPRINT 2: Mejora de Avance en Single (1 semana)

### 🎯 DÍA 1-2: Actualizar `hitPlay.tsx`

**Tareas**:
1. ✅ Modificar función `determineForced`:
   ```typescript
   if (hitType === TypeHitting.Single) {
     if (base === 0) return true;  // 1ra siempre forzado
     if (base === 1) return basesMap[0] === true;  // 2da forzado si hay corredor en 1ra
     if (base === 2) return false;  // 3ra nunca forzado
   }
   ```

2. ✅ Actualizar `handleHitAction` para Single:
   ```typescript
   if (hitType === TypeHitting.Single) {
     for (let i = 2; i >= 0; i--) {
       if (bases[i].isOccupied) {
         const isForced = determineForced(i, hitType, occupiedBases)
         if (i === 2) {
           potentialRuns = 1
         }
         runnersToCheck.push({ base: i, isOccupied: true, isForced })
       }
     }
   }
   ```

3. ✅ Modificar `executeHit` para aceptar `runnerResults`

**Testing**:
- [ ] Caso 1: Single con corredor en 3ra → Mostrar interfaz ✅
- [ ] Caso 2: Single con corredor en 1ra → Mostrar como forzado ✅
- [ ] Caso 3: Single con corredores en 1ra y 2da → Ambos forzados ✅

**Tiempo estimado**: 6 horas (4h implementación + 2h testing)

---

### 🎯 DÍA 3-4: Actualizar `gameStore.ts`

**Tareas**:
1. ✅ Modificar interfaz `GameState`:
   ```typescript
   handleSingle: (
     runsScored: number, 
     runnerResults?: { base: number; result: "safe" | "out" | "stay" }[]
   ) => Promise<void>
   ```

2. ✅ Reescribir `handleSingle`:
   ```typescript
   handleSingle: async (runsScored, runnerResults) => {
     // Construir newBases basándose en runnerResults
     // Lógica por defecto si runnerResults es undefined
   }
   ```

**Testing**:
- [ ] Caso 1: Single sin resultados → Usar lógica por defecto ✅
- [ ] Caso 2: Single con resultados → Aplicar resultados ✅
- [ ] Caso 3: Verificar compatibilidad con `advance-runners.tsx` ✅

**Tiempo estimado**: 6 horas (4h implementación + 2h testing)

---

### 🎯 DÍA 5: Testing Integral

**Escenarios de prueba**:
1. [ ] Single sin corredores
2. [ ] Single con corredor en 3ra (safe)
3. [ ] Single con corredor en 3ra (out)
4. [ ] Single con corredor en 3ra (quedarse)
5. [ ] Single con corredor en 1ra
6. [ ] Single con corredores en 1ra y 2da
7. [ ] Single con bases llenas
8. [ ] Single con 2 outs (verificar cambio de inning)
9. [ ] Undo/Redo después de Single
10. [ ] Persistencia en backend

**Tiempo estimado**: 8 horas

---

## 📅 SPRINT 3: Funcionalidades Adicionales (2 semanas)

### Semana 1: Bases Robadas y Sacrificios

**DÍA 1-3: Bases Robadas**
```typescript
handleStolenBase: async (baseFrom: number, baseTo: number, isOut: boolean) => {
  // Implementar lógica de robo
  // Actualizar estadísticas del corredor
  // Registrar en ITurnAtBat
}
```

**DÍA 4-5: Sacrificios**
```typescript
handleSacrificeBunt: async () => {
  // Avanza corredores, bateador out
  // NO cuenta como turno al bat oficial
}

handleSacrificeFly: async () => {
  // Corredor anota desde 3ra, bateador out
}
```

---

### Semana 2: Balk y Refactorización

**DÍA 1-2: Balk**
```typescript
handleBalk: async () => {
  // Todos los corredores avanzan una base
  const advances: RunnerAdvance[] = []
  bases.forEach((base, index) => {
    if (base.isOccupied) {
      advances.push({ fromBase: index, toBase: index + 1 })
    }
  })
  await handleAdvanceRunners(advances)
}
```

**DÍA 3-5: Refactorización Undo/Redo**
- Guardar estados completos en lugar de parciales
- Validar consistencia al restaurar
- Prevenir estados inválidos

---

## 📋 CHECKLIST GENERAL

### Antes de Cada Sprint
- [ ] Crear branch: `fix/baseball-sprint-X`
- [ ] Backup del código actual
- [ ] Revisar tests existentes
- [ ] Comunicar al equipo

### Durante el Sprint
- [ ] Commits frecuentes con mensajes descriptivos
- [ ] Code review diario
- [ ] Testing continuo
- [ ] Actualizar documentación

### Al Finalizar el Sprint
- [ ] Testing completo de regresión
- [ ] Code review final
- [ ] Merge a `develop`
- [ ] Deploy a staging
- [ ] Validación con usuarios
- [ ] Merge a `main`
- [ ] Deploy a producción
- [ ] Monitoreo por 48 horas

---

## 🎯 CRITERIOS DE ÉXITO

### Sprint 1
- ✅ Bug de BB corregido y validado
- ✅ Advertencia Regla 5.08(a) funcionando
- ✅ Tercer strike no atrapado implementado
- ✅ 0 regresiones detectadas

### Sprint 2
- ✅ Single maneja todos los corredores
- ✅ Interfaz clara con indicadores de forzado
- ✅ Precisión mejorada en +20%
- ✅ Compatibilidad con `advance-runners.tsx`

### Sprint 3
- ✅ Bases robadas funcionando
- ✅ Sacrificios implementados
- ✅ Balk funcionando
- ✅ Sistema undo/redo mejorado

---

## 📊 MÉTRICAS DE SEGUIMIENTO

### Durante Implementación
- Commits por día
- Tests pasando / Total tests
- Code coverage
- Tiempo real vs estimado

### Post-Implementación
- Bugs reportados en producción
- Tiempo promedio de operación
- Satisfacción del operador
- Precisión de marcador (auditoría manual)

---

## 🚨 PLAN DE CONTINGENCIA

### Si se detecta bug crítico en producción
1. Revertir deploy inmediatamente
2. Analizar logs y reproducir bug
3. Hotfix en branch separado
4. Testing acelerado
5. Deploy de hotfix
6. Post-mortem

### Si el Sprint se retrasa
1. Priorizar correcciones críticas (Sprint 1)
2. Posponer mejoras opcionales (Sprint 3)
3. Comunicar nuevo timeline
4. Ajustar recursos si es necesario

---

## 📞 CONTACTOS Y RECURSOS

### Equipo
- **Tech Lead**: [Nombre]
- **Desarrollador Backend**: [Nombre]
- **Desarrollador Frontend**: [Nombre]
- **QA**: [Nombre]

### Recursos
- Documentación: `README_ANALISIS.md`
- Código de correcciones: `CORRECCIONES_PRIORITARIAS.md`
- Solución Single: `SOLUCION_AVANCE_SINGLE.md`
- Reglas oficiales: `reglas_text_full.txt`

### Herramientas
- Control de versiones: Git
- CI/CD: [Herramienta]
- Testing: [Framework]
- Monitoreo: [Herramienta]

---

## ✅ CONCLUSIÓN

Este plan de implementación está diseñado para:
1. ✅ Corregir bugs críticos rápidamente (Sprint 1)
2. ✅ Mejorar precisión gradualmente (Sprint 2)
3. ✅ Agregar funcionalidades adicionales (Sprint 3)
4. ✅ Mantener calidad y estabilidad en todo momento

**Tiempo total estimado**: 4 semanas  
**Riesgo**: BAJO (cambios incrementales y bien documentados)  
**ROI**: ALTO (mejora significativa en precisión y cumplimiento de reglas)

---

**Fecha de creación**: 2024  
**Versión**: 1.0  
**Estado**: Listo para implementación

