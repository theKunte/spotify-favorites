// One entry per year. To add or update a year, change its entry below.
// The "Add details" editor in the Soundprint mockup writes these for you.
//
// Required
//   year:    the year, e.g. 2025
//   service: "tidal" or "spotify"
//   id:      the ID from the playlist's share link
//            Tidal:   tidal.com/browse/playlist/<id>  (a long UUID)
//            Spotify: open.spotify.com/playlist/<id>
//            Leave it "" to hide the year until there's a playlist.
//
// Optional (fill in whenever you have them)
//   type:    "playlist" (default), "album" or "track"
//   note:    a sentence or two about the year, in his words
//   songs:   how many songs are on the playlist (one soundprint ring each)
//   mood:    "calm", "mellow", "upbeat" or "loud" (the soundprint's texture)
//   genres:  e.g. ["indie", "jazz"] (one soundprint lobe each)
//   albums:  his favorite albums in order, e.g.
//            [{ title: "…", artist: "…", cover: "covers/2024/01-album-name.jpg" }]
//            Cover images go in public/covers/<year>/ with the same file name.
const years = [
  { year: 2025, service: "tidal", id: "" },
  { year: 2024, service: "spotify", id: "2PqZ6i0tCTtyCcX8JHpAds" },
  { year: 2023, service: "spotify", id: "1TZVeN4UXjp3YzeP2dv7Qg" },
  { year: 2022, service: "spotify", id: "4fawHenj9g4R7DKXTICKXZ" },
  { year: 2021, service: "spotify", id: "7kMFVHHgWx4LdntQtdgPtw" },
];

export default years;
