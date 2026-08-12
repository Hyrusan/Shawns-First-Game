const STORAGE_KEY = "guildstead-demo-save";
const SAVE_VERSION = 14;
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
const trainingDrills = {
  str: { name: "Weapon Drills", mark: "STR", stat: "str", cost: 28, description: "Raises STR by 1 through sparring and weapon practice." },
  mag: { name: "Arcane Practice", mark: "MAG", stat: "mag", cost: 28, description: "Raises MAG by 1 through focus exercises and spellwork." },
  wit: { name: "Fieldcraft Course", mark: "WIT", stat: "wit", cost: 28, description: "Raises WIT by 1 through tracking and tactical drills." },
  cha: { name: "Leadership Drill", mark: "CHA", stat: "cha", cost: 28, description: "Raises CHA by 1 through command and morale practice." }
};
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
    title: "Heroes Need Somewhere To Train",
    text: "Three local problems solved, and the goblins are gathering at Barrow Hill. Mara suggests turning the old yard into a proper training space before anyone attempts the chief's camp.",
    button: "Build The Training Yard",
    view: "facilities"
  },
  trainingYard: {
    eyebrow: "The First Expansion",
    title: "Training Begins At Guildstead",
    text: "The new yard is ready. Adventurers can spend a day improving a stat or learn techniques over one or two days. While training they cannot join expeditions, so timing now matters.",
    button: "Choose A Trainee",
    view: "adventurers"
  },
  charter: {
    eyebrow: "Royal Charter Awarded",
    title: "Welcome To Guildstead",
    text: "With the Barrow Hill goblins defeated, the Western March finally has a recognised adventurers' guild. The Wayfarer's Rest is now Guildstead Hall, and its next chapter is yours to build.",
    button: "Raise the Guild Banner",
    view: "guildhall"
  }
};

const tavernLifeEvents = {
  sharedMeal: {
    eyebrow: "Tavern Life",
    mark: "Supper",
    title: "A Table For Two",
    description: "The rush has finally eased. {a} and {b} claim the table nearest the hearth, but neither seems quite sure how to begin the conversation.",
    participantCount: 2,
    minHeroes: 2,
    choices: [
      {
        id: "houseMeal",
        label: "Put On A House Meal",
        note: "12G | A generous supper builds a stronger friendship.",
        cost: 12,
        relationship: 3,
        xp: 3,
        traits: { loyal: 1 },
        outcome: "Mara brings out the good plates. By the empty bowls, {a} and {b} are already trading favourite stories."
      },
      {
        id: "swapStories",
        label: "Encourage Their Stories",
        note: "A warm conversation builds curiosity and trust.",
        relationship: 2,
        xp: 2,
        traits: { curious: 1 },
        outcome: "One story becomes five. {a} and {b} discover they have more in common than either expected."
      },
      {
        id: "helpMara",
        label: "Ask Them To Help Mara",
        note: "+8G | Shared work creates a modest bond.",
        gold: 8,
        relationship: 1,
        traits: { loyal: 1 },
        outcome: "They spend the evening clearing tables together. Mara gains two useful hands, and {a} and {b} find an easy rhythm."
      }
    ]
  },
  sparringChallenge: {
    eyebrow: "Tavern Life",
    mark: "Challenge",
    title: "A Friendly Challenge",
    description: "A boast from {a} has turned into a challenge from {b}. Chairs are being moved, wagers are appearing, and Mara is looking directly at you.",
    participantCount: 2,
    minHeroes: 2,
    choices: [
      {
        id: "supervise",
        label: "Supervise The Match",
        note: "8G | Safe equipment, useful practice and a stronger bond.",
        cost: 8,
        relationship: 2,
        xp: 5,
        traits: { brave: 1 },
        outcome: "With proper rules in place, the match is fierce, fair, and only slightly expensive in broken crockery."
      },
      {
        id: "cheer",
        label: "Let The Tavern Cheer",
        note: "+1 fame | Pride rises alongside a new rivalry.",
        fame: 1,
        relationship: -3,
        xp: 3,
        traits: { proud: 1 },
        outcome: "The common room roars with every exchange. {a} and {b} finish grinning, but neither intends to forget the score."
      },
      {
        id: "coolIt",
        label: "Cool Things Down",
        note: "A quiet end keeps the peace, though neither hero is impressed.",
        relationship: -1,
        traits: { loyal: 1 },
        outcome: "You call time before the furniture becomes involved. Peace returns, accompanied by two deeply unconvinced looks."
      }
    ]
  },
  trainingRivalry: {
    eyebrow: "Training Yard",
    mark: "Rivals",
    title: "One More Round",
    description: "The yard should have closed an hour ago, but {a} and {b} are still trying to outdo one another beneath the lanterns.",
    participantCount: 2,
    minHeroes: 2,
    requiresFacility: "trainingYard",
    choices: [
      {
        id: "jointDrill",
        label: "Set A Joint Drill",
        note: "10G | Good coaching turns competition into teamwork.",
        cost: 10,
        relationship: 3,
        xp: 6,
        traits: { loyal: 1 },
        outcome: "You give them a challenge that can only be solved together. The rivalry survives, but now it has respect beneath it."
      },
      {
        id: "keepScore",
        label: "Keep An Official Score",
        note: "+1 fame | Strong experience, stronger rivalry.",
        fame: 1,
        relationship: -3,
        xp: 7,
        traits: { proud: 1 },
        outcome: "Mara produces a chalkboard. By midnight, half the tavern knows the score and both heroes demand a rematch."
      },
      {
        id: "sendToBed",
        label: "Send Them To Bed",
        note: "Small experience gain with no further drama.",
        xp: 2,
        outcome: "The lanterns go out and the yard finally falls quiet. Neither hero admits to being relieved."
      }
    ]
  },
  spellbook: {
    eyebrow: "A Curious Find",
    mark: "Tome",
    title: "The Book Beneath The Bar",
    description: "{a} has found a rain-warped spellbook wedged beneath an old shelf. {b} is already peering over their shoulder as faint letters appear across the page.",
    participantCount: 2,
    minHeroes: 1,
    anchorClass: "spellwright",
    choices: [
      {
        id: "restoreBook",
        label: "Pay To Restore It",
        note: "30G | {a} gains +1 MAG.",
        cost: 30,
        stat: { id: "mag", amount: 1, target: 0 },
        relationship: 1,
        outcome: "A bookbinder saves the surviving pages. {a} spends the next evening filling the margins with excited notes."
      },
      {
        id: "studyTogether",
        label: "Study It Together",
        note: "8G | Experience, curiosity and friendship.",
        cost: 8,
        relationship: 2,
        xp: 6,
        traits: { curious: 1 },
        outcome: "The pair puzzle over the faded script until the fire burns low, testing every theory that does not threaten the roof."
      },
      {
        id: "shelveIt",
        label: "Keep It For Later",
        note: "No cost | A sensible decision, according to Mara.",
        traits: { loyal: 1 },
        outcome: "The spellbook is wrapped, labelled, and placed somewhere considerably less flammable."
      }
    ]
  },
  homesickLetter: {
    eyebrow: "A Quiet Evening",
    mark: "Letter",
    title: "A Long Way From Home",
    description: "Mara finds {a} sitting alone with an unfinished letter. {b} lingers nearby, unsure whether company would help.",
    participantCount: 2,
    minHeroes: 1,
    anchorQuirk: "homesick",
    choices: [
      {
        id: "comfortMeal",
        label: "Cook A Familiar Meal",
        note: "10G | Comfort, loyalty and a warmer friendship.",
        cost: 10,
        relationship: 2,
        xp: 3,
        traits: { loyal: 1 },
        outcome: "The recipe is imperfect, but the smell is close enough. {a} talks late into the evening instead of sitting alone."
      },
      {
        id: "sendLetter",
        label: "Send The Letter",
        note: "3G | A thoughtful gesture builds loyalty.",
        cost: 3,
        xp: 3,
        traits: { loyal: 1 },
        outcome: "You add the letter to the morning post. {a} seems lighter before the courier has even left."
      },
      {
        id: "keepBusy",
        label: "Give Them A Useful Task",
        note: "+6G | Bravery rises, but the evening stays distant.",
        gold: 6,
        traits: { brave: 1, loyal: -1 },
        outcome: "Work fills the silence. By closing time the shelves shine, though the letter remains unfinished."
      }
    ]
  },
  minstrelNight: {
    eyebrow: "Tavern Life",
    mark: "Music",
    title: "A Song For Guildstead",
    description: "{a} tests a new melody by the hearth. {b} starts tapping along, and soon the whole room is waiting for the next verse.",
    participantCount: 2,
    minHeroes: 1,
    anchorClass: "minstrel",
    choices: [
      {
        id: "properPerformance",
        label: "Make It A Proper Show",
        note: "15G | +2 fame and a strong shared memory.",
        cost: 15,
        fame: 2,
        relationship: 2,
        xp: 4,
        traits: { proud: 1 },
        outcome: "Candles are lit and the doors stay open late. By the final chorus, even Mara is singing."
      },
      {
        id: "openFloor",
        label: "Open The Floor",
        note: "+1 fame | Everyone joins in and friendship grows.",
        fame: 1,
        relationship: 2,
        traits: { curious: 1 },
        outcome: "The polished song becomes a cheerful mess of improvised verses. Nobody performs it well, which appears to be the point."
      },
      {
        id: "quietSong",
        label: "Keep It For The Guild",
        note: "Experience and loyalty, with no crowd required.",
        xp: 4,
        relationship: 1,
        traits: { loyal: 1 },
        outcome: "The doors close and the last verse belongs only to the guild. It is the one everyone remembers."
      }
    ]
  },
  restlessEvening: {
    eyebrow: "Tavern Life",
    mark: "Evening",
    title: "Too Restless To Sit Still",
    description: "With no expedition tonight, {a} paces the common room looking for something useful to do. Mara slides a list of possibilities across the bar.",
    participantCount: 1,
    minHeroes: 1,
    choices: [
      {
        id: "practice",
        label: "Practise By The Hearth",
        note: "A focused evening grants experience and bravery.",
        xp: 6,
        traits: { brave: 1 },
        outcome: "{a} turns an empty corner into a practice space and keeps at it until closing time."
      },
      {
        id: "helpMara",
        label: "Help Mara Close Up",
        note: "+8G | A practical evening builds loyalty.",
        gold: 8,
        traits: { loyal: 1 },
        outcome: "The work is hardly heroic, but the tavern closes early and Mara quietly adds extra coin to the guild purse."
      },
      {
        id: "tellStories",
        label: "Entertain The Regulars",
        note: "+1 fame | Curiosity grows with every embellished detail.",
        fame: 1,
        traits: { curious: 1 },
        outcome: "By the third telling, the puddle is a raging river and the goblin has become at least eight feet tall. The regulars approve."
      }
    ]
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
    effect: "Runs timed drills and teaches adventurers new techniques"
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
let partyPickerMissionId = null;
let mapModeOverride = null;
let toastTimer = null;
let tavernLifeDialogOpen = false;
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
  tavernEventPanel: document.querySelector("#tavernEventPanel"),
  realmMap: document.querySelector("#realmMap"),
  contextScene: document.querySelector("#contextScene"),
  contextEyebrow: document.querySelector("#contextEyebrow"),
  contextTitle: document.querySelector("#contextTitle"),
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
  trainingPanel: document.querySelector("#trainingPanel"),
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
  tavernLifeDialog: document.querySelector("#tavernLifeDialog"),
  tavernLifeArt: document.querySelector("#tavernLifeArt"),
  tavernLifeEyebrow: document.querySelector("#tavernLifeEyebrow"),
  tavernLifeTitle: document.querySelector("#tavernLifeTitle"),
  tavernLifeText: document.querySelector("#tavernLifeText"),
  tavernLifeChoices: document.querySelector("#tavernLifeChoices"),
  closeTavernLife: document.querySelector("#closeTavernLifeButton"),
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
elements.closeTavernLife.addEventListener("click", closeTavernLifeEvent);
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

processTrainingCompletions(false);
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
    trainingJobs: [],
    relationships: {},
    tavernLife: {
      active: null,
      resolved: [],
      lastEventDay: 0
    },
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
    if (!saved || typeof saved !== "object" || ![4, 5, 6, 7, 8, 9, 10, 11, 12, 13, SAVE_VERSION].includes(saved.version)) {
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
      trainingJobs: [],
      eventMissions: saved.eventMissions || [],
      inventory: saved.inventory || {},
      recruitment: {
        ...fresh.recruitment,
        ...(saved.recruitment || {})
      },
      selectedIds: []
    };
    loaded.adventurers = (saved.adventurers || []).map((adventurer) => normaliseAdventurer(adventurer, loaded.day));
    loaded.relationships = normaliseRelationships(saved.relationships, loaded.adventurers);
    loaded.tavernLife = normaliseTavernLife(saved.tavernLife, loaded.adventurers);
    loaded.recruitment.candidates = (saved.recruitment?.candidates || []).map((candidate) => normaliseAdventurer(candidate, loaded.day));
    loaded.trainingJobs = (saved.trainingJobs || [])
      .map(normaliseTrainingJob)
      .filter((job) => job && loaded.adventurers.some((adventurer) => adventurer.id === job.adventurerId));
    loaded.trainingJobs.forEach((job) => {
      const trainee = loaded.adventurers.find((adventurer) => adventurer.id === job.adventurerId);
      if (trainee) {
        trainee.status = "training";
      }
    });
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
  partyPickerMissionId = null;
  mapModeOverride = null;
  tavernLifeDialogOpen = false;
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
  renderTavernEventPanel();
  renderGuildhallInterior();
  renderMap();
  renderRoster();
  renderTrainingPanel();
  renderMissions();
  renderExpeditionWatch();
  renderLog();
  renderStores();
  renderEventDialog();
  renderTavernLifeDialog();
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
  const tavernLifeOpen = Boolean(tavernLifeDialogOpen && state.tavernLife.active);
  elements.titleScreen.classList.toggle("hidden", !titleOpen);
  elements.introScene.classList.toggle("hidden", !introOpen);
  document.body.classList.toggle("modal-open", titleOpen || introOpen || eventOpen || chapterOpen || tavernLifeOpen);
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
          ${renderFacilityEmblem(facility.id, "room-icon")}
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
          ${renderFacilityEmblem(facility.id, "facility-icon")}
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
        <span class="map-building" aria-hidden="true">${renderFacilityEmblem(facility.id, "map-facility-emblem")}</span>
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
      <div class="map-town" aria-hidden="true">${renderFacilityEmblem("tavern", "map-guild-emblem")}<i></i><i></i><i></i></div>
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

function renderContextScene() {
  const sceneMeta = getContextSceneMeta(activeView);
  if (activeView === "facilities") {
    elements.contextScene.innerHTML = renderFacilityCutaway(sceneMeta);
    elements.contextScene.setAttribute("aria-label", `${getVenueName()} facility cutaway`);
    return;
  }
  elements.contextScene.innerHTML = renderLivingTavern(sceneMeta);
  elements.contextScene.setAttribute("aria-label", `${getVenueName()} ${sceneMeta.title}`);
}

function getContextSceneMeta(view) {
  const scenes = {
    hero: {
      eyebrow: "Before the guild",
      title: "An Empty Common Room",
      note: "One brave answer will change this quiet tavern."
    },
    guildhall: {
      eyebrow: state.chapter.charterEarned ? "Guildstead Hall" : "The Wayfarer's Rest",
      title: "The Tavern At Work",
      note: "A living view of the guild between expeditions."
    },
    adventurers: {
      eyebrow: "Tavern common room",
      title: state.recruitment.candidates.length ? "Applicants Have Arrived" : "Adventurers Off Duty",
      note: state.recruitment.candidates.length ? "Mara's shortlist waits by the recruitment table." : "Idle heroes eat, rest, and trade stories here."
    },
    facilities: {
      eyebrow: "Building overview",
      title: state.chapter.charterEarned ? "Guildstead Hall Cutaway" : "Tavern Cutaway",
      note: "Every room reflects its current construction level."
    },
    log: {
      eyebrow: "Guild office",
      title: "Ledgers By The Hearth",
      note: "Quiet paperwork, warm food, and the day's stories."
    }
  };
  return scenes[view] || scenes.guildhall;
}

function renderLivingTavern(sceneMeta) {
  const heroesAtHome = state.adventurers.filter((adventurer) => ["idle", "injured"].includes(adventurer.status));
  const applicants = activeView === "adventurers" ? state.recruitment.candidates.slice(0, 2) : [];
  const storyParticipantIds = new Set(state.tavernLife.active?.participantIds || []);
  const people = [
    ...heroesAtHome
      .sort((a, b) => Number(storyParticipantIds.has(b.id)) - Number(storyParticipantIds.has(a.id)))
      .slice(0, Math.max(1, 5 - applicants.length))
      .map((adventurer) => ({ adventurer, role: storyParticipantIds.has(adventurer.id) ? "Story" : adventurer.status === "injured" ? "Resting" : "Off duty" })),
    ...applicants.map((adventurer) => ({ adventurer, role: "Applicant" }))
  ].slice(0, 5);
  const tavernLevel = state.facilities.tavern || 1;
  const awayCount = state.adventurers.filter((adventurer) => adventurer.status === "busy").length;
  const trainingCount = state.trainingJobs.length;
  const detailCount = Math.min(5, tavernLevel + (state.chapter.charterEarned ? 1 : 0));

  return `
    <section class="living-tavern scene-${activeView} venue-level-${tavernLevel} ${state.chapter.charterEarned ? "chartered" : ""}">
      <div class="tavern-wall" aria-hidden="true">
        <span class="tavern-window"><i></i></span>
        <span class="tavern-banner">${state.chapter.charterEarned ? "G" : "W"}</span>
        <span class="tavern-shelf"><i></i><i></i><i></i></span>
        ${Array.from({ length: detailCount }, (_, index) => `<i class="venue-detail detail-${index + 1}"></i>`).join("")}
      </div>
      <div class="tavern-fireplace" aria-hidden="true"><i></i></div>
      <div class="tavern-bar" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="tavern-table table-near" aria-hidden="true"><i></i></div>
      <div class="tavern-table table-far" aria-hidden="true"><i></i></div>
      ${activeView === "log" ? `<div class="ledger-desk" aria-hidden="true"><i></i><b></b></div>` : ""}
      ${activeView === "adventurers" && state.recruitment.unlocked ? `<div class="recruitment-table" aria-hidden="true"><span>R</span><i></i></div>` : ""}
      <div class="context-patrons">
        ${people.map((person, index) => renderContextPatron(person.adventurer, index, person.role)).join("")}
      </div>
      ${people.length === 0 ? `<div class="empty-tavern-message"><strong>The room is quiet</strong><span>Create your founder to give the tavern its first regular.</span></div>` : ""}
      <footer class="context-scene-footer">
        <div><strong>${sceneMeta.title}</strong><span>${sceneMeta.note}</span></div>
        <div class="venue-presence"><span>${heroesAtHome.length} here</span><span>${awayCount} away</span>${trainingCount ? `<span>${trainingCount} training</span>` : ""}<span>Tavern Lv ${tavernLevel}</span></div>
      </footer>
    </section>
  `;
}

function renderContextPatron(adventurer, index, role) {
  const activities = ["Sharing a meal", "Trading stories", "Studying notices", "Warming by the fire", "Helping Mara"];
  const activity = role === "Applicant" ? "Waiting for a decision" : adventurer.status === "injured" ? "Recovering" : activities[index % activities.length];
  return `
    <span class="context-patron patron-${index} ${role === "Applicant" ? "applicant" : ""} ${role === "Story" ? "story" : ""} ${adventurer.status === "injured" ? "resting" : ""}" title="${adventurer.name}: ${activity}">
      ${renderSprite(adventurer, "context-sprite")}
      <span class="patron-label"><strong>${adventurer.name}</strong><small>${role}</small></span>
    </span>
  `;
}

function renderFacilityCutaway(sceneMeta) {
  const availableHeroes = state.adventurers.filter((adventurer) => ["idle", "injured"].includes(adventurer.status));
  const trainingJobs = getActiveTrainingJobs();
  let occupantIndex = 0;
  const rooms = facilities.map((facility) => {
    const level = state.facilities[facility.id] || 0;
    const unlocked = isFacilityUnlocked(facility.id);
    const roomTrainingJobs = facility.id === "trainingYard" ? trainingJobs : [];
    const occupant = roomTrainingJobs.length
      ? getAdventurer(roomTrainingJobs[0].adventurerId)
      : level > 0 && occupantIndex < availableHeroes.length ? availableHeroes[occupantIndex++] : null;
    const status = roomTrainingJobs.length
      ? `${roomTrainingJobs.length}/${getTrainingSlotCount()} training`
      : level > 0 ? `Lv ${level}` : unlocked ? "Build" : "Locked";
    const props = Array.from({ length: Math.min(5, level) }, (_, index) => `<i class="upgrade-prop prop-${index + 1}" style="--prop-index:${index}"></i>`).join("");
    return `
      <section class="cutaway-room facility-scene-${facility.id} ${level > 0 ? "built" : unlocked ? "available" : "locked"} level-${level} ${roomTrainingJobs.length ? "training-active" : ""}" aria-label="${facility.name}, ${roomTrainingJobs.length ? status : level > 0 ? `level ${level}` : unlocked ? "ready to build" : "locked"}">
        <header><strong>${facility.id === "trainingYard" ? "Training" : facility.name}</strong><span>${status}</span></header>
        <div class="facility-scene-fixture" aria-hidden="true"><span></span>${props}</div>
        ${roomTrainingJobs.length ? `<span class="training-yard-effects" aria-hidden="true"><i></i><i></i><i></i></span>` : ""}
        ${occupant ? `<span class="room-occupant ${roomTrainingJobs.length ? "training" : ""}" title="${occupant.name} is ${roomTrainingJobs.length ? `completing ${getTrainingJobName(roomTrainingJobs[0])}` : `using the ${facility.name}`}">${renderSprite(occupant, "small")}${roomTrainingJobs.length > 1 ? `<b>+${roomTrainingJobs.length - 1}</b>` : ""}</span>` : ""}
        ${level === 0 ? `<span class="empty-room-mark" aria-hidden="true">${unlocked ? "+" : "?"}</span>` : ""}
      </section>
    `;
  }).join("");

  return `
    <section class="facility-cutaway-scene ${state.chapter.charterEarned ? "chartered" : ""}">
      <div class="cutaway-roof"><span>${getVenueName()}</span><i></i></div>
      <div class="cutaway-room-grid">${rooms}</div>
      <footer class="context-scene-footer">
        <div><strong>${sceneMeta.title}</strong><span>${sceneMeta.note}</span></div>
        <div class="venue-presence"><span>${getBuiltFacilityCount()} rooms</span><span>${availableHeroes.length} heroes home</span>${trainingJobs.length ? `<span>${trainingJobs.length} training</span>` : ""}</div>
      </footer>
    </section>
  `;
}

function getBuiltFacilityCount() {
  return facilities.filter((facility) => (state.facilities[facility.id] || 0) > 0).length;
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
    const needsAttention = (button.dataset.view === "adventurers" && state.recruitment.candidates.length > 0)
      || (button.dataset.view === "guildhall" && Boolean(state.tavernLife.active));
    button.classList.toggle("attention", needsAttention);
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
  renderContextScene();
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
  if (view !== "quest") {
    partyPickerMissionId = null;
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
  const realmView = ["quest", "events"].includes(activeView);
  const contextual = !expanded && !realmView;
  const sceneMeta = getContextSceneMeta(activeView);
  elements.commandLayout.classList.toggle("map-focus", expanded);
  elements.commandLayout.classList.toggle("management-focus", !expanded);
  elements.mapStage.classList.toggle("compact-map", !expanded);
  elements.mapStage.classList.toggle("contextual-stage", contextual);
  elements.contextScene.classList.toggle("hidden", !contextual);
  elements.realmMap.classList.toggle("hidden", contextual);
  elements.mapFocus.classList.toggle("expanded", expanded);
  elements.mapFocus.setAttribute("aria-pressed", String(expanded));
  elements.contextEyebrow.textContent = contextual ? sceneMeta.eyebrow : "Holy realm of Jenny";
  elements.contextTitle.textContent = contextual ? sceneMeta.title : "Guildstead & The Western March";
  const action = realmView
    ? expanded ? "Compact the realm map" : "Expand the realm map"
    : contextual ? "View the realm map" : "Return to the tavern interior";
  elements.mapFocus.setAttribute("aria-label", action);
  elements.mapFocus.title = action;
}

function renderTavernEventPanel() {
  if (!elements.tavernEventPanel) {
    return;
  }
  const active = state.tavernLife.active;
  const story = getTavernLifeStory(active);
  elements.tavernEventPanel.classList.toggle("hidden", !story);
  if (!story) {
    elements.tavernEventPanel.innerHTML = "";
    return;
  }
  const names = story.participants.map((adventurer) => adventurer.name).join(" & ");
  elements.tavernEventPanel.innerHTML = `
    <section class="tavern-story-callout">
      <span class="tavern-story-mark" aria-hidden="true">${story.template.mark}</span>
      <div class="tavern-story-faces" aria-hidden="true">
        ${story.participants.map((adventurer) => renderSprite(adventurer, "small")).join("")}
      </div>
      <div class="tavern-story-copy">
        <p class="eyebrow">A moment at the tavern | Day ${active.day}</p>
        <h3>${story.template.title}</h3>
        <span>${names || "Mara"} ${story.participants.length === 1 ? "needs" : "need"} the Guildmaster's attention.</span>
      </div>
      <button class="primary-button" data-open-tavern-story type="button">See What Happened</button>
    </section>
  `;
  elements.tavernEventPanel.querySelector("[data-open-tavern-story]")?.addEventListener("click", openTavernLifeEvent);
}

function renderTavernLifeDialog() {
  const story = getTavernLifeStory(state.tavernLife.active);
  const visible = Boolean(story && tavernLifeDialogOpen);
  elements.tavernLifeDialog.classList.toggle("hidden", !visible);
  if (!visible) {
    return;
  }

  elements.tavernLifeEyebrow.textContent = `${story.template.eyebrow} | Day ${state.tavernLife.active.day}`;
  elements.tavernLifeTitle.textContent = story.template.title;
  elements.tavernLifeText.textContent = formatTavernLifeText(story.template.description, story.participants);
  elements.tavernLifeArt.innerHTML = `
    <span class="tavern-life-vignette" aria-hidden="true"></span>
    <span class="tavern-life-caption">${story.template.mark}</span>
    <span class="tavern-life-cast" aria-hidden="true">
      ${story.participants.map((adventurer, index) => `<span class="tavern-life-hero story-hero-${index}">${renderSprite(adventurer, "context-sprite")}</span>`).join("")}
    </span>
  `;
  elements.tavernLifeChoices.innerHTML = story.template.choices.map((choice) => {
    const disabled = (choice.cost || 0) > state.gold;
    const note = formatTavernLifeText(choice.note, story.participants);
    return `
      <button data-tavern-choice="${choice.id}" type="button" ${disabled ? "disabled" : ""}>
        <span class="choice-mark" aria-hidden="true">${choice.cost ? `${choice.cost}G` : choice.gold ? `+${choice.gold}G` : "+"}</span>
        <span><strong>${choice.label}</strong><small>${disabled ? `Needs ${choice.cost}G. ` : ""}${note}</small></span>
      </button>
    `;
  }).join("");
  elements.tavernLifeChoices.querySelectorAll("[data-tavern-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveTavernLifeChoice(button.dataset.tavernChoice));
  });
}

function openTavernLifeEvent() {
  if (!state.tavernLife.active) {
    return;
  }
  currentPopupEventId = null;
  currentChapterMomentId = null;
  tavernLifeDialogOpen = true;
  activeView = "guildhall";
  render();
}

function closeTavernLifeEvent() {
  tavernLifeDialogOpen = false;
  render();
}

function renderGuildhallInterior() {
  const rooms = guildRooms
    .map((room) => {
      const level = room.facilityId ? state.facilities[room.facilityId] : 1;
      const unlocked = isFacilityUnlocked(room.facilityId);
      const built = level > 0;
      const selected = selectedGuildRoomId === room.id;
      const roomTrainingJobs = room.facilityId === "trainingYard" ? getActiveTrainingJobs() : [];
      const trainee = roomTrainingJobs.length ? getAdventurer(roomTrainingJobs[0].adventurerId) : null;
      if (!built) {
        return `
          <button class="guild-room ${room.id} empty-room ${unlocked ? "available" : "locked"} ${selected ? "selected" : ""}" data-guild-room="${room.id}" type="button">
            <span class="room-label">${room.label}</span>
            ${renderFacilityEmblem(room.facilityId, "guild-room-emblem")}
            <span class="empty-room-sigil" aria-hidden="true">${unlocked ? "+" : "?"}</span>
            <span class="empty-room-copy">${unlocked ? "Ready to build" : getFacilityUnlockText(room.facilityId)}</span>
          </button>
        `;
      }
      return `
        <button class="guild-room ${room.id} built ${trainee ? "has-occupant" : ""} ${roomTrainingJobs.length ? "training-active" : ""} ${selected ? "selected" : ""}" data-guild-room="${room.id}" type="button">
          <span class="room-label">${room.label}</span>
          ${renderFacilityEmblem(room.facilityId, "guild-room-emblem")}
          ${trainee ? `<span class="room-scene">${renderSprite(trainee, "small")}</span>` : ""}
          <span class="room-furniture" aria-hidden="true"></span>
          <span class="room-glow" aria-hidden="true"></span>
          ${roomTrainingJobs.length ? `<span class="room-training-sparks" aria-hidden="true"><i></i><i></i><i></i></span>` : ""}
          <span class="room-level-chip">${roomTrainingJobs.length ? `${roomTrainingJobs.length}/${getTrainingSlotCount()} Training` : `Lv ${level}`}</span>
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
  const roomTrainingJobs = room.facilityId === "trainingYard" ? getActiveTrainingJobs() : [];
  const trainingSummary = roomTrainingJobs.length
    ? roomTrainingJobs.map((job) => `${getAdventurer(job.adventurerId)?.name || "Adventurer"}: ${getTrainingJobName(job)} until day ${job.readyDay}`).join(" | ")
    : "The yard is ready for its next trainee.";
  elements.guildhallRoomDetail.innerHTML = `
    <article class="room-detail-card">
      ${renderFacilityEmblem(room.facilityId, "room-detail-icon")}
      <div class="room-detail-copy">
        <p class="eyebrow">${built ? "Selected room" : "Construction space"}</p>
        <h3>${room.name} ${built ? `<span>Level ${level}</span>` : ""}</h3>
        <p class="card-meta">${built ? room.description : getFacilityUnlockText(room.facilityId)}</p>
        ${built && room.facilityId === "trainingYard" ? `<p class="room-training-summary">${trainingSummary}</p>` : ""}
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
      const statusText = adventurer.status === "idle" ? `Lv ${adventurer.level}` : getAdventurerStatusLabel(adventurer);
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
              <p class="card-meta">${adventurer.gender === "female" ? "Female" : "Male"} ${classes[adventurer.classId].label} | Age ${adventurer.age}</p>
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
            ${adventurer.status !== "idle" ? getAdventurerStatusLabel(adventurer) : selected ? "Remove" : "Add"}
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
              <div class="candidate-name"><h4>${candidate.name}</h4><span>${candidate.gender === "female" ? "Female" : "Male"}</span></div>
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

function renderTrainingPanel() {
  if (!elements.trainingPanel) {
    return;
  }
  const level = state.facilities.trainingYard || 0;
  const unlocked = isFacilityUnlocked("trainingYard");
  const visible = level > 0 || unlocked;
  elements.trainingPanel.classList.toggle("hidden", !visible);
  if (!visible) {
    elements.trainingPanel.innerHTML = "";
    return;
  }

  if (level < 1) {
    elements.trainingPanel.innerHTML = `
      <section class="training-overview blueprint">
        <span class="training-sign" aria-hidden="true">T</span>
        <div><p class="eyebrow">First expansion</p><h3>Build The Training Yard</h3><p>Mara's plans will turn the old yard into a place for drills, techniques, and visible character growth.</p></div>
        <button class="primary-button" data-open-training-build type="button">Open Plans</button>
      </section>
    `;
    elements.trainingPanel.querySelector("[data-open-training-build]")?.addEventListener("click", () => setActiveView("facilities"));
    return;
  }

  const jobs = getActiveTrainingJobs();
  const slots = getTrainingSlotCount();
  const cards = jobs.map((job) => {
    const adventurer = getAdventurer(job.adventurerId);
    const progress = getTrainingJobProgress(job);
    const daysLeft = Math.max(0, job.readyDay - state.day);
    return `
      <article class="training-job-card">
        <span class="training-job-sprite">${renderSprite(adventurer, "small")}</span>
        <div class="training-job-copy"><strong>${adventurer.name}</strong><span>${getTrainingJobName(job)}</span><small>Completes day ${job.readyDay} | ${daysLeft} day${daysLeft === 1 ? "" : "s"} left</small></div>
        <span class="training-day-chip">${daysLeft}d</span>
        <div class="training-progress"><i style="width:${progress}%"></i></div>
        <button class="ghost-button" data-view-trainee="${adventurer.id}" type="button">View</button>
      </article>
    `;
  });
  for (let index = jobs.length; index < slots; index += 1) {
    cards.push(`<div class="training-open-slot"><span>+</span><strong>Open training slot</strong><small>Select an idle hero below.</small></div>`);
  }

  elements.trainingPanel.innerHTML = `
    <section class="training-overview active">
      <div class="training-overview-heading">
        <div><p class="eyebrow">Training Yard Lv ${level}</p><h3>${jobs.length ? `${jobs.length} adventurer${jobs.length === 1 ? "" : "s"} training` : "The Yard Is Ready"}</h3></div>
        <span>${jobs.length}/${slots} slots</span>
      </div>
      <div class="training-job-grid">${cards.join("")}</div>
      <p class="training-hint">Training advances with the guild calendar. Select an adventurer's profile to choose a drill or technique.</p>
    </section>
  `;

  elements.trainingPanel.querySelectorAll("[data-view-trainee]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAdventurerId = button.dataset.viewTrainee;
      renderRoster();
      elements.adventurerDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
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
          <p class="card-meta">${adventurer.gender === "female" ? "Female" : "Male"} ${classes[adventurer.classId].label} | Level ${adventurer.level} | ${adventurer.status}</p>
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

      ${renderRelationships(adventurer)}

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

  elements.adventurerDetail.querySelectorAll("[data-start-training]").forEach((button) => {
    button.addEventListener("click", () => startTraining(adventurer.id, button.dataset.trainingKind, button.dataset.startTraining));
  });
  elements.adventurerDetail.querySelectorAll("[data-view-relationship]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAdventurerId = button.dataset.viewRelationship;
      renderRoster();
      elements.adventurerDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function renderMissions() {
  state.selectedIds = state.selectedIds.filter((id) => getAdventurer(id)?.status === "idle").slice(0, 3);
  const selectedParty = state.selectedIds.map(getAdventurer).filter((adventurer) => adventurer?.status === "idle");
  const partyMarkup = `
    <section class="party-tray">
      <div class="party-tray-heading">
        <div>
          <p class="eyebrow">Expedition party</p>
          <h3>${selectedParty.length ? `${selectedParty.length} adventurer${selectedParty.length === 1 ? "" : "s"} ready` : "No party selected"}</h3>
        </div>
        <button class="ghost-button" data-open-roster type="button">View Profiles</button>
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
      const pickerOpen = partyPickerMissionId === mission.id && !locked && !active;
      return `
        <article class="mission-card ${mission.isEvent ? "event" : ""} ${mission.tutorial ? "tutorial" : ""} ${mission.chapterBoss ? "boss" : ""} ${locked ? "locked" : ""} ${pickerOpen ? "party-open" : ""}" data-mission-card="${mission.id}">
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
            ${!locked && !active ? `<button class="secondary-button mission-party-button" data-compose-party="${mission.id}" type="button" aria-expanded="${pickerOpen}">${pickerOpen ? "Close party" : selectedParty.length ? "Change party" : "Choose party"}</button>` : ""}
            <button class="primary-button" data-mission="${mission.id}" type="button" ${missionButtonDisabled(locked, active, selectedParty.length > 0)}>
              ${locked ? "Locked" : active ? "In progress" : "Dispatch"}
            </button>
          </div>
          ${pickerOpen ? renderQuestPartyPicker(mission) : ""}
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
  elements.missionList.querySelector("[data-open-roster]")?.addEventListener("click", () => setActiveView("adventurers"));
  elements.missionList.querySelectorAll("[data-compose-party]").forEach((button) => {
    button.addEventListener("click", () => {
      partyPickerMissionId = partyPickerMissionId === button.dataset.composeParty ? null : button.dataset.composeParty;
      renderMissions();
      elements.missionList.querySelector(`[data-mission-card="${button.dataset.composeParty}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  });
  elements.missionList.querySelectorAll("[data-quest-party]").forEach((button) => {
    button.addEventListener("click", () => toggleAdventurer(button.dataset.questParty));
  });
  elements.missionList.querySelector("[data-clear-quest-party]")?.addEventListener("click", () => {
    state.selectedIds = [];
    render();
  });
  elements.missionList.querySelectorAll("[data-mission]").forEach((button) => {
    button.addEventListener("click", () => startMission(button.dataset.mission));
  });
}

function renderQuestPartyPicker(mission) {
  const selectedCount = state.selectedIds.length;
  const partyFull = selectedCount >= 3;
  const focusLabel = mission.focus.toUpperCase();
  const options = state.adventurers.map((adventurer) => {
    const selected = state.selectedIds.includes(adventurer.id);
    const available = adventurer.status === "idle";
    const disabled = !available || (partyFull && !selected);
    const focusValue = adventurer.stats[mission.focus] || 0;
    const fitLabel = focusValue >= 8 ? "Strong fit" : focusValue >= 6 ? "Good fit" : "Support";
    const fitTone = focusValue >= 8 ? "strong-fit" : focusValue >= 6 ? "good-fit" : "support-fit";
    const unavailableLabel = getAdventurerStatusLabel(adventurer);
    const actionLabel = selected ? "Selected" : available ? partyFull ? "Party full" : "Add" : unavailableLabel;
    return `
      <button class="quest-party-option ${fitTone} ${selected ? "selected" : ""} ${available ? "available" : "unavailable"}" data-quest-party="${adventurer.id}" type="button" aria-pressed="${selected}" ${disabled ? "disabled" : ""}>
        <span class="quest-party-sprite">${renderSprite(adventurer, "small")}</span>
        <span class="quest-party-copy"><strong>${adventurer.name}</strong><small>${classes[adventurer.classId].label} | Lv ${adventurer.level}</small></span>
        <span class="quest-party-fit"><b>${focusLabel} ${focusValue}</b><small>${available ? fitLabel : actionLabel}</small></span>
        <span class="quest-party-state">${actionLabel}</span>
      </button>
    `;
  }).join("");

  return `
    <section class="quest-party-picker" data-party-picker="${mission.id}" aria-label="Choose a party for ${mission.name}">
      <header>
        <div><span class="mission-kicker">Available adventurers</span><strong>${mission.name}</strong></div>
        <span>${selectedCount}/3 selected</span>
      </header>
      <div class="quest-party-options">
        ${options || `<p class="quest-party-empty">Create your founding adventurer before assembling a party.</p>`}
      </div>
      <footer>
        <span>Quest focus: ${focusLabel}</span>
        <button class="ghost-button" data-clear-quest-party type="button" ${selectedCount ? "" : "disabled"}>Clear</button>
      </footer>
    </section>
  `;
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

function missionButtonDisabled(locked, active, hasParty) {
  if (locked || active || !hasParty) {
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
  const completedDrills = getCompletedTrainingDrills(adventurer);
  const drillCapacity = getStatTrainingCapacity(adventurer);
  if (trainingLevel < 1) {
    return `
      <section class="character-section training-section locked">
        <div class="section-line-heading"><p class="eyebrow">Training</p><span>${learned}/${capacity} techniques</span></div>
        <p class="system-empty">Build the Training Yard during Guildstead's first expansion to improve stats and teach this adventurer new abilities.</p>
      </section>
    `;
  }

  const activeJob = getTrainingJobForAdventurer(adventurer.id);
  if (activeJob) {
    const progress = getTrainingJobProgress(activeJob);
    const daysLeft = Math.max(0, activeJob.readyDay - state.day);
    return `
      <section class="character-section training-section active-job">
        <div class="section-line-heading"><p class="eyebrow">Training In Progress</p><span>Completes day ${activeJob.readyDay}</span></div>
        <div class="profile-training-job">
          <span class="ability-sigil training-pulse" aria-hidden="true">T</span>
          <div><strong>${getTrainingJobName(activeJob)}</strong><small>${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining. This adventurer cannot join expeditions while training.</small></div>
          <b>${progress}%</b>
          <div class="training-progress"><i style="width:${progress}%"></i></div>
        </div>
      </section>
    `;
  }

  const slotsFull = getActiveTrainingJobs().length >= getTrainingSlotCount();
  const drillRows = Object.values(trainingDrills).map((drill) => {
    const full = completedDrills >= drillCapacity;
    const duration = getTrainingDuration(adventurer, "stat", drill.stat);
    const disabled = full || slotsFull || state.gold < drill.cost || adventurer.status !== "idle";
    const buttonText = full
      ? "Drill limit"
      : slotsFull ? "Yard full" : adventurer.status !== "idle" ? "Unavailable" : `${drill.cost}G / ${duration}d`;
    return `
      <div class="training-row stat-drill ${full ? "locked" : ""}">
        <span class="ability-sigil" aria-hidden="true">${drill.mark.slice(0, 1)}</span>
        <div><strong>${drill.name}</strong><small>${drill.description}</small></div>
        <button class="secondary-button" data-start-training="${drill.stat}" data-training-kind="stat" type="button" ${disabled ? "disabled" : ""}>${buttonText}</button>
      </div>
    `;
  }).join("");

  const rows = trainingAbilityIds.map((id) => {
    const ability = abilityCatalog[id];
    const known = adventurer.abilities.includes(id);
    const levelLocked = trainingLevel < ability.trainingLevel;
    const full = learned >= capacity && !known;
    const duration = getTrainingDuration(adventurer, "ability", id);
    const disabled = known || levelLocked || full || slotsFull || state.gold < ability.cost || adventurer.status !== "idle";
    const buttonText = known
      ? "Learned"
      : levelLocked ? `Yard Lv ${ability.trainingLevel}` : full ? "Capacity full" : slotsFull ? "Yard full" : adventurer.status !== "idle" ? "Unavailable" : `${ability.cost}G / ${duration}d`;
    return `
      <div class="training-row ${known ? "known" : ""} ${levelLocked ? "locked" : ""}">
        <span class="ability-sigil" aria-hidden="true">T</span>
        <div><strong>${ability.name}</strong><small>${ability.description}</small></div>
        <button class="secondary-button" data-start-training="${id}" data-training-kind="ability" type="button" ${disabled ? "disabled" : ""}>${buttonText}</button>
      </div>
    `;
  }).join("");

  return `
    <section class="character-section training-section">
      <div class="section-line-heading">
        <p class="eyebrow">Training Yard Lv ${trainingLevel}</p>
        <span>${getActiveTrainingJobs().length}/${getTrainingSlotCount()} slots occupied</span>
      </div>
      <div class="training-subheading"><strong>Stat drills</strong><span>${completedDrills}/${drillCapacity} completed</span></div>
      <div class="training-list stat-training-list">${drillRows}</div>
      <div class="training-subheading"><strong>Taught techniques</strong><span>${learned}/${capacity} learned</span></div>
      <div class="training-list">${rows}</div>
    </section>
  `;
}

function renderSprite(adventurer, extraClass = "") {
  const slot = getSpriteSlot(adventurer);
  const atlasClass = usesGenderedSpriteAtlas(adventurer) ? "hero-atlas" : "";
  return `<span class="unit-sprite slot-${slot} ${atlasClass} ${extraClass}" aria-hidden="true"></span>`;
}

function renderFacilityEmblem(facilityId, extraClass = "") {
  const validId = facilities.some((facility) => facility.id === facilityId) ? facilityId : "tavern";
  return `<span class="facility-emblem emblem-${validId} ${extraClass}" aria-hidden="true"></span>`;
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
  elements.founderPreview.innerHTML = `${renderSprite({ classId, gender, name, founder: true })}<span>${gender === "female" ? "Female" : "Male"} ${classes[classId].label}</span>`;
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
    trainingStats: { str: 0, mag: 0, wit: 0, cha: 0 },
    stats: { ...base }
  };
}

function makeIdentity(name, classId, founder, day, gender = null) {
  const origin = founder
    ? "Answered Mara's call when goblins threatened the Wayfarer's Rest"
    : pick(origins);
  const className = classes[classId].label;
  const firstEntry = founder
    ? `Joined the Wayfarer's Rest as its first ${className}.`
    : `${origin} and joined Guildstead as a ${className}.`;

  return {
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
  const { race: _legacyRace, ...savedAdventurer } = adventurer;
  const normalised = {
    ...savedAdventurer,
    name: adventurer.name || "Adventurer",
    classId,
    gender,
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
    trainingStats: { str: 0, mag: 0, wit: 0, cha: 0, ...(adventurer.trainingStats || {}) },
    traits: { ...identity.traits, ...(adventurer.traits || {}) },
    lifeLog: adventurer.lifeLog?.length ? adventurer.lifeLog : identity.lifeLog,
    stats: { ...classes[classId].stats, ...(adventurer.stats || {}) }
  };
  syncNaturalAbilities(normalised);
  return normalised;
}

function normaliseTrainingJob(job) {
  if (!job || !job.adventurerId || !["stat", "ability"].includes(job.kind)) {
    return null;
  }
  const validTarget = job.kind === "stat" ? trainingDrills[job.targetId] : abilityCatalog[job.targetId]?.source === "training";
  if (!validTarget) {
    return null;
  }
  const startedDay = Math.max(1, Number(job.startedDay) || 1);
  return {
    id: job.id || crypto.randomUUID(),
    adventurerId: job.adventurerId,
    kind: job.kind,
    targetId: job.targetId,
    startedDay,
    readyDay: Math.max(startedDay + 1, Number(job.readyDay) || startedDay + 1),
    cost: Math.max(0, Number(job.cost) || 0)
  };
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

function getRelationshipKey(firstId, secondId) {
  return [firstId, secondId].sort().join("::");
}

function normaliseRelationships(savedRelationships, adventurers) {
  const knownIds = new Set(adventurers.map((adventurer) => adventurer.id));
  const normalised = {};
  Object.entries(savedRelationships || {}).forEach(([key, savedRelationship]) => {
    const [firstId, secondId] = key.split("::");
    if (!firstId || !secondId || firstId === secondId || !knownIds.has(firstId) || !knownIds.has(secondId)) {
      return;
    }
    const relationship = typeof savedRelationship === "number" ? { score: savedRelationship } : savedRelationship || {};
    normalised[getRelationshipKey(firstId, secondId)] = {
      score: Math.max(-10, Math.min(10, Number(relationship.score) || 0)),
      moments: Array.isArray(relationship.moments) ? relationship.moments.slice(0, 8) : []
    };
  });
  return normalised;
}

function normaliseTavernLife(savedTavernLife, adventurers) {
  const knownIds = new Set(adventurers.map((adventurer) => adventurer.id));
  const saved = savedTavernLife || {};
  const active = saved.active
    && tavernLifeEvents[saved.active.templateId]
    && Array.isArray(saved.active.participantIds)
    && saved.active.participantIds.length > 0
    && saved.active.participantIds.every((id) => knownIds.has(id))
      ? {
          id: saved.active.id || `tavern-${crypto.randomUUID()}`,
          templateId: saved.active.templateId,
          participantIds: saved.active.participantIds,
          day: Math.max(1, Number(saved.active.day) || 1)
        }
      : null;
  return {
    active,
    resolved: Array.isArray(saved.resolved) ? saved.resolved.slice(0, 20) : [],
    lastEventDay: Math.max(0, Number(saved.lastEventDay) || 0)
  };
}

function getRelationship(firstId, secondId) {
  if (!firstId || !secondId || firstId === secondId) {
    return { score: 0, moments: [] };
  }
  return state.relationships[getRelationshipKey(firstId, secondId)] || { score: 0, moments: [] };
}

function adjustRelationship(firstId, secondId, amount, moment) {
  if (!firstId || !secondId || firstId === secondId || !amount) {
    return 0;
  }
  const key = getRelationshipKey(firstId, secondId);
  const relationship = state.relationships[key] || { score: 0, moments: [] };
  relationship.score = Math.max(-10, Math.min(10, relationship.score + amount));
  if (moment) {
    relationship.moments.unshift({ day: state.day, text: moment });
    relationship.moments = relationship.moments.slice(0, 8);
  }
  state.relationships[key] = relationship;
  return relationship.score;
}

function getRelationshipTier(score) {
  if (score >= 6) {
    return { label: "Close friends", tone: "close", power: 2 };
  }
  if (score >= 2) {
    return { label: "Friends", tone: "friends", power: 1 };
  }
  if (score <= -6) {
    return { label: "Rivals", tone: "rivals", power: -2 };
  }
  if (score <= -3) {
    return { label: "Tense", tone: "tense", power: -1 };
  }
  return { label: "Acquaintances", tone: "neutral", power: 0 };
}

function getRelationshipPartyPower(party) {
  let power = 0;
  for (let firstIndex = 0; firstIndex < party.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < party.length; secondIndex += 1) {
      power += getRelationshipTier(getRelationship(party[firstIndex].id, party[secondIndex].id).score).power;
    }
  }
  return power;
}

function renderRelationships(adventurer) {
  const bonds = state.adventurers
    .filter((other) => other.id !== adventurer.id)
    .map((other) => ({ other, relationship: state.relationships[getRelationshipKey(adventurer.id, other.id)] }))
    .filter((bond) => bond.relationship)
    .sort((a, b) => Math.abs(b.relationship.score) - Math.abs(a.relationship.score));
  const content = bonds.length
    ? bonds.map(({ other, relationship }) => {
        const tier = getRelationshipTier(relationship.score);
        const position = Math.round(((relationship.score + 10) / 20) * 100);
        const powerText = tier.power ? `${tier.power > 0 ? "+" : ""}${tier.power} party power together` : "No party effect yet";
        return `
          <button class="relationship-row ${tier.tone}" data-view-relationship="${other.id}" type="button">
            <span class="relationship-sprite">${renderSprite(other, "small")}</span>
            <span class="relationship-copy"><strong>${other.name}</strong><small>${tier.label} | ${powerText}</small></span>
            <span class="relationship-score">${relationship.score > 0 ? "+" : ""}${relationship.score}</span>
            <span class="relationship-meter" aria-label="Relationship ${relationship.score} from minus 10 to 10"><i style="left:${position}%"></i></span>
          </button>
        `;
      }).join("")
    : `<p class="relationship-empty">Bonds form through the choices you make during Tavern Life events.</p>`;
  return `
    <section class="character-section relationship-section">
      <div class="section-line-heading">
        <p class="eyebrow">Relationships</p>
        <span>Friendship and rivalry affect party power</span>
      </div>
      <div class="relationship-list">${content}</div>
    </section>
  `;
}

function getTavernLifeStory(active) {
  if (!active) {
    return null;
  }
  const template = tavernLifeEvents[active.templateId];
  const participants = (active.participantIds || []).map(getAdventurer).filter(Boolean);
  return template && participants.length ? { active, template, participants } : null;
}

function formatTavernLifeText(text, participants) {
  const firstName = participants[0]?.name || "Mara";
  const secondName = participants[1]?.name || "Mara";
  return String(text || "").replaceAll("{a}", firstName).replaceAll("{b}", secondName);
}

function getEligibleTavernLifeTemplates(idleHeroes) {
  return Object.entries(tavernLifeEvents).filter(([, template]) => {
    if (idleHeroes.length < template.minHeroes) {
      return false;
    }
    if (template.requiresFacility && (state.facilities[template.requiresFacility] || 0) < 1) {
      return false;
    }
    if (template.anchorClass && !idleHeroes.some((adventurer) => adventurer.classId === template.anchorClass)) {
      return false;
    }
    if (template.anchorQuirk && !idleHeroes.some((adventurer) => Object.values(adventurer.quirks || {}).includes(template.anchorQuirk))) {
      return false;
    }
    return true;
  });
}

function pickTavernLifeParticipants(template, idleHeroes) {
  let anchorPool = idleHeroes;
  if (template.anchorClass) {
    anchorPool = idleHeroes.filter((adventurer) => adventurer.classId === template.anchorClass);
  } else if (template.anchorQuirk) {
    anchorPool = idleHeroes.filter((adventurer) => Object.values(adventurer.quirks || {}).includes(template.anchorQuirk));
  }
  const first = pick(anchorPool);
  const participants = first ? [first] : [];
  if (template.participantCount > 1) {
    const companions = idleHeroes.filter((adventurer) => adventurer.id !== first?.id);
    if (companions.length) {
      participants.push(pick(companions));
    }
  }
  return participants;
}

function createTavernLifeEvent(templateId, participantIds = null, openDialog = true) {
  if (state.tavernLife.active || !tavernLifeEvents[templateId]) {
    return false;
  }
  const template = tavernLifeEvents[templateId];
  const idleHeroes = state.adventurers.filter((adventurer) => adventurer.status === "idle");
  const participants = participantIds
    ? participantIds.map(getAdventurer).filter((adventurer) => adventurer?.status === "idle")
    : pickTavernLifeParticipants(template, idleHeroes);
  if (participants.length < template.minHeroes) {
    return false;
  }
  const active = {
    id: `tavern-${crypto.randomUUID()}`,
    templateId,
    participantIds: participants.map((adventurer) => adventurer.id),
    day: state.day
  };
  state.tavernLife.active = active;
  state.tavernLife.lastEventDay = state.day;
  tavernLifeDialogOpen = Boolean(openDialog && !currentPopupEventId && !currentChapterMomentId);
  addLog(`Tavern Life: ${template.title} begins with ${participants.map((adventurer) => adventurer.name).join(" and ")}.`);
  return active;
}

function maybeCreateTavernEvent(force = false, preferredTemplateId = null) {
  if (state.tavernLife.active || !state.founderCreated) {
    return false;
  }
  const idleHeroes = state.adventurers.filter((adventurer) => adventurer.status === "idle");
  if (!idleHeroes.length) {
    return false;
  }
  const daysSinceLastEvent = state.day - state.tavernLife.lastEventDay;
  const firstStory = state.tavernLife.resolved.length === 0 && state.tavernLife.lastEventDay === 0;
  if (!force && !firstStory && (daysSinceLastEvent < 2 || Math.random() > 0.62)) {
    return false;
  }
  let eligible = getEligibleTavernLifeTemplates(idleHeroes);
  if (idleHeroes.length > 1) {
    const socialEvents = eligible.filter(([, template]) => template.participantCount > 1);
    eligible = socialEvents.length ? socialEvents : eligible;
  }
  const preferred = eligible.find(([id]) => id === preferredTemplateId);
  const selected = preferred || pick(eligible);
  return selected ? createTavernLifeEvent(selected[0]) : false;
}

function resolveTavernLifeChoice(choiceId) {
  const story = getTavernLifeStory(state.tavernLife.active);
  const choice = story?.template.choices.find((item) => item.id === choiceId);
  if (!story || !choice || state.gold < (choice.cost || 0)) {
    return false;
  }
  state.gold -= choice.cost || 0;
  state.gold += choice.gold || 0;
  state.fame += choice.fame || 0;
  story.participants.forEach((adventurer) => {
    if (choice.xp) {
      grantXp(adventurer, choice.xp);
    }
    Object.entries(choice.traits || {}).forEach(([trait, amount]) => {
      adventurer.traits[trait] = Math.max(1, Math.min(5, (adventurer.traits[trait] || 1) + amount));
    });
  });
  if (choice.stat) {
    const target = story.participants[choice.stat.target || 0];
    if (target?.stats[choice.stat.id] !== undefined) {
      target.stats[choice.stat.id] += choice.stat.amount;
    }
  }
  const outcome = formatTavernLifeText(choice.outcome, story.participants);
  if (story.participants.length > 1 && choice.relationship) {
    adjustRelationship(story.participants[0].id, story.participants[1].id, choice.relationship, outcome);
  }
  story.participants.forEach((adventurer) => addLifeEvent(adventurer, outcome));
  state.tavernLife.resolved.unshift({
    id: story.active.id,
    templateId: story.active.templateId,
    participantIds: story.active.participantIds,
    choiceId,
    outcome,
    day: state.day
  });
  state.tavernLife.resolved = state.tavernLife.resolved.slice(0, 20);
  state.tavernLife.active = null;
  tavernLifeDialogOpen = false;
  addLog(outcome);
  render();
  showToast("Tavern story resolved", outcome, choice.relationship < 0 ? "info" : "success");
  return true;
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

function getActiveTrainingJobs() {
  return Array.isArray(state.trainingJobs) ? state.trainingJobs : [];
}

function getTrainingJobForAdventurer(adventurerId) {
  return getActiveTrainingJobs().find((job) => job.adventurerId === adventurerId) || null;
}

function getTrainingSlotCount() {
  return Math.min(3, Math.max(0, state.facilities.trainingYard || 0));
}

function getCompletedTrainingDrills(adventurer) {
  return Object.values(adventurer.trainingStats || {}).reduce((total, value) => total + Math.max(0, Number(value) || 0), 0);
}

function getStatTrainingCapacity(adventurer) {
  return 2 + Math.max(1, adventurer.potential || 1);
}

function getTrainingDuration(adventurer, kind, targetId) {
  const baseDuration = kind === "ability" && (abilityCatalog[targetId]?.trainingLevel || 1) >= 2 ? 2 : 1;
  return adventurer.quirks?.positive === "quickStudy" ? Math.max(1, baseDuration - 1) : baseDuration;
}

function getTrainingJobName(job) {
  if (!job) {
    return "Training";
  }
  return job.kind === "stat" ? trainingDrills[job.targetId]?.name || "Stat drill" : abilityCatalog[job.targetId]?.name || "Technique training";
}

function getTrainingJobProgress(job) {
  const duration = Math.max(1, job.readyDay - job.startedDay);
  return Math.max(0, Math.min(100, Math.round(((state.day - job.startedDay) / duration) * 100)));
}

function getAdventurerStatusLabel(adventurer) {
  if (adventurer.status === "busy") {
    return "On quest";
  }
  if (adventurer.status === "injured") {
    return "Recovering";
  }
  if (adventurer.status === "training") {
    const job = getTrainingJobForAdventurer(adventurer.id);
    return job ? `Training to day ${job.readyDay}` : "In training";
  }
  if (adventurer.status === "candidate") {
    return "Applicant";
  }
  return "Available";
}

function startTraining(adventurerId, kind, targetId) {
  const adventurer = getAdventurer(adventurerId);
  const trainingLevel = state.facilities.trainingYard || 0;
  if (!adventurer || trainingLevel < 1 || adventurer.status !== "idle" || getTrainingJobForAdventurer(adventurerId)) {
    return;
  }
  if (getActiveTrainingJobs().length >= getTrainingSlotCount()) {
    showToast("Training Yard full", "Advance the day or improve the Yard to open another slot.", "danger");
    return;
  }

  let cost = 0;
  if (kind === "ability") {
    const ability = abilityCatalog[targetId];
    if (!ability || ability.source !== "training" || trainingLevel < ability.trainingLevel || adventurer.abilities.includes(targetId)) {
      return;
    }
    if (getTaughtAbilityIds(adventurer).length >= getTrainingCapacity(adventurer)) {
      showToast("Training capacity reached", `${adventurer.name} cannot master another taught ability.`, "danger");
      return;
    }
    cost = ability.cost;
  } else if (kind === "stat") {
    const drill = trainingDrills[targetId];
    if (!drill || getCompletedTrainingDrills(adventurer) >= getStatTrainingCapacity(adventurer)) {
      return;
    }
    cost = drill.cost;
  } else {
    return;
  }

  if (state.gold < cost) {
    return;
  }
  const duration = getTrainingDuration(adventurer, kind, targetId);
  const job = {
    id: crypto.randomUUID(),
    adventurerId,
    kind,
    targetId,
    startedDay: state.day,
    readyDay: state.day + duration,
    cost
  };
  state.gold -= cost;
  state.trainingJobs.push(job);
  state.selectedIds = state.selectedIds.filter((id) => id !== adventurerId);
  adventurer.status = "training";
  addLifeEvent(adventurer, `Began ${getTrainingJobName(job)} in the Training Yard.`);
  addLog(`${adventurer.name} begins ${getTrainingJobName(job)} and will finish on day ${job.readyDay}.`);
  render();
  showToast("Training started", `${adventurer.name} will complete ${getTrainingJobName(job)} on day ${job.readyDay}.`, "info");
}

function processTrainingCompletions(announce = true) {
  const completed = getActiveTrainingJobs().filter((job) => job.readyDay <= state.day);
  if (completed.length === 0) {
    return [];
  }
  completed.forEach((job) => {
    const adventurer = getAdventurer(job.adventurerId);
    if (!adventurer) {
      return;
    }
    if (job.kind === "ability") {
      const ability = abilityCatalog[job.targetId];
      if (ability && !adventurer.abilities.includes(job.targetId)) {
        adventurer.abilities.push(job.targetId);
        addLifeEvent(adventurer, `Mastered ${ability.name} in the Training Yard.`);
      }
    } else {
      const drill = trainingDrills[job.targetId];
      if (drill) {
        adventurer.trainingStats = { str: 0, mag: 0, wit: 0, cha: 0, ...(adventurer.trainingStats || {}) };
        adventurer.stats[drill.stat] += 1;
        adventurer.trainingStats[drill.stat] = (adventurer.trainingStats[drill.stat] || 0) + 1;
        addLifeEvent(adventurer, `Completed ${drill.name} and raised ${drill.mark} to ${adventurer.stats[drill.stat]}.`);
      }
    }
    adventurer.status = "idle";
    addLog(`${adventurer.name} completes ${getTrainingJobName(job)} and returns to guild duty.`);
  });
  const completedIds = new Set(completed.map((job) => job.id));
  state.trainingJobs = getActiveTrainingJobs().filter((job) => !completedIds.has(job.id));
  if (announce) {
    const names = completed.map((job) => getAdventurer(job.adventurerId)?.name).filter(Boolean);
    showToast("Training complete", `${names.join(", ")} ${names.length === 1 ? "is" : "are"} ready for duty.`, "success");
  }
  return completed;
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
  partyPickerMissionId = null;
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
  return Math.floor(statPower / 3 + facilityPower) + getRelationshipPartyPower(party);
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
  if (id === "trainingYard" && built && state.chapter.stage === "expansion") {
    state.chapter.stage = "boss";
    activeView = "adventurers";
    addLog("With the Training Yard complete, Mara marks the Barrow Hill goblin camp on the map.");
    showChapterMoment("trainingYard");
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
  const completedTraining = processTrainingCompletions(false);
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
  const recruitmentArrived = processRecruitmentArrivals();
  const tavernEventCreated = !recruitmentArrived && maybeCreateTavernEvent();
  if (!tavernEventCreated && state.founderCreated && state.facilities.questBoard > 0 && state.day % 3 === 0 && state.eventMissions.length < 2) {
    scoutForEvent(true);
  }
  render();
  if (completedTraining.length > 0) {
    const names = completedTraining.map((job) => getAdventurer(job.adventurerId)?.name).filter(Boolean);
    showToast("Training complete", `${names.join(", ")} ${names.length === 1 ? "is" : "are"} ready for duty.`, "success");
  } else if (tavernEventCreated) {
    showToast("A Tavern story begins", "Something is happening back at the Wayfarer's Rest.", "info");
  }
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
    expansion: { title: "Build the Training Yard", detail: "Spend 95G to prepare your adventurers for the goblin chief.", progress: 78 },
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
  if ((state.facilities[id] || 0) > 0) {
    return true;
  }
  if (id === "tavern") {
    return true;
  }
  if (id === "questBoard") {
    return ["buildBoard", "localRequests", "expansion", "boss", "chartered"].includes(state.chapter.stage);
  }
  if (id === "trainingYard") {
    return state.chapter.completedLocalMissions.length >= 3 || state.chapter.charterEarned;
  }
  if (["dormitory", "kitchen"].includes(id)) {
    return state.chapter.stage === "boss" || state.facilities.trainingYard > 0 || state.chapter.charterEarned;
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
  if (id === "trainingYard") {
    const remaining = Math.max(0, 3 - state.chapter.completedLocalMissions.length);
    return isFacilityUnlocked(id) ? "Mara's Training Yard blueprint is ready to build." : `Complete ${remaining} more local request${remaining === 1 ? "" : "s"}.`;
  }
  if (["dormitory", "kitchen"].includes(id)) {
    return isFacilityUnlocked(id) ? "Blueprint unlocked by the tavern's first expansion." : "Build the Training Yard first.";
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
    if (state.facilities.trainingYard < 1 && state.chapter.stage !== "boss") {
      return "Build the Training Yard first";
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
