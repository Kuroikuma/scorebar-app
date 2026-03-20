# Implementation Plan: Player Statistics Tracking

## Overview

This implementation plan breaks down the player statistics tracking system into 10 phases, following the design document's architecture. The system extends the existing Zustand store with new stat fields, integrates with game event handlers, provides real-time synchronization, and includes overlay display and export functionality.

## Tasks

- [ ] 1. Extend Player type with statistics fields
  - [ ] 1.1 Add offensive batting statistics fields to Player type in teamsStore.ts
    - Add optional fields: atBats, walks, strikeoutsReceived, hitByPitch, rbi, runsScored, sacrificeFlies, sacrificeBunts
    - Ensure all fields use TypeScript optional (?) syntax for backward compatibility
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  
  - [ ] 1.2 Add defensive fielding statistics fields to Player type
    - Add optional fields: putouts, assists, errors
    - _Requirements: 7.9, 7.10, 7.11_
  
  - [ ] 1.3 Add pitcher statistics fields to Player type
    - Add optional fields: inningsPitched, hitsAllowed, runsAllowed, earnedRuns, walksAllowed, hitByPitchAllowed, homeRunsAllowed, wins, losses, saves
    - _Requirements: 7.12, 7.13, 7.14, 7.15, 7.16, 7.17, 7.18, 7.19, 7.20, 7.21_
  
  - [ ] 1.4 Create player stat initialization function
    - Write initializePlayerStats function that sets all new stat fields to 0 if undefined
    - Handle backward compatibility with existing Player objects
    - _Requirements: 1.9, 2.6, 3.11, 7.22, 12.6_
  
  - [ ] 1.5 Update addPlayerToBench and addPlayerToLineup methods
    - Call initializePlayerStats when adding players to ensure stats are initialized
    - Test with existing players and new players
    - _Requirements: 1.9, 2.6, 3.11_


- [ ] 2. Implement batting statistics update methods
  - [ ] 2.1 Implement updateBattingStats method in teamsStore
    - Accept teamIndex, playerId, and partial batting stats object
    - Update local Zustand state
    - Call backend API with batching support
    - Include socketId for echo prevention
    - _Requirements: 1.10, 5.4, 12.3, 12.4_
  
  - [ ] 2.2 Implement individual batting stat increment methods
    - Write incrementAtBats, incrementWalks, incrementStrikeoutsReceived, incrementHitByPitch
    - Write incrementRBI (with count parameter), incrementRunsScored, incrementSacrificeFlies, incrementSacrificeBunts
    - Each method should update local state and persist via API
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_
  
  - [ ]* 2.3 Write unit tests for batting stat methods
    - Test each increment method updates state correctly
    - Test API calls are made with correct parameters
    - Test error handling for API failures
    - _Requirements: 12.1, 12.2, 12.5_
  
  - [ ]* 2.4 Write property test for at-bat counting
    - **Property 1: At-Bat Counting Excludes Non-Qualifying Events**
    - **Validates: Requirements 1.1, 4.6, 4.7**

- [ ] 3. Implement defensive statistics update methods
  - [ ] 3.1 Implement updateDefensiveStats method in teamsStore
    - Accept teamIndex, playerId, and partial defensive stats object
    - Update local state and persist via API
    - _Requirements: 2.7, 12.3_
  
  - [ ] 3.2 Implement individual defensive stat increment methods
    - Write incrementPutouts, incrementAssists, incrementErrors
    - Each method updates local state and persists via API
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ] 3.3 Implement recordDefensivePlay method
    - Accept putoutPlayerId and assistPlayerIds array
    - Increment putouts for one player, assists for multiple players
    - Batch updates into single API call when possible
    - _Requirements: 2.1, 2.2, 2.5, 12.4_
  
  - [ ]* 3.4 Write unit tests for defensive stat methods
    - Test putout and assist recording
    - Test multiple assists on single play
    - Test error recording
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 3.5 Write property test for defensive play recording
    - **Property 7: Defensive Play Records Putout and Assists**
    - **Validates: Requirements 2.1, 2.2, 2.5**


- [ ] 4. Implement pitching statistics update methods
  - [ ] 4.1 Implement updatePitchingStats method in teamsStore
    - Accept teamIndex, playerId, and partial pitching stats object
    - Update local state and persist via API
    - _Requirements: 3.12, 12.3_
  
  - [ ] 4.2 Implement innings pitched increment method
    - Write incrementInningsPitched with outs parameter
    - Calculate fractional innings (1 out = 0.1 IP)
    - Round to nearest 0.1 to avoid floating point errors
    - _Requirements: 3.1, 11.6_
  
  - [ ] 4.3 Implement pitcher stat increment methods for hits and runs
    - Write incrementHitsAllowed, incrementRunsAllowed (with count), incrementEarnedRuns (with count)
    - Each method updates local state and persists via API
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [ ] 4.4 Implement pitcher stat increment methods for walks and HBP
    - Write incrementWalksAllowed, incrementHitByPitchAllowed, incrementHomeRunsAllowed
    - _Requirements: 3.5, 3.6, 3.7_
  
  - [ ] 4.5 Implement pitcher decision methods
    - Write recordPitcherWin, recordPitcherLoss, recordPitcherSave
    - _Requirements: 3.8, 3.9, 3.10_
  
  - [ ]* 4.6 Write unit tests for pitching stat methods
    - Test innings pitched calculation (fractional notation)
    - Test all pitcher stat increments
    - Test pitcher decision recording
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 4.7 Write property test for innings pitched calculation
    - **Property 9: Pitcher Innings Pitched Increments by Thirds**
    - **Validates: Requirements 3.1**

- [ ] 5. Checkpoint - Verify stat update methods
  - Ensure all stat update methods compile without TypeScript errors
  - Manually test a few stat updates to verify API integration
  - Ask the user if questions arise about stat update behavior


- [ ] 6. Integrate statistics with hit event handlers
  - [ ] 6.1 Update handleSingle in gameStore to track batting and pitching stats
    - Increment batter's atBats
    - Calculate and increment batter's RBI based on runs scored
    - Increment pitcher's hitsAllowed
    - Increment pitcher's runsAllowed if runs score
    - Batch stat updates into single API calls
    - _Requirements: 4.1, 11.2_
  
  - [ ] 6.2 Update handleDouble in gameStore to track stats
    - Increment batter's atBats and RBI
    - Increment pitcher's hitsAllowed and runsAllowed
    - _Requirements: 4.2, 11.2_
  
  - [ ] 6.3 Update handleTriple in gameStore to track stats
    - Increment batter's atBats and RBI
    - Increment pitcher's hitsAllowed and runsAllowed
    - _Requirements: 4.3, 11.2_
  
  - [ ] 6.4 Update handleHomeRun in gameStore to track stats
    - Increment batter's atBats, RBI, and runsScored
    - Increment pitcher's hitsAllowed, homeRunsAllowed, and runsAllowed
    - _Requirements: 4.4, 11.2_
  
  - [ ]* 6.5 Write integration tests for hit event handlers
    - Test handleSingle updates batter and pitcher stats correctly
    - Test RBI calculation based on runs scored
    - Test stat batching reduces API calls
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 6.6 Write property tests for RBI attribution
    - **Property 5: RBI Attribution Matches Runs Scored**
    - **Validates: Requirements 1.5, 4.1, 4.2, 4.3, 4.4**

- [ ] 7. Integrate statistics with walk, HBP, and strikeout handlers
  - [ ] 7.1 Update handleBBPlay in gameStore to track walk stats
    - Increment batter's walks (NOT atBats per Rule 9.02)
    - Increment pitcher's walksAllowed
    - _Requirements: 4.6, 11.1_
  
  - [ ] 7.2 Update handleHitByPitch in gameStore to track HBP stats
    - Increment batter's hitByPitch (NOT atBats per Rule 9.02)
    - Increment pitcher's hitByPitchAllowed
    - _Requirements: 4.7, 11.1_
  
  - [ ] 7.3 Update handleStrikeChange in gameStore for strikeout stats
    - When strikes === 3, increment batter's strikeoutsReceived
    - Increment pitcher's strikeoutsThrown (already tracked in recordDroppedThirdStrikeStats)
    - _Requirements: 4.9_
  
  - [ ]* 7.4 Write unit tests for walk and HBP handlers
    - Test walks don't increment atBats (Rule 9.02)
    - Test HBP doesn't increment atBats (Rule 9.02)
    - Test pitcher stats update correctly
    - _Requirements: 11.1_
  
  - [ ]* 7.5 Write property tests for walk and strikeout events
    - **Property 2: Walk Events Increment Walk Counter**
    - **Property 3: Strikeout Events Update Both Batter and Pitcher**
    - **Validates: Requirements 1.2, 1.3, 4.6, 4.9**


- [ ] 8. Integrate statistics with out and error handlers
  - [ ] 8.1 Update handleOutPlay in gameStore to track batter atBats
    - Increment batter's atBats when out is recorded
    - Trigger defensive play attribution modal (implemented in next task)
    - _Requirements: 4.5, 11.1_
  
  - [ ] 8.2 Update handleOutsChange in gameStore to track pitcher innings
    - For each out recorded, increment pitcher's inningsPitched by 0.1
    - Handle pitcher substitutions mid-inning correctly
    - _Requirements: 3.1, 11.6_
  
  - [ ] 8.3 Update handleErrorPlay in gameStore to track fielder errors
    - Increment specified fielder's errors count
    - _Requirements: 4.8_
  
  - [ ] 8.4 Update incrementRuns in gameStore to track runsScored
    - For each player who crosses home plate, increment their runsScored
    - _Requirements: 4.10_
  
  - [ ]* 8.5 Write integration tests for out and error handlers
    - Test atBats increment on outs
    - Test innings pitched calculation
    - Test error recording
    - Test runs scored tracking
    - _Requirements: 4.5, 4.8, 4.10_
  
  - [ ]* 8.6 Write property test for runs scored tracking
    - **Property 6: Runs Scored Increments for Home Plate Crossings**
    - **Validates: Requirements 1.6, 4.10**

- [ ] 9. Create defensive play attribution UI
  - [ ] 9.1 Create DefensivePlayModal component
    - Build modal with Radix UI Dialog
    - Add dropdown to select player who recorded putout
    - Add multi-select for players who assisted (0-3 assists typical)
    - Add validation: at least one putout must be selected
    - Style with Tailwind CSS
    - _Requirements: 2.4, 2.5_
  
  - [ ] 9.2 Add quick-select buttons for common defensive plays
    - Add buttons for common plays: 6-3, 4-3, 1-3, 4-6-3, 6-4-3, etc.
    - Clicking button auto-fills putout and assist selections
    - _Requirements: 2.4_
  
  - [ ] 9.3 Integrate DefensivePlayModal into handleOutPlay flow
    - Show modal after out is recorded
    - Wait for user to submit putout/assist attribution
    - Call recordDefensivePlay with selected players
    - Continue game flow after modal closes
    - _Requirements: 2.4, 4.5_
  
  - [ ]* 9.4 Write component tests for DefensivePlayModal
    - Test modal opens and closes correctly
    - Test putout selection is required
    - Test multiple assists can be selected
    - Test quick-select buttons work
    - _Requirements: 2.4, 2.5_

- [ ] 10. Checkpoint - Verify game event integration
  - Manually test a complete inning with various events (hits, walks, outs, errors)
  - Verify all stats update correctly in real-time
  - Verify defensive play modal appears and records putouts/assists
  - Ask the user if questions arise about game event behavior


- [ ] 11. Implement derived statistics calculations
  - [ ] 11.1 Create statCalculations utility file
    - Create new file app/lib/statCalculations.ts
    - Export individual calculation functions for tree-shaking
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 11.2 Implement batting average calculation
    - Write calculateBattingAverage function: hits / atBats
    - Count hits from turnsAtBat array (Single, Double, Triple, HomeRun)
    - Return 0.000 when atBats is 0 (handle division by zero)
    - Round to 3 decimal places
    - _Requirements: 8.1, 8.6, 8.7_
  
  - [ ] 11.3 Implement ERA calculation
    - Write calculateERA function: (earnedRuns × 9) / inningsPitched
    - Return 0.00 when inningsPitched < 0.1 (handle division by zero)
    - Round to 2 decimal places
    - _Requirements: 8.2, 8.6, 8.8_
  
  - [ ] 11.4 Implement OBP calculation
    - Write calculateOBP function: (hits + walks + HBP) / (atBats + walks + HBP + sacrificeFlies)
    - Return 0.000 when denominator is 0
    - Round to 3 decimal places
    - _Requirements: 8.3, 8.6_
  
  - [ ] 11.5 Implement slugging percentage calculation
    - Write calculateSLG function: totalBases / atBats
    - Calculate totalBases from turnsAtBat (Single=1, Double=2, Triple=3, HomeRun=4)
    - Return 0.000 when atBats is 0
    - Round to 3 decimal places
    - _Requirements: 8.4, 8.6_
  
  - [ ] 11.6 Implement WHIP calculation
    - Write calculateWHIP function: (walksAllowed + hitsAllowed) / inningsPitched
    - Return 0.00 when inningsPitched < 0.1
    - Round to 2 decimal places
    - _Requirements: 8.5, 8.6_
  
  - [ ] 11.7 Implement innings pitched formatting
    - Write formatInningsPitched function to display fractional innings
    - Format as "X.Y" where Y is 0, 1, or 2 (representing 0, ⅓, or ⅔ inning)
    - _Requirements: 11.6_
  
  - [ ] 11.8 Add calculation methods to teamsStore
    - Add calculateBattingAverage, calculateERA, calculateOBP, calculateSLG, calculateWHIP methods
    - Methods accept playerId and teamIndex, return calculated value
    - Use memoization for performance optimization
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 12.2_
  
  - [ ]* 11.9 Write unit tests for all calculation functions
    - Test each calculation with various inputs
    - Test division by zero handling
    - Test rounding to correct decimal places
    - _Requirements: 8.6, 8.7, 8.8_
  
  - [ ]* 11.10 Write property tests for calculation formulas
    - **Property 23: Batting Average Calculation Formula**
    - **Property 24: ERA Calculation Formula**
    - **Property 25: OBP Calculation Formula**
    - **Property 26: SLG Calculation Formula**
    - **Property 27: WHIP Calculation Formula**
    - **Property 28: Division by Zero Returns Zero**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**


- [ ] 12. Implement real-time Socket.io synchronization
  - [ ] 12.1 Add socket event handlers for player stat updates
    - Add 'player:stats:updated' event listener in socket.ts or appropriate hook
    - Handler updates local Zustand store with received stats
    - Create handleSocketPlayerStats method in teamsStore
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 12.2 Add socket event handler for defensive play recording
    - Add 'defensive:play:recorded' event listener
    - Handler updates putouts and assists in local store
    - Create handleSocketDefensivePlay method in teamsStore
    - _Requirements: 5.1, 5.2_
  
  - [ ] 12.3 Ensure socketId is included in all stat update API calls
    - Verify api.ts interceptor includes socketId in request data
    - Backend should exclude originating socket when broadcasting
    - Test echo prevention works correctly
    - _Requirements: 5.4_
  
  - [ ] 12.4 Add error handling for socket disconnections
    - Handle network failures gracefully without blocking UI
    - Queue stat updates for retry when connection restored
    - Show user notification when sync is delayed
    - _Requirements: 5.6, 12.5_
  
  - [ ]* 12.5 Write integration tests for socket synchronization
    - Test stat updates broadcast to other clients
    - Test echo prevention (originating client doesn't receive own update)
    - Test multiple clients stay in sync
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [ ]* 12.6 Write property tests for socket event handling
    - **Property 17: Socket Events Trigger Local State Updates**
    - **Property 18: API Requests Include Socket ID**
    - **Validates: Requirements 5.2, 5.4**

- [ ] 13. Integrate statistics with undo/redo system
  - [ ] 13.1 Extend historiStore to track stat changes
    - Add stat change entries to history when stats are updated
    - Store old and new values for all changed stats
    - Include playerId and teamIndex in history entry
    - _Requirements: 6.1_
  
  - [ ] 13.2 Implement stat rollback on undo
    - When undo is triggered, revert stats to old values
    - Ensure all related stats are rolled back atomically
    - Persist rollback to backend API
    - Broadcast undo via socket to other clients
    - _Requirements: 6.2, 6.4, 6.5_
  
  - [ ] 13.3 Implement stat reapply on redo
    - When redo is triggered, reapply stats to new values
    - Persist redo to backend API
    - Broadcast redo via socket to other clients
    - _Requirements: 6.3, 6.5_
  
  - [ ]* 13.4 Write integration tests for undo/redo
    - Test undo reverts stat changes correctly
    - Test redo reapplies stat changes correctly
    - Test undo/redo maintains consistency across related stats
    - Test undo/redo syncs across clients
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 13.5 Write property tests for undo/redo round-trip
    - **Property 20: Undo Reverts Most Recent Stat Change**
    - **Property 21: Redo Reapplies Undone Stat Change**
    - **Property 22: Undo/Redo Preserves Stat Consistency**
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [ ] 14. Checkpoint - Verify synchronization and undo/redo
  - Test stat updates sync across multiple browser windows
  - Test undo/redo works correctly for stat changes
  - Verify no echo updates occur
  - Ask the user if questions arise about synchronization behavior


- [ ] 15. Create player statistics overlay component
  - [ ] 15.1 Create PlayerStatsOverlay component
    - Create new component in components/gameComponent or appropriate location
    - Use 'use client' directive for client-side rendering
    - Accept props: gameId, position, scale, visible
    - Use Zustand hooks to access current batter and pitcher
    - _Requirements: 9.1, 9.2_
  
  - [ ] 15.2 Implement batter statistics display
    - Display current batter's name and number
    - Show AVG, AB, H, RBI, R stats
    - Calculate batting average using calculateBattingAverage
    - Use useMemo for performance optimization
    - _Requirements: 9.1, 9.4_
  
  - [ ] 15.3 Implement pitcher statistics display
    - Display current pitcher's name and number
    - Show IP, H, R, ER, BB, K, ERA stats
    - Calculate ERA using calculateERA
    - Format innings pitched correctly (X.Y notation)
    - Use useMemo for performance optimization
    - _Requirements: 9.2, 9.4_
  
  - [ ] 15.4 Style overlay with Tailwind CSS
    - Use existing overlay styling patterns (bg-black/80, text-white)
    - Create grid layout for stats display
    - Ensure text is readable at various scales
    - _Requirements: 9.4_
  
  - [ ] 15.5 Integrate overlay with gameStore overlay management
    - Add playerStatsOverlay to gameStore overlay state
    - Use existing handlePositionOverlay, handleScaleOverlay, handleVisibleOverlay methods
    - Ensure overlay positioning and scaling work correctly
    - _Requirements: 9.5_
  
  - [ ] 15.6 Add real-time stat updates to overlay
    - Subscribe to Zustand store changes for current batter and pitcher
    - Overlay updates automatically when stats change
    - Verify update latency is < 100ms
    - _Requirements: 9.3, 5.5_
  
  - [ ]* 15.7 Write component tests for PlayerStatsOverlay
    - Test overlay displays batter stats correctly
    - Test overlay displays pitcher stats correctly
    - Test overlay visibility toggle
    - Test overlay updates when stats change
    - _Requirements: 9.1, 9.2, 9.3, 9.6_
  
  - [ ]* 15.8 Write property tests for overlay display
    - **Property 29: Overlay Displays Current Batter Stats**
    - **Property 30: Overlay Displays Current Pitcher Stats**
    - **Property 31: Overlay Visibility Toggle Preserves Data**
    - **Validates: Requirements 9.1, 9.2, 9.6**


- [ ] 16. Implement CSV export functionality
  - [ ] 16.1 Create statsExport utility file
    - Create new file app/lib/statsExport.ts
    - Define GameStatsExport interface for export data structure
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 16.2 Implement CSV export function
    - Write exportStatsToCSV function
    - Generate CSV header row with all stat columns
    - Add game metadata as comments at top of file
    - Iterate through teams and players to create data rows
    - Calculate derived stats (AVG, ERA, WHIP) for each player
    - Use file-saver library to download CSV file
    - _Requirements: 10.2, 10.4, 10.5, 10.6_
  
  - [ ] 16.3 Create fetchGameStats helper function
    - Fetch complete game data including all players and stats
    - Format data into GameStatsExport structure
    - Include game metadata (date, teams, final score)
    - Group players by team
    - _Requirements: 10.5, 10.6_
  
  - [ ]* 16.4 Write unit tests for CSV export
    - Test CSV format is correct
    - Test all stats are included in export
    - Test game metadata is included
    - Test players are grouped by team
    - _Requirements: 10.2, 10.4, 10.5, 10.6_
  
  - [ ]* 16.5 Write property test for CSV export completeness
    - **Property 32: CSV Export Contains All Statistics**
    - **Property 34: Exports Group Statistics by Team**
    - **Property 35: Exports Include Game Metadata**
    - **Validates: Requirements 10.2, 10.4, 10.5, 10.6**

- [ ] 17. Implement PDF export functionality
  - [ ] 17.1 Implement PDF export function
    - Write exportStatsToPDF function using jsPDF
    - Add title and game metadata to PDF header
    - Use jsPDF-AutoTable for formatted statistics tables
    - _Requirements: 10.3, 10.6_
  
  - [ ] 17.2 Create batting statistics table in PDF
    - Generate table with columns: Player, #, Pos, AB, H, AVG, R, RBI, BB, K
    - Include all players from both teams
    - Style table with grid theme and colored headers
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ] 17.3 Create pitching statistics table in PDF
    - Generate separate table for pitchers only
    - Columns: Pitcher, IP, H, R, ER, BB, K, ERA, WHIP
    - Format innings pitched correctly
    - Calculate ERA and WHIP for display
    - _Requirements: 10.3, 10.4_
  
  - [ ] 17.4 Handle multi-page PDF layout
    - Add page breaks when content exceeds page height
    - Ensure tables don't split awkwardly across pages
    - _Requirements: 10.3_
  
  - [ ]* 17.5 Write unit tests for PDF export
    - Test PDF generation completes without errors
    - Test all stats are included in PDF tables
    - Test game metadata is included
    - Test pitchers have separate table
    - _Requirements: 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 17.6 Write property test for PDF export completeness
    - **Property 33: PDF Export Contains All Statistics**
    - **Validates: Requirements 10.3, 10.4**


- [ ] 18. Add export UI to game interface
  - [ ] 18.1 Create GameStatsExportButtons component
    - Create component with CSV and PDF export buttons
    - Use Lucide React icons (Download, FileText)
    - Only show buttons when game status is 'finished'
    - Style with Tailwind CSS and existing button patterns
    - _Requirements: 10.1_
  
  - [ ] 18.2 Implement export button handlers
    - handleExportCSV: fetch game stats and call exportStatsToCSV
    - handleExportPDF: fetch game stats and call exportStatsToPDF
    - Show toast notifications on successful export
    - Handle errors gracefully with error toasts
    - _Requirements: 10.1, 10.7_
  
  - [ ] 18.3 Integrate export buttons into game UI
    - Add GameStatsExportButtons to appropriate game page
    - Ensure buttons are visible and accessible after game ends
    - Test button functionality in browser
    - _Requirements: 10.1_
  
  - [ ]* 18.4 Write component tests for export buttons
    - Test buttons only appear when game is finished
    - Test CSV export button triggers download
    - Test PDF export button triggers download
    - Test error handling displays toast
    - _Requirements: 10.1_

- [ ] 19. Optimize performance and bundle size
  - [ ] 19.1 Implement stat calculation memoization
    - Add caching for derived stat calculations
    - Cache valid for 1 second to avoid excessive recalculation
    - Use Map-based cache with playerId:statName keys
    - _Requirements: 12.2_
  
  - [ ] 19.2 Implement lazy loading for export utilities
    - Use dynamic import() for statsExport module
    - Load export functions only when export buttons are clicked
    - Reduces initial bundle size
    - _Requirements: 12.7_
  
  - [ ] 19.3 Optimize API call batching
    - Review all stat update flows for batching opportunities
    - Combine multiple stat updates into single API calls where possible
    - Measure API call reduction
    - _Requirements: 12.4_
  
  - [ ] 19.4 Add performance monitoring
    - Measure stat update latency (target < 50ms)
    - Measure socket synchronization latency (target < 100ms)
    - Measure derived stat calculation time (target < 10ms)
    - Measure export generation time (CSV < 2s, PDF < 5s)
    - _Requirements: 12.2, 5.5_
  
  - [ ]* 19.5 Verify bundle size increase
    - Build production bundle and measure size increase
    - Ensure increase is < 50KB (minified + gzipped)
    - _Requirements: 12.7_

- [ ] 20. Checkpoint - Verify overlay and export functionality
  - Test player stats overlay displays correctly during game
  - Test CSV export downloads with all stats
  - Test PDF export generates formatted tables
  - Verify performance metrics are met
  - Ask the user if questions arise about overlay or export behavior


- [ ] 21. Implement comprehensive property-based tests
  - [ ]* 21.1 Set up fast-check testing infrastructure
    - Install fast-check library if not already present
    - Configure test runner for property-based tests
    - Set minimum 100 iterations per property test
    - _Requirements: All requirements (validation)_
  
  - [ ]* 21.2 Write property tests for offensive stats (Properties 1-6)
    - Property 1: At-Bat Counting Excludes Non-Qualifying Events
    - Property 2: Walk Events Increment Walk Counter
    - Property 3: Strikeout Events Update Both Batter and Pitcher
    - Property 4: Hit-By-Pitch Events Increment HBP Counter
    - Property 5: RBI Attribution Matches Runs Scored
    - Property 6: Runs Scored Increments for Home Plate Crossings
    - **Validates: Requirements 1.1-1.6, 4.6, 4.7, 4.9, 4.10**
  
  - [ ]* 21.3 Write property tests for defensive stats (Properties 7-8)
    - Property 7: Defensive Play Records Putout and Assists
    - Property 8: Error Events Increment Fielder Error Count
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 4.8**
  
  - [ ]* 21.4 Write property tests for pitching stats (Properties 9-14)
    - Property 9: Pitcher Innings Pitched Increments by Thirds
    - Property 10: Pitcher Stats Update on Hits Allowed
    - Property 11: Pitcher Runs Allowed Tracks All Runs
    - Property 12: Earned Runs Exclude Error-Assisted Runs
    - Property 13: Pitcher Walk and HBP Tracking
    - Property 14: Home Run Updates Pitcher Home Runs Allowed
    - **Validates: Requirements 3.1-3.7, 4.1-4.4**
  
  - [ ]* 21.5 Write property tests for initialization and persistence (Properties 15-16)
    - Property 15: New Player Statistics Initialize to Zero
    - Property 16: Statistics Persist After Updates
    - **Validates: Requirements 1.9, 1.10, 2.6, 2.7, 3.11, 3.12**
  
  - [ ]* 21.6 Write property tests for synchronization (Properties 17-19)
    - Property 17: Socket Events Trigger Local State Updates
    - Property 18: API Requests Include Socket ID
    - Property 19: Network Failures Don't Block UI
    - **Validates: Requirements 5.2, 5.4, 5.6, 12.5**
  
  - [ ]* 21.7 Write property tests for undo/redo (Properties 20-22)
    - Property 20: Undo Reverts Most Recent Stat Change
    - Property 21: Redo Reapplies Undone Stat Change
    - Property 22: Undo/Redo Preserves Stat Consistency
    - **Validates: Requirements 6.2, 6.3, 6.4**
  
  - [ ]* 21.8 Write property tests for calculations (Properties 23-28)
    - Property 23: Batting Average Calculation Formula
    - Property 24: ERA Calculation Formula
    - Property 25: OBP Calculation Formula
    - Property 26: SLG Calculation Formula
    - Property 27: WHIP Calculation Formula
    - Property 28: Division by Zero Returns Zero
    - **Validates: Requirements 8.1-8.6**
  
  - [ ]* 21.9 Write property tests for overlay display (Properties 29-31)
    - Property 29: Overlay Displays Current Batter Stats
    - Property 30: Overlay Displays Current Pitcher Stats
    - Property 31: Overlay Visibility Toggle Preserves Data
    - **Validates: Requirements 9.1, 9.2, 9.6**
  
  - [ ]* 21.10 Write property tests for export functionality (Properties 32-35)
    - Property 32: CSV Export Contains All Statistics
    - Property 33: PDF Export Contains All Statistics
    - Property 34: Exports Group Statistics by Team
    - Property 35: Exports Include Game Metadata
    - **Validates: Requirements 10.2-10.6**
  
  - [ ]* 21.11 Write property tests for performance (Properties 36-37)
    - Property 36: Stat Updates Batch When Possible
    - Property 37: Backward Compatibility with Existing Players
    - **Validates: Requirements 12.4, 12.6**


- [ ] 22. Write comprehensive integration tests
  - [ ]* 22.1 Write integration tests for complete game scenarios
    - Test complete inning with various events (hits, walks, outs, strikeouts)
    - Test pitcher substitution mid-inning (innings pitched calculation)
    - Test player substitution preserves stats
    - Test multiple runners scoring on single play (RBI calculation)
    - Test error scenarios and earned run determination
    - _Requirements: All requirements (integration validation)_
  
  - [ ]* 22.2 Write integration tests for multi-client synchronization
    - Simulate multiple clients connected to same game
    - Test stat updates broadcast to all clients
    - Test echo prevention works correctly
    - Test concurrent updates from different clients
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [ ]* 22.3 Write integration tests for undo/redo flows
    - Test undo after various stat updates
    - Test redo after undo
    - Test multiple undo/redo operations in sequence
    - Test undo/redo with related stats (e.g., hit updates batter and pitcher)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 22.4 Write integration tests for complete game export
    - Test export after complete 9-inning game
    - Test export with multiple pitchers and substitutions
    - Test export includes all players who participated
    - Test CSV and PDF formats are valid
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 23. Handle edge cases and error scenarios
  - [ ] 23.1 Implement error handling for API failures
    - Add try-catch blocks around all API calls
    - Handle network timeouts gracefully
    - Queue failed updates for retry
    - Show user-friendly error messages with toast notifications
    - _Requirements: 5.6, 12.5_
  
  - [ ] 23.2 Handle player substitution edge cases
    - Ensure substituted player's stats are preserved
    - New player starts with their own stats (may be 0 if first game)
    - Don't transfer stats from old player to new player
    - _Requirements: 1.9, 2.6, 3.11_
  
  - [ ] 23.3 Handle pitcher change mid-inning correctly
    - Calculate innings pitched correctly for both pitchers
    - Old pitcher gets credit for outs recorded before substitution
    - New pitcher gets credit for outs recorded after entering
    - _Requirements: 3.1, 11.6_
  
  - [ ] 23.4 Handle dropped third strike scenarios
    - Strikeout always credited to pitcher even if batter reaches base
    - Batter always gets strikeoutsReceived
    - Already implemented in recordDroppedThirdStrikeStats
    - _Requirements: 4.9_
  
  - [ ] 23.5 Implement earned run determination logic
    - Track if error occurred in current inning
    - Runs scored after error are unearned
    - Simplified implementation: flag-based tracking
    - _Requirements: 3.4, 11.5_
  
  - [ ]* 23.6 Write tests for all edge cases
    - Test player substitution preserves stats
    - Test pitcher change mid-inning
    - Test dropped third strike stat attribution
    - Test earned vs unearned run determination
    - _Requirements: 3.1, 3.4, 4.9_

- [ ] 24. Final checkpoint and validation
  - Run all unit tests and verify > 90% coverage
  - Run all property tests (37 properties) with 100 iterations each
  - Run all integration tests
  - Verify TypeScript compiles without errors in strict mode
  - Verify no breaking changes to existing functionality
  - Test complete game flow from start to finish with stats tracking
  - Verify performance metrics are met (< 50ms stat updates, < 100ms sync)
  - Verify bundle size increase is < 50KB
  - Ask the user if any issues or questions arise


## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints (tasks 5, 10, 14, 20, 24) ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties across all valid inputs
- Integration tests validate end-to-end flows and multi-component interactions
- The implementation follows the 10-phase plan from the design document
- All code uses TypeScript with strict mode enabled
- Real-time synchronization uses existing Socket.io infrastructure
- Statistics persist via existing backend API endpoints
- Undo/redo integrates with existing historiStore
- Overlay display uses existing overlay management infrastructure
- Export functionality uses existing jsPDF and file-saver libraries

## Implementation Language

TypeScript (as specified in the design document)

## Success Criteria

The implementation is complete when:
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
