const SONGS = [
  { id: 1,  title: "lost strawberry latte",   artist: "dostyo",  duration: 172, palette: "pink" },
  { id: 2,  title: "oh gregor!",              artist: "kafka",  duration: 205, palette: "butter" },
  { id: 3,  title: "big brother",      artist: "org wellgeo",       duration: 188, palette: "sky" },
  { id: 4,  title: "heights",           artist: "em etbro",   duration: 160, palette: "mint" },
  { id: 5,  title: "perfect questions",    artist: "divinity",  duration: 214, palette: "pink" },
  { id: 6,  title: "mr heathcliff",       artist: "emily",      duration: 179, palette: "sky" },
  { id: 7,  title: "the criminal",        artist: "fyodor",   duration: 196, palette: "butter" },
  { id: 8,  title: "white nights",    artist: "nastenka",       duration: 233, palette: "mint" },
  { id: 9,  title: "mosaic",          artist: "the bridged",      duration: 167, palette: "pink" },
  { id: 10, title: "ICE",    artist: "SM",  duration: 201, palette: "sky" },
];
 

const PALETTES = {
  pink:   ["#FFB3C6", "#FF7C97", "#4A3B5C", "#FFFFFF"],
  mint:   ["#B7EFC5", "#6FCB8E", "#4A3B5C", "#FFFFFF"],
  butter: ["#FFE8A3", "#F2C14E", "#4A3B5C", "#FFFFFF"],
  sky:    ["#B8E1FF", "#7CB9E8", "#4A3B5C", "#FFFFFF"],
};
 

function seededRandom(seed) {
// pseudo random generator 
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
 
function drawPixelCover(canvas, song) {
  const ctx = canvas.getContext("2d");
  const size = 8; // 8x8 grid
  canvas.width = size;
  canvas.height = size;
  ctx.imageSmoothingEnabled = false;
 
  const colors = PALETTES[song.palette];
  const rand = seededRandom(song.id * 97);
 
  // background
  ctx.fillStyle = colors[3];
  ctx.fillRect(0, 0, size, size);
 
  
  const half = size / 2;
  const grid = [];
  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < half; x++) {
      const r = rand();
      let color = "transparent";
      if (r > 0.75) color = colors[0];
      else if (r > 0.55) color = colors[1];
      else if (r > 0.45) color = colors[2];
      grid[y][x] = color;
    }
  }
 
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const mirroredX = x < half ? x : size - 1 - x;
      const color = grid[y][mirroredX];
      if (color !== "transparent") {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}
 

const state = {
  queue: SONGS,
  currentIndex: null,
  isPlaying: false,
  liked: new Set(),
  elapsed: 0,
  timer: null,
};
 

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
 
function renderGreeting() {
  const hour = new Date().getHours();
  const el = document.getElementById("greeting");
  if (hour < 12) el.textContent = "good morning ☀";
  else if (hour < 18) el.textContent = "good afternoon";
  else el.textContent = "good evening ✧";
}
 
function songCardTemplate(song, { compact = false } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = compact ? "quick-card" : "song-card";
  wrapper.dataset.id = song.id;

  const canvas = document.createElement("canvas");
  wrapper.appendChild(canvas);
 
  if (compact) {
    const span = document.createElement("span");
    span.textContent = song.title;
    wrapper.appendChild(span);
  } else {
    const playBtn = document.createElement("div");
    playBtn.className = "mini-play";
    playBtn.textContent = "▶";
    wrapper.appendChild(playBtn);
 
    const name = document.createElement("p");
    name.className = "song-name";
    name.textContent = song.title;
    wrapper.appendChild(name);
 
    const artist = document.createElement("p");
    artist.className = "song-artist";
    artist.textContent = song.artist;
    wrapper.appendChild(artist);
  }
 
  wrapper.addEventListener("click", () => playSong(song.id));
 
  // canvas must be in the DOM tree before/while we draw is fine either way
  requestAnimationFrame(() => drawPixelCover(canvas, song));
 
  return wrapper;
}
 
function renderHome() {
  const quickGrid = document.getElementById("quick-grid");
  const songGrid = document.getElementById("song-grid");
  quickGrid.innerHTML = "";
  songGrid.innerHTML = "";
 
  SONGS.slice(0, 4).forEach(song => quickGrid.appendChild(songCardTemplate(song, { compact: true })));
  SONGS.forEach(song => songGrid.appendChild(songCardTemplate(song)));
}
 
function renderLiked() {
  const likedGrid = document.getElementById("liked-grid");
  likedGrid.innerHTML = "";
  const likedSongs = SONGS.filter(s => state.liked.has(s.id));
 
  if (likedSongs.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "nothing here yet — tap the little heart on a song to save it.";
    empty.style.color = "var(--ink-soft)";
    likedGrid.appendChild(empty);
    return;
  }
  likedSongs.forEach(song => likedGrid.appendChild(songCardTemplate(song)));
}
 
function renderSidebarPlaylists() {
  const list = document.getElementById("playlist-list");
  const crates = ["static & fuzz", "rainy commute", "study jelly", "porchlight mix"];
  list.innerHTML = "";
  crates.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
}
 
function highlightPlayingCard() {
  // Keep the album grid visually simple: songs are visible without extra toggle styling.
}
 

function playSong(id) {
  const song = SONGS.find(s => s.id === id);
  if (!song) return;
 
  state.currentIndex = id;
  state.elapsed = 0;
  state.isPlaying = true;
 
  document.getElementById("now-title").textContent = song.title;
  document.getElementById("now-artist").textContent = song.artist;
  document.getElementById("time-total").textContent = formatTime(song.duration);
  drawPixelCover(document.getElementById("cover-canvas"), song);
  updateLikeButton();
  highlightPlayingCard();
 
  document.getElementById("play-btn").textContent = "⏸";
 
  clearInterval(state.timer);
  state.timer = setInterval(tick, 1000);
}
 
function tick() {
  const song = SONGS.find(s => s.id === state.currentIndex);
  if (!song) return;
 
  state.elapsed += 1;
  if (state.elapsed >= song.duration) {
    nextSong();
    return;
  }
  updateProgressUI(song);
}
 
function updateProgressUI(song) {
  const pct = (state.elapsed / song.duration) * 100;
  document.getElementById("progress-fill").style.width = `${pct}%`;
  document.getElementById("progress-knob").style.left = `${pct}%`;
  document.getElementById("time-current").textContent = formatTime(state.elapsed);
}
 
function togglePlay() {
  if (state.currentIndex === null) {
    playSong(SONGS[0].id);
    return;
  }
  state.isPlaying = !state.isPlaying;
  document.getElementById("play-btn").textContent = state.isPlaying ? "⏸" : "▶";
  if (state.isPlaying) {
    state.timer = setInterval(tick, 1000);
  } else {
    clearInterval(state.timer);
  }
}
 
function nextSong() {
  const idx = SONGS.findIndex(s => s.id === state.currentIndex);
  const next = SONGS[(idx + 1) % SONGS.length];
  playSong(next.id);
}
 
function prevSong() {
  const idx = SONGS.findIndex(s => s.id === state.currentIndex);
  const prev = SONGS[(idx - 1 + SONGS.length) % SONGS.length];
  playSong(prev.id);
}
 
function updateLikeButton() {
  const btn = document.getElementById("like-btn");
  const isLiked = state.liked.has(state.currentIndex);
  btn.textContent = isLiked ? "♥" : "♡";
  btn.classList.toggle("liked", isLiked);
}
 
function toggleLike() {
  if (state.currentIndex === null) return;
  if (state.liked.has(state.currentIndex)) {
    state.liked.delete(state.currentIndex);
  } else {
    state.liked.add(state.currentIndex);
  }
  updateLikeButton();
  renderLiked();
}
 

function switchView(viewName) {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach(section => section.classList.add("hidden"));
 
  if (viewName === "home") document.getElementById("view-home").classList.remove("hidden");
  if (viewName === "liked") {
    renderLiked();
    document.getElementById("view-liked").classList.remove("hidden");
  }
  if (viewName === "search") {
    // reuse the home view as the search results surface
    document.getElementById("view-home").classList.remove("hidden");
    document.getElementById("search-input").focus();
  }
}
 
function handleSearch(e) {
  const query = e.target.value.trim().toLowerCase();
  const songGrid = document.getElementById("song-grid");
  songGrid.innerHTML = "";
  const filtered = SONGS.filter(s =>
    s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query)
  );
  filtered.forEach(song => songGrid.appendChild(songCardTemplate(song)));
}
 

function bindEvents() {
  document.getElementById("play-btn").addEventListener("click", togglePlay);
  document.getElementById("next-btn").addEventListener("click", nextSong);
  document.getElementById("prev-btn").addEventListener("click", prevSong);
  document.getElementById("like-btn").addEventListener("click", toggleLike);
  document.getElementById("search-input").addEventListener("input", handleSearch);
 
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
 
  document.getElementById("volume-slider").addEventListener("input", (e) => {
    // hook point for real audio: audio.volume = e.target.value / 100
    console.log("volume set to", e.target.value);
  });
 
  document.getElementById("progress-track").addEventListener("click", (e) => {
    const song = SONGS.find(s => s.id === state.currentIndex);
    if (!song) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    state.elapsed = Math.floor(pct * song.duration);
    updateProgressUI(song);
  });
}
 

function init() {
  renderGreeting();
  renderSidebarPlaylists();
  renderHome();
  bindEvents();
}
 
document.addEventListener("DOMContentLoaded", init);
 
