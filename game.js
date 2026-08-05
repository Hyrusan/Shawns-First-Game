const STORAGE_KEY = "guildstead-demo-save";
const SAVE_VERSION = 7;

const classes = {
  warden: { label: "Warden", stats: { str: 9, mag: 3, wit: 5, cha: 5 } },
  spellwright: { label: "Spellwright", stats: { str: 3, mag: 9, wit: 7, cha: 4 } },
  ranger: { label: "Ranger", stats: { str: 6, mag: 4, wit: 8, cha: 5 } },
  minstrel: { label: "Minstrel", stats: { str: 4, mag: 5, wit: 6, cha: 9 } },
  rookie: { label: "Rookie", stats: { str: 5, mag: 4, wit: 5, cha: 5 } }
};

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
    duration: 7,
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
    duration: 8,
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
    duration: 9,
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
    duration: 10,
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
    duration: 13,
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
    duration: 14,
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
    duration: 12,
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
    duration: 13,
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
    duration: 15,
    gold: 96,
    fame: 18,
    focus: "wit",
    expiresIn: 5,
    marker: { left: "84%", top: "50%" }
  }
];

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
  mapStatus: document.querySelector("#mapStatus"),
  chapterObjective: document.querySelector("#chapterObjective"),
  eventMissionList: document.querySelector("#eventMissionList"),
  scoutEvent: document.querySelector("#scoutEventButton"),
  dockButtons: document.querySelectorAll("[data-view]"),
  viewPanels: document.querySelectorAll("[data-panel]"),
  activeViewEyebrow: document.querySelector("#activeViewEyebrow"),
  activeViewTitle: document.querySelector("#activeViewTitle"),
  creatorPanel: document.querySelector("#creatorPanel"),
  founderName: document.querySelector("#founderName"),
  founderClass: document.querySelector("#founderClass"),
  founderPreview: document.querySelector("#founderPreview"),
  createFounder: document.querySelector("#createFounderButton"),
  randomFounder: document.querySelector("#randomFounderButton"),
  recruit: document.querySelector("#recruitButton"),
  rosterList: document.querySelector("#rosterList"),
  selectedSummary: document.querySelector("#selectedSummary"),
  adventurerDetail: document.querySelector("#adventurerDetail"),
  missionList: document.querySelector("#missionList"),
  eventLog: document.querySelector("#eventLog"),
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
elements.recruit.addEventListener("click", recruitAdventurer);
elements.reset.addEventListener("click", resetGame);
elements.nextDay.addEventListener("click", () => advanceDays(1));
elements.scoutEvent.addEventListener("click", () => {
  scoutForEvent(true);
  render();
});
elements.closeEvent.addEventListener("click", closeEventDialog);
elements.viewEvent.addEventListener("click", viewPopupEvent);
elements.chapterDialogButton.addEventListener("click", closeChapterMoment);
elements.founderName.addEventListener("input", renderFounderPreview);
elements.founderClass.addEventListener("change", renderFounderPreview);
elements.dockButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

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
    founderCreated: false
  };
}

function loadState() {
  const fresh = defaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object" || ![4, 5, 6, SAVE_VERSION].includes(saved.version)) {
      return fresh;
    }
    const legacySave = saved.version < SAVE_VERSION;
    const progressedLegacySave = legacySave && Boolean(saved.founderCreated);
    const savedFacilities = saved.facilities || {};
    const migratedFacilities = legacySave
      ? progressedLegacySave ? {
          tavern: savedFacilities.tavern || 1,
          questBoard: savedFacilities.questBoard || 1,
          dormitory: savedFacilities.infirmary || 1,
          trainingYard: savedFacilities.trainingYard || 1,
          kitchen: 1,
          workshop: savedFacilities.workshop || 1
        } : fresh.facilities
      : { ...fresh.facilities, ...savedFacilities };
    const migratedChapter = legacySave
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
      selectedIds: []
    };
    loaded.adventurers = (saved.adventurers || []).map((adventurer) => normaliseAdventurer(adventurer, loaded.day));
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
  renderLog();
  renderEventDialog();
  renderChapterDialog();
  renderChapterProgress();
  renderActiveView();
  renderFounderPreview();
  renderIntroScene();
  saveState();
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
    .filter((facility) => state.facilities[facility.id] > 0)
    .map((facility) => `
      <button class="map-facility facility-${facility.id}" data-map-view="facilities" style="left:${facility.mapLeft};top:${facility.mapTop};--marker-colour:${facility.colour}" type="button" aria-label="${facility.name}, level ${state.facilities[facility.id]}">
        <span class="map-building" aria-hidden="true"><i>${facility.icon}</i></span>
        <span class="map-label">${facility.name}<b>Lv ${state.facilities[facility.id]}</b></span>
      </button>
    `)
    .join("");

  const missionMarkers = missionDeck
    .filter((mission) => isMissionVisible(mission))
    .map((mission) => `
      <button class="map-mission" data-map-view="quest" style="left:${mission.marker.left};top:${mission.marker.top}" type="button">
        <span class="mission-pin" aria-hidden="true"></span>
        <span class="map-label">${mission.location}<b>${mission.focus.toUpperCase()}</b></span>
      </button>
    `)
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
      <div class="dispatch-runner" style="--travel-x:${animation.travelX}px;--travel-y:${animation.travelY}px">
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
  });

  elements.viewPanels.forEach((panel) => {
    const panelName = panel.dataset.panel;
    const visible = panelName === activeView || (panelName === "hero" && activeView === "hero");
    panel.classList.toggle("active", visible);
  });

  if (state.founderCreated && activeView === "hero") {
    activeView = "adventurers";
    renderActiveView();
  }
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
  elements.recruit.disabled = !state.founderCreated || state.gold < 45 || rosterFull;
  elements.recruit.textContent = rosterFull ? "Dormitory Needed" : "Recruit 45G";

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
              <p class="card-meta">${adventurer.race} ${classes[adventurer.classId].label} | Age ${adventurer.age}</p>
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
          <p class="card-meta">${adventurer.race} ${classes[adventurer.classId].label} | Level ${adventurer.level} | ${adventurer.status}</p>
          <div class="xp-line"><span>Experience</span><strong>${adventurer.xp}/${xpForNext(adventurer.level)}</strong></div>
          <div class="progress-track slim"><div class="progress-fill" style="width:${xpProgress}%"></div></div>
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

      <div class="trait-grid">
        ${traitLabels.map(([key, label]) => renderTrait(label, adventurer.traits[key])).join("")}
      </div>

      <div class="life-log">
        <p class="eyebrow">Life Log</p>
        <ol>${history || `<li><strong>Day ${state.day}</strong> Waiting for their first story.</li>`}</ol>
      </div>
    </article>
  `;
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
              <span>${mission.duration}s</span>
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
            <p class="card-meta">${mission.location}</p>
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

function renderLog() {
  elements.eventLog.innerHTML = state.log
    .slice(0, 12)
    .map((entry) => `<li><strong>Day ${entry.day}</strong> ${entry.text}</li>`)
    .join("");
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

function renderSprite(adventurer, extraClass = "") {
  const slot = getSpriteSlot(adventurer);
  return `<span class="unit-sprite slot-${slot} ${extraClass}" aria-hidden="true"></span>`;
}

function getSpriteSlot(adventurer) {
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
  const classSlots = {
    warden: 0,
    spellwright: 1,
    ranger: 2,
    minstrel: 3,
    rookie: 4
  };
  return classSlots[adventurer.classId] ?? 0;
}

function renderFounderPreview() {
  if (!elements.founderPreview) {
    return;
  }
  const classId = elements.founderClass.value || "warden";
  const name = cleanName(elements.founderName.value) || "Your Hero";
  elements.founderPreview.innerHTML = `${renderSprite({ classId, race: "Human", name })}<span>${classes[classId].label}</span>`;
}

function createFounder() {
  if (state.founderCreated) {
    return;
  }
  const name = cleanName(elements.founderName.value) || "Founder";
  const classId = elements.founderClass.value;
  const founder = makeAdventurer(name, classId, true);
  state.adventurers.push(founder);
  state.adventurers.push(makeRecruit(2));
  state.adventurers.push(makeRecruit(3));
  selectedAdventurerId = founder.id;
  state.selectedIds = [founder.id];
  state.founderCreated = true;
  state.chapter.stage = "firstQuest";
  activeView = "quest";
  addLog(`${name} answers Mara's call. Two tavern regulars volunteer to help with the goblin problem.`);
  render();
  showToast("First job posted", `${name} is ready to recover the tavern supplies.`, "info");
}

function randomiseFounder() {
  elements.founderName.value = names[Math.floor(Math.random() * names.length)];
  const classIds = ["warden", "spellwright", "ranger", "minstrel"];
  elements.founderClass.value = classIds[Math.floor(Math.random() * classIds.length)];
  renderFounderPreview();
}

function recruitAdventurer() {
  if (!state.founderCreated || state.gold < 45 || state.adventurers.length >= getRosterCapacity()) {
    return;
  }
  state.gold -= 45;
  const recruit = makeRecruit(state.adventurers.length + 1);
  state.adventurers.push(recruit);
  selectedAdventurerId = recruit.id;
  addLog(`${recruit.name} signs on after hearing the tavern stew is almost edible.`);
  render();
  showToast("New recruit", `${recruit.name} the ${classes[recruit.classId].label} joined the guild.`, "success");
}

function makeRecruit(seed) {
  const classIds = ["warden", "spellwright", "ranger", "minstrel", "rookie"];
  const classId = classIds[Math.floor(Math.random() * classIds.length)];
  const name = names[(Math.floor(Math.random() * names.length) + seed) % names.length];
  const recruit = makeAdventurer(name, classId, false);
  const tavernBonus = state.facilities.tavern - 1;
  Object.keys(recruit.stats).forEach((stat) => {
    recruit.stats[stat] += Math.floor(Math.random() * (2 + tavernBonus));
  });
  return recruit;
}

function makeAdventurer(name, classId, founder) {
  const base = classes[classId].stats;
  const identity = makeIdentity(name, classId, founder, state.day);
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
    stats: { ...base }
  };
}

function makeIdentity(name, classId, founder, day) {
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
    age: founder ? 19 : 18 + Math.floor(Math.random() * 15),
    favouriteFood: pick(favouriteFoods),
    dream: pick(dreams),
    origin,
    birthdayDay: 1 + Math.floor(Math.random() * 28),
    traits: rollTraits(founder),
    lifeLog: [{ day: day || 1, text: firstEntry }]
  };
}

function normaliseAdventurer(adventurer, day) {
  const classId = classes[adventurer.classId] ? adventurer.classId : "rookie";
  const identity = makeIdentity(adventurer.name || "Adventurer", classId, Boolean(adventurer.founder), day || 1);
  return {
    ...adventurer,
    name: adventurer.name || "Adventurer",
    classId,
    race: adventurer.race || identity.race,
    age: adventurer.age || identity.age,
    favouriteFood: adventurer.favouriteFood || identity.favouriteFood,
    dream: adventurer.dream || identity.dream,
    origin: adventurer.origin || identity.origin,
    birthdayDay: adventurer.birthdayDay || identity.birthdayDay,
    traits: { ...identity.traits, ...(adventurer.traits || {}) },
    lifeLog: adventurer.lifeLog?.length ? adventurer.lifeLog : identity.lifeLog,
    stats: { ...classes[classId].stats, ...(adventurer.stats || {}) }
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

  state.activeMissions.push({
    id: crypto.randomUUID(),
    missionId,
    missionSnapshot: { ...mission },
    partyIds,
    elapsed: 0,
    duration: Math.max(5, mission.duration - Math.floor(Math.max(0, state.facilities.questBoard - 1) * 1.5))
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

function tick() {
  let changed = false;
  state.activeMissions.forEach((activeMission) => {
    activeMission.elapsed += 1;
    changed = true;
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
  const power = getPartyPower(party, mission);
  const roll = Math.floor(Math.random() * 18);
  const success = mission.guaranteedSuccess || power + roll >= mission.difficulty;
  const partyNames = party.map((adventurer) => adventurer.name).join(", ");

  if (success) {
    const gold = mission.gold + state.facilities.questBoard * 6;
    const fame = mission.fame + Math.floor(state.facilities.questBoard / 2);
    state.gold += gold;
    state.fame += fame;
    party.forEach((adventurer) => {
      adventurer.status = "idle";
      addLifeEvent(adventurer, `Completed ${mission.name} and helped earn ${fame} fame.`);
      grantXp(adventurer, 9 + mission.fame + state.facilities.trainingYard * 2);
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
      grantXp(adventurer, 4);
    });
    const injured = party[Math.floor(Math.random() * party.length)];
    injured.status = "injured";
    injured.recovery = Math.max(4, 12 - state.facilities.dormitory * 2);
    addLifeEvent(injured, `Was injured during ${mission.name}.`);
    addLog(`${partyNames} retreat from ${mission.name}. ${injured.name} needs ${injured.recovery}s to recover.`);
    showToast("Party retreated", `${injured.name} was injured at ${mission.location}.`, "danger");
  }
}

function getPartyPower(party, mission) {
  const statPower = party.reduce((total, adventurer) => {
    const stats = adventurer.stats;
    return total + stats.str + stats.mag + stats.wit + stats.cha + stats[mission.focus] * 1.5 + adventurer.level * 2;
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
    const favourite = adventurer.classId === "spellwright" ? "mag" : adventurer.classId === "minstrel" ? "cha" : adventurer.classId === "ranger" ? "wit" : "str";
    adventurer.stats[favourite] += 2;
    adventurer.stats.str += 1;
    adventurer.stats.wit += 1;
    addLifeEvent(adventurer, `Reached level ${adventurer.level} as a ${classes[adventurer.classId].label}.`);
    addLog(`${adventurer.name} reaches level ${adventurer.level}.`);
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
    travelY: Math.round(targetY)
  });
  renderMap();
  setTimeout(() => {
    dispatchAnimations = dispatchAnimations.filter((animation) => animation.id !== animationId);
    renderMap();
  }, 1500);
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
    state.chapter.stage = "buildBoard";
    showChapterMoment("questBoard");
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
  const requiredRoll = mission.difficulty - power;
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
