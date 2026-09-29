import { printModel, momentPoints, yearLayer, lifetimeLayers, centerPoint, ringPoint } from "./soundprint";
import { paletteFrom } from "./color";

const entry = { year: 2024, service: "spotify", id: "abc" };

test("a year with only a playlist draws as a draft", () => {
  const m = printModel(entry, { accent: "#ffb454" });
  expect(m.complete).toBe(false);
  expect(m.n).toBe(30);
  expect(m.palette).toEqual([[255, 180, 84]]);
});

test("a filled-in year is complete and keeps only valid details", () => {
  const m = printModel(
    { ...entry, songs: 50, mood: "loud", genres: ["rock", "jazz", "pop"], shared: [1, 99], moments: [{ song: 3, note: "trip" }, { song: 80, note: "x" }] },
    { palette: [[200, 40, 40]] }
  );
  expect(m.complete).toBe(true);
  expect(m.lobes).toBe(3);
  expect([...m.shared]).toEqual([1]);
  expect(m.moments).toEqual([{ song: 3, note: "trip" }]);
});

test("the same entry always gives the same shape", () => {
  const a = printModel({ ...entry, songs: 40 });
  const b = printModel({ ...entry, songs: 40 });
  expect(ringPoint(a, yearLayer(a), 10, 1)).toEqual(ringPoint(b, yearLayer(b), 10, 1));
});

test("moments and the center land inside the drawing", () => {
  const m = printModel({ ...entry, songs: 100, mood: "loud", monthly: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], moments: [{ song: 1, note: "a" }, { song: 100, note: "b" }] });
  for (const p of momentPoints(m, yearLayer(m))) {
    expect(p.x).toBeGreaterThan(0.02);
    expect(p.x).toBeLessThan(0.98);
    expect(p.y).toBeGreaterThan(0.02);
    expect(p.y).toBeLessThan(0.98);
  }
  const [cx, cy] = centerPoint(m, yearLayer(m));
  expect(Math.abs(cx - 0.5)).toBeLessThan(0.05);
  expect(Math.abs(cy - 0.5)).toBeLessThan(0.05);
});

test("the outermost ring stays clear of the month arcs and the edge", () => {
  for (const mood of ["calm", "loud"]) {
    for (const id of ["a", "b", "c", "d", "e"]) {
      const withMonths = printModel({ ...entry, id, mood, songs: 60, monthly: Array(12).fill(1) });
      const plain = printModel({ ...entry, id, mood, songs: 60 });
      for (let a = 0; a < 6.28; a += 0.1) {
        const [x, y] = ringPoint(withMonths, yearLayer(withMonths), 59, a);
        expect(Math.hypot(x - 0.5, y - 0.5)).toBeLessThan(0.455);
        const [px, py] = ringPoint(plain, yearLayer(plain), 59, a);
        expect(Math.hypot(px - 0.5, py - 0.5)).toBeLessThan(0.5);
      }
    }
  }
});

test("lifetime bands go oldest in the middle", () => {
  const layers = lifetimeLayers([2024, 2021, 2022].map((year) => printModel({ ...entry, year })));
  expect(layers.map((l) => l.model.year)).toEqual([2021, 2022, 2024]);
  expect(layers[0].r1).toBeLessThan(layers[1].r0);
});

test("palette picks the most common vivid colors and skips greys", () => {
  const red = [220, 40, 40], blue = [40, 60, 200], grey = [128, 128, 128];
  expect(paletteFrom([red, red, red, blue, grey, grey, grey, grey])).toEqual([red, blue]);
});
