// PNG exports: one year's avatar, and a printable poster of every year.
import { drawYear, drawLayers, lifetimeLayers } from "./soundprint";

const INK = "#141217";
const PAPER = "#f1eef5";
const MUTED = "#a39dae";
const DISPLAY = '"Big Shoulders Display", "Arial Narrow", Impact, sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';

function makeCanvas(w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

async function fontsReady() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load(`900 100px ${DISPLAY}`),
    document.fonts.load(`500 40px ${MONO}`),
  ]).catch(() => {});
}

export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, "image/png");
}

// Square avatar: the year's print on a dark background, year in the corner
export async function renderAvatar(model, { accent, size = 1600 }) {
  await fontsReady();
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext("2d");
  drawYear(ctx, size, model, { background: INK });
  ctx.fillStyle = accent;
  ctx.font = `900 ${size * 0.075}px ${DISPLAY}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(String(model.year), size * 0.045, size * 0.955);
  ctx.fillStyle = MUTED;
  ctx.font = `500 ${size * 0.02}px ${MONO}`;
  ctx.textAlign = "right";
  ctx.fillText("SOUNDPRINT", size * 0.955, size * 0.95);
  return canvas;
}

// 12×18 inch poster at 300 dpi: the lifetime print on top, every year below
export async function renderPoster(items) {
  await fontsReady();
  const W = 3600;
  const H = 5400;
  const margin = 240;
  const canvas = makeCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  const years = items.map((it) => it.model.year).sort();
  ctx.fillStyle = PAPER;
  ctx.font = `900 380px ${DISPLAY}`;
  ctx.fillText("SOUNDPRINT", margin, margin + 300);
  ctx.fillStyle = MUTED;
  ctx.font = `500 64px ${MONO}`;
  ctx.fillText(`${years[0]}–${years[years.length - 1]} · ONE RING PER SONG`, margin + 8, margin + 420);

  // lifetime print
  const lifeSize = 1700;
  const life = makeCanvas(lifeSize, lifeSize);
  drawLayers(life.getContext("2d"), lifeSize, lifetimeLayers(items.map((it) => it.model)));
  ctx.drawImage(life, (W - lifeSize) / 2, 760);

  // one print per year, newest first
  const sorted = [...items].sort((a, b) => b.model.year - a.model.year);
  const cols = sorted.length <= 4 ? 2 : 3;
  const rows = Math.ceil(sorted.length / cols);
  const gap = 120;
  const top = 2600;
  const bottom = H - 300;
  const cellW = (W - margin * 2 - gap * (cols - 1)) / cols;
  const cellH = (bottom - top - gap * (rows - 1)) / rows;
  const label = Math.min(180, cellH * 0.16);
  const printSize = Math.min(cellW, cellH - label);
  sorted.forEach((it, k) => {
    const x = margin + (k % cols) * (cellW + gap);
    const y = top + Math.floor(k / cols) * (cellH + gap);
    const c = makeCanvas(Math.round(printSize), Math.round(printSize));
    drawYear(c.getContext("2d"), c.width, it.model);
    ctx.drawImage(c, x + (cellW - printSize) / 2, y);
    ctx.fillStyle = it.accent;
    ctx.font = `900 ${label * 0.9}px ${DISPLAY}`;
    ctx.textAlign = "center";
    ctx.fillText(String(it.model.year), x + cellW / 2, y + printSize + label * 0.85);
    ctx.textAlign = "left";
  });

  ctx.fillStyle = MUTED;
  ctx.font = `500 44px ${MONO}`;
  ctx.fillText(
    "RINGS = SONGS · COLORS = ALBUM COVERS · LOBES = GENRES · TEXTURE = MOOD · DOTTED = NEW ARTISTS",
    margin,
    H - 170
  );
  return canvas;
}
