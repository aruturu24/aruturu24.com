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

  /* ---------- Cursor sparkle (fine pointers only) ---------- */
  /* RAF loop runs ONLY while the battle section is on screen and the tab
     is visible — saves battery/CPU everywhere else on the page. */
  if (window.matchMedia("(pointer: fine)").matches) {
    const star = document.createElement("div");
    star.className = "cursor-star";
    star.textContent = "✦";
    star.setAttribute("aria-hidden", "true");
    document.body.appendChild(star);
    let sx = -100, sy = -100, tx = -100, ty = -100;
    let battleVisible = false;
    let rafId = null;
    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (battleVisible) star.classList.add("on");
    });
    document.addEventListener("mouseleave", () => star.classList.remove("on"));

    const loop = () => {
      rafId = null;
      sx += (tx - sx) * 0.16;
      sy += (ty - sy) * 0.16;
      star.style.transform = `translate(${sx + 14}px, ${sy + 14}px)`;
      if (battleVisible && !document.hidden) rafId = requestAnimationFrame(loop);
    };
    const updateLoop = () => {
      const shouldRun = battleVisible && !document.hidden;
      if (shouldRun && rafId === null) {
        rafId = requestAnimationFrame(loop);
      } else if (!shouldRun && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        star.classList.remove("on");
      }
    };
    const battleIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        battleVisible = e.isIntersecting;
        updateLoop();
      }),
      { threshold: 0.05 }
    );
    battleIO.observe(document.getElementById("battle"));
    document.addEventListener("visibilitychange", updateLoop);
  }

  /* ---------- Battle minigame ---------- */
  const PLAYER = { hp: 100, hpMax: 100, mp: 50, mpMax: 50, limit: 0, thunderCd: 0 };

  // Organic blobby SVG sprites — acid gradients, soft shapes, no hard strokes.
  const SPRITES = {
    bug:
      `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<defs><linearGradient id="g-bug" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#ff2d9b"/><stop offset="1" stop-color="#9b59b6"/></linearGradient></defs>` +
      `<line x1="30" y1="46" x2="12" y2="34" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>` +
      `<line x1="30" y1="58" x2="12" y2="70" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>` +
      `<line x1="70" y1="46" x2="88" y2="34" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>` +
      `<line x1="70" y1="58" x2="88" y2="70" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>` +
      `<line x1="42" y1="26" x2="37" y2="10" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>` +
      `<line x1="58" y1="26" x2="63" y2="10" stroke="#1a1a2e" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="37" cy="10" r="4" fill="#b8ff3a"/>` +
      `<ellipse cx="50" cy="52" rx="26" ry="22" fill="url(#g-bug)"/>` +
      `<circle cx="42" cy="48" r="7" fill="#fff"/><circle cx="58" cy="48" r="7" fill="#fff"/>` +
      `<circle cx="42" cy="48" r="3" fill="#1a1a2e"/><circle cx="58" cy="48" r="3" fill="#1a1a2e"/>` +
      `</svg>`,
    glitch:
      `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<defs><linearGradient id="g-glitch" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#44d2fa"/><stop offset="1" stop-color="#9b59b6"/></linearGradient></defs>` +
      `<rect x="20" y="16" width="46" height="20" rx="14" fill="url(#g-glitch)" opacity="0.9"/>` +
      `<rect x="34" y="34" width="46" height="20" rx="14" fill="#ff2d9b" opacity="0.9"/>` +
      `<rect x="18" y="52" width="42" height="20" rx="14" fill="url(#g-glitch)" opacity="0.9"/>` +
      `<rect x="42" y="34" width="10" height="8" rx="4" fill="#fff"/>` +
      `<rect x="26" y="54" width="10" height="8" rx="4" fill="#fff"/>` +
      `</svg>`,
    lagspike:
      `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<defs><linearGradient id="g-lag" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#44d2fa"/><stop offset="1" stop-color="#b8ff3a"/></linearGradient></defs>` +
      `<path d="M50 6 C66 26 64 46 58 64 C72 60 82 74 70 90 C58 98 42 98 30 90 C18 74 28 60 42 64 C36 46 34 26 50 6 Z" fill="url(#g-lag)"/>` +
      `<circle cx="50" cy="56" r="9" fill="#fff"/>` +
      `<circle cx="50" cy="56" r="4" fill="#1a1a2e"/>` +
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
