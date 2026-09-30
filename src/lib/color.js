// Color helpers for turning album covers into a soundprint palette.

export const hexToRgb = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export const rgbCss = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

export const toHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h =
    max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
};

// The (up to) four most common vivid hues among the sampled pixels,
// most common first. Greys, near-blacks and near-whites are ignored.
export function paletteFrom(samples, max = 4) {
  const bins = new Map();
  for (const rgb of samples) {
    const [h, s, l] = toHsl(rgb);
    if (s < 0.25 || l < 0.2 || l > 0.88) continue;
    const key = Math.floor(h / 30);
    const bin = bins.get(key) || { n: 0, r: 0, g: 0, b: 0 };
    bin.n++;
    bin.r += rgb[0];
    bin.g += rgb[1];
    bin.b += rgb[2];
    bins.set(key, bin);
  }
  return [...bins.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, max)
    .map((bin) => [bin.r / bin.n, bin.g / bin.n, bin.b / bin.n].map(Math.round));
}

// Draws an image into a small square and reads a 10×10 grid of pixels.
// Returns [] when the browser can't read pixels (e.g. in tests).
export function sampleImage(img, size = 240) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
  ctx.drawImage(
    img,
    ((img.naturalWidth || img.width) - side) / 2,
    ((img.naturalHeight || img.height) - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size
  );
  const px = ctx.getImageData(0, 0, size, size).data;
  const step = size / 10;
  const samples = [];
  for (let y = step / 2; y < size; y += step) {
    for (let x = step / 2; x < size; x += step) {
      const o = (Math.floor(y) * size + Math.floor(x)) * 4;
      samples.push([px[o], px[o + 1], px[o + 2]]);
    }
  }
  return samples;
}

// Three colors for the background glow: the year's cover colors when there
// are enough, topped up with hues next to the year's accent color.
export function glowColors(palette, accent) {
  const fromCovers = palette.slice(0, 3).map(rgbCss);
  if (fromCovers.length >= 3) return fromCovers;
  const [h, s, l] = toHsl(hexToRgb(accent));
  const shift = ([dh, dl]) =>
    `hsl(${Math.round((h + dh + 360) % 360)} ${Math.round(s * 100)}% ${Math.round(Math.max(0, l * 100 + dl))}%)`;
  const fromAccent = [[0, 0], [38, -4], [-55, -8]].map(shift);
  return [...fromCovers, ...fromAccent.slice(fromCovers.length ? 1 : 0)].slice(0, 3);
}
