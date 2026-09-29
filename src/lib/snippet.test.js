import { buildSnippet } from "./snippet";
import { mergeEntries } from "./entries";

test("writes only the fields that are filled in", () => {
  const { code, uploads } = buildSnippet({ year: 2024, service: "spotify", id: "abc" });
  expect(code).toBe('  {\n    year: 2024,\n    service: "spotify",\n    id: "abc",\n  },');
  expect(uploads).toEqual([]);
});

test("names uploaded covers and lists them for saving", () => {
  const { code, uploads } = buildSnippet({
    year: 2023, service: "tidal", id: "u-1", title: "Songs I liked 2023", songs: "80", mood: "calm",
    genres: ["jazz"], newArtists: 35, monthly: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    anthem: { title: "Song", artist: "Band", service: "tidal", id: "42", bpm: 96 },
    moments: [{ song: 4, note: 'Our "trip"' }, { song: 0, note: "ignored" }],
    shared: [1, 4],
    albums: [{ title: "Blue Room!", artist: "X", cover: "data:image/jpeg;base64,AAA" }, { title: "Kept", artist: "Y", cover: "covers/2023/kept.jpg" }],
  });
  expect(code).toContain('title: "Songs I liked 2023",');
  expect(code).toContain("songs: 80,");
  expect(code).toContain("newArtists: 35,");
  expect(code).toContain('anthem: { title: "Song", artist: "Band", service: "tidal", id: "42", bpm: 96 },');
  expect(code).toContain('{ song: 4, note: "Our \\"trip\\"" },');
  expect(code).not.toContain("ignored");
  expect(code).toContain('cover: "covers/2023/01-blue-room.jpg"');
  expect(code).toContain('cover: "covers/2023/kept.jpg"');
  expect(uploads).toEqual([{ path: "covers/2023/01-blue-room.jpg", data: "data:image/jpeg;base64,AAA" }]);
});

test("drafts override years.js and add new years; years without a playlist stay hidden", () => {
  const base = [
    { year: 2025, service: "tidal", id: "" },
    { year: 2024, service: "spotify", id: "a", note: "old" },
  ];
  const merged = mergeEntries(base, { 2024: { note: "new" }, 2026: { service: "tidal", id: "t" } });
  expect(merged.map((e) => e.year)).toEqual([2026, 2024]);
  expect(merged[1].note).toBe("new");
});
