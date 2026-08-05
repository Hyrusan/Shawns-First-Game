# Guildstead

Guildstead is a cosy fantasy guild-management game prototype inspired by classic management simulations.

Create a founding hero, recruit persistent adventurers, improve guild facilities, respond to realm events, and choose parties for missions across the holy realm of Jenny.

## Current Demo

- Interactive world map and guildhall interior
- Hero creation and persistent adventurer profiles
- Eight-character pixel-art sprite atlas
- Three-person expedition parties
- Mission odds, rewards, injuries, experience, and levelling
- Facility upgrades and guild progression
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
- `assets/`: generated game artwork and production sprite atlas
- `docs/`: design direction, visual references, and content seeds

## Status

Guildstead is an evolving playable prototype. Story content, relationships, equipment, region progression, and generational adventurer systems are planned for later development.
