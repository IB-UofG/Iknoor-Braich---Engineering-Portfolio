# Iknoor Braich — engineering portfolio

A small multi-page static site. No build step, no dependencies.

```
site/
├── index.html               home / hero + section deck
├── projects.html            the three builds — each links to its own page
├── project-quadcopter.html      ┐
├── project-pendulum.html        │  per-project pages (Goal / Process / Outcome + gallery)
├── project-throttle-body.html   │
├── project-excavator.html       ┘  (stub — title + skills + image, write-up TBD)
├── about.html
├── contact.html
├── Iknoor-Braich-Resume.pdf
├── styles.css        shared design system + layout
├── main.js           shared: clock, nav, reveal, glitch, background canvas, phone reveal
├── DESIGN.md          the visual system — read before restyling
└── assets/           img/ (images) + media/ (video)
```

Every page shares the same header, footer and left index rail. The active page is
highlighted automatically from the URL (`main.js`), so the nav markup is identical on
every page — when you change a nav link, change it in all five files.

## Run it locally

Any static server:

```bash
npx serve site
```

```bash
python -m http.server 8000 --directory site
```

## Deploy

Upload the contents of `site/` to any static host — **GitHub Pages**, **Netlify**,
**Cloudflare Pages**, **Vercel**. No server code, no env vars. `index.html` is the entry.

## What you need to edit

Everything below is placeholder.

| What | Where |
|---|---|
| Name / tagline / location | `index.html` — `.hero__name` (+ its `data-text`), `.readout`; plus `<title>` in every page |
| Hero thesis + tags | `index.html` — `.hero__thesis`, `.hero__tags` |
| Section deck blurbs | `index.html` — `.deck` |
| Project name, brief, specs, skills | `projects.html` — each `<article class="proj">` |
| Per-project deep dive | `project-*.html` — `.case` sections (Goal / Process / Outcome) + `.case__gallery`. Keep the `<h1>` / skills matching `projects.html`. |
| Add a new project | copy a `project-*.html`, add an `<article class="proj">` + `View project` link on `projects.html`, and update nav numbering if needed |
| About text + skills | `about.html` — `.about__text` `<p>`, `.caps` |
| Contact email | `contact.html` `.contact__mail` **and** the `mailto:` in every page's `.mobile-nav` (currently `ibraich@uoguelph.ca`) |
| Contact links | `contact.html` `.contact__links` — LinkedIn + Résumé are live; the "Show phone" `<button data-phone>` reveals the number on click (main.js) |
| Footer line | `.foot` in every page |

### Résumé PDF

`Iknoor-Braich-Resume.pdf` lives in `site/` and the Résumé button links to it (`target="_blank"`). Replace that file to update the résumé — keep the filename or update the `href` in `contact.html`.

### Swapping images

Replace files in `assets/img/` keeping the same names, or edit the `src`/`alt` in
`projects.html` / `about.html`. Keep each project's `Image log +N` label in sync with the
number of `<figure>`s in its gallery.

## The moving background

`main.js` draws a full-page `<canvas class="fx">` behind everything: drifting glyph
fragments, chamfered wireframe shapes, and the occasional fast data streak. It is
time-based (framerate independent), pauses when the tab is hidden, and is replaced by a
sparse static frame when the visitor has **reduce motion** turned on. To dial it back,
change the alpha ranges and counts in `initFx()` (`mkGlyph`, `mkFrag`, `count`). To remove
it entirely, delete the `<canvas class="fx">` line from each page.

## Known trade-offs

- **Image weight (~25 MB).** Straight off a phone / screenshot folder. Before launch,
  resize the large photos to ~2000 px and convert to WebP/AVIF. All images are lazy-loaded
  and sized to prevent layout shift, so it works as-is — just heavier than it needs to be.
- **Galleries are not a lightbox.** The "Image log" button reveals a thumbnail grid inline.
- **Left index rail** shows at ≥1360 px; below that the top bar / hamburger is the nav.
