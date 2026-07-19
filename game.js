(() => {
  "use strict";

  const PLAYER = { hp: 100, hpMax: 100, mp: 50, mpMax: 50, limit: 0, thunderCd: 0 };

  const ENEMIES = [
    {
      name: "Spriggan",
      hp: 60, hpMax: 60, atkMin: 8, atkMax: 12, weakness: "fire",
      sprite: "   .--.\n  ( ◣ ◢ )\n  /|  |\\\n  '|  |'\n  (    )",
    },
    {
      name: "Goblin",
      hp: 80, hpMax: 80, atkMin: 10, atkMax: 15, weakness: "ice",
      sprite: "   ___\n  (o  o)\n  /|/\\|\\\n  ( ---- )\n   |  |",
    },
    {
      name: "Adamantoise",
      hp: 120, hpMax: 120, atkMin: 5, atkMax: 10, weakness: "blizzard",
      sprite: "  _______\n (_______)\n  |o   o|\n  |  ^  |\n (_/___\\_)",
    },
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

    const limitBtn = el("limit-btn");
    limitBtn.disabled = PLAYER.limit < 100;
    const thunder = menu.querySelector('[data-action="thunder"]');
    thunder.disabled = PLAYER.thunderCd > 0 || PLAYER.mp < ACTIONS.thunder.mp;
  }

  function disableMenu(disabled) {
    menu.querySelectorAll("button").forEach((b) => {
      if (b.id === "limit-btn") return;
      if (disabled) b.disabled = true;
      else b.disabled = PLAYER.mp < (ACTIONS[b.dataset.action]?.mp || 0) || PLAYER.thunderCd > 0;
    });
    el("limit-btn").disabled = PLAYER.limit < 100;
  }

  function checkEnd() {
    if (enemy.hp <= 0) {
      logMsg(`${enemy.name} is defeated! Victory!`, "log-system");
      endBattle(true);
      return true;
    }
    if (PLAYER.hp <= 0) {
      logMsg("You have fallen in battle...", "log-enemy");
      endBattle(false);
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
      logMsg("LIMIT BREAK! Asteroid Impact!", "log-crit");
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
    let crit = Math.random() < 0.15;
    if (crit) dmg = Math.round(dmg * 1.5);
    if (a.freeze && Math.random() < a.freeze) {
      frozen = true;
      logMsg(`${enemy.name} is frozen!`, "log-system");
    }
    enemy.hp = Math.max(0, enemy.hp - dmg);
    dmgNumber(el("enemy-side"), "-" + dmg, crit ? "crit" : "normal");
    shake(el("enemy-side"));
    if (crit) logMsg("Critical! " + dmg + " damage!", "log-crit");
    else logMsg(dmg + " damage!", "log-player");

    if (action === "thunder") PLAYER.thunderCd = a.cd;

    render();
    if (!checkEnd()) setTimeout(enemyTurn, 700);
  }

  function endBattle(won) {
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
    el("enemy-sprite").textContent = enemy.sprite;
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
