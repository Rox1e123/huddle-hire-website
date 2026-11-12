# Huddle Hire website

A static, animated marketing site for Huddle Hire (rebrand of Romi Recruitment). Plain HTML/CSS/JS — no build step, no dependencies to install.

## Run it locally

From this folder:

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321 in a browser.

## Deploy it

It's static files, so any static host works — drag-and-drop the whole folder onto Netlify, or run `vercel` / `netlify deploy` from this directory, or push it to GitHub Pages. No build command needed; the publish directory is this folder itself.

## What's here

- `index.html`, `about.html`, `services.html`, `contact.html` — the main pages
- `privacy-policy.html`, `cookie-policy.html`, `terms-of-use.html`, `terms-of-business.html` — drafted legal pages (see below)
- `css/tokens.css` — brand colour/font variables (copied from the brand kit, don't hand-edit without checking the kit)
- `css/style.css` — layout, components, animation
- `js/main.js` — header scroll state, mobile nav, scroll-reveal animation, form handling
- `assets/logo/` — logo, favicon and app icons from the brand kit
- `assets/images/` — stock photography (see "Photography" below)

Copy is taken from the live romirecruitment.co.uk site (Home, About, Services, Contact — fetched 12 Nov 2026) with "Romi"/"Romi Recruitment" swapped for "Huddle Hire". There's no separate `/get-started` page: every "Get Started" button and link across the site goes straight to Contact.

## How the contact forms work

Both forms (employer enquiry, candidate + CV) submit to **hello@huddlehire.co.uk** via a `mailto:` link: on submit, the visitor's own email app opens with the enquiry pre-filled and addressed to that inbox — nothing is uploaded to a server or any third party. The trade-off is that a CV file can't be attached automatically (browsers don't allow that for `mailto:`), so the candidate form tells the visitor to attach their CV in the email before sending it.

This is a deliberately zero-backend, zero-third-party approach, which sidesteps any GDPR question about where CV data is processed — it never leaves the candidate's own device until they hit send. If you'd rather candidates upload their CV directly on the site (smoother UX, no manual attach step), that needs a real form backend (e.g. Netlify Forms if you host there, or a service like Formspree) — happy to wire that up once you've picked one, since it would mean visitor data passing through that provider.

## Legal pages

Privacy Policy, Cookie Policy and Terms of Use are fully drafted and ready to review — standard UK GDPR / recruitment-site content, using `hello@huddlehire.co.uk` as the contact point and noting the site currently sets no tracking cookies (true as built).

**Terms of Business** doesn't publish fee percentages, rebate periods, or payment terms on the site — per your instruction, those are agreed directly and in writing with each Client instead. The page still sets out the full standard structure (introductions, confidentiality, liability, etc.). I'd still recommend a solicitor familiar with the Conduct of Employment Agencies and Employment Businesses Regulations 2003 reviews it before it goes live.

## Photography

Four images were sourced from Unsplash (`assets/images/`) under the Unsplash License, which permits free commercial use with no attribution required: `home-team.jpg` (homepage banner), `about-team.jpg` (About page banner), `services-meeting.jpg` (Services page, beside the text). `contact-handshake.jpg` was used on the Contact page but has since been removed from that page per your request — the file is still in the folder if you want to use it elsewhere. They're generic stock photography, not real Huddle Hire staff or premises, so no captions claim otherwise. Swap any of them out at will if real company photography becomes available later — same filenames, same aspect-ratio handling in `css/style.css` (`.split-image`, `.image-banner`, `.image-overlay`).

## Before this goes live — remaining [to confirm] items on the site

1. **Registered company name and company number** — still placeholder text in the footer and the legal pages.
2. **Real phone number and address** — currently the Ofcom-reserved fictional number `020 7946 0958` and a placeholder address (`1 Example Street, London EC1A 1AA`), both clearly marked "(placeholder)" so they're not mistaken for real details.
3. **Terms of Business fees** — to be agreed directly with each Client, not published here (see above).
4. **Open Graph share image** — not yet created. The brand brief calls for a stacked logo on a maroon background; this needs exporting as a PNG once someone with design tools makes one (the logo SVGs are all in `assets/logo/` as a starting point), then adding as `og:image` to each page.
5. **Real photography**, if you'd rather replace the stock images — see "Photography" above.
6. If you later want the candidate form to upload CVs directly instead of via email, see "How the contact forms work" above.

## Notes on what was built

- Interactive touches: sticky header that compacts on scroll, animated mobile menu, scroll-triggered reveal animations throughout, a hover-pausable scrolling keyword marquee, and hover states on cards/buttons — all disabled automatically for users with "reduce motion" turned on.
- Accessibility: semantic landmarks, skip-to-content link, visible focus states, labelled form fields, `aria-current` on nav links, and the layout holds up down to 360px wide.
- No fabricated stats, named team members, or client logos were added — only what's in the original copy. The stock photos are mood/atmosphere imagery, not depictions of real staff.
