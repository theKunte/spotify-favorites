// Combines years.js with any drafts typed into the editor (kept in this
// browser only) and gives each year its accent color.

const ACCENTS = { 2021: "#d9e36b", 2022: "#ff7a9a", 2023: "#5fd4b0", 2024: "#ffb454", 2025: "#c9a3ff", 2026: "#7fb2ff" };
const CYCLE = ["#ffb454", "#5fd4b0", "#ff7a9a", "#d9e36b", "#c9a3ff", "#7fb2ff"];

export const accentFor = (entry) =>
  entry.accent || ACCENTS[entry.year] || CYCLE[((entry.year % CYCLE.length) + CYCLE.length) % CYCLE.length];

// Years that have a playlist, newest first, with drafts applied on top
export function mergeEntries(base, drafts = {}) {
  const byYear = new Map(base.map((e) => [e.year, { ...e }]));
  for (const [year, draft] of Object.entries(drafts)) {
    const y = Number(year);
    byYear.set(y, { ...(byYear.get(y) || { year: y }), ...draft, year: y });
  }
  return [...byYear.values()]
    .filter((e) => e.id && e.service)
    .sort((a, b) => b.year - a.year);
}

// Where a cover image lives: an uploaded draft image, or a file in public/
export const coverSrc = (cover) =>
  !cover ? "" : /^(data:|blob:|https?:)/.test(cover) ? cover : `${import.meta.env.BASE_URL}${cover}`;
