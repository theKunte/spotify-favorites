// Writes a year's entry as code to paste into src/data/years.js.

export const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "album";

export const coverPath = (year, album, index) =>
  `covers/${year}/${String(index + 1).padStart(2, "0")}-${slug(album.title)}.jpg`;

const str = (v) => JSON.stringify(v);
const isUpload = (cover) => /^(data:|blob:)/.test(cover || "");

// Returns { code, uploads } where uploads lists covers that still need to be
// saved into public/ (path + the image data typed into the editor).
export function buildSnippet(entry) {
  const L = ["  {", `    year: ${entry.year},`, `    service: ${str(entry.service)},`];
  if (entry.type && entry.type !== "playlist") L.push(`    type: ${str(entry.type)},`);
  L.push(`    id: ${str(entry.id)},`);
  if (entry.title) L.push(`    title: ${str(entry.title)},`);
  if (entry.note) L.push(`    note: ${str(entry.note)},`);
  if (Number(entry.songs) > 0) L.push(`    songs: ${Number(entry.songs)},`);
  if (entry.mood) L.push(`    mood: ${str(entry.mood)},`);
  if (entry.genres?.length) L.push(`    genres: [${entry.genres.map(str).join(", ")}],`);
  if (entry.newArtists !== undefined && entry.newArtists !== "" && entry.newArtists !== null)
    L.push(`    newArtists: ${Number(entry.newArtists)},`);
  if (entry.monthly?.some((v) => Number(v) > 0))
    L.push(`    monthly: [${entry.monthly.map((v) => Number(v) || 0).join(", ")}],`);
  if (entry.anthem?.id) {
    const a = entry.anthem;
    const parts = [`title: ${str(a.title || "")}`, `artist: ${str(a.artist || "")}`, `service: ${str(a.service)}`, `id: ${str(a.id)}`];
    if (Number(a.bpm) > 0) parts.push(`bpm: ${Number(a.bpm)}`);
    L.push(`    anthem: { ${parts.join(", ")} },`);
  }
  const moments = (entry.moments || []).filter((m) => m.note && Number(m.song) > 0);
  if (moments.length) {
    L.push("    moments: [");
    moments.forEach((m) => L.push(`      { song: ${Number(m.song)}, note: ${str(m.note)} },`));
    L.push("    ],");
  }
  if (entry.shared?.length) L.push(`    shared: [${entry.shared.map(Number).join(", ")}],`);
  const uploads = [];
  const albums = (entry.albums || []).filter((a) => a.title || a.cover);
  if (albums.length) {
    L.push("    albums: [");
    albums.forEach((a, k) => {
      let cover = a.cover;
      if (isUpload(cover)) {
        cover = coverPath(entry.year, a, k);
        uploads.push({ path: cover, data: a.cover });
      }
      L.push(`      { title: ${str(a.title || "")}, artist: ${str(a.artist || "")}${cover ? `, cover: ${str(cover)}` : ""} },`);
    });
    L.push("    ],");
  }
  L.push("  },");
  return { code: L.join("\n"), uploads };
}
