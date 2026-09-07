# Design system — "Operator HUD"

The brief asked for a Cyberpunk 2077 feel. Rather than copy the game's yellow-on-black and
call it done, the site is built around one idea: **the page is a backlit operator console,
and every label is real telemetry** — frame sizes, motor counts, loop rates, PID gains,
bore diameters. Structure carries information; it isn't decoration.

Where the reference (a pixel/arcade portfolio) was pinned, this deliberately diverges: no
pixel type, no spaceship, its own mark, its own palette logic.

**Site shape:** four separate pages (home, projects, about, contact) plus per-project pages,
sharing one header, footer and left index rail — not a single scrolling page. Each fades in on load.

**Ambient motion:** a full-page canvas behind the content drifts faint glyph fragments,
chamfered wireframe shapes and occasional data streaks across the screen — the "console is
live" layer. Time-based, tab-aware, and reduced to a static frame under `prefers-reduced-motion`.

## Colour

| Token | Hex | Role — used only for this |
|---|---|---|
| `--void` | `#111520` | page ground (lifted off pure black → reads like a backlit screen; body adds a faint gunmetal gradient + top cyan glow) |
| `--carbon` / `--panel` / `--steel` | `#161b27` / `#1b212f` / `#242c3c` | panel fills, raised surfaces |
| `--line` | `#333c4f` | hairlines, grids, borders |
| `--haz` | `#f5e003` | **identity + everything interactive** — brand mark, buttons, kickers, active nav, focus |
| `--wire` | `#2fe6e6` | **data** — spec values, links, timeline dates, the clock |
| `--flux` | `#ff2d55` | **live / alert only** — the "open to work" dot, the contact page, the glitch channel |
| `--petrol` | `#123540` | reserved tint |
| `--bone` | `#eef0ea` | primary text, the name |
| `--ash` | `#a3a89c` | secondary / body-secondary text (>6:1 on void) |
| `--ash-dim` | `#8b9186` | mono micro-labels (>4.5:1 on void) |

Three accents, not one, each with a fixed job — so colour reads as a signal, not a wash.
The canvas artifacts stay in the same three ink colours at 0.05–0.28 alpha.

## Type

- **Chakra Petch** 600/700 — display + headings. Angular, technical, not a default choice.
- **Rajdhani** 400–600 — UI and body. Condensed humanist; pairs cleanly, stays readable.
- **Share Tech Mono** — telemetry: kickers, spec keys/values, captions, the clock, tags.

Scale ~1.25. Body 16 px / 1.6. Display `clamp(2.7rem, 10vw, 7.4rem)`. Measure ≤ ~46 ch on
body copy. Headings are near-normal case; ALL-CAPS is confined to the mono telemetry, where
it belongs.

## Structure & motion

- **Chamfer language:** panels and buttons get a single 12–26 px corner cut via `clip-path`
  (asymmetric — one or two corners, not four). Image frames add an L-bracket in `--haz`.
- **Numbering (01–04)** is used because the sections genuinely are an indexed set.
- **Foreground motion is minimal and purposeful:** the home hero boot stagger + one glitch
  pass on the name; per-page fade-in; scroll reveals fire once; the name glitches rarely and
  on hover. The only *continuous* motion is the low-contrast background canvas.
- **Background canvas** (`main.js` → `initFx`): ~14–30 drifting glyphs, 5 rotating chamfered
  wireframe fragments, and an occasional horizontal data streak. All rates are per-second so
  it's framerate independent; it pauses on tab-hide.
- `prefers-reduced-motion` disables the boot, glitch, page fade, bob and pulse, and freezes
  the canvas to one sparse static frame.

## Layout

Left-aligned, asymmetric. Sticky telemetry bar on top of every page; a vertical page-index
rail on the left at ≥1360 px (active item = current page). Content max-width 1180. On the
projects page the four builds alternate image side; #4 switches to a 2×2 image grid. Contact
is a single chamfered panel with a red edge.
