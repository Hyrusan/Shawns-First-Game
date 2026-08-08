const STORAGE_KEY = "guildstead-demo-save";
const SAVE_VERSION = 11;
const RECRUITMENT_COST = 45;

const classes = {
  warden: { label: "Warrior", primary: "str", secondary: "wit", stats: { str: 9, mag: 3, wit: 5, cha: 5 } },
  spellwright: { label: "Mage", primary: "mag", secondary: "wit", stats: { str: 3, mag: 9, wit: 7, cha: 4 } },
  ranger: { label: "Ranger", primary: "wit", secondary: "str", stats: { str: 6, mag: 4, wit: 8, cha: 5 } },
  minstrel: { label: "Minstrel", primary: "cha", secondary: "mag", stats: { str: 4, mag: 5, wit: 6, cha: 9 } },
  rookie: { label: "Rookie", primary: "str", secondary: "wit", stats: { str: 5, mag: 4, wit: 5, cha: 5 } }
};

const quirkCatalog = {
  dauntless: { name: "Dauntless", tone: "positive", description: "+4 power on dangerous quests.", dangerPower: 4 },
  quickStudy: { name: "Quick Study", tone: "positive", description: "Earns 15% more experience.", xpRate: 1.15 },
  keenEye: { name: "Keen Eye", tone: "positive", description: "+3 power on WIT quests.", focus: "wit", focusPower: 3 },
  hearty: { name: "Hearty", tone: "positive", description: "Recovers from injuries 3 seconds sooner.", recoveryReduction: 3 },
  charmer: { name: "Charming", tone: "positive", description: "Adds 6% to quest gold rewards.", goldRate: 0.06 },
  lucky: { name: "Lucky", tone: "positive", description: "+2 to the party's success roll.", rollBonus: 2 },
  nervous: { name: "Nervous", tone: "negative", description: "-3 power on dangerous quests.", dangerPower: -3 },
  clumsy: { name: "Clumsy", tone: "negative", description: "-2 power on every quest.", power: -2 },
  homesick: { name: "Homesick", tone: "negative", description: "Journeys take 8% longer.", durationRate: 1.08 },
  stubborn: { name: "Stubborn", tone: "negative", description: "Earns 10% less experience.", xpRate: 0.9 },
  frail: { name: "Frail", tone: "negative", description: "Injuries take 3 seconds longer to heal.", recoveryReduction: -3 },
  showboat: { name: "Showboat", tone: "negative", description: "-3 power when travelling alone.", soloPower: -3 }
};

const abilityCatalog = {
  shieldBash: { name: "Shield Bash", source: "natural", classId: "warden", level: 1, description: "+4 power on STR quests.", focus: "str", focusPower: 4 },
  holdTheLine: { name: "Hold the Line", source: "natural", classId: "warden", level: 4, description: "+2 power for every companion.", allyPower: 2 },
  steelResolve: { name: "Steel Resolve", source: "natural", classId: "warden", level: 8, description: "Recovers from injuries 4 seconds sooner.", recoveryReduction: 4 },
  emberBolt: { name: "Ember Bolt", source: "natural", classId: "spellwright", level: 1, description: "+4 power on MAG quests.", focus: "mag", focusPower: 4 },
  arcaneStudy: { name: "Arcane Study", source: "natural", classId: "spellwright", level: 4, description: "Earns 12% more experience.", xpRate: 1.12 },
  grandRitual: { name: "Grand Ritual", source: "natural", classId: "spellwright", level: 8, description: "+5 power on dangerous quests.", dangerPower: 5 },
  aimedShot: { name: "Aimed Shot", source: "natural", classId: "ranger", level: 1, description: "+4 power on WIT quests.", focus: "wit", focusPower: 4 },
  pathfinder: { name: "Pathfinder", source: "natural", classId: "ranger", level: 4, description: "Reduces journey time by 8%.", durationRate: 0.92 },
  monsterHunter: { name: "Monster Hunter", source: "natural", classId: "ranger", level: 8, description: "+5 power on dangerous quests.", dangerPower: 5 },
  rousingVerse: { name: "Rousing Verse", source: "natural", classId: "minstrel", level: 1, description: "+2 power for every companion.", allyPower: 2 },
  fortunateTune: { name: "Fortunate Tune", source: "natural", classId: "minstrel", level: 4, description: "Adds 8% to quest gold rewards.", goldRate: 0.08 },
  heroesEncore: { name: "Hero's Encore", source: "natural", classId: "minstrel", level: 8, description: "Successful quests earn 1 extra fame.", fameBonus: 1 },
  luckySwing: { name: "Lucky Swing", source: "natural", classId: "rookie", level: 1, description: "+2 power on every quest.", power: 2 },
  adaptable: { name: "Adaptable", source: "natural", classId: "rookie", level: 4, description: "+2 power on the quest's key stat.", focusPower: 2 },
  fieldDressing: { name: "Field Dressing", source: "training", trainingLevel: 1, cost: 35, description: "Recovers from injuries 3 seconds sooner.", recoveryReduction: 3 },
  questcraft: { name: "Questcraft", source: "training", trainingLevel: 1, cost: 45, description: "+2 power on every quest.", power: 2 },
  rapidStudy: { name: "Rapid Study", source: "training", trainingLevel: 2, cost: 65, description: "Earns 15% more experience.", xpRate: 1.15 },
  trailMarch: { name: "Trail March", source: "training", trainingLevel: 2, cost: 70, description: "Reduces journey time by 8%.", durationRate: 0.92 },
  monsterLore: { name: "Monster Lore", source: "training", trainingLevel: 3, cost: 95, description: "+4 power on dangerous quests.", dangerPower: 4 },
  inspiringPresence: { name: "Inspiring Presence", source: "training", trainingLevel: 3, cost: 105, description: "+2 power for every companion.", allyPower: 2 }
};

const classAbilityTracks = {
  warden: ["shieldBash", "holdTheLine", "steelResolve"],
  spellwright: ["emberBolt", "arcaneStudy", "grandRitual"],
  ranger: ["aimedShot", "pathfinder", "monsterHunter"],
  minstrel: ["rousingVerse", "fortunateTune", "heroesEncore"],
  rookie: ["luckySwing", "adaptable"]
};

const trainingAbilityIds = ["fieldDressing", "questcraft", "rapidStudy", "trailMarch", "monsterLore", "inspiringPresence"];
const positiveQuirkIds = ["dauntless", "quickStudy", "keenEye", "hearty", "charmer", "lucky"];
const negativeQuirkIds = ["nervous", "clumsy", "homesick", "stubborn", "frail", "showboat"];

const introScenes = [
  {
    eyebrow: "The Wayfarer's Rest",
    title: "A Quiet Little Tavern",
    portraitSlot: 3,
    copy: [
      "For years, the Wayfarer's Rest has offered warm soup, spare beds, and only the occasional chair thrown during an argument.",
      "Mara, your tireless tavern assistant, keeps the place running while you decide whether the leaking roof is technically an emergency."
    ],
    button: "Begin the Day"
  },
  {
    eyebrow: "Trouble on Greenbank Road",
    title: "The Goblins Took Everything",
    portraitSlot: 2,
    copy: [
      "A frightened merchant stumbles through the door. Goblins have raided his cart, stolen the tavern's weekly supplies, and driven travellers from the road.",
      "The local guard is three villages away. Greenbank needs someone closer."
    ],
    button: "Speak to Mara"
  },
  {
    eyebrow: "Mara's Rather Ambitious Idea",
    title: "What If We Became A Guild?",
    portraitSlot: 3,
    copy: [
      "Mara leans across the bar. Adventurers already pass through here, and the whole area needs help. We have beds, food, and a wall large enough for a noticeboard.",
      "Find one dependable hero, recover the supplies, and perhaps this ordinary tavern can become something more."
    ],
    button: "Create Your Hero"
  }
];

const chapterMoments = {
  recruitment: {
    eyebrow: "Mara's Next Bright Idea",
    title: "Put The Word Out",
    text: "One hero recovered the supplies, but Greenbank will need more than one pair of hands. Mara can post a paid notice in the tavern. Cover the travel costs now, wait a day or two, and choose who deserves a place at your table.",
    button: "Visit The Tavern",
    view: "adventurers"
  },
  questBoard: {
    eyebrow: "Chapter One: Goblin Trouble",
    title: "A Noticeboard With Ambition",
    text: "The supplies are back and Greenbank is talking about your little band. Mara has found an old board in the cellar. Build a proper Quest Board and the tavern can start taking local requests.",
    button: "Build the Quest Board",
    view: "facilities"
  },
  expansion: {
    eyebrow: "Guildstead Is Growing",
    title: "We Need More Than A Noticeboard",
    text: "Three local problems solved, and the tavern is full of people asking for help. Choose your first major expansion: beds for a larger roster, a yard for training, or a kitchen for better provisions.",
    button: "Choose an Expansion",
    view: "facilities"
  },
  charter: {
    eyebrow: "Royal Charter Awarded",
    title: "Welcome To Guildstead",
    text: "With the Barrow Hill goblins defeated, the Western March finally has a recognised adventurers' guild. The Wayfarer's Rest is now Guildstead Hall, and its next chapter is yours to build.",
    button: "Raise the Guild Banner",
    view: "guildhall"
  }
};

const facilities = [
  {
    id: "tavern",
    name: "Tavern",
    icon: "A",
    colour: "#d07b77",
    gridColumn: "1 / span 3",
    gridRow: "1 / span 2",
    mapLeft: "18%",
    mapTop: "70%",
    buildCost: 0,
    baseCost: 110,
    effect: "Earns daily income and improves the quality of new recruits"
  },
  {
    id: "questBoard",
    name: "Quest Board",
    icon: "Q",
    colour: "#efcf65",
    gridColumn: "4 / span 3",
    gridRow: "1 / span 1",
    mapLeft: "26%",
    mapTop: "37%",
    buildCost: 55,
    baseCost: 90,
    effect: "Better mission scouting and fame rewards"
  },
  {
    id: "dormitory",
    name: "Dormitory",
    icon: "D",
    colour: "#e69bb0",
    gridColumn: "4 / span 3",
    gridRow: "2 / span 1",
    mapLeft: "46%",
    mapTop: "67%",
    buildCost: 80,
    baseCost: 110,
    effect: "Adds roster space and shortens injury recovery"
  },
  {
    id: "trainingYard",
    name: "Training Yard",
    icon: "T",
    colour: "#80b56d",
    gridColumn: "1 / span 2",
    gridRow: "3 / span 1",
    mapLeft: "34%",
    mapTop: "61%",
    buildCost: 95,
    baseCost: 120,
    effect: "Adds strength and experience to every expedition"
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: "K",
    colour: "#d9a45b",
    gridColumn: "3 / span 2",
    gridRow: "3 / span 1",
    mapLeft: "39%",
    mapTop: "43%",
    buildCost: 85,
    baseCost: 110,
    effect: "Provides expedition supplies and improves daily income"
  },
  {
    id: "workshop",
    name: "Workshop",
    icon: "W",
    colour: "#7aa7be",
    gridColumn: "5 / span 2",
    gridRow: "3 / span 1",
    mapLeft: "49%",
    mapTop: "55%",
    buildCost: 130,
    baseCost: 140,
    effect: "Adds equipment power to dangerous missions"
  }
];

const guildRooms = [
  {
    id: "tavernRoom",
    name: "Tavern",
    label: "Tavern",
    facilityId: "tavern",
    targetView: "adventurers",
    action: "Manage Regulars",
    description: "The warm heart of the Wayfarer's Rest, where rumours, recruits, and bowls of stew all arrive eventually.",
    occupant: "minstrel"
  },
  {
    id: "questBoard",
    name: "Quest Board",
    label: "Quest Board",
    facilityId: "questBoard",
    targetView: "quest",
    action: "Open Quest Board",
    description: "Review local work, realm requests, and dangerous contracts before choosing a party.",
    occupant: "warden"
  },
  {
    id: "dormitoryRoom",
    name: "Dormitory",
    label: "Dormitory",
    facilityId: "dormitory",
    targetView: "adventurers",
    action: "View Roster",
    description: "Simple bunks give more adventurers somewhere to sleep and injured heroes somewhere to recover.",
    occupant: "rookie"
  },
  {
    id: "trainingHall",
    name: "Training Yard",
    label: "Training",
    facilityId: "trainingYard",
    targetView: "adventurers",
    action: "Manage Adventurers",
    description: "A practical yard for drills, sparring, and learning which end of the spear points away from you.",
    occupant: "ranger"
  },
  {
    id: "kitchenRoom",
    name: "Kitchen",
    label: "Kitchen",
    facilityId: "kitchen",
    targetView: "facilities",
    action: "Prepare Provisions",
    description: "Hot meals improve income and keep expedition packs stocked with something better than dry oats.",
    occupant: "minstrel"
  },
  {
    id: "workshopRoom",
    name: "Workshop",
    label: "Workshop",
    facilityId: "workshop",
    targetView: "facilities",
    action: "Improve Equipment",
    description: "Tools, plans, and half-finished inventions that make dangerous missions a little less foolish.",
    occupant: "rookie"
  }
];

const missionDeck = [
  {
    id: "stolenSupplies",
    name: "Recover the Stolen Supplies",
    location: "Greenbank Lane",
    description: "Follow the goblin tracks and bring the tavern's stolen provisions home.",
    difficulty: 8,
    duration: 30,
    gold: 65,
    fame: 3,
    unlockFame: 0,
    focus: "wit",
    tutorial: true,
    guaranteedSuccess: true,
    marker: { left: "56%", top: "47%" }
  },
  {
    id: "greenbankCart",
    name: "Guard the Greenbank Cart",
    location: "Greenbank Road",
    description: "Escort a flour cart through the stretch of road the goblins have been watching.",
    difficulty: 24,
    duration: 36,
    gold: 48,
    fame: 4,
    unlockFame: 0,
    focus: "str",
    localRequest: true,
    marker: { left: "63%", top: "56%" }
  },
  {
    id: "lostWoodcutter",
    name: "Find the Lost Woodcutter",
    location: "Mushroomwood Edge",
    description: "Search the woodland paths before nightfall and keep an eye out for goblin snares.",
    difficulty: 27,
    duration: 42,
    gold: 55,
    fame: 5,
    unlockFame: 0,
    focus: "wit",
    localRequest: true,
    marker: { left: "69%", top: "36%" }
  },
  {
    id: "mooncapRemedy",
    name: "Gather Mooncap Remedy",
    location: "Mara's Herb Path",
    description: "Collect mooncap mushrooms for the village healer without disturbing the local nest.",
    difficulty: 30,
    duration: 48,
    gold: 60,
    fame: 5,
    unlockFame: 0,
    focus: "mag",
    localRequest: true,
    marker: { left: "76%", top: "44%" }
  },
  {
    id: "barrowHill",
    name: "Defeat the Barrow Hill Chief",
    location: "Barrow Hill",
    description: "Break the goblin camp, recover the stolen trade goods, and make Greenbank Road safe again.",
    difficulty: 40,
    duration: 60,
    gold: 170,
    fame: 22,
    unlockFame: 0,
    focus: "str",
    chapterBoss: true,
    marker: { left: "84%", top: "23%" }
  },
  {
    id: "oldNorthRoad",
    name: "Reopen the Old North Road",
    location: "Old North Road",
    description: "A larger contract from beyond Greenbank, available to a chartered guild.",
    difficulty: 58,
    duration: 75,
    gold: 120,
    fame: 14,
    unlockFame: 18,
    focus: "cha",
    postCharter: true,
    marker: { left: "88%", top: "60%" }
  }
];

const eventMissionDeck = [
  {
    templateId: "lantern-vigil",
    name: "Lantern Vigil",
    location: "Jenny's Belltown",
    description: "A sacred lantern has gone dark outside Belltown. The wardens ask Guildstead to investigate before evening prayers.",
    difficulty: 30,
    duration: 45,
    gold: 72,
    fame: 14,
    focus: "mag",
    expiresIn: 4,
    marker: { left: "72%", top: "34%" }
  },
  {
    templateId: "bridge-bells",
    name: "Bridge Bell Rescue",
    location: "Saffron Bridge",
    description: "The bridge bells are ringing without a keeper. Travellers are stuck on the crossing and need a calm escort home.",
    difficulty: 36,
    duration: 50,
    gold: 86,
    fame: 16,
    focus: "cha",
    expiresIn: 3,
    marker: { left: "66%", top: "71%" }
  },
  {
    templateId: "abbey-stores",
    name: "Abbey Storehouse Audit",
    location: "West Abbey",
    description: "A shipment for the holy kitchens has vanished from the ledgers. The abbey wants sharp eyes and quiet questions.",
    difficulty: 42,
    duration: 65,
    gold: 96,
    fame: 18,
    focus: "wit",
    expiresIn: 5,
    marker: { left: "84%", top: "50%" }
  }
];

const lootCatalog = {
  goblinToken: { name: "Goblin Token", mark: "GT", description: "Proof that Guildstead has made Greenbank Road safer." },
  oldRoadMap: { name: "Old Road Map", mark: "RM", description: "A weathered map with useful paths marked in charcoal." },
  healingHerbs: { name: "Healing Herbs", mark: "HH", description: "A field kit of clean bandages and bitter-smelling herbs." },
  silverCharm: { name: "Silver Charm", mark: "SC", description: "A small relic recovered from an old roadside cache." }
};

const encounterDeck = {
  goblinAmbush: {
    id: "goblinAmbush",
    title: "Goblin Archers On The Ridge",
    enemyName: "Goblin Raiders",
    description: "Arrows strike the road ahead. The party has seconds to break the ambush before the goblins surround them.",
    dangerous: true,
    special: {
      id: "monsterLore",
      abilityId: "monsterLore",
      label: "Exploit their habits",
      detail: "Monster Lore reveals the signal caller hiding behind the ridge.",
      result: "{hero} reads the goblin signals and collapses the ambush before it can close.",
      powerBonus: 10,
      enemyDamage: 38,
      xpBonus: 4,
      lootId: "goblinToken"
    },
    classChoices: {
      warden: { label: "Hold the road", detail: "Draw their fire behind a raised shield.", result: "{hero} holds the road while the others close the distance.", powerBonus: 8, enemyDamage: 30 },
      spellwright: { label: "Scatter the ridge", detail: "Answer the volley with a burst of flame.", result: "{hero}'s spell sends the archers scrambling from cover.", powerBonus: 7, enemyDamage: 34 },
      ranger: { label: "Take the goat path", detail: "Circle through the bracken and strike from above.", result: "{hero} finds a hidden path and turns the ambush around.", powerBonus: 6, enemyDamage: 27, lootId: "oldRoadMap" },
      minstrel: { label: "Spoil their rhythm", detail: "Use an echoing war song to confuse their signals.", result: "{hero}'s chorus throws the goblin volley into complete disorder.", powerBonus: 5, enemyDamage: 23, fameBonus: 1 },
      rookie: { label: "Cause a distraction", detail: "Make enough noise to pull the archers out of position.", result: "{hero} creates a surprisingly effective distraction.", powerBonus: 4, enemyDamage: 19 }
    }
  },
  collapsedBridge: {
    id: "collapsedBridge",
    title: "The Bridge Gives Way",
    enemyName: "Roadside Marauders",
    description: "A rotten span collapses under the supply cart while opportunistic bandits gather on the far bank.",
    dangerous: true,
    special: {
      id: "trailMarch",
      abilityId: "trailMarch",
      label: "Use the old crossing",
      detail: "Trail March recalls a shallow ford hidden downstream.",
      result: "{hero} leads everyone through an old ford and catches the marauders off guard.",
      powerBonus: 9,
      enemyDamage: 30,
      goldBonus: 18,
      lootId: "oldRoadMap"
    },
    classChoices: {
      warden: { label: "Shore up the beams", detail: "Hold the broken span steady while the party crosses.", result: "{hero} braces the bridge long enough to save every pack.", powerBonus: 7, enemyDamage: 20, injuryShield: 1 },
      spellwright: { label: "Float the supplies", detail: "Carry the packs over the gap with careful magic.", result: "{hero} lifts the supplies across without losing so much as a spoon.", powerBonus: 6, enemyDamage: 24, goldBonus: 12 },
      ranger: { label: "Find a ford", detail: "Read the river and lead the party through safely.", result: "{hero} finds firm footing beneath the rushing water.", powerBonus: 7, enemyDamage: 22, lootId: "oldRoadMap" },
      minstrel: { label: "Rally the travellers", detail: "Turn a frightened crowd into a working repair crew.", result: "{hero} has the bridge patched before the bandits can believe it.", powerBonus: 5, enemyDamage: 18, fameBonus: 2 },
      rookie: { label: "Carry the ropes", detail: "Get stuck in and keep the repair moving.", result: "{hero} keeps ropes, planks, and people exactly where they are needed.", powerBonus: 4, enemyDamage: 16 }
    }
  },
  woundedTraveller: {
    id: "woundedTraveller",
    title: "A Wounded Traveller",
    enemyName: "Road Stalkers",
    description: "A wounded pilgrim lies beside the trail. Something is still moving in the long grass behind them.",
    dangerous: false,
    special: {
      id: "fieldDressing",
      abilityId: "fieldDressing",
      label: "Treat them properly",
      detail: "Field Dressing can stabilise the traveller before danger returns.",
      result: "{hero} treats the traveller with calm, practised hands and learns where the attackers went.",
      powerBonus: 8,
      enemyDamage: 24,
      fameBonus: 2,
      injuryShield: 1,
      lootId: "healingHerbs"
    },
    classChoices: {
      warden: { label: "Guard the roadside", detail: "Form a shield wall while the traveller is moved.", result: "{hero} keeps watch and drives the hidden stalkers back.", powerBonus: 7, enemyDamage: 28, injuryShield: 1 },
      spellwright: { label: "Read the magic", detail: "Trace the strange residue around the traveller's wounds.", result: "{hero} reveals the creatures hiding beneath an illusion.", powerBonus: 7, enemyDamage: 30, xpBonus: 3 },
      ranger: { label: "Track the attackers", detail: "Follow the crushed grass before the trail goes cold.", result: "{hero} circles behind the attackers and secures the road.", powerBonus: 7, enemyDamage: 29, lootId: "healingHerbs" },
      minstrel: { label: "Win their trust", detail: "Keep the traveller calm and learn what happened.", result: "{hero} coaxes out the full story and a warning that saves the party.", powerBonus: 5, enemyDamage: 17, fameBonus: 2 },
      rookie: { label: "Share the supplies", detail: "Offer water, bandages, and a steady hand.", result: "{hero} gives up part of the pack and earns a grateful new friend.", powerBonus: 4, enemyDamage: 14, fameBonus: 1, injuryShield: 1 }
    }
  },
  hiddenCache: {
    id: "hiddenCache",
    title: "A Cache Beneath The Roots",
    enemyName: "Cache Guardian",
    description: "An iron-bound coffer sits beneath an uprooted tree. Fresh tracks suggest its owner may still be nearby.",
    dangerous: false,
    special: {
      id: "keenEye",
      quirkId: "keenEye",
      label: "Spot the false latch",
      detail: "Keen Eye catches the tiny wire running beneath the lock.",
      result: "{hero} finds the trap, opens the true latch, and recovers the cache intact.",
      powerBonus: 8,
      enemyDamage: 25,
      goldBonus: 24,
      lootId: "silverCharm"
    },
    classChoices: {
      warden: { label: "Break the lock", detail: "Force the coffer before its owner returns.", result: "{hero} breaks the lock with one committed strike.", powerBonus: 6, enemyDamage: 24, goldBonus: 16 },
      spellwright: { label: "Dispel the ward", detail: "Unpick the faint runes around the iron bands.", result: "{hero} peels away an old ward and opens the cache safely.", powerBonus: 7, enemyDamage: 28, xpBonus: 3, lootId: "silverCharm" },
      ranger: { label: "Check for traps", detail: "Study the tracks, latch, and disturbed leaves first.", result: "{hero} finds every trap and the safest route out.", powerBonus: 7, enemyDamage: 25, goldBonus: 12, lootId: "oldRoadMap" },
      minstrel: { label: "Recall the old ballad", detail: "The markings resemble a verse about a smuggler's hoard.", result: "{hero} remembers the final verse, including the coffer's hidden catch.", powerBonus: 5, enemyDamage: 18, fameBonus: 1, lootId: "silverCharm" },
      rookie: { label: "Prod it from a distance", detail: "A long branch is not elegant, but it is available.", result: "{hero}'s cautious prodding springs the trap from a very sensible distance.", powerBonus: 4, enemyDamage: 15, goldBonus: 8 }
    }
  }
};

const names = [
  "Mira",
  "Bram",
  "Tessa",
  "Rook",
  "Nyx",
  "Corin",
  "Elowen",
  "Jory",
  "Vale",
  "Pip",
  "Seren",
  "Ludo"
];

const races = [
  { name: "Human", note: "Adaptable and quick to settle into guild life." },
  { name: "Elf", note: "Patient, observant, and fond of long plans." },
  { name: "Dwarf", note: "Stubborn in the best possible way." },
  { name: "Halfling", note: "Cheerful, lucky, and sharper than they look." },
  { name: "Orc", note: "Direct, loyal, and hard to knock over." },
  { name: "Lizardfolk", note: "Calm under pressure and excellent in bad weather." },
  { name: "Tiefling", note: "Dramatic flair, clever instincts, dangerous smile." },
  { name: "Fairy", note: "Tiny, quick, and entirely too confident." },
  { name: "Angel", note: "A rare soul with an inconvenient sense of duty." }
];

const favouriteFoods = [
  "fresh bread",
  "mushroom stew",
  "roast potatoes",
  "apple dumplings",
  "spiced lentils",
  "berry tart",
  "seaweed noodles",
  "hot oatcakes"
];

const dreams = [
  "Become a Dragon Slayer",
  "Map every road in Jenny",
  "Open a peaceful tavern",
  "Recover a lost family relic",
  "Train an apprentice",
  "Write the definitive monster guide",
  "Buy their parents a warm cottage",
  "Become a legend without dying first"
];

const origins = [
  "Arrived with a rusty sword and three coins",
  "Left a farm after seeing lights in the old forest",
  "Worked as a caravan guard before joining the guild",
  "Was recommended by a nervous village mayor",
  "Won a tavern bet and spent the prize on armour",
  "Followed an old map to Guildstead's door",
  "Was caught reading quest notices before sunrise",
  "Came looking for work, glory, and somewhere dry"
];

const traitLabels = [
  ["brave", "Brave"],
  ["greedy", "Greedy"],
  ["lazy", "Lazy"],
  ["loyal", "Loyal"],
  ["curious", "Curious"],
  ["proud", "Proud"]
];

let currentPopupEventId = null;
let currentChapterMomentId = null;
let dispatchAnimations = [];
let activeView = "guildhall";
let selectedGuildRoomId = "tavernRoom";
let selectedAdventurerId = null;
let mapModeOverride = null;
let toastTimer = null;
const state = loadState();

const elements = {
  titleScreen: document.querySelector("#titleScreen"),
  introScene: document.querySelector("#introScene"),
  introEyebrow: document.querySelector("#introEyebrow"),
  introTitle: document.querySelector("#introTitle"),
  introCopy: document.querySelector("#introCopy"),
  introPortrait: document.querySelector("#introPortrait"),
  startGame: document.querySelector("#startGameButton"),
  continueIntro: document.querySelector("#continueIntroButton"),
  day: document.querySelector("#dayValue"),
  calendar: document.querySelector("#calendarValue"),
  gold: document.querySelector("#goldValue"),
  fame: document.querySelector("#fameValue"),
  rank: document.querySelector("#rankValue"),
  rosterValue: document.querySelector("#rosterValue"),
  rankProgress: document.querySelector("#rankProgress"),
  roomGrid: document.querySelector("#roomGrid"),
  facilityList: document.querySelector("#facilityList"),
  guildhallInterior: document.querySelector("#guildhallInterior"),
  guildhallRoomDetail: document.querySelector("#guildhallRoomDetail"),
  realmMap: document.querySelector("#realmMap"),
  commandLayout: document.querySelector("#commandLayout"),
  mapStage: document.querySelector("#mapStage"),
  mapFocus: document.querySelector("#mapFocusButton"),
  mapStatus: document.querySelector("#mapStatus"),
  chapterObjective: document.querySelector("#chapterObjective"),
  eventMissionList: document.querySelector("#eventMissionList"),
  scoutEvent: document.querySelector("#scoutEventButton"),
  musicToggle: document.querySelector("#musicToggleButton"),
  mapTheme: document.querySelector("#mapTheme"),
  dockButtons: document.querySelectorAll("[data-view]"),
  viewPanels: document.querySelectorAll("[data-panel]"),
  activeViewEyebrow: document.querySelector("#activeViewEyebrow"),
  activeViewTitle: document.querySelector("#activeViewTitle"),
  expeditionWatch: document.querySelector("#expeditionWatch"),
  creatorPanel: document.querySelector("#creatorPanel"),
  founderName: document.querySelector("#founderName"),
  founderClass: document.querySelector("#founderClass"),
  founderGender: document.querySelector("#founderGender"),
  founderClassOptions: document.querySelectorAll("[data-founder-class]"),
  founderGenderOptions: document.querySelectorAll("[data-founder-gender]"),
  founderPreview: document.querySelector("#founderPreview"),
  createFounder: document.querySelector("#createFounderButton"),
  randomFounder: document.querySelector("#randomFounderButton"),
  recruit: document.querySelector("#recruitButton"),
  recruitmentPanel: document.querySelector("#recruitmentPanel"),
  rosterList: document.querySelector("#rosterList"),
  selectedSummary: document.querySelector("#selectedSummary"),
  adventurerDetail: document.querySelector("#adventurerDetail"),
  missionList: document.querySelector("#missionList"),
  eventLog: document.querySelector("#eventLog"),
  guildStores: document.querySelector("#guildStores"),
  reset: document.querySelector("#resetButton"),
  nextDay: document.querySelector("#nextDayButton"),
  eventDialog: document.querySelector("#eventDialog"),
  eventDialogTitle: document.querySelector("#eventDialogTitle"),
  eventDialogText: document.querySelector("#eventDialogText"),
  viewEvent: document.querySelector("#viewEventButton"),
  closeEvent: document.querySelector("#closeEventButton"),
  chapterDialog: document.querySelector("#chapterDialog"),
  chapterDialogEyebrow: document.querySelector("#chapterDialogEyebrow"),
  chapterDialogTitle: document.querySelector("#chapterDialogTitle"),
  chapterDialogText: document.querySelector("#chapterDialogText"),
  chapterDialogButton: document.querySelector("#chapterDialogButton"),
  toastRail: document.querySelector("#toastRail")
};

elements.startGame.addEventListener("click", startIntro);
elements.continueIntro.addEventListener("click", advanceIntro);
elements.createFounder.addEventListener("click", createFounder);
elements.randomFounder.addEventListener("click", randomiseFounder);
elements.recruit.addEventListener("click", postRecruitmentNotice);
elements.reset.addEventListener("click", resetGame);
elements.nextDay.addEventListener("click", () => advanceDays(1));
elements.scoutEvent.addEventListener("click", () => {
  scoutForEvent(true);
  render();
});
elements.musicToggle.addEventListener("click", toggleMapMusic);
elements.mapFocus.addEventListener("click", toggleMapFocus);
elements.closeEvent.addEventListener("click", closeEventDialog);
elements.viewEvent.addEventListener("click", viewPopupEvent);
elements.chapterDialogButton.addEventListener("click", closeChapterMoment);
elements.founderName.addEventListener("input", renderFounderPreview);
elements.founderClassOptions.forEach((button) => {
  button.addEventListener("click", () => selectFounderClass(button.dataset.founderClass));
});
elements.founderGenderOptions.forEach((button) => {
  button.addEventListener("click", () => selectFounderGender(button.dataset.founderGender));
});
elements.dockButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});
elements.mapTheme.volume = 0.28;
document.addEventListener("pointerdown", tryResumeBackgroundMusic, { passive: true });
document.addEventListener("keydown", tryResumeBackgroundMusic);

render();
setInterval(tick, 1000);

function defaultState() {
  return {
    version: SAVE_VERSION,
    screen: "title",
    introStep: 0,
    day: 1,
    gold: 80,
    fame: 0,
    adventurers: [],
    selectedIds: [],
    activeMissions: [],
    eventMissions: [],
    inventory: {},
    recruitment: {
      unlocked: false,
      order: null,
      candidates: [],
      hires: 0
    },
    facilities: {
      tavern: 1,
      questBoard: 0,
      dormitory: 0,
      trainingYard: 0,
      kitchen: 0,
      workshop: 0
    },
    chapter: {
      stage: "tavern",
      completedLocalMissions: [],
      charterEarned: false
    },
    log: [
      {
        day: 1,
        text: "The Wayfarer's Rest opens for another quiet day on Greenbank Road."
      }
    ],
    founderCreated: false,
    musicMuted: false
  };
}

function loadState() {
  const fresh = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object" || ![4, 5, 6, 7, 8, 9, 10, SAVE_VERSION].includes(saved.version)) {
      return fresh;
    }
    const chapterLegacySave = saved.version < 7;
    const progressedLegacySave = chapterLegacySave && Boolean(saved.founderCreated);
    const savedFacilities = saved.facilities || {};
    const migratedFacilities = chapterLegacySave
      ? progressedLegacySave ? {
          tavern: savedFacilities.tavern || 1,
          questBoard: savedFacilities.questBoard || 1,
          dormitory: savedFacilities.infirmary || 1,
          trainingYard: savedFacilities.trainingYard || 1,
          kitchen: 1,
          workshop: savedFacilities.workshop || 1
        } : fresh.facilities
      : { ...fresh.facilities, ...savedFacilities };
    const migratedChapter = chapterLegacySave
      ? progressedLegacySave ? {
          stage: "chartered",
          completedLocalMissions: ["greenbankCart", "lostWoodcutter", "mooncapRemedy"],
          charterEarned: true
        } : fresh.chapter
      : { ...fresh.chapter, ...(saved.chapter || {}) };
    const loaded = {
      ...fresh,
      ...saved,
      version: SAVE_VERSION,
      screen: saved.screen || (saved.founderCreated ? "game" : "title"),
      facilities: migratedFacilities,
      chapter: migratedChapter,
      eventMissions: saved.eventMissions || [],
      inventory: saved.inventory || {},
      recruitment: {
        ...fresh.recruitment,
        ...(saved.recruitment || {})
      },
      selectedIds: []
    };
    loaded.adventurers = (saved.adventurers || []).map((adventurer) => normaliseAdventurer(adventurer, loaded.day));
    loaded.recruitment.candidates = (saved.recruitment?.candidates || []).map((candidate) => normaliseAdventurer(candidate, loaded.day));
    if (!saved.recruitment) {
      loaded.recruitment.unlocked = Boolean(loaded.founderCreated && !["tavern", "hero", "firstQuest"].includes(loaded.chapter.stage));
    }
    const now = Date.now();
    loaded.activeMissions = (saved.activeMissions || []).map((activeMission) => {
      if (activeMission.startedAt && activeMission.endsAt) {
        return normaliseActiveMission(activeMission);
      }
      const elapsed = Math.min(activeMission.elapsed || 0, activeMission.duration || 0);
      return normaliseActiveMission({
        ...activeMission,
        elapsed,
        startedAt: now - elapsed * 1000,
        endsAt: now + Math.max(0, (activeMission.duration || 0) - elapsed) * 1000
      });
    });
    return loaded;
  } catch {
    return fresh;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The demo should remain playable even if browser storage is unavailable.
  }
}

function resetGame() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Reset the in-memory state regardless of storage availability.
  }
  currentPopupEventId = null;
  currentChapterMomentId = null;
  dispatchAnimations = [];
  activeView = "guildhall";
  selectedGuildRoomId = "tavernRoom";
  selectedAdventurerId = null;
  mapModeOverride = null;
  const fresh = defaultState();
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, fresh);
  render();
}

function startIntro() {
  state.introStep = 0;
  state.screen = "intro";
  render();
}

function advanceIntro() {
  if (state.introStep < introScenes.length - 1) {
    state.introStep += 1;
    render();
    return;
  }
  enterGame();
}

function enterGame() {
  state.screen = "game";
  if (!state.founderCreated) {
    state.chapter.stage = "hero";
    activeView = "hero";
  }
  render();
}

function render() {
  renderScreens();
  syncBackgroundMusic();
  const calendar = getCalendar();
  elements.day.textContent = state.day;
  elements.calendar.textContent = `${calendar.season}, Year ${calendar.year}`;
  elements.gold.textContent = state.gold;
  elements.fame.textContent = state.fame;
  elements.rank.textContent = getRank();
  elements.rosterValue.textContent = `${state.adventurers.length}/${getRosterCapacity()}`;
  elements.rankProgress.style.width = `${getRankProgress()}%`;
  elements.creatorPanel.classList.toggle("hidden", state.founderCreated);

  renderRooms();
  renderFacilities();
  renderGuildhallInterior();
  renderMap();
  renderRoster();
  renderMissions();
  renderExpeditionWatch();
  renderLog();
  renderStores();
  renderEventDialog();
  renderChapterDialog();
  renderChapterProgress();
  renderActiveView();
  renderFounderPreview();
  renderIntroScene();
  saveState();
}

function toggleMapMusic() {
  state.musicMuted = !state.musicMuted;
  syncBackgroundMusic();
  saveState();
}

function tryResumeBackgroundMusic() {
  if (state.screen === "game" && !state.musicMuted && elements.mapTheme.paused) {
    elements.mapTheme.play().catch(() => {
      // A later player interaction can retry if the browser still blocks playback.
    });
  }
}

function syncBackgroundMusic() {
  const shouldPlay = state.screen === "game" && !state.musicMuted;
  elements.mapTheme.muted = Boolean(state.musicMuted);

  if (shouldPlay) {
    if (elements.mapTheme.paused) {
      elements.mapTheme.play().catch(() => {
        // Browsers may wait for the player's next interaction before allowing audio.
      });
    }
  } else {
    elements.mapTheme.pause();
    if (state.screen !== "game") {
      elements.mapTheme.currentTime = 0;
    }
  }

  elements.musicToggle.classList.toggle("muted", Boolean(state.musicMuted));
  elements.musicToggle.setAttribute("aria-pressed", String(Boolean(state.musicMuted)));
  const action = state.musicMuted ? "Play music" : "Mute music";
  elements.musicToggle.setAttribute("aria-label", action);
  elements.musicToggle.title = action;
}

function renderScreens() {
  const titleOpen = state.screen === "title";
  const introOpen = state.screen === "intro";
  const eventOpen = Boolean(currentPopupEventId);
  const chapterOpen = Boolean(currentChapterMomentId);
  elements.titleScreen.classList.toggle("hidden", !titleOpen);
  elements.introScene.classList.toggle("hidden", !introOpen);
  document.body.classList.toggle("modal-open", titleOpen || introOpen || eventOpen || chapterOpen);
}

function renderIntroScene() {
  const scene = introScenes[state.introStep] || introScenes[0];
  elements.introEyebrow.textContent = scene.eyebrow;
  elements.introTitle.textContent = scene.title;
  elements.introCopy.innerHTML = scene.copy.map((paragraph) => `<p>${paragraph}</p>`).join("");
  elements.introPortrait.className = `unit-sprite slot-${scene.portraitSlot}`;
  elements.continueIntro.textContent = scene.button;
  document.querySelectorAll(".story-progress i").forEach((pip, index) => {
    pip.classList.toggle("active", index <= state.introStep);
  });
}

function renderRooms() {
  elements.roomGrid.innerHTML = facilities
    .map((facility) => {
      const level = state.facilities[facility.id];
      const unlocked = isFacilityUnlocked(facility.id);
      const built = level > 0;
      return `
        <article class="room room-${facility.id} ${built ? "built" : unlocked ? "available" : "locked"}" style="grid-column:${facility.gridColumn};grid-row:${facility.gridRow};--room-colour:${facility.colour}">
          <span class="room-icon">${facility.icon}</span>
          <span class="room-name">${facility.name}</span>
          <span class="room-level">${built ? `Level ${level}` : unlocked ? "Available" : "Locked"}</span>
          <span class="room-decoration" aria-hidden="true"></span>
        </article>
      `;
    })
    .join("");
}

function renderFacilities() {
  elements.facilityList.innerHTML = facilities
    .map((facility) => {
      const level = state.facilities[facility.id];
      const unlocked = isFacilityUnlocked(facility.id);
      const built = level > 0;
      const cost = upgradeCost(facility);
      const maxed = level >= 5;
      const levelPips = Array.from({ length: 5 }, (_, index) => `<i class="${index < level ? "filled" : ""}"></i>`).join("");
      return `
        <article class="facility-card ${built ? "built" : unlocked ? "available" : "locked"}">
          <span class="facility-icon" style="--facility-colour:${facility.colour}" aria-hidden="true">${facility.icon}</span>
          <div class="facility-copy">
            <div class="facility-title">
              <h3>${facility.name}</h3>
              <span class="facility-levels" aria-label="${built ? `Level ${level} of 5` : "Not built"}">${levelPips}</span>
            </div>
            <p class="card-meta">${facility.effect}</p>
            ${!built ? `<p class="facility-requirement">${getFacilityUnlockText(facility.id)}</p>` : ""}
          </div>
          <button class="${built ? "secondary-button" : "primary-button"}" data-upgrade="${facility.id}" type="button" ${!unlocked || maxed || state.gold < cost ? "disabled" : ""}>
            ${!unlocked ? "Locked" : maxed ? "Max level" : built ? `${cost}G` : `Build ${cost}G`}
          </button>
        </article>
      `;
    })
    .join("");

  elements.facilityList.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => upgradeFacility(button.dataset.upgrade));
  });
}

function renderMap() {
  const facilityMarkers = facilities
    .filter((facility) => facility.id !== "tavern" && state.facilities[facility.id] > 0)
    .map((facility) => `
      <button class="map-facility facility-${facility.id}" data-map-view="facilities" style="left:${facility.mapLeft};top:${facility.mapTop};--marker-colour:${facility.colour}" type="button" aria-label="${facility.name}, level ${state.facilities[facility.id]}">
        <span class="map-building" aria-hidden="true"><i>${facility.icon}</i></span>
        <span class="map-label">${facility.name}<b>Lv ${state.facilities[facility.id]}</b></span>
      </button>
    `)
    .join("");

  const missionMarkers = missionDeck
    .filter((mission) => isMissionVisible(mission))
    .map((mission) => {
      const active = state.activeMissions.some((activeMission) => activeMission.missionId === mission.id);
      const completed = state.chapter.completedLocalMissions.includes(mission.id) || (mission.chapterBoss && state.chapter.charterEarned);
      return `
      <button class="map-mission ${active ? "active" : ""} ${completed ? "completed" : ""}" data-map-view="quest" style="left:${mission.marker.left};top:${mission.marker.top}" type="button" aria-label="${mission.name} at ${mission.location}">
        <span class="mission-pin" aria-hidden="true"></span>
        <span class="map-label">${active ? mission.location : mission.name}<b>${active ? "Expedition active" : mission.location}</b></span>
      </button>
    `;
    })
    .join("");

  const eventMarkers = state.eventMissions
    .map((eventMission) => `
      <button class="map-event pulse" data-map-event="${eventMission.id}" style="left:${eventMission.marker.left};top:${eventMission.marker.top}" type="button">
        <span class="event-pin">!</span>
        <span class="map-label">${eventMission.name}<b>Day ${eventMission.expiresDay}</b></span>
      </button>
    `)
    .join("");

  const dispatchMarkup = dispatchAnimations
    .map((animation) => `
      <div class="dispatch-runner" style="offset-path:path('M 0 0 Q ${animation.controlX} ${animation.controlY} ${animation.travelX} ${animation.travelY}')">
        ${animation.party.map((adventurer) => renderSprite(adventurer, "small walking")).join("")}
        <span class="dispatch-label">${animation.location}</span>
      </div>
    `)
    .join("");

  elements.realmMap.innerHTML = `
    <div class="map-grid" aria-hidden="true"></div>
    <div class="map-path"></div>
    <div class="map-water"></div>
    <div class="map-hill one"></div>
    <div class="map-hill two"></div>
    <div class="terrain terrain-forest forest-one" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="terrain terrain-forest forest-two" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="terrain terrain-mountains" aria-hidden="true"><i></i><i></i><i></i></div>
    <span class="region-label region-frost">Frostmere</span>
    <span class="region-label region-wood">Mushroomwood</span>
    <span class="region-label region-coast">Silver Coast</span>
    <span class="region-label region-hollow">Darkhollow</span>
    <span class="map-compass" aria-hidden="true">N<i></i></span>
    <button class="map-guild ${state.chapter.charterEarned ? "chartered" : "tavern-map"}" data-map-view="guildhall" type="button">
      <div class="map-town" aria-hidden="true"><i></i><i></i><i></i></div>
      <span class="map-label">${getVenueName()}<b>${state.chapter.charterEarned ? `Guild Rank ${getRank()}` : "Roadside Tavern"}</b></span>
    </button>
    ${facilityMarkers}
    ${missionMarkers}
    ${eventMarkers}
    <div class="dispatch-layer" id="dispatchLayer">${dispatchMarkup}</div>
  `;

  elements.realmMap.querySelectorAll("[data-map-view]").forEach((marker) => {
    marker.addEventListener("click", () => setActiveView(marker.dataset.mapView));
  });

  elements.realmMap.querySelectorAll("[data-map-event]").forEach((marker) => {
    marker.addEventListener("click", () => openEventDialog(marker.dataset.mapEvent));
  });

  renderEventSummaries();
}

function renderEventSummaries() {
  elements.scoutEvent.disabled = !state.founderCreated || state.facilities.questBoard < 1 || state.eventMissions.length >= 3;
  if (state.eventMissions.length === 0) {
    const emptyText = state.facilities.questBoard < 1
      ? "Mara can send scouts once the tavern has a proper Quest Board."
      : "No urgent realm events. Advance the day or send scouts when the roads grow suspiciously quiet.";
    elements.eventMissionList.innerHTML = `
      <div class="event-empty">
        <span class="empty-sigil" aria-hidden="true">!</span>
        <h3>The roads are quiet</h3>
        <p>${emptyText}</p>
      </div>
    `;
    return;
  }

  elements.eventMissionList.innerHTML = state.eventMissions
    .map((eventMission) => `
      <article class="event-summary">
        <span class="event-summary-pin" aria-hidden="true">!</span>
        <div class="event-summary-copy">
          <h3>${eventMission.name}</h3>
          <p class="card-meta">${eventMission.description}</p>
          <div class="reward-row">
            <span>${eventMission.location}</span>
            <span>${eventMission.gold}G</span>
            <span>${eventMission.fame} fame</span>
            <span>Expires day ${eventMission.expiresDay}</span>
          </div>
        </div>
        <button class="secondary-button" data-open-event="${eventMission.id}" type="button">Open</button>
      </article>
    `)
    .join("");

  elements.eventMissionList.querySelectorAll("[data-open-event]").forEach((button) => {
    button.addEventListener("click", () => openEventDialog(button.dataset.openEvent));
  });
}

function renderActiveView() {
  const viewMeta = getViewMeta(activeView);
  elements.activeViewEyebrow.textContent = viewMeta.eyebrow;
  elements.activeViewTitle.textContent = viewMeta.title;
  elements.mapStatus.textContent = viewMeta.status;

  elements.dockButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeView);
    button.classList.toggle("attention", button.dataset.view === "adventurers" && state.recruitment.candidates.length > 0);
  });

  elements.viewPanels.forEach((panel) => {
    const panelName = panel.dataset.panel;
    const visible = panelName === activeView || (panelName === "hero" && activeView === "hero");
    panel.classList.toggle("active", visible);
  });

  if (state.founderCreated && activeView === "hero") {
    activeView = "adventurers";
    renderActiveView();
    return;
  }
  renderMapLayout();
}

function getViewMeta(view) {
  const meta = {
    hero: {
      eyebrow: "Founder",
      title: "Create Adventurer",
      status: "Create your hero to begin managing Guildstead."
    },
    guildhall: {
      eyebrow: state.chapter.charterEarned ? "Guildhall" : "Roadside tavern",
      title: getVenueName(),
      status: "Click a room or empty construction space to manage the tavern's growth."
    },
    quest: {
      eyebrow: "Quest board",
      title: "Missions",
      status: "Send selected adventurers to map locations and event missions."
    },
    adventurers: {
      eyebrow: "Roster",
      title: "Adventurers",
      status: "Select up to three idle adventurers before sending a party."
    },
    facilities: {
      eyebrow: state.chapter.charterEarned ? "Guild hall" : "Tavern plans",
      title: "Build & Upgrade",
      status: "Add rooms to the tavern, then improve them as Guildstead's reputation grows."
    },
    events: {
      eyebrow: "Realm events",
      title: "Urgent Missions",
      status: "Event markers appear on the map and expire after a few days."
    },
    log: {
      eyebrow: "Guild notes",
      title: "Events",
      status: "Review recent guild activity, rewards, injuries, and upkeep."
    }
  };
  return meta[view] || meta.quest;
}

function setActiveView(view) {
  if (!view) {
    return;
  }
  activeView = view;
  renderActiveView();
}

function isMapExpanded() {
  if (mapModeOverride?.view === activeView) {
    return mapModeOverride.expanded;
  }
  return ["quest", "events"].includes(activeView);
}

function toggleMapFocus() {
  mapModeOverride = { view: activeView, expanded: !isMapExpanded() };
  renderMapLayout();
}

function renderMapLayout() {
  const expanded = isMapExpanded();
  elements.commandLayout.classList.toggle("map-focus", expanded);
  elements.commandLayout.classList.toggle("management-focus", !expanded);
  elements.mapStage.classList.toggle("compact-map", !expanded);
  elements.mapFocus.classList.toggle("expanded", expanded);
  elements.mapFocus.setAttribute("aria-pressed", String(expanded));
  elements.mapFocus.setAttribute("aria-label", expanded ? "Give more space to management" : "Expand the realm map");
  elements.mapFocus.title = expanded ? "Give more space to management" : "Expand the realm map";
}

function renderGuildhallInterior() {
  const rooms = guildRooms
    .map((room) => {
      const level = room.facilityId ? state.facilities[room.facilityId] : 1;
      const unlocked = isFacilityUnlocked(room.facilityId);
      const built = level > 0;
      const selected = selectedGuildRoomId === room.id;
      if (!built) {
        return `
          <button class="guild-room ${room.id} empty-room ${unlocked ? "available" : "locked"} ${selected ? "selected" : ""}" data-guild-room="${room.id}" type="button">
            <span class="room-label">${room.label}</span>
            <span class="empty-room-sigil" aria-hidden="true">${unlocked ? "+" : "?"}</span>
            <span class="empty-room-copy">${unlocked ? "Ready to build" : getFacilityUnlockText(room.facilityId)}</span>
          </button>
        `;
      }
      return `
        <button class="guild-room ${room.id} built ${selected ? "selected" : ""}" data-guild-room="${room.id}" type="button">
          <span class="room-label">${room.label}</span>
          <span class="room-scene">${renderSprite({ classId: room.occupant, race: "Human", name: room.label }, "small")}</span>
          <span class="room-furniture" aria-hidden="true"></span>
          <span class="room-glow" aria-hidden="true"></span>
          <span class="room-level-chip">Lv ${level}</span>
        </button>
      `;
    })
    .join("");

  elements.guildhallInterior.innerHTML = `
    <div class="guildhall-roof">
      <span class="guildhall-crest">G</span>
      <span>${getVenueName()}</span>
      <i class="roof-window" aria-hidden="true"></i>
    </div>
    <div class="guildhall-rooms">${rooms}</div>
  `;

  elements.guildhallInterior.querySelectorAll("[data-guild-room]").forEach((roomButton) => {
    roomButton.addEventListener("click", () => selectGuildRoom(roomButton.dataset.guildRoom));
  });

  renderGuildRoomDetail();
}

function renderGuildRoomDetail() {
  const room = guildRooms.find((item) => item.id === selectedGuildRoomId) || guildRooms[0];
  const level = room.facilityId ? state.facilities[room.facilityId] : 1;
  const facility = facilities.find((item) => item.id === room.facilityId);
  const unlocked = isFacilityUnlocked(room.facilityId);
  const built = level > 0;
  const cost = facility ? upgradeCost(facility) : 0;
  elements.guildhallRoomDetail.innerHTML = `
    <article class="room-detail-card">
      <span class="room-detail-icon" aria-hidden="true">${room.label.slice(0, 1)}</span>
      <div class="room-detail-copy">
        <p class="eyebrow">${built ? "Selected room" : "Construction space"}</p>
        <h3>${room.name} ${built ? `<span>Level ${level}</span>` : ""}</h3>
        <p class="card-meta">${built ? room.description : getFacilityUnlockText(room.facilityId)}</p>
      </div>
      ${built
        ? `<button class="primary-button" data-room-action="${room.targetView}" type="button">${room.action}</button>`
        : `<button class="primary-button" data-build-room="${room.facilityId}" type="button" ${!unlocked || state.gold < cost ? "disabled" : ""}>${unlocked ? `Build ${cost}G` : "Locked"}</button>`}
    </article>
  `;

  const action = elements.guildhallRoomDetail.querySelector("[data-room-action]");
  action?.addEventListener("click", () => setActiveView(action.dataset.roomAction));
  const buildAction = elements.guildhallRoomDetail.querySelector("[data-build-room]");
  buildAction?.addEventListener("click", () => upgradeFacility(buildAction.dataset.buildRoom));
}

function selectGuildRoom(roomId) {
  if (!guildRooms.some((room) => room.id === roomId)) {
    return;
  }
  selectedGuildRoomId = roomId;
  renderGuildhallInterior();
  const room = guildRooms.find((item) => item.id === roomId);
  elements.mapStatus.textContent = `${room.name}: ${room.description}`;
}

function renderRoster() {
  const selectedAvailable = state.selectedIds.filter((id) => getAdventurer(id)?.status === "idle");
  state.selectedIds = selectedAvailable.slice(0, 3);
  if (!getAdventurer(selectedAdventurerId)) {
    selectedAdventurerId = state.adventurers[0]?.id || null;
  }
  const selectedParty = state.selectedIds.map(getAdventurer).filter(Boolean);
  elements.selectedSummary.innerHTML = `
    <div>
      <span class="eyebrow">Expedition party</span>
      <strong>${selectedParty.length}/3 ready</strong>
    </div>
    <div class="party-miniatures">
      ${Array.from({ length: 3 }, (_, index) => {
        const member = selectedParty[index];
        return member ? `<span title="${member.name}">${renderSprite(member, "tiny")}</span>` : `<span class="empty-party-slot">+</span>`;
      }).join("")}
    </div>
  `;
  const rosterFull = state.adventurers.length >= getRosterCapacity();
  const recruitmentLocked = !state.recruitment.unlocked;
  const recruitmentWaiting = Boolean(state.recruitment.order);
  const candidatesReady = state.recruitment.candidates.length > 0;
  elements.recruit.disabled = recruitmentLocked || recruitmentWaiting || candidatesReady || state.gold < RECRUITMENT_COST || rosterFull;
  elements.recruit.textContent = rosterFull
    ? "Dormitory Needed"
    : recruitmentLocked
      ? "Recruitment Locked"
      : recruitmentWaiting
        ? `Applicants Day ${state.recruitment.order.readyDay}`
        : candidatesReady
          ? "Choose Applicant"
          : `Post Notice ${RECRUITMENT_COST}G`;
  renderRecruitmentPanel();

  if (state.adventurers.length === 0) {
    elements.rosterList.innerHTML = `<article class="facility-card"><p class="card-meta">Create a hero to open the roster.</p></article>`;
    renderAdventurerDetail();
    return;
  }

  elements.rosterList.innerHTML = state.adventurers
    .map((adventurer) => {
      const selected = state.selectedIds.includes(adventurer.id);
      const inspected = selectedAdventurerId === adventurer.id;
      const statusText = adventurer.status === "idle" ? `Lv ${adventurer.level}` : adventurer.status;
      const partyFull = state.selectedIds.length >= 3 && !selected;
      return `
        <article class="adventurer-card ${adventurer.status} ${selected ? "selected" : ""} ${inspected ? "inspected" : ""}" data-adventurer="${adventurer.id}">
          <button class="adventurer-inspect" data-inspect="${adventurer.id}" type="button" aria-label="View ${adventurer.name}'s profile">
            <div class="sprite-frame">${renderSprite(adventurer)}</div>
            <div class="adventurer-main">
              <div class="adventurer-topline">
                <h3>${adventurer.name}</h3>
                <span class="badge">${statusText}</span>
              </div>
              <p class="card-meta">${adventurer.gender === "female" ? "Female" : "Male"} ${adventurer.race} ${classes[adventurer.classId].label} | Age ${adventurer.age}</p>
              <div class="quirk-peek">
                <span class="positive">+ ${quirkCatalog[adventurer.quirks.positive].name}</span>
                <span class="negative">- ${quirkCatalog[adventurer.quirks.negative].name}</span>
              </div>
              <div class="stats-row">
                ${miniStat("STR", adventurer.stats.str)}
                ${miniStat("MAG", adventurer.stats.mag)}
                ${miniStat("WIT", adventurer.stats.wit)}
                ${miniStat("CHA", adventurer.stats.cha)}
              </div>
            </div>
          </button>
          <button class="party-toggle ${selected ? "remove" : ""}" data-party="${adventurer.id}" type="button" ${adventurer.status !== "idle" || partyFull ? "disabled" : ""}>
            ${adventurer.status !== "idle" ? adventurer.status : selected ? "Remove" : "Add"}
          </button>
        </article>
      `;
    })
    .join("");

  elements.rosterList.querySelectorAll("[data-inspect]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAdventurerId = button.dataset.inspect;
      renderRoster();
    });
  });
  elements.rosterList.querySelectorAll("[data-party]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAdventurerId = button.dataset.party;
      toggleAdventurer(button.dataset.party);
    });
  });
  renderAdventurerDetail();
}

function renderRecruitmentPanel() {
  const recruitment = state.recruitment;
  const rosterFull = state.adventurers.length >= getRosterCapacity();
  if (!recruitment.unlocked) {
    elements.recruitmentPanel.innerHTML = `
      <section class="recruitment-service locked">
        <span class="recruitment-sign" aria-hidden="true">R</span>
        <div><p class="eyebrow">Tavern recruitment</p><h3>Word has not spread yet</h3><p>Recover the stolen supplies and Mara will help attract more adventurers.</p></div>
      </section>
    `;
    return;
  }

  if (recruitment.order) {
    const totalDays = Math.max(1, recruitment.order.readyDay - recruitment.order.postedDay);
    const elapsedDays = Math.max(0, state.day - recruitment.order.postedDay);
    const progress = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
    const daysLeft = Math.max(0, recruitment.order.readyDay - state.day);
    elements.recruitmentPanel.innerHTML = `
      <section class="recruitment-waiting">
        <div class="recruitment-waiting-copy">
          <span class="recruitment-sign travelling" aria-hidden="true">R</span>
          <div><p class="eyebrow">Notice posted</p><h3>Applicants are travelling</h3><p>${daysLeft} day${daysLeft === 1 ? "" : "s"} until Mara presents the shortlist.</p></div>
        </div>
        <div class="recruitment-progress"><i style="width:${progress}%"></i></div>
        <button class="secondary-button" data-advance-recruitment type="button">Advance Day</button>
      </section>
    `;
    elements.recruitmentPanel.querySelector("[data-advance-recruitment]")?.addEventListener("click", () => advanceDays(1));
    return;
  }

  if (recruitment.candidates.length > 0) {
    elements.recruitmentPanel.innerHTML = `
      <section class="candidate-board">
        <div class="candidate-board-heading"><div><p class="eyebrow">Mara's shortlist</p><h3>Choose One Adventurer</h3></div><span>Travel costs paid</span></div>
        <div class="candidate-grid">
          ${recruitment.candidates.map((candidate) => `
            <article class="candidate-card">
              <div class="candidate-sprite">${renderSprite(candidate)}</div>
              <div class="candidate-name"><h4>${candidate.name}</h4><span>${candidate.gender === "female" ? "Female" : "Male"} ${candidate.race}</span></div>
              <strong class="candidate-class">${classes[candidate.classId].label}</strong>
              <div class="candidate-potential"><span>Potential</span>${renderPotential(candidate.potential)}</div>
              <div class="candidate-quirks"><span class="positive">+ ${quirkCatalog[candidate.quirks.positive].name}</span><span class="negative">- ${quirkCatalog[candidate.quirks.negative].name}</span></div>
              <button class="primary-button" data-hire-candidate="${candidate.id}" type="button" ${rosterFull ? "disabled" : ""}>${rosterFull ? "Dormitory Needed" : `Recruit ${candidate.name}`}</button>
            </article>
          `).join("")}
        </div>
      </section>
    `;
    elements.recruitmentPanel.querySelectorAll("[data-hire-candidate]").forEach((button) => {
      button.addEventListener("click", () => hireRecruitmentCandidate(button.dataset.hireCandidate));
    });
    return;
  }

  elements.recruitmentPanel.innerHTML = `
    <section class="recruitment-service">
      <span class="recruitment-sign" aria-hidden="true">R</span>
      <div><p class="eyebrow">Tavern recruitment</p><h3>Post A Paid Notice</h3><p>Mara will find three applicants in one or two days. The ${RECRUITMENT_COST}G fee covers notices, food, and travel.</p></div>
      <button class="primary-button" data-post-recruitment type="button" ${rosterFull || state.gold < RECRUITMENT_COST ? "disabled" : ""}>${rosterFull ? "Dormitory Needed" : `${RECRUITMENT_COST}G`}</button>
    </section>
  `;
  elements.recruitmentPanel.querySelector("[data-post-recruitment]")?.addEventListener("click", postRecruitmentNotice);
}

function renderAdventurerDetail() {
  const adventurer = getAdventurer(selectedAdventurerId);
  if (!adventurer) {
    elements.adventurerDetail.innerHTML = `
      <article class="profile-empty">
        <p class="eyebrow">Character</p>
        <h3>No adventurer selected</h3>
        <p class="card-meta">Create your hero to begin building Guildstead's first living history.</p>
      </article>
    `;
    return;
  }

  const race = races.find((item) => item.name === adventurer.race);
  const xpProgress = Math.round((adventurer.xp / xpForNext(adventurer.level)) * 100);
  const history = (adventurer.lifeLog || [])
    .slice(0, 5)
    .map((entry) => `<li><strong>Day ${entry.day}</strong> ${entry.text}</li>`)
    .join("");

  elements.adventurerDetail.innerHTML = `
    <article class="profile-card">
      <div class="profile-hero">
        <div class="profile-sprite">${renderSprite(adventurer)}</div>
        <div>
          <p class="eyebrow">${adventurer.founder ? "Founder" : "Guild Adventurer"}</p>
          <h3>${adventurer.name}</h3>
          <p class="card-meta">${adventurer.gender === "female" ? "Female" : "Male"} ${adventurer.race} ${classes[adventurer.classId].label} | Level ${adventurer.level} | ${adventurer.status}</p>
          <div class="xp-line"><span>Experience</span><strong>${adventurer.xp}/${xpForNext(adventurer.level)}</strong></div>
          <div class="progress-track slim"><div class="progress-fill" style="width:${xpProgress}%"></div></div>
          <div class="potential-line">
            <span>Potential</span>
            ${renderPotential(adventurer.potential)}
            <strong>${getPotentialLabel(adventurer.potential)}</strong>
          </div>
        </div>
      </div>

      <div class="profile-grid">
        <div class="profile-fact">
          <span>Age</span>
          <strong>${adventurer.age}</strong>
        </div>
        <div class="profile-fact">
          <span>Favourite food</span>
          <strong>${adventurer.favouriteFood}</strong>
        </div>
        <div class="profile-fact wide">
          <span>Dream</span>
          <strong>${adventurer.dream}</strong>
        </div>
        <div class="profile-fact wide">
          <span>Origin</span>
          <strong>${adventurer.origin}</strong>
        </div>
      </div>

      <p class="profile-note">${race?.note || "A curious soul with a future to write."}</p>

      <section class="character-section">
        <div class="section-line-heading">
          <p class="eyebrow">Quirks</p>
          <span>Every strength has company</span>
        </div>
        <div class="quirk-list">
          ${renderQuirk(adventurer.quirks.positive)}
          ${renderQuirk(adventurer.quirks.negative)}
        </div>
      </section>

      <section class="character-section">
        <div class="section-line-heading">
          <p class="eyebrow">Abilities</p>
          <span>${(adventurer.abilities || []).length} learned</span>
        </div>
        <div class="ability-list">${renderKnownAbilities(adventurer)}</div>
      </section>

      ${renderTrainingCurriculum(adventurer)}

      <div class="section-line-heading personality-heading">
        <p class="eyebrow">Personality</p>
        <span>Life at the guild shapes these traits</span>
      </div>
      <div class="trait-grid">
        ${traitLabels.map(([key, label]) => renderTrait(label, adventurer.traits[key])).join("")}
      </div>

      <div class="life-log">
        <p class="eyebrow">Life Log</p>
        <ol>${history || `<li><strong>Day ${state.day}</strong> Waiting for their first story.</li>`}</ol>
      </div>
    </article>
  `;

  elements.adventurerDetail.querySelectorAll("[data-teach-ability]").forEach((button) => {
    button.addEventListener("click", () => teachAbility(adventurer.id, button.dataset.teachAbility));
  });
}

function renderMissions() {
  const selectedParty = state.selectedIds.map(getAdventurer).filter((adventurer) => adventurer?.status === "idle");
  const partyMarkup = `
    <section class="party-tray">
      <div class="party-tray-heading">
        <div>
          <p class="eyebrow">Expedition party</p>
          <h3>${selectedParty.length ? `${selectedParty.length} adventurer${selectedParty.length === 1 ? "" : "s"} ready` : "No party selected"}</h3>
        </div>
        <button class="ghost-button" data-open-roster type="button">Edit Party</button>
      </div>
      <div class="party-slots">
        ${Array.from({ length: 3 }, (_, index) => {
          const member = selectedParty[index];
          return member
            ? `<div class="party-slot filled">${renderSprite(member, "small")}<span>${member.name}</span><b>Lv ${member.level}</b></div>`
            : `<div class="party-slot"><i>+</i><span>Open slot</span></div>`;
        }).join("")}
      </div>
    </section>
  `;

  const allMissions = [...missionDeck.filter((mission) => isMissionVisible(mission)), ...state.eventMissions];
  const missionCards = allMissions
    .map((mission) => {
      const lockReason = getMissionLockReason(mission);
      const locked = Boolean(lockReason);
      const active = state.activeMissions.find((activeMission) => activeMission.missionId === mission.id);
      const progress = active ? Math.round((active.elapsed / active.duration) * 100) : 0;
      const odds = selectedParty.length ? getMissionOdds(selectedParty, mission) : 0;
      const oddsTone = odds >= 75 ? "good" : odds >= 45 ? "fair" : "poor";
      const oddsLabel = odds >= 75 ? "Promising" : odds >= 45 ? "Risky" : "Dangerous";
      return `
        <article class="mission-card ${mission.isEvent ? "event" : ""} ${mission.tutorial ? "tutorial" : ""} ${mission.chapterBoss ? "boss" : ""} ${locked ? "locked" : ""}">
          <div class="mission-card-main">
            <div class="mission-title-row">
              <div>
                <span class="mission-kicker">${mission.isEvent ? "Realm event" : mission.location}</span>
                <h3>${mission.name}</h3>
              </div>
              <span class="focus-chip">${mission.focus.toUpperCase()}</span>
            </div>
            ${mission.description ? `<p class="mission-description">${mission.description}</p>` : ""}
            <div class="reward-row">
              <span>Risk ${mission.difficulty}</span>
              <span>${formatMissionTime(selectedParty.length ? getMissionDuration(mission, selectedParty) : mission.duration)}</span>
              <span>${mission.gold}G</span>
              <span>${mission.fame} fame</span>
            </div>
            ${mission.isEvent ? `<p class="mission-note">Expires on day ${mission.expiresDay}</p>` : ""}
            ${locked ? `<p class="mission-note locked-note">${lockReason}</p>` : ""}
            ${active ? `<div class="mission-progress-label"><span>Expedition underway</span><strong>${progress}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>` : ""}
          </div>
          <div class="mission-action">
            ${!locked && !active && selectedParty.length ? `<span class="odds ${oddsTone}"><b>${odds}%</b>${oddsLabel}</span>` : ""}
            <button class="primary-button" data-mission="${mission.id}" type="button" ${missionButtonDisabled(locked, active)}>
              ${locked ? "Locked" : active ? "In progress" : selectedParty.length ? "Dispatch" : "Choose party"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  const activeCards = state.activeMissions
    .map((activeMission) => {
      const mission = getMissionForActive(activeMission);
      const members = activeMission.partyIds.map(getAdventurer).filter(Boolean);
      return `
        <article class="active-card">
          <div>
            <span class="mission-kicker">Active expedition</span>
            <h3>${mission.name}</h3>
            <p class="card-meta">${mission.location} | ${formatMissionTime(getMissionRemaining(activeMission))} remaining${activeMission.encounterStatus === "active" ? " | Decision waiting" : ""}</p>
          </div>
          <div class="active-party">${members.map((member) => `<span title="${member.name}">${renderSprite(member, "tiny")}</span>`).join("")}</div>
        </article>
      `;
    })
    .join("");

  elements.missionList.innerHTML = `${partyMarkup}${activeCards ? `<div class="active-expeditions">${activeCards}</div>` : ""}<div class="mission-deck">${missionCards}</div>`;
  elements.missionList.querySelector("[data-open-roster]").addEventListener("click", () => setActiveView("adventurers"));
  elements.missionList.querySelectorAll("[data-mission]").forEach((button) => {
    button.addEventListener("click", () => startMission(button.dataset.mission));
  });
}

function renderExpeditionWatch() {
  const activeMission = state.activeMissions.find((mission) => mission.encounterStatus === "active") || state.activeMissions[0];
  elements.expeditionWatch.classList.toggle("hidden", !activeMission);
  if (!activeMission) {
    elements.expeditionWatch.innerHTML = "";
    return;
  }

  const mission = getMissionForActive(activeMission);
  const members = activeMission.partyIds.map(getAdventurer).filter(Boolean);
  const progress = Math.min(100, Math.round((activeMission.elapsed / activeMission.duration) * 100));
  const remaining = getMissionRemaining(activeMission);
  const encounter = encounterDeck[activeMission.encounterId];
  const enemyHealth = getEnemyHealth(activeMission);
  const enemyHealthPercent = Math.round((enemyHealth / activeMission.enemyMaxHealth) * 100);
  const enemyName = encounter?.enemyName || getMissionEnemyName(mission);
  const extraCount = Math.max(0, state.activeMissions.length - 1);
  const actors = members
    .map((member, index) => `
      <span class="battle-actor actor-${member.classId}" style="--actor-index:${index};--actor-delay:${index * -0.63}s" title="${member.name}, ${classes[member.classId].label}">
        ${renderSprite(member, "battle-sprite")}
        <i class="class-effect" aria-hidden="true"></i>
      </span>
    `)
    .join("");

  elements.expeditionWatch.innerHTML = `
    <div class="expedition-watch-heading">
      <div>
        <span class="mission-kicker">Expedition watch${extraCount ? ` +${extraCount}` : ""}</span>
        <h3>${mission.name}</h3>
      </div>
      <strong class="mission-clock" aria-label="${remaining} seconds remaining">${formatMissionTime(remaining)}</strong>
    </div>
    <div class="enemy-vitals">
      <span>${enemyName}</span>
      <strong>${enemyHealth}/${activeMission.enemyMaxHealth} HP</strong>
      <div class="enemy-health-track" role="progressbar" aria-label="${enemyName} health" aria-valuemin="0" aria-valuemax="${activeMission.enemyMaxHealth}" aria-valuenow="${enemyHealth}"><i style="width:${enemyHealthPercent}%"></i></div>
    </div>
    <div class="battle-stage focus-${mission.focus} ${mission.chapterBoss ? "boss-stage" : ""} ${activeMission.encounterStatus === "active" ? "encounter-alert" : ""} ${enemyHealth === 0 ? "enemy-defeated" : ""}" aria-label="${members.map((member) => member.name).join(", ")} fighting at ${mission.location}">
      <span class="battle-scenery" aria-hidden="true"></span>
      <div class="battle-party">${actors}</div>
      <span class="battle-enemy" aria-hidden="true"><i></i><b></b></span>
      <span class="battle-impact" aria-hidden="true"></span>
    </div>
    ${renderEncounterPanel(activeMission, encounter, members)}
    <div class="expedition-watch-footer">
      <span>${mission.location}</span>
      <strong>${progress}%</strong>
    </div>
    <div class="progress-track slim"><div class="progress-fill" style="width:${progress}%"></div></div>
  `;

  elements.expeditionWatch.querySelectorAll("[data-encounter-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveEncounterChoice(activeMission.id, button.dataset.encounterChoice));
  });
}

function renderEncounterPanel(activeMission, encounter, party) {
  if (!encounter || activeMission.encounterStatus === "waiting") {
    return `<div class="expedition-narrative"><span>On the road</span><p>The party is advancing towards ${getMissionForActive(activeMission).location}.</p></div>`;
  }
  if (activeMission.encounterStatus === "resolved") {
    const outcome = activeMission.encounterOutcome || {};
    const rewards = [
      outcome.powerBonus ? `+${outcome.powerBonus} mission power` : "",
      outcome.goldBonus ? `+${outcome.goldBonus}G` : "",
      outcome.fameBonus ? `+${outcome.fameBonus} fame` : "",
      outcome.lootId ? lootCatalog[outcome.lootId]?.name : ""
    ].filter(Boolean);
    return `
      <div class="encounter-result" role="status">
        <span class="encounter-result-mark" aria-hidden="true">OK</span>
        <div><strong>${activeMission.encounterAutoResolved ? "Party decision" : "Your decision"}</strong><p>${activeMission.encounterResult}</p>${rewards.length ? `<div class="encounter-rewards">${rewards.map((reward) => `<span>${reward}</span>`).join("")}</div>` : ""}</div>
      </div>
    `;
  }

  const decisionTime = Math.max(0, Math.ceil((activeMission.encounterExpiresAt - Date.now()) / 1000));
  const choices = getAvailableEncounterChoices(encounter, party);
  return `
    <section class="encounter-card" aria-labelledby="encounter-${activeMission.id}">
      <div class="encounter-heading">
        <div><span class="mission-kicker">Decision needed</span><h4 id="encounter-${activeMission.id}">${encounter.title}</h4></div>
        <strong>${decisionTime}s</strong>
      </div>
      <p>${encounter.description}</p>
      <div class="encounter-choices">
        ${choices.map((choice) => `
          <button type="button" data-encounter-choice="${choice.id}">
            <span class="choice-badge">${choice.badge}</span>
            <strong>${choice.label}</strong>
            <small>${choice.detail}</small>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function getAvailableEncounterChoices(encounter, party) {
  const choices = [];
  const specialLeader = getEncounterChoiceLeader(encounter.special, party);
  if (specialLeader) {
    const specialName = encounter.special.abilityId
      ? abilityCatalog[encounter.special.abilityId].name
      : quirkCatalog[encounter.special.quirkId].name;
    choices.push({ ...encounter.special, badge: `${specialName} | ${specialLeader.name}` });
  }
  const seenClasses = new Set();
  party.forEach((member) => {
    if (seenClasses.has(member.classId) || !encounter.classChoices[member.classId]) {
      return;
    }
    seenClasses.add(member.classId);
    choices.push({
      id: `class-${member.classId}`,
      ...encounter.classChoices[member.classId],
      classId: member.classId,
      badge: `${classes[member.classId].label} | ${member.name}`
    });
  });
  choices.push({
    id: "trustParty",
    label: "Let the party decide",
    detail: "They will choose a cautious response and continue without waiting.",
    result: "The party makes a cautious call together and keeps the expedition moving.",
    powerBonus: 2,
    enemyDamage: 10,
    badge: "Party instinct"
  });
  return choices;
}

function getEncounterChoiceLeader(choice, party) {
  if (!choice) {
    return null;
  }
  if (choice.classId) {
    return party.find((member) => member.classId === choice.classId) || null;
  }
  if (choice.abilityId) {
    return party.find((member) => member.abilities?.includes(choice.abilityId)) || null;
  }
  if (choice.quirkId) {
    return party.find((member) => member.quirks?.positive === choice.quirkId || member.quirks?.negative === choice.quirkId) || null;
  }
  return party[0] || null;
}

function getEncounterQuirkEffect(adventurer, encounter, partySize) {
  const positive = adventurer?.quirks?.positive;
  const negative = adventurer?.quirks?.negative;
  const effect = { powerBonus: 0, enemyDamage: 0, fameBonus: 0, xpBonus: 0, injuryShield: 0, notes: [] };
  if (positive === "dauntless" && encounter.dangerous) {
    effect.powerBonus += 2;
    effect.enemyDamage += 5;
    effect.notes.push("Dauntless strengthened the response");
  } else if (positive === "quickStudy") {
    effect.xpBonus += 2;
    effect.notes.push("Quick Study found a lesson in the moment");
  } else if (positive === "charmer") {
    effect.fameBonus += 1;
    effect.notes.push("Charming won over the witnesses");
  } else if (positive === "lucky") {
    effect.powerBonus += 2;
    effect.notes.push("Lucky timing helped everything land");
  } else if (positive === "hearty") {
    effect.injuryShield += 1;
    effect.notes.push("Hearty kept the party steady");
  }
  if (negative === "nervous" && encounter.dangerous) {
    effect.powerBonus -= 2;
    effect.enemyDamage -= 4;
    effect.notes.push("Nervous made the opening harder to take");
  } else if (negative === "clumsy") {
    effect.powerBonus -= 1;
    effect.enemyDamage -= 3;
    effect.notes.push("Clumsy made the execution rather untidy");
  } else if (negative === "stubborn") {
    effect.xpBonus -= 1;
    effect.notes.push("Stubborn missed part of the lesson");
  } else if (negative === "showboat" && partySize === 1) {
    effect.powerBonus -= 2;
    effect.notes.push("Showboat took an unnecessary risk alone");
  }
  return effect;
}

function resolveEncounterChoice(activeMissionId, choiceId, automatic = false, shouldRender = true) {
  const activeMission = state.activeMissions.find((mission) => mission.id === activeMissionId);
  const encounter = activeMission ? encounterDeck[activeMission.encounterId] : null;
  if (!activeMission || !encounter || activeMission.encounterStatus !== "active") {
    return;
  }
  const party = activeMission.partyIds.map(getAdventurer).filter(Boolean);
  const choice = getAvailableEncounterChoices(encounter, party).find((item) => item.id === choiceId);
  if (!choice) {
    return;
  }
  const leader = getEncounterChoiceLeader(choice, party) || party[0];
  const quirkEffect = getEncounterQuirkEffect(leader, encounter, party.length);
  const powerBonus = Math.max(0, (choice.powerBonus || 0) + quirkEffect.powerBonus);
  const enemyDamage = Math.max(0, (choice.enemyDamage || 0) + quirkEffect.enemyDamage);
  const fameBonus = Math.max(0, (choice.fameBonus || 0) + quirkEffect.fameBonus);
  const xpBonus = Math.max(0, (choice.xpBonus || 0) + quirkEffect.xpBonus);
  const injuryShield = Math.max(0, (choice.injuryShield || 0) + quirkEffect.injuryShield);
  const result = choice.result.replace("{hero}", leader?.name || "The party");
  const resultWithQuirk = quirkEffect.notes.length ? `${result} ${quirkEffect.notes.join(". ")}.` : result;

  activeMission.powerBonus = (activeMission.powerBonus || 0) + powerBonus;
  activeMission.encounterDamage = (activeMission.encounterDamage || 0) + enemyDamage;
  activeMission.goldBonus = (activeMission.goldBonus || 0) + (choice.goldBonus || 0);
  activeMission.fameBonus = (activeMission.fameBonus || 0) + fameBonus;
  activeMission.xpBonus = (activeMission.xpBonus || 0) + xpBonus;
  activeMission.injuryShield = (activeMission.injuryShield || 0) + injuryShield;
  activeMission.encounterStatus = "resolved";
  activeMission.encounterResolvedAt = Date.now();
  activeMission.encounterAutoResolved = automatic;
  activeMission.encounterResult = resultWithQuirk;
  activeMission.encounterOutcome = { powerBonus, goldBonus: choice.goldBonus || 0, fameBonus, xpBonus, injuryShield, lootId: choice.lootId || "" };
  if (choice.lootId) {
    grantLoot(choice.lootId);
  }

  party.forEach((member) => {
    const historyText = member.id === leader?.id
      ? `Led the response to ${encounter.title}: ${choice.label}.`
      : `Backed ${leader?.name || "the party"} during ${encounter.title}.`;
    addLifeEvent(member, historyText);
  });
  addLog(`${leader?.name || "The party"} answers ${encounter.title.toLowerCase()} with "${choice.label}".`);
  if (shouldRender) {
    render();
  }
  if (!automatic) {
    showToast("Expedition decision made", choice.lootId ? `${lootCatalog[choice.lootId].name} was added to Guild Stores.` : result, "success");
  }
}

function grantLoot(lootId, amount = 1) {
  if (!lootCatalog[lootId]) {
    return;
  }
  state.inventory[lootId] = (state.inventory[lootId] || 0) + amount;
}

function getEnemyHealth(activeMission) {
  const progress = Math.min(1, (activeMission.elapsed || 0) / Math.max(1, activeMission.duration || 1));
  return Math.max(0, Math.round(activeMission.enemyMaxHealth * (1 - progress) - (activeMission.encounterDamage || 0)));
}

function getMissionEnemyName(mission) {
  if (mission.chapterBoss) {
    return "Barrow Hill Chief";
  }
  return mission.focus === "mag" ? "Wild Nest" : mission.focus === "cha" ? "Road Trouble" : "Goblin Scouts";
}

function getMissionRemaining(activeMission) {
  if (activeMission.endsAt) {
    return Math.max(0, Math.ceil((activeMission.endsAt - Date.now()) / 1000));
  }
  return Math.max(0, Math.ceil(activeMission.duration - activeMission.elapsed));
}

function formatMissionTime(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function renderLog() {
  elements.eventLog.innerHTML = state.log
    .slice(0, 12)
    .map((entry) => `<li><strong>Day ${entry.day}</strong> ${entry.text}</li>`)
    .join("");
}

function renderStores() {
  const items = Object.entries(state.inventory || {}).filter(([lootId, count]) => lootCatalog[lootId] && count > 0);
  elements.guildStores.innerHTML = `
    <div class="stores-heading"><div><span class="eyebrow">Recovered curios</span><h3>Guild Stores</h3></div><strong>${items.reduce((total, [, count]) => total + count, 0)}</strong></div>
    ${items.length ? `<div class="store-grid">${items.map(([lootId, count]) => {
      const loot = lootCatalog[lootId];
      return `<article class="store-item" title="${loot.description}"><span>${loot.mark}</span><div><strong>${loot.name}</strong><small>${loot.description}</small></div><b>x${count}</b></article>`;
    }).join("")}</div>` : `<p class="stores-empty">Quest discoveries and unusual rewards will be kept here.</p>`}
  `;
}

function renderEventDialog() {
  const eventMission = currentPopupEventId ? getEventMission(currentPopupEventId) : null;
  elements.eventDialog.classList.toggle("hidden", !eventMission);
  if (!eventMission) {
    return;
  }
  elements.eventDialogTitle.textContent = eventMission.name;
  elements.eventDialogText.textContent = `${eventMission.description} Location: ${eventMission.location}. Reward: ${eventMission.gold}G and ${eventMission.fame} fame.`;
}

function missionButtonDisabled(locked, active) {
  if (locked || active || state.selectedIds.length === 0) {
    return "disabled";
  }
  return "";
}

function miniStat(label, value) {
  return `<span class="mini-stat">${label}<strong>${value}</strong></span>`;
}

function renderTrait(label, value = 1) {
  const pips = Array.from({ length: 5 }, (_, index) => `<span class="trait-pip ${index < value ? "filled" : ""}"></span>`).join("");
  return `
    <div class="trait-row">
      <span>${label}</span>
      <span class="trait-pips" aria-label="${label} ${value} out of 5">${pips}</span>
    </div>
  `;
}

function renderPotential(value) {
  const pips = Array.from({ length: 5 }, (_, index) => `<i class="${index < value ? "filled" : ""}"></i>`).join("");
  return `<span class="potential-pips" aria-label="Potential ${value} out of 5">${pips}</span>`;
}

function renderQuirk(id) {
  const quirk = quirkCatalog[id];
  if (!quirk) {
    return "";
  }
  return `
    <div class="quirk-row ${quirk.tone}">
      <span class="quirk-sign" aria-hidden="true">${quirk.tone === "positive" ? "+" : "-"}</span>
      <div><strong>${quirk.name}</strong><small>${quirk.description}</small></div>
    </div>
  `;
}

function renderAbilityRow(id, extraClass = "") {
  const ability = abilityCatalog[id];
  if (!ability) {
    return "";
  }
  const source = ability.source === "natural" ? `Class ability | Lv ${ability.level}` : "Training ability";
  return `
    <div class="ability-row ${extraClass}">
      <span class="ability-sigil" aria-hidden="true">${ability.source === "natural" ? classes[ability.classId]?.label.slice(0, 1) || "A" : "T"}</span>
      <div><strong>${ability.name}</strong><small>${ability.description}</small></div>
      <span class="ability-source">${source}</span>
    </div>
  `;
}

function renderKnownAbilities(adventurer) {
  const known = (adventurer.abilities || []).map((id) => renderAbilityRow(id)).join("");
  const nextNaturalId = (classAbilityTracks[adventurer.classId] || [])
    .find((id) => !adventurer.abilities.includes(id));
  const nextNatural = nextNaturalId ? abilityCatalog[nextNaturalId] : null;
  const nextRow = nextNatural
    ? `<div class="ability-row upcoming"><span class="ability-sigil" aria-hidden="true">?</span><div><strong>${nextNatural.name}</strong><small>Naturally learned at level ${nextNatural.level}.</small></div><span class="ability-source">Upcoming</span></div>`
    : "";
  return known + nextRow || `<p class="system-empty">No abilities learned yet.</p>`;
}

function renderTrainingCurriculum(adventurer) {
  const trainingLevel = state.facilities.trainingYard || 0;
  const learned = getTaughtAbilityIds(adventurer).length;
  const capacity = getTrainingCapacity(adventurer);
  if (trainingLevel < 1) {
    return `
      <section class="character-section training-section locked">
        <div class="section-line-heading"><p class="eyebrow">Training</p><span>${learned}/${capacity} techniques</span></div>
        <p class="system-empty">Build the Training Yard during Guildstead's first expansion to teach this adventurer new abilities.</p>
      </section>
    `;
  }

  const rows = trainingAbilityIds.map((id) => {
    const ability = abilityCatalog[id];
    const known = adventurer.abilities.includes(id);
    const levelLocked = trainingLevel < ability.trainingLevel;
    const full = learned >= capacity && !known;
    const disabled = known || levelLocked || full || state.gold < ability.cost || adventurer.status !== "idle";
    const buttonText = known ? "Learned" : levelLocked ? `Yard Lv ${ability.trainingLevel}` : full ? "Capacity full" : adventurer.status !== "idle" ? "Unavailable" : `${ability.cost}G`;
    return `
      <div class="training-row ${known ? "known" : ""} ${levelLocked ? "locked" : ""}">
        <span class="ability-sigil" aria-hidden="true">T</span>
        <div><strong>${ability.name}</strong><small>${ability.description}</small></div>
        <button class="secondary-button" data-teach-ability="${id}" type="button" ${disabled ? "disabled" : ""}>${buttonText}</button>
      </div>
    `;
  }).join("");

  return `
    <section class="character-section training-section">
      <div class="section-line-heading">
        <p class="eyebrow">Training Yard Lv ${trainingLevel}</p>
        <span>${learned}/${capacity} techniques</span>
      </div>
      <div class="training-list">${rows}</div>
    </section>
  `;
}

function renderSprite(adventurer, extraClass = "") {
  const slot = getSpriteSlot(adventurer);
  const atlasClass = usesGenderedSpriteAtlas(adventurer) ? "hero-atlas" : "";
  return `<span class="unit-sprite slot-${slot} ${atlasClass} ${extraClass}" aria-hidden="true"></span>`;
}

function usesGenderedSpriteAtlas(adventurer) {
  return Boolean(adventurer.founder || adventurer.useHeroAtlas || ["male", "female"].includes(adventurer.gender));
}

function getSpriteSlot(adventurer) {
  const classSlots = {
    warden: 0,
    spellwright: 1,
    ranger: 2,
    minstrel: 3,
    rookie: 0
  };
  if (usesGenderedSpriteAtlas(adventurer)) {
    const genderRow = adventurer.gender === "female" ? 4 : 0;
    return (classSlots[adventurer.classId] ?? 0) + genderRow;
  }
  const raceSlots = {
    Dwarf: 4,
    Angel: 5,
    Orc: 6,
    Tiefling: 7,
    Lizardfolk: 7
  };
  if (raceSlots[adventurer.race] !== undefined) {
    return raceSlots[adventurer.race];
  }
  return adventurer.classId === "rookie" ? 4 : classSlots[adventurer.classId] ?? 0;
}

function selectFounderClass(classId) {
  if (!classes[classId] || classId === "rookie") {
    return;
  }
  elements.founderClass.value = classId;
  renderFounderPreview();
}

function selectFounderGender(gender) {
  if (!["male", "female"].includes(gender)) {
    return;
  }
  elements.founderGender.value = gender;
  renderFounderPreview();
}

function updateCreatorSelectionState() {
  elements.founderClassOptions.forEach((button) => {
    const active = button.dataset.founderClass === elements.founderClass.value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  elements.founderGenderOptions.forEach((button) => {
    const active = button.dataset.founderGender === elements.founderGender.value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderFounderPreview() {
  if (!elements.founderPreview) {
    return;
  }
  const classId = elements.founderClass.value || "warden";
  const gender = elements.founderGender.value || "male";
  const name = cleanName(elements.founderName.value) || "Your Hero";
  updateCreatorSelectionState();
  elements.founderPreview.innerHTML = `${renderSprite({ classId, gender, race: "Human", name, founder: true })}<span>${gender === "female" ? "Female" : "Male"} ${classes[classId].label}</span>`;
}

function createFounder() {
  if (state.founderCreated) {
    return;
  }
  const name = cleanName(elements.founderName.value) || "Founder";
  const classId = elements.founderClass.value;
  const gender = elements.founderGender.value || "male";
  const founder = makeAdventurer(name, classId, true, gender);
  state.adventurers.push(founder);
  selectedAdventurerId = founder.id;
  state.selectedIds = [founder.id];
  state.founderCreated = true;
  state.chapter.stage = "firstQuest";
  activeView = "quest";
  addLog(`${name} answers Mara's call as the Wayfarer's Rest's first and only adventurer.`);
  render();
  showToast("First job posted", `${name} is ready to recover the tavern supplies.`, "info");
}

function randomiseFounder() {
  elements.founderName.value = names[Math.floor(Math.random() * names.length)];
  const classIds = ["warden", "spellwright", "ranger", "minstrel"];
  elements.founderClass.value = classIds[Math.floor(Math.random() * classIds.length)];
  elements.founderGender.value = Math.random() > 0.5 ? "female" : "male";
  renderFounderPreview();
}

function postRecruitmentNotice() {
  if (!state.recruitment.unlocked || state.recruitment.order || state.recruitment.candidates.length > 0 || state.gold < RECRUITMENT_COST || state.adventurers.length >= getRosterCapacity()) {
    return;
  }
  const travelDays = 1 + Math.floor(Math.random() * 2);
  state.gold -= RECRUITMENT_COST;
  state.recruitment.order = {
    postedDay: state.day,
    readyDay: state.day + travelDays
  };
  addLog(`Mara posts a recruitment notice and pays ${RECRUITMENT_COST}G in food and travel costs. Applicants should arrive in ${travelDays} day${travelDays === 1 ? "" : "s"}.`);
  render();
  showToast("Recruitment notice posted", `Mara expects applicants by day ${state.recruitment.order.readyDay}.`, "info");
}

function makeRecruit(seed, nameOverride = "") {
  const classIds = ["warden", "spellwright", "ranger", "minstrel", "rookie"];
  const classId = classIds[Math.floor(Math.random() * classIds.length)];
  const name = nameOverride || names[(Math.floor(Math.random() * names.length) + seed) % names.length];
  const recruit = makeAdventurer(name, classId, false);
  const tavernBonus = state.facilities.tavern - 1;
  Object.keys(recruit.stats).forEach((stat) => {
    recruit.stats[stat] += Math.floor(Math.random() * (2 + tavernBonus));
  });
  return recruit;
}

function makeRecruitmentCandidates() {
  const usedNames = new Set(state.adventurers.map((adventurer) => adventurer.name));
  const availableNames = names.filter((name) => !usedNames.has(name));
  const candidates = [];
  for (let index = 0; index < 3; index += 1) {
    const poolIndex = availableNames.length ? Math.floor(Math.random() * availableNames.length) : -1;
    const name = poolIndex >= 0 ? availableNames.splice(poolIndex, 1)[0] : `${pick(names)} ${state.day}`;
    const candidate = makeRecruit(state.recruitment.hires + index + 1, name);
    candidate.status = "candidate";
    candidate.lifeLog = [{ day: state.day, text: `Travelled to the Wayfarer's Rest after seeing Mara's recruitment notice.` }];
    candidates.push(candidate);
  }
  return candidates;
}

function processRecruitmentArrivals() {
  if (!state.recruitment.order || state.day < state.recruitment.order.readyDay) {
    return false;
  }
  state.recruitment.order = null;
  state.recruitment.candidates = makeRecruitmentCandidates();
  addLog("Three adventurers arrive at the tavern. Mara has prepared a shortlist for the Guildmaster.");
  showToast("Applicants have arrived", "Visit the Adventurers panel and choose one recruit.", "success");
  return true;
}

function hireRecruitmentCandidate(candidateId) {
  if (state.adventurers.length >= getRosterCapacity()) {
    return;
  }
  const candidate = state.recruitment.candidates.find((adventurer) => adventurer.id === candidateId);
  if (!candidate) {
    return;
  }
  candidate.status = "idle";
  addLifeEvent(candidate, "Was chosen by the Guildmaster to join Guildstead.");
  state.adventurers.push(candidate);
  state.recruitment.candidates = [];
  state.recruitment.hires += 1;
  selectedAdventurerId = candidate.id;
  addLog(`${candidate.name} the ${classes[candidate.classId].label} is chosen from Mara's tavern shortlist.`);
  if (state.chapter.stage === "recruitment") {
    state.chapter.stage = "buildBoard";
    showChapterMoment("questBoard");
  }
  render();
  showToast("Adventurer recruited", `${candidate.name} has joined the roster.`, "success");
}

function makeAdventurer(name, classId, founder, gender = null) {
  const base = classes[classId].stats;
  const identity = makeIdentity(name, classId, founder, state.day, gender);
  return {
    id: crypto.randomUUID(),
    name,
    classId,
    founder,
    ...identity,
    level: 1,
    xp: 0,
    status: "idle",
    recovery: 0,
    abilities: getNaturalAbilityIds(classId, 1),
    stats: { ...base }
  };
}

function makeIdentity(name, classId, founder, day, gender = null) {
  const race = founder ? races[0] : pick(races);
  const origin = founder
    ? "Answered Mara's call when goblins threatened the Wayfarer's Rest"
    : pick(origins);
  const className = classes[classId].label;
  const firstEntry = founder
    ? `Joined the Wayfarer's Rest as its first ${className}.`
    : `${origin} and joined Guildstead as a ${className}.`;

  return {
    race: race.name,
    gender: gender || (Math.random() > 0.5 ? "female" : "male"),
    age: founder ? 19 : 18 + Math.floor(Math.random() * 15),
    favouriteFood: pick(favouriteFoods),
    dream: pick(dreams),
    origin,
    birthdayDay: 1 + Math.floor(Math.random() * 28),
    potential: founder ? 5 : 2 + Math.floor(Math.random() * 3),
    quirks: rollQuirks(),
    traits: rollTraits(founder),
    lifeLog: [{ day: day || 1, text: firstEntry }]
  };
}

function normaliseAdventurer(adventurer, day) {
  const classId = classes[adventurer.classId] ? adventurer.classId : "rookie";
  const legacyFounderGender = ["spellwright", "ranger"].includes(classId) ? "female" : "male";
  const gender = adventurer.gender || (adventurer.founder ? legacyFounderGender : (Math.random() > 0.5 ? "female" : "male"));
  const identity = makeIdentity(adventurer.name || "Adventurer", classId, Boolean(adventurer.founder), day || 1, gender);
  const normalised = {
    ...adventurer,
    name: adventurer.name || "Adventurer",
    classId,
    gender,
    race: adventurer.race || identity.race,
    age: adventurer.age || identity.age,
    favouriteFood: adventurer.favouriteFood || identity.favouriteFood,
    dream: adventurer.dream || identity.dream,
    origin: adventurer.origin || identity.origin,
    birthdayDay: adventurer.birthdayDay || identity.birthdayDay,
    potential: adventurer.founder ? 5 : Math.max(1, Math.min(5, adventurer.potential || identity.potential)),
    quirks: {
      positive: adventurer.quirks?.positive && quirkCatalog[adventurer.quirks.positive] ? adventurer.quirks.positive : identity.quirks.positive,
      negative: adventurer.quirks?.negative && quirkCatalog[adventurer.quirks.negative] ? adventurer.quirks.negative : identity.quirks.negative
    },
    abilities: Array.isArray(adventurer.abilities) ? adventurer.abilities.filter((id) => abilityCatalog[id]) : [],
    traits: { ...identity.traits, ...(adventurer.traits || {}) },
    lifeLog: adventurer.lifeLog?.length ? adventurer.lifeLog : identity.lifeLog,
    stats: { ...classes[classId].stats, ...(adventurer.stats || {}) }
  };
  syncNaturalAbilities(normalised);
  return normalised;
}

function rollQuirks() {
  const positive = pick(positiveQuirkIds);
  const conflicts = {
    dauntless: "nervous",
    quickStudy: "stubborn",
    hearty: "frail"
  };
  return {
    positive,
    negative: pick(negativeQuirkIds.filter((id) => id !== conflicts[positive]))
  };
}

function rollTraits(founder) {
  const traits = Object.fromEntries(
    traitLabels.map(([key]) => [key, 1 + Math.floor(Math.random() * 5)])
  );
  if (founder) {
    traits.brave = Math.max(traits.brave, 4);
    traits.loyal = Math.max(traits.loyal, 4);
  }
  return traits;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getNaturalAbilityIds(classId, level) {
  return (classAbilityTracks[classId] || [])
    .filter((id) => abilityCatalog[id].level <= level);
}

function syncNaturalAbilities(adventurer, announce = false) {
  if (!Array.isArray(adventurer.abilities)) {
    adventurer.abilities = [];
  }
  getNaturalAbilityIds(adventurer.classId, adventurer.level || 1).forEach((id) => {
    if (adventurer.abilities.includes(id)) {
      return;
    }
    adventurer.abilities.push(id);
    if (announce) {
      const ability = abilityCatalog[id];
      addLifeEvent(adventurer, `Naturally learned ${ability.name}.`);
      addLog(`${adventurer.name} naturally learns ${ability.name}.`);
    }
  });
}

function getTaughtAbilityIds(adventurer) {
  return (adventurer.abilities || []).filter((id) => abilityCatalog[id]?.source === "training");
}

function getTrainingCapacity(adventurer) {
  if (adventurer.potential >= 5) {
    return 4;
  }
  if (adventurer.potential >= 3) {
    return 3;
  }
  return 2;
}

function getPotentialLabel(potential) {
  return ["Unproven", "Steady", "Promising", "Remarkable", "Exceptional"][Math.max(1, potential) - 1] || "Unproven";
}

function getCharacterEffects(adventurer) {
  const quirkIds = [adventurer.quirks?.positive, adventurer.quirks?.negative].filter(Boolean);
  return [...quirkIds, ...(adventurer.abilities || [])]
    .map((id) => quirkCatalog[id] || abilityCatalog[id])
    .filter(Boolean);
}

function getEffectMissionPower(effect, mission, partySize) {
  let power = effect.power || 0;
  if (effect.focusPower && (!effect.focus || effect.focus === mission.focus)) {
    power += effect.focusPower;
  }
  if (effect.dangerPower && mission.difficulty >= 45) {
    power += effect.dangerPower;
  }
  if (effect.allyPower) {
    power += effect.allyPower * Math.max(0, partySize - 1);
  }
  if (effect.soloPower && partySize === 1) {
    power += effect.soloPower;
  }
  return power;
}

function getPotentialPower(adventurer) {
  return Math.floor(Math.max(0, adventurer.potential - 1) * Math.max(1, adventurer.level) / 4);
}

function getPartyDurationRate(party) {
  const adjustment = party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer).reduce((sum, effect) => sum + ((effect.durationRate || 1) - 1), 0);
  }, 0);
  return Math.max(0.75, Math.min(1.25, 1 + adjustment));
}

function getPartyRollBonus(party) {
  return party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer).reduce((sum, effect) => sum + (effect.rollBonus || 0), 0);
  }, 0);
}

function getPartyGoldRate(party) {
  return 1 + party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer).reduce((sum, effect) => sum + (effect.goldRate || 0), 0);
  }, 0);
}

function getPartyFameBonus(party) {
  return party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer).reduce((sum, effect) => sum + (effect.fameBonus || 0), 0);
  }, 0);
}

function getXpRate(adventurer) {
  return getCharacterEffects(adventurer).reduce((rate, effect) => rate * (effect.xpRate || 1), 1);
}

function getRecoveryReduction(adventurer) {
  return getCharacterEffects(adventurer).reduce((total, effect) => total + (effect.recoveryReduction || 0), 0);
}

function teachAbility(adventurerId, abilityId) {
  const adventurer = getAdventurer(adventurerId);
  const ability = abilityCatalog[abilityId];
  const trainingLevel = state.facilities.trainingYard || 0;
  if (!adventurer || !ability || ability.source !== "training" || adventurer.status !== "idle") {
    return;
  }
  if (trainingLevel < ability.trainingLevel || state.gold < ability.cost || adventurer.abilities.includes(abilityId)) {
    return;
  }
  if (getTaughtAbilityIds(adventurer).length >= getTrainingCapacity(adventurer)) {
    showToast("Training capacity reached", `${adventurer.name} cannot master another taught ability.`, "danger");
    return;
  }
  state.gold -= ability.cost;
  adventurer.abilities.push(abilityId);
  addLifeEvent(adventurer, `Learned ${ability.name} in the Training Yard.`);
  addLog(`${adventurer.name} masters ${ability.name} in the Training Yard.`);
  render();
  showToast("Ability learned", `${adventurer.name} learned ${ability.name}.`, "success");
}

function toggleAdventurer(id) {
  const adventurer = getAdventurer(id);
  if (!adventurer || adventurer.status !== "idle") {
    return;
  }
  if (state.selectedIds.includes(id)) {
    state.selectedIds = state.selectedIds.filter((selectedId) => selectedId !== id);
  } else if (state.selectedIds.length < 3) {
    state.selectedIds.push(id);
  }
  render();
}

function startMission(missionId) {
  const mission = getMission(missionId);
  if (!mission || getMissionLockReason(mission) || state.selectedIds.length === 0) {
    return;
  }
  const partyIds = state.selectedIds.filter((id) => getAdventurer(id)?.status === "idle").slice(0, 3);
  if (partyIds.length === 0) {
    return;
  }

  const party = partyIds.map(getAdventurer).filter(Boolean);
  party.forEach((adventurer) => {
    adventurer.status = "busy";
    addLifeEvent(adventurer, `Set out for ${mission.name}.`);
  });

  const duration = getMissionDuration(mission, party);
  const startedAt = Date.now();
  state.activeMissions.push({
    id: crypto.randomUUID(),
    missionId,
    missionSnapshot: { ...mission },
    partyIds,
    elapsed: 0,
    duration,
    startedAt,
    endsAt: startedAt + duration * 1000,
    encounterId: getEncounterIdForMission(mission),
    encounterStatus: "waiting",
    encounterTriggerAt: Math.max(5, Math.floor(duration * (mission.tutorial ? 0.24 : 0.3))),
    enemyMaxHealth: Math.max(80, mission.difficulty + 70),
    encounterDamage: 0,
    powerBonus: 0,
    goldBonus: 0,
    fameBonus: 0,
    xpBonus: 0,
    injuryShield: 0
  });

  if (mission.isEvent) {
    state.eventMissions = state.eventMissions.filter((eventMission) => eventMission.id !== mission.id);
    if (currentPopupEventId === mission.id) {
      currentPopupEventId = null;
    }
  }

  state.selectedIds = [];
  addLog(`${party.map((adventurer) => adventurer.name).join(", ")} set out for ${mission.name}.`);
  render();
  playDispatchAnimation(party, mission);
  showToast("Expedition departed", `${party.map((adventurer) => adventurer.name).join(", ")} set out for ${mission.location}.`, "info");
}

function getMissionDuration(mission, party) {
  const baseDuration = mission.duration - Math.floor(Math.max(0, state.facilities.questBoard - 1) * 1.5);
  return Math.max(20, Math.round(baseDuration * getPartyDurationRate(party)));
}

function tick() {
  let changed = false;
  const now = Date.now();
  state.activeMissions.forEach((activeMission) => {
    activeMission.elapsed = activeMission.startedAt
      ? Math.min(activeMission.duration, Math.floor((now - activeMission.startedAt) / 1000))
      : activeMission.elapsed + 1;
    changed = true;
    const encounterUpdate = updateMissionEncounter(activeMission, now);
    if (encounterUpdate === "triggered") {
      const encounter = encounterDeck[activeMission.encounterId];
      showToast("Expedition needs a decision", encounter.title, "info");
    }
  });

  const complete = state.activeMissions.filter((activeMission) => activeMission.elapsed >= activeMission.duration);
  if (complete.length > 0) {
    complete.forEach(resolveMission);
    state.activeMissions = state.activeMissions.filter((activeMission) => activeMission.elapsed < activeMission.duration);
    changed = true;
  }

  state.adventurers.forEach((adventurer) => {
    if (adventurer.status === "injured") {
      adventurer.recovery -= 1;
      changed = true;
      if (adventurer.recovery <= 0) {
        adventurer.status = "idle";
        adventurer.recovery = 0;
        addLifeEvent(adventurer, "Recovered from their injury and returned to guild duty.");
        addLog(`${adventurer.name} is back on their feet and pretending the limp is stylish.`);
      }
    }
  });

  if (changed) {
    render();
  }
}

function resolveMission(activeMission) {
  const mission = getMissionForActive(activeMission);
  const party = activeMission.partyIds.map(getAdventurer).filter(Boolean);
  if (activeMission.encounterStatus === "active") {
    resolveEncounterChoice(activeMission.id, "trustParty", true, false);
  }
  const power = getPartyPower(party, mission) + (activeMission.powerBonus || 0);
  const roll = Math.floor(Math.random() * 18) + getPartyRollBonus(party);
  const success = mission.guaranteedSuccess || power + roll >= mission.difficulty;
  const partyNames = party.map((adventurer) => adventurer.name).join(", ");

  if (success) {
    const baseGold = mission.gold + state.facilities.questBoard * 6 + (activeMission.goldBonus || 0);
    const gold = Math.round(baseGold * getPartyGoldRate(party));
    const fame = mission.fame + Math.floor(state.facilities.questBoard / 2) + getPartyFameBonus(party) + (activeMission.fameBonus || 0);
    state.gold += gold;
    state.fame += fame;
    party.forEach((adventurer) => {
      adventurer.status = "idle";
      addLifeEvent(adventurer, `Completed ${mission.name} and helped earn ${fame} fame.`);
      grantXp(adventurer, Math.round((9 + mission.fame + state.facilities.trainingYard * 2 + (activeMission.xpBonus || 0)) * getXpRate(adventurer)));
    });
    addLog(`${partyNames} complete ${mission.name}, earning ${gold}G and ${fame} fame.`);
    handleChapterMissionSuccess(mission);
    showToast("Mission complete", `${mission.name} earned ${gold}G and ${fame} fame.`, "success");
  } else {
    const consolationGold = Math.floor(mission.gold * 0.3);
    state.gold += consolationGold;
    party.forEach((adventurer) => {
      adventurer.status = "idle";
      addLifeEvent(adventurer, `Retreated from ${mission.name}, wiser and bruised.`);
      grantXp(adventurer, Math.round(4 * getXpRate(adventurer)));
    });
    if (activeMission.injuryShield > 0) {
      addLog(`${partyNames} retreat from ${mission.name}, but their earlier preparation prevents an injury.`);
      showToast("Party retreated safely", `The party escaped ${mission.location} without injury.`, "info");
    } else {
      const injured = party[Math.floor(Math.random() * party.length)];
      injured.status = "injured";
      injured.recovery = Math.max(3, 12 - state.facilities.dormitory * 2 - getRecoveryReduction(injured));
      addLifeEvent(injured, `Was injured during ${mission.name}.`);
      addLog(`${partyNames} retreat from ${mission.name}. ${injured.name} needs ${injured.recovery}s to recover.`);
      showToast("Party retreated", `${injured.name} was injured at ${mission.location}.`, "danger");
    }
  }
}

function normaliseActiveMission(activeMission) {
  const mission = activeMission.missionSnapshot || missionDeck.find((item) => item.id === activeMission.missionId) || {};
  const duration = activeMission.duration || mission.duration || 30;
  return {
    ...activeMission,
    encounterId: activeMission.encounterId || getEncounterIdForMission(mission),
    encounterStatus: activeMission.encounterStatus || "waiting",
    encounterTriggerAt: activeMission.encounterTriggerAt || Math.max(5, Math.floor(duration * (mission.tutorial ? 0.24 : 0.3))),
    enemyMaxHealth: activeMission.enemyMaxHealth || Math.max(80, (mission.difficulty || 10) + 70),
    encounterDamage: activeMission.encounterDamage || 0,
    powerBonus: activeMission.powerBonus || 0,
    goldBonus: activeMission.goldBonus || 0,
    fameBonus: activeMission.fameBonus || 0,
    xpBonus: activeMission.xpBonus || 0,
    injuryShield: activeMission.injuryShield || 0
  };
}

function getEncounterIdForMission(mission) {
  const label = `${mission.id || ""} ${mission.name || ""} ${mission.location || ""}`.toLowerCase();
  if (mission.tutorial || mission.chapterBoss || label.includes("goblin")) {
    return "goblinAmbush";
  }
  if (label.includes("bridge") || label.includes("road") || mission.focus === "str") {
    return "collapsedBridge";
  }
  if (mission.focus === "mag" || mission.focus === "cha") {
    return "woundedTraveller";
  }
  return "hiddenCache";
}

function updateMissionEncounter(activeMission, now) {
  if (activeMission.encounterStatus === "waiting" && activeMission.elapsed >= activeMission.encounterTriggerAt && activeMission.elapsed < activeMission.duration) {
    activeMission.encounterStatus = "active";
    activeMission.encounterTriggeredAt = now;
    activeMission.encounterExpiresAt = now + 18000;
    return "triggered";
  }
  if (activeMission.encounterStatus === "active" && now >= activeMission.encounterExpiresAt) {
    resolveEncounterChoice(activeMission.id, "trustParty", true, false);
    return "resolved";
  }
  return "";
}

function getPartyPower(party, mission) {
  const statPower = party.reduce((total, adventurer) => {
    const stats = adventurer.stats;
    const effectPower = getCharacterEffects(adventurer)
      .reduce((sum, effect) => sum + getEffectMissionPower(effect, mission, party.length), 0);
    return total + stats.str + stats.mag + stats.wit + stats.cha + stats[mission.focus] * 1.5 + adventurer.level * 2 + effectPower + getPotentialPower(adventurer);
  }, 0);
  const facilityPower =
    state.facilities.trainingYard * 2 +
    state.facilities.workshop * 3 +
    state.facilities.kitchen * 2 +
    state.facilities.dormitory +
    state.facilities.tavern;
  return Math.floor(statPower / 3 + facilityPower);
}

function grantXp(adventurer, amount) {
  adventurer.xp += amount;
  while (adventurer.xp >= xpForNext(adventurer.level)) {
    adventurer.xp -= xpForNext(adventurer.level);
    adventurer.level += 1;
    const classData = classes[adventurer.classId];
    adventurer.stats[classData.primary] += 2;
    adventurer.stats[classData.secondary] += 1;
    if (adventurer.potential >= 5 || (adventurer.potential >= 4 && adventurer.level % 2 === 0)) {
      adventurer.stats[classData.primary] += 1;
    }
    if (adventurer.potential >= 5 && adventurer.level % 3 === 0) {
      adventurer.stats[classData.secondary] += 1;
    }
    addLifeEvent(adventurer, `Reached level ${adventurer.level} as a ${classes[adventurer.classId].label}.`);
    addLog(`${adventurer.name} reaches level ${adventurer.level}.`);
    syncNaturalAbilities(adventurer, true);
  }
}

function upgradeFacility(id) {
  const facility = facilities.find((item) => item.id === id);
  if (!facility) {
    return;
  }
  const current = state.facilities[id] || 0;
  const cost = upgradeCost(facility);
  if (!isFacilityUnlocked(id) || current >= 5 || state.gold < cost) {
    return;
  }
  state.gold -= cost;
  state.facilities[id] = current + 1;
  const built = current === 0;
  addLog(built ? `${facility.name} is built at the Wayfarer's Rest.` : `${facility.name} improves to level ${state.facilities[id]}.`);
  if (id === "questBoard" && built && state.chapter.stage === "buildBoard") {
    state.chapter.stage = "localRequests";
    activeView = "quest";
    addLog("Mara pins the first three local requests to the new board.");
  }
  if (["dormitory", "trainingYard", "kitchen"].includes(id) && built && state.chapter.stage === "expansion") {
    state.chapter.stage = "boss";
    activeView = "quest";
    addLog("With the tavern expanded, Mara marks the Barrow Hill goblin camp on the map.");
  }
  render();
  showToast(built ? "New room built" : "Facility improved", `${facility.name} is now level ${state.facilities[id]}.`, "success");
}

function scoutForEvent(force = false) {
  if (!state.founderCreated || state.facilities.questBoard < 1 || state.eventMissions.length >= 3) {
    return;
  }
  if (!force && Math.random() > 0.55) {
    addLog("The scouts report quiet roads across Jenny's realm.");
    render();
    return;
  }
  const available = eventMissionDeck.filter((template) => {
    return !state.eventMissions.some((eventMission) => eventMission.templateId === template.templateId);
  });
  if (available.length === 0) {
    return;
  }
  const template = available[Math.floor(Math.random() * available.length)];
  const eventMission = {
    ...template,
    id: `event-${crypto.randomUUID()}`,
    isEvent: true,
    unlockFame: 0,
    spawnedDay: state.day,
    expiresDay: state.day + template.expiresIn
  };
  state.eventMissions.push(eventMission);
  currentPopupEventId = eventMission.id;
  addLog(`A realm event appears: ${eventMission.name} at ${eventMission.location}.`);
}

function expireEvents() {
  const activeIds = new Set(state.activeMissions.map((mission) => mission.missionId));
  const expired = state.eventMissions.filter((eventMission) => eventMission.expiresDay < state.day && !activeIds.has(eventMission.id));
  if (expired.length === 0) {
    return;
  }
  expired.forEach((eventMission) => {
    addLog(`${eventMission.name} expires before the guild can respond.`);
  });
  state.eventMissions = state.eventMissions.filter((eventMission) => eventMission.expiresDay >= state.day || activeIds.has(eventMission.id));
}

function openEventDialog(eventId) {
  if (!getEventMission(eventId)) {
    return;
  }
  currentPopupEventId = eventId;
  activeView = "events";
  render();
}

function closeEventDialog() {
  currentPopupEventId = null;
  render();
}

function viewPopupEvent() {
  currentPopupEventId = null;
  activeView = "events";
  render();
  elements.realmMap.scrollIntoView({ behavior: "smooth", block: "center" });
}

function playDispatchAnimation(party, mission) {
  if (!elements.realmMap) {
    return;
  }
  const mapBox = elements.realmMap.getBoundingClientRect();
  const targetX = (parseFloat(mission.marker?.left || "72") / 100 - 0.12) * mapBox.width;
  const targetY = (parseFloat(mission.marker?.top || "52") / 100 - 0.51) * mapBox.height;
  const animationId = crypto.randomUUID();
  dispatchAnimations.push({
    id: animationId,
    party: party.map((adventurer) => ({ ...adventurer })),
    location: mission.location,
    travelX: Math.round(targetX),
    travelY: Math.round(targetY),
    controlX: Math.round(targetX * 0.48),
    controlY: Math.round(targetY * 0.48 - Math.min(90, mapBox.height * 0.16))
  });
  renderMap();
  setTimeout(() => {
    dispatchAnimations = dispatchAnimations.filter((animation) => animation.id !== animationId);
    renderMap();
  }, 1400);
}

function upgradeCost(facility) {
  const level = state.facilities[facility.id] || 0;
  return level === 0 ? facility.buildCost : facility.baseCost + (level - 1) * 80;
}

function advanceDays(amount) {
  state.day += amount;
  checkBirthdays();
  expireEvents();
  const stipend = 10 + state.facilities.tavern * 3 + state.facilities.kitchen * 3;
  state.gold += stipend;
  if (state.day % 7 === 0) {
    const upkeep = Math.max(8, state.adventurers.length * 7 - state.fame);
    state.gold = Math.max(0, state.gold - upkeep);
    addLog(`Weekly upkeep costs ${upkeep}G. The guild accountant looks heroic for once.`);
  } else {
    addLog(`A steady day brings in ${stipend}G from odd jobs and room hire.`);
  }
  if (state.founderCreated && state.facilities.questBoard > 0 && state.day % 3 === 0 && state.eventMissions.length < 2) {
    scoutForEvent(true);
  }
  processRecruitmentArrivals();
  render();
}

function renderChapterProgress() {
  const objective = getChapterObjective();
  elements.chapterObjective.innerHTML = `
    <span class="chapter-number" aria-hidden="true">1</span>
    <div class="chapter-objective-copy">
      <span>Chapter One: Goblin Trouble</span>
      <strong>${objective.title}</strong>
      <small>${objective.detail}</small>
    </div>
    <div class="chapter-meter" aria-label="Chapter ${objective.progress}% complete">
      <i style="width:${objective.progress}%"></i>
      <b>${objective.progress}%</b>
    </div>
  `;
}

function getChapterObjective() {
  const completed = state.chapter.completedLocalMissions.length;
  const objectives = {
    tavern: { title: "Open the tavern", detail: "A quiet morning is about to become rather less quiet.", progress: 0 },
    hero: { title: "Choose your first hero", detail: "Find someone willing to investigate the goblin raid.", progress: 8 },
    firstQuest: { title: "Recover the stolen supplies", detail: "Select a party and follow the tracks along Greenbank Lane.", progress: 18 },
    recruitment: { title: "Recruit a second adventurer", detail: "Post a 45G tavern notice, wait for applicants, then choose one.", progress: 27 },
    buildBoard: { title: "Build the Quest Board", detail: "Spend 55G to turn Mara's idea into a proper local service.", progress: 32 },
    localRequests: { title: `Complete local requests (${completed}/3)`, detail: "Help Greenbank and earn enough trust to expand the tavern.", progress: 38 + completed * 12 },
    expansion: { title: "Choose your first expansion", detail: "Build a Dormitory, Training Yard, or Kitchen.", progress: 78 },
    boss: { title: "Defeat the Barrow Hill Chief", detail: "End the goblin threat and earn an official guild charter.", progress: 90 },
    chartered: { title: "Guildstead is officially open", detail: "The Western March now has an adventurers' guild of its own.", progress: 100 }
  };
  return objectives[state.chapter.stage] || objectives.chartered;
}

function renderChapterDialog() {
  const moment = currentChapterMomentId ? chapterMoments[currentChapterMomentId] : null;
  elements.chapterDialog.classList.toggle("hidden", !moment);
  if (!moment) {
    return;
  }
  elements.chapterDialogEyebrow.textContent = moment.eyebrow;
  elements.chapterDialogTitle.textContent = moment.title;
  elements.chapterDialogText.textContent = moment.text;
  elements.chapterDialogButton.textContent = moment.button;
}

function closeChapterMoment() {
  const moment = currentChapterMomentId ? chapterMoments[currentChapterMomentId] : null;
  currentChapterMomentId = null;
  if (moment?.view) {
    activeView = moment.view;
  }
  render();
}

function showChapterMoment(id) {
  if (!chapterMoments[id]) {
    return;
  }
  currentPopupEventId = null;
  currentChapterMomentId = id;
}

function handleChapterMissionSuccess(mission) {
  if (mission.tutorial && state.chapter.stage === "firstQuest") {
    if (state.adventurers.length > 1) {
      state.recruitment.unlocked = true;
      state.chapter.stage = "buildBoard";
      showChapterMoment("questBoard");
      return;
    }
    state.chapter.stage = "recruitment";
    state.recruitment.unlocked = true;
    addLog("With the supplies safe, Mara suggests posting a paid recruitment notice in the tavern.");
    showChapterMoment("recruitment");
    return;
  }
  if (mission.localRequest && !state.chapter.completedLocalMissions.includes(mission.id)) {
    state.chapter.completedLocalMissions.push(mission.id);
    if (state.chapter.completedLocalMissions.length >= 3 && !state.chapter.charterEarned) {
      state.chapter.stage = "expansion";
      showChapterMoment("expansion");
    }
    return;
  }
  if (mission.chapterBoss && !state.chapter.charterEarned) {
    state.chapter.stage = "chartered";
    state.chapter.charterEarned = true;
    showChapterMoment("charter");
  }
}

function isFacilityUnlocked(id) {
  if (id === "tavern") {
    return true;
  }
  if (id === "questBoard") {
    return ["buildBoard", "localRequests", "expansion", "boss", "chartered"].includes(state.chapter.stage);
  }
  if (["dormitory", "trainingYard", "kitchen"].includes(id)) {
    return state.chapter.completedLocalMissions.length >= 3 || state.chapter.charterEarned;
  }
  if (id === "workshop") {
    return state.chapter.charterEarned;
  }
  return false;
}

function getFacilityUnlockText(id) {
  if (id === "tavern") {
    return "The starting room at the Wayfarer's Rest.";
  }
  if (id === "questBoard") {
    return isFacilityUnlocked(id) ? "Mara's salvaged noticeboard is ready to build." : "Recover the stolen tavern supplies first.";
  }
  if (["dormitory", "trainingYard", "kitchen"].includes(id)) {
    const remaining = Math.max(0, 3 - state.chapter.completedLocalMissions.length);
    return isFacilityUnlocked(id) ? "Blueprint unlocked by helping Greenbank." : `Complete ${remaining} more local request${remaining === 1 ? "" : "s"}.`;
  }
  if (id === "workshop") {
    return isFacilityUnlocked(id) ? "Unlocked by the official guild charter." : "Defeat the Barrow Hill chief and earn a guild charter.";
  }
  return "Blueprint not yet discovered.";
}

function isMissionVisible(mission) {
  const active = state.activeMissions.some((activeMission) => activeMission.missionId === mission.id);
  if (mission.tutorial) {
    return active || ["firstQuest", "buildBoard"].includes(state.chapter.stage);
  }
  if (mission.localRequest) {
    return state.facilities.questBoard > 0;
  }
  if (mission.chapterBoss) {
    return state.facilities.questBoard > 0;
  }
  if (mission.postCharter) {
    return state.chapter.charterEarned;
  }
  return true;
}

function getMissionLockReason(mission) {
  if (mission.isEvent) {
    return state.fame < (mission.unlockFame || 0) ? `Requires ${mission.unlockFame} fame` : "";
  }
  if (mission.tutorial && !["firstQuest", "buildBoard"].includes(state.chapter.stage)) {
    return "Complete the tavern opening first";
  }
  if (mission.localRequest && state.facilities.questBoard < 1) {
    return "Build the Quest Board first";
  }
  if (mission.chapterBoss) {
    if (state.chapter.completedLocalMissions.length < 3) {
      return `Complete ${state.chapter.completedLocalMissions.length}/3 local requests`;
    }
    if (getExpansionCount() < 1) {
      return "Build your first tavern expansion";
    }
  }
  if (mission.postCharter && !state.chapter.charterEarned) {
    return "Earn the official guild charter";
  }
  if (state.fame < (mission.unlockFame || 0)) {
    return `Requires ${mission.unlockFame} fame`;
  }
  return "";
}

function getExpansionCount() {
  return ["dormitory", "trainingYard", "kitchen"].filter((id) => state.facilities[id] > 0).length;
}

function getVenueName() {
  return state.chapter.charterEarned ? "Guildstead Hall" : "The Wayfarer's Rest";
}

function getRosterCapacity() {
  return Math.min(12, 3 + state.facilities.dormitory * 3);
}

function getRank() {
  if (state.fame >= 90) {
    return "B";
  }
  if (state.fame >= 48) {
    return "C";
  }
  if (state.fame >= 18) {
    return "D";
  }
  return "F";
}

function getRankProgress() {
  const thresholds = [0, 18, 48, 90];
  const fame = state.fame;
  if (fame >= thresholds[3]) {
    return 100;
  }
  const lower = fame >= thresholds[2] ? thresholds[2] : fame >= thresholds[1] ? thresholds[1] : thresholds[0];
  const upper = lower === thresholds[2] ? thresholds[3] : lower === thresholds[1] ? thresholds[2] : thresholds[1];
  return Math.round(((fame - lower) / (upper - lower)) * 100);
}

function getCalendar() {
  const seasons = ["Spring", "Summer", "Autumn", "Winter"];
  const yearLength = 112;
  const dayOfYear = (state.day - 1) % yearLength;
  return {
    season: seasons[Math.floor(dayOfYear / 28)],
    seasonDay: (dayOfYear % 28) + 1,
    year: Math.floor((state.day - 1) / yearLength) + 1
  };
}

function getMissionOdds(party, mission) {
  if (!party.length) {
    return 0;
  }
  if (mission.guaranteedSuccess) {
    return 100;
  }
  const power = getPartyPower(party, mission);
  const requiredRoll = mission.difficulty - power - getPartyRollBonus(party);
  if (requiredRoll <= 0) {
    return 100;
  }
  if (requiredRoll > 17) {
    return 0;
  }
  return Math.round(((18 - requiredRoll) / 18) * 100);
}

function getMission(id) {
  return missionDeck.find((mission) => mission.id === id) || state.eventMissions.find((mission) => mission.id === id);
}

function getMissionForActive(activeMission) {
  return activeMission.missionSnapshot || missionDeck.find((mission) => mission.id === activeMission.missionId);
}

function getEventMission(id) {
  return state.eventMissions.find((eventMission) => eventMission.id === id);
}

function getAdventurer(id) {
  return state.adventurers.find((adventurer) => adventurer.id === id);
}

function xpForNext(level) {
  return 24 + level * 10;
}

function addLog(text) {
  state.log.unshift({ day: state.day, text });
}

function addLifeEvent(adventurer, text) {
  if (!adventurer.lifeLog) {
    adventurer.lifeLog = [];
  }
  adventurer.lifeLog.unshift({ day: state.day, text });
  adventurer.lifeLog = adventurer.lifeLog.slice(0, 20);
}

function checkBirthdays() {
  const calendarDay = ((state.day - 1) % 28) + 1;
  state.adventurers.forEach((adventurer) => {
    if (adventurer.birthdayDay !== calendarDay) {
      return;
    }
    adventurer.age += 1;
    addLifeEvent(adventurer, `Turned ${adventurer.age}.`);
    addLog(`${adventurer.name} turns ${adventurer.age}. The guild pretends the cake was planned.`);
  });
}

function showToast(title, message, tone = "info") {
  if (!elements.toastRail) {
    return;
  }
  window.clearTimeout(toastTimer);
  elements.toastRail.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = `game-toast ${tone}`;
  const sigil = document.createElement("span");
  sigil.className = "toast-sigil";
  sigil.textContent = tone === "success" ? "+" : tone === "danger" ? "!" : "i";
  const copy = document.createElement("div");
  const heading = document.createElement("strong");
  const body = document.createElement("span");
  heading.textContent = title;
  body.textContent = message;
  copy.append(heading, body);
  toast.append(sigil, copy);
  elements.toastRail.append(toast);
  toastTimer = window.setTimeout(() => toast.remove(), 3600);
}

function cleanName(value) {
  return value.trim().replace(/[<>]/g, "").slice(0, 18);
}
