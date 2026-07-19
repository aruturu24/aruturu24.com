# aruturu24.com — Portfolio Website

## STYLE: Acid Graphic × Neo-Y2K × Cyber-Eclectic

This is NOT minimal. NOT clean. NOT corporate. This is CHAOTIC, ABSTRACT, VISUALLY INTENSE.
The feeling should be: an acid trip through a Y2K computer interface — organic blobs meeting
digital chrome, distorted type, fragmented layouts, psychedelic color clashes.

### AESTHETIC PILLARS

**1. Acid Graphic Design**
- Psychedelic visuals, distorted typography, futuristic textures
- Overlapping and fragmented geometric patterns creating dynamic disorder
- Chromatic aberration on text (RGB split effect via CSS text-shadow)
- Warped, melting, liquid forms — organic shapes that feel alive
- Clashing vibrant colors that feel "wrong" on purpose

**2. Neo-Y2K Futurism**
- Chrome/metallic text effects (liquid metal gradients)
- Iridescent, holographic surfaces
- Bubblegum gradients (pink → cyan → purple)
- Star/sparkle ✦ decorations scattered chaotically
- Tech-optimistic, maximalist energy
- Glossy, reflective surfaces

**3. Cyber-Eclectic**
- Mixed media feel — combining organic and digital
- Abstract blob shapes alongside sharp digital elements
- Film grain / noise texture overlay on everything
- Non-traditional layouts — asymmetric, overlapping, chaotic

### COLOR PALETTE (from image + acid/Y2K fusion)
```css
:root {
  /* Background */
  --bg: #ffffff;              /* pure white */
  --bg-wash: #f0f8ff;         /* faint blue wash */
  
  /* Primary Accent — Acid Cyan (from image's main blob) */
  --cyan: #44d2fa;            /* vivid acid cyan */
  --cyan-light: #c8f0f0;      /* soft cyan */
  --cyan-glow: rgba(68, 210, 250, 0.4);
  
  /* Secondary — Lavender/Purple (from image accents) */
  --purple: #dcafe8;           /* soft lavender */
  --purple-deep: #9b59b6;      /* deeper purple */
  
  /* Acid Accents — neon clashes */
  --acid-pink: #ff2d9b;        /* hot pink */
  --acid-lime: #b8ff3a;        /* neon lime green */
  --acid-yellow: #fff740;      /* electric yellow */
  
  /* Chrome/Metallic */
  --chrome-light: #e8ecf1;
  --chrome-mid: #b8c4d4;
  --chrome-shine: #ffffff;
  
  /* Text — charcoal, not pure black */
  --text: #445157;             /* charcoal-teal */
  --text-dim: #8a9ba3;         /* muted teal-gray */
  
  /* Dark accents */
  --dark: #1a1a2e;             /* deep navy for contrast */
}
```

### TYPOGRAPHY
- **Primary font**: "Space Grotesk" (Google Fonts) — geometric, techy
- **Display font**: "Syne" (Google Fonts) — bold, expressive, acid-graphic energy
- Headings: distorted with CSS text-shadow chromatic aberration effect:
  ```css
  .acid-text {
    text-shadow: 
      -2px 0 var(--acid-pink),
      2px 0 var(--cyan),
      0 0 20px var(--cyan-glow);
  }
  ```
- Mix of UPPERCASE and lowercase chaotically
- Varying font sizes — some HUGE, some tiny, creating visual tension
- Letter-spacing varies wildly: from -0.05em (tight) to 0.5em (spaced)

### SHAPES & FORMS
- **Organic blobs**: Large amorphous shapes with CSS clip-path/border-radius
  ```css
  .blob {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    filter: blur(0px); /* sharp or soft depending on context */
    animation: morph 8s ease-in-out infinite;
  }
  @keyframes morph {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  ```
- **Sharp geometric fragments**: triangles, diamonds scattered alongside blobs
- **Chrome/metallic gradient text** for key headings
- **Film grain overlay**: SVG feTurbulence filter, very subtle

### LAYOUT PHILOSOPHY
- NOT a traditional grid. Sections overlap, bleed into each other
- Asymmetric positioning — elements offset, rotated slightly (-2deg to 3deg)
- Some elements break out of their containers
- Generous chaos: decorative shapes, sparkles, dots scattered everywhere
- BUT: content remains readable — chaos in decoration, clarity in content

### EFFECTS TO USE
1. **Chromatic aberration** on headings (CSS text-shadow RGB split)
2. **Organic blob backgrounds** that morph/animate
3. **Film grain** SVG filter overlay (opacity 0.03-0.05)
4. **Glitch hover effects** on cards (slight translate + color shift)
5. **Chrome gradient text** for hero name
6. **Acid color pops** — random neon accents (lime, pink, yellow) as dots/lines
7. **Rotated elements** — slight tilt on cards/sections (-1deg to 2deg)
8. **Star/sparkle scatter** — ✦ ✧ ★ positioned chaotically with twinkle animations
9. **Iridescent shimmer** on hover (gradient sweep animation)

### WHAT THIS IS NOT
- NOT Neo-Brutalist (no thick black borders, no sharp aggressive frames)
- NOT minimal/clean (no Apple aesthetic)
- NOT bubbly soft Y2K (no glossy buttons with 20px radius)
- NOT dark mode (white/light base with acid color chaos on top)

---

## Profile Data

**Arthur Gabryel (aruturu24)**
- Location: São Paulo, Brazil
- Bio: passionate developer. crazy about performance.
- LinkedIn: linkedin.com/in/aruturu24
- GitHub: github.com/aruturu24
- Email: aruturu24@hotmail.com
- X: x.com/aruturu24
- Instagram: instagram.com/aruturu24

### Work Experience
- **BGF Consultoria em Engenharia LTDA** — IT Intern (Jun 2023 – Jun 2025)
  - Developed web application for inspection results (Laravel, jQuery, DataTable, Bootstrap)
  - Built Android mobile app for inspection reports (Java, Android Studio)

### Skills
Laravel, JavaScript, TypeScript, React Native, Java, PHP, Python, Rust, SQL, Git, HTML/CSS, Expo, Flask

### GitHub Projects
1. **burst** — Habit tracker app (TypeScript, React Native, Expo)
2. **shito** — D&D 5e character sheets terminal app (Rust)
3. **tamashii** — Call of Cthulhu 7e character sheet website (HTML)
4. **news-translator** — Flask backend that auto-translates news (Python, Flask)
5. **matrix** — Matrix rain effect in JavaScript
6. **calculator** — Simple calculator (HTML, CSS, JS)
7. **website-runinlinux** — Check if a game runs on Linux (CSS)

### Battle Minigame
- Player: "Developer" class, 100 HP, 50 MP, Limit Break gauge
- Actions: Fire, Blizzard, Thunder, Cure, Limit Break
- 3 enemies (Bug, Glitch, Lag Spike), random, turn-based
- SVG sprites — can be more organic/blobby to match the acid aesthetic
- UI styled with acid colors, chromatic aberration on damage numbers

## Section Names
Hero, Skills, Experience, Projects, Battle Arena, Contact

## Tech Stack
- Any library/framework OK (GSAP for animations? Three.js for blobs? Tailwind?)
- Must be deployable to GitHub Pages
- Google Fonts CDN OK
- The goal is IMPACT — make it visually unforgettable
