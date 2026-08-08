const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function makeElement() {
  return {
    append() {},
    addEventListener() {},
    classList: { add() {}, remove() {}, toggle() {} },
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

test("a timed encounter exposes the founder's class response and records the choice", () => {
  const context = createGameContext();
  const result = run(context, `
    state.adventurers = [{
      id: "founder", name: "Jenny", gender: "female", race: "Human", classId: "warden", founder: true,
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
      id: "mage", name: "Mira", gender: "female", race: "Elf", classId: "spellwright", founder: false,
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
      id: "ranger", name: "Elowen", gender: "female", race: "Elf", classId: "ranger", founder: false,
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

test("version 9 saves gain encounter and inventory data without losing active missions", () => {
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

  assert.equal(result.version, 10);
  assert.equal(Object.keys(result.inventory).length, 0);
  assert.equal(result.missionCount, 1);
  assert.equal(result.encounterId, "collapsedBridge");
  assert.equal(result.encounterStatus, "waiting");
  assert.equal(result.enemyMaxHealth, 94);
});

test("encounter bonuses flow into final gold, fame, experience, and injury protection", () => {
  const context = createGameContext();
  const result = run(context, `
    state.adventurers = [{
      id: "founder", name: "Jenny", gender: "female", race: "Human", classId: "warden", founder: true,
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
