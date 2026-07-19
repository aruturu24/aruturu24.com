# aruturu24.com — Portfolio Website

## Project
Personal portfolio website. Currently static HTML+CSS with ASCII art header and CRT effect.
Goal: Transform into an FFXIV-inspired interactive portfolio with an RPG turn-based battle minigame.

## Tech Stack
- Static HTML/CSS/JS (no framework, no build tools)
- Must remain deployable to GitHub Pages
- All assets inline or CDN-hosted (no npm/node dependencies)

## Design Direction
- Final Fantasy XIV aesthetic: dark UI, gold accents, crystal motifs, job/class icons
- Particle effects, subtle animations, dramatic typography
- Sections: About, Skills (as "Job Class"), Work Experience (as "Quest Log"), Projects (as "Achievements"), Battle Arena (minigame), Contact
- RPG battle minigame: turn-based, FFXIV-style with HP/MP bars, action menus, limit breaks

## Ponytail Rules (MUST FOLLOW)
Lazy means efficient, not careless. The best code is the code never written.

The ladder — stop at the first rung that holds:
1. Does this need to exist at all? (YAGNI)
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature covers it? CSS over JS, HTML over canvas.
5. Already-installed dependency? Use it. Never add a new one.
6. Can it be one line? One line.
7. Only then: the minimum code that works.

Rules:
- No unrequested abstractions
- No boilerplate, no scaffolding "for later"
- Deletion over addition. Boring over clever.
- Fewest files possible. Shortest working diff wins.
- No frameworks. Vanilla JS, vanilla CSS.
- Keep it as simple as possible while still being impressive

## File Structure Target
```
index.html    — single page, all sections
style.css     — all styles
game.js       — battle minigame logic
```
Three files max. Everything else is CDN or inline.
