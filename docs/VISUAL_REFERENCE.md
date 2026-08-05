# Guildstead Visual Reference

## Source

Reference image supplied by Shawn on 2026-07-06.

The image establishes a useful target for Guildstead: warm pixel fantasy with clear management screens, readable labels, and cosy detail.

## Overall Style Direction

Guildstead should feel like a modern cosy fantasy management game with pixel-art charm.

Visual qualities to aim for:

- Dark framed UI panels with warm gold headings.
- Pixel-inspired typography and compact labels.
- Richly detailed but readable rooms.
- Clear class silhouettes.
- World map with named regions and visible roads.
- Event cards that feel like little story moments.
- Facilities shown as both exterior buildings and interior rooms.

## Reference Sections

### Adventurers

The character examples show distinct class identities:

| Class | Visual Cue | Gameplay Identity |
| --- | --- | --- |
| Warrior | Sword, red/brown armour | Frontline fighter |
| Knight | Shield, heavy armour | Defensive tank |
| Archer | Hood, bow, green palette | Ranged specialist |
| Mage | Robe, staff, blue palette | Elemental magic |
| Healer | White/gold robe | Healing and support |
| Rogue | Dark hood, daggers | Evasion and crits |
| Berserker | Wild hair, axe | High attack, lower defence |
| Druid | Antlers, nature colours | Nature magic and summons |
| Paladin | Gold armour, sword | Holy support and attacks |
| Summoner | Purple/dark palette | Creature summons |
| Bard | Hat, instrument | Buffs and morale |
| Alchemist | Goggles, potions | Items and explosives |
| Ranger | Animal companion | Versatile outdoors class |
| Monk | Simple robes | Fast strikes, inner power |
| Dragonkin | Horns, red skin | Rare powerful heritage |

### World Map

The map is not just decorative. It communicates progression.

Key traits:

- Guildstead sits at the centre.
- Roads connect regions.
- Regions have clear names.
- Biomes are visually distinct.
- Harder areas are visually further away or more dangerous.

Example regions from the sheet:

| Region | Biome | Possible Use |
| --- | --- | --- |
| Frostpeak Mountains | Snow mountains | High-level monsters, mining |
| Darkhollow Forest | Dark forest | Curses, witches, rare herbs |
| Westernwind Plains | Open grasslands | Early quests, caravans |
| Silverlake | Lake region | Fishing, ruins, water monsters |
| Sandstone Desert | Desert | Survival, relics |
| Embercore Volcano | Lava region | Late-game monsters, rare ore |
| Guildstead | Central town | Player base |

### Guildhall Interior

This is a major missing piece in the prototype.

The reference shows a side-on cutaway building with labelled rooms:

- Training Hall
- Library
- Tavern
- Workshop
- Quest Board
- Vault

This should become a primary management screen where facilities feel like real places rather than abstract cards.

Best implementation path:

1. Create a Guildhall Interior view.
2. Show rooms as labelled clickable areas.
3. Clicking a room opens its management panel.
4. Upgrades visibly change room level or decoration.
5. Adventurer sprites idle in rooms.

### Buildings And Exterior Facilities

The sheet shows exterior buildings for:

- Guildhall
- Tavern
- Blacksmith
- Shop
- Training Ground
- Alchemy Lab
- Stable
- Farm

These map neatly onto town expansion and guild progression.

### Interior Rooms

Reusable room types:

- Training Hall
- Library
- Infirmary
- Alchemy Lab
- Workshop
- Barracks
- Kitchen
- Vault
- Garden Room

These can become modular facility unlocks in the guild progression tree.

### UI Examples

The UI examples are useful because they are compact but rich.

Patterns to copy conceptually:

- Guild overview card with crest, name, reputation, level, and progress bar.
- Currency strip with gold, gems, and population/capacity.
- Season and date card.
- Quest board as stacked parchment cards.
- Event card with image, description, and choice buttons.

### Terrain Tiles

The terrain tile strip suggests the overworld should use a tile-like visual language:

- Grass
- Forest
- Dirt paths
- Mountains
- Snow
- Desert
- Water
- Bridges
- Coast

Even if we keep using CSS first, the map should be designed as if it could later become tile-based.

### Icons And Items

The item examples suggest compact, readable item icons:

- Swords
- Axes
- Bows
- Armour
- Shields
- Potions
- Coins
- Books
- Rings
- Gems
- Chests
- Plants
- Ore

### Creatures And Pets

The creature strip suggests a lighter, cute tone:

- Slime
- Fox
- Baby dragon
- Owl
- Cat
- Rabbit
- Chick

This is useful because Guildstead should not be grim fantasy. It should have danger, but still feel warm and playful.

## UI Principles For Guildstead

1. Prefer screens with strong identity over generic panels.
2. Make major systems accessible from the map or guildhall.
3. Use event cards for story moments.
4. Use labelled rooms for facilities.
5. Use character portraits/sprites for adventurer identity.
6. Keep management controls compact and readable.
7. Show progression visually, not just numerically.

## Recommended Next Implementation

Build a **Guildhall Interior Management View**.

Why this next:

- It directly improves the current UI.
- It gives facilities a physical home.
- It supports future animated adventurers.
- It makes upgrades more satisfying.
- It gives Quest Board, Tavern, Library, Workshop, and Vault distinct identities.

Initial rooms:

| Room | Click Action |
| --- | --- |
| Quest Board | Opens missions |
| Training Hall | Opens adventurers/training |
| Tavern | Opens recruitment and relationships |
| Workshop | Opens equipment/facility upgrades |
| Library | Opens research/progression tree |
| Vault | Opens resources and guild records |

## Longer-Term Visual Roadmap

1. Guildhall interior view.
2. Region-based overworld map.
3. Adventurer class sprite variants.
4. Quest parchment card redesign.
5. Event card redesign with image area and choices.
6. Facility exterior/town expansion screen.
7. Seasonal visual swaps.
8. Equipment and item icon set.
