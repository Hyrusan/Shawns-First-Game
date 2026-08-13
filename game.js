const STORAGE_KEY = "guildstead-demo-save";
const SAVE_VERSION = 21;
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
  firstBriefing: {
    kind: "briefing",
    eyebrow: "Urgent Tavern Briefing",
    title: "The Road Needs Its First Hero",
    speaker: "Mara",
    role: "Innkeeper, The Wayfarer's Rest",
    portrait: "mara",
    copy: [
      "{hero}, excellent. You look exactly like someone who can retrieve several sacks of onions under hostile conditions.",
      "The Goblin Threat is close at hand. They have taken our supplies, frightened the traders, and left Greenbank Road unguarded. We need your help before the inn's cupboards become impressively empty."
    ],
    callout: {
      label: "First mission",
      title: "Recover the Stolen Supplies",
      detail: "Your hero is already selected. Send them to Greenbank Lane and keep an eye on the expedition while it runs.",
      facts: ["Short expedition", "Guided decision", "Safe first mission"]
    },
    steps: [
      { mark: "1", title: "Choose the job", detail: "The Quest Board holds work available to the guild." },
      { mark: "2", title: "Dispatch your hero", detail: "Pick an available party and send them on their way." },
      { mark: "3", title: "Answer the call", detail: "Some expeditions pause for a Guildmaster decision." }
    ],
    button: "Show Me The Quest",
    view: "quest"
  },
  recruitment: {
    kind: "milestone",
    eyebrow: "Mara's Next Bright Idea",
    title: "Put The Word Out",
    speaker: "Mara",
    role: "Innkeeper, The Wayfarer's Rest",
    portrait: "mara",
    copy: ["One hero recovered the supplies, but Greenbank will need more than one pair of hands.", "I can post a paid notice in the tavern. Cover the travel costs now, wait a day or two, and choose who deserves a place at your table."],
    callout: { label: "New activity", title: "Tavern Recruitment", detail: "Post a 45G notice, wait for applicants to arrive, then choose one adventurer to join." },
    button: "Visit The Tavern",
    view: "adventurers"
  },
  questBoard: {
    kind: "unlock",
    eyebrow: "Chapter One: Goblin Trouble",
    title: "A Noticeboard With Ambition",
    speaker: "Mara",
    role: "Innkeeper, The Wayfarer's Rest",
    portrait: "mara",
    copy: ["The supplies are back and Greenbank is talking about your little band.", "I found an old board in the cellar. Build it properly and the tavern can start accepting local requests instead of waiting for trouble to walk through the door."],
    callout: { label: "Facility unlocked", title: "Quest Board", detail: "Build it for 55G to reveal Greenbank requests and the Barrow Hill campaign." },
    button: "Build the Quest Board",
    view: "facilities"
  },
  expansion: {
    kind: "warning",
    eyebrow: "Guildstead Is Growing",
    title: "Heroes Need Somewhere To Train",
    speaker: "Mara",
    role: "Guild Steward",
    portrait: "mara",
    copy: ["Three local problems are settled, but the goblins are gathering at Barrow Hill.", "Before anyone attempts the chief's camp, we should turn the old yard into a proper training space. Enthusiasm is useful. Practice is usually less painful."],
    callout: { label: "Threat escalation", title: "Barrow Hill Is Stirring", detail: "Build the Training Yard and prepare a party for the chapter finale." },
    button: "Build The Training Yard",
    view: "facilities"
  },
  trainingYard: {
    kind: "unlock",
    eyebrow: "The First Expansion",
    title: "Training Begins At Guildstead",
    speaker: "Mara",
    role: "Guild Steward",
    portrait: "mara",
    copy: ["The new yard is ready. Adventurers can spend a day improving a stat or learn techniques over one or two days.", "They cannot join expeditions while training, so choose the timing carefully. Barrow Hill is not known for waiting politely."],
    callout: { label: "New activity", title: "Adventurer Training", detail: "Improve stats, teach techniques and turn potential into long-term strength." },
    button: "Choose A Trainee",
    view: "adventurers"
  },
  charter: {
    kind: "celebration",
    eyebrow: "Royal Charter Awarded",
    title: "Welcome To Guildstead",
    speaker: "Mara",
    role: "Guild Steward",
    portrait: "mara",
    copy: ["With the Barrow Hill goblins defeated, the Western March finally has a recognised adventurers' guild.", "The Wayfarer's Rest is now Guildstead Hall. We started with an empty cupboard and one brave hero. The next chapter is yours to build."],
    callout: { label: "Chapter complete", title: "Guildstead Is Chartered", detail: "New facilities, contracts and the wider Western March can now open to the guild." },
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

const facilityOrderCatalog = [
  {
    id: "hostTravellers",
    facilityId: "tavern",
    mark: "G",
    title: "Host Travellers",
    description: "Give the best tables to passing merchants and turn hospitality into coin.",
    outcome: "Earns 12G plus 4G per Tavern level tonight.",
    effect: "goldIncome"
  },
  {
    id: "heroesTable",
    facilityId: "tavern",
    mark: "H",
    title: "Heroes' Table",
    description: "Set aside a proper supper so the adventurers can unwind together.",
    outcome: "Available heroes gain experience and friendship.",
    effect: "heroSupper",
    requiresIdle: 1
  },
  {
    id: "gatherRumours",
    facilityId: "questBoard",
    mark: "!",
    title: "Gather Rumours",
    description: "Pay a runner to follow whispers of trouble beyond Greenbank.",
    outcome: "Reveals a new timed realm event tonight.",
    effect: "realmEvent"
  },
  {
    id: "featureContract",
    facilityId: "questBoard",
    mark: "Q",
    title: "Feature A Contract",
    description: "Give the next expedition pride of place on Mara's noticeboard.",
    outcome: "Adds 18G plus 4G per Board level to the next quest reward.",
    effect: "questGold"
  },
  {
    id: "recoveryRound",
    facilityId: "dormitory",
    mark: "+",
    title: "Recovery Round",
    description: "Fresh linens, hot water, and a firm instruction to stay in bed.",
    outcome: "Cuts recovery time for every injured adventurer.",
    effect: "recovery",
    requiresInjured: 1
  },
  {
    id: "sharedQuarters",
    facilityId: "dormitory",
    mark: "2",
    title: "Shared Quarters",
    description: "Pair two available heroes on the evening room rota.",
    outcome: "Builds a stronger bond between two adventurers.",
    effect: "bond",
    requiresIdle: 2
  },
  {
    id: "openPractice",
    facilityId: "trainingYard",
    mark: "X",
    title: "Open Practice",
    description: "Run a lively group drill for everyone currently at the guild.",
    outcome: "Every available hero gains experience tonight.",
    effect: "idleXp",
    requiresIdle: 1
  },
  {
    id: "tacticalBriefing",
    facilityId: "trainingYard",
    mark: "T",
    title: "Tactical Briefing",
    description: "Study routes, monsters, and escape plans before anyone departs.",
    outcome: "Adds power to the next expedition.",
    effect: "questPower"
  },
  {
    id: "packProvisions",
    facilityId: "kitchen",
    mark: "P",
    title: "Pack Provisions",
    description: "Prepare trail food, tonics, and one morale-saving sweet bun.",
    outcome: "Adds a larger power bonus to the next expedition.",
    effect: "provisions"
  },
  {
    id: "heartySupper",
    facilityId: "kitchen",
    mark: "S",
    title: "Hearty Supper",
    description: "Serve a restorative house meal to every adventurer at home.",
    outcome: "Available heroes gain experience and friendship.",
    effect: "heroSupper",
    requiresIdle: 1
  },
  {
    id: "sharpenGear",
    facilityId: "workshop",
    mark: "W",
    title: "Sharpen Gear",
    description: "Inspect weapons, tighten straps, and remove avoidable surprises.",
    outcome: "Adds workshop power to the next expedition.",
    effect: "workshopPower"
  },
  {
    id: "repairKits",
    facilityId: "workshop",
    mark: "+",
    title: "Pack Repair Kits",
    description: "Prepare splints, tools, and emergency supplies for the road.",
    outcome: "Prevents one injury if the next expedition fails.",
    effect: "injuryShield"
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
    storyEncounter: true,
    encounterId: "supplyTrail",
    guaranteedSuccess: true,
    marker: { left: "56%", top: "47%" }
  },
  {
    id: "greenbankCart",
    name: "Guard the Greenbank Cart",
    location: "Greenbank Road",
    description: "Escort a flour cart through the stretch of road the goblins have been watching.",
    difficulty: 38,
    duration: 36,
    gold: 72,
    fame: 6,
    unlockFame: 0,
    focus: "str",
    localRequest: true,
    storyEncounter: true,
    encounterId: "cartCrossroads",
    marker: { left: "63%", top: "56%" }
  },
  {
    id: "lostWoodcutter",
    name: "Find the Lost Woodcutter",
    location: "Mushroomwood Edge",
    description: "Search the woodland paths before nightfall and keep an eye out for goblin snares.",
    difficulty: 44,
    duration: 42,
    gold: 80,
    fame: 7,
    unlockFame: 0,
    focus: "wit",
    localRequest: true,
    storyEncounter: true,
    encounterId: "woodcutterCamp",
    marker: { left: "69%", top: "36%" }
  },
  {
    id: "mooncapRemedy",
    name: "Gather Mooncap Remedy",
    location: "Mara's Herb Path",
    description: "Collect mooncap mushrooms for the village healer without disturbing the local nest.",
    difficulty: 50,
    duration: 48,
    gold: 92,
    fame: 8,
    unlockFame: 0,
    focus: "mag",
    localRequest: true,
    storyEncounter: true,
    encounterId: "mooncapNest",
    marker: { left: "76%", top: "44%" }
  },
  {
    id: "barrowHill",
    name: "Defeat the Barrow Hill Chief",
    location: "Barrow Hill",
    description: "Break the goblin camp, recover the stolen trade goods, and make Greenbank Road safe again.",
    difficulty: 78,
    duration: 60,
    gold: 240,
    fame: 30,
    unlockFame: 0,
    focus: "str",
    chapterBoss: true,
    storyEncounter: true,
    encounterId: "barrowAssault",
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
    difficulty: 46,
    duration: 45,
    gold: 95,
    fame: 18,
    focus: "mag",
    expiresIn: 4,
    marker: { left: "72%", top: "34%" }
  },
  {
    templateId: "bridge-bells",
    name: "Bridge Bell Rescue",
    location: "Saffron Bridge",
    description: "The bridge bells are ringing without a keeper. Travellers are stuck on the crossing and need a calm escort home.",
    difficulty: 54,
    duration: 50,
    gold: 112,
    fame: 20,
    focus: "cha",
    expiresIn: 3,
    marker: { left: "66%", top: "71%" }
  },
  {
    templateId: "abbey-stores",
    name: "Abbey Storehouse Audit",
    location: "West Abbey",
    description: "A shipment for the holy kitchens has vanished from the ledgers. The abbey wants sharp eyes and quiet questions.",
    difficulty: 62,
    duration: 65,
    gold: 130,
    fame: 24,
    focus: "wit",
    expiresIn: 5,
    marker: { left: "84%", top: "50%" }
  }
];

const greenbankRequestDeck = [
  {
    templateId: "millersFlour",
    name: "Guard The Miller's Flour",
    location: "Greenbank Mill Road",
    description: "Miller Tamsin needs her flour cart escorted past a stretch of road where goblin scouts have been seen.",
    difficulty: 30,
    duration: 34,
    gold: 42,
    fame: 3,
    focus: "str",
    expiresIn: 2,
    materials: { timber: 2 },
    success: { threat: -5, confidence: 3 },
    failure: { threat: 4, confidence: -2 },
    headline: "Flour cart reaches Greenbank safely",
    missedHeadline: "Mill shelves thin after another missing cart",
    marker: { left: "61%", top: "59%" }
  },
  {
    templateId: "moonleafGathering",
    name: "Gather Moonleaf Sprigs",
    location: "Mara's Herb Path",
    description: "The village healer is short of moonleaf and needs careful hands near the old badger paths.",
    difficulty: 32,
    duration: 38,
    gold: 38,
    fame: 3,
    focus: "mag",
    expiresIn: 3,
    materials: { herbs: 3 },
    success: { threat: -2, confidence: 4 },
    failure: { threat: 2, confidence: -3 },
    headline: "Healer's shelves fill with fresh moonleaf",
    missedHeadline: "Healer asks families to ration remedies",
    marker: { left: "75%", top: "45%" }
  },
  {
    templateId: "mineTools",
    name: "Recover The Mine Tools",
    location: "Old Chalk Quarry",
    description: "A quarry crew fled from goblin signs and left a valuable crate of tools behind.",
    difficulty: 37,
    duration: 44,
    gold: 50,
    fame: 4,
    focus: "wit",
    expiresIn: 3,
    materials: { iron: 3 },
    success: { threat: -6, confidence: 2 },
    failure: { threat: 5, confidence: -2 },
    headline: "Quarry bell rings again after tool recovery",
    missedHeadline: "Old quarry closes as goblin signs multiply",
    marker: { left: "79%", top: "63%" }
  },
  {
    templateId: "missingGoats",
    name: "Find Bramble Farm's Goats",
    location: "Bramble Farm",
    description: "Three goats have escaped through a broken fence. Their owner insists one of them is a tactical genius.",
    difficulty: 28,
    duration: 32,
    gold: 34,
    fame: 3,
    focus: "cha",
    expiresIn: 2,
    materials: { timber: 1, herbs: 1 },
    success: { threat: -1, confidence: 5 },
    failure: { threat: 1, confidence: -3 },
    headline: "Bramble Farm celebrates return of all three goats",
    missedHeadline: "Goat tracks vanish towards Mushroomwood",
    marker: { left: "54%", top: "68%" }
  },
  {
    templateId: "bridgeRepairs",
    name: "Secure Saffron Footbridge",
    location: "Saffron Brook",
    description: "The spring current has loosened the bridge supports while goblins watch from the opposite bank.",
    difficulty: 39,
    duration: 46,
    gold: 56,
    fame: 5,
    focus: "str",
    expiresIn: 3,
    materials: { timber: 3, iron: 1 },
    success: { threat: -5, confidence: 4 },
    failure: { threat: 3, confidence: -4 },
    headline: "Saffron Footbridge reopens before market day",
    missedHeadline: "Broken bridge forces traders onto the north road",
    marker: { left: "67%", top: "72%" }
  },
  {
    templateId: "lanternPatrol",
    name: "Light The Road Lanterns",
    location: "Greenbank Road",
    description: "The road lamps have gone dark one by one. Relighting them may reveal who keeps putting them out.",
    difficulty: 35,
    duration: 40,
    gold: 46,
    fame: 4,
    focus: "mag",
    expiresIn: 2,
    materials: { herbs: 2, iron: 1 },
    success: { threat: -7, confidence: 3 },
    failure: { threat: 6, confidence: -2 },
    headline: "Greenbank Road glows safely through the night",
    missedHeadline: "Travellers avoid the unlit Greenbank Road",
    marker: { left: "64%", top: "52%" }
  },
  {
    templateId: "merchantLetters",
    name: "Deliver The Merchant Letters",
    location: "West Abbey Track",
    description: "Trade letters need to reach the abbey before rumours of the goblin trouble become worse than the truth.",
    difficulty: 36,
    duration: 42,
    gold: 54,
    fame: 4,
    focus: "cha",
    expiresIn: 3,
    materials: { timber: 1, iron: 1, herbs: 1 },
    success: { threat: -2, confidence: 6 },
    failure: { threat: 2, confidence: -5 },
    headline: "Abbey merchants keep Greenbank on their route",
    missedHeadline: "Trade letters fail to reach West Abbey",
    marker: { left: "83%", top: "50%" }
  },
  {
    templateId: "goblinLookout",
    name: "Clear The Goblin Lookout",
    location: "Barrow Hill Foothills",
    description: "Smoke above the foothills suggests a lookout is tracking every cart entering Greenbank.",
    difficulty: 44,
    duration: 52,
    gold: 68,
    fame: 6,
    focus: "wit",
    expiresIn: 2,
    materials: { iron: 2, timber: 2 },
    success: { threat: -10, confidence: 3 },
    failure: { threat: 8, confidence: -3 },
    headline: "Goblin lookout cleared from Barrow foothills",
    missedHeadline: "Watchfires spread across the Barrow foothills",
    marker: { left: "84%", top: "27%" }
  }
];

const materialCatalog = {
  timber: { name: "Timber", mark: "T", description: "Sound boards and beams for rooms, repairs, and practical gear." },
  iron: { name: "Iron", mark: "I", description: "Useful metal recovered through local work and quarry contracts." },
  herbs: { name: "Herbs", mark: "H", description: "Medicinal and magical plants gathered around Greenbank." }
};

const equipmentCatalog = {
  ironEdge: {
    name: "Iron Edge",
    mark: "IE",
    description: "+2 power on every quest.",
    cost: { iron: 3, timber: 1 },
    effect: { power: 2 }
  },
  trailKit: {
    name: "Trail Kit",
    mark: "TK",
    description: "Reduces journey time by 6%.",
    cost: { timber: 2, herbs: 1 },
    effect: { durationRate: 0.94 }
  },
  wardedCharm: {
    name: "Warded Charm",
    mark: "WC",
    description: "+3 power on MAG quests.",
    cost: { iron: 1, herbs: 3 },
    effect: { focus: "mag", focusPower: 3 }
  },
  merchantsBrooch: {
    name: "Merchant's Brooch",
    mark: "MB",
    description: "Adds 8% to quest gold rewards.",
    cost: { iron: 2, herbs: 2 },
    effect: { goldRate: 0.08 }
  }
};

const rankChoiceCatalog = {
  D: [
    { id: "merchantWelcome", name: "Merchant Welcome", description: "Invite traders to celebrate the guild's promotion.", reward: "+55G", effect: { gold: 55 } },
    { id: "buildersGift", name: "Builder's Gift", description: "Ask Greenbank's craftspeople for practical supplies.", reward: "+3 timber and +2 iron", effect: { materials: { timber: 3, iron: 2 } } },
    { id: "fieldCommission", name: "Field Commission", description: "Fund one exceptionally thorough expedition plan.", reward: "+8 next-quest power", effect: { questPower: 8 } }
  ],
  C: [
    { id: "regionalFeast", name: "Regional Feast", description: "Turn the promotion into a night Greenbank remembers.", reward: "+70G and +5 confidence", effect: { gold: 70, confidence: 5 } },
    { id: "quartermasterGrant", name: "Quartermaster Grant", description: "Stock the guild for its next stage of growth.", reward: "+4 of every material", effect: { materials: { timber: 4, iron: 4, herbs: 4 } } },
    { id: "royalRecommendation", name: "Royal Recommendation", description: "Display the recommendation where every client can see it.", reward: "+8 fame", effect: { fame: 8 } }
  ],
  B: [
    { id: "guildEndowment", name: "Guild Endowment", description: "Accept a permanent fund for Guildstead's future.", reward: "+120G", effect: { gold: 120 } },
    { id: "masterworkStores", name: "Masterwork Stores", description: "Take payment in rare building and crafting stock.", reward: "+7 of every material", effect: { materials: { timber: 7, iron: 7, herbs: 7 } } },
    { id: "peoplesBanner", name: "The People's Banner", description: "Dedicate the promotion to the villages that built the guild.", reward: "+10 confidence and -10 threat", effect: { confidence: 10, threat: -10 } }
  ]
};

const seasonFocusCatalog = {
  protectGreenbank: {
    name: "Protect Greenbank",
    mark: "P",
    description: "Organise village watches and reinforce the roads.",
    benefit: "Goblin threat grows 1 point more slowly each day."
  },
  growGuild: {
    name: "Grow The Guild",
    mark: "R",
    description: "Put Mara's best notices on every road into Greenbank.",
    benefit: "Recruitment costs 10G less and applicants gain 1 potential."
  },
  prosperTogether: {
    name: "Prosper Together",
    mark: "G",
    description: "Strengthen trade between the tavern and nearby villages.",
    benefit: "+8% quest gold and +3G daily income."
  },
  trainRoster: {
    name: "Train The Roster",
    mark: "T",
    description: "Make this a season of practice, study, and fieldcraft.",
    benefit: "Training costs 20% less and adventurers earn 10% more experience."
  }
};

const lootCatalog = {
  goblinToken: { name: "Goblin Token", mark: "GT", description: "Proof that Guildstead has made Greenbank Road safer." },
  oldRoadMap: { name: "Old Road Map", mark: "RM", description: "A weathered map with useful paths marked in charcoal." },
  healingHerbs: { name: "Healing Herbs", mark: "HH", description: "A field kit of clean bandages and bitter-smelling herbs." },
  silverCharm: { name: "Silver Charm", mark: "SC", description: "A small relic recovered from an old roadside cache." }
};

const encounterDeck = {
  supplyTrail: {
    id: "supplyTrail",
    title: "The Tracks Split At Saffron Brook",
    enemyName: "Goblin Runners",
    description: "The stolen sacks are close, but a captive carter calls from the reeds while goblin runners flee towards Barrow Hill. There is only time to set one priority.",
    dangerous: false,
    storyChoices: [
      {
        id: "secureProvisions",
        badge: "Protect the tavern",
        label: "Secure the provisions",
        detail: "Recover every sack before the goblins can scatter them through the marsh.",
        result: "{hero} secures the stolen provisions and marks the tavern as a place Greenbank can rely upon.",
        powerBonus: 3,
        enemyDamage: 16,
        goldBonus: 12,
        world: { support: 1, confidence: 2 },
        consequence: "+1 Village Support, +2 confidence, +12G"
      },
      {
        id: "shadowRunners",
        badge: "Gather intelligence",
        label: "Shadow the runners",
        detail: "Leave the heaviest sacks and follow the retreating goblins towards their hidden trail.",
        result: "{hero} follows the runners far enough to sketch the first reliable route towards Barrow Hill.",
        powerBonus: 8,
        enemyDamage: 30,
        lootId: "oldRoadMap",
        world: { intel: 1, threat: 2 },
        consequence: "+1 Goblin Intel, +2 threat"
      },
      {
        id: "freeCarter",
        badge: "Save a traveller",
        label: "Free the captive carter",
        detail: "Break formation to pull the merchant from a goblin snare before it tightens.",
        result: "{hero} frees the carter under fire, giving Greenbank its first story about a true local hero.",
        powerBonus: 4,
        enemyDamage: 20,
        fameBonus: 2,
        injuryShield: 1,
        world: { support: 1, confidence: 4 },
        consequence: "+1 Village Support, +4 confidence, +2 fame"
      }
    ]
  },
  cartCrossroads: {
    id: "cartCrossroads",
    title: "A Barricade At Millstone Cross",
    enemyName: "Goblin Toll Gang",
    description: "A goblin toll gang blocks the flour cart while scouts watch from both hedgerows. Saving the cargo, breaking the gang, and learning who commands them cannot all be done at once.",
    dangerous: true,
    storyChoices: [
      {
        id: "shieldTheVillagers",
        badge: "Protect Greenbank",
        label: "Shield the villagers",
        detail: "Keep the escort tight and walk every frightened traveller through the barricade.",
        result: "{hero} holds the road until the final villager and flour sack are safely through.",
        powerBonus: 5,
        enemyDamage: 22,
        injuryShield: 1,
        world: { support: 1, confidence: 3 },
        consequence: "+1 Village Support, +3 confidence, injury protection"
      },
      {
        id: "springChalkTrap",
        badge: "Break their patrol",
        label: "Spring a chalk-pit trap",
        detail: "Abandon the road briefly and lure the goblin scouts into the old quarry cut.",
        result: "{hero} turns the ambush around and captures a patrol map bearing the chief's mark.",
        powerBonus: 9,
        enemyDamage: 34,
        world: { intel: 1, threat: -2 },
        consequence: "+1 Goblin Intel, -2 threat, stronger attack"
      },
      {
        id: "saveTheFlour",
        badge: "Secure the reward",
        label: "Rush the flour to safety",
        detail: "Use the cart as cover and push straight through before the goblins regroup.",
        result: "{hero} gets the valuable cargo through intact, though the scouts escape into the hills.",
        powerBonus: 3,
        enemyDamage: 15,
        goldBonus: 18,
        world: { threat: 2, confidence: 1 },
        consequence: "+18G, +1 confidence, +2 threat"
      }
    ]
  },
  woodcutterCamp: {
    id: "woodcutterCamp",
    title: "Prisoners Beneath The Old Oak",
    enemyName: "Mushroomwood Trappers",
    description: "The missing woodcutter is alive beside two other prisoners. A scarred goblin scout is preparing to leave with orders from Barrow Hill.",
    dangerous: true,
    storyChoices: [
      {
        id: "freeEveryPrisoner",
        badge: "No one left behind",
        label: "Free every prisoner",
        detail: "Attack now and carry the injured home before the camp can raise an alarm.",
        result: "{hero} breaks the cages and brings every missing villager back through Mushroomwood.",
        powerBonus: 6,
        enemyDamage: 28,
        fameBonus: 1,
        world: { support: 1, confidence: 4 },
        consequence: "+1 Village Support, +4 confidence, +1 fame"
      },
      {
        id: "followScarredScout",
        badge: "Risk the rescue",
        label: "Follow the scarred scout",
        detail: "Wait for the messenger to leave, then follow them towards the chief's unguarded route.",
        result: "{hero} risks a slower rescue to uncover the chief's supply trail and night watch pattern.",
        powerBonus: 8,
        enemyDamage: 31,
        xpBonus: 3,
        world: { intel: 2, threat: 3 },
        consequence: "+2 Goblin Intel, +3 threat, +3 XP"
      },
      {
        id: "hearNibOut",
        badge: "Unlikely bargain",
        label: "Hear the young goblin out",
        detail: "A terrified lookout offers the camp key and a route map in exchange for safe passage.",
        result: "{hero} accepts Nib's bargain, frees the prisoners quietly, and learns where the chief posts his guards.",
        powerBonus: 5,
        enemyDamage: 20,
        fameBonus: 1,
        lootId: "oldRoadMap",
        world: { intel: 1, threat: -3 },
        consequence: "+1 Goblin Intel, -3 threat"
      }
    ]
  },
  mooncapNest: {
    id: "mooncapNest",
    title: "Mooncaps In The Warrens",
    enemyName: "Spore Warden",
    description: "The remedy grows beside a warm tunnel used by the Barrow Hill clan. Smoke from deeper within suggests the goblins are preparing for a larger raid.",
    dangerous: false,
    storyChoices: [
      {
        id: "gatherForHealer",
        badge: "Medicine first",
        label: "Gather the healer's remedy",
        detail: "Take only the ripe mooncaps and leave before the warrens are disturbed.",
        result: "{hero} returns with a clean harvest and enough remedy for every Greenbank household.",
        powerBonus: 3,
        enemyDamage: 14,
        lootId: "healingHerbs",
        world: { support: 1, confidence: 4 },
        consequence: "+1 Village Support, +4 confidence"
      },
      {
        id: "studyWarPaint",
        badge: "Read the signs",
        label: "Study the war paint",
        detail: "Remain inside the warrens long enough to decode the painted route markers.",
        result: "{hero} copies the clan markings and identifies which Barrow Hill paths carry reinforcements.",
        powerBonus: 7,
        enemyDamage: 27,
        xpBonus: 4,
        world: { intel: 1, threat: 1 },
        consequence: "+1 Goblin Intel, +1 threat, +4 XP"
      },
      {
        id: "collapseRaidTunnel",
        badge: "Strike early",
        label: "Collapse the raid tunnel",
        detail: "Use the volatile spores to destroy a route aimed directly at Greenbank.",
        result: "{hero} brings the tunnel down before the raiding band can use it, scattering the warren guard.",
        powerBonus: 10,
        enemyDamage: 38,
        world: { threat: -5, confidence: 1 },
        consequence: "-5 threat, +1 confidence, strongest attack"
      }
    ]
  },
  barrowAssault: {
    id: "barrowAssault",
    title: "How Will Guildstead Take Barrow Hill?",
    enemyName: "Barrow Hill Chief",
    description: "The chief's war horn sounds above the stockade. Every choice made on Greenbank Road has led to this final order.",
    dangerous: true,
    storyChoices: [
      {
        id: "challengeChief",
        badge: "Always available",
        label: "Challenge the chief",
        detail: "Take the main road, break the gate, and settle the matter face to face.",
        result: "{hero} answers the war horn openly and leads Guildstead straight through the stockade gate.",
        powerBonus: 10,
        enemyDamage: 40,
        fameBonus: 2,
        consequence: "+10 mission power, +2 fame"
      },
      {
        id: "takeHiddenApproach",
        badge: "Requires 2 Intel",
        label: "Use the hidden approach",
        detail: "Follow the routes learned from goblin patrols and enter above the chief's camp.",
        result: "{hero} uses Guildstead's hard-won intelligence to strike from the ridge before the chief can rally his guard.",
        requiresChapter: { intel: 2 },
        powerBonus: 16,
        enemyDamage: 49,
        xpBonus: 4,
        injuryShield: 1,
        consequence: "+16 mission power, +4 XP, injury protection"
      },
      {
        id: "soundGreenbankHorn",
        badge: "Requires 2 Support",
        label: "Sound Greenbank's horn",
        detail: "Call on the carters, hunters, and villagers who promised to stand behind the guild.",
        result: "{hero} sounds Greenbank's horn and the whole valley answers, surrounding the stockade with lanterns.",
        requiresChapter: { support: 2 },
        powerBonus: 13,
        enemyDamage: 44,
        fameBonus: 5,
        injuryShield: 1,
        consequence: "+13 mission power, +5 fame, injury protection"
      },
      {
        id: "coordinatedStrike",
        badge: "Requires 3 Intel + 3 Support",
        label: "Launch the coordinated strike",
        detail: "Use every mapped path and every willing Greenbank hand to isolate the chief without a long siege.",
        result: "{hero} combines Guildstead's intelligence with Greenbank's support and dismantles the chief's defences in one precise assault.",
        requiresChapter: { intel: 3, support: 3 },
        powerBonus: 20,
        enemyDamage: 58,
        goldBonus: 25,
        fameBonus: 6,
        xpBonus: 5,
        injuryShield: 1,
        consequence: "+20 mission power, +25G, +6 fame"
      }
    ]
  },
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
let morningReportDialogOpen = false;
let activeChronicleReport = null;
let activeExpeditionReportId = null;
let renderedExpeditionReportId = null;
const state = loadState();
currentChapterMomentId = chapterMoments[state.storyEvents.pending] ? state.storyEvents.pending : null;

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
  greenbankNewsPanel: document.querySelector("#greenbankNewsPanel"),
  greenbankNewsArchive: document.querySelector("#greenbankNewsArchive"),
  chronicleArchive: document.querySelector("#chronicleArchive"),
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
  guildActionBar: document.querySelector("#guildActionBar"),
  eventMissionList: document.querySelector("#eventMissionList"),
  scoutEvent: document.querySelector("#scoutEventButton"),
  musicToggle: document.querySelector("#musicToggleButton"),
  mapTheme: document.querySelector("#mapTheme"),
  dockButtons: document.querySelectorAll("[data-view]"),
  viewPanels: document.querySelectorAll("[data-panel]"),
  activeViewEyebrow: document.querySelector("#activeViewEyebrow"),
  activeViewTitle: document.querySelector("#activeViewTitle"),
  expeditionWatch: document.querySelector("#expeditionWatch"),
  expeditionReturnTray: document.querySelector("#expeditionReturnTray"),
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
  chapterDialogPanel: document.querySelector("#chapterDialogPanel"),
  chapterDialogArt: document.querySelector("#chapterDialogArt"),
  chapterDialogKind: document.querySelector("#chapterDialogKind"),
  chapterDialogEyebrow: document.querySelector("#chapterDialogEyebrow"),
  chapterDialogTitle: document.querySelector("#chapterDialogTitle"),
  chapterDialogSpeaker: document.querySelector("#chapterDialogSpeaker"),
  chapterDialogRole: document.querySelector("#chapterDialogRole"),
  chapterDialogText: document.querySelector("#chapterDialogText"),
  chapterDialogCallout: document.querySelector("#chapterDialogCallout"),
  chapterDialogSteps: document.querySelector("#chapterDialogSteps"),
  chapterDialogButton: document.querySelector("#chapterDialogButton"),
  tavernLifeDialog: document.querySelector("#tavernLifeDialog"),
  tavernLifeArt: document.querySelector("#tavernLifeArt"),
  tavernLifeEyebrow: document.querySelector("#tavernLifeEyebrow"),
  tavernLifeTitle: document.querySelector("#tavernLifeTitle"),
  tavernLifeText: document.querySelector("#tavernLifeText"),
  tavernLifeChoices: document.querySelector("#tavernLifeChoices"),
  closeTavernLife: document.querySelector("#closeTavernLifeButton"),
  morningReportDialog: document.querySelector("#morningReportDialog"),
  morningReportEyebrow: document.querySelector("#morningReportEyebrow"),
  morningReportTitle: document.querySelector("#morningReportTitle"),
  morningReportDate: document.querySelector("#morningReportDate"),
  morningReportBody: document.querySelector("#morningReportBody"),
  closeMorningReport: document.querySelector("#closeMorningReportButton"),
  expeditionReportDialog: document.querySelector("#expeditionReportDialog"),
  expeditionReportSheet: document.querySelector("#expeditionReportSheet"),
  expeditionReportEyebrow: document.querySelector("#expeditionReportEyebrow"),
  expeditionReportTitle: document.querySelector("#expeditionReportTitle"),
  expeditionReportDate: document.querySelector("#expeditionReportDate"),
  expeditionReportBody: document.querySelector("#expeditionReportBody"),
  closeExpeditionReport: document.querySelector("#closeExpeditionReportButton"),
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
  scoutForEvent(true, true);
  render();
});
elements.musicToggle.addEventListener("click", toggleMapMusic);
elements.mapFocus.addEventListener("click", toggleMapFocus);
elements.closeEvent.addEventListener("click", closeEventDialog);
elements.viewEvent.addEventListener("click", viewPopupEvent);
elements.chapterDialogButton.addEventListener("click", closeChapterMoment);
elements.closeTavernLife.addEventListener("click", closeTavernLifeEvent);
elements.closeMorningReport.addEventListener("click", closeMorningReport);
elements.closeExpeditionReport.addEventListener("click", closeExpeditionReport);
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
  const fresh = {
    version: SAVE_VERSION,
    screen: "title",
    introStep: 0,
    day: 1,
    gold: 80,
    fame: 0,
    adventurers: [],
    selectedIds: [],
    activeMissions: [],
    expeditionReports: { entries: [], unreadIds: [] },
    trainingJobs: [],
    relationships: {},
    tavernLife: {
      active: null,
      resolved: [],
      lastEventDay: 0
    },
    guildActions: {
      day: 1,
      spent: 0,
      orders: []
    },
    guildPreparations: {
      nextQuestPower: 0,
      nextQuestGoldBonus: 0,
      nextQuestInjuryShield: 0
    },
    greenbank: {
      threat: 24,
      confidence: 42,
      requests: [],
      news: [
        { id: "opening-news", day: 1, tone: "local", headline: "Quiet morning expected at the Wayfarer's Rest", body: "Mara has put fresh soup on and remains cautiously optimistic about the chairs." }
      ],
      lastRequestDay: 0,
      completedRequests: 0,
      missedRequests: 0,
      lastReport: null
    },
    materials: { timber: 0, iron: 0, herbs: 0 },
    equipment: { items: [] },
    rankRewards: { claimed: [], pending: null },
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
      completedStoryMissions: [],
      goblinIntel: 0,
      villageSupport: 0,
      goblinDecisions: [],
      charterEarned: false
    },
    storyEvents: {
      pending: null,
      seen: []
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
  fresh.chronicle = createChronicleState(fresh);
  return fresh;
}

function loadState() {
  const fresh = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object" || ![4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, SAVE_VERSION].includes(saved.version)) {
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
          completedStoryMissions: ["stolenSupplies", "greenbankCart", "lostWoodcutter", "mooncapRemedy", "barrowHill"],
          goblinIntel: 3,
          villageSupport: 3,
          goblinDecisions: [],
          charterEarned: true
        } : fresh.chapter
      : saved.chapter || fresh.chapter;
    const loaded = {
      ...fresh,
      ...saved,
      version: SAVE_VERSION,
      screen: saved.screen || (saved.founderCreated ? "game" : "title"),
      facilities: migratedFacilities,
      chapter: normaliseChapter(migratedChapter, fresh.chapter),
      storyEvents: normaliseStoryEvents(saved.storyEvents),
      expeditionReports: normaliseExpeditionReports(saved.expeditionReports),
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
    loaded.guildActions = normaliseGuildActions(saved.guildActions, loaded.day);
    loaded.guildPreparations = normaliseGuildPreparations(saved.guildPreparations);
    loaded.greenbank = normaliseGreenbank(saved.greenbank, loaded.day);
    loaded.materials = normaliseMaterials(saved.materials);
    loaded.equipment = normaliseEquipment(saved.equipment, loaded.adventurers);
    loaded.rankRewards = normaliseRankRewards(saved.rankRewards, loaded.fame);
    loaded.chronicle = normaliseChronicle(saved.chronicle, loaded);
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

function normaliseGuildActions(savedActions, day) {
  const sameDay = Number(savedActions?.day) === Number(day);
  const validOrders = sameDay && Array.isArray(savedActions?.orders)
    ? savedActions.orders.filter((queuedOrder, index, orders) => {
        const order = facilityOrderCatalog.find((item) => item.id === queuedOrder?.orderId);
        return order && orders.findIndex((item) => item?.facilityId === queuedOrder.facilityId) === index;
      })
    : [];
  return {
    day,
    spent: sameDay ? Math.max(0, Number(savedActions.spent) || 0) : 0,
    orders: validOrders
  };
}

function normaliseGuildPreparations(savedPreparations) {
  return {
    nextQuestPower: Math.min(24, Math.max(0, Number(savedPreparations?.nextQuestPower) || 0)),
    nextQuestGoldBonus: Math.min(80, Math.max(0, Number(savedPreparations?.nextQuestGoldBonus) || 0)),
    nextQuestInjuryShield: Math.min(1, Math.max(0, Number(savedPreparations?.nextQuestInjuryShield) || 0))
  };
}

function normaliseChapter(savedChapter, fallbackChapter) {
  const storyMissionIds = new Set(missionDeck.filter((mission) => mission.storyEncounter).map((mission) => mission.id));
  const completedLocalMissions = Array.isArray(savedChapter?.completedLocalMissions)
    ? [...new Set(savedChapter.completedLocalMissions.filter((id) => missionDeck.some((mission) => mission.id === id && mission.localRequest)))]
    : [];
  const completedStoryMissions = Array.isArray(savedChapter?.completedStoryMissions)
    ? [...new Set(savedChapter.completedStoryMissions.filter((id) => storyMissionIds.has(id)))]
    : [...completedLocalMissions];
  if (!["tavern", "hero", "firstQuest"].includes(savedChapter?.stage) && !completedStoryMissions.includes("stolenSupplies")) {
    completedStoryMissions.push("stolenSupplies");
  }
  if (savedChapter?.charterEarned) {
    storyMissionIds.forEach((id) => {
      if (!completedStoryMissions.includes(id)) {
        completedStoryMissions.push(id);
      }
    });
  }
  const seenMissions = new Set();
  const goblinDecisions = Array.isArray(savedChapter?.goblinDecisions)
    ? savedChapter.goblinDecisions.filter((decision) => {
        if (!decision?.missionId || !decision?.choiceId || !storyMissionIds.has(decision.missionId) || seenMissions.has(decision.missionId)) {
          return false;
        }
        seenMissions.add(decision.missionId);
        return true;
      }).slice(0, 5)
    : [];
  return {
    ...fallbackChapter,
    ...(savedChapter || {}),
    completedLocalMissions,
    completedStoryMissions,
    goblinIntel: Math.min(4, Math.max(0, Math.floor(Number(savedChapter?.goblinIntel) || 0))),
    villageSupport: Math.min(4, Math.max(0, Math.floor(Number(savedChapter?.villageSupport) || 0))),
    goblinDecisions
  };
}

function normaliseStoryEvents(savedEvents) {
  const seen = Array.isArray(savedEvents?.seen)
    ? [...new Set(savedEvents.seen.filter((id) => chapterMoments[id]))].slice(-30)
    : [];
  const pending = chapterMoments[savedEvents?.pending] && !seen.includes(savedEvents.pending)
    ? savedEvents.pending
    : null;
  return { pending, seen };
}

function normaliseExpeditionReports(savedReports) {
  const entries = Array.isArray(savedReports?.entries)
    ? savedReports.entries.filter((report) => report?.id && report?.mission?.name).slice(0, 40).map((report) => ({
        ...report,
        day: Math.max(1, Number(report.day) || 1),
        success: Boolean(report.success),
        rewards: {
          gold: Math.max(0, Number(report.rewards?.gold) || 0),
          fame: Math.max(0, Number(report.rewards?.fame) || 0),
          materials: normaliseMaterials(report.rewards?.materials),
          lootId: lootCatalog[report.rewards?.lootId] ? report.rewards.lootId : ""
        },
        village: {
          threatDelta: Number(report.village?.threatDelta) || 0,
          confidenceDelta: Number(report.village?.confidenceDelta) || 0,
          threatAfter: Math.max(0, Math.min(100, Number(report.village?.threatAfter) || 0)),
          confidenceAfter: Math.max(0, Math.min(100, Number(report.village?.confidenceAfter) || 0))
        },
        heroes: Array.isArray(report.heroes) ? report.heroes.filter((hero) => hero?.id && hero?.name).slice(0, 3) : []
      }))
    : [];
  const validIds = new Set(entries.map((report) => report.id));
  const unreadIds = Array.isArray(savedReports?.unreadIds)
    ? [...new Set(savedReports.unreadIds.filter((id) => validIds.has(id)))].slice(0, 40)
    : [];
  return { entries, unreadIds };
}

function normaliseGreenbank(savedGreenbank, day) {
  const openingNews = { id: "opening-news", day: 1, tone: "local", headline: "Quiet morning expected at the Wayfarer's Rest", body: "Mara has put fresh soup on and remains cautiously optimistic about the chairs." };
  const savedThreat = Number(savedGreenbank?.threat);
  const savedConfidence = Number(savedGreenbank?.confidence);
  const requests = Array.isArray(savedGreenbank?.requests)
    ? savedGreenbank.requests.filter((request) => request?.id && request?.templateId)
    : [];
  const news = Array.isArray(savedGreenbank?.news) && savedGreenbank.news.length ? savedGreenbank.news.slice(0, 40) : [openingNews];
  return {
    threat: Math.max(0, Math.min(100, Number.isFinite(savedThreat) ? savedThreat : 24)),
    confidence: Math.max(0, Math.min(100, Number.isFinite(savedConfidence) ? savedConfidence : 42)),
    requests,
    news,
    lastRequestDay: Math.max(0, Number(savedGreenbank?.lastRequestDay) || 0),
    completedRequests: Math.max(0, Number(savedGreenbank?.completedRequests) || 0),
    missedRequests: Math.max(0, Number(savedGreenbank?.missedRequests) || 0),
    lastReport: savedGreenbank?.lastReport?.day <= day ? savedGreenbank.lastReport : null
  };
}

function normaliseMaterials(savedMaterials) {
  return Object.keys(materialCatalog).reduce((materials, id) => {
    materials[id] = Math.max(0, Math.floor(Number(savedMaterials?.[id]) || 0));
    return materials;
  }, {});
}

function normaliseEquipment(savedEquipment, adventurers = []) {
  const adventurerIds = new Set(adventurers.map((adventurer) => adventurer.id));
  const seenHeroes = new Set();
  const items = Array.isArray(savedEquipment?.items) ? savedEquipment.items : [];
  return {
    items: items
      .filter((item) => item?.id && equipmentCatalog[item.recipeId])
      .map((item) => {
        const equippedTo = adventurerIds.has(item.equippedTo) && !seenHeroes.has(item.equippedTo) ? item.equippedTo : null;
        if (equippedTo) {
          seenHeroes.add(equippedTo);
        }
        return { id: item.id, recipeId: item.recipeId, equippedTo };
      })
  };
}

function normaliseRankRewards(savedRewards, fame) {
  const claimed = Array.isArray(savedRewards?.claimed) ? savedRewards.claimed.filter((rank) => rankChoiceCatalog[rank]) : [];
  const pending = rankChoiceCatalog[savedRewards?.pending] && !claimed.includes(savedRewards.pending) ? savedRewards.pending : null;
  return { claimed, pending: pending || getEarnedUnclaimedRank(fame, claimed) };
}

function createChronicleTracker(startDay, source) {
  return {
    startDay,
    baseline: {
      gold: Number(source.gold) || 0,
      fame: Number(source.fame) || 0,
      threat: Number(source.greenbank?.threat) || 0,
      confidence: Number(source.greenbank?.confidence) || 0,
      materials: { timber: 0, iron: 0, herbs: 0, ...(source.materials || {}) },
      facilities: { ...(source.facilities || {}) }
    },
    missionsCompleted: 0,
    missionsFailed: 0,
    questGold: 0,
    questFame: 0,
    missedRequests: 0,
    trainingCompleted: 0,
    recruitsJoined: 0,
    equipmentCrafted: 0,
    tavernStories: 0,
    materialsGathered: { timber: 0, iron: 0, herbs: 0 },
    heroScores: {},
    focusCounts: { str: 0, mag: 0, wit: 0, cha: 0 },
    facilityChanges: [],
    highlights: []
  };
}

function createChronicleState(source) {
  const day = Math.max(1, Number(source.day) || 1);
  return {
    weeklyReports: [],
    seasonReports: [],
    week: createChronicleTracker(day - ((day - 1) % 7), source),
    season: createChronicleTracker(day - ((day - 1) % 28), source),
    activeFocus: null
  };
}

function normaliseChronicleTracker(savedTracker, fallbackStartDay, source) {
  const fresh = createChronicleTracker(fallbackStartDay, source);
  if (!savedTracker || typeof savedTracker !== "object") {
    return fresh;
  }
  const heroScores = Object.entries(savedTracker.heroScores || {}).reduce((scores, [id, score]) => {
    if (source.adventurers.some((adventurer) => adventurer.id === id)) {
      scores[id] = {
        score: Math.max(0, Number(score?.score) || 0),
        quests: Math.max(0, Number(score?.quests) || 0),
        training: Math.max(0, Number(score?.training) || 0)
      };
    }
    return scores;
  }, {});
  return {
    ...fresh,
    ...savedTracker,
    startDay: Math.max(1, Number(savedTracker.startDay) || fallbackStartDay),
    baseline: {
      ...fresh.baseline,
      ...(savedTracker.baseline || {}),
      materials: { ...fresh.baseline.materials, ...(savedTracker.baseline?.materials || {}) },
      facilities: { ...fresh.baseline.facilities, ...(savedTracker.baseline?.facilities || {}) }
    },
    materialsGathered: { ...fresh.materialsGathered, ...(savedTracker.materialsGathered || {}) },
    focusCounts: { ...fresh.focusCounts, ...(savedTracker.focusCounts || {}) },
    heroScores,
    facilityChanges: Array.isArray(savedTracker.facilityChanges) ? savedTracker.facilityChanges.slice(-12) : [],
    highlights: Array.isArray(savedTracker.highlights) ? savedTracker.highlights.slice(-12) : []
  };
}

function normaliseChronicle(savedChronicle, source) {
  const fresh = createChronicleState(source);
  const weeklyReports = Array.isArray(savedChronicle?.weeklyReports)
    ? savedChronicle.weeklyReports.filter((report) => report?.id && report.kind === "weekly").slice(0, 24)
    : [];
  const seasonReports = Array.isArray(savedChronicle?.seasonReports)
    ? savedChronicle.seasonReports.filter((report) => report?.id && report.kind === "seasonal").slice(0, 12)
    : [];
  const activeFocus = seasonFocusCatalog[savedChronicle?.activeFocus?.id] && Number(savedChronicle.activeFocus.endsDay) >= source.day
    ? { ...savedChronicle.activeFocus }
    : null;
  return {
    weeklyReports,
    seasonReports,
    week: normaliseChronicleTracker(savedChronicle?.week, fresh.week.startDay, source),
    season: normaliseChronicleTracker(savedChronicle?.season, fresh.season.startDay, source),
    activeFocus
  };
}

function recordChronicleEvent(event) {
  if (!state.chronicle || !event?.type) {
    return;
  }
  [state.chronicle.week, state.chronicle.season].forEach((tracker) => {
    if (event.type === "mission") {
      tracker[event.success ? "missionsCompleted" : "missionsFailed"] += 1;
      tracker.questGold += Math.max(0, event.gold || 0);
      tracker.questFame += Math.max(0, event.fame || 0);
      if (tracker.focusCounts[event.focus] !== undefined) {
        tracker.focusCounts[event.focus] += 1;
      }
      Object.entries(event.materials || {}).forEach(([id, amount]) => {
        if (tracker.materialsGathered[id] !== undefined) {
          tracker.materialsGathered[id] += amount;
        }
      });
      (event.heroIds || []).forEach((id) => addChronicleHeroScore(tracker, id, event.success ? 3 : 1, "quests"));
    } else if (event.type === "training") {
      tracker.trainingCompleted += 1;
      addChronicleHeroScore(tracker, event.heroId, 2, "training");
    } else if (event.type === "recruit") {
      tracker.recruitsJoined += 1;
      addChronicleHeroScore(tracker, event.heroId, 1);
    } else if (event.type === "facility") {
      tracker.facilityChanges.push(event.label);
      tracker.facilityChanges = tracker.facilityChanges.slice(-12);
    } else if (event.type === "craft") {
      tracker.equipmentCrafted += 1;
    } else if (event.type === "story") {
      tracker.tavernStories += 1;
      (event.heroIds || []).forEach((id) => addChronicleHeroScore(tracker, id, 1));
    } else if (event.type === "missedRequest") {
      tracker.missedRequests += 1;
    }
    if (event.highlight) {
      tracker.highlights.push(event.highlight);
      tracker.highlights = tracker.highlights.slice(-12);
    }
  });
}

function addChronicleHeroScore(tracker, heroId, amount, counter = null) {
  if (!heroId) {
    return;
  }
  const score = tracker.heroScores[heroId] || { score: 0, quests: 0, training: 0 };
  score.score += amount;
  if (counter) {
    score[counter] += 1;
  }
  tracker.heroScores[heroId] = score;
}

function resetGame() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Reset the in-memory state regardless of storage availability.
  }
  currentPopupEventId = null;
  clearStoryMoment(true);
  dispatchAnimations = [];
  activeView = "guildhall";
  selectedGuildRoomId = "tavernRoom";
  selectedAdventurerId = null;
  partyPickerMissionId = null;
  mapModeOverride = null;
  tavernLifeDialogOpen = false;
  morningReportDialogOpen = false;
  activeChronicleReport = null;
  activeExpeditionReportId = null;
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

  renderGuildActions();
  renderRooms();
  renderFacilities();
  renderGreenbankNews();
  renderChronicleArchive();
  renderTavernEventPanel();
  renderGuildhallInterior();
  renderMap();
  renderRoster();
  renderTrainingPanel();
  renderMissions();
  renderExpeditionWatch();
  renderExpeditionReturnTray();
  renderLog();
  renderStores();
  renderMorningReport();
  renderExpeditionReportDialog();
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
  const morningReportOpen = Boolean(morningReportDialogOpen && getDisplayedReport());
  const expeditionReportOpen = Boolean(activeExpeditionReportId && getExpeditionReport(activeExpeditionReportId));
  elements.titleScreen.classList.toggle("hidden", !titleOpen);
  elements.introScene.classList.toggle("hidden", !introOpen);
  document.body.classList.toggle("modal-open", titleOpen || introOpen || eventOpen || chapterOpen || tavernLifeOpen || morningReportOpen || expeditionReportOpen);
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
  const noGuildActions = getGuildActionsRemaining() < 1;
  elements.facilityList.innerHTML = facilities
    .map((facility) => {
      const level = state.facilities[facility.id];
      const unlocked = isFacilityUnlocked(facility.id);
      const built = level > 0;
      const cost = upgradeCost(facility);
      const materialCost = getFacilityMaterialCost(facility.id);
      const materialsReady = canAffordMaterials(materialCost);
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
            ${unlocked && !maxed ? `<p class="facility-action-cost">Uses 1 Guild Action</p>` : ""}
            ${built && !maxed ? `<p class="facility-material-cost">Upgrade materials: ${formatMaterials(materialCost)}</p>` : ""}
            ${!built ? `<p class="facility-requirement">${getFacilityUnlockText(facility.id)}</p>` : ""}
          </div>
          <button class="${built ? "secondary-button" : "primary-button"}" data-upgrade="${facility.id}" type="button" ${!unlocked || maxed || state.gold < cost || noGuildActions || !materialsReady ? "disabled" : ""}>
            ${!unlocked ? "Locked" : maxed ? "Max level" : noGuildActions ? "No actions" : !materialsReady ? "Needs materials" : built ? `${cost}G Upgrade` : `Build ${cost}G`}
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

  const requestMarkers = state.greenbank.requests
    .map((request) => `
      <button class="map-request" data-map-view="quest" style="left:${request.marker.left};top:${request.marker.top}" type="button" aria-label="${request.name} at ${request.location}">
        <span class="request-pin" aria-hidden="true"></span>
        <span class="map-label">${request.name}<b>Until day ${request.expiresDay}</b></span>
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
    ${requestMarkers}
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
        <span class="tavern-banner" aria-hidden="true"></span>
        <span class="tavern-shelf"><i></i><i></i><i></i></span>
        ${Array.from({ length: detailCount }, (_, index) => `<i class="venue-detail detail-${index + 1}"></i>`).join("")}
      </div>
      <div class="tavern-fireplace" aria-hidden="true"><i></i></div>
      <div class="tavern-bar" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="tavern-table table-near" aria-hidden="true"><i></i></div>
      <div class="tavern-table table-far" aria-hidden="true"><i></i></div>
      ${activeView === "log" ? `<div class="ledger-desk" aria-hidden="true"><i></i><b></b></div>` : ""}
      ${activeView === "adventurers" && state.recruitment.unlocked ? `<div class="recruitment-table" aria-hidden="true"><i></i></div>` : ""}
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
  elements.scoutEvent.disabled = !state.founderCreated || state.facilities.questBoard < 1 || state.eventMissions.length >= 3 || getGuildActionsRemaining() < 1;
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
      || (button.dataset.view === "guildhall" && Boolean(state.tavernLife.active || state.rankRewards.pending))
      || (button.dataset.view === "quest" && state.greenbank.requests.some((request) => request.expiresDay <= state.day + 1));
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

function renderGreenbankNews() {
  if (!elements.greenbankNewsPanel || !elements.greenbankNewsArchive) {
    return;
  }
  const latest = state.greenbank.news[0];
  const threatTone = state.greenbank.threat >= 70 ? "danger" : state.greenbank.threat >= 40 ? "watch" : "calm";
  const confidenceTone = state.greenbank.confidence >= 70 ? "high" : state.greenbank.confidence >= 40 ? "steady" : "low";
  const pendingRank = state.rankRewards.pending;
  const seasonFocus = getSeasonFocus();
  elements.greenbankNewsPanel.innerHTML = `
    <section class="greenbank-bulletin ${threatTone}">
      <div class="bulletin-masthead">
        <div><p class="eyebrow">Greenbank Morning Post</p><strong>${latest?.headline || "The village waits for news"}</strong>${seasonFocus ? `<small class="season-focus-note">${seasonFocusCatalog[seasonFocus.id].name} | ${seasonFocus.endsDay - state.day + 1} days</small>` : ""}</div>
      </div>
      <div class="village-pulse">
        <span class="pulse-stat threat"><small>Goblin threat</small><b>${state.greenbank.threat}</b><i><em style="width:${state.greenbank.threat}%"></em></i></span>
        <span class="pulse-stat confidence ${confidenceTone}"><small>Confidence</small><b>${state.greenbank.confidence}</b><i><em style="width:${state.greenbank.confidence}%"></em></i></span>
      </div>
      <div class="bulletin-actions">
        ${pendingRank ? `<button class="secondary-button promotion-button" data-review-promotion type="button">Rank ${pendingRank} Choice</button>` : ""}
        <button class="ghost-button" data-open-morning-post type="button" ${state.greenbank.lastReport ? "" : "disabled"}>Read Post</button>
        <button class="ghost-button" data-open-news-ledger type="button">Archive</button>
      </div>
    </section>
  `;

  const news = state.greenbank.news.slice(0, 10);
  elements.greenbankNewsArchive.innerHTML = `
    <div class="news-archive-heading">
      <div><p class="eyebrow">The Greenbank Morning Post</p><h3>Village News</h3></div>
      <div class="archive-pulse"><span>Threat <b>${state.greenbank.threat}</b></span><span>Confidence <b>${state.greenbank.confidence}</b></span></div>
    </div>
    <div class="news-columns">
      ${news.map((item) => `
        <article class="news-item ${item.tone || "local"}">
          <span>Day ${item.day}</span><h4>${item.headline}</h4><p>${item.body}</p>
        </article>
      `).join("")}
    </div>
  `;

  elements.greenbankNewsPanel.querySelector("[data-open-morning-post]")?.addEventListener("click", openMorningReport);
  elements.greenbankNewsPanel.querySelector("[data-review-promotion]")?.addEventListener("click", openMorningReport);
  elements.greenbankNewsPanel.querySelector("[data-open-news-ledger]")?.addEventListener("click", () => setActiveView("log"));
}

function renderChronicleArchive() {
  if (!elements.chronicleArchive) {
    return;
  }
  const reports = [...state.chronicle.weeklyReports, ...state.chronicle.seasonReports]
    .sort((first, second) => second.endDay - first.endDay || (second.kind === "seasonal" ? 1 : -1));
  const expeditionReports = state.expeditionReports.entries;
  const unreadExpeditions = new Set(state.expeditionReports.unreadIds);
  const activeFocus = getSeasonFocus();
  elements.chronicleArchive.innerHTML = `
    <div class="chronicle-archive-heading">
      <div><p class="eyebrow">Guildstead Chronicle</p><h3>The Guild Record</h3><span>Weekly editions and season reviews, filed by Mara.</span></div>
      ${activeFocus ? `<span class="archive-focus"><span>Current focus<strong>${seasonFocusCatalog[activeFocus.id].name}</strong></span></span>` : `<span class="archive-count"><b>${reports.length}</b> editions</span>`}
    </div>
    ${reports.length ? `<div class="chronicle-edition-list">${reports.slice(0, 10).map((report) => `
      <button class="chronicle-edition ${report.kind}" data-open-chronicle="${report.id}" type="button">
        <span><small>${report.kind === "seasonal" ? "Season review" : `Week ${report.week}`} | ${report.season}, Year ${report.year}</small><strong>${report.title}</strong><em>${report.metrics.missionsCompleted} quests | ${report.metrics.netGold >= 0 ? "+" : ""}${report.metrics.netGold}G${report.standout ? ` | ${report.standout.name}` : ""}</em></span>
        <i aria-hidden="true">&rsaquo;</i>
      </button>
    `).join("")}</div>` : `<div class="chronicle-empty"><div><strong>The first edition is still being written</strong><p>Mara will file a Chronicle after Guildstead's first seven days.</p></div></div>`}
    <section class="expedition-archive">
      <div class="expedition-archive-heading">
        <div><p class="eyebrow">Expedition archive</p><h3>Field Reports</h3><span>Party returns, rewards and hard-earned lessons.</span></div>
        <span class="archive-count"><b>${expeditionReports.length}</b> filed</span>
      </div>
      ${expeditionReports.length ? `<div class="expedition-archive-list">${expeditionReports.slice(0, 12).map((report) => `
        <button class="expedition-archive-entry ${report.success ? "success" : "retreat"} ${unreadExpeditions.has(report.id) ? "unread" : ""}" data-open-expedition-report="${report.id}" type="button">
          <span><small>Day ${report.day} | ${report.mission.location}${unreadExpeditions.has(report.id) ? " | New report" : ""}</small><strong>${report.mission.name}</strong><em>${report.heroes.map((hero) => hero.name).join(", ")} | +${report.rewards.gold}G | +${report.rewards.fame} fame</em></span>
          <i aria-hidden="true">&rsaquo;</i>
        </button>
      `).join("")}</div>` : `<div class="chronicle-empty expedition-empty"><div><strong>No parties have returned yet</strong><p>The first completed expedition will be filed here automatically.</p></div></div>`}
    </section>
  `;
  elements.chronicleArchive.querySelectorAll("[data-open-chronicle]").forEach((button) => {
    button.addEventListener("click", () => openArchivedChronicle(button.dataset.openChronicle));
  });
  elements.chronicleArchive.querySelectorAll("[data-open-expedition-report]").forEach((button) => {
    button.addEventListener("click", () => openExpeditionReport(button.dataset.openExpeditionReport));
  });
}

function openArchivedChronicle(reportId) {
  activeChronicleReport = [...state.chronicle.weeklyReports, ...state.chronicle.seasonReports]
    .find((report) => report.id === reportId) || null;
  if (!activeChronicleReport) {
    return;
  }
  currentPopupEventId = null;
  clearStoryMoment(true);
  tavernLifeDialogOpen = false;
  morningReportDialogOpen = true;
  render();
}

function getDisplayedReport() {
  return activeChronicleReport || state.greenbank.lastReport;
}

function renderMorningReport() {
  const report = getDisplayedReport();
  const visible = Boolean(report && morningReportDialogOpen);
  elements.morningReportDialog.classList.toggle("hidden", !visible);
  if (!visible) {
    return;
  }
  const pendingRank = state.rankRewards.pending;
  const changes = report.changes || {};
  const signed = (value) => `${value > 0 ? "+" : ""}${value}`;
  if (report.kind === "weekly" || report.kind === "seasonal") {
    elements.morningReportEyebrow.textContent = report.kind === "seasonal" ? "Guildstead Season Review" : "Mara's Weekly Chronicle";
    elements.morningReportTitle.textContent = report.title;
    elements.morningReportDate.textContent = report.kind === "seasonal" ? `${report.season}, Year ${report.year}` : `Week ${report.week} | ${report.season}`;
    elements.morningReportBody.innerHTML = `${renderChronicleReport(report)}${pendingRank ? renderRankChoice(pendingRank) : ""}`;
    elements.closeMorningReport.textContent = activeChronicleReport
      ? "Return To Ledger"
      : report.kind === "seasonal" ? `Begin ${getCalendar().season}` : `Begin Week ${Math.ceil(getCalendar().seasonDay / 7)}`;
    elements.morningReportBody.querySelectorAll("[data-season-focus]").forEach((button) => {
      button.addEventListener("click", () => selectSeasonFocus(button.dataset.seasonFocus));
    });
    elements.morningReportBody.querySelectorAll("[data-rank-choice]").forEach((button) => {
      button.addEventListener("click", () => selectRankReward(button.dataset.rankChoice));
    });
    return;
  }
  elements.morningReportEyebrow.textContent = pendingRank ? `Rank ${pendingRank} Promotion Edition` : "Mara's Morning Post";
  elements.morningReportTitle.textContent = report.title || "A New Day In Greenbank";
  elements.morningReportDate.textContent = `Day ${report.day}`;
  elements.closeMorningReport.textContent = "Begin The Day";
  elements.morningReportBody.innerHTML = `
    <section class="report-lead">
      <div class="report-pulse-card threat"><span>Goblin threat</span><strong>${state.greenbank.threat}</strong><small>${signed(changes.threat || 0)} since yesterday</small></div>
      <div class="report-pulse-card confidence"><span>Village confidence</span><strong>${state.greenbank.confidence}</strong><small>${signed(changes.confidence || 0)} since yesterday</small></div>
      <div class="report-pulse-card gold"><span>Guild purse</span><strong>${state.gold}G</strong><small>${signed(changes.gold || 0)}G since yesterday</small></div>
    </section>
    ${pendingRank ? renderRankChoice(pendingRank) : ""}
    <section class="report-columns">
      <div class="report-column">
        <p class="eyebrow">Around Greenbank</p>
        ${(report.headlines || []).length ? report.headlines.map((item) => `<article><h3>${item.headline}</h3><p>${item.body}</p></article>`).join("") : `<article><h3>A quiet morning</h3><p>No unusual reports reached Mara before breakfast.</p></article>`}
      </div>
      <div class="report-column notices">
        <p class="eyebrow">Guild notices</p>
        ${(report.notices || []).map((notice) => `<p>${notice.text}</p>`).join("") || `<p>No special notices today.</p>`}
        ${(report.newRequests || []).length ? `<h3>New on the Quest Board</h3>${report.newRequests.map((name) => `<p>${name}</p>`).join("")}` : ""}
      </div>
    </section>
  `;
  elements.morningReportBody.querySelectorAll("[data-rank-choice]").forEach((button) => {
    button.addEventListener("click", () => selectRankReward(button.dataset.rankChoice));
  });
}

function renderChronicleReport(report) {
  const metrics = report.metrics;
  const standout = report.standout;
  const standoutHero = standout ? getAdventurer(standout.id) : null;
  const materialText = formatMaterials(metrics.materialsGathered) || "No materials gathered";
  const focusLabel = report.dominantFocus ? `${report.dominantFocus.toUpperCase()} work led the board` : "A balanced spread of guild work";
  const highlights = report.highlights.length ? report.highlights : ["The tavern kept its lamps lit and its doors open."];
  return `
    <section class="chronicle-lead ${report.kind}">
      <div><p class="eyebrow">${report.kind === "seasonal" ? "Four weeks in review" : `Days ${report.startDay}-${report.endDay}`}</p><h3>${report.summary}</h3></div>
    </section>
    <section class="report-lead chronicle-metrics">
      <div class="report-pulse-card confidence"><span>Quests completed</span><strong>${metrics.missionsCompleted}</strong><small>${metrics.missionsFailed} difficult retreat${metrics.missionsFailed === 1 ? "" : "s"}</small></div>
      <div class="report-pulse-card gold"><span>Guild purse</span><strong>${metrics.netGold >= 0 ? "+" : ""}${metrics.netGold}G</strong><small>${metrics.questGold}G from quests</small></div>
      <div class="report-pulse-card threat"><span>Village outlook</span><strong>${metrics.confidenceChange >= 0 ? "+" : ""}${metrics.confidenceChange}</strong><small>Threat ${metrics.threatChange >= 0 ? "+" : ""}${metrics.threatChange}</small></div>
    </section>
    <section class="chronicle-story-grid">
      <article class="standout-adventurer">
        <p class="eyebrow">Adventurer of the ${report.kind === "seasonal" ? "season" : "week"}</p>
        <div class="standout-body ${standoutHero ? "" : "no-portrait"}">
          ${standoutHero ? renderSprite(standoutHero, "small") : ""}
          <div><h3>${standout?.name || "The Guild Roster"}</h3><span>${standout ? `${classes[standout.classId]?.label || "Adventurer"} | Level ${standout.level}` : "Everyone kept the guild moving"}</span><p>${standout?.quests ? `${standout.quests} expedition${standout.quests === 1 ? "" : "s"}` : "Steady guild duty"}${standout?.training ? ` and ${standout.training} training completion${standout.training === 1 ? "" : "s"}` : ""}.</p></div>
        </div>
      </article>
      <article class="chronicle-tally">
        <p class="eyebrow">By the numbers</p>
        <div><span><b>${metrics.questFame}</b> quest fame</span><span><b>${metrics.trainingCompleted}</b> training</span><span><b>${metrics.recruitsJoined}</b> recruits</span><span><b>${metrics.facilitiesImproved}</b> room changes</span></div>
        <small>${materialText} | ${focusLabel}</small>
      </article>
    </section>
    <section class="chronicle-highlights">
      <p class="eyebrow">Written into guild history</p>
      <div>${highlights.map((highlight, index) => `<p><span>${index + 1}</span>${highlight}</p>`).join("")}</div>
    </section>
    ${report.kind === "seasonal" ? renderSeasonFocusChoices(report) : ""}
  `;
}

function renderSeasonFocusChoices(report) {
  const selected = report.focusId ? seasonFocusCatalog[report.focusId] : null;
  if (selected) {
    return `<section class="season-focus-selected"><div><p class="eyebrow">Next season's focus</p><h3>${selected.name}</h3><p>${selected.benefit}</p></div></section>`;
  }
  return `
    <section class="season-focus-choice">
      <div><p class="eyebrow">The Guildmaster's decision</p><h3>Choose Guildstead's Focus For The Next Season</h3><span>This is optional, but the chosen benefit lasts for 28 days.</span></div>
      <div class="season-focus-grid">${Object.entries(seasonFocusCatalog).map(([id, focus]) => `
        <button data-season-focus="${id}" type="button"><strong>${focus.name}</strong><small>${focus.description}</small><em>${focus.benefit}</em></button>
      `).join("")}</div>
    </section>
  `;
}

function renderRankChoice(rank) {
  const choices = rankChoiceCatalog[rank] || [];
  return `
    <section class="rank-choice-section">
      <div><p class="eyebrow">Guild Rank ${rank}</p><h3>Choose How Greenbank Marks The Promotion</h3><span>The extra Guild Action is already yours. This one-time charter benefit shapes the celebration.</span></div>
      <div class="rank-choice-grid">
        ${choices.map((choice) => `<button data-rank-choice="${choice.id}" type="button"><strong>${choice.name}</strong><small>${choice.description}</small><b>${choice.reward}</b></button>`).join("")}
      </div>
    </section>
  `;
}

function openMorningReport() {
  activeChronicleReport = null;
  if (!state.greenbank.lastReport) {
    state.greenbank.lastReport = createStatusReport();
  }
  currentPopupEventId = null;
  clearStoryMoment(true);
  tavernLifeDialogOpen = false;
  morningReportDialogOpen = true;
  render();
}

function closeMorningReport() {
  morningReportDialogOpen = false;
  activeChronicleReport = null;
  render();
}

function createStatusReport() {
  return {
    day: state.day,
    title: `The Greenbank Post, Day ${state.day}`,
    changes: { threat: 0, confidence: 0, gold: 0 },
    headlines: state.greenbank.news.filter((item) => item.day === state.day).slice(0, 3),
    notices: [{ mark: "G", text: `${getGuildActionsRemaining()} Guild Actions remain today.` }],
    newRequests: state.greenbank.requests.map((request) => request.name).slice(0, 3)
  };
}

function completeChroniclePeriods(endedDay) {
  if (!state.founderCreated || endedDay < 1 || endedDay % 7 !== 0) {
    return null;
  }
  const weeklyReport = createChronicleReport("weekly", state.chronicle.week, endedDay);
  state.chronicle.weeklyReports.unshift(weeklyReport);
  state.chronicle.weeklyReports = state.chronicle.weeklyReports.slice(0, 24);
  state.chronicle.week = createChronicleTracker(state.day, state);
  if (endedDay % 28 !== 0) {
    return weeklyReport;
  }
  const seasonReport = createChronicleReport("seasonal", state.chronicle.season, endedDay);
  state.chronicle.seasonReports.unshift(seasonReport);
  state.chronicle.seasonReports = state.chronicle.seasonReports.slice(0, 12);
  state.chronicle.season = createChronicleTracker(state.day, state);
  return seasonReport;
}

function createChronicleReport(kind, tracker, endedDay) {
  const calendar = getCalendar(endedDay);
  const heroEntries = Object.entries(tracker.heroScores || {}).sort(([, first], [, second]) => second.score - first.score);
  const standoutEntry = heroEntries[0];
  const standoutHero = standoutEntry ? getAdventurer(standoutEntry[0]) : state.adventurers.find((adventurer) => adventurer.founder) || state.adventurers[0];
  const standoutScore = standoutEntry?.[1] || { score: 0, quests: 0, training: 0 };
  const dominantFocus = Object.entries(tracker.focusCounts || {}).sort(([, first], [, second]) => second - first)[0];
  const facilityChanges = [...new Set(tracker.facilityChanges || [])];
  const metrics = {
    missionsCompleted: tracker.missionsCompleted,
    missionsFailed: tracker.missionsFailed,
    missedRequests: tracker.missedRequests,
    questGold: tracker.questGold,
    questFame: tracker.questFame,
    netGold: state.gold - tracker.baseline.gold,
    fameChange: state.fame - tracker.baseline.fame,
    threatChange: state.greenbank.threat - tracker.baseline.threat,
    confidenceChange: state.greenbank.confidence - tracker.baseline.confidence,
    trainingCompleted: tracker.trainingCompleted,
    recruitsJoined: tracker.recruitsJoined,
    equipmentCrafted: tracker.equipmentCrafted,
    tavernStories: tracker.tavernStories,
    materialsGathered: { ...tracker.materialsGathered },
    facilitiesImproved: facilityChanges.length
  };
  const report = {
    id: `chronicle-${kind}-${endedDay}-${crypto.randomUUID()}`,
    kind,
    day: state.day,
    startDay: tracker.startDay,
    endDay: endedDay,
    season: calendar.season,
    year: calendar.year,
    week: Math.ceil(calendar.seasonDay / 7),
    title: getChronicleTitle(kind, metrics),
    summary: getChronicleSummary(kind, metrics, standoutHero, standoutScore.score),
    metrics,
    standout: standoutHero ? {
      id: standoutHero.id,
      name: standoutHero.name,
      classId: standoutHero.classId,
      level: standoutHero.level,
      quests: standoutScore.quests,
      training: standoutScore.training,
      score: standoutScore.score
    } : null,
    dominantFocus: dominantFocus?.[1] > 0 ? dominantFocus[0] : null,
    facilityChanges,
    highlights: (tracker.highlights || []).slice(-4).reverse(),
    focusId: null
  };
  return report;
}

function getChronicleTitle(kind, metrics) {
  if (metrics.missionsFailed > metrics.missionsCompleted && metrics.missionsFailed > 0) {
    return kind === "seasonal" ? "A Season Of Hard-Won Lessons" : "A Week Of Hard-Won Lessons";
  }
  if (metrics.missedRequests >= (kind === "seasonal" ? 5 : 2) || metrics.threatChange >= (kind === "seasonal" ? 18 : 10)) {
    return kind === "seasonal" ? "A Season Under Gathering Clouds" : "Trouble Gathers Beyond The Tavern";
  }
  if (metrics.threatChange <= -8) {
    return "Greenbank's Roads Grow Safer";
  }
  if (metrics.confidenceChange >= 8) {
    return "Greenbank Backs Its Guild";
  }
  if (metrics.facilitiesImproved >= (kind === "seasonal" ? 2 : 1)) {
    return kind === "seasonal" ? "Guildstead Takes Shape" : "Room To Grow";
  }
  if (metrics.missionsCompleted >= (kind === "seasonal" ? 8 : 3)) {
    return kind === "seasonal" ? "A Guild In Great Demand" : "Greenbank's Busy Guardians";
  }
  return kind === "seasonal" ? "A Promising Season At Guildstead" : "A Promising Week At Guildstead";
}

function getChronicleSummary(kind, metrics, standoutHero, standoutScore = 0) {
  const period = kind === "seasonal" ? "season" : "week";
  const questText = metrics.missionsCompleted
    ? `${metrics.missionsCompleted} quest${metrics.missionsCompleted === 1 ? "" : "s"} completed`
    : "steady work around the tavern";
  const heroText = standoutHero
    ? standoutScore > 0 ? ` ${standoutHero.name} made the strongest impression.` : ` ${standoutHero.name} kept the guild steady between larger moments.`
    : "";
  return `The ${period} brought ${questText}, ${metrics.fameChange >= 0 ? "+" : ""}${metrics.fameChange} fame, and a ${metrics.netGold >= 0 ? "gain" : "loss"} of ${Math.abs(metrics.netGold)}G.${heroText}`;
}

function getSeasonFocus() {
  const focus = state.chronicle?.activeFocus;
  return focus && seasonFocusCatalog[focus.id] && focus.endsDay >= state.day ? focus : null;
}

function selectSeasonFocus(focusId) {
  const focus = seasonFocusCatalog[focusId];
  const report = activeChronicleReport || state.greenbank.lastReport;
  if (!focus || report?.kind !== "seasonal" || report.focusId) {
    return false;
  }
  state.chronicle.activeFocus = { id: focusId, startedDay: state.day, endsDay: state.day + 27 };
  report.focusId = focusId;
  const storedReport = state.chronicle.seasonReports.find((item) => item.id === report.id);
  if (storedReport) {
    storedReport.focusId = focusId;
  }
  addNews(`${focus.name} becomes Guildstead's seasonal focus`, focus.benefit, "guild");
  addLog(`Season focus chosen: ${focus.name}. ${focus.benefit}`);
  render();
  showToast("Season focus chosen", focus.benefit, "success");
  return true;
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
  const materialCost = facility ? getFacilityMaterialCost(facility.id) : {};
  const materialsReady = canAffordMaterials(materialCost);
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
        : `<button class="primary-button" data-build-room="${room.facilityId}" type="button" ${!unlocked || state.gold < cost || getGuildActionsRemaining() < 1 || !materialsReady ? "disabled" : ""}>${unlocked ? getGuildActionsRemaining() < 1 ? "No actions" : !materialsReady ? "Needs materials" : `Build ${cost}G` : "Locked"}</button>`}
    </article>
    ${built ? renderFacilityOrders(room.facilityId) : ""}
    ${built && room.facilityId === "workshop" ? renderWorkshopCrafting() : ""}
  `;

  const action = elements.guildhallRoomDetail.querySelector("[data-room-action]");
  action?.addEventListener("click", () => setActiveView(action.dataset.roomAction));
  const buildAction = elements.guildhallRoomDetail.querySelector("[data-build-room]");
  buildAction?.addEventListener("click", () => upgradeFacility(buildAction.dataset.buildRoom));
  elements.guildhallRoomDetail.querySelectorAll("[data-facility-order]").forEach((button) => {
    button.addEventListener("click", () => queueFacilityOrder(button.dataset.facilityOrder));
  });
  elements.guildhallRoomDetail.querySelectorAll("[data-craft-equipment]").forEach((button) => {
    button.addEventListener("click", () => craftEquipment(button.dataset.craftEquipment));
  });
}

function renderFacilityOrders(facilityId) {
  const orders = facilityOrderCatalog.filter((order) => order.facilityId === facilityId);
  const queued = getQueuedFacilityOrder(facilityId);
  const facility = facilities.find((item) => item.id === facilityId);
  return `
    <section class="facility-orders">
      <div class="facility-orders-heading">
        <div><p class="eyebrow">Today's room orders</p><h3>${facility?.name || "Facility"} Duties</h3></div>
        <span>${queued ? "Resolves at End Day" : "Choose one for 1 action"}</span>
      </div>
      <div class="facility-order-grid">
        ${orders.map((order) => {
          const lockReason = getFacilityOrderAvailability(order);
          const isQueued = queued?.orderId === order.id;
          return `
            <article class="facility-order-card ${isQueued ? "queued" : ""}">
              <div class="facility-order-copy">
                <h4>${order.title}</h4>
                <p>${order.description}</p>
                <small>${isQueued ? "Order issued. " : ""}${order.outcome}</small>
              </div>
              <div class="facility-order-action">
                <span class="order-action-cost"><i aria-hidden="true"></i>1</span>
                <button class="${isQueued ? "ghost-button" : "secondary-button"}" data-facility-order="${order.id}" type="button" ${lockReason ? "disabled" : ""}>
                  ${isQueued ? "Queued" : lockReason || "Issue Order"}
                </button>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderWorkshopCrafting() {
  return `
    <section class="workshop-crafting">
      <div class="facility-orders-heading">
        <div><p class="eyebrow">Workshop equipment</p><h3>Craft Guild Gear</h3></div>
        <span>Crafting uses 1 Guild Action</span>
      </div>
      <div class="crafting-grid">
        ${Object.entries(equipmentCatalog).map(([id, recipe]) => {
          const affordable = canAffordMaterials(recipe.cost);
          const disabled = !affordable || getGuildActionsRemaining() < 1;
          return `
            <article class="crafting-card">
              <div><h4>${recipe.name}</h4><p>${recipe.description}</p><small>${formatMaterials(recipe.cost)}</small></div>
              <button class="secondary-button" data-craft-equipment="${id}" type="button" ${disabled ? "disabled" : ""}>${getGuildActionsRemaining() < 1 ? "No Actions" : affordable ? "Craft" : "Needs Materials"}</button>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
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
  const recruitmentCost = getRecruitmentCost();
  const selectedAvailable = state.selectedIds.filter((id) => canAdventurerQuestToday(getAdventurer(id)));
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
  const noGuildActions = getGuildActionsRemaining() < 1;
  elements.recruit.disabled = recruitmentLocked || recruitmentWaiting || candidatesReady || state.gold < recruitmentCost || rosterFull || noGuildActions;
  elements.recruit.textContent = rosterFull
    ? "Dormitory Needed"
    : recruitmentLocked
      ? "Recruitment Locked"
      : recruitmentWaiting
        ? `Applicants Day ${state.recruitment.order.readyDay}`
        : candidatesReady
          ? "Choose Applicant"
          : noGuildActions
            ? "No Guild Actions"
            : `Post Notice ${recruitmentCost}G`;
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
      const questAvailable = canAdventurerQuestToday(adventurer);
      const statusText = questAvailable ? `Lv ${adventurer.level}` : getAdventurerStatusLabel(adventurer);
      const partyFull = state.selectedIds.length >= 3 && !selected;
      return `
        <article class="adventurer-card ${adventurer.status} ${adventurer.lastQuestDay === state.day ? "quested-today" : ""} ${selected ? "selected" : ""} ${inspected ? "inspected" : ""}" data-adventurer="${adventurer.id}">
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
          <button class="party-toggle ${selected ? "remove" : ""}" data-party="${adventurer.id}" type="button" ${!questAvailable || partyFull ? "disabled" : ""}>
            ${!questAvailable ? getAdventurerStatusLabel(adventurer) : selected ? "Remove" : "Add"}
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
  const recruitmentCost = getRecruitmentCost();
  const rosterFull = state.adventurers.length >= getRosterCapacity();
  if (!recruitment.unlocked) {
    elements.recruitmentPanel.innerHTML = `
      <section class="recruitment-service locked">
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
      <div><p class="eyebrow">Tavern recruitment</p><h3>Post A Paid Notice</h3><p>Mara will find three applicants in one or two days. The ${recruitmentCost}G fee covers notices, food, and travel.</p></div>
      <button class="primary-button" data-post-recruitment type="button" ${rosterFull || state.gold < recruitmentCost ? "disabled" : ""}>${rosterFull ? "Dormitory Needed" : `${recruitmentCost}G`}</button>
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

      ${renderEquipmentSection(adventurer)}

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
  elements.adventurerDetail.querySelectorAll("[data-equip-item]").forEach((button) => {
    button.addEventListener("click", () => equipItem(adventurer.id, button.dataset.equipItem));
  });
  elements.adventurerDetail.querySelector("[data-unequip-item]")?.addEventListener("click", () => unequipItem(adventurer.id));
  elements.adventurerDetail.querySelectorAll("[data-view-relationship]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAdventurerId = button.dataset.viewRelationship;
      renderRoster();
      elements.adventurerDetail.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function renderEquipmentSection(adventurer) {
  const equipped = getEquipmentForAdventurer(adventurer.id);
  const available = state.equipment.items.filter((item) => !item.equippedTo);
  const equippedRecipe = equipped ? equipmentCatalog[equipped.recipeId] : null;
  return `
    <section class="character-section equipment-section">
      <div class="section-line-heading"><p class="eyebrow">Equipment</p><span>One crafted item per adventurer</span></div>
      ${equippedRecipe ? `
        <div class="equipped-item"><div><strong>${equippedRecipe.name}</strong><small>${equippedRecipe.description}</small></div><button class="ghost-button" data-unequip-item type="button">Remove</button></div>
      ` : `<p class="system-empty">No equipment assigned. Workshop gear can be equipped here.</p>`}
      ${available.length ? `<div class="available-equipment">${available.map((item) => {
        const recipe = equipmentCatalog[item.recipeId];
        return `<button data-equip-item="${item.id}" type="button"><strong>${recipe.name}</strong><small>${recipe.description}</small></button>`;
      }).join("")}</div>` : ""}
    </section>
  `;
}

function isTimeSensitiveMission(mission) {
  return Boolean(mission?.isEvent || mission?.rotatingRequest || Number.isFinite(mission?.expiresDay));
}

function getMissionDaysRemaining(mission) {
  if (!Number.isFinite(mission?.expiresDay)) {
    return null;
  }
  return Math.max(0, mission.expiresDay - state.day);
}

function formatMissionDeadline(daysRemaining) {
  if (daysRemaining === null) {
    return "Limited time";
  }
  if (daysRemaining === 0) {
    return "Expires today";
  }
  return `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`;
}

function getRecommendedPartySize(mission) {
  if (mission?.tutorial) {
    return 1;
  }
  if (mission?.chapterBoss || mission?.difficulty >= 58) {
    return 3;
  }
  if (mission?.storyEncounter || isTimeSensitiveMission(mission) || mission?.difficulty >= 32) {
    return 2;
  }
  return 1;
}

function renderMissions() {
  state.selectedIds = state.selectedIds.filter((id) => canAdventurerQuestToday(getAdventurer(id))).slice(0, 3);
  const selectedParty = state.selectedIds.map(getAdventurer).filter(canAdventurerQuestToday);
  const campaignMarkup = renderGoblinCampaignPanel();
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
  const preparationSummary = getPreparationSummary();
  const preparationMarkup = preparationSummary.length ? `
    <section class="quest-preparation">
      <div><p class="eyebrow">Next expedition prepared</p><strong>${preparationSummary.join(" | ")}</strong><small>These bonuses are used when the next party departs.</small></div>
    </section>
  ` : "";

  const allMissions = [...missionDeck.filter((mission) => isMissionVisible(mission)), ...state.greenbank.requests, ...state.eventMissions];
  const missionCards = allMissions
    .map((mission) => {
      const lockReason = getMissionLockReason(mission);
      const locked = Boolean(lockReason);
      const resolved = lockReason === "Story resolved";
      const active = state.activeMissions.find((activeMission) => activeMission.missionId === mission.id);
      const progress = active ? Math.round((active.elapsed / active.duration) * 100) : 0;
      const odds = selectedParty.length ? getMissionOdds(selectedParty, mission) : 0;
      const oddsTone = odds >= 75 ? "good" : odds >= 45 ? "fair" : "poor";
      const oddsLabel = odds >= 75 ? "Promising" : odds >= 45 ? "Risky" : "Dangerous";
      const pickerOpen = partyPickerMissionId === mission.id && !locked && !active;
      const storyPriority = Boolean(mission.storyEncounter);
      const timeSensitive = isTimeSensitiveMission(mission);
      const daysRemaining = getMissionDaysRemaining(mission);
      const deadlineClose = timeSensitive && daysRemaining !== null && daysRemaining <= 1;
      const recommendedPartySize = getRecommendedPartySize(mission);
      return `
        <article class="mission-card ${mission.isEvent ? "event" : ""} ${mission.rotatingRequest ? "greenbank-request" : ""} ${mission.tutorial ? "tutorial" : ""} ${mission.chapterBoss ? "boss" : ""} ${storyPriority ? "story-mission story-priority" : ""} ${timeSensitive ? "time-sensitive" : ""} ${deadlineClose ? "deadline-close" : ""} ${resolved ? "resolved" : ""} ${locked ? "locked" : ""} ${pickerOpen ? "party-open" : ""}" data-mission-card="${mission.id}">
          <div class="mission-card-main">
            ${(storyPriority || timeSensitive) ? `<div class="mission-priority-tags">
              ${storyPriority ? `<span class="mission-priority-tag story">Story quest</span>` : ""}
              ${timeSensitive ? `<span class="mission-priority-tag timed">${mission.isEvent ? "Realm deadline" : "Time sensitive"}</span>` : ""}
              ${timeSensitive ? `<span class="mission-deadline ${deadlineClose ? "close" : ""}">${formatMissionDeadline(daysRemaining)}</span>` : ""}
            </div>` : ""}
            <div class="mission-title-row">
              <div>
                <span class="mission-kicker">${mission.location}</span>
                <h3>${mission.name}</h3>
              </div>
              <span class="focus-chip">${mission.focus.toUpperCase()}</span>
            </div>
            ${mission.description ? `<p class="mission-description">${mission.description}</p>` : ""}
            ${mission.storyEncounter ? renderMissionStoryNote(mission, resolved) : ""}
            <div class="reward-row">
              <span>Risk ${mission.difficulty}</span>
              <span>${formatMissionTime(selectedParty.length ? getMissionDuration(mission, selectedParty) : mission.duration)}</span>
              <span>${mission.gold}G</span>
              <span>${mission.fame} fame</span>
              <span class="party-advice">${recommendedPartySize} ${recommendedPartySize === 1 ? "hero" : "heroes"} advised</span>
              ${mission.materials ? `<span>${formatMaterials(mission.materials)}</span>` : ""}
            </div>
            ${locked ? `<p class="mission-note locked-note">${lockReason}</p>` : ""}
            ${active ? `<div class="mission-progress-label"><span>Expedition underway</span><strong>${progress}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>` : ""}
          </div>
          <div class="mission-action">
            ${!locked && !active && selectedParty.length ? `<span class="odds ${oddsTone}"><b>${odds}%</b>${oddsLabel}</span>` : ""}
            ${!locked && !active ? `<button class="secondary-button mission-party-button" data-compose-party="${mission.id}" type="button" aria-expanded="${pickerOpen}">${pickerOpen ? "Close party" : selectedParty.length ? "Change party" : "Choose party"}</button>` : ""}
            <button class="primary-button" data-mission="${mission.id}" type="button" ${missionButtonDisabled(locked, active, selectedParty.length > 0)}>
              ${resolved ? "Resolved" : locked ? "Locked" : active ? "In progress" : "Dispatch"}
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

  elements.missionList.innerHTML = `${campaignMarkup}${partyMarkup}${preparationMarkup}${activeCards ? `<div class="active-expeditions">${activeCards}</div>` : ""}<div class="mission-deck">${missionCards}</div>`;
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

function renderGoblinCampaignPanel() {
  if (!state.founderCreated || state.facilities.questBoard < 1 || state.chapter.charterEarned) {
    return "";
  }
  const intel = state.chapter.goblinIntel || 0;
  const support = state.chapter.villageSupport || 0;
  const bossEncounter = encounterDeck.barrowAssault;
  const routeMarkup = bossEncounter.storyChoices.slice(1).map((choice) => {
    const ready = isStoryChoiceUnlocked(choice);
    return `<span class="campaign-route ${ready ? "ready" : "locked"}"><i>${ready ? "OK" : "--"}</i>${choice.label}</span>`;
  }).join("");
  const decisions = state.chapter.goblinDecisions.filter((decision) => decision.missionId !== "barrowHill").slice(-3);
  return `
    <section class="goblin-campaign" aria-label="Barrow Hill campaign preparation">
      <header>
        <div><span class="mission-kicker">Chapter campaign</span><h3>Prepare For Barrow Hill</h3></div>
        <strong>${state.chapter.completedLocalMissions.length}/3 local stories</strong>
      </header>
      <div class="campaign-resources">
        <div class="campaign-resource intel">
          <div><strong>Goblin Intel <b>${intel}/4</b></strong><small>Unlocks safer routes into the chief's camp.</small><i style="--campaign-progress:${intel * 25}%"></i></div>
        </div>
        <div class="campaign-resource support">
          <div><strong>Village Support <b>${support}/4</b></strong><small>Brings Greenbank's people into the final battle.</small><i style="--campaign-progress:${support * 25}%"></i></div>
        </div>
      </div>
      <div class="campaign-routes"><span>Finale approaches</span>${routeMarkup}</div>
      ${decisions.length ? `<div class="campaign-decisions"><span>Road so far</span>${decisions.map((decision) => `<b title="${decision.consequence}">${decision.label}</b>`).join("")}</div>` : ""}
    </section>
  `;
}

function renderMissionStoryNote(mission, resolved) {
  const decision = state.chapter.goblinDecisions.find((item) => item.missionId === mission.id);
  if (resolved) {
    return `<p class="mission-story-note resolved"><span>Decision recorded</span>${decision?.label || "Story complete"}</p>`;
  }
  if (mission.chapterBoss) {
    const routeCount = encounterDeck.barrowAssault.storyChoices.filter((choice) => isStoryChoiceUnlocked(choice)).length;
    return `<p class="mission-story-note"><span>Chapter finale</span>${routeCount} approach${routeCount === 1 ? "" : "es"} available during the expedition</p>`;
  }
  if (mission.tutorial) {
    return `<p class="mission-story-note guided"><span>Guided first quest</span>Mara will alert you when the expedition needs an order</p>`;
  }
  return `<p class="mission-story-note"><span>Story decision</span>Your order during this expedition will shape the Barrow Hill finale</p>`;
}

function renderQuestPartyPicker(mission) {
  const eligibleSelectedIds = state.selectedIds.filter((id) => canAdventurerQuestToday(getAdventurer(id)));
  const selectedCount = eligibleSelectedIds.length;
  const partyFull = selectedCount >= 3;
  const focusLabel = mission.focus.toUpperCase();
  const readyToday = state.adventurers.filter(canAdventurerQuestToday).length;
  const options = state.adventurers.map((adventurer) => {
    const available = canAdventurerQuestToday(adventurer);
    const selected = available && eligibleSelectedIds.includes(adventurer.id);
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
        <span>Quest focus: ${focusLabel} | ${readyToday} ready today</span>
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

function getExpeditionReport(reportId) {
  return state.expeditionReports.entries.find((report) => report.id === reportId) || null;
}

function queueExpeditionReport(report) {
  state.expeditionReports.entries.unshift(report);
  state.expeditionReports.entries = state.expeditionReports.entries.slice(0, 40);
  state.expeditionReports.unreadIds.unshift(report.id);
  state.expeditionReports.unreadIds = [...new Set(state.expeditionReports.unreadIds)].slice(0, 40);
}

function renderExpeditionReturnTray() {
  const unreadReports = state.expeditionReports.entries.filter((report) => state.expeditionReports.unreadIds.includes(report.id));
  const latest = unreadReports[0];
  elements.expeditionReturnTray.classList.toggle("hidden", !latest);
  if (!latest) {
    elements.expeditionReturnTray.innerHTML = "";
    return;
  }
  const partyNames = latest.heroes.map((hero) => hero.name).join(", ");
  elements.expeditionReturnTray.innerHTML = `
    <div class="return-tray-copy">
      <span class="mission-kicker">Party returned${unreadReports.length > 1 ? ` | ${unreadReports.length} reports waiting` : ""}</span>
      <strong>${latest.mission.name}</strong>
      <small>${partyNames} ${latest.success ? "completed the contract" : "made it home after a retreat"}.</small>
    </div>
    <button class="primary-button" data-open-expedition-report="${latest.id}" type="button">View Report</button>
  `;
  elements.expeditionReturnTray.querySelector("[data-open-expedition-report]")?.addEventListener("click", () => openExpeditionReport(latest.id));
}

function openExpeditionReport(reportId) {
  const report = getExpeditionReport(reportId);
  if (!report) {
    return;
  }
  currentPopupEventId = null;
  tavernLifeDialogOpen = false;
  morningReportDialogOpen = false;
  activeChronicleReport = null;
  activeExpeditionReportId = reportId;
  state.expeditionReports.unreadIds = state.expeditionReports.unreadIds.filter((id) => id !== reportId);
  render();
}

function closeExpeditionReport() {
  activeExpeditionReportId = null;
  render();
}

function renderExpeditionReportDialog() {
  const report = activeExpeditionReportId ? getExpeditionReport(activeExpeditionReportId) : null;
  elements.expeditionReportDialog.classList.toggle("hidden", !report);
  if (!report) {
    renderedExpeditionReportId = null;
    return;
  }
  elements.closeExpeditionReport.textContent = activeView === "log" ? "Return To Ledger" : "Return To Guild";
  if (renderedExpeditionReportId === report.id) {
    return;
  }
  renderedExpeditionReportId = report.id;
  const materials = formatMaterials(report.rewards.materials);
  const loot = report.rewards.lootId ? lootCatalog[report.rewards.lootId] : null;
  const threatTone = report.village.threatDelta < 0 ? "good" : report.village.threatDelta > 0 ? "bad" : "steady";
  const confidenceTone = report.village.confidenceDelta > 0 ? "good" : report.village.confidenceDelta < 0 ? "bad" : "steady";
  const signed = (value) => `${value > 0 ? "+" : ""}${value}`;
  elements.expeditionReportSheet.className = `expedition-report-sheet ${report.success ? "success" : "retreat"}`;
  elements.expeditionReportEyebrow.textContent = report.success ? "Contract Completed" : "Difficult Retreat";
  elements.expeditionReportTitle.textContent = report.mission.name;
  elements.expeditionReportDate.textContent = `Day ${report.day}`;
  elements.expeditionReportBody.innerHTML = `
    <section class="expedition-return-scene ${report.success ? "success" : "retreat"}">
      <div class="return-scene-copy">
        <span>${report.success ? "Safe return to the Wayfarer's Rest" : "The tavern doors stayed open late"}</span>
        <h3>${report.success ? "The Party Returns Victorious" : "The Party Returns Wiser"}</h3>
        <p>${report.summary}</p>
      </div>
      <div class="report-return-party" aria-label="${report.heroes.map((hero) => hero.name).join(", ")} returning from ${report.mission.location}">
        ${report.heroes.map((hero, index) => `<span class="report-return-hero ${hero.status === "injured" ? "injured" : ""}" style="--return-index:${index}">${renderSprite(hero, "report-sprite")}</span>`).join("")}
      </div>
    </section>
    <section class="expedition-reward-strip">
      <article class="${report.success ? "success" : "retreat"}"><div><small>Outcome</small><strong>${report.success ? "Victory" : "Retreat"}</strong></div></article>
      <article><div><small>Gold returned</small><strong>+${report.rewards.gold}G</strong></div></article>
      <article><div><small>Fame earned</small><strong>+${report.rewards.fame}</strong></div></article>
      <article><div><small>Guild stores</small><strong>${materials || loot?.name || "No new supplies"}</strong></div></article>
    </section>
    <section class="expedition-report-section">
      <div class="expedition-section-heading"><div><p class="eyebrow">Party Progress</p><h3>Adventurer Results</h3></div><span>${report.heroes.length} returned</span></div>
      <div class="expedition-hero-results">${report.heroes.map((hero, index) => renderExpeditionHeroResult(hero, index)).join("")}</div>
    </section>
    <section class="expedition-report-grid">
      <article class="expedition-field-notes">
        <p class="eyebrow">Field Notes</p>
        <h3>${report.decision?.title || "The road home"}</h3>
        <strong>${report.decision?.label || (report.success ? "Contract fulfilled" : "A measured withdrawal")}</strong>
        <p>${report.decision?.result || report.outcomeNote}</p>
        ${report.decision?.consequence ? `<span>${report.decision.consequence}</span>` : ""}
        <div class="expedition-score"><span>Party power <b>${report.score.power}</b></span><span>Field roll <b>${report.score.roll}</b></span><span>Quest risk <b>${report.score.difficulty}</b></span></div>
        ${report.score.bondPower ? `<small class="bond-contribution">Party bonds contributed ${signed(report.score.bondPower)} power.</small>` : ""}
      </article>
      <article class="expedition-village-impact">
        <p class="eyebrow">Greenbank Impact</p>
        <h3>${report.success ? "Word Reaches The Village" : "News Of The Retreat Spreads"}</h3>
        <div><span class="${threatTone}"><small>Goblin threat</small><strong>${signed(report.village.threatDelta)}</strong><em>${report.village.threatAfter} now</em></span><span class="${confidenceTone}"><small>Confidence</small><strong>${signed(report.village.confidenceDelta)}</strong><em>${report.village.confidenceAfter} now</em></span></div>
        ${loot ? `<p class="expedition-loot"><b>${loot.name}</b>${loot.description}</p>` : `<p>${materials ? `${materials} were added to Guild Stores.` : "No additional curios were recovered this time."}</p>`}
      </article>
    </section>
  `;
}

function renderExpeditionHeroResult(hero, index) {
  const levelled = hero.levelAfter > hero.levelBefore;
  const xpTarget = Math.min(100, Math.round((hero.xpAfter / Math.max(1, hero.xpRequiredAfter)) * 100));
  const xpStart = levelled ? 0 : Math.min(xpTarget, Math.round((hero.xpBefore / Math.max(1, hero.xpRequiredBefore)) * 100));
  const learned = (hero.abilitiesLearned || []).map((id) => abilityCatalog[id]?.name).filter(Boolean);
  const statusLabel = hero.status === "injured" ? `Injured on return | ${hero.recovery}s recovery` : "Ready for tomorrow";
  return `
    <article class="expedition-hero-result ${levelled ? "level-up" : ""} ${hero.status === "injured" ? "injured" : ""}" style="--hero-index:${index}">
      <div class="expedition-hero-sprite">${renderSprite(hero, "report-profile-sprite")}</div>
      <div class="expedition-hero-copy">
        <div><span><small>${classes[hero.classId]?.label || "Adventurer"}</small><strong>${hero.name}</strong></span><b>${levelled ? `Lv ${hero.levelBefore} to ${hero.levelAfter}` : `Lv ${hero.levelAfter}`}</b></div>
        <div class="expedition-xp-line"><span>Experience</span><strong>+${hero.xpGain} XP</strong></div>
        <div class="expedition-xp-track" aria-label="${hero.name} has ${hero.xpAfter} of ${hero.xpRequiredAfter} experience"><i style="--xp-start:${xpStart}%;--xp-target:${xpTarget}%"></i></div>
        <div class="expedition-hero-notes"><span class="${hero.status === "injured" ? "injured" : "ready"}">${statusLabel}</span><span>${quirkCatalog[hero.positiveQuirk]?.name || "Steady"} / ${quirkCatalog[hero.negativeQuirk]?.name || "Unproven"}</span></div>
        ${learned.length ? `<div class="expedition-ability-earned"><span>New ability</span><strong>${learned.join(", ")}</strong></div>` : ""}
      </div>
    </article>
  `;
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
      outcome.lootId ? `${lootCatalog[outcome.lootId]?.name}${outcome.storyDecisionId ? " on success" : ""}` : "",
      outcome.consequence ? `On success: ${outcome.consequence}` : ""
    ].filter(Boolean);
    return `
      <div class="encounter-result" role="status">
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
            ${choice.consequence ? `<span class="choice-consequence">${choice.consequence}</span>` : ""}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function getAvailableEncounterChoices(encounter, party) {
  if (encounter.storyChoices?.length) {
    const storyChoices = encounter.storyChoices
      .filter((choice) => isStoryChoiceUnlocked(choice))
      .map((choice) => ({ ...choice, badge: choice.badge || "Guildmaster order" }));
    return [...storyChoices, getTrustPartyChoice(true)];
  }
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
  choices.push(getTrustPartyChoice(false));
  return choices;
}

function getTrustPartyChoice(storyDecision = false) {
  return {
    id: "trustParty",
    label: "Let the party decide",
    detail: "They will choose a cautious response and continue without waiting.",
    result: "The party makes a cautious call together and keeps the expedition moving.",
    powerBonus: 2,
    enemyDamage: 10,
    badge: "Party instinct",
    consequence: storyDecision ? "No Barrow Hill advantage" : ""
  };
}

function isStoryChoiceUnlocked(choice, chapter = state.chapter) {
  const requirements = choice.requiresChapter || {};
  return (chapter.goblinIntel || 0) >= (requirements.intel || 0)
    && (chapter.villageSupport || 0) >= (requirements.support || 0);
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
  activeMission.encounterOutcome = {
    powerBonus,
    goldBonus: choice.goldBonus || 0,
    fameBonus,
    xpBonus,
    injuryShield,
    lootId: choice.lootId || "",
    storyDecisionId: encounter.storyChoices?.length ? choice.id : "",
    storyDecisionLabel: encounter.storyChoices?.length ? choice.label : "",
    storyWorld: encounter.storyChoices?.length ? { ...(choice.world || {}) } : null,
    consequence: encounter.storyChoices?.length ? choice.consequence || "" : ""
  };
  if (choice.lootId && !encounter.storyChoices?.length) {
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

function grantMaterials(materials = {}) {
  Object.entries(materials).forEach(([id, amount]) => {
    if (materialCatalog[id] && amount > 0) {
      state.materials[id] = (state.materials[id] || 0) + amount;
    }
  });
}

function formatMaterials(materials = {}) {
  return Object.entries(materials)
    .filter(([id, amount]) => materialCatalog[id] && amount > 0)
    .map(([id, amount]) => `${amount} ${materialCatalog[id].name.toLowerCase()}`)
    .join(", ");
}

function addNews(headline, body, tone = "local") {
  if (!headline) {
    return null;
  }
  const item = { id: `news-${crypto.randomUUID()}`, day: state.day, tone, headline, body };
  state.greenbank.news.unshift(item);
  state.greenbank.news = state.greenbank.news.slice(0, 40);
  return item;
}

function adjustGreenbank({ threat = 0, confidence = 0 } = {}) {
  state.greenbank.threat = Math.max(0, Math.min(100, state.greenbank.threat + threat));
  state.greenbank.confidence = Math.max(0, Math.min(100, state.greenbank.confidence + confidence));
}

function getEarnedUnclaimedRank(fame = state.fame, claimed = state.rankRewards?.claimed || []) {
  const thresholds = { D: 18, C: 48, B: 90 };
  return ["D", "C", "B"].find((rank) => fame >= thresholds[rank] && !claimed.includes(rank)) || null;
}

function syncRankReward(previousRank = null) {
  const pending = state.rankRewards.pending || getEarnedUnclaimedRank();
  if (!pending) {
    return null;
  }
  state.rankRewards.pending = pending;
  if (previousRank && previousRank !== getRank()) {
    addNews(`Guildstead promoted to Rank ${getRank()}`, "Mara has found three suitably official ways to mark the occasion. The final choice belongs to the Guildmaster.", "guild");
  }
  return pending;
}

function selectRankReward(choiceId) {
  const rank = state.rankRewards.pending;
  const choice = rankChoiceCatalog[rank]?.find((item) => item.id === choiceId);
  if (!rank || !choice) {
    return false;
  }
  state.gold += choice.effect.gold || 0;
  state.fame += choice.effect.fame || 0;
  grantMaterials(choice.effect.materials || {});
  adjustGreenbank({ threat: choice.effect.threat || 0, confidence: choice.effect.confidence || 0 });
  if (choice.effect.questPower) {
    state.guildPreparations.nextQuestPower = Math.min(24, state.guildPreparations.nextQuestPower + choice.effect.questPower);
  }
  state.rankRewards.claimed.push(rank);
  state.rankRewards.pending = getEarnedUnclaimedRank();
  addNews(`Guildstead chooses ${choice.name}`, `${choice.reward}. Greenbank's Rank ${rank} celebration now has a plan.`, "guild");
  addLog(`Rank ${rank} benefit chosen: ${choice.name} (${choice.reward}).`);
  recordChronicleEvent({ type: "rank", highlight: `Guildstead reached Rank ${rank} and chose ${choice.name}.` });
  render();
  showToast(`Rank ${rank} benefit chosen`, choice.reward, "success");
  return true;
}

function getEquipmentForAdventurer(adventurerId) {
  return state.equipment.items.find((item) => item.equippedTo === adventurerId) || null;
}

function canAffordMaterials(cost = {}) {
  return Object.entries(cost).every(([id, amount]) => (state.materials[id] || 0) >= amount);
}

function spendMaterials(cost = {}) {
  if (!canAffordMaterials(cost)) {
    return false;
  }
  Object.entries(cost).forEach(([id, amount]) => {
    state.materials[id] -= amount;
  });
  return true;
}

function craftEquipment(recipeId) {
  const recipe = equipmentCatalog[recipeId];
  if (!recipe || state.facilities.workshop < 1 || !canAffordMaterials(recipe.cost)) {
    return false;
  }
  if (!spendGuildAction("workshop crafting")) {
    return false;
  }
  spendMaterials(recipe.cost);
  state.equipment.items.push({ id: `gear-${crypto.randomUUID()}`, recipeId, equippedTo: null });
  addLog(`The Workshop crafts ${recipe.name}.`);
  addNews(`${recipe.name} completed in Guildstead's Workshop`, "The new equipment is ready to assign from any adventurer profile.", "guild");
  recordChronicleEvent({ type: "craft", highlight: `The Workshop completed ${recipe.name}.` });
  render();
  showToast("Equipment crafted", `${recipe.name} is ready to equip.`, "success");
  return true;
}

function equipItem(adventurerId, itemId) {
  const adventurer = getAdventurer(adventurerId);
  const item = state.equipment.items.find((equipment) => equipment.id === itemId);
  if (!adventurer || !item || item.equippedTo) {
    return false;
  }
  const current = getEquipmentForAdventurer(adventurerId);
  if (current) {
    current.equippedTo = null;
  }
  item.equippedTo = adventurerId;
  addLifeEvent(adventurer, `Equipped ${equipmentCatalog[item.recipeId].name}.`);
  render();
  return true;
}

function unequipItem(adventurerId) {
  const item = getEquipmentForAdventurer(adventurerId);
  if (!item) {
    return false;
  }
  item.equippedTo = null;
  render();
  return true;
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
  const materials = Object.entries(state.materials || {}).filter(([id, count]) => materialCatalog[id] && count > 0);
  const equipment = state.equipment.items || [];
  elements.guildStores.innerHTML = `
    <div class="stores-heading"><div><span class="eyebrow">Materials, equipment & curios</span><h3>Guild Stores</h3></div><strong>${materials.reduce((total, [, count]) => total + count, 0) + equipment.length + items.reduce((total, [, count]) => total + count, 0)}</strong></div>
    <div class="material-shelf">
      ${Object.entries(materialCatalog).map(([id, material]) => `<article class="material-item"><div><strong>${material.name}</strong><small>${material.description}</small></div><b>${state.materials[id] || 0}</b></article>`).join("")}
    </div>
    ${equipment.length ? `<div class="equipment-shelf"><p class="eyebrow">Crafted equipment</p>${equipment.map((item) => {
      const recipe = equipmentCatalog[item.recipeId];
      const owner = item.equippedTo ? getAdventurer(item.equippedTo)?.name : "Available";
      return `<article class="store-item"><div><strong>${recipe.name}</strong><small>${recipe.description}</small></div><b>${owner}</b></article>`;
    }).join("")}</div>` : ""}
    ${items.length ? `<div class="store-grid">${items.map(([lootId, count]) => {
      const loot = lootCatalog[lootId];
      return `<article class="store-item" title="${loot.description}"><div><strong>${loot.name}</strong><small>${loot.description}</small></div><b>x${count}</b></article>`;
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
    ? `<div class="ability-row upcoming"><div><strong>${nextNatural.name}</strong><small>Naturally learned at level ${nextNatural.level}.</small></div><span class="ability-source">Upcoming</span></div>`
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
          <div><strong>${getTrainingJobName(activeJob)}</strong><small>${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining. This adventurer cannot join expeditions while training.</small></div>
          <b>${progress}%</b>
          <div class="training-progress"><i style="width:${progress}%"></i></div>
        </div>
      </section>
    `;
  }

  const slotsFull = getActiveTrainingJobs().length >= getTrainingSlotCount();
  const noGuildActions = getGuildActionsRemaining() < 1;
  const drillRows = Object.values(trainingDrills).map((drill) => {
    const full = completedDrills >= drillCapacity;
    const duration = getTrainingDuration(adventurer, "stat", drill.stat);
    const cost = getTrainingCost(drill.cost);
    const disabled = full || slotsFull || state.gold < cost || adventurer.status !== "idle" || noGuildActions;
    const buttonText = full
      ? "Drill limit"
      : slotsFull ? "Yard full" : adventurer.status !== "idle" ? "Unavailable" : noGuildActions ? "No actions" : `${cost}G / ${duration}d`;
    return `
      <div class="training-row stat-drill ${full ? "locked" : ""}">
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
    const cost = getTrainingCost(ability.cost);
    const disabled = known || levelLocked || full || slotsFull || state.gold < cost || adventurer.status !== "idle" || noGuildActions;
    const buttonText = known
      ? "Learned"
      : levelLocked ? `Yard Lv ${ability.trainingLevel}` : full ? "Capacity full" : slotsFull ? "Yard full" : adventurer.status !== "idle" ? "Unavailable" : noGuildActions ? "No actions" : `${cost}G / ${duration}d`;
    return `
      <div class="training-row ${known ? "known" : ""} ${levelLocked ? "locked" : ""}">
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
  activeView = "guildhall";
  addLog(`${name} answers Mara's call as the Wayfarer's Rest's first and only adventurer.`);
  showChapterMoment("firstBriefing");
  render();
}

function randomiseFounder() {
  elements.founderName.value = names[Math.floor(Math.random() * names.length)];
  const classIds = ["warden", "spellwright", "ranger", "minstrel"];
  elements.founderClass.value = classIds[Math.floor(Math.random() * classIds.length)];
  elements.founderGender.value = Math.random() > 0.5 ? "female" : "male";
  renderFounderPreview();
}

function getRecruitmentCost() {
  return Math.max(0, RECRUITMENT_COST - (getSeasonFocus()?.id === "growGuild" ? 10 : 0));
}

function postRecruitmentNotice() {
  const recruitmentCost = getRecruitmentCost();
  if (!state.recruitment.unlocked || state.recruitment.order || state.recruitment.candidates.length > 0 || state.gold < recruitmentCost || state.adventurers.length >= getRosterCapacity()) {
    return;
  }
  if (!spendGuildAction("a recruitment notice")) {
    return;
  }
  const travelDays = 1 + Math.floor(Math.random() * 2);
  state.gold -= recruitmentCost;
  state.recruitment.order = {
    postedDay: state.day,
    readyDay: state.day + travelDays
  };
  addLog(`Mara posts a recruitment notice and pays ${recruitmentCost}G in food and travel costs. Applicants should arrive in ${travelDays} day${travelDays === 1 ? "" : "s"}.`);
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
  if (getSeasonFocus()?.id === "growGuild") {
    recruit.potential = Math.min(5, recruit.potential + 1);
  }
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
  recordChronicleEvent({ type: "recruit", heroId: candidate.id, highlight: `${candidate.name} joined Guildstead as a ${classes[candidate.classId].label}.` });
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
    lastQuestDay: 0,
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
    lastQuestDay: Math.max(0, Number(adventurer.lastQuestDay) || 0),
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
  const previousRank = getRank();
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
  syncRankReward(previousRank);
  addLog(outcome);
  recordChronicleEvent({ type: "story", heroIds: story.participants.map((adventurer) => adventurer.id), highlight: outcome });
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
  const effects = [...quirkIds, ...(adventurer.abilities || [])]
    .map((id) => quirkCatalog[id] || abilityCatalog[id])
    .filter(Boolean);
  const equipment = getEquipmentForAdventurer(adventurer.id);
  const equipmentEffect = equipment ? equipmentCatalog[equipment.recipeId]?.effect : null;
  return equipmentEffect ? [...effects, equipmentEffect] : effects;
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
  const partyRate = 1 + party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer).reduce((sum, effect) => sum + (effect.goldRate || 0), 0);
  }, 0);
  return partyRate * (getSeasonFocus()?.id === "prosperTogether" ? 1.08 : 1);
}

function getPartyFameBonus(party) {
  return party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer).reduce((sum, effect) => sum + (effect.fameBonus || 0), 0);
  }, 0);
}

function getXpRate(adventurer) {
  const characterRate = getCharacterEffects(adventurer).reduce((rate, effect) => rate * (effect.xpRate || 1), 1);
  return characterRate * (getSeasonFocus()?.id === "trainRoster" ? 1.1 : 1);
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
  if (adventurer.lastQuestDay === state.day) {
    return "Quested today";
  }
  return "Available";
}

function canAdventurerQuestToday(adventurer) {
  return Boolean(adventurer && adventurer.status === "idle" && adventurer.lastQuestDay !== state.day);
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

  cost = getTrainingCost(cost);

  if (state.gold < cost) {
    return;
  }
  if (!spendGuildAction("training")) {
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
    recordChronicleEvent({ type: "training", heroId: adventurer.id, highlight: `${adventurer.name} completed ${getTrainingJobName(job)}.` });
  });
  const completedIds = new Set(completed.map((job) => job.id));
  state.trainingJobs = getActiveTrainingJobs().filter((job) => !completedIds.has(job.id));
  if (announce) {
    const names = completed.map((job) => getAdventurer(job.adventurerId)?.name).filter(Boolean);
    showToast("Training complete", `${names.join(", ")} ${names.length === 1 ? "is" : "are"} ready for duty.`, "success");
  }
  return completed;
}

function getTrainingCost(baseCost) {
  return getSeasonFocus()?.id === "trainRoster" ? Math.ceil(baseCost * 0.8) : baseCost;
}

function toggleAdventurer(id) {
  const adventurer = getAdventurer(id);
  if (!canAdventurerQuestToday(adventurer)) {
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
  const partyIds = state.selectedIds.filter((id) => canAdventurerQuestToday(getAdventurer(id))).slice(0, 3);
  if (partyIds.length === 0) {
    return;
  }

  const party = partyIds.map(getAdventurer).filter(Boolean);
  const preparation = normaliseGuildPreparations(state.guildPreparations);
  const preparationSummary = getPreparationSummary();
  party.forEach((adventurer) => {
    adventurer.status = "busy";
    adventurer.lastQuestDay = state.day;
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
    powerBonus: preparation.nextQuestPower,
    goldBonus: preparation.nextQuestGoldBonus,
    fameBonus: 0,
    xpBonus: 0,
    injuryShield: preparation.nextQuestInjuryShield,
    preparationSummary
  });
  state.guildPreparations = normaliseGuildPreparations(null);

  if (mission.isEvent) {
    state.eventMissions = state.eventMissions.filter((eventMission) => eventMission.id !== mission.id);
    if (currentPopupEventId === mission.id) {
      currentPopupEventId = null;
    }
  }
  if (mission.rotatingRequest) {
    state.greenbank.requests = state.greenbank.requests.filter((request) => request.id !== mission.id);
  }

  state.selectedIds = [];
  partyPickerMissionId = null;
  addLog(`${party.map((adventurer) => adventurer.name).join(", ")} set out for ${mission.name}.`);
  if (preparationSummary.length) {
    addLog(`Expedition preparation used: ${preparationSummary.join(", ")}.`);
  }
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
  const previousRank = getRank();
  if (activeMission.encounterStatus === "active") {
    resolveEncounterChoice(activeMission.id, "trustParty", true, false);
  }
  const power = getPartyPower(party, mission) + (activeMission.powerBonus || 0);
  const roll = Math.floor(Math.random() * 18) + getPartyRollBonus(party);
  const success = mission.guaranteedSuccess || power + roll >= mission.difficulty;
  const partyNames = party.map((adventurer) => adventurer.name).join(", ");
  const villageBefore = { threat: state.greenbank.threat, confidence: state.greenbank.confidence };
  const heroBefore = party.map((adventurer) => ({
    id: adventurer.id,
    level: adventurer.level,
    xp: adventurer.xp,
    xpRequired: xpForNext(adventurer.level),
    abilities: [...(adventurer.abilities || [])]
  }));
  const xpAwards = {};
  let gold = 0;
  let fame = 0;
  let storyDecision = null;
  let outcomeNote = "The party returned to the tavern and shared what happened on the road.";

  if (success) {
    const baseGold = mission.gold + state.facilities.questBoard * 6 + (activeMission.goldBonus || 0);
    gold = Math.round(baseGold * getPartyGoldRate(party));
    fame = mission.fame + Math.floor(state.facilities.questBoard / 2) + getPartyFameBonus(party) + (activeMission.fameBonus || 0);
    state.gold += gold;
    state.fame += fame;
    if (mission.materials) {
      grantMaterials(mission.materials);
    }
    storyDecision = commitStoryMissionDecision(activeMission, mission);
    if (mission.rotatingRequest) {
      adjustGreenbank(mission.success);
      state.greenbank.completedRequests += 1;
      addNews(mission.headline, `${partyNames} completed ${mission.name}. The guild also recovered ${formatMaterials(mission.materials)} for its stores.`, "success");
    } else if (mission.localRequest) {
      adjustGreenbank({ threat: -6, confidence: 4 });
      addNews(`${mission.name} completed by the Wayfarer's Rest`, `${partyNames} return to Greenbank with another local problem settled.`, "success");
    }
    party.forEach((adventurer) => {
      adventurer.status = "idle";
      addLifeEvent(adventurer, `Completed ${mission.name} and helped earn ${fame} fame.`);
      const xp = Math.round((9 + mission.fame + state.facilities.trainingYard * 2 + (activeMission.xpBonus || 0)) * getXpRate(adventurer));
      xpAwards[adventurer.id] = xp;
      grantXp(adventurer, xp);
    });
    addLog(`${partyNames} complete ${mission.name}, earning ${gold}G and ${fame} fame.`);
    recordChronicleEvent({
      type: "mission",
      success: true,
      heroIds: party.map((adventurer) => adventurer.id),
      focus: mission.focus,
      gold,
      fame,
      materials: mission.materials || {},
      highlight: `${partyNames} completed ${mission.name}.`
    });
    handleChapterMissionSuccess(mission);
    syncRankReward(previousRank);
    outcomeNote = `${partyNames} completed the contract and returned with ${gold}G and ${fame} fame.`;
  } else {
    gold = Math.floor(mission.gold * 0.3);
    state.gold += gold;
    party.forEach((adventurer) => {
      adventurer.status = "idle";
      addLifeEvent(adventurer, `Retreated from ${mission.name}, wiser and bruised.`);
      const xp = Math.round(4 * getXpRate(adventurer));
      xpAwards[adventurer.id] = xp;
      grantXp(adventurer, xp);
    });
    if (mission.rotatingRequest) {
      adjustGreenbank(mission.failure);
      addNews(`${mission.name} ends in a difficult retreat`, `${partyNames} return safely, but the unresolved problem weighs on Greenbank.`, "warning");
    }
    recordChronicleEvent({
      type: "mission",
      success: false,
      heroIds: party.map((adventurer) => adventurer.id),
      focus: mission.focus,
      gold,
      fame: 0,
      highlight: `${partyNames} returned from ${mission.name} with hard-earned lessons.`
    });
    if (activeMission.injuryShield > 0) {
      addLog(`${partyNames} retreat from ${mission.name}, but their earlier preparation prevents an injury.`);
      outcomeNote = "The expedition preparation held. Everyone escaped without a lasting injury.";
    } else {
      const injured = party[Math.floor(Math.random() * party.length)];
      injured.status = "injured";
      injured.recovery = Math.max(3, 12 - state.facilities.dormitory * 2 - getRecoveryReduction(injured));
      addLifeEvent(injured, `Was injured during ${mission.name}.`);
      addLog(`${partyNames} retreat from ${mission.name}. ${injured.name} needs ${injured.recovery}s to recover.`);
      outcomeNote = `${injured.name} was injured during the retreat and will need time to recover.`;
    }
  }

  const report = createExpeditionReport(activeMission, mission, party, {
    success,
    power,
    roll,
    gold,
    fame,
    heroBefore,
    xpAwards,
    villageBefore,
    storyDecision,
    outcomeNote
  });
  queueExpeditionReport(report);
  showToast("Party returned", `${mission.name} has a new Expedition Report.`, success ? "success" : "danger");
}

function createExpeditionReport(activeMission, mission, party, resolution) {
  const heroBeforeById = new Map(resolution.heroBefore.map((hero) => [hero.id, hero]));
  const heroes = party.map((adventurer) => {
    const before = heroBeforeById.get(adventurer.id) || {};
    return {
      id: adventurer.id,
      name: adventurer.name,
      classId: adventurer.classId,
      gender: adventurer.gender,
      founder: Boolean(adventurer.founder),
      levelBefore: before.level || adventurer.level,
      levelAfter: adventurer.level,
      xpBefore: before.xp || 0,
      xpAfter: adventurer.xp,
      xpRequiredBefore: before.xpRequired || xpForNext(before.level || adventurer.level),
      xpRequiredAfter: xpForNext(adventurer.level),
      xpGain: resolution.xpAwards[adventurer.id] || 0,
      abilitiesLearned: (adventurer.abilities || []).filter((id) => !(before.abilities || []).includes(id)),
      positiveQuirk: adventurer.quirks?.positive || "",
      negativeQuirk: adventurer.quirks?.negative || "",
      status: adventurer.status,
      recovery: adventurer.recovery || 0
    };
  });
  const encounter = encounterDeck[activeMission.encounterId];
  const encounterOutcome = activeMission.encounterOutcome || {};
  const decision = resolution.storyDecision
    ? {
        title: encounter?.title || "Guildmaster decision",
        label: resolution.storyDecision.label,
        result: resolution.storyDecision.result,
        consequence: resolution.storyDecision.consequence
      }
    : activeMission.encounterResult ? {
        title: encounter?.title || "Field decision",
        label: activeMission.encounterAutoResolved ? "Party instinct" : "Guildmaster's order",
        result: activeMission.encounterResult,
        consequence: ""
      } : null;
  const lootAwarded = encounterOutcome.lootId && (!mission.storyEncounter || resolution.success)
    ? encounterOutcome.lootId
    : "";
  return {
    id: `expedition-report-${crypto.randomUUID()}`,
    day: state.day,
    success: resolution.success,
    mission: {
      id: mission.id,
      name: mission.name,
      location: mission.location,
      focus: mission.focus,
      difficulty: mission.difficulty,
      story: Boolean(mission.storyEncounter),
      timeSensitive: isTimeSensitiveMission(mission)
    },
    summary: resolution.success
      ? `${heroes.map((hero) => hero.name).join(", ")} crossed the threshold with the contract complete and the road behind them.`
      : `${heroes.map((hero) => hero.name).join(", ")} made it back together after the expedition turned against them.`,
    rewards: {
      gold: resolution.gold,
      fame: resolution.fame,
      materials: resolution.success ? { ...(mission.materials || {}) } : {},
      lootId: lootAwarded
    },
    heroes,
    decision,
    outcomeNote: resolution.outcomeNote,
    score: {
      power: resolution.power,
      roll: resolution.roll,
      difficulty: mission.difficulty,
      bondPower: getRelationshipPartyPower(party)
    },
    village: {
      threatDelta: state.greenbank.threat - resolution.villageBefore.threat,
      confidenceDelta: state.greenbank.confidence - resolution.villageBefore.confidence,
      threatAfter: state.greenbank.threat,
      confidenceAfter: state.greenbank.confidence
    }
  };
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
  if (mission.encounterId && encounterDeck[mission.encounterId]) {
    return mission.encounterId;
  }
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

function commitStoryMissionDecision(activeMission, mission) {
  if (!mission.storyEncounter || state.chapter.goblinDecisions.some((decision) => decision.missionId === mission.id)) {
    return null;
  }
  const outcome = activeMission.encounterOutcome || {};
  if (!outcome.storyDecisionId) {
    return null;
  }
  const world = outcome.storyWorld || {};
  state.chapter.goblinIntel = Math.min(4, Math.max(0, state.chapter.goblinIntel + (world.intel || 0)));
  state.chapter.villageSupport = Math.min(4, Math.max(0, state.chapter.villageSupport + (world.support || 0)));
  adjustGreenbank({ threat: world.threat || 0, confidence: world.confidence || 0 });
  if (outcome.lootId) {
    grantLoot(outcome.lootId);
  }
  const decision = {
    missionId: mission.id,
    encounterId: activeMission.encounterId,
    choiceId: outcome.storyDecisionId,
    label: outcome.storyDecisionLabel || "Party decision",
    result: activeMission.encounterResult || "The party chose its own path.",
    consequence: outcome.consequence || "No lasting campaign advantage",
    day: state.day
  };
  state.chapter.goblinDecisions.push(decision);
  addLog(`${mission.name}: ${decision.label}. ${decision.consequence}.`);
  return decision;
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
    return total + stats.str + stats.mag + stats.wit + stats.cha + stats[mission.focus] * 1.5 + adventurer.level * 2 + getPotentialPower(adventurer);
  }, 0);
  const effectPower = party.reduce((total, adventurer) => {
    return total + getCharacterEffects(adventurer)
      .reduce((sum, effect) => sum + getEffectMissionPower(effect, mission, party.length), 0);
  }, 0);
  const facilityPower =
    state.facilities.trainingYard * 2 +
    state.facilities.workshop * 3 +
    state.facilities.kitchen * 2 +
    state.facilities.dormitory +
    state.facilities.tavern;
  return Math.floor(statPower / 3 + facilityPower) + effectPower + getRelationshipPartyPower(party);
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

function getQueuedFacilityOrder(facilityId) {
  syncGuildActionDay();
  return state.guildActions.orders.find((queuedOrder) => queuedOrder.facilityId === facilityId) || null;
}

function getFacilityOrderAvailability(order) {
  if (!order || (state.facilities[order.facilityId] || 0) < 1) {
    return "Room Locked";
  }
  const queued = getQueuedFacilityOrder(order.facilityId);
  if (queued) {
    return queued.orderId === order.id ? "Queued" : "Room Busy";
  }
  if (getGuildActionsRemaining() < 1) {
    return "No Actions";
  }
  const idleCount = state.adventurers.filter((adventurer) => adventurer.status === "idle").length;
  if (order.requiresIdle && idleCount < order.requiresIdle) {
    return `Needs ${order.requiresIdle} Hero${order.requiresIdle === 1 ? "" : "es"}`;
  }
  const injuredCount = state.adventurers.filter((adventurer) => adventurer.status === "injured").length;
  if (order.requiresInjured && injuredCount < order.requiresInjured) {
    return "No Injuries";
  }
  if (order.effect === "realmEvent" && state.eventMissions.length >= 3) {
    return "Event Board Full";
  }
  const preparations = normaliseGuildPreparations(state.guildPreparations);
  if (["questPower", "provisions", "workshopPower"].includes(order.effect) && preparations.nextQuestPower >= 24) {
    return "Power Prepared";
  }
  if (order.effect === "questGold" && preparations.nextQuestGoldBonus >= 80) {
    return "Reward Prepared";
  }
  if (order.effect === "injuryShield" && preparations.nextQuestInjuryShield >= 1) {
    return "Kit Ready";
  }
  return "";
}

function queueFacilityOrder(orderId) {
  const order = facilityOrderCatalog.find((item) => item.id === orderId);
  if (!order || getFacilityOrderAvailability(order)) {
    return false;
  }
  if (!spendGuildAction(order.title)) {
    return false;
  }
  state.guildActions.orders.push({
    orderId: order.id,
    facilityId: order.facilityId,
    queuedDay: state.day,
    participantIds: state.adventurers.filter((adventurer) => adventurer.status === "idle").map((adventurer) => adventurer.id),
    patientIds: state.adventurers.filter((adventurer) => adventurer.status === "injured").map((adventurer) => adventurer.id)
  });
  addLog(`${order.title} is assigned in the ${facilities.find((facility) => facility.id === order.facilityId)?.name}.`);
  render();
  showToast("Room order issued", `${order.title} will resolve when you end the day.`, "info");
  return true;
}

function resolveFacilityOrders() {
  syncGuildActionDay();
  const queuedOrders = [...state.guildActions.orders];
  state.guildActions.orders = [];
  return queuedOrders
    .map((queuedOrder) => ({ queuedOrder, order: facilityOrderCatalog.find((order) => order.id === queuedOrder.orderId) }))
    .filter(({ order }) => Boolean(order))
    .map(({ order, queuedOrder }) => resolveFacilityOrder(order, queuedOrder));
}

function resolveFacilityOrder(order, queuedOrder = {}) {
  const level = Math.max(1, state.facilities[order.facilityId] || 1);
  const orderedHeroes = (queuedOrder.participantIds || []).map(getAdventurer).filter(Boolean);
  const idleHeroes = orderedHeroes.length ? orderedHeroes : state.adventurers.filter((adventurer) => adventurer.status === "idle");
  state.guildPreparations = normaliseGuildPreparations(state.guildPreparations);
  let result = "The order is complete.";

  if (order.effect === "goldIncome") {
    const amount = 12 + level * 4;
    state.gold += amount;
    result = `Hospitality brings in ${amount}G.`;
  } else if (order.effect === "heroSupper") {
    const xp = 2 + level;
    idleHeroes.forEach((adventurer) => {
      grantXp(adventurer, xp);
      addLifeEvent(adventurer, `Joined the ${order.title} at the guild.`);
    });
    if (idleHeroes.length > 1) {
      adjustRelationship(idleHeroes[0].id, idleHeroes[1].id, 1, `${order.title} gave them an easy evening together.`);
    }
    result = `${idleHeroes.length} available hero${idleHeroes.length === 1 ? " gains" : "es gain"} ${xp} experience${idleHeroes.length > 1 ? " and a little friendship" : ""}.`;
  } else if (order.effect === "realmEvent") {
    const created = scoutForEvent(true, false);
    if (created) {
      result = "A fresh realm event is pinned to the map.";
    } else {
      state.gold += 10;
      result = "The roads are quiet, but the runner returns 10G in unused expenses.";
    }
  } else if (order.effect === "questGold") {
    const amount = 18 + level * 4;
    const before = state.guildPreparations.nextQuestGoldBonus;
    state.guildPreparations.nextQuestGoldBonus = Math.min(80, before + amount);
    result = `The next successful expedition will earn ${state.guildPreparations.nextQuestGoldBonus - before}G extra.`;
  } else if (order.effect === "recovery") {
    const seconds = 8 + level * 2;
    const orderedPatients = (queuedOrder.patientIds || []).map(getAdventurer).filter((adventurer) => adventurer?.status === "injured");
    const injuredHeroes = orderedPatients.length ? orderedPatients : state.adventurers.filter((adventurer) => adventurer.status === "injured");
    injuredHeroes.forEach((adventurer) => {
      adventurer.recovery = Math.max(0, adventurer.recovery - seconds);
      if (adventurer.recovery === 0) {
        adventurer.status = "idle";
        addLifeEvent(adventurer, "Recovered early after a dedicated Dormitory recovery round.");
      }
    });
    result = `${injuredHeroes.length} injured hero${injuredHeroes.length === 1 ? " recovers" : "es recover"} up to ${seconds} seconds sooner.`;
  } else if (order.effect === "bond") {
    if (idleHeroes.length > 1) {
      adjustRelationship(idleHeroes[0].id, idleHeroes[1].id, 2, "Shared quarters turned a quiet evening into a lasting story.");
      result = `${idleHeroes[0].name} and ${idleHeroes[1].name} grow closer.`;
    } else {
      result = "The room rota is postponed because too few adventurers are available.";
    }
  } else if (order.effect === "idleXp") {
    const xp = 3 + level;
    idleHeroes.forEach((adventurer) => {
      grantXp(adventurer, xp);
      addLifeEvent(adventurer, `Joined the ${order.title} session.`);
    });
    result = `${idleHeroes.length} available hero${idleHeroes.length === 1 ? " gains" : "es gain"} ${xp} experience.`;
  } else if (order.effect === "questPower") {
    const amount = 2 + level;
    const before = state.guildPreparations.nextQuestPower;
    state.guildPreparations.nextQuestPower = Math.min(24, before + amount);
    result = `The next expedition gains ${state.guildPreparations.nextQuestPower - before} power from its briefing.`;
  } else if (order.effect === "provisions") {
    const amount = 4 + level * 2;
    const before = state.guildPreparations.nextQuestPower;
    state.guildPreparations.nextQuestPower = Math.min(24, before + amount);
    result = `Packed provisions add ${state.guildPreparations.nextQuestPower - before} power to the next expedition.`;
  } else if (order.effect === "workshopPower") {
    const amount = 4 + level * 2;
    const before = state.guildPreparations.nextQuestPower;
    state.guildPreparations.nextQuestPower = Math.min(24, before + amount);
    result = `Serviced equipment adds ${state.guildPreparations.nextQuestPower - before} power to the next expedition.`;
  } else if (order.effect === "injuryShield") {
    state.guildPreparations.nextQuestInjuryShield = 1;
    result = "The next expedition can prevent one injury after a failed quest.";
  }

  addLog(`${order.title} complete: ${result}`);
  return { orderId: order.id, title: order.title, result };
}

function upgradeFacility(id) {
  const facility = facilities.find((item) => item.id === id);
  if (!facility) {
    return;
  }
  const current = state.facilities[id] || 0;
  const cost = upgradeCost(facility);
  const materialCost = getFacilityMaterialCost(id);
  if (!isFacilityUnlocked(id) || current >= 5 || state.gold < cost || !canAffordMaterials(materialCost)) {
    return;
  }
  if (!spendGuildAction(current === 0 ? "construction" : "a facility upgrade")) {
    return;
  }
  spendMaterials(materialCost);
  state.gold -= cost;
  state.facilities[id] = current + 1;
  const built = current === 0;
  addLog(built ? `${facility.name} is built at the Wayfarer's Rest.` : `${facility.name} improves to level ${state.facilities[id]}.`);
  recordChronicleEvent({
    type: "facility",
    label: built ? `${facility.name} built` : `${facility.name} Level ${state.facilities[id]}`,
    highlight: built ? `${facility.name} opened at the Wayfarer's Rest.` : `${facility.name} reached Level ${state.facilities[id]}.`
  });
  if (id === "questBoard" && built && state.chapter.stage === "buildBoard") {
    state.chapter.stage = "localRequests";
    activeView = "quest";
    addLog("Mara pins the first three local requests to the new board.");
    const newRequests = generateGreenbankRequests(2);
    if (newRequests.length) {
      addNews("Greenbank sends its first requests to the tavern", "The new Quest Board has barely settled on its hooks before local notices begin to arrive.", "guild");
    }
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

function generateGreenbankRequests(count = 1) {
  if (!state.founderCreated || state.facilities.questBoard < 1) {
    return [];
  }
  const openSlots = Math.max(0, 3 - state.greenbank.requests.length);
  const requestedCount = Math.min(count, openSlots);
  if (requestedCount < 1) {
    return [];
  }
  const activeTemplateIds = new Set([
    ...state.greenbank.requests.map((request) => request.templateId),
    ...state.activeMissions.map((mission) => mission.missionSnapshot?.templateId).filter(Boolean)
  ]);
  const available = greenbankRequestDeck.filter((template) => !activeTemplateIds.has(template.templateId));
  const created = [];
  for (let index = 0; index < requestedCount && available.length; index += 1) {
    const templateIndex = Math.floor(Math.random() * available.length);
    const template = available.splice(templateIndex, 1)[0];
    const difficultyGrowth = Math.min(18, Math.floor(Math.max(0, state.day - 1) / 7) * 2);
    const request = {
      ...template,
      id: `request-${crypto.randomUUID()}`,
      rotatingRequest: true,
      spawnedDay: state.day,
      expiresDay: state.day + template.expiresIn,
      difficulty: template.difficulty + difficultyGrowth
    };
    state.greenbank.requests.push(request);
    created.push(request);
  }
  state.greenbank.lastRequestDay = state.day;
  return created;
}

function expireGreenbankRequests() {
  const expired = state.greenbank.requests.filter((request) => request.expiresDay < state.day);
  expired.forEach((request) => {
    adjustGreenbank(request.failure);
    state.greenbank.missedRequests += 1;
    addNews(request.missedHeadline, `${request.name} went unanswered. Greenbank's confidence falls as the goblin threat grows.`, "warning");
    addLog(`${request.name} expires unanswered.`);
    recordChronicleEvent({ type: "missedRequest", highlight: `${request.name} expired before the guild could respond.` });
  });
  const expiredIds = new Set(expired.map((request) => request.id));
  state.greenbank.requests = state.greenbank.requests.filter((request) => !expiredIds.has(request.id));
  return expired;
}

function addAmbientGreenbankNews() {
  const threat = state.greenbank.threat;
  const confidence = state.greenbank.confidence;
  const headlines = threat >= 70
    ? [
        ["Empty carts return from the north road", "Several traders turned back after spotting watchfires near Barrow Hill."],
        ["Greenbank families bring livestock inside", "Mara reports a quieter common room and more nervous conversations after sunset."]
      ]
    : confidence >= 70
      ? [
          ["Children chalk guild crests beside the market", "The drawings are not entirely accurate, but the enthusiasm is unmistakable."],
          ["Travellers add Guildstead to their route", "More passing merchants are asking whether the tavern has rooms to spare."]
        ]
      : [
          ["Market talk turns to the new guild", "Opinions remain mixed, although Mara notes that everyone is still talking about it."],
          ["Rain keeps Greenbank close to its hearths", "A quiet evening leaves plenty of time for rumours, repairs, and second helpings."]
        ];
  const selected = headlines[state.day % headlines.length];
  return addNews(selected[0], selected[1], threat >= 70 ? "warning" : "local");
}

function scoutForEvent(force = false, useGuildAction = false) {
  if (!state.founderCreated || state.facilities.questBoard < 1 || state.eventMissions.length >= 3) {
    return false;
  }
  if (!force && Math.random() > 0.55) {
    addLog("The scouts report quiet roads across Jenny's realm.");
    render();
    return false;
  }
  const available = eventMissionDeck.filter((template) => {
    return !state.eventMissions.some((eventMission) => eventMission.templateId === template.templateId);
  });
  if (available.length === 0) {
    return false;
  }
  if (useGuildAction && !spendGuildAction("realm scouting")) {
    return false;
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
  return true;
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

function getFacilityMaterialCost(facilityId) {
  const level = state.facilities[facilityId] || 0;
  if (level < 1) {
    return {};
  }
  const baseCosts = {
    tavern: { timber: 2 },
    questBoard: { timber: 1, iron: 1 },
    dormitory: { timber: 2, herbs: 1 },
    trainingYard: { timber: 1, iron: 2 },
    kitchen: { timber: 1, herbs: 2 },
    workshop: { timber: 1, iron: 3 }
  };
  return Object.entries(baseCosts[facilityId] || {}).reduce((cost, [id, amount]) => {
    cost[id] = amount * level;
    return cost;
  }, {});
}

function advanceDays(amount) {
  const endingDay = state.day;
  const before = {
    gold: state.gold,
    threat: state.greenbank.threat,
    confidence: state.greenbank.confidence,
    rank: getRank()
  };
  syncGuildActionDay();
  const unusedActions = getGuildActionsRemaining();
  const administrationIncome = unusedActions * 2;
  const completedOrders = resolveFacilityOrders();
  if (administrationIncome > 0) {
    state.gold += administrationIncome;
    addLog(`${unusedActions} unused Guild Action${unusedActions === 1 ? "" : "s"} handle routine administration and earn ${administrationIncome}G.`);
  }
  state.day += amount;
  state.guildActions = normaliseGuildActions(null, state.day);
  checkBirthdays();
  const completedTraining = processTrainingCompletions(false);
  expireEvents();
  if (state.facilities.questBoard > 0) {
    const baseThreatGrowth = state.chapter.charterEarned ? 1 : 2;
    const focusReduction = getSeasonFocus()?.id === "protectGreenbank" ? 1 : 0;
    adjustGreenbank({ threat: Math.max(0, baseThreatGrowth - focusReduction) });
  }
  const expiredRequests = expireGreenbankRequests();
  const requestTarget = state.greenbank.threat >= 70 ? 3 : 2;
  const newRequests = generateGreenbankRequests(Math.max(0, requestTarget - state.greenbank.requests.length));
  const confidenceModifier = state.greenbank.confidence >= 70 ? 2 : state.greenbank.confidence < 30 ? -2 : 0;
  const threatModifier = state.greenbank.threat >= 70 ? -3 : state.greenbank.threat >= 45 ? -1 : 0;
  const villageModifier = confidenceModifier + threatModifier;
  const focusIncome = getSeasonFocus()?.id === "prosperTogether" ? 3 : 0;
  const stipend = Math.max(5, 10 + state.facilities.tavern * 3 + state.facilities.kitchen * 3 + villageModifier + focusIncome);
  state.gold += stipend;
  if (endingDay % 7 === 0) {
    const upkeep = Math.max(8, state.adventurers.length * 7 - state.fame);
    state.gold = Math.max(0, state.gold - upkeep);
    addLog(`Weekly upkeep costs ${upkeep}G. The guild accountant looks heroic for once.`);
  } else {
    addLog(`A steady day brings in ${stipend}G from odd jobs and room hire.`);
  }
  const recruitmentArrived = processRecruitmentArrivals();
  const tavernEventCreated = !recruitmentArrived && maybeCreateTavernEvent();
  if (!tavernEventCreated && state.founderCreated && state.facilities.questBoard > 0 && state.day % 3 === 0 && state.eventMissions.length < 2) {
    scoutForEvent(true, false);
  }
  addAmbientGreenbankNews();
  syncRankReward(before.rank);
  const notices = [];
  completedOrders.forEach((order) => notices.push({ mark: "O", text: `${order.title}: ${order.result}` }));
  completedTraining.forEach((job) => notices.push({ mark: "T", text: `${getAdventurer(job.adventurerId)?.name || "An adventurer"} completed ${getTrainingJobName(job)}.` }));
  if (recruitmentArrived) {
    notices.push({ mark: "R", text: "New recruitment applicants are waiting in the tavern." });
  }
  if (expiredRequests.length) {
    notices.push({ mark: "!", text: `${expiredRequests.length} Greenbank request${expiredRequests.length === 1 ? "" : "s"} expired unanswered.` });
  }
  if (unusedActions > 0) {
    notices.push({ mark: "G", text: `${unusedActions} unused action${unusedActions === 1 ? "" : "s"} earned ${administrationIncome}G through routine administration.` });
  }
  const currentNews = state.greenbank.news.filter((item) => item.day === state.day).slice(0, 3);
  const dailyReport = {
    day: state.day,
    title: state.greenbank.threat >= 70 ? "Watchfires Above Greenbank" : state.greenbank.confidence >= 70 ? "Greenbank Backs Its Guild" : "A New Day In Greenbank",
    changes: {
      gold: state.gold - before.gold,
      threat: state.greenbank.threat - before.threat,
      confidence: state.greenbank.confidence - before.confidence
    },
    headlines: currentNews,
    notices,
    newRequests: newRequests.map((request) => request.name)
  };
  const chronicleReport = completeChroniclePeriods(endingDay);
  state.greenbank.lastReport = chronicleReport || dailyReport;
  morningReportDialogOpen = Boolean(state.founderCreated && !currentChapterMomentId);
  if (morningReportDialogOpen) {
    tavernLifeDialogOpen = false;
  }
  render();
  if (completedOrders.length > 0) {
    showToast("Room orders complete", completedOrders.map((order) => order.title).join(", "), "success");
  } else if (completedTraining.length > 0) {
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
    recruitment: { title: "Recruit a second adventurer", detail: `Post a ${getRecruitmentCost()}G tavern notice, wait for applicants, then choose one.`, progress: 27 },
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
  const heroName = state.adventurers.find((adventurer) => adventurer.founder)?.name || "Guildmaster";
  const formatCopy = (value = "") => value.replaceAll("{hero}", heroName);
  const kind = moment.kind || "milestone";
  elements.chapterDialogPanel.className = `event-panel chapter-panel guild-story-panel kind-${kind}`;
  elements.chapterDialogArt.className = `event-art chapter-art guild-story-art portrait-${moment.portrait || "mara"}`;
  elements.chapterDialogKind.textContent = kind === "briefing" ? "Mara's Briefing" : kind === "unlock" ? "New Opportunity" : kind === "warning" ? "Guild Alert" : kind === "celebration" ? "Guild Celebration" : "Guild Story";
  elements.chapterDialogSpeaker.textContent = moment.speaker || "Mara";
  elements.chapterDialogRole.textContent = moment.role || "Guild Steward";
  elements.chapterDialogEyebrow.textContent = moment.eyebrow;
  elements.chapterDialogTitle.textContent = moment.title;
  const copy = moment.copy || [moment.text || ""];
  elements.chapterDialogText.innerHTML = copy.map((paragraph) => `<p>${formatCopy(paragraph)}</p>`).join("");
  elements.chapterDialogCallout.classList.toggle("hidden", !moment.callout);
  elements.chapterDialogCallout.innerHTML = moment.callout ? `
    <div><small>${moment.callout.label}</small><strong>${formatCopy(moment.callout.title)}</strong><p>${formatCopy(moment.callout.detail)}</p>${moment.callout.facts?.length ? `<div class="story-facts">${moment.callout.facts.map((fact) => `<span>${formatCopy(fact)}</span>`).join("")}</div>` : ""}</div>
  ` : "";
  elements.chapterDialogSteps.classList.toggle("hidden", !moment.steps?.length);
  elements.chapterDialogSteps.innerHTML = (moment.steps || []).map((step) => `
    <li><span>${step.mark}</span><div><strong>${formatCopy(step.title)}</strong><small>${formatCopy(step.detail)}</small></div></li>
  `).join("");
  elements.chapterDialogButton.textContent = moment.button;
}

function closeChapterMoment() {
  const momentId = currentChapterMomentId;
  const moment = currentChapterMomentId ? chapterMoments[currentChapterMomentId] : null;
  if (momentId === "firstBriefing") {
    const founder = state.adventurers.find((adventurer) => adventurer.founder && adventurer.status === "idle");
    if (founder) {
      state.selectedIds = [founder.id];
    }
  }
  clearStoryMoment(true);
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
  state.storyEvents.pending = id;
}

function clearStoryMoment(markSeen = false) {
  const id = currentChapterMomentId || state.storyEvents.pending;
  if (markSeen && id && !state.storyEvents.seen.includes(id)) {
    state.storyEvents.seen.push(id);
    state.storyEvents.seen = state.storyEvents.seen.slice(-30);
  }
  currentChapterMomentId = null;
  state.storyEvents.pending = null;
}

function handleChapterMissionSuccess(mission) {
  if (mission.storyEncounter && !state.chapter.completedStoryMissions.includes(mission.id)) {
    state.chapter.completedStoryMissions.push(mission.id);
  }
  if (mission.tutorial && state.chapter.stage === "firstQuest") {
    adjustGreenbank({ threat: -4, confidence: 5 });
    addNews("Stolen tavern supplies returned from Greenbank Lane", "The Wayfarer's Rest has produced its first local hero, and Mara is already making plans.", "success");
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
    state.greenbank.threat = 8;
    adjustGreenbank({ confidence: 15 });
    addNews("Barrow Hill chief defeated", "Greenbank wakes to open roads, ringing market bells, and the news that its roadside tavern is now a chartered guild.", "success");
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
  if (mission.storyEncounter && state.chapter.completedStoryMissions.includes(mission.id)) {
    return "Story resolved";
  }
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

function getGuildActionCapacity(rank = getRank()) {
  const allowances = { F: 3, D: 4, C: 5, B: 6, A: 7, S: 8 };
  return allowances[rank] || 3;
}

function syncGuildActionDay() {
  if (!state.guildActions || state.guildActions.day !== state.day) {
    state.guildActions = normaliseGuildActions(null, state.day);
  }
}

function getGuildActionsRemaining() {
  syncGuildActionDay();
  return Math.max(0, getGuildActionCapacity() - state.guildActions.spent);
}

function spendGuildAction(label) {
  syncGuildActionDay();
  if (getGuildActionsRemaining() < 1) {
    showToast("No Guild Actions left", `End the day before assigning ${label.toLowerCase()}.`, "danger");
    return false;
  }
  state.guildActions.spent += 1;
  return true;
}

function getPreparationSummary() {
  const preparation = normaliseGuildPreparations(state.guildPreparations);
  const summary = [];
  if (preparation.nextQuestPower > 0) {
    summary.push(`+${preparation.nextQuestPower} next-quest power`);
  }
  if (preparation.nextQuestGoldBonus > 0) {
    summary.push(`+${preparation.nextQuestGoldBonus}G next reward`);
  }
  if (preparation.nextQuestInjuryShield > 0) {
    summary.push(`${preparation.nextQuestInjuryShield} injury kit${preparation.nextQuestInjuryShield === 1 ? "" : "s"} ready`);
  }
  return summary;
}

function renderGuildActions() {
  if (!elements.guildActionBar) {
    return;
  }
  syncGuildActionDay();
  const capacity = getGuildActionCapacity();
  const remaining = getGuildActionsRemaining();
  const queuedOrders = state.guildActions.orders
    .map((queuedOrder) => facilityOrderCatalog.find((order) => order.id === queuedOrder.orderId)?.title)
    .filter(Boolean);
  const preparations = getPreparationSummary();
  const commitments = [
    ...queuedOrders.map((title) => `<span class="action-commitment order">${title}</span>`),
    ...preparations.map((description) => `<span class="action-commitment prepared">${description}</span>`)
  ].join("");
  const seals = Array.from({ length: capacity }, (_, index) => `
    <span class="guild-action-seal ${index < state.guildActions.spent ? "spent" : "available"}" aria-label="Action ${index + 1} ${index < state.guildActions.spent ? "spent" : "available"}"><i></i></span>
  `).join("");

  elements.guildActionBar.innerHTML = `
    <div class="guild-action-summary">
      <div><p class="eyebrow">Guildmaster Actions</p><strong>${remaining} of ${capacity} available</strong><small>Rank ${getRank()} allowance</small></div>
    </div>
    <div class="guild-action-seals" aria-label="${remaining} of ${capacity} Guild Actions available">${seals}</div>
    <div class="action-commitments">${commitments}</div>
  `;

  elements.nextDay.textContent = "End Day";
  elements.nextDay.title = remaining > 0
    ? `${remaining} unused Guild Action${remaining === 1 ? "" : "s"} will become routine administration income.`
    : "Resolve today's orders and begin the next day.";
  elements.nextDay.classList.toggle("ready", remaining === 0 || queuedOrders.length > 0);
  const scoutingUnavailable = !state.founderCreated || state.facilities.questBoard < 1 || state.eventMissions.length >= 3;
  elements.scoutEvent.disabled = scoutingUnavailable || remaining < 1;
  elements.scoutEvent.textContent = remaining < 1 ? "No Actions" : "Scout Event";
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

function getCalendar(day = state.day) {
  const seasons = ["Spring", "Summer", "Autumn", "Winter"];
  const yearLength = 112;
  const dayOfYear = (day - 1) % yearLength;
  return {
    season: seasons[Math.floor(dayOfYear / 28)],
    seasonDay: (dayOfYear % 28) + 1,
    year: Math.floor((day - 1) / yearLength) + 1
  };
}

function getMissionOdds(party, mission) {
  if (!party.length) {
    return 0;
  }
  if (mission.guaranteedSuccess) {
    return 100;
  }
  const power = getPartyPower(party, mission) + normaliseGuildPreparations(state.guildPreparations).nextQuestPower;
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
  return missionDeck.find((mission) => mission.id === id)
    || state.greenbank.requests.find((mission) => mission.id === id)
    || state.eventMissions.find((mission) => mission.id === id);
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
