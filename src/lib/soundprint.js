// Soundprint: a fingerprint-like drawing made from one year's playlist.
//
//   rings      one per song; thicker toward the center (earlier on the playlist)
//   colors     the most common hues on that year's album covers
//   lobes      one per genre
//   texture    smooth to jagged, from the mood
//   dotted     songs by artists that were new to him that year
//   dots       moments pinned to a song
//   outer arcs songs added each month, January at 12 o'clock
//
// All geometry is in "unit" space: the canvas is 1×1 and the center is (0.5, 0.5).
// The same entry always draws the same print.
import { hexToRgb, rgbCss } from "./color";

const TAU = Math.PI * 2;

export const MOODS = {
  calm: { wobble: 0.45, jag: 0, label: "Smooth, slow curves" },
  mellow: { wobble: 0.75, jag: 0.15, label: "Gentle waves" },
  upbeat: { wobble: 1.05, jag: 0.45, label: "Lively ripples" },
  loud: { wobble: 1.35, jag: 1, label: "Jagged, buzzing edges" },
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Seeded random numbers, so a print never changes between visits
export const rng = (seed) => () =>
  ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);

export const hashStr = (s) =>
  [...String(s)].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

const DRAFT_SONGS = 30;

// Everything the drawing needs from one year's entry
export function printModel(entry, { palette = [], accent = "#ffb454" } = {}) {
  const songs = Math.max(0, Math.floor(Number(entry.songs) || 0));
  const n = songs || DRAFT_SONGS;
  const genres = (entry.genres || []).filter(Boolean);
  const mood = MOODS[entry.mood] ? entry.mood : "";
  const inRange = (k) => Number.isInteger(k) && k >= 1 && k <= n;
  const monthly =
    Array.isArray(entry.monthly) &&
    entry.monthly.length === 12 &&
    entry.monthly.some((v) => Number(v) > 0)
      ? entry.monthly.map((v) => Math.max(0, Number(v) || 0))
      : null;
  const newArtists =
    entry.newArtists === undefined || entry.newArtists === "" || entry.newArtists === null
      ? null
      : Math.min(100, Math.max(0, Number(entry.newArtists) || 0));
  return {
    year: entry.year,
    seed: (hashStr(`${entry.service}:${entry.id}`) ^ entry.year) >>> 0,
    songs,
    n,
    mood,
    genres,
    lobes: Math.max(2, genres.length || 2),
    palette: palette.length ? palette : [hexToRgb(accent)],
    fromCovers: palette.length > 0,
    newArtists,
    shared: new Set((entry.shared || []).map(Number).filter(inRange)),
    moments: (entry.moments || [])
      .map((m) => ({ song: Number(m.song), note: String(m.note || "") }))
      .filter((m) => inRange(m.song) && m.note),
    monthly,
    complete: Boolean(songs && mood && genres.length && palette.length),
  };
}

// Seeded shape details, computed once per model
const geometryCache = new WeakMap();
function geometry(m) {
  if (geometryCache.has(m)) return geometryCache.get(m);
  const r = rng(m.seed);
  const g = {
    ph: [r() * TAU, r() * TAU, r() * TAU, r() * TAU],
    cx: 0.5 + (r() - 0.5) * 0.04,
    cy: 0.5 + (r() - 0.5) * 0.04,
    drift: [(r() - 0.5) * 0.14, (r() - 0.5) * 0.14],
    rings: Array.from({ length: m.n }, () => {
      const gapAt = r() * TAU;
      const gapLen = r() < 0.55 ? 0.12 + r() * 0.25 : 0;
      return { gapAt, gapLen, dotted: false };
    }),
  };
  if (m.newArtists !== null) {
    const order = g.rings.map((_, i) => [r(), i]).sort((a, b) => a[0] - b[0]);
    const count = Math.round((m.n * m.newArtists) / 100);
    order.slice(0, count).forEach(([, i]) => (g.rings[i].dotted = true));
  }
  geometryCache.set(m, g);
  return g;
}

// One year on its own. Leaves room for the month arcs when there are any.
export const yearLayer = (m) => ({ model: m, r0: 0.025, r1: m.monthly ? 0.355 : 0.38, maxRings: 160 });

// Every year as a band of rings, oldest in the middle
export function lifetimeLayers(models) {
  const oldestFirst = [...models].sort((a, b) => a.year - b.year);
  const width = 0.36 / Math.max(1, oldestFirst.length);
  return oldestFirst.map((model, k) => ({
    model,
    r0: 0.02 + k * width,
    r1: 0.02 + k * width + width * 0.86,
    maxRings: 26,
  }));
}

export function ringPoint(m, layer, i, a) {
  const g = geometry(m);
  const mood = MOODS[m.mood] || MOODS.mellow;
  const t = (i + 1) / m.n;
  const base = layer.r0 + (layer.r1 - layer.r0) * t;
  const rad =
    base *
      (1 +
        0.07 * mood.wobble * Math.sin(m.lobes * a + g.ph[0] + t * 1.4) +
        0.035 * mood.wobble * Math.sin(2 * a + g.ph[1] - t * 2)) +
    mood.jag * 0.004 * Math.sin(19 * a + g.ph[2] + i * 0.7) +
    mood.jag * 0.0025 * Math.sin(37 * a + g.ph[3] - i * 0.4);
  return [
    g.cx + g.drift[0] * base + Math.cos(a) * rad,
    g.cy + g.drift[1] * base + Math.sin(a) * rad,
  ];
}

// Where the first song sits (the print's center)
export function centerPoint(m, layer) {
  const g = geometry(m);
  return [g.cx + g.drift[0] * layer.r0, g.cy + g.drift[1] * layer.r0];
}

// Positions (in unit space) of the moments pinned to songs
export function momentPoints(m, layer) {
  const g = geometry(m);
  return m.moments.map((moment) => {
    const ring = g.rings[moment.song - 1];
    let a = (hashStr(`${moment.song}:${moment.note}`) % 628) / 100;
    // keep the dot off the ring's break
    const d = Math.abs((((a - ring.gapAt) % TAU) + TAU + Math.PI) % TAU - Math.PI);
    if (d < ring.gapLen) a += Math.PI;
    const [x, y] = ringPoint(m, layer, moment.song - 1, a);
    return { ...moment, x, y };
  });
}

function strokeRing(ctx, m, layer, i, skipGap) {
  const ring = geometry(m).rings[i];
  ctx.beginPath();
  let pen = false;
  for (let a = 0; a <= TAU + 0.001; a += 0.02) {
    if (skipGap && ring.gapLen) {
      const d = Math.abs((((a - ring.gapAt) % TAU) + TAU + Math.PI) % TAU - Math.PI);
      if (d < ring.gapLen / 2) {
        pen = false;
        continue;
      }
    }
    const [x, y] = ringPoint(m, layer, i, a);
    if (pen) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
    pen = true;
  }
  ctx.stroke();
}

// Draws layers onto a square canvas of `size` pixels.
//   progress  0–1, for the draw-in animation
//   mono      a single CSS color (used for the small tab icons)
//   light     darken colors for light backgrounds
//   together  highlight songs you both love, fade the rest
//   fadeDraft fade a print that's missing details (editor preview)
export function drawLayers(ctx, size, layers, opts = {}) {
  const { progress = 1, mono = null, light = false, together = false, background = null, fadeDraft = false } = opts;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, size, size);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  }
  ctx.scale(size, size);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const layer of layers) {
    const m = layer.model;
    const g = geometry(m);
    // keep rings at least ~2.5px apart so small prints don't shimmer
    const fitRings = Math.max(4, Math.floor((size * (layer.r1 - layer.r0)) / 2.5));
    const step = Math.max(opts.ringStep || 1, Math.ceil(m.n / Math.min(layer.maxRings || 90, fitRings)));
    const upto = m.n * progress;
    const highlight = together && m.shared.size > 0;
    for (let i = 0; i < m.n && i < upto; i++) {
      // songs you both love are always drawn, even when rings are thinned out
      if (i % step && !(highlight && m.shared.has(i + 1))) continue;
      const t = (i + 1) / m.n;
      const shared = m.shared.has(i + 1);
      const col = m.palette[Math.min(m.palette.length - 1, Math.floor(t * m.palette.length))];
      const width = mono
        ? 1 / 34
        : (1 / 440) * (0.7 + 2.6 * (1 - t) ** 1.4) * Math.sqrt(Math.min(3, step)) * (highlight && shared ? 1.8 : 1);
      ctx.globalAlpha = highlight ? (shared ? 1 : 0.12) : fadeDraft && !m.complete && !mono ? 0.55 : 1;
      ctx.strokeStyle = mono || rgbCss(light ? col.map((c) => Math.round(c * 0.62)) : col);
      ctx.lineWidth = width;
      ctx.setLineDash(!mono && g.rings[i].dotted ? [0.0001, width * 2.4] : []);
      strokeRing(ctx, m, layer, i, !mono);
    }
  }
  ctx.restore();
}

// Songs added each month, as twelve arcs around the print
export function drawMonths(ctx, size, m, { light = false, progress = 1 } = {}) {
  if (!m.monthly) return;
  const max = Math.max(...m.monthly);
  const col = m.palette[0];
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(size, size);
  ctx.lineCap = "butt";
  ctx.setLineDash([]);
  ctx.strokeStyle = rgbCss(light ? col.map((c) => Math.round(c * 0.62)) : col);
  for (let k = 0; k < 12 && k < 12 * progress; k++) {
    const w = 0.004 + 0.022 * (m.monthly[k] / max);
    const a0 = -Math.PI / 2 + (k * TAU) / 12 + 0.035;
    ctx.globalAlpha = m.monthly[k] ? 0.9 : 0.25;
    ctx.lineWidth = m.monthly[k] ? w : 0.002;
    ctx.beginPath();
    ctx.arc(0.5, 0.5, 0.47, a0, a0 + TAU / 12 - 0.07);
    ctx.stroke();
  }
  ctx.restore();
}

// A single year's full print (rings + month arcs)
export function drawYear(ctx, size, m, opts = {}) {
  drawLayers(ctx, size, [yearLayer(m)], opts);
  if (!opts.mono) drawMonths(ctx, size, m, opts);
}
