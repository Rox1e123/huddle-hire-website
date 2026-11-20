# Huddle Hire Website — Project Handover

Last reviewed: 20 November 2026. This document exists so a new Claude Code session (or a human developer) can pick up this project with no prior context. For a quick-reference summary, see the root `CLAUDE.md`; this file has the detail behind it.

## 1. What this project is

A static marketing website for **Huddle Hire**, a UK sales/commercial recruitment agency. It replaced an older site for "Romi Recruitment" — the company rebranded, and this site was built from scratch reusing Romi's copy (rewritten to the new name) and a new brand kit (maroon/copper/ivory palette, angular "H" logomark).

Live at **https://huddlehire.co.uk**.

There is no backend, no CMS, no database, and no build step. It's nine hand-written HTML files sharing one CSS file and one JS file.

## 2. Tech stack

- Plain HTML5 — one `.html` file per page, no templating engine. Shared header/nav/footer markup is **duplicated** in every file.
- One stylesheet: `css/style.css` (layout, components, animation), importing `css/tokens.css` (brand colour/font variables).
- One script: `js/main.js` — a single vanilla-JS IIFE, no framework, no bundler, no npm/`package.json` at all.
- Static assets in `assets/logo/` (brand kit: SVG logo lockups, favicons, app icons) and `assets/images/` (stock photography, see §6).
- `robots.txt`, `sitemap.xml`, `site.webmanifest` for basic SEO/PWA metadata.

No dependencies to install. There is nothing to `npm install` — if a future session finds itself reaching for Node tooling, that's a sign something has drifted from how this project works.

## 3. Site structure (page by page)

All pages share the same header (logo, nav: About / Services / Contact, "Get Started" button), mobile hamburger nav, and footer (contact details, legal links, "Get Started" button).

### `index.html` — Home
Hero (headline + animated H-mark graphic with scroll parallax) → intro/approach copy → 3-card services grid (Permanent Recruitment / Growth Hiring / Senior & Strategic Hires) → **image-overlay banner** (`home-team.jpg` with a maroon text panel overlaid on top, bottom-left) → mission statement (maroon, diagonal-cut section) → auto-scrolling keyword marquee → 3 testimonials → closing "We're here to help" CTA.

### `about.html` — About
Hero ("Built on instinct. Backed by experience" — deliberately no trailing period) → **image-banner** (`about-team.jpg`, full-width, wide-crop) → founding-story paragraphs → "Our Values" 4-card grid (Transparency / Momentum / Precision / Partnership) → "We're here to help" CTA → "Get in touch" maroon section (email/phone/address). **Note the order**: "We're here to help" intentionally sits *above* "Get in touch" — this was a specific client instruction after an earlier revision had it the other way round; don't swap it back without checking.

### `services.html` — Services
Hero → "Our Recruitment Services" 4-card grid → **split section** (`services-meeting.jpg` sitting side-by-side with "Built on real experience" text, vertically centred) → philosophy statement (maroon) → "How we work" 5-step process list (numbered 01–05, each with a large faint background numeral via `data-step` + CSS `::after`) → closing CTA.

### `contact.html` — Contact
Hero → two side-by-side panels (`.contact-panel`), **Employers** and **Candidates**. Each panel shows a teaser (heading, body, button) and a form hidden inside a `.contact-form-wrap` that expands in place when its button is clicked (see §5 for how). No image on this page (one was tried and removed per client request). Closing line: "Right Opportunity, Maximum Impact."

### Legal pages — `privacy-policy.html`, `cookie-policy.html`, `terms-of-use.html`, `terms-of-business.html`
All `<meta name="robots" content="noindex">` (not meant to be indexed). Same shell (hero + `.legal-body` content + footer).
- **Privacy Policy, Cookie Policy, Terms of Use**: fully drafted, ready for real use — standard UK GDPR / website-terms content. The pages previously ended with a `.tbc-box` "Before this goes live" note; these were removed since the site is already live (the client is actioning the underlying items, e.g. a solicitor review, in the background rather than blocking the page on them). The `.tbc-box` CSS rule in `style.css` is now unused as a result — harmless, same category as the existing dead `.path-card` CSS below.
- **Terms of Business**: full standard structure (what the agency does, introductions, confidentiality, liability, termination, governing law), but **deliberately does not publish fee percentages, minimum fees, payment terms, or rebate/replacement-guarantee periods** — the text says these are "agreed directly and in writing with each Client." This was an explicit client decision, not an oversight — don't add specific fee figures unless asked to.

There is **no `/get-started` page**. One existed early on but was removed — every "Get Started" link/button across the whole site points straight to `contact.html` instead.

## 4. Brand system

Defined entirely in `css/tokens.css` as CSS custom properties:

| Token | Hex | Use |
|---|---|---|
| `--hh-maroon` | `#6A1020` | Primary: logo, headings, primary buttons, dark sections |
| `--hh-maroon-deep` | `#4A0A16` | Hover/pressed states on maroon, footer background |
| `--hh-copper` | `#F2A541` | Accent — **maroon/dark backgrounds only** |
| `--hh-bronze` | `#A1600B` | Accent on light backgrounds (logo, eyebrows, links) |
| `--hh-ivory` | `#FBF5E9` | Main page background |
| `--hh-white` | `#FFFFFF` | Cards, form fields |
| `--hh-text` / `--hh-text-muted` | `#2B1D1F` / `#5C4A4C` | Body text on light |
| `--hh-text-on-dark` | `#FBF5E9` | Text on maroon |
| `--hh-line` | `#E6DCCB` | Borders/dividers |
| `--hh-radius` | `0px` | **Sharp corners everywhere** — matches the angular logomark |

**Hard rule**: copper (`#F2A541`) on ivory/white fails contrast (1.9:1) — it must never be used for text or buttons on light backgrounds. Bronze is the light-background equivalent.

Typeface: Montserrat (500/600/700), loaded via Google Fonts `@import` in `tokens.css`.

Logo: an angular "H" built from two leaning halves, reproduced as inline SVG polygons directly in the HTML (not an `<img>`) so it stays crisp and recolourable — see the `<svg>` block repeated in every page's header/footer. Full lockup files (horizontal/stacked, on-light/on-dark, favicons, app icons) live in `assets/logo/`.

Other house rules baked into the existing content (apply to any new copy):
- **No em dashes (—)** anywhere — rewritten as commas, colons, or periods. This was an explicit client request; don't reintroduce them.
- UK English spelling.
- No fabricated stats, named team members, or client logos.

## 5. Key functionality

### Contact forms (Netlify Forms, submits directly to hello@huddlehire.co.uk)
Both forms in `contact.html` (`employer-enquiry`, `candidate-enquiry`) are plain `data-netlify="true"` forms with a hidden `form-name` field, detected automatically by Netlify at deploy time — no backend code in this repo. On submit, JS in `js/main.js` (search for "Form handling") validates required fields client-side, then `fetch()`s a `FormData` POST to `/` so the browser never navigates away. On success it shows the `#form-success-modal` confirmation popup ("Message sent... we'll be in touch") and resets the form; on failure it shows an inline error asking the visitor to email hello@huddlehire.co.uk directly.

This replaced an earlier `mailto:`-based approach (which opened the visitor's own email app instead of sending anything) per explicit client request — enquiries, including the candidate's CV file, now go straight to Netlify's form-processing pipeline. **One-time Netlify dashboard setup is required for the client's team**: in Site settings → Forms → Form notifications, add an email notification pointing at `hello@huddlehire.co.uk` for both the `employer-enquiry` and `candidate-enquiry` forms (Netlify doesn't know to route submissions there until that's configured — it otherwise just notifies the Netlify account owner). Netlify also retains uploaded file attachments (like candidate CVs) for a limited time by default — check current Netlify Forms file-retention terms if that becomes a concern.

**Two gotchas hit when this first shipped, both fixed, worth knowing about:**
1. **"Form detection" is a separate site-wide toggle** (Site settings → Forms → "Enable form detection"), off by default on a new site. Until it's switched on, Netlify serves a plain 404 for any POST, even though the HTML forms are perfectly correct — there's no error message pointing at this, you just get a 404. It was enabled for this site on 20 Nov 2026, and a redeploy was triggered immediately after, since enabling it doesn't retroactively rescan already-published deploys.
2. **Netlify strips the `data-netlify="true"` attribute from the served HTML once it has registered a form.** The AJAX submit handler in `js/main.js` originally selected forms via `form[data-netlify]`, which worked locally (nothing strips it there) but matched zero forms in production, so the listener never attached and the browser fell through to a native full-page POST (which still reached Netlify Forms, just with a jarring redirect to `/` instead of the in-page success popup). Fixed by adding a separate `data-ajax-form` attribute to both forms, which Netlify leaves alone, and selecting on that instead. If a new form is ever added to this site, give it `data-ajax-form` too, not just `data-netlify`.

### Contact page accordion
Each `.contact-panel` contains a `.contact-toggle` button and a `.contact-form-wrap` (initially collapsed via `grid-template-rows: 0fr`, CSS-animated to `1fr` on open — see `js/main.js` "Contact page" section). Clicking the button toggles `.is-open` and `aria-expanded`, then scrolls the panel into view and focuses the first field. `contact.html#employers` / `#candidates` in the URL auto-opens the matching panel on page load — this is how every "Discuss Your Hiring Needs" / "Join Our Talent Network" link sitewide works.

### Animation & interaction (all in `js/main.js`, all respect `prefers-reduced-motion`)
- Sticky header that compacts on scroll (`.is-scrolled`)
- Mobile hamburger nav (slide-in panel)
- Scroll-reveal: elements with class `.reveal` fade/slide in via `IntersectionObserver`, becoming `.is-visible`
- Hero graphic parallax: the animated H-mark SVG in each hero shifts with scroll position via a CSS custom property (`--parallax`) updated on scroll
- Card/testimonial "tilt": on pointer devices only (`hover: hover` + `pointer: fine` media query), `.card` and `.testimonial` elements tilt toward the cursor via inline `transform` on `mousemove`
- "Magnetic" buttons: `.btn` elements nudge slightly toward the cursor on hover, same pointer-device gate
- Keyword marquee: CSS `@keyframes` infinite scroll, pauses on hover, disabled (falls back to a plain scrollable row) under reduced motion

### Images
Four photos in `assets/images/`, sourced from **Unsplash** (Unsplash License — free commercial use, no attribution required): `home-team.jpg`, `about-team.jpg`, `services-meeting.jpg`, and `contact-handshake.jpg` (downloaded but **no longer used** anywhere — the Contact page image was removed; the file is just left in the folder). These are generic stock photography, not real Huddle Hire staff or premises — copy never implies otherwise. Three CSS components handle image framing, all with decorative bronze/copper corner brackets:
- `.split-image` — image beside text, 4:3 default crop
- `.image-banner` — full-width banner, 21:9 crop (used on About)
- `.image-overlay` — full-width banner with a solid maroon text panel overlaid on top (used on Home)

**Important CSS gotcha already fixed once**: an `<img>` with both `width`/`height` HTML attributes *and* a CSS `aspect-ratio` needs `height: auto` in CSS, or the HTML `height` attribute wins and the image renders at its full natural pixel height, silently ignoring the intended crop. All three image components above already have this fix applied — if a new image component is added, remember `height: auto` alongside `aspect-ratio`.

## 6. Deployment pipeline

### GitHub
- Repo: **https://github.com/Rox1e123/huddle-hire-website**
- Single branch in use: **`main`**
- Push access from this machine is via a **dedicated SSH deploy key** (not the account's main SSH key, which belongs to a different, unrelated project):
  - Key pair: `~/.ssh/id_ed25519_huddlehire` (private) / `~/.ssh/id_ed25519_huddlehire.pub` (public)
  - SSH config alias in `~/.ssh/config`: `Host github-huddlehire` → uses that key
  - This repo's git remote is set to `git@github-huddlehire:Rox1e123/huddle-hire-website.git` (note the custom host alias, not plain `github.com`)
  - The public key is registered as a **repo-scoped Deploy Key** (with write access) under this repo's GitHub Settings → Deploy keys — it cannot access any other repository
- `.gitignore` excludes `.DS_Store` and `.claude/` (local dev-server config, not needed elsewhere)

### Netlify
- Netlify project name: **huddlehire** (team: `hello-8r6aovo`)
- **Connected to the GitHub repo above, branch `main` → auto-deploys on every push.** This is the production deploy mechanism; there is no separate staging environment.
- Build settings: **no build command**, publish directory **`.`** (repo root — the HTML files live at the top level), no functions directory. Netlify literally just serves the files as-is.
- `netlify.toml` 404-redirects `/CLAUDE.md`, `/README.md`, and `/docs/*` — since the publish directory is the whole repo, those would otherwise be publicly browsable on the live domain. If you add more internal-only files at the repo root, add a matching rule.
- Netlify subdomain: `huddlehire.netlify.app` (always works, useful for sanity-checking a deploy independent of DNS)
- Custom domain: `huddlehire.co.uk` (primary), `www.huddlehire.co.uk` (redirects to primary)

### DNS (GoDaddy) and email — handle with care
The domain is registered at **GoDaddy**, and nameservers were deliberately **left on GoDaddy** (not migrated to Netlify DNS), because the business's email already runs through this domain:
- Email: `hello@huddlehire.co.uk`, live via **Microsoft 365 / Outlook** — MX record `huddlehire-co-uk.mail.protection.outlook.com`, plus associated `autodiscover`, `email`, `lyncdiscover`, `msoid`, `selector1/2._domainkey` (DKIM), `sip`/SRV records, and SPF/DMARC TXT records. **None of these should ever be touched** when working on the website's DNS.
- Website DNS records (the only two that matter for the site):
  - `A` record, name `@`, value `75.2.60.5` (Netlify's load balancer IP — GoDaddy doesn't support ALIAS/ANAME records, so this is the documented fallback method rather than the "recommended" ALIAS option)
  - `CNAME` record, name `www`, value `huddlehire.netlify.app`
- There used to be a **domain forwarding rule** at GoDaddy (`huddlehire.co.uk` → `http://huddle-hire.co.uk`, a different, hyphenated domain the client also owns) which locked the `A` record from being edited. It was removed to free up the record. The hyphenated `huddle-hire.co.uk` domain is unrelated to this project and was not otherwise touched.
- DNS propagation can lag locally even after it's genuinely live — if a live check seems to fail, verify against multiple resolvers (e.g. `dig @8.8.8.8`, `dig @1.1.1.1`) and the `huddlehire.netlify.app` subdomain directly before assuming something's broken; a stale local DNS cache on one machine is a common false alarm.

## 7. How to run, test, and deploy

### Run locally
From the project root:
```bash
python3 -m http.server 4321
```
Then open `http://localhost:4321`. No install step — it's static files. (A Claude Code dev-server shortcut is pre-configured in `.claude/launch.json` under the name `huddle-hire-site`, same command.)

### Test
There is no automated test suite (no JS unit tests, no CSS regression tests) — this is a small static site and was verified throughout development by manual browser testing (desktop + mobile viewport, keyboard nav, `prefers-reduced-motion`, actual clicking through forms). Any future change should be checked the same way: load the affected page(s) locally, check the console for errors, and click through the actual interaction you changed.

### Deploy — recommended workflow
**Do not push directly to `main` for anything beyond a trivial, already-verified fix.** Because `main` auto-deploys straight to the live site with no approval gate, the safe pattern is:
1. Create a feature branch: `git checkout -b fix/short-description`
2. Commit and push that branch: `git push -u origin fix/short-description`
3. Open a pull request on GitHub — Netlify automatically builds a **Deploy Preview** for it (check the Netlify-posted PR comment / the PR's checks for the preview URL)
4. Open the preview URL and verify the change actually works (don't just read the diff)
5. Merge the PR into `main` only once it's confirmed on the preview — merging is what triggers the real production deploy

If working interactively with a user who wants to see a change quickly, it's fine to iterate locally first (`python3 -m http.server`) before even opening a PR.

## 8. Known issues / outstanding items

These are tracked `[TO CONFIRM]` / placeholder items visible directly on the live site (search for "placeholder" or "to confirm" in the HTML to find them):

1. **Phone number and address are placeholders**, not real: `020 7946 0958` (an Ofcom-reserved fictional number, used deliberately so it's obviously not a real line) and `1 Example Street, London EC1A 1AA` (deliberately generic). Both are marked "(placeholder)" in small type in the footer and About page. Replace with real details whenever the client provides them — search all 8 HTML files for both strings, they're duplicated on every page's footer.
2. **Registered company name and company number** are still bracketed placeholders (`[registered company name, to confirm]`, `Company No. [to confirm]`) in every footer and on the legal pages.
3. **Terms of Business has no published fee terms** — by design, see §3. If the client ever wants figures published, that's a deliberate policy change, not a bug fix — confirm before adding numbers.
4. **No Open Graph share image** — `og:image` meta tags were never added. The brand brief calls for a stacked logo on a maroon background as a social-share card; needs a designer/image tool to produce the actual PNG (the logo SVGs in `assets/logo/` are the starting point).
5. **Dead CSS**: `css/style.css`'s final section, `/* ===== Two-path (get started) ===== */` (`.path-card` rules), belongs to the old `/get-started` page that no longer exists. Harmless (unused, matches no current HTML) but could be deleted in a future cleanup pass.
6. **`sitemap.xml` lists the `noindex` legal pages** alongside the real pages. Harmless, but a stricter sitemap would exclude pages marked `noindex`.
7. **Testimonials on the homepage** were carried over verbatim from the old Romi Recruitment site copy. The client explicitly confirmed keeping them — but if Huddle Hire's actual client base changes or the client raises doubts about them later, they're the one piece of copy still worth double-checking for authenticity.

## 9. Ground rules for future sessions

- **Preserve the existing design and functionality by default.** This site went through careful, deliberate rounds of design/copy decisions (see "known issues" above for several of them) — don't redesign sections, change the colour system, swap the form-submission approach, or restructure pages unless the user explicitly asks for that specific change.
- When editing shared markup (header, nav, footer) remember it's **duplicated across all 8 HTML files** — grep for the string you're changing across `*.html` and update every occurrence, or the pages will drift out of sync.
- Keep it dependency-free. Don't introduce a build step, a framework, or npm packages to solve a problem that can be solved with the existing plain HTML/CSS/JS — that was a deliberate choice for a small static site with a simple, zero-maintenance deploy story.
- Follow the branding non-negotiables in §4 (copper-on-light is a hard no, sharp corners, no em dashes) for any new copy or components.
- Test locally and (ideally) via a PR Deploy Preview before merging to `main` — see §7.
