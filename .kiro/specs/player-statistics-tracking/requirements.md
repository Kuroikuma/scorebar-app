# Requirements Document

## Introduction

This document specifies requirements for implementing a comprehensive player statistics tracking system in ScoreBar, a baseball game management and live streaming overlay application. The system will automatically track offensive (batting), defensive (fielding), and pitching statistics for all players during live games, following MLB Official Rules for stat attribution. Statistics will be updated in real-time via Socket.io synchronization and displayed on broadcast overlays.

## Glossary

- **ScoreBar**: The baseball game management and live streaming overlay application
- **Player_Stats_System**: The comprehensive statistics tracking system being implemented
- **Batter**: A player currently at bat or whose offensive statistics are being tracked
- **Pitcher**: The defensive player throwing pitches whose pitching statistics are being tracked
- **Fielder**: Any defensive player whose fielding statistics (putouts, assists, errors) are being tracked
- **At_Bat**: An official plate appearance that counts toward batting average (excludes walks, HBP, sacrifice flies/bunts per Rule 9.02)
- **RBI**: Runs Batted In - runs scored as a result of a batter's action (Rule 9.04)
- **Putout**: Defensive credit to the player who records the out (Rule 9.10)
- **Assist**: Defensive credit to a player who helped make the out (Rule 9.11)
- **Earned_Run**: A run charged to the pitcher that did not result from defensive errors (Rule 9.16)
- **Innings_Pitched**: Innings pitched by a pitcher, measured in thirds (3 outs = 1 inning, fractional notation: 5.1 = 5⅓ innings)
- **Game_Event**: Any action during the game that triggers stat updates (hit, out, walk, strikeout, etc.)
- **Socket_Sync**: Real-time synchronization of game state across all connected clients via Socket.io
- **Zustand_Store**: Client-side state management store (gameStore, teamsStore)
- **Backend_API**: REST API endpoints for persisting player statistics
- **Undo_Redo**: History management system (historiStore) for correcting stat errors

## Requirements

### Requirement 1: Track Offensive Batting Statistics

**User Story:** As a scorekeeper, I want the system to automatically track batting statistics for each player, so that I can see real-time offensive performance metrics without manual calculation.

#### Acceptance Criteria

1. WHEN a player completes a plate appearance, THE Player_Stats_System SHALL update the player's atBats count according to Rule 9.02 (excluding walks, HBP, sacrifice flies, sacrifice bunts)
2. WHEN a player receives a walk (BB), THE Player_Stats_System SHALL increment the player's walks count by 1
3. WHEN a player strikes out as a batter, THE Player_Stats_System SHALL increment the player's strikeoutsReceived count by 1
4. WHEN a player is hit by a pitch, THE Player_Stats_System SHALL increment the player's hitByPitch count by 1
5. WHEN a player's action causes runs to score, THE Player_Stats_System SHALL increment the player's rbi count according to Rule 9.04
6. WHEN a player crosses home plate, THE Player_Stats_System SHALL increment the player's runsScored count by 1
7. WHEN a player hits a sacrifice fly, THE Player_Stats_System SHALL increment the player's sacrificeFlies count by 1
8. WHEN a player executes a sacrifice bunt, THE Player_Stats_System SHALL increment the player's sacrificeBunts count by 1
9. THE Player_Stats_System SHALL initialize all offensive statistics to 0 for new players
10. THE Player_Stats_System SHALL persist offensive statistics via the Backend_API after each update

### Requirement 2: Track Defensive Fielding Statistics

**User Story:** As a scorekeeper, I want the system to track fielding statistics for defensive players, so that I can credit players for their defensive contributions and errors.

#### Acceptance Criteria

1. WHEN a fielder records an out directly, THE Player_Stats_System SHALL increment the fielder's putouts count by 1 according to Rule 9.10
2. WHEN a fielder assists in making an out, THE Player_Stats_System SHALL increment the fielder's assists count by 1 according to Rule 9.11
3. WHEN a fielder commits an error, THE Player_Stats_System SHALL increment the fielder's errors count by 1
4. WHEN the scorekeeper records a defensive play, THE Player_Stats_System SHALL prompt for putout and assist attribution
5. THE Player_Stats_System SHALL allow multiple assists on a single play
6. THE Player_Stats_System SHALL initialize all defensive statistics to 0 for new players
7. THE Player_Stats_System SHALL persist defensive statistics via the Backend_API after each update

### Requirement 3: Track Pitcher Statistics

**User Story:** As a scorekeeper, I want the system to automatically track pitching statistics, so that I can monitor pitcher performance and calculate ERA in real-time.

#### Acceptance Criteria

1. WHEN a pitcher records an out, THE Player_Stats_System SHALL increment the pitcher's inningsPitched by 0.1 (representing ⅓ inning)
2. WHEN a pitcher allows a hit, THE Player_Stats_System SHALL increment the pitcher's hitsAllowed count by 1
3. WHEN a run scores while a pitcher is active, THE Player_Stats_System SHALL increment the pitcher's runsAllowed count by 1
4. WHEN a run scores that is not caused by defensive errors, THE Player_Stats_System SHALL increment the pitcher's earnedRuns count by 1 according to Rule 9.16
5. WHEN a pitcher issues a walk, THE Player_Stats_System SHALL increment the pitcher's walksAllowed count by 1
6. WHEN a pitcher hits a batter with a pitch, THE Player_Stats_System SHALL increment the pitcher's hitByPitchAllowed count by 1
7. WHEN a pitcher allows a home run, THE Player_Stats_System SHALL increment the pitcher's homeRunsAllowed count by 1
8. WHEN a pitcher's team wins and the pitcher meets win criteria, THE Player_Stats_System SHALL increment the pitcher's wins count by 1
9. WHEN a pitcher's team loses and the pitcher is the losing pitcher, THE Player_Stats_System SHALL increment the pitcher's losses count by 1
10. WHEN a pitcher records a save according to Rule 9.19, THE Player_Stats_System SHALL increment the pitcher's saves count by 1
11. THE Player_Stats_System SHALL initialize all pitcher statistics to 0 for new pitchers
12. THE Player_Stats_System SHALL persist pitcher statistics via the Backend_API after each update

### Requirement 4: Integrate Statistics with Game Event Handlers

**User Story:** As a scorekeeper, I want statistics to update automatically when I record game events, so that I don't have to manually track stats separately from game actions.

#### Acceptance Criteria

1. WHEN handleSingle is called, THE Player_Stats_System SHALL update the batter's atBats and calculate RBI based on runs scored
2. WHEN handleDouble is called, THE Player_Stats_System SHALL update the batter's atBats and calculate RBI based on runs scored
3. WHEN handleTriple is called, THE Player_Stats_System SHALL update the batter's atBats and calculate RBI based on runs scored
4. WHEN handleHomeRun is called, THE Player_Stats_System SHALL update the batter's atBats, RBI, and runsScored
5. WHEN handleOutPlay is called, THE Player_Stats_System SHALL update the batter's atBats and prompt for defensive player attribution (putouts/assists)
6. WHEN handleBBPlay is called, THE Player_Stats_System SHALL update the batter's walks count without incrementing atBats
7. WHEN handleHitByPitch is called, THE Player_Stats_System SHALL update the batter's hitByPitch count without incrementing atBats
8. WHEN handleErrorPlay is called, THE Player_Stats_System SHALL update the specified fielder's errors count
9. WHEN handleStrikeChange results in strike 3, THE Player_Stats_System SHALL update both the batter's strikeoutsReceived and the pitcher's strikeoutsThrown
10. WHEN incrementRuns is called, THE Player_Stats_System SHALL update runsScored for the players who crossed home plate
11. THE Player_Stats_System SHALL maintain existing game event handler functionality without breaking changes

### Requirement 5: Maintain Real-Time Synchronization

**User Story:** As a broadcaster, I want player statistics to synchronize in real-time across all connected clients, so that overlays and scorekeeper interfaces show consistent data.

#### Acceptance Criteria

1. WHEN a player statistic is updated, THE Player_Stats_System SHALL emit a Socket_Sync event to all connected clients
2. WHEN a Socket_Sync event is received, THE Player_Stats_System SHALL update the local Zustand_Store with the new statistics
3. THE Player_Stats_System SHALL use existing Socket.io infrastructure without creating new socket connections
4. THE Player_Stats_System SHALL include socketId in Backend_API requests to prevent echo updates
5. THE Player_Stats_System SHALL synchronize statistics within 100ms of the triggering event
6. THE Player_Stats_System SHALL handle network failures gracefully without blocking UI operations

### Requirement 6: Support Undo and Redo Operations

**User Story:** As a scorekeeper, I want to undo and redo stat changes when I make mistakes, so that I can correct errors without manually recalculating statistics.

#### Acceptance Criteria

1. WHEN a statistic is updated, THE Player_Stats_System SHALL register the change with the historiStore
2. WHEN the scorekeeper triggers undo, THE Player_Stats_System SHALL revert the most recent stat change
3. WHEN the scorekeeper triggers redo, THE Player_Stats_System SHALL reapply the most recently undone stat change
4. THE Player_Stats_System SHALL maintain stat consistency across undo/redo operations
5. THE Player_Stats_System SHALL synchronize undo/redo operations via Socket_Sync to all clients
6. THE Player_Stats_System SHALL support undo/redo for all offensive, defensive, and pitching statistics

### Requirement 7: Extend Player Type with New Statistics

**User Story:** As a developer, I want the Player type to include all new statistics fields, so that TypeScript type safety is maintained throughout the application.

#### Acceptance Criteria

1. THE Player_Stats_System SHALL add atBats field (number) to the Player type
2. THE Player_Stats_System SHALL add walks field (number) to the Player type
3. THE Player_Stats_System SHALL add strikeoutsReceived field (number) to the Player type
4. THE Player_Stats_System SHALL add hitByPitch field (number) to the Player type
5. THE Player_Stats_System SHALL add rbi field (number) to the Player type
6. THE Player_Stats_System SHALL add runsScored field (number) to the Player type
7. THE Player_Stats_System SHALL add sacrificeFlies field (number) to the Player type
8. THE Player_Stats_System SHALL add sacrificeBunts field (number) to the Player type
9. THE Player_Stats_System SHALL add errors field (number) to the Player type
10. THE Player_Stats_System SHALL add putouts field (number) to the Player type
11. THE Player_Stats_System SHALL add assists field (number) to the Player type
12. THE Player_Stats_System SHALL add inningsPitched field (number) to the Player type
13. THE Player_Stats_System SHALL add hitsAllowed field (number) to the Player type
14. THE Player_Stats_System SHALL add runsAllowed field (number) to the Player type
15. THE Player_Stats_System SHALL add earnedRuns field (number) to the Player type
16. THE Player_Stats_System SHALL add walksAllowed field (number) to the Player type
17. THE Player_Stats_System SHALL add hitByPitchAllowed field (number) to the Player type
18. THE Player_Stats_System SHALL add homeRunsAllowed field (number) to the Player type
19. THE Player_Stats_System SHALL add wins field (number) to the Player type
20. THE Player_Stats_System SHALL add losses field (number) to the Player type
21. THE Player_Stats_System SHALL add saves field (number) to the Player type
22. THE Player_Stats_System SHALL mark all new fields as optional (using ? operator) for backward compatibility

### Requirement 8: Calculate Derived Statistics

**User Story:** As a scorekeeper, I want to see calculated statistics like batting average and ERA, so that I can quickly assess player performance without manual calculation.

#### Acceptance Criteria

1. WHEN displaying player statistics, THE Player_Stats_System SHALL calculate batting average as hits divided by atBats (minimum 1 atBat)
2. WHEN displaying pitcher statistics, THE Player_Stats_System SHALL calculate ERA as (earnedRuns × 9) divided by inningsPitched (minimum 0.1 IP)
3. WHEN displaying player statistics, THE Player_Stats_System SHALL calculate on-base percentage (OBP) as (hits + walks + HBP) divided by (atBats + walks + HBP + sacrificeFlies)
4. WHEN displaying player statistics, THE Player_Stats_System SHALL calculate slugging percentage based on total bases divided by atBats
5. WHEN displaying pitcher statistics, THE Player_Stats_System SHALL calculate WHIP as (walksAllowed + hitsAllowed) divided by inningsPitched
6. THE Player_Stats_System SHALL handle division by zero gracefully by returning 0.000 for undefined statistics
7. THE Player_Stats_System SHALL format batting average to 3 decimal places (e.g., .333)
8. THE Player_Stats_System SHALL format ERA to 2 decimal places (e.g., 3.45)

### Requirement 9: Display Statistics on Overlays

**User Story:** As a broadcaster, I want player statistics to appear on broadcast overlays, so that viewers can see real-time player performance during the game.

#### Acceptance Criteria

1. WHEN the playerStatsOverlay is visible, THE Player_Stats_System SHALL display the current batter's offensive statistics
2. WHEN the playerStatsOverlay is visible, THE Player_Stats_System SHALL display the current pitcher's pitching statistics
3. THE Player_Stats_System SHALL update overlay statistics within 100ms of stat changes
4. THE Player_Stats_System SHALL format statistics for broadcast display (AVG, AB, H, RBI, R for batters; IP, H, R, ER, BB, K, ERA for pitchers)
5. THE Player_Stats_System SHALL use existing overlay positioning and scaling infrastructure
6. THE Player_Stats_System SHALL support overlay visibility toggling without losing stat data

### Requirement 10: Export Complete Game Statistics

**User Story:** As a coach, I want to export complete game statistics after the game ends, so that I can analyze team and player performance offline.

#### Acceptance Criteria

1. WHEN the game status is 'finished', THE Player_Stats_System SHALL provide an export function for all player statistics
2. THE Player_Stats_System SHALL export statistics in CSV format with all offensive, defensive, and pitching stats
3. THE Player_Stats_System SHALL export statistics in PDF format with formatted tables
4. THE Player_Stats_System SHALL include calculated statistics (AVG, ERA, OBP, SLG, WHIP) in exports
5. THE Player_Stats_System SHALL group statistics by team in exports
6. THE Player_Stats_System SHALL include game metadata (date, teams, final score) in exports
7. THE Player_Stats_System SHALL use existing jsPDF and XLSX libraries for export functionality

### Requirement 11: Validate MLB Rule Compliance

**User Story:** As a scorekeeper, I want the system to follow official MLB scoring rules, so that statistics are accurate and consistent with professional baseball standards.

#### Acceptance Criteria

1. THE Player_Stats_System SHALL implement Rule 9.02 for at-bat determination (exclude walks, HBP, sacrifice flies, sacrifice bunts, catcher interference)
2. THE Player_Stats_System SHALL implement Rule 9.04 for RBI attribution (credit for runs scored due to hit, sacrifice fly, walk/HBP with bases loaded, fielder's choice, error if runner would have scored anyway)
3. THE Player_Stats_System SHALL implement Rule 9.10 for putout attribution (credit to fielder who records the out)
4. THE Player_Stats_System SHALL implement Rule 9.11 for assist attribution (credit to fielders who handle the ball before the putout)
5. THE Player_Stats_System SHALL implement Rule 9.16 for earned run determination (exclude runs resulting from defensive errors)
6. THE Player_Stats_System SHALL calculate innings pitched using fractional notation (0.1 = ⅓ inning, 0.2 = ⅔ inning, 1.0 = 1 inning)
7. THE Player_Stats_System SHALL implement Rule 9.19 for save determination (pitcher finishes game with lead of 3 or fewer runs, or potential tying run on base/at bat/on deck)

### Requirement 12: Maintain Type Safety and Performance

**User Story:** As a developer, I want the statistics system to maintain TypeScript type safety and not degrade application performance, so that the codebase remains maintainable and the user experience stays smooth.

#### Acceptance Criteria

1. THE Player_Stats_System SHALL compile without TypeScript errors in strict mode
2. THE Player_Stats_System SHALL complete stat updates within 50ms to avoid blocking UI operations
3. THE Player_Stats_System SHALL use existing Backend_API endpoints (updatePlayerStats, incrementPlayerStat) instead of creating new endpoints
4. THE Player_Stats_System SHALL batch multiple stat updates in a single Backend_API call when possible
5. THE Player_Stats_System SHALL handle Backend_API failures gracefully without losing local state
6. THE Player_Stats_System SHALL maintain backward compatibility with existing Player objects that lack new stat fields
7. THE Player_Stats_System SHALL not increase bundle size by more than 50KB
