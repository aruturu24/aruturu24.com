# Implementation Plan: Neo-Y2K Portfolio — AGGRESSIVE REVISION

## Visual Style Direction

**Aesthetic**: Neo-Brutalist Tech — aggressive, sharp, high-contrast. Electric blue on white with thick black frames. NOT bubbly, NOT soft. Hard edges, bold type, noise grain.

### Color Palette
```css
:root {
  --bg-primary: #f8f9f9;        /* near-white background */
  --bg-light: #ededef;           /* light gray sections */
  --accent-blue: #0c10f8;        /* PRIMARY — vivid electric blue */
  --accent-blue-dark: #191cda;   /* deep electric blue */
  --accent-purple: #5b45c1;      /* secondary — deep violet */
  --border-black: #000000;       /* thick black frames */
  --text-blue: #0c10f8;          /* text color */
  --text-dark: #030153;          /* near-black with blue undertone */
  --text-dim: #8d8ea6;           /* blue-gray secondary text */
}
```

### Typography
- Font: **"Space Grotesk"** (Google Fonts) — geometric, techy, aggressive
- Headings: bold/heavy, electric blue (#0c10f8), UPPERCASE with wide letter-spacing
- Body: dark near-black (#030153), clean
- ALL text is high-contrast blue on white — no soft grays for headings
- No glow effects on text — keep it crisp and sharp

### Layout Rules
- **Thick black borders** (3-4px solid black) on panels and cards
- **Sharp corners** — NO border-radius (or minimal 2px)
- **Generous whitespace** — spacious padding (3-4rem)
- **Multi-column grids** with clear black divider lines
- Noise texture overlay on white backgrounds (SVG filter, subtle)

### Effects
- Noise grain texture: SVG feTurbulence filter, opacity 0.03-0.05
- NO glassmorphism, NO blur, NO soft shadows
- Hover: sharp border color change to electric blue, slight scale
- Scroll-reveal: fade-in + slide-up (IntersectionObserver)
- Thick black horizontal dividers between sections

---

## HTML Structure

### Navigation
- Fixed top bar, white bg, thick black bottom border (3px)
- Logo: bold electric blue text
- Nav links: uppercase, letter-spaced, blue on white, underline on hover

### Section 1: Hero (#hero)
- Full viewport, centered
- Large name in electric blue (clamp 3rem-6rem)
- Handle @aruturu24 in dim gray
- Tagline in dark text
- Location badge with black border
- Two CTA buttons: solid blue fill + black border outline

### Section 2: Skills (#skills)
- Section title: uppercase, blue, thick black underline
- Grid of skill chips: white bg, thick black border, sharp corners, blue text
- Hover: bg becomes electric blue, text becomes white

### Section 3: Experience (#experience)
- Black-bordered card with blue accent left border (4px)
- Date badge: blue bg, white text, sharp corners
- Bullet points with blue square markers

### Section 4: Projects (#projects)
- Grid of cards: white bg, thick black border (3px), sharp corners
- Project name in electric blue
- Description in dark text
- Tags as small blue-bordered pills
- Hover: border turns blue, slight lift

### Section 5: Battle Arena (#battle)
- Black-bordered arena container
- Player vs Enemy layout with "VS" divider
- Status bars: sharp corners, black borders, blue/green fills
- Action buttons: blue bg, white text, black border, sharp corners
- Battle log: black border, light gray bg, monospace text

### Section 6: Contact (#contact)
- Grid of contact buttons: thick black border, sharp corners
- Blue text on white, hover fills blue with white text

### Footer
- Black top border, centered text, dim gray

---

## Battle Minigame
- Player: "Developer", 100 HP, 50 MP, Limit Break gauge
- Enemies: Bug, Glitch, Lag Spike — geometric SVG sprites
- Same mechanics as before (Fire/Blizzard/Thunder/Cure/LB)
- UI matches aggressive style: black borders, sharp bars, blue accents

---

## Implementation Order

### Phase 1: Foundation
1. Rewrite index.html with all 6 sections, real content, thick black borders
2. Rewrite style.css: variables, reset, typography, noise texture, layout
3. White background everywhere, electric blue accents

### Phase 2: Components
4. Style nav, hero, skill chips, experience card, project cards
5. Add noise texture SVG filter
6. Add scroll-reveal animations

### Phase 3: Battle System
7. Battle HTML with SVG sprites
8. Style battle UI (sharp, black-bordered, blue accents)
9. Write game.js with full battle logic

### Phase 4: Polish
10. Mobile responsive (320px+)
11. Verify: no dark bg, no rounded corners >2px, no soft shadows
12. Test battle game works

---

## Mobile Strategy
- Breakpoints: 900px (tablet), 600px (phone)
- Nav: horizontal scroll on mobile
- Grids: stack to single column
- Battle: vertical layout on mobile
- Touch targets: 44px minimum

## Success Criteria
- [ ] White bg (#f8f9f9) everywhere
- [ ] Electric blue (#0c10f8) primary accent
- [ ] Thick black borders (3-4px) on all panels/cards
- [ ] Sharp corners (0-2px border-radius max)
- [ ] Noise texture on backgrounds
- [ ] All 6 sections with real content
- [ ] Battle playable with SVG sprites
- [ ] Responsive 360px+
- [ ] 3 files only: index.html, style.css, game.js
