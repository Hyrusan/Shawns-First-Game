# Guildstead

Guildstead is a cosy fantasy guild-management game prototype inspired by classic management simulations.

Begin with the humble Wayfarer's Rest, create a founding hero, and turn a roadside tavern into the first adventurers' guild in the Western March.

## Current Demo

- Interactive pixel-art world map and guildhall interior
- Looping map theme with an in-game music control
- Three-scene tavern prologue and guided Chapter One progression
- Character-led Guild Story briefings with a dedicated Mara portrait, resumable major announcements, and clear next objectives
- A gentle first-quest tutorial that introduces party dispatch and expedition decisions before the wider campaign appears
- Branching goblin quest chain with bespoke decisions and a Barrow Hill finale shaped by Goblin Intel and Village Support
- Male and female hero creation across four visual classes
- Gender-consistent class sprites for every named adventurer
- Human adventurer cast while distinctive fantasy-race artwork is deferred
- Tavern recruitment notices with travel time and three-candidate shortlists
- Persistent adventurer profiles and two complementary sprite atlases
- Positive and negative quirks with real quest effects
- Choice-driven Tavern Life events that shape gold, experience, traits, and character history
- Persistent friendships and rivalries with visible expedition chemistry bonuses
- Rank-scaled Guildmaster Actions that make each in-game day a set of meaningful choices
- End Day resolution with room orders, unused-action administration, and a fresh daily allowance
- A restrained Greenbank news bulletin with a full archive in the Guild Ledger
- Optional morning reports that summarise village changes, room orders, arrivals, and new work
- Weekly Guildstead Chronicle editions with quest, finance, growth, and standout-adventurer summaries
- Four-week seasonal reviews stored permanently in the Guild Ledger
- Seasonal Guildmaster focuses for protection, recruitment, prosperity, or training
- Rotating local requests with deadlines, material rewards, and visible effects on village threat and confidence
- Two distinct orders for every facility, including income, recovery, relationships, scouting, and group training
- Persistent expedition preparation from briefings, provisions, promoted contracts, and repair kits
- Timber, iron, and herb stores used for upgrades and Workshop crafting
- Equippable adventurer gear with clear power, travel, magic, and reward bonuses
- One-time Guild Rank choices that let each promotion shape the guild differently
- Timed Training Yard drills and teachable techniques with potential-based capacity
- Three-person expedition parties
- Inline quest-party selection with availability and mission-fit indicators
- Priority styling for story quests and expiring contracts, with party-size guidance
- One expedition per adventurer per day, making roster depth and daily planning matter
- Class-specific expedition battle animations
- Real-time mission clocks that continue while managing other screens
- Timed expedition encounters with story decisions plus class, ability, and quirk responses
- Enemy health, encounter consequences, and an optional auto-decision fallback
- Recoverable curios stored in the Guild Stores ledger
- Mission odds, rewards, injuries, experience, and levelling
- Room construction, blueprint unlocks, and facility upgrades
- Hand-painted facility emblems across the Hall, build screens, and world map
- Official guild charter milestone and evolving tavern presentation
- Timed realm events and animated mission dispatch
- Local browser save data
- Responsive desktop and mobile layouts
- Contextual map and management workspace modes
- Living tavern interiors with idle heroes, applicants, and visible room upgrades
- Hand-painted fantasy-anime tavern backdrop with live sprite overlays
- Smooth high-resolution tavern characters with grounded scene lighting

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
- `tests/`: deterministic gameplay smoke tests for progression, Chronicle reports, seasonal focuses, village requests, crafting, training, relationships, saves, and expeditions

## Testing

Run the gameplay smoke tests with Node.js:

```powershell
node --test tests\game-smoke.test.js
```

## Status

Guildstead is an evolving playable prototype. More story content, equipment variety, region progression, deeper relationships, and generational adventurer systems are planned for later development.
