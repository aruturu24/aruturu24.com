# Implementation Plan — ACID GRAPHIC × NEO-Y2K × CYBER-ECLECTIC

> **Goal**: turn the current neo-brutalist portfolio into a chaotic acid trip through a Y2K
> computer interface. White base, organic morphing blobs, chromatic-aberration type, chrome
> headings, neon acid pops, sparkle scatter, film grain. **Chaos in decoration, clarity in content.**
> Same stack: single `index.html` + `style.css` + `game.js`, vanilla JS, GitHub Pages.

---

## 1. VISUAL IDENTITY — exactly what the user sees

### 1.1 The overall feeling
A pure-white page with a faint blue wash. Giant amorphous cyan→lavender blobs slowly morph
behind content. The name **ARTHUR GABRYEL** is huge chrome/liquid-metal gradient text with an
RGB-split chromatic-aberration ghost. Section headings are Syne, distorted, with pink/cyan
text-shadow split. ✦ ✧ ★ sparkles twinkle in random positions. Cards tilt -1.5deg / +1.5deg
alternately; on hover they glitch (translate jitter + color flash + iridescent gradient sweep).
Damage numbers in the battle arena pop with chromatic aberration. Everything sits under a
subtle film-grain layer. NO black borders, NO hard shadows — borders are soft gradients,
shadows are colored glows.

### 1.2 CSS custom properties (final palette — from AGENTS.md)
```css
:root {
  --bg: #ffffff;
  --bg-wash: #f0f8ff;
  --cyan: #44d2fa;
  --cyan-light: #c8f0f0;
  --cyan-glow: rgba(68, 210, 250, 0.4);
  --purple: #dcafe8;
  --purple-deep: #9b59b6;
  --acid-pink: #ff2d9b;
  --acid-lime: #b8ff3a;
  --acid-yellow: #fff740;
  --chrome-light: #e8ecf1;
  --chrome-mid: #b8c4d4;
  --chrome-shine: #ffffff;
  --text: #445157;
  --text-dim: #8a9ba3;
  --dark: #1a1a2e;
  --font-body: "Space Grotesk", system-ui, -apple-system, sans-serif;
  --font-display: "Syne", var(--font-body);
  --mono: ui-monospace, "Cascadia Mono", Consolas, monospace;
}
```

Fonts: add Syne to the Google Fonts link (weights 700, 800) alongside Space Grotesk:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
```

### 1.3 KEY EFFECTS — exact recipes (copy-paste targets)

**E1 — Chromatic aberration text** (`.acid-text`): used on section titles, `.hero-handle`,
damage numbers, `.vs`. No blur on the base text; two colored ghosts behind.
```css
.acid-text {
  text-shadow:
    -2px 0 var(--acid-pink),
     2px 0 var(--cyan),
     0 0 20px var(--cyan-glow);
}
/* big variant for section titles */
.section-title { text-shadow: -3px 0 var(--acid-pink), 3px 0 var(--cyan); }
```

**E2 — Chrome liquid-metal text** (`.chrome-text`): hero name only. Clipped gradient with a
slow shine sweep.
```css
.chrome-text {
  background: linear-gradient(
    175deg,
    var(--chrome-shine) 0%,
    var(--chrome-mid) 30%,
    var(--chrome-light) 50%,
    var(--chrome-mid) 62%,
    var(--chrome-shine) 85%
  );
  background-size: 100% 220%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: chromeSweep 6s ease-in-out infinite;
}
@keyframes chromeSweep {
  0%, 100% { background-position: 50% 0%; }
  50%      { background-position: 50% 100%; }
}
```

**E3 — Morphing organic blob** (`.blob`): absolute-positioned decoration, cyan→purple
gradient, GPU-cheap `border-radius` morph. One soft blurred variant behind the hero.
```css
.blob {
  position: absolute;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background: linear-gradient(135deg, var(--cyan), var(--purple));
  animation: morph 8s ease-in-out infinite;
  pointer-events: none;
}
.blob--soft { filter: blur(60px); opacity: 0.55; }
@keyframes morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}
/* alternate rhythm so multiple blobs don't sync */
.blob--alt { animation-duration: 11s; animation-direction: reverse; }
```

**E4 — Film grain** (`body::after`): keep the existing SVG feTurbulence data-URI technique,
tune opacity to **0.04**, `z-index: 9999`, `pointer-events: none`. Unchanged technique.

**E5 — Sparkle scatter** (`.spark`): decorative ✦/✧/★ spans, absolute, twinkle loop.
```css
.spark {
  position: absolute;
  pointer-events: none;
  line-height: 1;
  animation: twinkle 2.8s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.15; transform: scale(0.7) rotate(0deg); }
  50%      { opacity: 1;    transform: scale(1.15) rotate(20deg); }
}
```
Colors cycle through `--acid-pink`, `--acid-lime`, `--acid-yellow`, `--cyan` via modifier
classes `.spark--p/.spark--l/.spark--y/.spark--c`. Stagger with inline-free `animation-delay`
set per nth-child in each scatter group (e.g. `.hero-deco .spark:nth-child(2){animation-delay:.6s}` …).

**E6 — Glitch hover on cards** (`.card:hover` + `@keyframes glitch`): brief 300ms jitter then
settle lifted; border flashes pink; title gets aberration.
```css
.card:hover { animation: glitch 0.3s steps(2) 1; border-color: var(--acid-pink); }
.card:hover h3 { text-shadow: -2px 0 var(--acid-pink), 2px 0 var(--cyan); }
@keyframes glitch {
  0%   { transform: translate(0, 0) rotate(var(--tilt, 0deg)); }
  25%  { transform: translate(-4px, 2px) rotate(calc(var(--tilt, 0deg) - 1deg)); }
  50%  { transform: translate(3px, -3px) rotate(var(--tilt, 0deg)); }
  75%  { transform: translate(-2px, -2px) rotate(calc(var(--tilt, 0deg) + 1deg)); }
  100% { transform: translate(0, 0) rotate(var(--tilt, 0deg)); }
}
```

**E7 — Iridescent shimmer sweep** (`::before` on cards, chips, buttons): a skewed gradient bar
that sweeps across on hover.
```css
.card, .chip, .btn { position: relative; overflow: hidden; }
.card::before, .chip::before, .btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(68, 210, 250, 0.35) 48%,
    rgba(255, 45, 155, 0.35) 52%,
    transparent 60%
  );
  transform: translateX(-120%);
  transition: transform 0.5s ease;
  pointer-events: none;
}
.card:hover::before, .chip:hover::before, .btn:hover::before { transform: translateX(120%); }
```

**E8 — Soft acid panels** (replaces `.panel` brutalist style): white card, 2px gradient border
via `border-image` or plain cyan border, colored glow shadow instead of black offset shadow.
```css
.panel {
  background: #fff;
  border: 2px solid var(--cyan);
  border-radius: 18px;
  box-shadow: 0 0 0 4px rgba(68, 210, 250, 0.12), 0 18px 40px -18px var(--cyan-glow);
}
```

**E9 — Rotated elements**: every tilt uses the `--tilt` custom property so glitch keyframes
compose with it (see E6). Assign `.tilt-l { --tilt: -1.5deg; transform: rotate(var(--tilt)); }`
and `.tilt-r { --tilt: 1.5deg; transform: rotate(var(--tilt)); }` (values clamp -2deg…3deg).
Applied to: cards (alternating via `:nth-child(odd/even)`), section-title underline fragment,
hero kicker pill, exp-card, battle menu buttons (subtle 0.6deg).

**E10 — Acid dot/line fragments** (`.deco-dot`, `.deco-tri`): small neon circles and CSS
triangles (`border` trick, `border-color: transparent transparent var(--acid-lime)`) scattered
in section backgrounds, alternating pink/lime/yellow. Cheap `<span>` decor, `aria-hidden`.

**E11 — Buttons**: pill-less but soft (12px radius), cyan→purple gradient fill, hover = pink
flash + shimmer sweep (E7) + 2px lift. Ghost = white with cyan border and gradient text on hover.

**E12 — Marquee**: keep it, restyle: gradient track (cyan→purple→pink), Syne uppercase white
text with aberration, speed 18s.

---

## 2. HTML STRUCTURE — all 6 sections

Structure stays close to current `index.html` (semantic tags, ids, `#nav-toggle` pattern,
`data-reveal`) — the change is decorative layers and classes, not content. Every decorative
container gets `aria-hidden="true"`.

### 2.0 Global wrappers
- `<body>` gets one fixed decorative layer **behind** everything:
  ```html
  <div class="bg-deco" aria-hidden="true">
    <span class="blob blob--soft b1"></span>   <!-- 55vw, top:-10%, left:-12% -->
    <span class="blob blob--soft blob--alt b2"></span> <!-- 45vw, top:35%, right:-15% -->
    <span class="blob blob--soft b3"></span>   <!-- 50vw, bottom:-15%, left:20% -->
  </div>
  ```
  `.bg-deco { position: fixed; inset: 0; z-index: -1; overflow: hidden; background: linear-gradient(180deg, var(--bg), var(--bg-wash) 55%, var(--bg)); }`

### 2.1 Nav
- Same checkbox burger pattern. Restyle: nav becomes a floating translucent bar —
  `background: rgba(255,255,255,0.75); backdrop-filter: blur(10px); border-bottom: 2px solid var(--cyan);`
  Brand `ARUTURU24` in Syne with `.acid-text`. Links: uppercase Space Grotesk 0.8rem,
  letter-spacing 0.18em; hover = gradient text (cyan→pink via background-clip) — no blue blocks.
- Mobile dropdown panel: white 90% blur bg, 2px cyan border, links get alternating
  `--acid-pink` / `--cyan` left 4px accent bars.

### 2.2 Hero (`#hero`)
- Keep centered column (name readability) but surround with chaos:
  ```html
  <div class="hero-deco" aria-hidden="true">
    <span class="blob h1"></span>            <!-- 340px, top:8%, left:4%, sharp (no blur), opacity .8 -->
    <span class="blob blob--alt h2"></span>  <!-- 220px, bottom:12%, right:6% -->
    <span class="deco-tri t1"></span> …      <!-- 3 triangles, lime/pink/yellow -->
    <span class="deco-dot dt1"></span> …     <!-- 4 dots, 10-16px -->
    <span class="spark spark--p">✦</span> ×6 <!-- mixed ✦ ✧ ★, sizes 1–2.2rem, scattered -->
  </div>
  ```
- `.hero-kicker`: pill (`border-radius: 999px; border: 2px solid var(--cyan); background: #fff;
  rotate(-1.5deg)`), mono text `// São Paulo, Brazil`.
- `.hero-name`: `Syne 800`, `clamp(3rem, 14vw, 7rem)`, two lines, `.chrome-text` (E2),
  letter-spacing -0.02em, slight `-1deg` rotate on the block.
- `.hero-handle` `@aruturu24`: Syne 700, `--purple-deep`, `.acid-text`, letter-spacing 0.35em,
  lowercase — size contrast against the huge name (0.95rem).
- `.hero-tag`: Space Grotesk; `strong` gets gradient text pink→cyan.
- CTAs: `.btn` "View Projects" (gradient), `.btn.ghost` "Enter Battle Arena".

### 2.3 Marquee
- Keep between hero and skills; content updated: `✦ Passionate Developer ✧ Crazy About
  Performance ✦ São Paulo BR ✧ Ship It ✦ ` ×2. Restyle per E12.

### 2.4 Skills (`#skills`)
- Section header pattern (shared, see 2.9). The `.chip-grid` stays flex-wrap.
- Each `.chip`: white, 2px cyan border, `border-radius: 999px`, mono-free Space Grotesk 600.
  Chips get per-nth-child accent: `:nth-child(3n+1)` hover glow pink, `(3n+2)` lime text flash,
  `(3n+3)` yellow — plus shimmer sweep E7. Every 4th chip `rotate(-2deg)`, every 5th `rotate(2deg)`.
- Deco: one `.blob` (180px, purple→cyan, opacity .35, right edge, half outside container)
  + 3 sparks.

### 2.5 Experience (`#experience`)
- `.exp-card` becomes soft acid panel (E8) with a **blob-shaped left accent**: instead of the
  10px black bar, a `::before` 8px-wide pill bar with `border-radius: 8px` and
  `background: linear-gradient(180deg, var(--acid-pink), var(--cyan))`. Card rotated `-1deg`.
- `.exp-role` badge: pink bg, white text, 999px radius, `rotate(2deg)`.
- `.exp-date`: mono, `--text-dim`, plain (no box).
- `.exp-list li::before`: 8px dot, `border-radius: 50%`, alternating `--cyan`/`--acid-pink`.
- `.exp-status`: lime-tinted chip (`background: var(--acid-lime); color: var(--dark)`), tiny rotate.

### 2.6 Projects (`#projects`)
- `.card-grid`: same responsive grid (1/2/3 cols). Cards get `--tilt` alternating via
  `:nth-child(odd) { --tilt: -1.5deg } / :nth-child(even) { --tilt: 1.5deg }` + E6 glitch hover.
- Card interior: `h3` Syne 700 with per-card accent cycling cyan → pink → purple-deep
  (`:nth-child(3n)` rules); `.tags` mono `--purple-deep`.
- Each card corner gets a tiny `✦` (`::after`, top-right, `--acid-yellow`, opacity .7).
- Featured card idea **rejected** — keep all 7 equal (minimal change, grid stays simple).

### 2.7 Battle Arena (`#battle`)
- `.battle-stage`: soft acid panel, but framed like an arcade screen: `border: 3px solid
  var(--dark); border-radius: 24px; box-shadow: 0 0 30px var(--cyan-glow), inset 0 0 60px
  rgba(220,175,232,0.15);` — the one place `--dark` appears = focal point.
- Two `.combatant` columns + `.vs`. `.vs` becomes an acid starburst: Syne 800, `.acid-text`,
  `rotate(-6deg)`, font-size 1.6rem, no box.
- Sprites sit on a **blob pedestal**: `.sprite { border: none; background: radial-gradient(circle
  at 35% 30%, var(--cyan-light), var(--purple)); border-radius: 55% 45% 60% 40% / 50% 55% 45% 50%;
  animation: morph 6s …, bob 3s …; }` (two animations comma-combined).
- HP/MP/LB bars: `border-radius: 999px; border: 2px solid var(--dark); height: 16px;` fills:
  hp = `linear-gradient(90deg, var(--acid-lime), #7fe000)`, mp = `linear-gradient(90deg, var(--cyan),
  var(--purple-deep))`, lb = `linear-gradient(90deg, var(--acid-pink), var(--acid-yellow))`,
  enemy = `linear-gradient(90deg, var(--purple-deep), var(--acid-pink))`. Add `box-shadow:
  0 0 8px currentColor`-style glow per fill via colored shadows.
- Menu buttons: white, 2px dark border, 14px radius, acid hover (gradient border flash via
  `border-color` + shimmer). `#limit-btn` ready state: pink→yellow gradient bg +
  `limitPulse` (scale 1↔1.04 + glow), replaces `limitFlash`.
- `.battle-log`: dark terminal inset — `background: var(--dark); color: #d7f9ff;
  border-radius: 16px; border: 2px solid var(--purple-deep);` log classes:
  `.log-player` cyan, `.log-enemy` pink, `.log-crit` yellow + uppercase, `.log-system` dim italic.
- Damage numbers: see §4.

### 2.8 Contact (`#contact`)
- `.contact-grid` stays auto-fit grid of buttons; buttons alternate `.tilt-l/.tilt-r`,
  get shimmer sweep + hover gradient bg (cyan→purple, white text). Email one gets
  `--acid-pink` border to pop.
- Deco: blob behind the grid (`z-index:-1` within section, opacity .3) + sparks.

### 2.9 Shared section header pattern
```html
<h2 class="section-title"><span class="section-num">01</span>Skills</h2>
<p class="section-sub">// tech stack — tools I build with every day</p>
```
- `.section-title`: Syne 800, `clamp(2rem, 7vw, 3.4rem)`, color `--dark`, `.acid-text` big
  variant, uppercase; `::after` becomes a **wavy fragment**: flex-1, height 6px,
  `background: linear-gradient(90deg, var(--cyan), var(--acid-pink), var(--acid-lime));
  border-radius: 6px; transform: rotate(-0.6deg);`
- `.section-num`: `--acid-pink`, mono, `0.45em`, slight -2deg.
- `.section-sub`: mono `--text-dim`, unchanged role.

### 2.10 Section overlap & rhythm
- `.section { position: relative; padding: 5.5rem 1.2rem 4rem; }` — no overlap of *content*,
  overlap achieved by **decoration bleeding**: each section's `.blob`/sparks use negative
  offsets to cross into neighbors (`top: -60px` etc.), and the fixed `.bg-deco` blobs unify
  the page. Keeps DOM simple, avoids z-index wars.
- `scroll-padding-top: 72px` retained.

---

## 3. CSS ARCHITECTURE

### 3.1 File layout (single `style.css`, comment-banner sections, top→bottom cascade)
```
1.  Fonts note + :root tokens (palette, fonts, --tilt default)
2.  Reset, html/body, ::selection (cyan bg), focus-visible (3px var(--acid-pink) outline)
3.  Grain overlay (body::after, E4)
4.  Background deco layer (.bg-deco + .blob system, E3)
5.  Utilities: .acid-text, .chrome-text, .tilt-l/.tilt-r, .spark, .deco-dot, .deco-tri
6.  Nav
7.  Shared: .section, .section-title, .section-sub, .panel, .btn, [data-reveal]
8.  Hero (+ .hero-deco)
9.  Marquee
10. Skills / chips
11. Experience
12. Projects / cards
13. Battle Arena (stage, sprites, bars, menu, log, dmg numbers)
14. Contact, Footer
15. Media queries (768px, 1024px) + mobile deco scaling
16. prefers-reduced-motion
```

### 3.2 Key techniques
- **text-shadow chromatic aberration** (E1) — no pseudo-elements needed; keep offsets 2px
  (3px for titles) so text stays legible; pair with `--cyan-glow` bloom only on dark-free zones.
- **border-radius morph blobs** (E3) — animate `border-radius` only (compositor-friendly
  enough at these sizes); never animate width/height/filter. Blur variant uses one-time
  `filter: blur(60px)` (static, cheap).
- **SVG feTurbulence grain** (E4) — existing data-URI, opacity 0.04.
- **Gradient overlays**: all neon surfaces use 2–3 stop linear-gradients at 105–135deg;
  text gradients via `background-clip: text; color: transparent` (with `-webkit-` prefix).
- **Custom properties drive chaos**: `--tilt` per element lets one `@keyframes glitch` work
  for every rotated card (E6/E9). Palette tokens only from `:root` — no stray hex codes
  except inside gradient literals where a mid-stop is needed (allowed: `#7fe000` in hp fill,
  `#d7f9ff` log text).
- **Reveal**: keep IntersectionObserver + `[data-reveal]`, but ease becomes
  `transform: translateY(28px) rotate(0.6deg) scale(0.98)` → none, `cubic-bezier(.22,1,.36,1)`, 0.7s.

### 3.3 Performance budget
- Max ~20 concurrent CSS animations; all transform/opacity/border-radius only.
- `will-change` nowhere except `.marquee-track`.
- No backdrop-filter except nav (one element).

---

## 4. BATTLE MINIGAME — acid restyle

**JS changes are small** (game.js logic untouched except sprites + two class hooks):

1. **Blob-shaped enemy sprites** — replace the 3 polygon SVGs in `SPRITES` with organic blobs
   built from `<ellipse>`/`<path>` + acid gradients (define `<linearGradient>` per sprite with
   unique ids `g-bug`, `g-glitch`, `g-lag`):
   - **Bug**: wobbly body ellipse (`rx 26 ry 22`, fill `url(#g-bug)` pink→purple), 6 short
     curved legs (`stroke: var(--dark)` → use `#1a1a2e`, stroke-width 4, round caps), two
     white eyes with dark pupils, one lime antenna dot.
   - **Glitch**: three offset overlapping blobby rects with `rx: 14` (cyan / purple / pink,
     opacity .9, slightly translated to look "duplicated wrong") + two white eyes.
   - **Lag Spike**: tall droplet/blob path (cyan→lime gradient), wavy base, one big eye.
   - All: `stroke: none` on bodies, soft shapes — match "organic blobby" direction.
2. **Player sprite**: swap the polygon gem for a blob knight — cyan→purple gradient blob body,
   single white visor rect (`rx: 6`), tiny yellow ✦ on top.
3. **Damage numbers with chromatic aberration** — CSS only (no JS change; classes already
   emitted): `.dmg-number` gets Syne 800 + per-type color + aberration shadow:
   ```css
   .dmg-number { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem;
                 text-shadow: -2px 0 var(--acid-pink), 2px 0 var(--cyan), 0 2px 0 rgba(255,255,255,.8); }
   .dmg-number.normal { color: var(--cyan); }
   .dmg-number.crit   { color: var(--acid-yellow); font-size: 1.9rem; }
   .dmg-number.player { color: var(--acid-pink); }
   .dmg-number.heal   { color: var(--acid-lime); }
   ```
   Keep `dmgFloat` but add a 1.15 scale pop at 20%.
4. **Neon bars/UI** — per §2.7 (rounded gradient fills, glow shadows, dark arcade frame).
5. **Hit feedback**: `.sprite.hit` shake keeps 300ms, but add `filter: hue-rotate(90deg)`
   flash during shake for acid feel.
6. Optional-but-cheap: on `limit` use, `log-crit` message "LIMIT BREAK! Ship It To Production!"
   already exists — style `.log-crit` with yellow + aberration. No new JS.

---

## 5. TECH STACK — recommendation

**Stay with vanilla: raw HTML + CSS + JS + Google Fonts CDN. No GSAP, no anime.js, no Three.js, no Tailwind.**

Justification:
- Every planned effect is natively cheap CSS: `border-radius` morphs, `text-shadow`
  aberration, gradient clips, keyframe twinkles/glitch, SVG grain, IntersectionObserver reveal.
  GSAP would add ~70kB to animate properties CSS already handles declaratively.
- Three.js/WebGL blobs are overkill; blurred gradient divs achieve the acid look at 0 JS cost
  and zero jank on low-end phones.
- The site is already dependency-free and deploys to GitHub Pages by pushing files — keeping
  it that way preserves the simplest possible pipeline and fastest load (perf fits the
  "crazy about performance" bio).
- The only runtime JS remains: nav toggle close, reveal observer, battle engine (existing).

---

## 6. IMPLEMENTATION ORDER

1. **Tokens & fonts** — swap `:root` palette, add Syne link, set `--font-display`; quick sanity
   load in browser.
2. **Global layers** — grain opacity tune, `.bg-deco` + `.blob` system + `@keyframes morph`,
   body background wash.
3. **Utility classes** — `.acid-text`, `.chrome-text`, `.tilt-*`, `.spark` + `twinkle`,
   `.deco-dot`, `.deco-tri`, shimmer `::before` mixin applied to `.btn`.
4. **Nav restyle** — blur bar, gradient link hovers, mobile panel accents.
5. **Hero** — deco layer markup (blobs/tris/dots/sparks), chrome name, kicker pill, CTA styles.
6. **Marquee** — gradient track, Syne, new content.
7. **Section header pattern + `.panel`/`.btn` global restyle** — verify across all sections.
8. **Skills** — chip pill styles, nth-child accent/rotation rhythm, section deco.
9. **Experience** — gradient accent bar, badges, dot bullets, tilts.
10. **Projects** — card `--tilt` system, glitch hover, aberration titles, corner ✦.
11. **Battle arena CSS** — arcade frame, blob pedestals, neon bars, dark log, dmg-number styles.
12. **Battle arena JS** — replace 4 SVG sprite strings (bug/glitch/lagspike/player), nothing else.
13. **Contact + footer** — button tilts, pink email accent, footer divider (2px gradient line).
14. **Mobile pass** (§7) + **reduced-motion pass** (extend existing block: kill morph, twinkle,
    glitch, chromeSweep, marquee, blob animations).
15. **Verify** — serve locally (`python -m http.server`), check all sections, play one full
    battle, test 360px/768px/1440px widths, run a quick Lighthouse sanity check.
16. Update `AGENTS.md` only if actual structure/classes diverge from this plan.

---

## 7. MOBILE STRATEGY — chaos on small screens

- **Deco scaling, not removal**: `.bg-deco` blobs shrink to 70vw/60vw and gain blur (softer,
  cheaper); hero blob `.h1` 340px → `min(60vw, 340px)`. Sparks: hide every second one on
  `<768px` (`.hero-deco .spark:nth-child(even) { display: none }`) — keeps twinkle life
  without clutter.
- **Typography**: `clamp()` already fluid; hero name floor 3rem; section-title aberration
  drops from 3px to 2px offsets at `<768px` (media query overrides E1 big variant) to protect
  legibility on narrow screens.
- **Rotations**: global tilts halve on mobile (`--tilt: -0.8deg / 0.8deg` via redefining
  `.tilt-l/.tilt-r` inside the 768px query) so cards don't clip viewport edges; keep
  `overflow-x: hidden` on body as the safety net.
- **Layout**: single column everywhere (grids already collapse); battle stage stacks
  player → VS → enemy (current behavior retained); menu stays 2-col grid, limit button
  full-width — already mobile-first.
- **Touch**: all interactive targets ≥48px tall (existing `.btn`, chips, menu buttons comply);
  hover-only effects (glitch, shimmer) degrade gracefully — `:hover` simply never fires; add
  `@media (hover: none) { .card::before, .chip::before, .btn::before { display: none } }` to
  skip rendering the shimmer layer entirely.
- **Performance**: `filter: blur()` only on the 3 fixed background blobs on mobile (drop
  `.blob--soft` from in-section decos under 768px); animation count stays under budget (§3.4).
- **Nav**: burger menu keeps existing pattern, restyled (§2.1); dropdown links get full-width
  48px rows with alternating pink/cyan accent bars.

---

## Appendix — quick reference: what replaces what

| Current (neo-brutalist)          | New (acid)                                   |
|----------------------------------|----------------------------------------------|
| 3px black borders                | 2px cyan/gradient borders, 12–24px radius    |
| 7px black offset shadows         | colored glow shadows (`--cyan-glow`)         |
| blue `#0c10f8` headings          | Syne + aberration, `--dark` base             |
| hero name flat blue              | `.chrome-text` liquid metal sweep            |
| deco boxes / plus signs          | morphing blobs, triangles, dots, ✦ sparks    |
| polygon SVG sprites              | organic gradient blob SVGs                   |
| `limitFlash` steps(2)            | `limitPulse` scale+glow                      |
| flat bar fills                   | neon gradient fills with glow                |
