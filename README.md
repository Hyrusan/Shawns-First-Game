# Guildstead

Guildstead is a cosy fantasy guild-management game prototype inspired by classic management simulations.

Begin with the humble Wayfarer's Rest, create a founding hero, and turn a roadside tavern into the first adventurers' guild in the Western March.

## Current Demo

- Interactive pixel-art world map and guildhall interior
- Looping map theme with an in-game music control
- Three-scene tavern prologue and guided Chapter One progression
- Goblin quest chain culminating in the Barrow Hill chief
- Male and female hero creation across four visual classes
- Gender-consistent class sprites for every named adventurer
- Human adventurer cast while distinctive fantasy-race artwork is deferred
- Tavern recruitment notices with travel time and three-candidate shortlists
- Persistent adventurer profiles and two complementary sprite atlases
- Positive and negative quirks with real quest effects
- Natural class abilities, long-term potential, and Training Yard techniques
- Three-person expedition parties
- Class-specific expedition battle animations
- Real-time mission clocks that continue while managing other screens
- Timed expedition encounters with class, ability, and quirk responses
- Enemy health, encounter consequences, and an optional auto-decision fallback
- Recoverable curios stored in the Guild Stores ledger
- Mission odds, rewards, injuries, experience, and levelling
- Room construction, blueprint unlocks, and facility upgrades
- Official guild charter milestone and evolving tavern presentation
- Timed realm events and animated mission dispatch
- Local browser save data
- Responsive desktop and mobile layouts
- Contextual map and management workspace modes
- Living tavern interiors with idle heroes, applicants, and visible room upgrades

## Running Locally

The prototype uses plain HTML, CSS, and JavaScript with no build step.

Open `index.html` directly in a browser, or run a local web server from the project folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Play Online

The latest version from `main` is automatically published through GitHub Pages:

`https://hyrusan.github.io/Shawns-First-Game/`

## Project Structure

- `index.html`: interface structure and game screens
- `styles.css`: visual design, responsive layout, map, and animations
- `game.js`: simulation state, rendering, missions, facilities, and saves
- `assets/`: generated sprites, the Western March map, and the map theme
- `docs/`: design direction, visual references, and content seeds
- `tests/`: deterministic gameplay smoke tests for expedition encounters

## Testing

Run the encounter smoke tests with Node.js:

```powershell
node --test tests\game-smoke.test.js
```

## Status

Guildstead is an evolving playable prototype. Story content, relationships, equipment, region progression, and generational adventurer systems are planned for later development.
