# Implementation Plan: FFXIV-Inspired Portfolio

## 1. HTML Structure

Single-page layout with fixed navigation and six sections. All content in `index.html`.

### Navigation
Fixed top bar with gold-accent links:
- `aria-label="Main navigation"`
- Links: About, Job Class, Quest Log, Achievements, Battle Arena, Contact
- Class: `.ffxiv-nav`

### Sections (in order)

#### 1.1 Hero / About (`#about`)
- Full-viewport height section
- Centered crystal graphic (CSS-only, no image)
- Large title: `桜 aruturu24` with gold glow
- Subtitle: `passionate developer. crazy about performance.`
- Subtle floating particle animation (CSS keyframes)
- Class: `.ffxiv-hero`

#### 1.2 Job Class / Skills (`#job-class`)
- Section title: `Job Class`
- Subtitle: `Black Mage / White Mage / etc.` (flavor text)
- Grid of skill icons arranged like FFXIV action bar
- Each skill: inline SVG icon + label
- Skills: Laravel, JavaScript, React Native, Java, PHP, SQL, Git, HTML/CSS
- Class: `.ffxiv-skills`

#### 1.3 Quest Log / Work Experience (`#quest-log`)
- Section title: `Quest Log`
- Styled as FFXIV quest journal entries
- Entry 1: `BGF Consultoria em Engenharia LTDA.` — IT Intern
  - Date: `jun '23 - jun '25`
  - Description as quest objectives (bullet points)
  - Class: `.quest-entry`, `.quest-complete`
- Class: `.ffxiv-quests`

#### 1.4 Achievements / Projects (`#achievements`)
- Section title: `Achievements`
- Styled as FFXIV achievement cards with icon, name, description
- Achievement 1: `burst` — habit tracker
  - Tech: React Native, Expo
  - Class: `.achievement-card`
- Class: `.ffxiv-achievements`

#### 1.5 Battle Arena (`#battle-arena`)
- Section title: `Battle Arena`
- Full-width battle stage
- Left: Player sprite (ASCII or CSS art)
- Right: Enemy sprite
- Bottom: Battle UI (HP/MP bars, action menu, message log)
- Class: `.ffxiv-battle`

#### 1.6 Contact (`#contact`)
- Section title: `Contact`
- Styled as FFXIV linkshell/pearl interface
- Links: GitHub, LinkedIn, Email, Twitter, Instagram
- Class: `.ffxiv-contact`

### Footer
- Minimal, centered, gold text
- `© 2025 aruturu24`

---

## 2. CSS Design System

### Color Palette (FFXIV-inspired)

```css
:root {
  /* Core FFXIV colors */
  --ffxiv-dark: #0a0a0f;           /* Deep background */
  --ffxiv-darker: #050508;         /* True black */
  --ffxiv-panel: #1a1a24;          /* UI panel background */
  --ffxiv-panel-light: #252532;    /* Lighter panel */
  
  /* Gold accents */
  --ffxiv-gold: #c9a227;           /* Primary gold */
  --ffxiv-gold-light: #e6c35c;     /* Highlight gold */
  --ffxiv-gold-dark: #8b6f1d;      /* Shadow gold */
  
  /* Crystal/aetheryte blue */
  --ffxiv-crystal: #4fc3f7;        /* Light blue */
  --ffxiv-crystal-dark: #0288d1;   /* Deep blue */
  --ffxiv-aether: #7c4dff;         /* Purple aether */
  
  /* Text */
  --ffxiv-text: #e0e0e0;           /* Primary text */
  --ffxiv-text-dim: #9e9e9e;       /* Secondary text */
  --ffxiv-text-gold: #ffd700;      /* Gold text */
  
  /* Status colors */
  --ffxiv-hp: #4caf50;             /* HP green */
  --ffxiv-mp: #2196f3;             /* MP blue */
  --ffxiv-limit: #ff9800;          /* Limit break orange */
  --ffxiv-danger: #f44336;         /* Damage red */
}
```

### Typography

```css
@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap");

/* Headings: dramatic serif */
--font-title: "Cinzel", serif;

/* Body/UI: clean monospace */
--font-body: "Roboto Mono", monospace;
```

- `h1, h2, h3`: `Cinzel`, gold color, letter-spacing `0.05em`
- Body: `Roboto Mono`, `#e0e0e0`
- UI elements: `Roboto Mono`, uppercase, small size

### Visual Effects

#### Crystal Motif
- Large crystal: CSS `clip-path` polygon with gradient background
- Glow: `box-shadow: 0 0 40px var(--ffxiv-crystal)`
- Animation: subtle rotation + pulse

#### Gold Accents
- Borders: `1px solid var(--ffxiv-gold)`
- Underlines: `border-bottom: 2px solid var(--ffxiv-gold)`
- Glow: `text-shadow: 0 0 10px var(--ffxiv-gold)`

#### Particles
- Floating dots: `position: absolute`, CSS animation
- Colors: gold, crystal blue, aether purple
- Opacity: `0.3` to `0.8`
- No JavaScript — pure CSS keyframes

#### Panel Style
- Background: `var(--ffxiv-panel)` with `backdrop-filter: blur(10px)`
- Border: `1px solid rgba(201, 162, 39, 0.3)`
- Border-radius: `4px`
- Box-shadow: `0 4px 20px rgba(0,0,0,0.5)`

#### CRT Effect (keep from original)
- Subtle scanlines: `repeating-linear-gradient`
- Very faint, doesn't interfere with FFXIV aesthetic

### Layout Classes

```css
.ffxiv-section {
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

.ffxiv-panel {
  background: var(--ffxiv-panel);
  border: 1px solid rgba(201, 162, 39, 0.3);
  border-radius: 4px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.gold-text {
  color: var(--ffxiv-gold);
  text-shadow: 0 0 10px rgba(201, 162, 39, 0.5);
}

.crystal-glow {
  box-shadow: 0 0 30px var(--ffxiv-crystal);
}
```

### Responsive
- Mobile: single column, larger touch targets
- Battle UI: stack vertically on mobile
- Font sizes: `clamp()` for fluid scaling

---

## 3. Battle Minigame Design

### Core Mechanics

**Player Stats:**
- HP: 100
- MP: 50
- Limit Break gauge: 0-100 (builds when taking damage)
- Class: Black Mage (fits developer theme)

**Enemy Types (3 total, random selection):**

| Enemy | HP | Attack | Weakness | Sprite |
|-------|-----|--------|----------|--------|
| Spriggan | 60 | 8-12 | Fire | ASCII rock creature |
| Goblin | 80 | 10-15 | Ice | ASCII goblin |
| Adamantoise | 120 | 5-10 | Blizzard | ASCII turtle |

**Player Actions:**

| Action | MP Cost | Effect | Cooldown |
|--------|---------|--------|----------|
| Fire | 10 | 15-20 damage | None |
| Blizzard | 10 | 12-18 damage, 20% freeze | None |
| Thunder | 15 | 18-25 damage | 1 turn |
| Cure | 12 | Restore 20-30 HP | None |
| Limit Break | 0 (full gauge) | 40-50 damage | One use |

**Enemy AI:**
- Simple random attack (70% normal, 30% special)
- Special: 1.5x damage, flavored text

### Battle Flow

1. Player selects action from menu
2. Player turn executes (animation + damage number)
3. Enemy turn executes (animation + damage number)
4. Check win/lose conditions
5. Repeat

### UI Layout

```
+------------------------------------------+
|  [Player Sprite]      [Enemy Sprite]     |
|  HP: ████████░░ 80/100  HP: ██████░░ 45/60|
|  MP: ██████░░░░ 30/50                     |
|  Limit: ████████░░ 80%                   |
+------------------------------------------+
|  > Fire    > Blizzard    > Thunder       |
|  > Cure    > Limit Break                 |
+------------------------------------------+
|  > You cast Fire!                        |
|  > Critical! 22 damage!                  |
|  > Goblin attacks! 12 damage!            |
+------------------------------------------+
```

### Battle UI Classes

```css
.battle-stage {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  min-height: 300px;
  background: linear-gradient(to bottom, #1a1a2e, #0a0a0f);
  border: 2px solid var(--ffxiv-gold);
  border-radius: 8px;
  padding: 2rem;
}

.combatant {
  text-align: center;
}

.hp-bar, .mp-bar, .limit-bar {
  width: 200px;
  height: 20px;
  background: #333;
  border: 1px solid var(--ffxiv-gold);
  border-radius: 3px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.hp-fill { background: var(--ffxiv-hp); height: 100%; transition: width 0.3s; }
.mp-fill { background: var(--ffxiv-mp); height: 100%; transition: width 0.3s; }
.limit-fill { background: var(--ffxiv-limit); height: 100%; transition: width 0.3s; }

.battle-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.battle-menu button {
  background: var(--ffxiv-panel);
  border: 1px solid var(--ffxiv-gold);
  color: var(--ffxiv-text);
  padding: 0.75rem;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s;
}

.battle-menu button:hover:not(:disabled) {
  background: var(--ffxiv-gold);
  color: var(--ffxiv-dark);
}

.battle-log {
  background: rgba(0,0,0,0.5);
  border: 1px solid var(--ffxiv-gold);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  max-height: 150px;
  overflow-y: auto;
  font-size: 0.9rem;
  line-height: 1.4;
}
```

### Damage Numbers
- Floating text: CSS animation `floatUp`
- Color: white (normal), gold (critical), red (player damage)
- Font size: `1.5rem`, bold

### Sprites
- ASCII art (keep original site's aesthetic)
- Player: simple mage figure
- Enemies: ASCII creatures from classic FF
- Alternative: CSS shapes (circle + triangle for crystal)

---

## 4. Asset Strategy

### Icons (Skills, Menu, UI)
- **Inline SVG** — no external files
- Simple geometric shapes (circle, triangle, square)
- FFXIV-style: outlined icons with glow
- Example: Fire icon = red/orange triangle with glow

### Fonts
- Google Fonts CDN: `Cinzel` (titles), `Roboto Mono` (body)
- Single `<link>` in `<head>`

### Sprites
- **Option A (preferred)**: ASCII art in `<pre>` tags, styled with CSS
- **Option B**: CSS-only shapes using `clip-path`
- No image files, no sprite sheets

### Effects
- **Particles**: Pure CSS with `animation`
- **Glow**: `box-shadow` and `text-shadow`
- **Transitions**: CSS `transition` on hover/active states
- **Damage numbers**: CSS `animation` on spawned elements

### Audio
- Skip (no audio files, keep it simple)

### External Dependencies
- Google Fonts only
- No JavaScript libraries
- No CSS frameworks

---

## 5. Implementation Order

### Phase 1: Foundation (HTML + CSS structure)
1. Rewrite `index.html` with all six sections
2. Create `style.css` with design system
3. Add Google Fonts
4. Implement navigation with smooth scroll
5. Test responsive layout

### Phase 2: Visual Polish (CSS effects)
1. Add crystal graphics
2. Implement particle animations
3. Add gold accents and glows
4. Style panels and cards
5. Add CRT effect (subtle)

### Phase 3: Battle System (game.js)
1. Create battle UI in HTML
2. Implement turn-based logic in `game.js`
3. Add player/enemy stats
4. Implement 5 actions
5. Add damage numbers and animations
6. Test win/lose conditions

### Phase 4: Content & Polish
1. Fill in real content (skills, quests, achievements)
2. Add enemy variety
3. Balance battle numbers
4. Final responsive check
5. Performance audit (no layout shifts)

### File Deliverables

```
index.html    (~200 lines) — all sections, battle UI
style.css     (~400 lines) — design system, animations
game.js       (~150 lines) — battle logic only
```

Total: ~750 lines across 3 files. No build step. No dependencies beyond Google Fonts.

---

## Content Mapping (Original → New)

| Original | New Section | Notes |
|----------|-------------|-------|
| ASCII art + name | Hero (#about) | Keep ASCII, add crystal |
| "work" BGF | Quest Log (#quest-log) | Style as quest entry |
| "projects" burst | Achievements (#achievements) | Style as achievement |
| Footer links | Contact (#contact) | Style as linkshell |
| (none) | Job Class (#job-class) | New: skills grid |
| (none) | Battle Arena (#battle-arena) | New: minigame |

---

## Success Criteria

- [ ] All six sections render correctly
- [ ] FFXIV aesthetic: dark, gold, crystals
- [ ] Battle minigame is playable (win/lose possible)
- [ ] No JavaScript errors
- [ ] Responsive on mobile
- [ ] Total files: 3 (index.html, style.css, game.js)
- [ ] Deployable to GitHub Pages
