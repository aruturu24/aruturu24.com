# aruturu24.com — Portfolio Website

## Project
Personal portfolio website. FFXIV-inspired with Neo-Y2K aesthetic.
Must be visually stunning, mobile-first, and include an RPG battle minigame.

## Design Direction — UPDATED
- **Colors:** White (#fff), Blue (#4fc3f7, #0288d1, #1a73e8), Black (#0a0a0f, #111)
- **NO ASCII art, NO CRT scanlines, NO retro pixel style**
- **FFXIV + Neo-Y2K aesthetic:** clean geometric shapes, glassmorphism, gradient meshes, 
  subtle shimmer effects, holographic accents, sleek UI panels, crystal motifs
- Mobile-first responsive design — must look perfect on phones
- Smooth animations, parallax-like effects, intersection observer reveals
- Sections: Hero, Job Class (Skills), Quest Log (Work), Achievements (Projects), Battle Arena, Contact

## Updated Profile Info

**Arthur Gabryel (aruturu24)**
- Location: São Paulo, Brazil
- Bio: passionate developer. crazy about performance.
- Company: BGF Consultoria em Engenharia LTDA
- LinkedIn: linkedin.com/in/aruturu24
- GitHub: github.com/aruturu24
- Email: aruturu24@hotmail.com
- Twitter/X: x.com/aruturu24
- Instagram: instagram.com/aruturu24

### Work Experience
- **BGF Consultoria em Engenharia LTDA** — IT Intern (Jun 2023 – Jun 2025)
  - Developed web application for inspection results (Laravel, jQuery, DataTable, Bootstrap)
  - Built Android mobile app for inspection reports (Java, Android Studio)

### Skills/Tech Stack
Laravel, JavaScript, TypeScript, React Native, Java, PHP, Python, Rust, SQL, Git, HTML/CSS, Expo, Flask

### GitHub Projects (highlight these)
1. **burst** — Habit tracker app. Track habits and get notified when you miss a day. (TypeScript, React Native, Expo)
2. **shito** — Create and manage D&D 5e character sheets from the terminal. (Rust)
3. **tamashii** — Website to manage Call of Cthulhu 7th Edition character sheets. (HTML)
4. **news-translator** — Flask backend that auto-translates news articles. (Python, Flask)
5. **matrix** — Matrix rain effect recreation in JavaScript.
6. **calculator** — Simple calculator with HTML, CSS, and JavaScript.
7. **website-runinlinux** — Check if a game runs on Linux. (CSS, Web)

## Tech Stack
- Static HTML/CSS/JS (no framework, no build tools)
- Must remain deployable to GitHub Pages
- All assets inline or CDN-hosted (no npm/node dependencies)

## File Structure Target
```
index.html    — single page, all sections
style.css     — all styles
game.js       — battle minigame logic
```
Three files max. Everything else is CDN or inline.

## Ponytail Rules (MUST FOLLOW)
The ladder — stop at the first rung that holds:
1. Does this need to exist at all? (YAGNI)
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature covers it? CSS over JS.
5. Already-installed dependency? Use it. Never add a new one.
6. Can it be one line? One line.
7. Only then: the minimum code that works.

Rules: No frameworks. No boilerplate. Fewest files. Shortest working diff. Vanilla JS/CSS only.
