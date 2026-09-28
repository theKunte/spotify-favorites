import { parseShareLink, openUrl } from "./links";

test("reads Tidal share links", () => {
  expect(parseShareLink("https://tidal.com/browse/playlist/0f1e2d3c-aaaa-bbbb")).toEqual({
    service: "tidal", type: "playlist", id: "0f1e2d3c-aaaa-bbbb",
  });
  expect(parseShareLink("https://listen.tidal.com/track/12345?u")).toEqual({
    service: "tidal", type: "track", id: "12345",
  });
});

test("reads Spotify share links, ignoring tracking and language parts", () => {
  expect(parseShareLink("https://open.spotify.com/playlist/2PqZ6i0tCTtyCcX8JHpAds?si=abc")).toEqual({
    service: "spotify", type: "playlist", id: "2PqZ6i0tCTtyCcX8JHpAds",
  });
  expect(parseShareLink("https://open.spotify.com/intl-de/track/7ouMYWpwJ422jRcDASZB7P")).toEqual({
    service: "spotify", type: "track", id: "7ouMYWpwJ422jRcDASZB7P",
  });
});

test("rejects other links", () => {
  expect(parseShareLink("not a link")).toBeNull();
  expect(parseShareLink("https://example.com/playlist/1")).toBeNull();
  expect(parseShareLink("https://open.spotify.com/")).toBeNull();
});

test("links back to the service", () => {
  expect(openUrl({ service: "tidal", type: "track", id: "9" })).toBe("https://tidal.com/browse/track/9");
  expect(openUrl({ service: "spotify", id: "x" })).toBe("https://open.spotify.com/playlist/x");
});
