# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

A quiz web application built with React, Vite, and Appwrite backend. Features authentication, anti-cheat detection, and score tracking.

## Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint
```

## Architecture

### Tech Stack
- **React 19** with Vite 7
- **Appwrite** — authentication (email/password), database (questions, quizzes, results)
- **Framer Motion** — animations
- **Lucide React** — SVG icons
- **React Router 7** — client-side routing

### Environment Variables

Required `.env` variables:
- `VITE_APPWRITE_ENDPOINT` — Appwrite server URL
- `VITE_APPWRITE_PROJECT_ID` — Appwrite project ID
- `VITE_APPWRITE_DATABASE_ID` — Database ID
- `VITE_APPWRITE_COLLECTION_QUIZZES` — Quizzes collection ID
- `VITE_APPWRITE_COLLECTION_QUESTIONS` — Questions collection ID
- `VITE_APPWRITE_COLLECTION_RESULTS` — Results collection ID

See `src/lib/appwrite.js` for the Appwrite client setup.

### Routing (`src/App.jsx`)
| Path | Component | Auth |
|------|-----------|------|
| `/` | Redirects to `/dashboard` | — |
| `/login` | Login page | Public |
| `/signup` | Signup page | Public |
| `/dashboard` | Quiz listing dashboard | Protected |
| `/quiz/:sectionId` | Active quiz taking | Protected |
| `/result` | Quiz score results | Protected |

### File Structure
- `src/Pages/` — Route-level page components
- `src/components/` — Shared UI components (Button, Input, ProtectedRoute)
- `src/context/AuthContext.jsx` — Auth state management via React Context
- `src/hooks/useAntiCheat.js` — Tab visibility and right-click detection
- `src/lib/appwrite.js` — Appwrite client, account, and database exports
- `src/lib/quizHelpers.js` — Fisher-Yates shuffle and score calculation
- `src/lib/mockData.js` — Sample question data
- `src/index.css` — Custom utility-first CSS (NOT Tailwind). Contains all design tokens, responsive breakpoints (`sm:640px`, `md:768px`, `lg:1024px`), glass-morphism classes, animation keyframes, and component styles like `.quiz-option`, `.score-ring`, `.input-field`

### CSS Architecture

The project uses a custom utility-first CSS system in `src/index.css`, not Tailwind. Key patterns:
- Design tokens via CSS custom properties (`:root`)
- Responsive via `@media (min-width: ...)` and `@media (max-width: 640px)` breakpoints
- Utility classes mimic Tailwind naming (`bg-gray-950`, `text-white`, `p-6`, etc.)
- Component classes: `.glass`, `.glass-dark`, `.quiz-option`, `.score-ring`, `.input-field`, `.card-glow`, `.progress-bar`, `.badge`
- Background decoration: `.bg-decoration` with `.bg-blob` elements and `.bg-blob-grid`

### Data Model

Appwrite collections:
- **Quizzes**: `{ name, description, slug }`
- **Questions**: `{ quizId, text, options[], correctAnswer }`
- **Results**: `{ userId, quizId, score, total, cheatingDetected }`

Documents use Appwrite's `$id` for unique IDs. Questions are matched to quizzes via `quizId`.
