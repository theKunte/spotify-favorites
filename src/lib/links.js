// Turns a Tidal or Spotify share link into { service, type, id }.
// Returns null when the link isn't one we recognise.
//
//   https://tidal.com/browse/playlist/0f1e…    → tidal playlist
//   https://listen.tidal.com/track/12345       → tidal track
//   https://open.spotify.com/playlist/2PqZ…?si= → spotify playlist
//   https://open.spotify.com/intl-de/track/…    → spotify track
const TYPES = ["playlist", "album", "track"];

export function parseShareLink(link) {
  let url;
  try {
    url = new URL(String(link).trim());
  } catch {
    return null;
  }
  const parts = url.pathname.split("/").filter(Boolean);
  const host = url.hostname.replace(/^www\./, "");
  const service = host.endsWith("tidal.com")
    ? "tidal"
    : host === "open.spotify.com"
      ? "spotify"
      : null;
  if (!service) return null;
  const at = parts.findIndex((p) => TYPES.includes(p));
  if (at === -1 || !parts[at + 1]) return null;
  return { service, type: parts[at], id: parts[at + 1] };
}

// The page on Tidal or Spotify for a playlist, album or track
export function openUrl({ service, type = "playlist", id }) {
  return service === "tidal"
    ? `https://tidal.com/browse/${type}/${id}`
    : `https://open.spotify.com/${type}/${id}`;
}

export const SERVICE_NAMES = { tidal: "Tidal", spotify: "Spotify" };
