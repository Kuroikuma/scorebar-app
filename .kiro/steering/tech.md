# Technology Stack

## Framework & Runtime

- **Next.js 14.2.16** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js 20+** - Runtime environment

## Build System

- **Next.js Build System** - Built-in bundling and optimization
- **Turbopack** - Fast bundler (Next.js default)
- **PostCSS** - CSS processing
- **Sharp** - Image optimization

## Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **tailwindcss-animate** - Animation utilities
- **Sass** - CSS preprocessor
- **CSS Variables** - Theme customization (HSL color system)
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class utilities

## State Management

- **Zustand 5** - Lightweight state management
- Stores located in `app/store/`:
  - `gameStore.ts` - Game state (innings, balls, strikes, outs, bases)
  - `teamsStore.ts` - Team and player data
  - `configStore.ts` - Configuration management
  - `historiStore.ts` - Game history (undo/redo)
  - `overlayStore.ts` - Overlay positioning and visibility
  - `useBannerStore.ts`, `useSponsor.ts`, etc. - Feature-specific stores

## UI Components

- **Radix UI** - Headless accessible components
  - Dialog, Dropdown, Popover, Select, Slider, Switch, Tabs, Tooltip, etc.
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Sonner** - Toast notifications
- **React Easy Crop** - Image cropping
- **React Draggable** - Drag and drop

## Data & API

- **Axios** - HTTP client
- **Socket.io Client 4.8** - Real-time WebSocket communication
- **JWT Decode** - Token authentication
- API base URL: `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:5001/api`)

## Backend Integration

- **Firebase** - File storage (images, assets)
- **REST API** - Backend communication via Axios
- **WebSocket** - Real-time game updates via Socket.io

## Data Visualization & Export

- **Chart.js 4.4** - Data visualization
- **React ChartJS 2** - React wrapper for Chart.js
- **jsPDF** - PDF generation
- **jsPDF AutoTable** - Table generation in PDFs
- **XLSX** - Excel file handling
- **File Saver** - Client-side file downloads

## Utilities

- **date-fns** - Date manipulation
- **Lodash** - Utility functions
- **React Day Picker** - Date picker component
- **@tanstack/react-table** - Table management

## PWA Support

- **next-pwa** - Progressive Web App capabilities
- Service worker registration
- Offline support

## Development Tools

- **ESLint** - Code linting (Next.js config)
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Enabled with strict null checks

## Common Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Path Aliases

- `@/*` - Maps to workspace root (configured in `tsconfig.json`)
- Example: `@/app/store/gameStore` or `@/components/ui/button`

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- Firebase configuration (in `app/firebaseIntance.ts`)

## TypeScript Configuration

- **Strict mode enabled** - Full type safety
- **Module resolution**: bundler
- **JSX**: preserve (Next.js handles transformation)
- **Incremental compilation** - Faster builds
