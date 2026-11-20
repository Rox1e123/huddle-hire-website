# CLAUDE.md

Quick-reference for working on this codebase. For full project history, every design decision, and the complete deployment pipeline, see **`docs/PROJECT_HANDOVER.md`** — read it before any non-trivial change.

## What this is

A static marketing website for **Huddle Hire**, a UK recruitment agency, live at **huddlehire.co.uk**. Plain HTML/CSS/JS — no framework, no build step, no `package.json`, no backend.

## Golden rule

**Preserve the existing design and functionality.** Don't redesign, restructure, or change behaviour unless the user explicitly asks for that specific change. This site reflects a series of deliberate client decisions (see the handover doc's "known issues" and design-decision notes) — treat existing choices as intentional, not as something to improve on your own initiative.

## Stack

- 8 standalone HTML files, no templating — shared header/nav/footer markup is **duplicated in every file**. When editing shared chrome, grep across `*.html` and update every occurrence.
- `css/style.css` (all styling, organised in `/* ===== Section ===== */` blocks) + `css/tokens.css` (brand colour/font CSS custom properties — don't hand-edit without checking against the brand kit).
- `js/main.js` — one vanilla-JS IIFE, each feature in its own commented block.
- No dependencies. Nothing to `npm install`.

## Branding (non-negotiable)

- Use only the CSS custom properties in `css/tokens.css` (`--hh-maroon`, `--hh-copper`, `--hh-bronze`, `--hh-ivory`, etc.) — never hardcode brand hex values.
- **Copper (`#F2A541`) is for maroon/dark backgrounds only.** On ivory/white, use bronze (`#A1600B`) — copper-on-light fails contrast (1.9:1).
- Sharp corners everywhere (`--hh-radius: 0px`). Don't introduce rounded corners.
- **No em dashes (—)** in any copy — use commas, colons, or periods instead.
- UK English spelling. No fabricated stats, named team members, or client logos.

## Coding conventions

- Vanilla HTML/CSS/JS only — keep it that way unless explicitly asked to change the stack.
- New CSS goes under the matching `/* ===== Section ===== */` block in `style.css`, not tacked on the end.
- New JS goes in its own commented block in `main.js`, following the existing pattern.
- Any new animation/interaction must respect `prefers-reduced-motion` (see existing patterns in both CSS and JS).
- If you add an `<img>` with both HTML `width`/`height` attributes and a CSS `aspect-ratio`, you need `height: auto` in CSS too, or the HTML attribute silently wins and the crop is ignored (bit us once already — see handover doc §5).

## Before pushing changes

1. Test locally: `python3 -m http.server 4321` from the project root, then check the actual change in a browser — console errors, the interaction itself, mobile viewport if relevant.
2. Work on a feature branch, not directly on `main`.
3. Push the branch and open a pull request — Netlify auto-builds a Deploy Preview for every PR. Verify the change on that preview URL.
4. Merge to `main` only after it's confirmed on the preview. **Merging to `main` deploys to the live site immediately, with no further approval step.**

## Where everything else lives

Full site structure (page by page), every interactive feature explained, the GitHub → Netlify → GoDaddy DNS → email deployment chain, and the current list of outstanding `[TO CONFIRM]` placeholder items (phone, address, company number, Terms of Business fees, etc.) are all in **`docs/PROJECT_HANDOVER.md`**.
