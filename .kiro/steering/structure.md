# Project Structure

## Architecture Pattern

Next.js 14 App Router with client-side state management (Zustand) and real-time synchronization (Socket.io).

## Directory Organization

### `/app` - Application Core (Next.js App Router)

- **Route-based pages** - Each folder represents a route
  - `/games` - Game management and listing
  - `/match` - Match details and control
  - `/overlay` - Broadcast overlay views
  - `/banner` - Banner management
  - `/sponsor` - Sponsor management
  - `/profile` - User profile
  - `/login` - Authentication
  - `/dashboard` - Main dashboard

- **`/store`** - Zustand state management
  - One store per domain (game, teams, config, history, overlays, etc.)
  - Stores contain both state and actions

- **`/service`** - API integration layer
  - `api.ts` - Main REST API client with Axios
  - `socket.ts` - WebSocket client configuration
  - Domain-specific services (banner, sponsor, organization, etc.)

- **`/context`** - React Context providers
  - `AuthContext.tsx` - Authentication state and JWT management

- **`/hooks`** - Custom React hooks
  - Socket hooks for real-time updates
  - File upload utilities
  - Player management hooks

- **`/types`** - TypeScript type definitions
  - Shared interfaces and types

- **`/lib`** - Utility functions
  - `utils.ts` - Helper functions (cn, etc.)
  - `defaultFormation.ts` - Baseball formation defaults

- **`/assets`** - Static assets (images, logos)

### `/components` - Reusable Components

- **`/ui`** - Base UI components (Radix UI + Tailwind)
  - Buttons, dialogs, dropdowns, inputs, etc.
  - Built with `class-variance-authority` for variants

- **Domain-specific components** - Organized by feature
  - `/bannerComponent` - Banner creation and preview
  - `/gameComponent` - Game-specific UI (player management, runner advancement)
  - `/MatchComponents` - Match control panels and scoreboards
  - `/config` - Configuration modals

### `/public` - Static Files

- PWA manifest
- Favicon and icons
- Public assets served directly

## File Naming Conventions

- **Pages**: `page.tsx` (Next.js App Router convention)
- **Components**: PascalCase (e.g., `BannerPreview.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Stores**: camelCase with "Store" suffix (e.g., `gameStore.ts`)
- **Services**: camelCase with ".service" suffix (e.g., `banner.service.ts`)
- **Types**: PascalCase interfaces (e.g., `Banner.ts`, `ITransaction.ts`)

## Code Organization Patterns

### State Management Pattern

```typescript
// Zustand store structure
export const useGameStore = create<GameState>((set, get) => ({
  // State
  inning: 1,
  balls: 0,
  
  // Actions
  setBalls: async (balls) => {
    set({ balls })
    await changeBallCount(get().id!, balls)
  }
}))
```

### API Service Pattern

```typescript
// Service layer with Axios interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`
  config.data.socketId = socket.id
  return config
})
```

### Component Pattern

- Use `'use client'` directive for client components
- Radix UI + Tailwind for consistent styling
- `cn()` utility for conditional classes
- Zustand hooks for state access

## Key Architectural Decisions

- **Client-side heavy** - Most logic in Zustand stores
- **Real-time sync** - Socket.io for live updates across clients
- **Optimistic updates** - UI updates immediately, then syncs to backend
- **History management** - Undo/redo via `historiStore`
- **Type safety** - Strict TypeScript throughout
