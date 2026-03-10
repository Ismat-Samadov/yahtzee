# YAHTZEE — Neon Cyberpunk Edition

A full-stack Yahtzee game built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Framer Motion. Featuring a neon cyberpunk aesthetic with glass morphism UI and procedurally generated sound effects.

## Features

- **Full Yahtzee rules** — all 13 scoring categories, upper section bonus, Yahtzee bonus rounds
- **AI opponent** — Easy (random) and Hard (optimal strategy) difficulty modes
- **Neon cyberpunk theme** — glowing neon colors, glass morphism cards, CSS grid background
- **Smooth animations** — Framer Motion dice roll animations, score reveals, screen transitions
- **Sound effects** — Web Audio API procedural sounds (no audio files needed)
- **High score persistence** — stored in localStorage
- **Responsive design** — works on mobile, tablet, and desktop
- **Pause/Resume** — pause the game at any time

## Tech Stack

- **Next.js 15.2** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v3** (custom neon theme)
- **Framer Motion 11** (animations)
- **Web Audio API** (sound effects)
- **Google Fonts** (Orbitron + Share Tech Mono)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Controls

### Mouse / Touch
- **Click Roll Dice** — roll all un-held dice (up to 3 times per turn)
- **Click a die** — toggle hold/unhold (after rolling)
- **Click a scorecard row** — lock in a score for that category

### Game Flow
1. Press **Roll Dice** to roll all 5 dice
2. Click dice you want to **keep** (they glow green when held)
3. Roll again up to 2 more times
4. Click a **scorecard category** to score your dice
5. Repeat for 13 rounds

## Scoring

| Category | Score |
|---|---|
| Ones - Sixes | Sum of that face value |
| Three of a Kind | Sum of all dice (if 3+ same) |
| Four of a Kind | Sum of all dice (if 4+ same) |
| Full House | 25 points |
| Small Straight | 30 points (4 consecutive) |
| Large Straight | 40 points (5 consecutive) |
| YAHTZEE | 50 points (5 of a kind) |
| Chance | Sum of all dice |
| Upper Bonus | +35 if upper section ≥ 63 |
| Yahtzee Bonus | +100 per extra Yahtzee |

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

## Project Structure

```
yahtzee/
├── app/
│   ├── globals.css       # Tailwind + custom neon CSS
│   ├── icon.tsx          # SVG favicon
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Main game page
├── components/
│   ├── game/
│   │   ├── Dice.tsx          # 5-dice container
│   │   ├── DiceFace.tsx      # Single die with pip layout
│   │   ├── EndScreen.tsx     # Game over + results
│   │   ├── GameControls.tsx  # Roll button + roll counter
│   │   ├── PauseModal.tsx    # Pause overlay
│   │   ├── PlayerInfo.tsx    # Player name + score header
│   │   ├── ScoreRow.tsx      # Single scorecard row
│   │   ├── Scorecard.tsx     # Full scorecard panel
│   │   └── SetupScreen.tsx   # Name input + difficulty
│   ├── layout/
│   │   └── Header.tsx        # Top navigation bar
│   └── ui/
│       └── Button.tsx        # Reusable neon button
├── hooks/
│   ├── useGameState.ts   # Core game state (useReducer)
│   ├── useHighScore.ts   # localStorage high score
│   └── useSounds.ts      # Web Audio sound effects
├── lib/
│   ├── aiPlayer.ts       # Easy + Hard AI logic
│   ├── constants.ts      # Game constants
│   ├── gameLogic.ts      # Scoring calculations
│   └── soundEffects.ts   # Web Audio API sounds
└── types/
    └── game.ts           # TypeScript interfaces
```
