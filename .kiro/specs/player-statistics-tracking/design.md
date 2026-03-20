# Design Document: Player Statistics Tracking

## Overview

This design specifies the implementation of a comprehensive player statistics tracking system for ScoreBar. The system automatically tracks offensive (batting), defensive (fielding), and pitching statistics for all players during live games, following MLB Official Rules for stat attribution.

### Goals

- Automatically track batting statistics (at-bats, walks, strikeouts, RBI, runs scored, etc.)
- Track defensive statistics (putouts, assists, errors)
- Track pitching statistics (innings pitched, hits allowed, earned runs, strikeouts, etc.)
- Calculate derived statistics (batting average, ERA, OBP, SLG, WHIP)
- Integrate seamlessly with existing game event handlers
- Maintain real-time synchronization across all connected clients
- Support undo/redo operations for stat corrections
- Display statistics on broadcast overlays
- Export complete game statistics in CSV and PDF formats

### Non-Goals

- Implementing new game event types (use existing handlers)
- Creating new Socket.io connections (use existing infrastructure)
- Modifying MLB rule implementations (follow existing patterns)
- Advanced analytics beyond basic statistics

## Architecture

### High-Level Design

The statistics tracking system extends the existing Zustand store architecture with new stat fields on the `Player` type and new methods in `teamsStore` for stat management. Statistics are updated automatically when game events occur through existing handlers in `gameStore`.

```
┌─────────────────────────────────────────────────────────────┐
│                     Game Event Handlers                      │
│  (handleSingle, handleDouble, handleOutPlay, etc.)          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Statistics Update Functions                     │
│  (updateBattingStats, updatePitchingStats, etc.)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    teamsStore (Zustand)                      │
│  - Player lineup with extended stat fields                   │
│  - Stat update methods                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├──────────────┬──────────────┬───────────┤
                     ▼              ▼              ▼           ▼
              ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐
              │ Backend  │   │ Socket   │   │ History  │  │ Overlay  │
              │   API    │   │  Sync    │   │  Store   │  │  Display │
              └──────────┘   └──────────┘   └──────────┘  └──────────┘
```

### Component Responsibilities


**teamsStore (app/store/teamsStore.ts)**
- Stores player lineup with extended statistics fields
- Provides methods for updating individual player statistics
- Handles stat persistence via Backend API
- Manages socket synchronization for stat updates
- Integrates with historiStore for undo/redo

**gameStore (app/store/gameStore.ts)**
- Existing game event handlers (handleSingle, handleDouble, etc.)
- Calls teamsStore stat update methods when events occur
- Maintains existing game state management
- No breaking changes to existing functionality

**Backend API (app/service/api.ts)**
- Existing endpoints: `updatePlayerStats`, `incrementPlayerStat`
- Batch update support for multiple stat changes
- Socket ID inclusion to prevent echo updates
- Error handling and retry logic

**historiStore (app/store/historiStore.ts)**
- Existing undo/redo infrastructure
- Extended to track stat changes
- Maintains stat consistency across undo/redo operations

**Overlay Components**
- Display current batter and pitcher statistics
- Real-time updates via Zustand subscriptions
- Formatted display (AVG, ERA, etc.)
- Use existing overlay positioning infrastructure

## Data Models

### Extended Player Type

The `Player` type in `app/store/teamsStore.ts` is extended with new optional fields for statistics tracking:

```typescript
export type Player = {
  // Existing fields
  _id?: string
  name: string
  position: string
  number: string
  battingOrder: number
  defensiveOrder: number
  turnsAtBat: ITurnAtBat[]
  
  // Existing defensive stats (already implemented)
  wildPitches?: number
  passedBalls?: number
  strikeoutsThrown?: number
  balks?: number
  stolenBases?: number
  caughtStealing?: number
  caughtStealingBy?: number
  
  // NEW: Offensive batting statistics
  atBats?: number                    // Official at-bats (Rule 9.02)
  walks?: number                     // Base on balls (BB)
  strikeoutsReceived?: number        // Strikeouts as a batter
  hitByPitch?: number                // Hit by pitch (HBP)
  rbi?: number                       // Runs batted in (Rule 9.04)
  runsScored?: number                // Runs scored
  sacrificeFlies?: number            // Sacrifice flies (SF)
  sacrificeBunts?: number            // Sacrifice bunts (SH)
  
  // NEW: Defensive fielding statistics
  putouts?: number                   // Putouts (Rule 9.10)
  assists?: number                   // Assists (Rule 9.11)
  errors?: number                    // Fielding errors
  
  // NEW: Pitcher statistics
  inningsPitched?: number            // Innings pitched (fractional: 0.1 = ⅓ inning)
  hitsAllowed?: number               // Hits allowed
  runsAllowed?: number               // Total runs allowed
  earnedRuns?: number                // Earned runs (Rule 9.16)
  walksAllowed?: number              // Walks issued
  hitByPitchAllowed?: number         // Batters hit by pitch
  homeRunsAllowed?: number           // Home runs allowed
  wins?: number                      // Pitcher wins
  losses?: number                    // Pitcher losses
  saves?: number                     // Saves (Rule 9.19)
  
  // Existing substitution fields
  isSubstituted?: boolean
  substitutedBy?: string
  substituteFor?: string
  canReturnAsFielder?: boolean
  battingAverage?: number
}
```

### Stat Initialization

All new stat fields are optional and default to `undefined`. When a player is added to a lineup or bench, stats are initialized to 0:

```typescript
const initializePlayerStats = (player: Player): Player => ({
  ...player,
  atBats: player.atBats ?? 0,
  walks: player.walks ?? 0,
  strikeoutsReceived: player.strikeoutsReceived ?? 0,
  hitByPitch: player.hitByPitch ?? 0,
  rbi: player.rbi ?? 0,
  runsScored: player.runsScored ?? 0,
  sacrificeFlies: player.sacrificeFlies ?? 0,
  sacrificeBunts: player.sacrificeBunts ?? 0,
  putouts: player.putouts ?? 0,
  assists: player.assists ?? 0,
  errors: player.errors ?? 0,
  inningsPitched: player.inningsPitched ?? 0,
  hitsAllowed: player.hitsAllowed ?? 0,
  runsAllowed: player.runsAllowed ?? 0,
  earnedRuns: player.earnedRuns ?? 0,
  walksAllowed: player.walksAllowed ?? 0,
  hitByPitchAllowed: player.hitByPitchAllowed ?? 0,
  homeRunsAllowed: player.homeRunsAllowed ?? 0,
  wins: player.wins ?? 0,
  losses: player.losses ?? 0,
  saves: player.saves ?? 0,
})
```


## Components and Interfaces

### teamsStore Methods

New methods added to `teamsStore` for statistics management:

```typescript
export type TeamsState = {
  // ... existing fields ...
  
  // NEW: Batting statistics methods
  updateBattingStats: (
    teamIndex: number,
    playerId: string,
    stats: Partial<Pick<Player, 'atBats' | 'walks' | 'strikeoutsReceived' | 'hitByPitch' | 'rbi' | 'runsScored' | 'sacrificeFlies' | 'sacrificeBunts'>>
  ) => Promise<void>
  
  incrementAtBats: (teamIndex: number, playerId: string) => Promise<void>
  incrementWalks: (teamIndex: number, playerId: string) => Promise<void>
  incrementStrikeoutsReceived: (teamIndex: number, playerId: string) => Promise<void>
  incrementHitByPitch: (teamIndex: number, playerId: string) => Promise<void>
  incrementRBI: (teamIndex: number, playerId: string, count: number) => Promise<void>
  incrementRunsScored: (teamIndex: number, playerId: string) => Promise<void>
  incrementSacrificeFlies: (teamIndex: number, playerId: string) => Promise<void>
  incrementSacrificeBunts: (teamIndex: number, playerId: string) => Promise<void>
  
  // NEW: Defensive statistics methods
  updateDefensiveStats: (
    teamIndex: number,
    playerId: string,
    stats: Partial<Pick<Player, 'putouts' | 'assists' | 'errors'>>
  ) => Promise<void>
  
  incrementPutouts: (teamIndex: number, playerId: string) => Promise<void>
  incrementAssists: (teamIndex: number, playerId: string) => Promise<void>
  incrementErrors: (teamIndex: number, playerId: string) => Promise<void>
  recordDefensivePlay: (
    teamIndex: number,
    putoutPlayerId: string,
    assistPlayerIds: string[]
  ) => Promise<void>
  
  // NEW: Pitching statistics methods
  updatePitchingStats: (
    teamIndex: number,
    playerId: string,
    stats: Partial<Pick<Player, 'inningsPitched' | 'hitsAllowed' | 'runsAllowed' | 'earnedRuns' | 'walksAllowed' | 'hitByPitchAllowed' | 'homeRunsAllowed' | 'wins' | 'losses' | 'saves'>>
  ) => Promise<void>
  
  incrementInningsPitched: (teamIndex: number, playerId: string, outs: number) => Promise<void>
  incrementHitsAllowed: (teamIndex: number, playerId: string) => Promise<void>
  incrementRunsAllowed: (teamIndex: number, playerId: string, count: number) => Promise<void>
  incrementEarnedRuns: (teamIndex: number, playerId: string, count: number) => Promise<void>
  incrementWalksAllowed: (teamIndex: number, playerId: string) => Promise<void>
  incrementHitByPitchAllowed: (teamIndex: number, playerId: string) => Promise<void>
  incrementHomeRunsAllowed: (teamIndex: number, playerId: string) => Promise<void>
  recordPitcherWin: (teamIndex: number, playerId: string) => Promise<void>
  recordPitcherLoss: (teamIndex: number, playerId: string) => Promise<void>
  recordPitcherSave: (teamIndex: number, playerId: string) => Promise<void>
  
  // NEW: Derived statistics calculations
  calculateBattingAverage: (playerId: string, teamIndex: number) => number
  calculateERA: (playerId: string, teamIndex: number) => number
  calculateOBP: (playerId: string, teamIndex: number) => number
  calculateSLG: (playerId: string, teamIndex: number) => number
  calculateWHIP: (playerId: string, teamIndex: number) => number
}
```

### Integration with Game Event Handlers

Existing game event handlers in `gameStore` are extended to update statistics:

**handleSingle / handleDouble / handleTriple**
```typescript
// After existing logic that updates bases and team hits
await useTeamsStore.getState().incrementAtBats(teamIndex, currentBatter._id!)
await useTeamsStore.getState().incrementRBI(teamIndex, currentBatter._id!, runsScored)

// Update pitcher stats
const defensiveTeamIndex = isTopInning ? 1 : 0
const pitcher = getCurrentPitcher()
if (pitcher) {
  await useTeamsStore.getState().incrementHitsAllowed(defensiveTeamIndex, pitcher._id!)
  await useTeamsStore.getState().incrementRunsAllowed(defensiveTeamIndex, pitcher._id!, runsScored)
}
```

**handleHomeRun**
```typescript
// After existing logic
await useTeamsStore.getState().incrementAtBats(teamIndex, currentBatter._id!)
await useTeamsStore.getState().incrementRBI(teamIndex, currentBatter._id!, runsScored)
await useTeamsStore.getState().incrementRunsScored(teamIndex, currentBatter._id!)

// Update pitcher stats
const pitcher = getCurrentPitcher()
if (pitcher) {
  await useTeamsStore.getState().incrementHitsAllowed(defensiveTeamIndex, pitcher._id!)
  await useTeamsStore.getState().incrementHomeRunsAllowed(defensiveTeamIndex, pitcher._id!)
  await useTeamsStore.getState().incrementRunsAllowed(defensiveTeamIndex, pitcher._id!, runsScored)
}
```

**handleBBPlay**
```typescript
// After existing logic (note: walks do NOT increment atBats per Rule 9.02)
await useTeamsStore.getState().incrementWalks(teamIndex, currentBatter._id!)

// Update pitcher stats
const pitcher = getCurrentPitcher()
if (pitcher) {
  await useTeamsStore.getState().incrementWalksAllowed(defensiveTeamIndex, pitcher._id!)
}
```

**handleHitByPitch**
```typescript
// After existing logic (note: HBP does NOT increment atBats per Rule 9.02)
await useTeamsStore.getState().incrementHitByPitch(teamIndex, currentBatter._id!)

// Update pitcher stats
const pitcher = getCurrentPitcher()
if (pitcher) {
  await useTeamsStore.getState().incrementHitByPitchAllowed(defensiveTeamIndex, pitcher._id!)
}
```

**handleOutPlay**
```typescript
// After existing logic
await useTeamsStore.getState().incrementAtBats(teamIndex, currentBatter._id!)

// Prompt for defensive attribution (putouts/assists)
// This will be handled by a new UI modal component
```

**handleStrikeChange (when strikes === 3)**
```typescript
// After existing dropped third strike logic
await useTeamsStore.getState().incrementStrikeoutsReceived(teamIndex, currentBatter._id!)

// Update pitcher stats (already handled in recordDroppedThirdStrikeStats)
// strikeoutsThrown is incremented there
```

**handleOutsChange**
```typescript
// After each out is recorded
const pitcher = getCurrentPitcher()
if (pitcher) {
  // Increment innings pitched by 0.1 (representing ⅓ inning)
  await useTeamsStore.getState().incrementInningsPitched(defensiveTeamIndex, pitcher._id!, 1)
}
```


### Defensive Play Attribution UI

A new modal component is needed to prompt for putout and assist attribution when an out is recorded:

**DefensivePlayModal Component**
```typescript
interface DefensivePlayModalProps {
  isOpen: boolean
  onClose: () => void
  defensiveTeam: Team
  onSubmit: (putoutPlayerId: string, assistPlayerIds: string[]) => void
}

// Features:
// - Dropdown to select player who recorded the putout
// - Multi-select for players who assisted (0-3 assists typical)
// - Quick buttons for common plays (6-3, 4-3, 1-3, etc.)
// - Validation: at least one putout must be selected
```

This modal is triggered after `handleOutPlay` completes and before advancing the batter.

### Backend API Integration

The system uses existing API endpoints with minimal modifications:

**Existing Endpoints (no changes needed)**
```typescript
// Update multiple stats at once
updatePlayerStats(gameId, teamIndex, playerId, stats)

// Increment a single stat
incrementPlayerStat(gameId, teamIndex, playerId, statField, incrementBy)

// Get player stats
getPlayerStats(gameId, teamIndex, playerId)
```

**Batching Strategy**

When multiple stats need to be updated simultaneously (e.g., hit + RBI + pitcher stats), batch them into a single `updatePlayerStats` call:

```typescript
// Instead of 3 separate API calls:
await incrementAtBats(...)
await incrementRBI(...)
await incrementHitsAllowed(...)

// Use one batched call:
await updatePlayerStats(gameId, teamIndex, batterId, {
  atBats: (player.atBats ?? 0) + 1,
  rbi: (player.rbi ?? 0) + runsScored
})
await updatePlayerStats(gameId, defensiveTeamIndex, pitcherId, {
  hitsAllowed: (pitcher.hitsAllowed ?? 0) + 1
})
```

## Real-Time Synchronization Strategy

### Socket Event Flow

The system leverages existing Socket.io infrastructure without creating new connections:

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│  Client A   │                    │   Backend   │                    │  Client B   │
│  (Operator) │                    │   Server    │                    │  (Overlay)  │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │ 1. User action (hit)             │                                  │
       │────────────────────────────────> │                                  │
       │                                  │                                  │
       │ 2. Update local state            │                                  │
       │    (optimistic update)           │                                  │
       │                                  │                                  │
       │ 3. API call with socketId        │                                  │
       │────────────────────────────────> │                                  │
       │                                  │                                  │
       │                                  │ 4. Broadcast to other clients    │
       │                                  │    (exclude socketId)            │
       │                                  │─────────────────────────────────>│
       │                                  │                                  │
       │                                  │                                  │ 5. Update local state
       │                                  │                                  │    (from socket event)
       │                                  │                                  │
```

### Socket Event Types

New socket events for statistics synchronization:

```typescript
// Emitted when player stats are updated
socket.on('player:stats:updated', (data: {
  gameId: string
  teamIndex: number
  playerId: string
  stats: Partial<Player>
}) => {
  // Update local Zustand store
  useTeamsStore.getState().handleSocketPlayerStats(data.teamIndex, data.playerId, data.stats)
})

// Emitted when defensive play is recorded
socket.on('defensive:play:recorded', (data: {
  gameId: string
  teamIndex: number
  putoutPlayerId: string
  assistPlayerIds: string[]
}) => {
  // Update local Zustand store with putouts/assists
  useTeamsStore.getState().handleSocketDefensivePlay(data)
})
```

### Echo Prevention

All API requests include `socketId` to prevent echo updates:

```typescript
// In api.ts interceptor (already implemented)
api.interceptors.request.use((config) => {
  config.data.socketId = socket.id || ""
  return config
})

// Backend excludes the originating socket when broadcasting
io.to(gameId).except(socketId).emit('player:stats:updated', data)
```

## MLB Rules Implementation

### Rule 9.02: At-Bat Determination

An at-bat is charged to a batter EXCEPT when:
- The batter receives a base on balls (BB)
- The batter is hit by a pitch (HBP)
- The batter hits a sacrifice fly (SF)
- The batter hits a sacrifice bunt (SH)
- The batter is awarded first base due to interference or obstruction

Implementation:
```typescript
const shouldIncrementAtBats = (eventType: TypeHitting): boolean => {
  const excludedEvents = [
    TypeHitting.BaseByBall,
    TypeHitting.HitByPitch,
    // Sacrifice fly/bunt would be new event types to add
  ]
  return !excludedEvents.includes(eventType)
}
```

### Rule 9.04: RBI Attribution

A run batted in is credited when:
- A batter's hit, sacrifice fly, infield out, or fielder's choice causes a run to score
- A run scores on a walk, hit by pitch, or interference with bases loaded
- A run scores due to an error if the run would have scored anyway

Implementation:
```typescript
const calculateRBI = (
  eventType: TypeHitting,
  runsScored: number,
  basesLoadedBeforePlay: boolean
): number => {
  // For hits, all runs scored are RBI
  if ([TypeHitting.Single, TypeHitting.Double, TypeHitting.Triple, TypeHitting.HomeRun].includes(eventType)) {
    return runsScored
  }
  
  // For walks/HBP, only RBI if bases were loaded
  if ([TypeHitting.BaseByBall, TypeHitting.HitByPitch].includes(eventType)) {
    return basesLoadedBeforePlay ? runsScored : 0
  }
  
  // For outs, RBI if run scored (sacrifice fly, productive out)
  if (eventType === TypeHitting.Out) {
    return runsScored
  }
  
  // Errors: no RBI (unless run would have scored anyway - requires manual judgment)
  return 0
}
```


### Rule 9.10: Putout Attribution

A putout is credited to the fielder who:
- Catches a fly ball or line drive
- Catches a thrown ball that puts out a batter or runner
- Tags a runner when the runner is off base

Implementation:
```typescript
// Putout is recorded via DefensivePlayModal
// Common scenarios:
// - Strikeout: catcher gets putout (position 2)
// - Ground out to first: first baseman gets putout (position 3)
// - Fly out: outfielder who catches gets putout
// - Force out at base: fielder covering base gets putout
```

### Rule 9.11: Assist Attribution

An assist is credited to a fielder who:
- Throws or deflects a batted or thrown ball in such a way that a putout results
- Handles the ball on a play that results in a putout

Implementation:
```typescript
// Assists are recorded via DefensivePlayModal
// Common scenarios:
// - 6-3 ground out: shortstop (6) gets assist, first baseman (3) gets putout
// - 4-6-3 double play: second baseman (4) and shortstop (6) get assists, first baseman (3) gets putout
// - Outfield assist: outfielder gets assist if throw results in out at base
```

### Rule 9.16: Earned Run Determination

An earned run is charged to the pitcher when a run scores without the aid of an error or passed ball.

Implementation:
```typescript
const determineEarnedRuns = (
  runsScored: number,
  errorOccurredInInning: boolean,
  runsScoredAfterError: number
): { earnedRuns: number; unearnedRuns: number } => {
  if (!errorOccurredInInning) {
    // No errors: all runs are earned
    return { earnedRuns: runsScored, unearnedRuns: 0 }
  }
  
  // If error occurred, runs scored after the error are unearned
  const earnedRuns = runsScored - runsScoredAfterError
  const unearnedRuns = runsScoredAfterError
  
  return { earnedRuns, unearnedRuns }
}

// Simplified implementation: track if error occurred in current inning
// When runs score, check if error flag is set
// This is a simplified version; full implementation requires tracking
// which runners reached base due to errors
```

### Innings Pitched Calculation

Innings pitched are measured in thirds (3 outs = 1 inning):
- 1 out = 0.1 innings (displayed as 0.1 or ⅓)
- 2 outs = 0.2 innings (displayed as 0.2 or ⅔)
- 3 outs = 1.0 inning (displayed as 1.0 or 1)

Implementation:
```typescript
const incrementInningsPitched = (currentIP: number, outs: number): number => {
  // Each out adds 0.1 to innings pitched
  const newIP = currentIP + (outs * 0.1)
  
  // Round to nearest 0.1 to avoid floating point errors
  return Math.round(newIP * 10) / 10
}

// Display formatting
const formatInningsPitched = (ip: number): string => {
  const wholeInnings = Math.floor(ip)
  const fraction = Math.round((ip - wholeInnings) * 10)
  
  if (fraction === 0) return `${wholeInnings}.0`
  return `${wholeInnings}.${fraction}`
}
```

## Derived Statistics Calculations

### Batting Average (AVG)

Formula: Hits ÷ At-Bats

```typescript
const calculateBattingAverage = (player: Player): number => {
  const hits = countHits(player.turnsAtBat)
  const atBats = player.atBats ?? 0
  
  if (atBats === 0) return 0.000
  
  const avg = hits / atBats
  return Math.round(avg * 1000) / 1000 // Round to 3 decimal places
}

const countHits = (turnsAtBat: ITurnAtBat[]): number => {
  return turnsAtBat.filter(turn => 
    [TypeHitting.Single, TypeHitting.Double, TypeHitting.Triple, TypeHitting.HomeRun]
      .includes(turn.typeHitting)
  ).length
}
```

### Earned Run Average (ERA)

Formula: (Earned Runs × 9) ÷ Innings Pitched

```typescript
const calculateERA = (player: Player): number => {
  const earnedRuns = player.earnedRuns ?? 0
  const inningsPitched = player.inningsPitched ?? 0
  
  if (inningsPitched < 0.1) return 0.00
  
  const era = (earnedRuns * 9) / inningsPitched
  return Math.round(era * 100) / 100 // Round to 2 decimal places
}
```

### On-Base Percentage (OBP)

Formula: (Hits + Walks + HBP) ÷ (At-Bats + Walks + HBP + Sacrifice Flies)

```typescript
const calculateOBP = (player: Player): number => {
  const hits = countHits(player.turnsAtBat)
  const walks = player.walks ?? 0
  const hbp = player.hitByPitch ?? 0
  const atBats = player.atBats ?? 0
  const sf = player.sacrificeFlies ?? 0
  
  const numerator = hits + walks + hbp
  const denominator = atBats + walks + hbp + sf
  
  if (denominator === 0) return 0.000
  
  const obp = numerator / denominator
  return Math.round(obp * 1000) / 1000
}
```

### Slugging Percentage (SLG)

Formula: Total Bases ÷ At-Bats

```typescript
const calculateSLG = (player: Player): number => {
  const totalBases = calculateTotalBases(player.turnsAtBat)
  const atBats = player.atBats ?? 0
  
  if (atBats === 0) return 0.000
  
  const slg = totalBases / atBats
  return Math.round(slg * 1000) / 1000
}

const calculateTotalBases = (turnsAtBat: ITurnAtBat[]): number => {
  return turnsAtBat.reduce((total, turn) => {
    switch (turn.typeHitting) {
      case TypeHitting.Single: return total + 1
      case TypeHitting.Double: return total + 2
      case TypeHitting.Triple: return total + 3
      case TypeHitting.HomeRun: return total + 4
      default: return total
    }
  }, 0)
}
```

### Walks plus Hits per Inning Pitched (WHIP)

Formula: (Walks Allowed + Hits Allowed) ÷ Innings Pitched

```typescript
const calculateWHIP = (player: Player): number => {
  const walksAllowed = player.walksAllowed ?? 0
  const hitsAllowed = player.hitsAllowed ?? 0
  const inningsPitched = player.inningsPitched ?? 0
  
  if (inningsPitched < 0.1) return 0.00
  
  const whip = (walksAllowed + hitsAllowed) / inningsPitched
  return Math.round(whip * 100) / 100
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: At-Bat Counting Excludes Non-Qualifying Events

*For any* plate appearance, incrementing atBats should only occur when the event type is NOT a walk, hit-by-pitch, sacrifice fly, or sacrifice bunt, in accordance with Rule 9.02.

**Validates: Requirements 1.1, 4.6, 4.7**

### Property 2: Walk Events Increment Walk Counter

*For any* game state where a batter receives a walk (4 balls), the batter's walks count should increase by exactly 1.

**Validates: Requirements 1.2, 4.6**

### Property 3: Strikeout Events Update Both Batter and Pitcher

*For any* strikeout event (3 strikes), both the batter's strikeoutsReceived and the active pitcher's strikeoutsThrown should increment by 1.

**Validates: Requirements 1.3, 4.9**

### Property 4: Hit-By-Pitch Events Increment HBP Counter

*For any* hit-by-pitch event, the batter's hitByPitch count should increase by 1 without incrementing atBats.

**Validates: Requirements 1.4, 4.7**

### Property 5: RBI Attribution Matches Runs Scored

*For any* scoring play (hit, sacrifice fly, bases-loaded walk), the batter's RBI count should increase by the number of runs that scored as a direct result of the batter's action, following Rule 9.04.

**Validates: Requirements 1.5, 4.1, 4.2, 4.3, 4.4**

### Property 6: Runs Scored Increments for Home Plate Crossings

*For any* player who crosses home plate, that player's runsScored count should increment by 1.

**Validates: Requirements 1.6, 4.10**

### Property 7: Defensive Play Records Putout and Assists

*For any* defensive play resulting in an out, exactly one fielder should receive a putout credit, and zero or more fielders should receive assist credits.

**Validates: Requirements 2.1, 2.2, 2.5**

### Property 8: Error Events Increment Fielder Error Count

*For any* error event attributed to a specific fielder, that fielder's errors count should increment by 1.

**Validates: Requirements 2.3, 4.8**

### Property 9: Pitcher Innings Pitched Increments by Thirds

*For any* out recorded while a pitcher is active, the pitcher's inningsPitched should increment by 0.1 (representing ⅓ inning).

**Validates: Requirements 3.1**

### Property 10: Pitcher Stats Update on Hits Allowed

*For any* hit (single, double, triple, home run) recorded against a pitcher, the pitcher's hitsAllowed count should increment by 1.

**Validates: Requirements 3.2, 4.1, 4.2, 4.3, 4.4**

### Property 11: Pitcher Runs Allowed Tracks All Runs

*For any* run that scores while a pitcher is active, the pitcher's runsAllowed count should increment by 1.

**Validates: Requirements 3.3**

### Property 12: Earned Runs Exclude Error-Assisted Runs

*For any* run that scores without the aid of a defensive error, the pitcher's earnedRuns count should increment by 1, following Rule 9.16.

**Validates: Requirements 3.4**

### Property 13: Pitcher Walk and HBP Tracking

*For any* walk or hit-by-pitch event, the active pitcher's walksAllowed or hitByPitchAllowed count should increment by 1, respectively.

**Validates: Requirements 3.5, 3.6**

### Property 14: Home Run Updates Pitcher Home Runs Allowed

*For any* home run, the active pitcher's homeRunsAllowed count should increment by 1.

**Validates: Requirements 3.7**

### Property 15: New Player Statistics Initialize to Zero

*For any* newly created player, all offensive, defensive, and pitching statistics should be initialized to 0.

**Validates: Requirements 1.9, 2.6, 3.11**

### Property 16: Statistics Persist After Updates

*For any* statistic update, the new value should be persisted to the backend API and retrievable in subsequent queries.

**Validates: Requirements 1.10, 2.7, 3.12**

### Property 17: Socket Events Trigger Local State Updates

*For any* socket event containing player statistics, the local Zustand store should update to reflect the new statistics.

**Validates: Requirements 5.2**

### Property 18: API Requests Include Socket ID

*For any* API request that updates player statistics, the request payload should include the socketId to prevent echo updates.

**Validates: Requirements 5.4**

### Property 19: Network Failures Don't Block UI

*For any* backend API failure during stat updates, the UI should remain responsive and local state should be preserved.

**Validates: Requirements 5.6, 12.5**

### Property 20: Undo Reverts Most Recent Stat Change

*For any* statistic update followed by an undo operation, the statistic should return to its value before the update (round-trip property).

**Validates: Requirements 6.2**

### Property 21: Redo Reapplies Undone Stat Change

*For any* undo operation followed by a redo operation, the statistic should return to its value after the original update (round-trip property).

**Validates: Requirements 6.3**

### Property 22: Undo/Redo Preserves Stat Consistency

*For any* sequence of stat updates and undo/redo operations, all related statistics should remain consistent (e.g., if atBats is undone, related RBI should also be undone).

**Validates: Requirements 6.4**

### Property 23: Batting Average Calculation Formula

*For any* player with at least 1 at-bat, batting average should equal hits divided by at-bats, rounded to 3 decimal places.

**Validates: Requirements 8.1**

### Property 24: ERA Calculation Formula

*For any* pitcher with at least 0.1 innings pitched, ERA should equal (earnedRuns × 9) divided by inningsPitched, rounded to 2 decimal places.

**Validates: Requirements 8.2**

### Property 25: OBP Calculation Formula

*For any* player with at least 1 plate appearance, OBP should equal (hits + walks + HBP) divided by (atBats + walks + HBP + sacrificeFlies), rounded to 3 decimal places.

**Validates: Requirements 8.3**

### Property 26: SLG Calculation Formula

*For any* player with at least 1 at-bat, slugging percentage should equal total bases divided by at-bats, rounded to 3 decimal places.

**Validates: Requirements 8.4**

### Property 27: WHIP Calculation Formula

*For any* pitcher with at least 0.1 innings pitched, WHIP should equal (walksAllowed + hitsAllowed) divided by inningsPitched, rounded to 2 decimal places.

**Validates: Requirements 8.5**

### Property 28: Division by Zero Returns Zero

*For any* derived statistic calculation where the denominator is zero, the result should be 0.000 (for batting stats) or 0.00 (for pitching stats).

**Validates: Requirements 8.6 (edge case)**

### Property 29: Overlay Displays Current Batter Stats

*For any* game state where the playerStatsOverlay is visible, the overlay should display the current batter's offensive statistics.

**Validates: Requirements 9.1**

### Property 30: Overlay Displays Current Pitcher Stats

*For any* game state where the playerStatsOverlay is visible, the overlay should display the current pitcher's pitching statistics.

**Validates: Requirements 9.2**

### Property 31: Overlay Visibility Toggle Preserves Data

*For any* overlay visibility toggle (hide then show), all displayed statistics should remain unchanged.

**Validates: Requirements 9.6**

### Property 32: CSV Export Contains All Statistics

*For any* completed game, the CSV export should include all offensive, defensive, and pitching statistics for all players.

**Validates: Requirements 10.2, 10.4**

### Property 33: PDF Export Contains All Statistics

*For any* completed game, the PDF export should include all offensive, defensive, and pitching statistics for all players.

**Validates: Requirements 10.3, 10.4**

### Property 34: Exports Group Statistics by Team

*For any* game export, statistics should be organized with all players from Team A grouped together, followed by all players from Team B.

**Validates: Requirements 10.5**

### Property 35: Exports Include Game Metadata

*For any* game export, the output should include game date, team names, and final score.

**Validates: Requirements 10.6**

### Property 36: Stat Updates Batch When Possible

*For any* game event that updates multiple statistics for the same player, those updates should be batched into a single API call.

**Validates: Requirements 12.4**

### Property 37: Backward Compatibility with Existing Players

*For any* existing Player object without new stat fields, accessing those fields should return 0 or undefined without causing errors.

**Validates: Requirements 12.6**


## Error Handling

### API Failure Scenarios

**Network Timeout**
```typescript
try {
  await updatePlayerStats(gameId, teamIndex, playerId, stats)
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    // Log error but don't block UI
    console.error('Stats update timeout:', error)
    toast.warning('Stats update delayed - will retry')
    
    // Queue for retry
    queueStatUpdate({ gameId, teamIndex, playerId, stats })
  }
}
```

**Server Error (5xx)**
```typescript
try {
  await updatePlayerStats(gameId, teamIndex, playerId, stats)
} catch (error) {
  if (error.response?.status >= 500) {
    console.error('Server error updating stats:', error)
    toast.error('Failed to save statistics - check connection')
    
    // Keep local state, allow manual retry
    // Don't revert optimistic update
  }
}
```

**Validation Error (4xx)**
```typescript
try {
  await updatePlayerStats(gameId, teamIndex, playerId, stats)
} catch (error) {
  if (error.response?.status >= 400 && error.response?.status < 500) {
    console.error('Invalid stat update:', error)
    toast.error('Invalid statistics update')
    
    // Revert optimistic update
    revertStatUpdate(playerId, stats)
  }
}
```

### Data Consistency

**Concurrent Updates**

When multiple clients update stats simultaneously, use optimistic locking:

```typescript
// Backend includes version field in Player document
interface Player {
  // ... existing fields ...
  __version?: number
}

// Client includes version in update request
await updatePlayerStats(gameId, teamIndex, playerId, {
  ...stats,
  __version: player.__version
})

// Backend checks version before updating
if (player.__version !== requestedVersion) {
  throw new ConflictError('Player stats were updated by another client')
}
```

**Stat Rollback on Undo**

When undoing a stat change, ensure all related stats are rolled back:

```typescript
const undoStatUpdate = (historyEntry: StatHistoryEntry) => {
  const { playerId, teamIndex, statChanges } = historyEntry
  
  // Revert all changed stats atomically
  const revertedStats = Object.entries(statChanges).reduce((acc, [key, change]) => {
    acc[key] = change.oldValue
    return acc
  }, {} as Partial<Player>)
  
  await updatePlayerStats(gameId, teamIndex, playerId, revertedStats)
}
```

### Edge Cases

**Player Substitution Mid-Game**

When a player is substituted, their stats are preserved:

```typescript
const substitutePlayer = async (playerToRemoveId: string, newPlayer: Player) => {
  // Existing player's stats remain in their Player object
  // New player starts with their own stats (may be 0 if first game)
  
  // Don't transfer stats from old player to new player
  const configuredNewPlayer = {
    ...newPlayer,
    // Initialize stats if undefined
    atBats: newPlayer.atBats ?? 0,
    // ... other stats ...
  }
  
  return configuredNewPlayer
}
```

**Pitcher Change Mid-Inning**

When a pitcher is substituted mid-inning, innings pitched are calculated correctly:

```typescript
// Old pitcher: 5.2 IP (5⅔ innings)
// Records 1 more out before being pulled
// New IP: 5.2 + 0.1 = 6.0 IP (6 complete innings)

// New pitcher enters with 1 out already recorded
// Records 2 more outs to end inning
// New pitcher IP: 0.0 + 0.2 = 0.2 IP (⅔ inning)
```

**Dropped Third Strike with K-WP or K-PB**

Strikeout is always credited to pitcher, even if batter reaches base:

```typescript
// Already implemented in recordDroppedThirdStrikeStats
// Pitcher always gets strikeoutsThrown += 1
// Batter always gets strikeoutsReceived += 1
// Whether batter reached base doesn't affect K credit
```

## Testing Strategy

### Unit Testing

Use Jest for unit tests focusing on:

**Calculation Functions**
```typescript
describe('calculateBattingAverage', () => {
  it('should return 0.000 when atBats is 0', () => {
    const player = { atBats: 0, turnsAtBat: [] }
    expect(calculateBattingAverage(player)).toBe(0.000)
  })
  
  it('should calculate correct average with hits', () => {
    const player = {
      atBats: 10,
      turnsAtBat: [
        { typeHitting: TypeHitting.Single },
        { typeHitting: TypeHitting.Double },
        { typeHitting: TypeHitting.Out },
        // ... 7 more at-bats
      ]
    }
    expect(calculateBattingAverage(player)).toBe(0.200) // 2 hits / 10 AB
  })
})
```

**Stat Update Logic**
```typescript
describe('incrementAtBats', () => {
  it('should increment atBats by 1', async () => {
    const initialAtBats = 5
    await incrementAtBats(0, 'player-id')
    
    const player = getPlayer(0, 'player-id')
    expect(player.atBats).toBe(6)
  })
  
  it('should persist to backend', async () => {
    await incrementAtBats(0, 'player-id')
    
    expect(mockUpdatePlayerStats).toHaveBeenCalledWith(
      expect.any(String),
      0,
      'player-id',
      expect.objectContaining({ atBats: expect.any(Number) })
    )
  })
})
```

**MLB Rule Compliance**
```typescript
describe('Rule 9.02: At-Bat Determination', () => {
  it('should not increment atBats on walk', async () => {
    const initialAtBats = player.atBats
    await handleBBPlay()
    
    expect(player.atBats).toBe(initialAtBats)
    expect(player.walks).toBe(initialWalks + 1)
  })
  
  it('should not increment atBats on HBP', async () => {
    const initialAtBats = player.atBats
    await handleHitByPitch()
    
    expect(player.atBats).toBe(initialAtBats)
    expect(player.hitByPitch).toBe(initialHBP + 1)
  })
})
```

### Property-Based Testing

Use fast-check for property-based tests with minimum 100 iterations:

**Property Test Configuration**
```typescript
import fc from 'fast-check'

// Configure for minimum 100 runs
const testConfig = { numRuns: 100 }
```

**Example Property Tests**

```typescript
describe('Property 1: At-Bat Counting', () => {
  it('should only increment atBats for qualifying events', () => {
    fc.assert(
      fc.property(
        fc.record({
          eventType: fc.constantFrom(...Object.values(TypeHitting)),
          initialAtBats: fc.nat(100),
        }),
        async ({ eventType, initialAtBats }) => {
          // Setup
          const player = createTestPlayer({ atBats: initialAtBats })
          
          // Execute event
          await processPlateAppearance(player, eventType)
          
          // Verify
          const shouldIncrement = ![
            TypeHitting.BaseByBall,
            TypeHitting.HitByPitch,
          ].includes(eventType)
          
          const expectedAtBats = shouldIncrement 
            ? initialAtBats + 1 
            : initialAtBats
          
          expect(player.atBats).toBe(expectedAtBats)
        }
      ),
      testConfig
    )
  })
  
  // Tag: Feature: player-statistics-tracking, Property 1: At-Bat Counting Excludes Non-Qualifying Events
})
```

```typescript
describe('Property 23: Batting Average Calculation', () => {
  it('should equal hits divided by at-bats', () => {
    fc.assert(
      fc.property(
        fc.record({
          hits: fc.nat(50),
          atBats: fc.integer({ min: 1, max: 100 }),
        }),
        ({ hits, atBats }) => {
          // Ensure hits <= atBats
          const validHits = Math.min(hits, atBats)
          
          const player = createTestPlayer({
            atBats,
            turnsAtBat: generateHitTurns(validHits, atBats)
          })
          
          const avg = calculateBattingAverage(player)
          const expected = Math.round((validHits / atBats) * 1000) / 1000
          
          expect(avg).toBe(expected)
        }
      ),
      testConfig
    )
  })
  
  // Tag: Feature: player-statistics-tracking, Property 23: Batting Average Calculation Formula
})
```

```typescript
describe('Property 20: Undo Reverts Stat Change', () => {
  it('should restore original value after undo', () => {
    fc.assert(
      fc.property(
        fc.record({
          initialAtBats: fc.nat(50),
          increment: fc.integer({ min: 1, max: 5 }),
        }),
        async ({ initialAtBats, increment }) => {
          // Setup
          const player = createTestPlayer({ atBats: initialAtBats })
          
          // Update stat
          await incrementAtBats(0, player._id!, increment)
          expect(player.atBats).toBe(initialAtBats + increment)
          
          // Undo
          await undoLastStatChange()
          
          // Verify round-trip
          expect(player.atBats).toBe(initialAtBats)
        }
      ),
      testConfig
    )
  })
  
  // Tag: Feature: player-statistics-tracking, Property 20: Undo Reverts Most Recent Stat Change
})
```


### Integration Testing

Test integration between game event handlers and stat updates:

```typescript
describe('Integration: handleSingle updates stats', () => {
  it('should update batter atBats and RBI', async () => {
    // Setup game state with runner on third
    setupGameState({
      bases: [
        { isOccupied: false, playerId: null },
        { isOccupied: false, playerId: null },
        { isOccupied: true, playerId: 'runner-id' },
      ],
      currentBatter: createTestPlayer({ atBats: 5, rbi: 2 })
    })
    
    // Execute
    await handleSingle(1, false) // 1 run scores
    
    // Verify batter stats
    const batter = getCurrentBatter()
    expect(batter.atBats).toBe(6)
    expect(batter.rbi).toBe(3)
    
    // Verify runner stats
    const runner = getPlayer(0, 'runner-id')
    expect(runner.runsScored).toBe((runner.runsScored ?? 0) + 1)
  })
  
  it('should update pitcher stats', async () => {
    const pitcher = getCurrentPitcher()
    const initialHitsAllowed = pitcher.hitsAllowed ?? 0
    
    await handleSingle(0, false) // No runs score
    
    expect(pitcher.hitsAllowed).toBe(initialHitsAllowed + 1)
  })
})
```

### End-to-End Testing

Test complete game scenarios:

```typescript
describe('E2E: Complete inning with stats', () => {
  it('should track all stats correctly through an inning', async () => {
    // Setup: Start of inning, 3 batters
    const batter1 = createTestPlayer({ name: 'Batter 1' })
    const batter2 = createTestPlayer({ name: 'Batter 2' })
    const batter3 = createTestPlayer({ name: 'Batter 3' })
    const pitcher = createTestPlayer({ name: 'Pitcher', position: 'P' })
    
    // Batter 1: Single
    await handleSingle(0, false)
    expect(batter1.atBats).toBe(1)
    expect(pitcher.hitsAllowed).toBe(1)
    expect(pitcher.inningsPitched).toBe(0)
    
    // Batter 2: Walk
    await handleBBPlay()
    expect(batter2.atBats).toBe(0) // Walk doesn't count
    expect(batter2.walks).toBe(1)
    expect(pitcher.walksAllowed).toBe(1)
    
    // Batter 3: Strikeout
    await handleStrikeChange(3, true)
    expect(batter3.strikeoutsReceived).toBe(1)
    expect(pitcher.strikeoutsThrown).toBe(1)
    expect(pitcher.inningsPitched).toBe(0.1) // 1 out
    
    // Continue until 3 outs...
    // Final verification
    expect(pitcher.inningsPitched).toBe(1.0) // 1 complete inning
  })
})
```

### Test Coverage Goals

- Unit tests: 90%+ coverage of calculation functions
- Property tests: All 37 correctness properties implemented
- Integration tests: All game event handlers covered
- E2E tests: At least 5 complete game scenarios

## Performance Considerations

### Optimization Strategies

**Batching Stat Updates**

Group multiple stat updates into single API calls:

```typescript
const updateBatterStatsOnHit = async (
  batterId: string,
  runsScored: number,
  hitType: TypeHitting
) => {
  // Instead of 3 separate API calls
  const stats: Partial<Player> = {
    atBats: (player.atBats ?? 0) + 1,
    rbi: (player.rbi ?? 0) + runsScored,
  }
  
  // Single batched call
  await updatePlayerStats(gameId, teamIndex, batterId, stats)
}
```

**Debouncing Derived Calculations**

Calculate derived stats (AVG, ERA) only when needed for display:

```typescript
// Don't recalculate on every stat update
// Calculate only when overlay is visible or export is triggered

const PlayerStatsOverlay = () => {
  const currentBatter = useGameStore(state => state.getCurrentBatter())
  
  // Calculate only when component renders
  const battingAvg = useMemo(
    () => calculateBattingAverage(currentBatter),
    [currentBatter?.atBats, currentBatter?.turnsAtBat]
  )
  
  return <div>AVG: {battingAvg.toFixed(3)}</div>
}
```

**Memoization of Expensive Calculations**

```typescript
// Cache calculated stats to avoid recalculation
const statCache = new Map<string, { value: number; timestamp: number }>()

const getCachedStat = (
  playerId: string,
  statName: string,
  calculator: () => number
): number => {
  const cacheKey = `${playerId}:${statName}`
  const cached = statCache.get(cacheKey)
  
  // Cache valid for 1 second
  if (cached && Date.now() - cached.timestamp < 1000) {
    return cached.value
  }
  
  const value = calculator()
  statCache.set(cacheKey, { value, timestamp: Date.now() })
  return value
}
```

### Bundle Size Management

**Code Splitting**

Statistics export functionality is loaded only when needed:

```typescript
// Lazy load export utilities
const exportGameStats = async (gameId: string) => {
  const { generateCSV, generatePDF } = await import('./statsExport')
  
  const stats = await getGameStats(gameId)
  return {
    csv: generateCSV(stats),
    pdf: generatePDF(stats)
  }
}
```

**Tree Shaking**

Ensure unused calculation functions are tree-shaken:

```typescript
// Export individual functions, not default object
export const calculateBattingAverage = (player: Player) => { /* ... */ }
export const calculateERA = (player: Player) => { /* ... */ }
export const calculateOBP = (player: Player) => { /* ... */ }

// Import only what's needed
import { calculateBattingAverage } from './statCalculations'
```

### Expected Performance Metrics

- Stat update latency: < 50ms (local state update)
- API persistence: < 200ms (network dependent)
- Socket synchronization: < 100ms (to other clients)
- Derived stat calculation: < 10ms per stat
- Export generation: < 2s for full game (CSV), < 5s (PDF)
- Bundle size increase: < 50KB (minified + gzipped)

## Overlay Display Implementation

### PlayerStatsOverlay Component

New overlay component for displaying player statistics:

```typescript
interface PlayerStatsOverlayProps {
  gameId: string
  position: { x: number; y: number }
  scale: number
  visible: boolean
}

const PlayerStatsOverlay: React.FC<PlayerStatsOverlayProps> = ({
  gameId,
  position,
  scale,
  visible
}) => {
  const currentBatter = useGameStore(state => state.getCurrentBatter())
  const currentPitcher = useGameStore(state => state.getCurrentPitcher())
  
  // Calculate derived stats
  const batterStats = useMemo(() => {
    if (!currentBatter) return null
    
    return {
      name: currentBatter.name,
      number: currentBatter.number,
      avg: calculateBattingAverage(currentBatter).toFixed(3),
      ab: currentBatter.atBats ?? 0,
      h: countHits(currentBatter.turnsAtBat),
      rbi: currentBatter.rbi ?? 0,
      r: currentBatter.runsScored ?? 0,
    }
  }, [currentBatter])
  
  const pitcherStats = useMemo(() => {
    if (!currentPitcher) return null
    
    const pitcher = findPitcher(currentPitcher.name)
    return {
      name: pitcher.name,
      number: pitcher.number,
      ip: formatInningsPitched(pitcher.inningsPitched ?? 0),
      h: pitcher.hitsAllowed ?? 0,
      r: pitcher.runsAllowed ?? 0,
      er: pitcher.earnedRuns ?? 0,
      bb: pitcher.walksAllowed ?? 0,
      k: pitcher.strikeoutsThrown ?? 0,
      era: calculateERA(pitcher).toFixed(2),
    }
  }, [currentPitcher])
  
  if (!visible) return null
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `scale(${scale / 100})`,
      }}
      className="bg-black/80 text-white p-4 rounded-lg"
    >
      {/* Batter Stats */}
      <div className="mb-4">
        <h3 className="text-lg font-bold">
          {batterStats?.name} #{batterStats?.number}
        </h3>
        <div className="grid grid-cols-5 gap-2 text-sm">
          <div>AVG: {batterStats?.avg}</div>
          <div>AB: {batterStats?.ab}</div>
          <div>H: {batterStats?.h}</div>
          <div>RBI: {batterStats?.rbi}</div>
          <div>R: {batterStats?.r}</div>
        </div>
      </div>
      
      {/* Pitcher Stats */}
      <div>
        <h3 className="text-lg font-bold">
          {pitcherStats?.name} #{pitcherStats?.number}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-sm">
          <div>IP: {pitcherStats?.ip}</div>
          <div>H: {pitcherStats?.h}</div>
          <div>R: {pitcherStats?.r}</div>
          <div>ER: {pitcherStats?.er}</div>
          <div>BB: {pitcherStats?.bb}</div>
          <div>K: {pitcherStats?.k}</div>
          <div>ERA: {pitcherStats?.era}</div>
        </div>
      </div>
    </div>
  )
}
```

### Overlay Integration

Add to existing overlay management in `gameStore`:

```typescript
// Already exists in gameStore
playerStatsOverlay: {
  x: 100,
  y: 100,
  scale: 100,
  visible: false,
  id: 'playerStats',
}

// Overlay control methods already implemented
handlePositionOverlay('playerStats', { x: 150, y: 200 })
handleScaleOverlay('playerStats', 120)
handleVisibleOverlay('playerStats', true)
```


## Export Functionality

### CSV Export

Generate CSV file with all player statistics:

```typescript
import { saveAs } from 'file-saver'

interface GameStatsExport {
  gameMetadata: {
    date: string
    homeTeam: string
    awayTeam: string
    finalScore: string
  }
  teams: Array<{
    teamName: string
    players: Player[]
  }>
}

const exportStatsToCSV = (gameStats: GameStatsExport): void => {
  const rows: string[] = []
  
  // Header row
  rows.push('Team,Player,Position,Number,AB,H,AVG,R,RBI,BB,K,HBP,SF,SH,PO,A,E,IP,HA,RA,ER,BBA,KA,HRA,ERA,WHIP')
  
  // Game metadata as comment
  rows.unshift(`# Game: ${gameStats.gameMetadata.homeTeam} vs ${gameStats.gameMetadata.awayTeam}`)
  rows.unshift(`# Date: ${gameStats.gameMetadata.date}`)
  rows.unshift(`# Final Score: ${gameStats.gameMetadata.finalScore}`)
  rows.unshift('')
  
  // Player rows
  gameStats.teams.forEach(team => {
    team.players.forEach(player => {
      const hits = countHits(player.turnsAtBat)
      const avg = calculateBattingAverage(player).toFixed(3)
      const era = player.position === 'P' ? calculateERA(player).toFixed(2) : '-'
      const whip = player.position === 'P' ? calculateWHIP(player).toFixed(2) : '-'
      
      rows.push([
        team.teamName,
        player.name,
        player.position,
        player.number,
        player.atBats ?? 0,
        hits,
        avg,
        player.runsScored ?? 0,
        player.rbi ?? 0,
        player.walks ?? 0,
        player.strikeoutsReceived ?? 0,
        player.hitByPitch ?? 0,
        player.sacrificeFlies ?? 0,
        player.sacrificeBunts ?? 0,
        player.putouts ?? 0,
        player.assists ?? 0,
        player.errors ?? 0,
        formatInningsPitched(player.inningsPitched ?? 0),
        player.hitsAllowed ?? 0,
        player.runsAllowed ?? 0,
        player.earnedRuns ?? 0,
        player.walksAllowed ?? 0,
        player.strikeoutsThrown ?? 0,
        player.homeRunsAllowed ?? 0,
        era,
        whip,
      ].join(','))
    })
  })
  
  const csvContent = rows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `game-stats-${gameStats.gameMetadata.date}.csv`)
}
```

### PDF Export

Generate formatted PDF with statistics tables:

```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const exportStatsToPDF = (gameStats: GameStatsExport): void => {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.text('Game Statistics', 14, 20)
  
  // Game metadata
  doc.setFontSize(12)
  doc.text(`Date: ${gameStats.gameMetadata.date}`, 14, 30)
  doc.text(`${gameStats.gameMetadata.homeTeam} vs ${gameStats.gameMetadata.awayTeam}`, 14, 37)
  doc.text(`Final Score: ${gameStats.gameMetadata.finalScore}`, 14, 44)
  
  let yPosition = 55
  
  // Team statistics tables
  gameStats.teams.forEach((team, index) => {
    // Team header
    doc.setFontSize(14)
    doc.text(team.teamName, 14, yPosition)
    yPosition += 7
    
    // Batting statistics table
    const battingData = team.players.map(player => {
      const hits = countHits(player.turnsAtBat)
      const avg = calculateBattingAverage(player).toFixed(3)
      
      return [
        player.name,
        player.number,
        player.position,
        player.atBats ?? 0,
        hits,
        avg,
        player.runsScored ?? 0,
        player.rbi ?? 0,
        player.walks ?? 0,
        player.strikeoutsReceived ?? 0,
      ]
    })
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Player', '#', 'Pos', 'AB', 'H', 'AVG', 'R', 'RBI', 'BB', 'K']],
      body: battingData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
    })
    
    yPosition = (doc as any).lastAutoTable.finalY + 10
    
    // Pitching statistics table (only for pitchers)
    const pitchers = team.players.filter(p => p.position === 'P')
    if (pitchers.length > 0) {
      const pitchingData = pitchers.map(player => {
        const era = calculateERA(player).toFixed(2)
        const whip = calculateWHIP(player).toFixed(2)
        
        return [
          player.name,
          formatInningsPitched(player.inningsPitched ?? 0),
          player.hitsAllowed ?? 0,
          player.runsAllowed ?? 0,
          player.earnedRuns ?? 0,
          player.walksAllowed ?? 0,
          player.strikeoutsThrown ?? 0,
          era,
          whip,
        ]
      })
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Pitcher', 'IP', 'H', 'R', 'ER', 'BB', 'K', 'ERA', 'WHIP']],
        body: pitchingData,
        theme: 'grid',
        headStyles: { fillColor: [231, 76, 60] },
        styles: { fontSize: 9 },
      })
      
      yPosition = (doc as any).lastAutoTable.finalY + 15
    }
    
    // Add new page if needed for second team
    if (index === 0 && yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }
  })
  
  // Save PDF
  doc.save(`game-stats-${gameStats.gameMetadata.date}.pdf`)
}
```

### Export Trigger

Add export buttons to game UI:

```typescript
const GameStatsExportButtons: React.FC<{ gameId: string }> = ({ gameId }) => {
  const gameStatus = useGameStore(state => state.status)
  
  const handleExportCSV = async () => {
    const stats = await fetchGameStats(gameId)
    exportStatsToCSV(stats)
    toast.success('Statistics exported to CSV')
  }
  
  const handleExportPDF = async () => {
    const stats = await fetchGameStats(gameId)
    exportStatsToPDF(stats)
    toast.success('Statistics exported to PDF')
  }
  
  // Only show export buttons when game is finished
  if (gameStatus !== 'finished') return null
  
  return (
    <div className="flex gap-2">
      <Button onClick={handleExportCSV} variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <Button onClick={handleExportPDF} variant="outline">
        <FileText className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  )
}
```

## Implementation Phases

### Phase 1: Data Model Extensions (Week 1)

1. Extend `Player` type with new stat fields
2. Update player initialization to include stat defaults
3. Modify `addPlayerToBench` and `addPlayerToLineup` to initialize stats
4. Update TypeScript types throughout codebase
5. Verify no compilation errors

**Deliverables:**
- Updated `teamsStore.ts` with extended Player type
- All existing functionality still works
- TypeScript compiles without errors

### Phase 2: Core Stat Update Methods (Week 1-2)

1. Implement batting stat update methods in `teamsStore`
2. Implement defensive stat update methods
3. Implement pitching stat update methods
4. Add backend API integration with batching
5. Add error handling and retry logic

**Deliverables:**
- All stat update methods implemented
- Unit tests for each method (90%+ coverage)
- API integration working with batching

### Phase 3: Game Event Integration (Week 2)

1. Integrate stat updates into `handleSingle`, `handleDouble`, `handleTriple`
2. Integrate into `handleHomeRun`, `handleBBPlay`, `handleHitByPitch`
3. Integrate into `handleOutPlay`, `handleStrikeChange`, `handleOutsChange`
4. Integrate into `handleErrorPlay`
5. Test all integrations

**Deliverables:**
- All game event handlers update stats correctly
- Integration tests passing
- No breaking changes to existing functionality

### Phase 4: Defensive Play Attribution UI (Week 2-3)

1. Create `DefensivePlayModal` component
2. Integrate modal into out recording flow
3. Implement putout/assist recording
4. Add quick-select buttons for common plays
5. Test UI flow

**Deliverables:**
- Defensive play modal working
- Putouts and assists recorded correctly
- UX is smooth and intuitive

### Phase 5: Derived Statistics & Calculations (Week 3)

1. Implement calculation functions (AVG, ERA, OBP, SLG, WHIP)
2. Add memoization for performance
3. Handle edge cases (division by zero)
4. Add formatting functions
5. Unit test all calculations

**Deliverables:**
- All calculation functions implemented
- Property tests for calculations passing
- Performance optimized with memoization

### Phase 6: Real-Time Synchronization (Week 3-4)

1. Add socket event handlers for stat updates
2. Implement echo prevention
3. Test multi-client synchronization
4. Handle concurrent updates
5. Add conflict resolution

**Deliverables:**
- Socket synchronization working
- Multiple clients stay in sync
- No echo updates
- Concurrent updates handled gracefully

### Phase 7: Undo/Redo Integration (Week 4)

1. Extend `historiStore` to track stat changes
2. Implement stat rollback on undo
3. Implement stat reapply on redo
4. Ensure consistency across related stats
5. Test undo/redo flows

**Deliverables:**
- Undo/redo working for all stats
- Stat consistency maintained
- Property tests for undo/redo passing

### Phase 8: Overlay Display (Week 4-5)

1. Create `PlayerStatsOverlay` component
2. Integrate with existing overlay infrastructure
3. Add real-time stat updates to overlay
4. Test overlay positioning and scaling
5. Optimize rendering performance

**Deliverables:**
- Player stats overlay displaying correctly
- Real-time updates working
- Performance acceptable (< 16ms render time)

### Phase 9: Export Functionality (Week 5)

1. Implement CSV export
2. Implement PDF export
3. Add export buttons to UI
4. Test export formats
5. Optimize export performance

**Deliverables:**
- CSV export working with all stats
- PDF export with formatted tables
- Export performance < 5s for full game

### Phase 10: Testing & Documentation (Week 5-6)

1. Complete property-based tests (all 37 properties)
2. Complete integration tests
3. Complete E2E tests
4. Write user documentation
5. Write developer documentation

**Deliverables:**
- All property tests implemented and passing
- Test coverage > 90%
- Documentation complete

## Success Criteria

The implementation is considered successful when:

1. All 37 correctness properties pass with 100 iterations each
2. All 12 requirements are fully implemented
3. Test coverage exceeds 90% for new code
4. No breaking changes to existing functionality
5. TypeScript compiles without errors in strict mode
6. Bundle size increase is less than 50KB
7. Performance metrics are met (< 50ms stat updates, < 100ms sync)
8. Real-time synchronization works across multiple clients
9. Undo/redo maintains stat consistency
10. Export functionality generates valid CSV and PDF files

## Risks and Mitigation

### Risk: Performance Degradation

**Mitigation:**
- Batch API calls to reduce network overhead
- Memoize expensive calculations
- Use React.memo for overlay components
- Profile and optimize hot paths

### Risk: Data Inconsistency

**Mitigation:**
- Use optimistic locking for concurrent updates
- Implement atomic stat updates
- Add validation before persisting
- Test concurrent update scenarios

### Risk: Breaking Existing Functionality

**Mitigation:**
- Maintain backward compatibility with optional fields
- Extensive integration testing
- Gradual rollout with feature flags
- Comprehensive regression testing

### Risk: Complex MLB Rules Implementation

**Mitigation:**
- Reference official MLB rulebook
- Implement simplified versions initially
- Add complexity incrementally
- Validate with baseball experts

## Future Enhancements

Beyond the initial implementation, consider:

1. **Advanced Statistics**: OPS, wOBA, FIP, WAR
2. **Historical Tracking**: Season-long statistics across multiple games
3. **Comparison Views**: Compare player stats side-by-side
4. **Live Charts**: Real-time visualization of stat trends
5. **Mobile App**: Native mobile app for stat tracking
6. **Voice Commands**: Voice-activated stat recording
7. **AI Insights**: Automated insights and predictions
8. **Video Integration**: Link stats to video highlights

