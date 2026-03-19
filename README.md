# Safe Game – Vault Breach Simulator

**RememberCode** is an immersive reaction and memory game built with React 19, Vite 7, and modern tooling. Players crack a series of progressively difficult vault codes under pressure, guided by cinematic sound design, animated UI components, and a bilingual HUD (English / Hebrew) that responds to browser locale.

## Quick Snapshot
- Losely cyberpunk aesthetic with focus on rapid feedback, living logs, and animated doors.
- Score, level, and lives indicators, plus a terminal-style log (`BREACH_LOG`) that surfaces the last five events.
- Dynamic keypad that switches between numeric and alphanumeric layouts and can shuffle buttons to increase difficulty.
- Automated language detection via `src/i18n.ts` / `getLanguage()` for EN/HE labels.

## Core Features
- **Game logic (`useSafeGame`)** manages states, timers, difficulty scaling, random code generation, scoring, lives, localStorage-backed high score, and context-aware log entries (breaching, bypassing, access granted/denied).
- **Sound system (`useSound`)** uses the Web Audio API to play click, success, failure, stage-start, and ticking cues across oscillator nodes.
- **Visual feedback** is centered around `SafeDoor` (3D door + light + lock animation), `Display` (code/input/timer view with `Distraction` overlays), and confetti bursts for success/victory moments via `canvas-confetti`.
- **Reusable components**: modular CSS for each component (SafeDoor, Display, Keypad, Distraction) plus helper utilities (`src/utils/random.ts` for deterministic randomness).

## Running the project
1. Install dependencies: `npm install`. (Node 20+ recommended.)
2. Run locally: `npm run dev` and visit the URL shown by Vite (default `http://localhost:5173`).
3. Create a production build: `npm run build` (runs `tsc -b` first to ensure type safety).
4. Preview the build locally: `npm run preview`.
5. Lint the codebase: `npm run lint`.

## Architecture highlights
- `src/main.tsx` wires in the React root and global styles (`index.css`, `styles/variables.css`).
- `src/App.tsx` orchestrates HUD, SafeDoor, Display, Keypad, confetti, and footer controls (start, continue, retry) while connecting hooks and translations.
- `src/hooks/useSafeGame.ts` is the single source of truth for game status, timers, lives, scoring, difficulty, logs, and persistence.
- `src/hooks/useSound.ts` builds simple synth-like cues with oscillators, gains, and ramping.
- `src/components/` holds focused UI pieces:
  - `SafeDoor` animates a vault door and alarm overlay using Framer Motion.
  - `Display` renders codes, inputs, timer bars, and distraction layers with motion transitions.
  - `Keypad` renders buttons with optional shuffling and alphanumeric variants.
  - `Distraction` injects animated shapes to simulate interference.
- `src/utils/random.ts` offers `mulberry32` RNG plus seeded shuffling for repeatable layouts.

## Customization notes
- Adjust difficulty mapping in `getDifficulty` to tweak code length, timers, keypad behavior, and distraction intensity.
- Extend the `translations` object with new languages or rewrite existing copy; `t` is passed throughout the UI.
- Swap or extend audio cues in `useSound` to introduce new moods.
- Turn on/off keypad shuffling by toggling `difficulty.shuffledKeypad` when calling `Keypad`.

## Possible next steps
1. Add a local multiplayer or turn-based mode so players take turns breaching different vaults.
2. Hook into a backend (Firebase, Supabase, REST API) to store and display a global leaderboard.
3. Layer additional visual effects or adaptive difficulty signals that react to player performance.

## Important config files
- `vite.config.ts` (React plugin, Vite options). 
- `eslint.config.js` (modern ESLint + TypeScript + React rules). 
- `tsconfig.*.json` (type profiles for app, node, and shared configs).

Ready to dive in? `npm run dev`, press start, and watch the vault remember your every move.
