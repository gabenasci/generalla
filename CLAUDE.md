# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Architecture

Generalla is a Valhalla-themed Generala (Yahtzee-like) dice game score tracker. Local single-device app with localStorage persistence.

**Tech Stack:** Next.js 16 (App Router), React 19, DaisyUI 5, Tailwind CSS 4, TypeScript

### Core Logic (`lib/`)

- **`scoring.ts`** - Game rules: 10 scoring categories (ones-sixes, escalera, full, poker, generala) with valid score values and servido bonuses
- **`game-state.ts`** - Types (`Player`, `GameState`) and state mutations (`setScore`, `createGame`, `checkGameComplete`)
- **`storage.ts`** - localStorage persistence under key `generalla_current_game`
- **`confetti.ts`** - Victory celebration using canvas-confetti with Valhalla-themed colors
- **`version.ts`** - Auto-generated version info (do not edit manually)

### Components (`components/`)

- **`ScoreTable.tsx`** - Main game board with score cells and category rows
- **`ScoreCell.tsx`** - Individual score cell with dropdown for score selection
- **`GameHeader.tsx`** - Navbar with current player badge, undo button, new game
- **`VictoryDialog.tsx`** - Full-screen victory celebration modal with flames/confetti
- **`WinnerBanner.tsx`** - Persistent winner display after game completion
- **`PlayerSetup.tsx`** - New game player name input form

### Pages (`app/`)

- **`/`** - Home: new game setup or continue existing game
- **`/game`** - Main game board with score table

### Build System

Version is auto-generated from git history via `scripts/generate-version.js`:
- Runs on `predev` and `prebuild` hooks
- Increments minor for `feat:` commits, patch for `fix:` commits
- Outputs to `lib/version.ts`

### Key Patterns

- DaisyUI dropdowns use native `<details>` elements (not React state)
- Current player advances to (scorer index + 1) % players.length after each score entry
- Score validation: each category has specific valid values (e.g., Twos: 0,2,4,6,8,10)
- Custom "valhalla" theme defined in `globals.css` via `@plugin "daisyui/theme"`
- Custom breakpoint `xs: 320px` for extra-small mobile screens
- Victory animations defined in `globals.css` (victory-glow, victory-entrance, flame-flicker)
- Uses lucide-react for icons (Swords, Crown, Skull, Flame, etc.)
