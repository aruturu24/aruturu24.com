(() => {
  "use strict";

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("on")),
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));

  /* ---------- Mobile nav: close on link tap ---------- */
  const toggle = document.getElementById("nav-toggle");
  document.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => (toggle.checked = false))
  );

  /* ---------- Battle minigame ---------- */
  const PLAYER = { hp: 100, hpMax: 100, mp: 50, mpMax: 50, limit: 0, thunderCd: 0 };

  // Geometric SVG sprites — sharp, black-stroked, blue/purple. No ASCII.
  const SPRITES = {
    bug:
      `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<line x1="28" y1="44" x2="10" y2="32" stroke="#000" stroke-width="4"/>` +
      `<line x1="28" y1="58" x2="10" y2="70" stroke="#000" stroke-width="4"/>` +
      `<line x1="72" y1="44" x2="90" y2="32" stroke="#000" stroke-width="4"/>` +
      `<line x1="72" y1="58" x2="90" y2="70" stroke="#000" stroke-width="4"/>` +
      `<line x1="42" y1="24" x2="36" y2="8" stroke="#000" stroke-width="4"/>` +
      `<line x1="58" y1="24" x2="64" y2="8" stroke="#000" stroke-width="4"/>` +
      `<polygon points="50,24 73,38 73,63 50,77 27,63 27,38" fill="#0c10f8" stroke="#000" stroke-width="4"/>` +
      `<rect x="40" y="44" width="8" height="8" fill="#fff"/>` +
      `<rect x="54" y="44" width="8" height="8" fill="#fff"/>` +
      `</svg>`,
    glitch:
      `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<rect x="22" y="16" width="46" height="14" fill="#5b45c1" stroke="#000" stroke-width="4"/>` +
      `<rect x="36" y="36" width="46" height="14" fill="#0c10f8" stroke="#000" stroke-width="4"/>` +
      `<rect x="14" y="56" width="42" height="14" fill="#5b45c1" stroke="#000" stroke-width="4"/>` +
      `<rect x="40" y="76" width="34" height="10" fill="#000"/>` +
      `<rect x="48" y="40" width="8" height="6" fill="#fff"/>` +
      `<rect x="28" y="60" width="8" height="6" fill="#fff"/>` +
      `</svg>`,
    lagspike:
      `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<polygon points="50,4 63,56 50,96 37,56" fill="#0c10f8" stroke="#000" stroke-width="4"/>` +
      `<polygon points="18,28 34,60 22,90" fill="#5b45c1" stroke="#000" stroke-width="4"/>` +
      `<polygon points="82,28 66,60 78,90" fill="#5b45c1" stroke="#000" stroke-width="4"/>` +
      `</svg>`,
  };

  const ENEMIES = [
    { name: "Bug", hp: 60, hpMax: 60, atkMin: 8, atkMax: 12, sprite: SPRITES.bug },
    { name: "Glitch", hp: 85, hpMax: 85, atkMin: 10, atkMax: 15, sprite: SPRITES.glitch },
    { name: "Lag Spike", hp: 110, hpMax: 110, atkMin: 6, atkMax: 14, sprite: SPRITES.lagspike },
  ];

  const ACTIONS = {
    fire: { mp: 10, dmg: [15, 20], msg: "You cast Fire!" },
    blizzard: { mp: 10, dmg: [12, 18], freeze: 0.2, msg: "You cast Blizzard!" },
    thunder: { mp: 15, dmg: [18, 25], cd: 1, msg: "You cast Thunder!" },
    cure: { mp: 12, heal: [20, 30], msg: "You cast Cure!" },
  };

  let enemy = null;
  let busy = false;
  let frozen = false;

  const el = (id) => document.getElementById(id);
  const menu = el("battle-menu");
  const log = el("battle-log");
  const newGameBtn = el("new-game");

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function logMsg(text, cls = "") {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  function dmgNumber(side, text, type) {
    const span = document.createElement("span");
    span.className = "dmg-number " + type;
    span.textContent = text;
    side.appendChild(span);
    setTimeout(() => span.remove(), 1000);
  }

  function shake(side) {
    const s = side.querySelector(".sprite");
    s.classList.add("hit");
    setTimeout(() => s.classList.remove("hit"), 300);
  }

  function render() {
    el("player-hp").style.width = (PLAYER.hp / PLAYER.hpMax) * 100 + "%";
    el("player-hp-text").textContent = `${PLAYER.hp}/${PLAYER.hpMax}`;
    el("player-mp").style.width = (PLAYER.mp / PLAYER.mpMax) * 100 + "%";
    el("player-mp-text").textContent = `${PLAYER.mp}/${PLAYER.mpMax}`;
    el("player-limit").style.width = PLAYER.limit + "%";
    el("player-limit-text").textContent = PLAYER.limit + "%";
    el("enemy-hp").style.width = (enemy.hp / enemy.hpMax) * 100 + "%";
    el("enemy-hp-text").textContent = `${enemy.hp}/${enemy.hpMax}`;

    el("limit-btn").disabled = PLAYER.limit < 100;
    menu.querySelector('[data-action="thunder"]').disabled =
      PLAYER.thunderCd > 0 || PLAYER.mp < ACTIONS.thunder.mp;
  }

  function disableMenu(disabled) {
    menu.querySelectorAll("button").forEach((b) => {
      if (b.id === "limit-btn") return;
      b.disabled = disabled || PLAYER.mp < (ACTIONS[b.dataset.action]?.mp || 0) || PLAYER.thunderCd > 0;
    });
    el("limit-btn").disabled = PLAYER.limit < 100;
  }

  function checkEnd() {
    if (enemy.hp <= 0) {
      logMsg(`${enemy.name} is defeated! Victory!`, "log-system");
      endBattle();
      return true;
    }
    if (PLAYER.hp <= 0) {
      logMsg("You have fallen in battle...", "log-enemy");
      endBattle();
      return true;
    }
    return false;
  }

  function enemyTurn() {
    if (frozen) {
      logMsg(`${enemy.name} is frozen and cannot act!`, "log-system");
      frozen = false;
    } else {
      const special = Math.random() < 0.3;
      let dmg = rand(enemy.atkMin, enemy.atkMax);
      if (special) {
        dmg = Math.round(dmg * 1.5);
        logMsg(`${enemy.name} uses a special attack!`, "log-enemy");
      } else {
        logMsg(`${enemy.name} attacks!`, "log-enemy");
      }
      PLAYER.hp = Math.max(0, PLAYER.hp - dmg);
      PLAYER.limit = Math.min(100, PLAYER.limit + 15);
      dmgNumber(el("player-side"), "-" + dmg, "player");
      shake(el("player-side"));
    }
    render();
    if (!checkEnd()) {
      if (PLAYER.thunderCd > 0) PLAYER.thunderCd--;
      busy = false;
      disableMenu(false);
    }
  }

  function playerTurn(action) {
    if (busy) return;
    busy = true;
    disableMenu(true);

    if (action === "limit") {
      const dmg = rand(40, 50);
      enemy.hp = Math.max(0, enemy.hp - dmg);
      PLAYER.limit = 0;
      logMsg("LIMIT BREAK! Ship It To Production!", "log-crit");
      dmgNumber(el("enemy-side"), "-" + dmg, "crit");
      shake(el("enemy-side"));
      render();
      if (!checkEnd()) setTimeout(enemyTurn, 700);
      return;
    }

    const a = ACTIONS[action];
    if (PLAYER.mp < a.mp) {
      logMsg("Not enough MP!", "log-system");
      busy = false;
      disableMenu(false);
      return;
    }
    PLAYER.mp -= a.mp;
    logMsg(a.msg, "log-player");

    if (action === "cure") {
      const heal = rand(a.heal[0], a.heal[1]);
      PLAYER.hp = Math.min(PLAYER.hpMax, PLAYER.hp + heal);
      dmgNumber(el("player-side"), "+" + heal, "heal");
      render();
      setTimeout(enemyTurn, 700);
      return;
    }

    let dmg = rand(a.dmg[0], a.dmg[1]);
    const crit = Math.random() < 0.15;
    if (crit) dmg = Math.round(dmg * 1.5);
    if (a.freeze && Math.random() < a.freeze) {
      frozen = true;
      logMsg(`${enemy.name} is frozen!`, "log-system");
    }
    enemy.hp = Math.max(0, enemy.hp - dmg);
    dmgNumber(el("enemy-side"), "-" + dmg, crit ? "crit" : "normal");
    shake(el("enemy-side"));
    logMsg(crit ? `Critical! ${dmg} damage!` : `${dmg} damage!`, crit ? "log-crit" : "log-player");

    if (action === "thunder") PLAYER.thunderCd = a.cd;

    render();
    if (!checkEnd()) setTimeout(enemyTurn, 700);
  }

  function endBattle() {
    busy = true;
    disableMenu(true);
    newGameBtn.hidden = false;
  }

  function startBattle() {
    enemy = Object.assign({}, ENEMIES[rand(0, ENEMIES.length - 1)]);
    PLAYER.hp = PLAYER.hpMax;
    PLAYER.mp = PLAYER.mpMax;
    PLAYER.limit = 0;
    PLAYER.thunderCd = 0;
    frozen = false;
    busy = false;

    el("enemy-name").textContent = enemy.name;
    el("enemy-sprite").innerHTML = enemy.sprite;
    log.innerHTML = "";
    logMsg(`A wild ${enemy.name} appears!`, "log-system");
    newGameBtn.hidden = true;
    render();
    disableMenu(false);
  }

  menu.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && !btn.disabled) playerTurn(btn.dataset.action);
  });
  newGameBtn.addEventListener("click", startBattle);

  startBattle();
})();
