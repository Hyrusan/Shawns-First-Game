const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function makeElement() {
  const classNames = new Set();
  return {
    append() {},
    addEventListener() {},
    classList: {
      add(name) { classNames.add(name); },
      contains(name) { return classNames.has(name); },
      remove(name) { classNames.delete(name); },
      toggle(name, force) {
        const enabled = force === undefined ? !classNames.has(name) : Boolean(force);
        if (enabled) classNames.add(name);
        else classNames.delete(name);
        return enabled;
      }
    },
    dataset: {},
    innerHTML: "",
    muted: false,
    pause() {},
    paused: true,
    play() { return Promise.resolve(); },
    querySelector() { return makeElement(); },
    querySelectorAll() { return []; },
    remove() {},
    scrollIntoView() {},
    setAttribute() {},
    style: {},
    textContent: "",
    value: ""
  };
}

function createGameContext(savedGame) {
  const elements = new Map();
  const document = {
    addEventListener() {},
    body: makeElement(),
    createElement: makeElement,
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, makeElement());
      }
      return elements.get(selector);
    },
    querySelectorAll() { return []; }
  };
  const storage = new Map();
  if (savedGame) {
    storage.set("guildstead-demo-save", JSON.stringify(savedGame));
  }
  const context = vm.createContext({
    console,
    crypto: require("node:crypto").webcrypto,
    Date,
    document,
    localStorage: {
      getItem(key) { return storage.get(key) || null; },
      removeItem(key) { storage.delete(key); },
      setItem(key, value) { storage.set(key, value); }
    },
    Math,
    setInterval() { return 0; },
    setTimeout() { return 0; },
    window: { clearTimeout() {}, setTimeout() { return 0; } }
  });
  const source = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");
  vm.runInContext(source, context, { filename: "game.js" });
  return context;
}

function run(context, source) {
  return vm.runInContext(source, context);
}

test("the living tavern uses a bundled painted backdrop", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const backdrop = path.join(__dirname, "..", "assets", "tavern-interior-v1.webp");

  assert.match(styles, /url\("assets\/tavern-interior-v1\.webp"\)/);
  assert.match(index, /styles\.css\?v=18/);
  assert.ok(fs.existsSync(backdrop));
  assert.ok(fs.statSync(backdrop).size > 100_000);
});

test("a timed encounter exposes the founder's class response and records the choice", () => {
  const context = createGameContext();
  const result = run(context, `
    state.adventurers = [{
      id: "founder", name: "Jenny", gender: "female", classId: "warden", founder: true,
      level: 1, xp: 0, status: "busy", recovery: 0, potential: 5,
      stats: { str: 9, mag: 3, wit: 5, cha: 5 }, traits: {},
      quirks: { positive: "dauntless", negative: "homesick" }, abilities: ["shieldBash"], lifeLog: []
    }];
    state.activeMissions = [normaliseActiveMission({
      id: "mission-1", missionId: "stolenSupplies", missionSnapshot: { ...missionDeck[0] }, partyIds: ["founder"],
      elapsed: 7, duration: 30, startedAt: Date.now() - 7000, endsAt: Date.now() + 23000,
      encounterId: "goblinAmbush", encounterStatus: "waiting", encounterTriggerAt: 7
    })];
    const active = state.activeMissions[0];
    const update = updateMissionEncounter(active, Date.now());
    const choices = getAvailableEncounterChoices(encounterDeck[active.encounterId], state.adventurers);
    resolveEncounterChoice(active.id, "class-warden", false, false);
    ({ update, status: active.encounterStatus, choiceIds: choices.map((choice) => choice.id), powerBonus: active.powerBonus,
       damage: active.encounterDamage, history: state.adventurers[0].lifeLog[0].text });
  `);

  assert.equal(result.update, "triggered");
  assert.equal(result.status, "resolved");
  assert.deepEqual([...result.choiceIds], ["class-warden", "trustParty"]);
  assert.equal(result.powerBonus, 10);
  assert.equal(result.damage, 35);
  assert.match(result.history, /Led the response/);
});

test("an ignored encounter automatically uses the cautious party response", () => {
  const context = createGameContext();
  const result = run(context, `
    state.adventurers = [{
      id: "mage", name: "Mira", gender: "female", classId: "spellwright", founder: false,
      level: 1, xp: 0, status: "busy", recovery: 0, potential: 3,
      stats: { str: 3, mag: 9, wit: 7, cha: 4 }, traits: {},
      quirks: { positive: "quickStudy", negative: "stubborn" }, abilities: ["emberBolt"], lifeLog: []
    }];
    state.activeMissions = [normaliseActiveMission({
      id: "mission-2", missionId: "greenbankCart", missionSnapshot: { ...missionDeck[1] }, partyIds: ["mage"],
      elapsed: 18, duration: 36, startedAt: Date.now() - 18000, endsAt: Date.now() + 18000,
      encounterId: "collapsedBridge", encounterStatus: "active", encounterTriggerAt: 10,
      encounterExpiresAt: Date.now() - 1
    })];
    const active = state.activeMissions[0];
    const update = updateMissionEncounter(active, Date.now());
    ({ update, status: active.encounterStatus, automatic: active.encounterAutoResolved,
       result: active.encounterResult, powerBonus: active.powerBonus });
  `);

  assert.equal(result.update, "resolved");
  assert.equal(result.status, "resolved");
  assert.equal(result.automatic, true);
  assert.match(result.result, /cautious call/);
  assert.equal(result.powerBonus, 2);
});

test("quirk-gated cache choices add loot to persistent Guild Stores", () => {
  const context = createGameContext();
  const result = run(context, `
    state.adventurers = [{
      id: "ranger", name: "Elowen", gender: "female", classId: "ranger", founder: false,
      level: 2, xp: 0, status: "busy", recovery: 0, potential: 4,
      stats: { str: 6, mag: 4, wit: 10, cha: 5 }, traits: {},
      quirks: { positive: "keenEye", negative: "frail" }, abilities: ["aimedShot"], lifeLog: []
    }];
    state.activeMissions = [normaliseActiveMission({
      id: "mission-3", missionId: "lostWoodcutter", missionSnapshot: { ...missionDeck[2] }, partyIds: ["ranger"],
      elapsed: 14, duration: 42, startedAt: Date.now() - 14000, endsAt: Date.now() + 28000,
      encounterId: "hiddenCache", encounterStatus: "active", encounterTriggerAt: 12,
      encounterExpiresAt: Date.now() + 18000
    })];
    const active = state.activeMissions[0];
    const choices = getAvailableEncounterChoices(encounterDeck.hiddenCache, state.adventurers);
    resolveEncounterChoice(active.id, "keenEye", false, false);
    ({ choiceIds: choices.map((choice) => choice.id), loot: state.inventory.silverCharm,
       goldBonus: active.goldBonus, outcomeLoot: active.encounterOutcome.lootId });
  `);

  assert.deepEqual([...result.choiceIds], ["keenEye", "class-ranger", "trustParty"]);
  assert.equal(result.loot, 1);
  assert.equal(result.goldBonus, 24);
  assert.equal(result.outcomeLoot, "silverCharm");
});

test("version 9 saves gain current systems without losing active missions", () => {
  const now = Date.now();
  const context = createGameContext({
    version: 9,
    screen: "game",
    day: 4,
    gold: 120,
    fame: 3,
    adventurers: [],
    activeMissions: [{
      id: "legacy-mission",
      missionId: "greenbankCart",
      missionSnapshot: { id: "greenbankCart", name: "Guard the Greenbank Cart", location: "Greenbank Road", difficulty: 24, duration: 36, gold: 48, fame: 4, focus: "str" },
      partyIds: [],
      elapsed: 4,
      duration: 36,
      startedAt: now - 4000,
      endsAt: now + 32000
    }],
    eventMissions: [],
    facilities: { tavern: 1, questBoard: 0, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "tavern", completedLocalMissions: [], charterEarned: false },
    log: [],
    founderCreated: true,
    musicMuted: true
  });
  const result = run(context, `({
    version: state.version,
    inventory: state.inventory,
    missionCount: state.activeMissions.length,
    encounterId: state.activeMissions[0].encounterId,
    encounterStatus: state.activeMissions[0].encounterStatus,
    enemyMaxHealth: state.activeMissions[0].enemyMaxHealth
  })`);

  assert.equal(result.version, 12);
  assert.equal(Object.keys(result.inventory).length, 0);
  assert.equal(result.missionCount, 1);
  assert.equal(result.encounterId, "collapsedBridge");
  assert.equal(result.encounterStatus, "waiting");
  assert.equal(result.enemyMaxHealth, 94);
});

test("new games begin with one founder and tavern notices produce a shortlist after one or two days", () => {
  const context = createGameContext();
  const result = run(context, `
    elements.founderName.value = "Jenny";
    elements.founderClass.value = "warden";
    elements.founderGender.value = "female";
    createFounder();
    const founderCount = state.adventurers.length;
    const founderId = state.adventurers[0].id;
    handleChapterMissionSuccess(missionDeck[0]);
    const recruitmentIntroduced = state.recruitment.unlocked && state.chapter.stage === "recruitment" && currentChapterMomentId === "recruitment";
    postRecruitmentNotice();
    const travelDays = state.recruitment.order.readyDay - state.recruitment.order.postedDay;
    const goldAfterNotice = state.gold;
    state.day = state.recruitment.order.readyDay;
    processRecruitmentArrivals();
    const shortlistSize = state.recruitment.candidates.length;
    const chosenId = state.recruitment.candidates[0].id;
    hireRecruitmentCandidate(chosenId);
    ({ founderCount, founderId, recruitmentIntroduced, travelDays, goldAfterNotice, shortlistSize,
       rosterCount: state.adventurers.length, chosenJoined: state.adventurers.some((hero) => hero.id === chosenId),
       stage: state.chapter.stage, candidatesRemaining: state.recruitment.candidates.length });
  `);

  assert.equal(result.founderCount, 1);
  assert.ok(result.founderId);
  assert.equal(result.recruitmentIntroduced, true);
  assert.ok([1, 2].includes(result.travelDays));
  assert.equal(result.goldAfterNotice, 35);
  assert.equal(result.shortlistSize, 3);
  assert.equal(result.rosterCount, 2);
  assert.equal(result.chosenJoined, true);
  assert.equal(result.stage, "buildBoard");
  assert.equal(result.candidatesRemaining, 0);
});

test("named adventurers use matching male and female class sprite rows", () => {
  const context = createGameContext();
  const result = run(context, `({
    maleMage: renderSprite({ classId: "spellwright", gender: "male", founder: false }),
    femaleMage: renderSprite({ classId: "spellwright", gender: "female", founder: false }),
    maleWarrior: getSpriteSlot({ classId: "warden", gender: "male", founder: false }),
    femaleWarrior: getSpriteSlot({ classId: "warden", gender: "female", founder: false })
  })`);

  assert.match(result.maleMage, /slot-1 hero-atlas/);
  assert.match(result.femaleMage, /slot-5 hero-atlas/);
  assert.equal(result.maleWarrior, 0);
  assert.equal(result.femaleWarrior, 4);
});

test("legacy race data is removed from characters and never rendered", () => {
  const legacyAdventurer = {
    id: "seren", name: "Seren", gender: "female", race: "Lizardfolk", classId: "rookie", founder: false,
    level: 1, xp: 0, status: "idle", recovery: 0, potential: 4, age: 27,
    stats: { str: 5, mag: 4, wit: 5, cha: 5 }, traits: {},
    quirks: { positive: "hearty", negative: "stubborn" }, abilities: ["luckySwing"], lifeLog: []
  };
  const legacyCandidate = {
    ...legacyAdventurer,
    id: "mira", name: "Mira", race: "Elf", classId: "spellwright", status: "candidate"
  };
  const context = createGameContext({
    version: 11,
    screen: "game",
    day: 2,
    adventurers: [legacyAdventurer],
    recruitment: { unlocked: true, order: null, candidates: [legacyCandidate], hires: 0 },
    facilities: { tavern: 1, questBoard: 0, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "recruitment", completedLocalMissions: [], charterEarned: false },
    log: [],
    founderCreated: true
  });
  const result = run(context, `
    selectedAdventurerId = "seren";
    renderRoster();
    ({ version: state.version,
       heroHasRace: Object.hasOwn(state.adventurers[0], "race"),
       candidateHasRace: Object.hasOwn(state.recruitment.candidates[0], "race"),
       rosterMarkup: elements.rosterList.innerHTML,
       candidateMarkup: elements.recruitmentPanel.innerHTML,
       profileMarkup: elements.adventurerDetail.innerHTML });
  `);

  assert.equal(result.version, 12);
  assert.equal(result.heroHasRace, false);
  assert.equal(result.candidateHasRace, false);
  assert.doesNotMatch(result.rosterMarkup, /Lizardfolk|Elf/);
  assert.doesNotMatch(result.candidateMarkup, /Lizardfolk|Elf/);
  assert.doesNotMatch(result.profileMarkup, /Lizardfolk|Elf/);
  assert.match(result.profileMarkup, /Female Rookie \| Level 1/);
});

test("management views compact the map while quest views keep it expanded", () => {
  const context = createGameContext();
  const result = run(context, `
    setActiveView("quest");
    const questExpanded = isMapExpanded();
    const questClass = elements.commandLayout.classList.contains("map-focus");
    setActiveView("adventurers");
    const rosterCompact = !isMapExpanded();
    const rosterClass = elements.commandLayout.classList.contains("management-focus");
    const interiorVisible = !elements.contextScene.classList.contains("hidden") && elements.realmMap.classList.contains("hidden");
    const rosterScene = elements.contextScene.innerHTML.includes("living-tavern");
    setActiveView("facilities");
    const facilityScene = elements.contextScene.innerHTML.includes("facility-cutaway-scene");
    setActiveView("adventurers");
    toggleMapFocus();
    ({ questExpanded, questClass, rosterCompact, rosterClass,
       interiorVisible, rosterScene, facilityScene, manualExpanded: isMapExpanded(), manualClass: elements.commandLayout.classList.contains("map-focus"),
       mapVisible: !elements.realmMap.classList.contains("hidden") && elements.contextScene.classList.contains("hidden") });
  `);

  assert.equal(result.questExpanded, true);
  assert.equal(result.questClass, true);
  assert.equal(result.rosterCompact, true);
  assert.equal(result.rosterClass, true);
  assert.equal(result.interiorVisible, true);
  assert.equal(result.rosterScene, true);
  assert.equal(result.facilityScene, true);
  assert.equal(result.manualExpanded, true);
  assert.equal(result.manualClass, true);
  assert.equal(result.mapVisible, true);
});

test("living tavern scenes show heroes at home and waiting applicants, but not heroes away", () => {
  const context = createGameContext();
  const result = run(context, `
    const homeHero = makeAdventurer("Home Hero", "warden", false, "female");
    const roadHero = makeAdventurer("Road Hero", "ranger", false, "male");
    const applicant = makeAdventurer("New Applicant", "spellwright", false, "female");
    homeHero.status = "idle";
    roadHero.status = "busy";
    applicant.status = "candidate";
    state.adventurers = [homeHero, roadHero];
    state.recruitment.unlocked = true;
    state.recruitment.candidates = [applicant];
    activeView = "adventurers";
    renderContextScene();
    const markup = elements.contextScene.innerHTML;
    ({ hasHomeHero: markup.includes("Home Hero"), hasRoadHero: markup.includes("Road Hero"),
       hasApplicant: markup.includes("New Applicant"), hasRecruitmentTable: markup.includes("recruitment-table") });
  `);

  assert.equal(result.hasHomeHero, true);
  assert.equal(result.hasRoadHero, false);
  assert.equal(result.hasApplicant, true);
  assert.equal(result.hasRecruitmentTable, true);
});

test("facility cutaways reflect built rooms and their current upgrade levels", () => {
  const context = createGameContext();
  const result = run(context, `
    const caretaker = makeAdventurer("Caretaker", "minstrel", false, "male");
    state.adventurers = [caretaker];
    state.facilities.tavern = 3;
    state.facilities.questBoard = 2;
    state.facilities.dormitory = 1;
    activeView = "facilities";
    renderContextScene();
    const markup = elements.contextScene.innerHTML;
    ({ tavernLevel: markup.includes("facility-scene-tavern built level-3"),
       boardLevel: markup.includes("facility-scene-questBoard built level-2"),
       lockedWorkshop: markup.includes("facility-scene-workshop locked level-0"),
       caretakerAppearances: (markup.match(/Caretaker/g) || []).length,
       roomCount: getBuiltFacilityCount() });
  `);

  assert.equal(result.tavernLevel, true);
  assert.equal(result.boardLevel, true);
  assert.equal(result.lockedWorkshop, true);
  assert.equal(result.caretakerAppearances, 1);
  assert.equal(result.roomCount, 3);
});

test("encounter bonuses flow into final gold, fame, experience, and injury protection", () => {
  const context = createGameContext();
  const result = run(context, `
    state.adventurers = [{
      id: "founder", name: "Jenny", gender: "female", classId: "warden", founder: true,
      level: 1, xp: 0, status: "busy", recovery: 0, potential: 5,
      stats: { str: 9, mag: 3, wit: 5, cha: 5 }, traits: {},
      quirks: { positive: "quickStudy", negative: "homesick" }, abilities: ["shieldBash"], lifeLog: []
    }];
    const successMission = normaliseActiveMission({
      id: "reward-mission", missionId: "stolenSupplies", missionSnapshot: { ...missionDeck[0] }, partyIds: ["founder"],
      elapsed: 30, duration: 30, encounterId: "goblinAmbush", encounterStatus: "resolved",
      powerBonus: 8, goldBonus: 20, fameBonus: 2, xpBonus: 4, injuryShield: 0
    });
    resolveMission(successMission);
    const successResult = { gold: state.gold, fame: state.fame, xp: state.adventurers[0].xp };

    state.adventurers[0].status = "busy";
    const failedMission = normaliseActiveMission({
      id: "shield-mission", missionId: "impossible", missionSnapshot: {
        id: "impossible", name: "Impossible Test", location: "Test Road", difficulty: 999,
        duration: 30, gold: 10, fame: 1, focus: "str"
      }, partyIds: ["founder"], elapsed: 30, duration: 30, encounterId: "collapsedBridge",
      encounterStatus: "resolved", injuryShield: 1
    });
    resolveMission(failedMission);
    ({ ...successResult, protectedStatus: state.adventurers[0].status, protectedRecovery: state.adventurers[0].recovery });
  `);

  assert.equal(result.gold, 165);
  assert.equal(result.fame, 5);
  assert.equal(result.xp, 18);
  assert.equal(result.protectedStatus, "idle");
  assert.equal(result.protectedRecovery, 0);
});
