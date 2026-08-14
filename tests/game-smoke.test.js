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
    getBoundingClientRect() { return { width: 900, height: 600 }; },
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
  assert.match(index, /styles\.css\?v=38/);
  assert.match(styles, /\.context-patron \.context-sprite[\s\S]*?image-rendering: auto/);
  assert.match(styles, /\.context-patron::before/);
  assert.ok(fs.existsSync(backdrop));
  assert.ok(fs.statSync(backdrop).size > 100_000);
});

test("compact interface text keeps a readable mobile floor", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(index, /game\.js\?v=38/);
  assert.match(styles, /@layer[\s\S]*readability/);
  assert.match(styles, /--type-caption: 0\.7rem/);
  assert.match(styles, /\.quest-party-copy small,[\s\S]*font-size: var\(--type-caption\)/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.dock-button[\s\S]*font-size: var\(--type-caption\)/);
});

test("decorative initial badges stay out of the text-first interface", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.doesNotMatch(index, /class="(?:crest|stat-icon|dock-icon|story-speaker-seal|morning-report-crest|expedition-report-seal)"/);
  assert.doesNotMatch(index, /class="class-option[^>]*>[\s\S]*?<span aria-hidden="true">[WMRB]<\/span>/);
  assert.doesNotMatch(source, /class="(?:bulletin-mark|guild-action-crest|ability-sigil|recruitment-sign|facility-order-mark|crafting-mark|return-tray-seal|expedition-entry-mark)"/);
  assert.match(styles, /Redundant initial badges have been removed/);
  assert.match(styles, /\.dock-button \{[\s\S]*?min-height: 48px/);
  assert.match(styles, /@media \(max-width: 480px\)[\s\S]*?\.expedition-return-tray[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(index, /<span class="stat-label">Rank<\/span>[\s\S]*?id="rankValue"/);
});

test("Mara introduces the first quest through the reusable Guild Story framework", () => {
  const context = createGameContext();
  const portrait = path.join(__dirname, "..", "assets", "mara-portrait-v1.webp");
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const result = run(context, `
    elements.founderName.value = "Jenny";
    elements.founderClass.value = "warden";
    elements.founderGender.value = "female";
    createFounder();
    const briefing = {
      moment: currentChapterMomentId,
      pending: state.storyEvents.pending,
      viewBefore: activeView,
      panelClass: elements.chapterDialogPanel.className,
      title: elements.chapterDialogTitle.textContent,
      speaker: elements.chapterDialogSpeaker.textContent,
      dialogue: elements.chapterDialogText.innerHTML,
      callout: elements.chapterDialogCallout.innerHTML,
      steps: elements.chapterDialogSteps.innerHTML,
      button: elements.chapterDialogButton.textContent
    };
    closeChapterMoment();
    renderMissions();
    ({ briefing, viewAfter: activeView, pendingAfter: state.storyEvents.pending,
       seen: state.storyEvents.seen, missionBoard: elements.missionList.innerHTML });
  `);

  assert.equal(result.briefing.moment, "firstBriefing");
  assert.equal(result.briefing.pending, "firstBriefing");
  assert.equal(result.briefing.viewBefore, "guildhall");
  assert.match(result.briefing.panelClass, /kind-briefing/);
  assert.equal(result.briefing.title, "The Road Needs Its First Hero");
  assert.equal(result.briefing.speaker, "Mara");
  assert.match(result.briefing.dialogue, /Jenny/);
  assert.match(result.briefing.dialogue, /Goblin Threat/);
  assert.match(result.briefing.callout, /Recover the Stolen Supplies/);
  assert.equal((result.briefing.steps.match(/<li>/g) || []).length, 3);
  assert.equal(result.briefing.button, "Show Me The Quest");
  assert.equal(result.viewAfter, "quest");
  assert.equal(result.pendingAfter, null);
  assert.deepEqual([...result.seen], ["firstBriefing"]);
  assert.match(result.missionBoard, /1 adventurer ready/);
  assert.doesNotMatch(result.missionBoard, /goblin-campaign/);
  assert.match(result.missionBoard, /Guided first quest/);
  assert.match(styles, /url\("assets\/mara-portrait-v1\.webp"\)/);
  assert.ok(fs.existsSync(portrait));
  assert.ok(fs.statSync(portrait).size > 100_000);
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

test("the goblin chapter gives every story mission a bespoke decision and unlockable finale routes", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.chapter.stage = "localRequests";
    state.facilities.questBoard = 1;
    const encounterIds = missionDeck.slice(0, 5).map((mission) => getEncounterIdForMission(mission));
    const openingChoices = getAvailableEncounterChoices(encounterDeck.supplyTrail, [founder]).map((choice) => choice.id);
    const bossChoicesBefore = getAvailableEncounterChoices(encounterDeck.barrowAssault, [founder]).map((choice) => choice.id);
    state.chapter.goblinIntel = 2;
    state.chapter.villageSupport = 2;
    const bossChoicesAfter = getAvailableEncounterChoices(encounterDeck.barrowAssault, [founder]).map((choice) => choice.id);
    const campaignMarkup = renderGoblinCampaignPanel();
    ({ encounterIds, openingChoices, bossChoicesBefore, bossChoicesAfter, campaignMarkup });
  `);

  assert.equal(new Set(result.encounterIds).size, 5);
  assert.deepEqual([...result.encounterIds], ["supplyTrail", "cartCrossroads", "woodcutterCamp", "mooncapNest", "barrowAssault"]);
  assert.deepEqual([...result.openingChoices], ["secureProvisions", "shadowRunners", "freeCarter", "trustParty"]);
  assert.deepEqual([...result.bossChoicesBefore], ["challengeChief", "trustParty"]);
  assert.deepEqual([...result.bossChoicesAfter], ["challengeChief", "takeHiddenApproach", "soundGreenbankHorn", "trustParty"]);
  assert.match(result.campaignMarkup, /Goblin Intel/);
  assert.match(result.campaignMarkup, /Village Support/);
  assert.match(result.campaignMarkup, /Use the hidden approach/);
});

test("a successful goblin story decision changes the campaign once and resolves that quest", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    founder.status = "busy";
    state.adventurers = [founder];
    state.founderCreated = true;
    state.facilities.questBoard = 1;
    state.chapter.stage = "localRequests";
    const mission = { ...missionDeck.find((item) => item.id === "greenbankCart"), guaranteedSuccess: true };
    const active = normaliseActiveMission({
      id: "story-cart", missionId: mission.id, missionSnapshot: mission, partyIds: [founder.id],
      elapsed: mission.duration, duration: mission.duration, encounterId: mission.encounterId,
      encounterStatus: "active", encounterTriggerAt: 10, encounterExpiresAt: Date.now() + 10000
    });
    state.activeMissions = [active];
    resolveEncounterChoice(active.id, "springChalkTrap", false, false);
    const intelBeforeSuccess = state.chapter.goblinIntel;
    resolveMission(active);
    const intelAfterSuccess = state.chapter.goblinIntel;
    const firstDecisionCount = state.chapter.goblinDecisions.length;
    commitStoryMissionDecision(active, mission);
    ({ intelBeforeSuccess, intelAfterSuccess, threat: state.greenbank.threat,
       decisionCount: state.chapter.goblinDecisions.length, firstDecisionCount,
       decision: state.chapter.goblinDecisions[0], completed: state.chapter.completedStoryMissions.includes(mission.id),
       lockReason: getMissionLockReason(mission) });
  `);

  assert.equal(result.intelBeforeSuccess, 0);
  assert.equal(result.intelAfterSuccess, 1);
  assert.equal(result.threat, 16);
  assert.equal(result.firstDecisionCount, 1);
  assert.equal(result.decisionCount, 1);
  assert.equal(result.decision.choiceId, "springChalkTrap");
  assert.equal(result.completed, true);
  assert.equal(result.lockReason, "Story resolved");
});

test("story encounter loot waits for a successful quest result", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "ranger", true, "female");
    founder.status = "busy";
    state.adventurers = [founder];
    const mission = missionDeck.find((item) => item.id === "stolenSupplies");
    const active = normaliseActiveMission({
      id: "story-supplies", missionId: mission.id, missionSnapshot: { ...mission }, partyIds: [founder.id],
      elapsed: 8, duration: mission.duration, encounterId: mission.encounterId,
      encounterStatus: "active", encounterTriggerAt: 7, encounterExpiresAt: Date.now() + 10000
    });
    state.activeMissions = [active];
    resolveEncounterChoice(active.id, "shadowRunners", false, false);
    const lootBeforeSuccess = state.inventory.oldRoadMap || 0;
    commitStoryMissionDecision(active, mission);
    ({ lootBeforeSuccess, lootAfterSuccess: state.inventory.oldRoadMap,
       intel: state.chapter.goblinIntel, decisionCount: state.chapter.goblinDecisions.length });
  `);

  assert.equal(result.lootBeforeSuccess, 0);
  assert.equal(result.lootAfterSuccess, 1);
  assert.equal(result.intel, 1);
  assert.equal(result.decisionCount, 1);
});

test("version 17 saves migrate into the goblin campaign without replaying completed opening quests", () => {
  const context = createGameContext({
    version: 17,
    screen: "game",
    day: 6,
    gold: 100,
    fame: 8,
    adventurers: [],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: ["greenbankCart"], charterEarned: false },
    founderCreated: true
  });
  const result = run(context, `({
    version: state.version,
    intel: state.chapter.goblinIntel,
    support: state.chapter.villageSupport,
    completedStoryMissions: state.chapter.completedStoryMissions,
    decisions: state.chapter.goblinDecisions
  })`);

  assert.equal(result.version, 21);
  assert.equal(result.intel, 0);
  assert.equal(result.support, 0);
  assert.deepEqual([...result.completedStoryMissions], ["greenbankCart", "stolenSupplies"]);
  assert.deepEqual([...result.decisions], []);
});

test("version 18 saves gain resumable Guild Story state", () => {
  const context = createGameContext({
    version: 18,
    screen: "game",
    day: 2,
    gold: 80,
    fame: 3,
    adventurers: [],
    facilities: { tavern: 1, questBoard: 0, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "firstQuest", completedLocalMissions: [], completedStoryMissions: [], charterEarned: false },
    founderCreated: true
  });
  const result = run(context, `
    showChapterMoment("firstBriefing");
    saveState();
    const normalised = normaliseStoryEvents({ pending: "firstBriefing", seen: [] });
    ({ version: state.version, pending: state.storyEvents.pending, current: currentChapterMomentId,
       normalisedPending: normalised.pending, defaultSeen: state.storyEvents.seen });
  `);

  assert.equal(result.version, 21);
  assert.equal(result.pending, "firstBriefing");
  assert.equal(result.current, "firstBriefing");
  assert.equal(result.normalisedPending, "firstBriefing");
  assert.deepEqual([...result.defaultSeen], []);
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

  assert.equal(result.version, 21);
  assert.equal(Object.keys(result.inventory).length, 0);
  assert.equal(result.missionCount, 1);
  assert.equal(result.encounterId, "collapsedBridge");
  assert.equal(result.encounterStatus, "waiting");
  assert.equal(result.enemyMaxHealth, 94);
});

test("the Training Yard queues a stat drill, occupies the room, and completes on the next day", () => {
  const context = createGameContext();
  const result = run(context, `
    const hero = makeAdventurer("Alden", "warden", true, "male");
    hero.quirks.positive = "hearty";
    state.adventurers = [hero];
    state.founderCreated = true;
    state.facilities.trainingYard = 1;
    state.gold = 100;
    const startingStr = hero.stats.str;
    startTraining(hero.id, "stat", "str");
    const queued = state.trainingJobs[0];
    const goldAfterStart = state.gold;
    const pickerWhileTraining = renderQuestPartyPicker(missionDeck[0]);
    activeView = "facilities";
    renderContextScene();
    const cutawayWhileTraining = elements.contextScene.innerHTML;
    renderTrainingPanel();
    const panelWhileTraining = elements.trainingPanel.innerHTML;
    advanceDays(1);
    ({ startingStr, queuedReadyDay: queued.readyDay, goldAfterStart, pickerWhileTraining,
       cutawayWhileTraining, panelWhileTraining, finalDay: state.day, finalStatus: hero.status,
       finalStr: hero.stats.str, completedDrills: hero.trainingStats.str,
       jobsRemaining: state.trainingJobs.length, history: hero.lifeLog.map((entry) => entry.text).join(" | ") });
  `);

  assert.equal(result.queuedReadyDay, 2);
  assert.equal(result.goldAfterStart, 72);
  assert.match(result.pickerWhileTraining, /Training to day 2/);
  assert.match(result.cutawayWhileTraining, /facility-scene-trainingYard built level-1 training-active/);
  assert.match(result.cutawayWhileTraining, /Alden/);
  assert.match(result.panelWhileTraining, /Alden/);
  assert.match(result.panelWhileTraining, /Completes day 2/);
  assert.equal(result.finalDay, 2);
  assert.equal(result.finalStatus, "idle");
  assert.equal(result.finalStr, result.startingStr + 1);
  assert.equal(result.completedDrills, 1);
  assert.equal(result.jobsRemaining, 0);
  assert.match(result.history, /Completed Weapon Drills/);
});

test("higher-level techniques take time and high-potential founders retain extra capacity", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "spellwright", true, "female");
    founder.quirks.positive = "hearty";
    state.adventurers = [founder];
    state.founderCreated = true;
    state.facilities.trainingYard = 2;
    state.gold = 200;
    startTraining(founder.id, "ability", "rapidStudy");
    const firstReadyDay = state.trainingJobs[0].readyDay;
    advanceDays(1);
    const halfwayStatus = founder.status;
    const learnedHalfway = founder.abilities.includes("rapidStudy");
    advanceDays(1);
    ({ firstReadyDay, halfwayStatus, learnedHalfway, finalStatus: founder.status,
       learnedFinally: founder.abilities.includes("rapidStudy"), techniqueCapacity: getTrainingCapacity(founder),
       drillCapacity: getStatTrainingCapacity(founder), jobsRemaining: state.trainingJobs.length });
  `);

  assert.equal(result.firstReadyDay, 3);
  assert.equal(result.halfwayStatus, "training");
  assert.equal(result.learnedHalfway, false);
  assert.equal(result.finalStatus, "idle");
  assert.equal(result.learnedFinally, true);
  assert.equal(result.techniqueCapacity, 4);
  assert.equal(result.drillCapacity, 7);
  assert.equal(result.jobsRemaining, 0);
});

test("version 12 saves preserve an active training job and settle it on the saved completion day", () => {
  const context = createGameContext({
    version: 12,
    screen: "game",
    day: 4,
    gold: 100,
    fame: 12,
    adventurers: [{
      id: "trainee", name: "Mira", gender: "female", classId: "spellwright", founder: false,
      level: 1, xp: 0, status: "idle", recovery: 0, potential: 4,
      stats: { str: 3, mag: 9, wit: 7, cha: 4 }, traits: {},
      quirks: { positive: "hearty", negative: "stubborn" }, abilities: ["emberBolt"], lifeLog: []
    }],
    trainingJobs: [{
      id: "saved-training", adventurerId: "trainee", kind: "ability", targetId: "fieldDressing",
      startedDay: 4, readyDay: 5, cost: 35
    }],
    recruitment: { unlocked: true, order: null, candidates: [], hires: 0 },
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 1, kitchen: 0, workshop: 0 },
    chapter: { stage: "boss", completedLocalMissions: ["greenbankCart", "lostWoodcutter", "mooncapRemedy"], charterEarned: false },
    log: [],
    founderCreated: true,
    musicMuted: true
  });
  const result = run(context, `
    const statusOnLoad = state.adventurers[0].status;
    const jobsOnLoad = state.trainingJobs.length;
    advanceDays(1);
    ({ version: state.version, statusOnLoad, jobsOnLoad, statusAfter: state.adventurers[0].status,
       learned: state.adventurers[0].abilities.includes("fieldDressing"), jobsAfter: state.trainingJobs.length,
       hasTrainingStats: Object.hasOwn(state.adventurers[0], "trainingStats") });
  `);

  assert.equal(result.version, 21);
  assert.equal(result.statusOnLoad, "training");
  assert.equal(result.jobsOnLoad, 1);
  assert.equal(result.statusAfter, "idle");
  assert.equal(result.learned, true);
  assert.equal(result.jobsAfter, 0);
  assert.equal(result.hasTrainingStats, true);
});

test("the first expansion specifically guides players through the Training Yard", () => {
  const context = createGameContext();
  const result = run(context, `
    state.day = 8;
    state.chapter.stage = "expansion";
    state.chapter.completedLocalMissions = ["greenbankCart", "lostWoodcutter", "mooncapRemedy"];
    state.gold = 200;
    const kitchenLockedBefore = !isFacilityUnlocked("kitchen");
    const bossLockBefore = getMissionLockReason(missionDeck.find((mission) => mission.chapterBoss));
    upgradeFacility("trainingYard");
    ({ kitchenLockedBefore, bossLockBefore, yardLevel: state.facilities.trainingYard,
       stage: state.chapter.stage, chapterMoment: currentChapterMomentId,
       kitchenUnlockedAfter: isFacilityUnlocked("kitchen"), bossLockAfter: getMissionLockReason(missionDeck.find((mission) => mission.chapterBoss)) });
  `);

  assert.equal(result.kitchenLockedBefore, true);
  assert.match(result.bossLockBefore, /Training Yard/);
  assert.equal(result.yardLevel, 1);
  assert.equal(result.stage, "boss");
  assert.equal(result.chapterMoment, "trainingYard");
  assert.equal(result.kitchenUnlockedAfter, true);
  assert.equal(result.bossLockAfter, "");
});

test("the Training Yard waits until the first weekly review", () => {
  const context = createGameContext();
  const result = run(context, `
    state.day = 7;
    state.screen = "game";
    state.chapter.stage = "localRequests";
    state.chapter.completedLocalMissions = ["greenbankCart", "lostWoodcutter", "mooncapRemedy"];
    const unlockedOnDaySeven = isFacilityUnlocked("trainingYard");
    const daySevenCopy = getFacilityUnlockText("trainingYard");
    const daySevenObjective = getChapterObjective();
    advanceDays(1);
    ({ unlockedOnDaySeven, daySevenCopy, daySevenObjective, day: state.day,
       unlockedOnDayEight: isFacilityUnlocked("trainingYard"), stage: state.chapter.stage,
       chapterMoment: currentChapterMomentId });
  `);

  assert.equal(result.unlockedOnDaySeven, false);
  assert.match(result.daySevenCopy, /first weekly review in 1 day/);
  assert.match(result.daySevenObjective.title, /first week/);
  assert.equal(result.day, 8);
  assert.equal(result.unlockedOnDayEight, true);
  assert.equal(result.stage, "expansion");
  assert.equal(result.chapterMoment, "expansion");
});

test("early expansion saves return to the first-week tavern objective", () => {
  const context = createGameContext({
    version: 21,
    screen: "game",
    day: 5,
    gold: 180,
    fame: 8,
    adventurers: [],
    activeMissions: [],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: {
      stage: "expansion",
      completedLocalMissions: ["greenbankCart", "lostWoodcutter", "mooncapRemedy"],
      completedStoryMissions: ["stolenSupplies"],
      charterEarned: false
    },
    storyEvents: { pending: "expansion", seen: [] },
    founderCreated: true
  });
  const result = run(context, `({ stage: state.chapter.stage, pending: state.storyEvents.pending,
    yardUnlocked: isFacilityUnlocked("trainingYard"), objective: getChapterObjective() })`);

  assert.equal(result.stage, "localRequests");
  assert.equal(result.pending, null);
  assert.equal(result.yardUnlocked, false);
  assert.match(result.objective.title, /first week/);
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

test("quest cards provide inline party selection with clear availability states", () => {
  const context = createGameContext();
  const result = run(context, `
    const idleHero = makeAdventurer("Ready Hero", "warden", false, "female");
    const busyHero = makeAdventurer("Road Hero", "ranger", false, "male");
    const injuredHero = makeAdventurer("Resting Hero", "spellwright", false, "female");
    idleHero.status = "idle";
    busyHero.status = "busy";
    injuredHero.status = "injured";
    state.adventurers = [idleHero, busyHero, injuredHero];
    state.founderCreated = true;
    state.chapter.stage = "firstQuest";
    state.selectedIds = [];
    const emptyPicker = renderQuestPartyPicker(missionDeck[0]);
    partyPickerMissionId = missionDeck[0].id;
    activeView = "quest";
    renderMissions();
    const emptyBoard = elements.missionList.innerHTML;
    const emptyDispatch = emptyBoard.match(/<button class="primary-button" data-mission="stolenSupplies"[^>]*>/)?.[0] || "";
    state.selectedIds = [idleHero.id];
    const selectedPicker = renderQuestPartyPicker(missionDeck[0]);
    renderMissions();
    const selectedBoard = elements.missionList.innerHTML;
    const selectedDispatch = selectedBoard.match(/<button class="primary-button" data-mission="stolenSupplies"[^>]*>/)?.[0] || "";
    ({ emptyPicker, selectedPicker, emptyBoard, selectedBoard, emptyDispatch, selectedDispatch,
       idleId: idleHero.id, busyId: busyHero.id, injuredId: injuredHero.id });
  `);

  assert.match(result.emptyPicker, new RegExp(`data-quest-party="${result.idleId}"[^>]*aria-pressed="false"`));
  assert.match(result.emptyPicker, new RegExp(`data-quest-party="${result.busyId}"[^>]*disabled`));
  assert.match(result.emptyPicker, new RegExp(`data-quest-party="${result.injuredId}"[^>]*disabled`));
  assert.match(result.emptyPicker, /On quest/);
  assert.match(result.emptyPicker, /Recovering/);
  assert.match(result.emptyBoard, /data-compose-party="stolenSupplies"/);
  assert.match(result.emptyBoard, /data-party-picker="stolenSupplies"/);
  assert.match(result.emptyDispatch, /disabled/);
  assert.match(result.selectedPicker, new RegExp(`data-quest-party="${result.idleId}"[^>]*aria-pressed="true"`));
  assert.match(result.selectedPicker, /Selected/);
  assert.doesNotMatch(result.selectedDispatch, /disabled/);
});

test("story and time-sensitive quests carry distinct priority treatments and tougher party guidance", () => {
  const context = createGameContext();
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.facilities.questBoard = 1;
    state.chapter.stage = "localRequests";
    state.selectedIds = [founder.id];
    state.greenbank.requests = [{
      id: "urgent-request", templateId: "urgent-request", name: "Hold Saffron Bridge",
      location: "Saffron Bridge", description: "Reach the bridge before the traders abandon it.",
      difficulty: 39, duration: 45, gold: 70, fame: 6, focus: "str", rotatingRequest: true,
      spawnedDay: state.day, expiresDay: state.day + 1, marker: { left: "60%", top: "60%" }
    }];
    renderMissions();
    ({ board: elements.missionList.innerHTML,
       storyDifficulties: missionDeck.filter((mission) => mission.storyEncounter).map((mission) => mission.difficulty),
       eventDifficulties: eventMissionDeck.map((mission) => mission.difficulty),
       storyParty: getRecommendedPartySize(missionDeck[1]),
       bossParty: getRecommendedPartySize(missionDeck[4]) });
  `);

  assert.match(result.board, /story-mission story-priority/);
  assert.match(result.board, /Story quest/);
  assert.match(result.board, /time-sensitive deadline-close/);
  assert.match(result.board, /Time sensitive/);
  assert.match(result.board, /1 day left/);
  assert.match(result.board, /2 heroes advised/);
  assert.deepEqual([...result.storyDifficulties], [8, 38, 44, 50, 78]);
  assert.deepEqual([...result.eventDifficulties], [46, 54, 62]);
  assert.equal(result.storyParty, 2);
  assert.equal(result.bossParty, 3);
  assert.match(styles, /\.mission-card\.story-priority/);
  assert.match(styles, /\.mission-card\.time-sensitive/);
  assert.match(styles, /\.mission-priority-tag\.story/);
  assert.match(styles, /\.mission-priority-tag\.timed/);
});

test("an adventurer can depart on only one quest per day", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.chapter.stage = "firstQuest";
    state.day = 3;
    state.selectedIds = [founder.id];
    startMission("stolenSupplies");
    const departureDay = founder.lastQuestDay;
    founder.status = "idle";
    state.activeMissions = [];
    state.selectedIds = [founder.id];
    startMission("stolenSupplies");
    const sameDayMissionCount = state.activeMissions.length;
    const sameDayPicker = renderQuestPartyPicker(missionDeck[0]);
    const sameDayStatus = getAdventurerStatusLabel(founder);
    state.day = 4;
    state.selectedIds = [founder.id];
    startMission("stolenSupplies");
    ({ departureDay, sameDayMissionCount, sameDayPicker, sameDayStatus,
       nextDayMissionCount: state.activeMissions.length, nextDepartureDay: founder.lastQuestDay });
  `);

  assert.equal(result.departureDay, 3);
  assert.equal(result.sameDayMissionCount, 0);
  assert.match(result.sameDayPicker, /Quested today/);
  assert.match(result.sameDayPicker, /disabled/);
  assert.equal(result.sameDayStatus, "Quested today");
  assert.equal(result.nextDayMissionCount, 1);
  assert.equal(result.nextDepartureDay, 4);
});

test("version 19 adventurers gain a daily quest record without losing their save", () => {
  const context = createGameContext({
    version: 19,
    screen: "game",
    day: 6,
    gold: 100,
    fame: 4,
    adventurers: [{
      id: "founder", name: "Jenny", gender: "female", classId: "warden", founder: true,
      level: 2, xp: 3, status: "idle", recovery: 0, potential: 5,
      stats: { str: 11, mag: 3, wit: 6, cha: 5 }, traits: {},
      quirks: { positive: "dauntless", negative: "homesick" }, abilities: ["shieldBash"], lifeLog: []
    }],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: [], completedStoryMissions: ["stolenSupplies"], charterEarned: false },
    founderCreated: true
  });
  const result = run(context, `({ version: state.version, heroName: state.adventurers[0].name,
    lastQuestDay: state.adventurers[0].lastQuestDay, available: canAdventurerQuestToday(state.adventurers[0]) })`);

  assert.equal(result.version, 21);
  assert.equal(result.heroName, "Jenny");
  assert.equal(result.lastQuestDay, 0);
  assert.equal(result.available, true);
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

  assert.equal(result.version, 21);
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

test("a victorious party returns with a persistent report, level-up, and story impact", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    founder.level = 3;
    founder.xp = 53;
    founder.status = "busy";
    founder.quirks = { positive: "dauntless", negative: "homesick" };
    founder.abilities = ["shieldBash"];
    state.adventurers = [founder];
    state.founderCreated = true;
    state.chapter.stage = "firstQuest";
    const mission = { ...missionDeck.find((item) => item.id === "stolenSupplies") };
    const active = normaliseActiveMission({
      id: "return-victory", missionId: mission.id, missionSnapshot: mission, partyIds: [founder.id],
      elapsed: mission.duration, duration: mission.duration, encounterId: mission.encounterId,
      encounterStatus: "active", encounterTriggerAt: 7, encounterExpiresAt: Date.now() + 10000
    });
    state.activeMissions = [active];
    resolveEncounterChoice(active.id, "secureProvisions", false, false);
    resolveMission(active);
    renderExpeditionReturnTray();
    const tray = elements.expeditionReturnTray.innerHTML;
    const report = state.expeditionReports.entries[0];
    openExpeditionReport(report.id);
    const reportMarkup = elements.expeditionReportBody.innerHTML;
    const unreadAfterOpen = state.expeditionReports.unreadIds.length;
    activeView = "log";
    renderChronicleArchive();
    renderExpeditionReportDialog();
    ({
      report,
      tray,
      reportMarkup,
      unreadAfterOpen,
      ledgerMarkup: elements.chronicleArchive.innerHTML,
      closeLabel: elements.closeExpeditionReport.textContent
    });
  `);

  assert.equal(result.report.success, true);
  assert.equal(result.report.rewards.gold, 77);
  assert.equal(result.report.rewards.fame, 3);
  assert.equal(result.report.heroes[0].levelBefore, 3);
  assert.equal(result.report.heroes[0].levelAfter, 4);
  assert.deepEqual([...result.report.heroes[0].abilitiesLearned], ["holdTheLine"]);
  assert.equal(result.report.village.confidenceDelta, 7);
  assert.equal(result.report.decision.label, "Secure the provisions");
  assert.match(result.tray, /Party returned/);
  assert.match(result.tray, /View Report/);
  assert.equal(result.unreadAfterOpen, 0);
  assert.match(result.reportMarkup, /The Party Returns Victorious/);
  assert.match(result.reportMarkup, /Hold the Line/);
  assert.match(result.reportMarkup, /Greenbank Impact/);
  assert.match(result.ledgerMarkup, /Field Reports/);
  assert.match(result.ledgerMarkup, /Recover the Stolen Supplies/);
  assert.equal(result.closeLabel, "Return To Ledger");
});

test("an open expedition report does not restart during background simulation ticks", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    founder.status = "busy";
    state.adventurers = [founder];
    state.founderCreated = true;
    const mission = { ...missionDeck.find((item) => item.id === "stolenSupplies"), guaranteedSuccess: true };
    const active = normaliseActiveMission({
      id: "stable-report", missionId: mission.id, missionSnapshot: mission, partyIds: [founder.id],
      elapsed: mission.duration, duration: mission.duration, encounterStatus: "resolved"
    });
    resolveMission(active);
    const report = state.expeditionReports.entries[0];
    openExpeditionReport(report.id);

    let bodyMarkup = elements.expeditionReportBody.innerHTML;
    let bodyWrites = 0;
    Object.defineProperty(elements.expeditionReportBody, "innerHTML", {
      configurable: true,
      get() { return bodyMarkup; },
      set(value) { bodyWrites += 1; bodyMarkup = value; }
    });

    founder.status = "injured";
    founder.recovery = 5;
    tick();
    tick();
    const writesDuringTicks = bodyWrites;
    closeExpeditionReport();
    openExpeditionReport(report.id);
    ({ writesDuringTicks, writesAfterReopen: bodyWrites, recovery: founder.recovery,
       activeReport: activeExpeditionReportId, renderedReport: renderedExpeditionReportId });
  `);

  assert.equal(result.writesDuringTicks, 0);
  assert.equal(result.writesAfterReopen, 1);
  assert.equal(result.recovery, 3);
  assert.equal(result.activeReport, result.renderedReport);
});

test("a failed expedition report records consolation rewards, village harm, and injury", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "ranger", true, "female");
    founder.status = "busy";
    state.adventurers = [founder];
    const mission = {
      id: "failed-request", name: "Hold The Broken Crossing", location: "Saffron Brook",
      description: "A deliberately overwhelming test contract.", difficulty: 999, duration: 30,
      gold: 30, fame: 5, focus: "wit", rotatingRequest: true, expiresDay: 3,
      materials: { timber: 2 }, success: { threat: -4, confidence: 3 },
      failure: { threat: 4, confidence: -2 }
    };
    const active = normaliseActiveMission({
      id: "return-retreat", missionId: mission.id, missionSnapshot: mission, partyIds: [founder.id],
      elapsed: mission.duration, duration: mission.duration, encounterStatus: "resolved", injuryShield: 0
    });
    resolveMission(active);
    renderExpeditionReturnTray();
    const report = state.expeditionReports.entries[0];
    ({
      report,
      tray: elements.expeditionReturnTray.innerHTML,
      heroStatus: founder.status,
      recovery: founder.recovery
    });
  `);

  assert.equal(result.report.success, false);
  assert.equal(result.report.rewards.gold, 9);
  assert.equal(result.report.rewards.fame, 0);
  assert.deepEqual({ ...result.report.rewards.materials }, {});
  assert.equal(result.report.heroes[0].status, "injured");
  assert.equal(result.heroStatus, "injured");
  assert.ok(result.recovery >= 3);
  assert.equal(result.report.village.threatDelta, 4);
  assert.equal(result.report.village.confidenceDelta, -2);
  assert.match(result.report.outcomeNote, /injured during the retreat/);
  assert.match(result.tray, /made it home after a retreat/);
});

test("version 20 saves gain the expedition archive and responsive report presentation", () => {
  const context = createGameContext({
    version: 20,
    screen: "game",
    day: 5,
    gold: 180,
    fame: 4,
    adventurers: [],
    activeMissions: [],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: [], completedStoryMissions: [], charterEarned: false },
    founderCreated: true
  });
  const result = run(context, `({ version: state.version, reports: state.expeditionReports })`);
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.equal(result.version, 21);
  assert.deepEqual([...result.reports.entries], []);
  assert.deepEqual([...result.reports.unreadIds], []);
  assert.match(index, /id="expeditionReturnTray"/);
  assert.match(index, /id="expeditionReportDialog"/);
  assert.match(styles, /\.expedition-report-sheet/);
  assert.match(styles, /@media \(max-width: 480px\)[\s\S]*\.expedition-report-sheet/);
  assert.match(styles, /prefers-reduced-motion[\s\S]*\.report-return-hero/);
});

test("Tavern Life choices create persistent bonds, history, and profile UI", () => {
  const context = createGameContext();
  const result = run(context, `
    const first = makeAdventurer("Alden", "warden", true, "male");
    const second = makeAdventurer("Mira", "spellwright", false, "female");
    state.adventurers = [first, second];
    state.founderCreated = true;
    state.gold = 100;
    selectedAdventurerId = first.id;
    const created = createTavernLifeEvent("sharedMeal", [first.id, second.id], true);
    renderTavernEventPanel();
    renderTavernLifeDialog();
    const callout = elements.tavernEventPanel.innerHTML;
    const dialog = elements.tavernLifeChoices.innerHTML;
    resolveTavernLifeChoice("houseMeal");
    selectedAdventurerId = first.id;
    renderAdventurerDetail();
    const relationship = getRelationship(first.id, second.id);
    ({ created: Boolean(created), callout, dialog, gold: state.gold, firstXp: first.xp, secondXp: second.xp,
       score: relationship.score, active: state.tavernLife.active, resolved: state.tavernLife.resolved.length,
       firstHistory: first.lifeLog[0].text, secondHistory: second.lifeLog[0].text,
       profile: elements.adventurerDetail.innerHTML });
  `);

  assert.equal(result.created, true);
  assert.match(result.callout, /A Table For Two/);
  assert.match(result.callout, /Alden &amp; Mira|Alden & Mira/);
  assert.match(result.dialog, /Put On A House Meal/);
  assert.equal(result.gold, 88);
  assert.equal(result.firstXp, 3);
  assert.equal(result.secondXp, 3);
  assert.equal(result.score, 3);
  assert.equal(result.active, null);
  assert.equal(result.resolved, 1);
  assert.match(result.firstHistory, /good plates/);
  assert.match(result.secondHistory, /good plates/);
  assert.match(result.profile, /Relationships/);
  assert.match(result.profile, /Mira/);
  assert.match(result.profile, /Friends \| \+1 party power together/);
});

test("friendships and rivalries symmetrically modify expedition power within limits", () => {
  const context = createGameContext();
  const result = run(context, `
    const first = makeAdventurer("Alden", "warden", true, "male");
    const second = makeAdventurer("Mira", "spellwright", false, "female");
    state.adventurers = [first, second];
    const mission = missionDeck[0];
    const baseline = getPartyPower([first, second], mission);
    adjustRelationship(first.id, second.id, 99, "Became inseparable.");
    const friendshipScore = getRelationship(second.id, first.id).score;
    const friendshipPower = getPartyPower([first, second], mission);
    adjustRelationship(second.id, first.id, -99, "A legendary disagreement.");
    const rivalryScore = getRelationship(first.id, second.id).score;
    const rivalryPower = getPartyPower([first, second], mission);
    ({ baseline, friendshipScore, friendshipPower, rivalryScore, rivalryPower,
       keyForward: getRelationshipKey(first.id, second.id), keyReverse: getRelationshipKey(second.id, first.id) });
  `);

  assert.equal(result.friendshipScore, 10);
  assert.equal(result.friendshipPower, result.baseline + 2);
  assert.equal(result.rivalryScore, -10);
  assert.equal(result.rivalryPower, result.baseline - 2);
  assert.equal(result.keyForward, result.keyReverse);
});

test("the first eligible day gives the founder a clickable personal request", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "ranger", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.screen = "game";
    advanceDays(1);
    const activeTemplateBeforeChoice = state.tavernLife.active?.templateId;
    const activeDayBeforeChoice = state.tavernLife.active?.day;
    const confidenceBeforeChoice = state.greenbank.confidence;
    const objective = getChapterObjective();
    const tavernScene = elements.contextScene.innerHTML;
    closeMorningReport();
    interactWithTavernHero(founder.id);
    const choiceMarkup = elements.tavernLifeChoices.innerHTML;
    resolveTavernLifeChoice("setHeroTable");
    ({ day: state.day, activeTemplate: activeTemplateBeforeChoice,
       activeDay: activeDayBeforeChoice, dialogOpen: tavernLifeDialogOpen,
       morningOpen: morningReportDialogOpen,
       lastEventDay: state.tavernLife.lastEventDay, realmEvents: state.eventMissions.length,
       objective, tavernScene, choiceMarkup, resolved: state.tavernLife.resolved[0],
       founderXp: founder.xp, confidenceChange: state.greenbank.confidence - confidenceBeforeChoice,
       gold: state.gold });
  `);

  assert.equal(result.day, 2);
  assert.equal(result.activeTemplate, "firstWeekTable");
  assert.equal(result.activeDay, 2);
  assert.equal(result.dialogOpen, false);
  assert.equal(result.morningOpen, false);
  assert.equal(result.lastEventDay, 2);
  assert.equal(result.realmEvents, 0);
  assert.match(result.objective.title, /Speak with Jenny/);
  assert.match(result.tavernScene, /data-talk-hero=/);
  assert.match(result.tavernScene, /Wants to talk/);
  assert.match(result.choiceMarkup, /Set Aside The Hearth Table/);
  assert.equal(result.resolved.templateId, "firstWeekTable");
  assert.equal(result.resolved.choiceId, "setHeroTable");
  assert.equal(result.founderXp, 4);
  assert.equal(result.confidenceChange, 1);
  assert.ok(result.gold >= 70);
});

test("the first week progresses from a shared meal to a second founder request", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    const companion = makeAdventurer("Corin", "ranger", false, "male");
    state.adventurers = [founder, companion];
    state.founderCreated = true;
    state.gold = 100;
    state.day = 4;
    state.tavernLife.resolved = [{ templateId: "firstWeekTable", day: 2 }];
    const social = maybeCreateTavernEvent();
    const socialTemplate = social?.templateId;
    resolveTavernLifeChoice("swapStories");
    state.day = 6;
    const request = maybeCreateTavernEvent();
    const threatBefore = state.greenbank.threat;
    const confidenceBefore = state.greenbank.confidence;
    const requestParticipant = request?.participantIds?.[0];
    renderTavernLifeDialog();
    const requestChoices = elements.tavernLifeChoices.innerHTML;
    resolveTavernLifeChoice("peopleFirst");
    ({ socialTemplate, requestTemplate: request?.templateId, requestParticipant,
       founderId: founder.id, requestChoices, threatChange: state.greenbank.threat - threatBefore,
       confidenceChange: state.greenbank.confidence - confidenceBefore,
       resolvedTemplates: state.tavernLife.resolved.map((story) => story.templateId) });
  `);

  assert.equal(result.socialTemplate, "sharedMeal");
  assert.equal(result.requestTemplate, "firstWeekPromise");
  assert.equal(result.requestParticipant, result.founderId);
  assert.match(result.requestChoices, /Put Greenbank's People First/);
  assert.equal(result.threatChange, -1);
  assert.equal(result.confidenceChange, 3);
  assert.deepEqual([...result.resolvedTemplates].slice(0, 3), ["firstWeekPromise", "sharedMeal", "firstWeekTable"]);
});

test("version 13 saves gain relationship and Tavern Life defaults without losing heroes", () => {
  const context = createGameContext({
    version: 13,
    screen: "game",
    day: 6,
    gold: 160,
    fame: 8,
    adventurers: [{
      id: "legacy-founder", name: "Jenny", gender: "female", classId: "ranger", founder: true,
      level: 2, xp: 4, status: "idle", recovery: 0, potential: 5,
      stats: { str: 7, mag: 4, wit: 10, cha: 5 }, traits: {}, trainingStats: {},
      quirks: { positive: "keenEye", negative: "homesick" }, abilities: ["aimedShot"], lifeLog: []
    }],
    activeMissions: [],
    trainingJobs: [],
    eventMissions: [],
    recruitment: { unlocked: true, order: null, candidates: [], hires: 0 },
    facilities: { tavern: 2, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: [], charterEarned: false },
    log: [],
    founderCreated: true,
    musicMuted: true
  });
  const result = run(context, `({
    version: state.version,
    heroName: state.adventurers[0].name,
    relationshipKeys: Object.keys(state.relationships).length,
    activeStory: state.tavernLife.active,
    resolvedStories: state.tavernLife.resolved.length,
    lastEventDay: state.tavernLife.lastEventDay
  })`);

  assert.equal(result.version, 21);
  assert.equal(result.heroName, "Jenny");
  assert.equal(result.relationshipKeys, 0);
  assert.equal(result.activeStory, null);
  assert.equal(result.resolvedStories, 0);
  assert.equal(result.lastEventDay, 0);
});

test("the Tavern Life interface ships its painted scene and responsive controls", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(index, /id="tavernEventPanel"/);
  assert.match(index, /id="tavernLifeDialog"/);
  assert.match(styles, /\.tavern-life-art[\s\S]*url\("assets\/tavern-interior-v1\.webp"\)/);
  assert.match(styles, /\.relationship-list/);
  assert.match(styles, /@media \(max-width: 560px\)[\s\S]*\.tavern-life-choices button/);
});

test("Guild Rank increases the daily action allowance while quest dispatch remains free", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.chapter.stage = "firstQuest";
    state.fame = 0;
    const rankF = { rank: getRank(), capacity: getGuildActionCapacity() };
    spendGuildAction("first duty");
    spendGuildAction("second duty");
    spendGuildAction("third duty");
    const blockedFourth = spendGuildAction("fourth duty");
    state.fame = 18;
    const rankD = { rank: getRank(), capacity: getGuildActionCapacity(), remaining: getGuildActionsRemaining() };
    spendGuildAction("rank bonus duty");
    state.selectedIds = [founder.id];
    const spentBeforeDispatch = state.guildActions.spent;
    startMission("stolenSupplies");
    ({ rankF, blockedFourth, rankD, spentBeforeDispatch, spentAfterDispatch: state.guildActions.spent,
       activeMissions: state.activeMissions.length, capacities: [0, 18, 48, 90].map((fame) => { state.fame = fame; return getGuildActionCapacity(); }) });
  `);

  assert.deepEqual({ ...result.rankF }, { rank: "F", capacity: 3 });
  assert.equal(result.blockedFourth, false);
  assert.deepEqual({ ...result.rankD }, { rank: "D", capacity: 4, remaining: 1 });
  assert.equal(result.spentAfterDispatch, result.spentBeforeDispatch);
  assert.equal(result.activeMissions, 1);
  assert.deepEqual([...result.capacities], [3, 4, 5, 6]);
});

test("facility orders resolve at End Day and prepare exactly the next expedition", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "ranger", true, "female");
    const companion = makeAdventurer("Alden", "warden", false, "male");
    state.adventurers = [founder, companion];
    state.founderCreated = true;
    state.chapter.stage = "firstQuest";
    state.fame = 18;
    state.gold = 100;
    state.facilities = { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 1, kitchen: 0, workshop: 1 };
    const hostQueued = queueFacilityOrder("hostTravellers");
    const boardQueued = queueFacilityOrder("featureContract");
    const duplicateBoard = queueFacilityOrder("gatherRumours");
    const trainingQueued = queueFacilityOrder("tacticalBriefing");
    const workshopQueued = queueFacilityOrder("repairKits");
    renderGuildActions();
    const actionMarkup = elements.guildActionBar.innerHTML;
    selectedGuildRoomId = "questBoard";
    renderGuildhallInterior();
    const roomMarkup = elements.guildhallRoomDetail.innerHTML;
    const spentBeforeEnd = state.guildActions.spent;
    advanceDays(1);
    const prepared = { ...state.guildPreparations };
    const goldAfterEnd = state.gold;
    const remainingAfterEnd = getGuildActionsRemaining();
    state.selectedIds = [founder.id];
    startMission("stolenSupplies");
    const active = state.activeMissions[0];
    ({ hostQueued, boardQueued, duplicateBoard, trainingQueued, workshopQueued, actionMarkup, roomMarkup,
       spentBeforeEnd, goldAfterEnd, remainingAfterEnd, prepared,
       activeBonuses: { power: active.powerBonus, gold: active.goldBonus, shield: active.injuryShield },
       preparationsAfterDispatch: { ...state.guildPreparations }, spentAfterDispatch: state.guildActions.spent,
       preparationCaps: normaliseGuildPreparations({ nextQuestPower: 999, nextQuestGoldBonus: 999, nextQuestInjuryShield: 4 }) });
  `);

  assert.equal(result.hostQueued, true);
  assert.equal(result.boardQueued, true);
  assert.equal(result.duplicateBoard, false);
  assert.equal(result.trainingQueued, true);
  assert.equal(result.workshopQueued, true);
  assert.equal(result.spentBeforeEnd, 4);
  assert.match(result.actionMarkup, /4 of 4|0 of 4 available/);
  assert.match(result.actionMarkup, /Host Travellers/);
  assert.match(result.roomMarkup, /Feature A Contract/);
  assert.match(result.roomMarkup, /Gather Rumours/);
  assert.equal(result.goldAfterEnd, 129);
  assert.equal(result.remainingAfterEnd, 4);
  assert.deepEqual({ ...result.prepared }, { nextQuestPower: 3, nextQuestGoldBonus: 22, nextQuestInjuryShield: 1 });
  assert.deepEqual({ ...result.activeBonuses }, { power: 3, gold: 22, shield: 1 });
  assert.deepEqual({ ...result.preparationsAfterDispatch }, { nextQuestPower: 0, nextQuestGoldBonus: 0, nextQuestInjuryShield: 0 });
  assert.equal(result.spentAfterDispatch, 0);
  assert.deepEqual({ ...result.preparationCaps }, { nextQuestPower: 24, nextQuestGoldBonus: 80, nextQuestInjuryShield: 1 });
});

test("version 14 saves migrate to a fresh rank-scaled action day", () => {
  const context = createGameContext({
    version: 14,
    screen: "game",
    day: 5,
    gold: 120,
    fame: 20,
    adventurers: [],
    activeMissions: [],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: [], charterEarned: false },
    log: [],
    founderCreated: true
  });
  const result = run(context, `({ version: state.version, actionDay: state.guildActions.day,
    remaining: getGuildActionsRemaining(), capacity: getGuildActionCapacity(), preparations: { ...state.guildPreparations } })`);

  assert.equal(result.version, 21);
  assert.equal(result.actionDay, 5);
  assert.equal(result.remaining, 4);
  assert.equal(result.capacity, 4);
  assert.deepEqual({ ...result.preparations }, { nextQuestPower: 0, nextQuestGoldBonus: 0, nextQuestInjuryShield: 0 });
});

test("painted facility emblems replace letter badges and false room occupants", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const atlas = path.join(__dirname, "..", "assets", "facility-icons-v1.webp");
  const context = createGameContext();
  const result = run(context, `
    state.screen = "game";
    state.founderCreated = true;
    state.facilities = { tavern: 1, questBoard: 1, dormitory: 1, trainingYard: 1, kitchen: 1, workshop: 1 };
    renderRooms();
    renderFacilities();
    renderGuildhallInterior();
    renderMap();
    ({ roomGrid: elements.roomGrid.innerHTML, facilityList: elements.facilityList.innerHTML,
       guildhall: elements.guildhallInterior.innerHTML, detail: elements.guildhallRoomDetail.innerHTML,
       map: elements.realmMap.innerHTML });
  `);

  assert.ok(fs.existsSync(atlas));
  assert.ok(fs.statSync(atlas).size > 300_000);
  assert.match(styles, /url\("assets\/facility-icons-v1\.webp"\)/);
  assert.match(styles, /\.facility-emblem\.emblem-tavern[\s\S]*\.facility-emblem\.emblem-workshop/);
  assert.match(result.roomGrid, /facility-emblem emblem-tavern room-icon/);
  assert.match(result.facilityList, /facility-emblem emblem-questBoard facility-icon/);
  assert.match(result.guildhall, /facility-emblem emblem-dormitory guild-room-emblem/);
  assert.match(result.detail, /facility-emblem emblem-tavern room-detail-icon/);
  assert.match(result.map, /facility-emblem emblem-trainingYard map-facility-emblem/);
  assert.match(result.map, /facility-emblem emblem-tavern map-guild-emblem/);
  assert.doesNotMatch(result.guildhall, /room-scene/);
});

test("Greenbank requests rotate at daybreak and missed work changes the village mood", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "ranger", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.screen = "game";
    state.chapter.stage = "localRequests";
    state.facilities.questBoard = 1;
    const template = greenbankRequestDeck[0];
    state.greenbank.requests = [{ ...template, id: "expiring-request", rotatingRequest: true, spawnedDay: 1, expiresDay: 1 }];
    const before = { threat: state.greenbank.threat, confidence: state.greenbank.confidence };
    advanceDays(1);
    ({ day: state.day, requestCount: state.greenbank.requests.length,
       allRotating: state.greenbank.requests.every((request) => request.rotatingRequest),
       missed: state.greenbank.missedRequests,
       threatDelta: state.greenbank.threat - before.threat,
       confidenceDelta: state.greenbank.confidence - before.confidence,
       missedHeadline: state.greenbank.news.some((item) => item.headline === template.missedHeadline),
       reportDay: state.greenbank.lastReport.day, reportOpen: morningReportDialogOpen });
  `);

  assert.equal(result.day, 2);
  assert.equal(result.requestCount, 2);
  assert.equal(result.allRotating, true);
  assert.equal(result.missed, 1);
  assert.equal(result.threatDelta, 2 + greenbankFailureThreat(context, 0));
  assert.equal(result.confidenceDelta, -2);
  assert.equal(result.missedHeadline, true);
  assert.equal(result.reportDay, 2);
  assert.equal(result.reportOpen, true);
});

test("successful village requests award materials and improve Greenbank", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    founder.status = "busy";
    state.adventurers = [founder];
    state.founderCreated = true;
    state.facilities.questBoard = 1;
    const request = { ...greenbankRequestDeck[1], id: "request-success", rotatingRequest: true, guaranteedSuccess: true };
    const active = normaliseActiveMission({
      id: "active-request", missionId: request.id, missionSnapshot: request, partyIds: [founder.id],
      elapsed: request.duration, duration: request.duration, encounterStatus: "resolved"
    });
    state.activeMissions = [active];
    const before = { threat: state.greenbank.threat, confidence: state.greenbank.confidence };
    resolveMission(active);
    ({ materials: { ...state.materials }, completed: state.greenbank.completedRequests,
       threatDelta: state.greenbank.threat - before.threat,
       confidenceDelta: state.greenbank.confidence - before.confidence,
       heroStatus: founder.status,
       hasHeadline: state.greenbank.news.some((item) => item.headline === request.headline) });
  `);

  assert.deepEqual({ ...result.materials }, { timber: 0, iron: 0, herbs: 3 });
  assert.equal(result.completed, 1);
  assert.equal(result.threatDelta, -2);
  assert.equal(result.confidenceDelta, 4);
  assert.equal(result.heroStatus, "idle");
  assert.equal(result.hasHeadline, true);
});

test("the Workshop turns quest materials into equipment with honest power bonuses", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.screen = "game";
    state.facilities.workshop = 1;
    state.materials = { timber: 2, iron: 4, herbs: 1 };
    const mission = missionDeck[0];
    const baseline = getPartyPower([founder], mission);
    const crafted = craftEquipment("ironEdge");
    const item = state.equipment.items[0];
    const equipped = equipItem(founder.id, item.id);
    const equippedPower = getPartyPower([founder], mission);
    ({ crafted, equipped, baseline, equippedPower, materials: { ...state.materials },
       actionSpent: state.guildActions.spent, equippedTo: item.equippedTo,
       effectPower: getCharacterEffects(founder).find((effect) => effect.power === 2)?.power });
  `);

  assert.equal(result.crafted, true);
  assert.equal(result.equipped, true);
  assert.equal(result.equippedPower, result.baseline + 2);
  assert.deepEqual({ ...result.materials }, { timber: 1, iron: 1, herbs: 1 });
  assert.equal(result.actionSpent, 1);
  assert.ok(result.equippedTo);
  assert.equal(result.effectPower, 2);
});

test("Guild Rank promotions offer one lasting reward choice", () => {
  const context = createGameContext();
  const result = run(context, `
    state.founderCreated = true;
    state.screen = "game";
    state.fame = 18;
    const pending = syncRankReward("F");
    const selected = selectRankReward("buildersGift");
    ({ pending, selected, rank: getRank(), claimed: [...state.rankRewards.claimed],
       nextPending: state.rankRewards.pending, materials: { ...state.materials },
       news: state.greenbank.news.map((item) => item.headline) });
  `);

  assert.equal(result.pending, "D");
  assert.equal(result.selected, true);
  assert.equal(result.rank, "D");
  assert.deepEqual([...result.claimed], ["D"]);
  assert.equal(result.nextPending, null);
  assert.deepEqual({ ...result.materials }, { timber: 3, iron: 2, herbs: 0 });
  assert.ok(result.news.some((headline) => headline.includes("Builder's Gift")));
});

test("version 15 saves gain village, materials, equipment, and promotion defaults", () => {
  const context = createGameContext({
    version: 15,
    screen: "game",
    day: 8,
    gold: 140,
    fame: 20,
    adventurers: [],
    activeMissions: [],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: [], charterEarned: false },
    log: [],
    founderCreated: true
  });
  const result = run(context, `({ version: state.version, threat: state.greenbank.threat,
    confidence: state.greenbank.confidence, materials: { ...state.materials },
    equipmentCount: state.equipment.items.length, pendingRank: state.rankRewards.pending })`);

  assert.equal(result.version, 21);
  assert.equal(result.threat, 24);
  assert.equal(result.confidence, 42);
  assert.deepEqual({ ...result.materials }, { timber: 0, iron: 0, herbs: 0 });
  assert.equal(result.equipmentCount, 0);
  assert.equal(result.pendingRank, "D");
});

test("Greenbank news and morning reports ship with responsive management UI", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(index, /id="greenbankNewsPanel"/);
  assert.match(index, /id="greenbankNewsArchive"/);
  assert.match(index, /id="morningReportDialog"/);
  assert.match(styles, /\.greenbank-bulletin/);
  assert.match(styles, /\.morning-report-sheet/);
  assert.match(styles, /\.rank-choice-grid/);
  assert.match(styles, /@media \(max-width: 480px\)[\s\S]*\.morning-report-sheet/);
});

test("ending the seventh day publishes a weekly Chronicle and resets its tracker", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.screen = "game";
    state.day = 7;
    state.gold = 100;
    state.fame = 4;
    state.chronicle = createChronicleState(state);
    state.gold += 42;
    state.fame += 3;
    recordChronicleEvent({ type: "mission", success: true, heroIds: [founder.id], focus: "str", gold: 42, fame: 3,
      materials: { timber: 2 }, highlight: "Jenny guarded Greenbank Mill Road." });
    advanceDays(1);
    const report = state.greenbank.lastReport;
    ({ day: state.day, kind: report.kind, endDay: report.endDay, week: report.week,
       completed: report.metrics.missionsCompleted, questGold: report.metrics.questGold,
       timber: report.metrics.materialsGathered.timber, standout: report.standout.name,
       highlight: report.highlights[0], stored: state.chronicle.weeklyReports.length,
       nextStart: state.chronicle.week.startDay, reportOpen: morningReportDialogOpen,
       markup: renderChronicleReport(report) });
  `);

  assert.equal(result.day, 8);
  assert.equal(result.kind, "weekly");
  assert.equal(result.endDay, 7);
  assert.equal(result.week, 1);
  assert.equal(result.completed, 1);
  assert.equal(result.questGold, 42);
  assert.equal(result.timber, 2);
  assert.equal(result.standout, "Jenny");
  assert.match(result.highlight, /Jenny guarded/);
  assert.equal(result.stored, 1);
  assert.equal(result.nextStart, 8);
  assert.equal(result.reportOpen, true);
  assert.match(result.markup, /Adventurer of the week/);
});

test("ending day 28 creates a season review with a meaningful focus choice", () => {
  const context = createGameContext();
  const result = run(context, `
    const founder = makeAdventurer("Jenny", "ranger", true, "female");
    state.adventurers = [founder];
    state.founderCreated = true;
    state.screen = "game";
    state.day = 28;
    state.gold = 220;
    state.fame = 20;
    state.chronicle = createChronicleState(state);
    recordChronicleEvent({ type: "facility", label: "Training Yard built", highlight: "The Training Yard opened." });
    recordChronicleEvent({ type: "training", heroId: founder.id, highlight: "Jenny mastered fieldcraft." });
    advanceDays(1);
    const report = state.greenbank.lastReport;
    const choiceMarkup = renderChronicleReport(report);
    const selected = selectSeasonFocus("protectGreenbank");
    ({ day: state.day, kind: report.kind, season: report.season, year: report.year,
       facilities: report.metrics.facilitiesImproved, training: report.metrics.trainingCompleted,
       weeklyStored: state.chronicle.weeklyReports.length, seasonStored: state.chronicle.seasonReports.length,
       choiceMarkup, selected, focus: { ...state.chronicle.activeFocus }, storedFocus: state.chronicle.seasonReports[0].focusId,
       selectedMarkup: renderSeasonFocusChoices(report), nextSeasonStart: state.chronicle.season.startDay });
  `);

  assert.equal(result.day, 29);
  assert.equal(result.kind, "seasonal");
  assert.equal(result.season, "Spring");
  assert.equal(result.year, 1);
  assert.equal(result.facilities, 1);
  assert.equal(result.training, 1);
  assert.equal(result.weeklyStored, 1);
  assert.equal(result.seasonStored, 1);
  assert.match(result.choiceMarkup, /Choose Guildstead's Focus For The Next Season/);
  assert.equal(result.selected, true);
  assert.equal(result.focus.id, "protectGreenbank");
  assert.equal(result.focus.endsDay, 56);
  assert.equal(result.storedFocus, "protectGreenbank");
  assert.match(result.selectedMarkup, /Next season's focus/);
  assert.equal(result.nextSeasonStart, 29);
});

test("season focuses alter protection, prosperity, recruitment, and training", () => {
  const context = createGameContext();
  const result = run(context, `
    const hero = makeAdventurer("Jenny", "warden", true, "female");
    state.adventurers = [hero];
    state.founderCreated = true;
    state.facilities.questBoard = 1;
    state.day = 2;
    state.chronicle.activeFocus = { id: "protectGreenbank", startedDay: 1, endsDay: 28 };
    const threatBefore = state.greenbank.threat;
    advanceDays(1);
    const protectedGrowth = state.greenbank.threat - threatBefore;
    state.chronicle.activeFocus = null;
    const baselineGoldRate = getPartyGoldRate([hero]);
    const baselineXpRate = getXpRate(hero);
    state.chronicle.activeFocus = { id: "prosperTogether", startedDay: 3, endsDay: 30 };
    const prosperousGoldRate = getPartyGoldRate([hero]);
    state.chronicle.activeFocus = { id: "growGuild", startedDay: 3, endsDay: 30 };
    const recruitmentCost = getRecruitmentCost();
    state.chronicle.activeFocus = { id: "trainRoster", startedDay: 3, endsDay: 30 };
    const trainingCost = getTrainingCost(45);
    const xpRate = getXpRate(hero);
    ({ protectedGrowth, baselineGoldRate, prosperousGoldRate, recruitmentCost, trainingCost, baselineXpRate, xpRate });
  `);

  assert.equal(result.protectedGrowth, 1);
  assert.ok(Math.abs(result.prosperousGoldRate / result.baselineGoldRate - 1.08) < 0.0001);
  assert.equal(result.recruitmentCost, 35);
  assert.equal(result.trainingCost, 36);
  assert.ok(Math.abs(result.xpRate / result.baselineXpRate - 1.1) < 0.0001);
});

test("version 16 saves migrate to an empty but correctly aligned Chronicle", () => {
  const context = createGameContext({
    version: 16,
    screen: "game",
    day: 18,
    gold: 170,
    fame: 12,
    adventurers: [],
    activeMissions: [],
    facilities: { tavern: 1, questBoard: 1, dormitory: 0, trainingYard: 0, kitchen: 0, workshop: 0 },
    chapter: { stage: "localRequests", completedLocalMissions: [], charterEarned: false },
    greenbank: { threat: 31, confidence: 46, requests: [], news: [], completedRequests: 2, missedRequests: 1 },
    materials: { timber: 2, iron: 1, herbs: 3 },
    log: [],
    founderCreated: true
  });
  const result = run(context, `({ version: state.version, weekly: state.chronicle.weeklyReports.length,
    seasonal: state.chronicle.seasonReports.length, weekStart: state.chronicle.week.startDay,
    seasonStart: state.chronicle.season.startDay, focus: state.chronicle.activeFocus,
    baselineGold: state.chronicle.week.baseline.gold, baselineThreat: state.chronicle.week.baseline.threat })`);

  assert.equal(result.version, 21);
  assert.equal(result.weekly, 0);
  assert.equal(result.seasonal, 0);
  assert.equal(result.weekStart, 15);
  assert.equal(result.seasonStart, 1);
  assert.equal(result.focus, null);
  assert.equal(result.baselineGold, 170);
  assert.equal(result.baselineThreat, 31);
});

test("the Ledger and report sheet include responsive Chronicle presentation", () => {
  const styles = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  const index = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

  assert.match(index, /id="chronicleArchive"/);
  assert.match(styles, /\.chronicle-archive/);
  assert.match(styles, /\.chronicle-story-grid/);
  assert.match(styles, /\.season-focus-grid/);
  assert.match(styles, /@media \(max-width: 480px\)[\s\S]*\.season-focus-grid/);
});

test("a promotion choice remains available inside a weekly Chronicle", () => {
  const context = createGameContext();
  const result = run(context, `
    state.founderCreated = true;
    state.screen = "game";
    state.fame = 18;
    syncRankReward("F");
    state.greenbank.lastReport = createChronicleReport("weekly", state.chronicle.week, 7);
    morningReportDialogOpen = true;
    renderMorningReport();
    ({ pending: state.rankRewards.pending, markup: elements.morningReportBody.innerHTML });
  `);

  assert.equal(result.pending, "D");
  assert.match(result.markup, /Choose How Greenbank Marks The Promotion/);
  assert.match(result.markup, /data-rank-choice="buildersGift"/);
});

function greenbankFailureThreat(context, index) {
  return run(context, `greenbankRequestDeck[${index}].failure.threat`);
}
