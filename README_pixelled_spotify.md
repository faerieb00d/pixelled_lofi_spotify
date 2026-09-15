# 🎧 pixelbeat

**A pastel, pixel-art Spotify clone — built with plain HTML, CSS, and JavaScript. No frameworks, no build step, just vibes.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-B7EFC5?style=for-the-badge)
![No Framework](https://img.shields.io/badge/Framework-None%20needed-FFB3C6?style=for-the-badge)

> Every album cover you see is **generated on the fly** — an 8×8 pixel grid, mirrored for symmetry, seeded by song ID so the same track always gets the same little critter. No image files, no external art assets. Just math and pastel.

---

## ✨ Features

- 🎨 **Procedural pixel-art covers** — each song generates its own symmetric sprite from a deterministic seed (see [`How the pixel art works`](#-how-the-pixel-art-works))
- 🍬 **Pastel + pixel aesthetic** — hard-edged borders, offset drop shadows, a pixel display font, and a 4-color pastel palette (pink / mint / butter / sky)
- ▶️ **Full player bar** — play / pause / skip, a draggable progress scrubber, volume control, and a like button
- 💗 **Liked Songs view** — heart a track and it shows up in its own tab
- 🔍 **Live search** — filters the song grid as you type
- 📱 **Responsive layout** — sidebar collapses gracefully on narrow screens
- 🧩 **Zero dependencies** — no npm install, no bundler, just open the HTML file

---

## 🖼️ Preview

| Home view | Player bar |
|---|---|
| Sidebar nav + song grid with generated pixel covers | Progress scrubber, like button, skip controls |

*(Drop your own screenshot or screen recording here — a quick GIF of clicking a song and watching the pixel cover load into the player bar sells this project immediately.)*

---

## 🛠️ Tech stack

| Layer | What's used | Why |
|---|---|---|
| Structure | Semantic HTML5 | No framework needed for a project this size |
| Styling | Vanilla CSS3, custom properties | Full control over the pixel/pastel look, easy re-theming via `:root` variables |
| Behavior | Vanilla JavaScript (ES6+) | DOM rendering, playback state, and the pixel-art generator all live here |
| Art | `<canvas>` + a seeded PRNG (mulberry32) | Deterministic, reproducible "random" pixel sprites |

---

## 🚀 Getting started

No installation required.

```bash
git clone https://github.com/your-username/pixelbeat.git
cd pixelbeat
open index.html   # or just double-click it
```

That's it — it's a static site. No `npm install`, no dev server, no build step.

> **Want to serve it locally instead of opening the file directly?**
> ```bash
> python3 -m http.server 8000
> # then visit http://localhost:8000
> ```

---

## 📁 Project structure

```
pixelbeat/
├── index.html      # page structure — sidebar, song grid, player bar
├── style.css       # pastel palette, pixel borders/shadows, layout, responsiveness
├── script.js        # song data, pixel-art generator, playback state, event wiring
└── README.md
```

---

## 🎨 How the pixel art works

Each song's cover is drawn at true **8×8 pixel resolution** on a `<canvas>`, then scaled up with `image-rendering: pixelated` so the edges stay crisp instead of blurring.

1. **Seed the RNG with the song's ID** (mulberry32) — this makes the "random" pattern deterministic, so the same song always produces the same sprite, every time you load the page.
2. **Randomize only the left half** of the grid.
3. **Mirror it to the right half.** Bilateral symmetry is the single biggest trick for making random pixels read as an intentional little creature instead of noise.
4. **Weight the color thresholds** so background dominates (~45%), the main accent covers ~25%, a shaded variant ~20%, and a dark outline color ~10% — this ratio is what keeps the sprite readable instead of looking like confetti.

Want a song to always look a certain way? Just change its `palette` value in the `SONGS` array in `script.js` — four palettes are ready to go: `pink`, `mint`, `butter`, `sky`.

---

## 🎵 Adding real audio

Playback currently ships in **simulated mode** — no audio files are bundled, so the progress bar fills on a timer rather than playing real sound. To wire in actual songs:

1. Drop `.mp3` files into a `songs/` folder.
2. Add a `src` field to each song object in `SONGS` (in `script.js`).
3. Swap the simulated timer in `playSong()` for a real `Audio` element driven by `timeupdate`/`ended` events.

Full step-by-step code for this is commented directly in `script.js` under the **PLAYBACK** section.

> 🎼 Need royalty-free tracks? [Pixabay Music](https://pixabay.com/music/) (no attribution required) and [Incompetech](https://incompetech.com/music/royalty-free/) (chiptune-friendly, attribution required) are both good fits for this aesthetic.

---

## 🗺️ Roadmap

- [ ] Real audio playback (`<audio>` element wired to real files)
- [ ] Firebase Auth for login / signup
- [ ] Persist liked songs per-user (Firestore or localStorage)
- [ ] Drag-to-reorder queue
- [ ] Light/dark pastel theme toggle
- [ ] Shuffle + repeat modes

---

## 🤝 Contributing

This is a personal/portfolio project, but pull requests are welcome — especially for:
- New pixel-palette themes
- Accessibility improvements (keyboard nav, ARIA labels on the player controls)
- Bug fixes

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-idea`
3. Commit your changes: `git commit -m "add: your idea"`
4. Push and open a PR

---

## 📄 License

MIT — see [`LICENSE`](./LICENSE). Use it, remix it, make it your own.

---

## 🙋 Author

Built by **Mittali Singh** as a portfolio project exploring procedural pixel art and pastel UI design.

<sub>If this project made you smile even a little, consider starring the repo ⭐</sub>
