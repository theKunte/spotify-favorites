import { embedUrl } from "./embedUrl";

test("builds Tidal embed URLs", () => {
  expect(embedUrl({ service: "tidal", id: "abc-123" })).toBe(
    "https://embed.tidal.com/playlists/abc-123"
  );
  expect(embedUrl({ service: "tidal", type: "album", id: "42" })).toBe(
    "https://embed.tidal.com/albums/42"
  );
});

test("builds Spotify embed URLs", () => {
  expect(embedUrl({ service: "spotify", id: "xyz" })).toBe(
    "https://open.spotify.com/embed/playlist/xyz"
  );
});

test("rejects unknown services", () => {
  expect(() => embedUrl({ service: "napster", id: "1" })).toThrow(
    "Unknown music service"
  );
});
