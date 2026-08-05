# Guildstead

Guildstead is a cosy fantasy guild-management game prototype inspired by classic management simulations.

Begin with the humble Wayfarer's Rest, create a founding hero, and turn a roadside tavern into the first adventurers' guild in the Western March.

## Current Demo

- Interactive pixel-art world map and guildhall interior
- Three-scene tavern prologue and guided Chapter One progression
- Goblin quest chain culminating in the Barrow Hill chief
- Male and female hero creation across four visual classes
- Persistent adventurer profiles and two complementary sprite atlases
- Three-person expedition parties
- Class-specific expedition battle animations
- Real-time mission clocks that continue while managing other screens
- Mission odds, rewards, injuries, experience, and levelling
- Room construction, blueprint unlocks, and facility upgrades
- Official guild charter milestone and evolving tavern presentation
- Timed realm events and animated mission dispatch
- Local browser save data
- Responsive desktop and mobile layouts

## Running Locally

The prototype uses plain HTML, CSS, and JavaScript with no build step.

Open `index.html` directly in a browser, or run a local web server from the project folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Project Structure

- `index.html`: interface structure and game screens
- `styles.css`: visual design, responsive layout, map, and animations
- `game.js`: simulation state, rendering, missions, facilities, and saves
- `assets/`: generated hero sprites, recruit sprites, and the Western March map
- `docs/`: design direction, visual references, and content seeds

## Status

Guildstead is an evolving playable prototype. Story content, relationships, equipment, region progression, and generational adventurer systems are planned for later development.
