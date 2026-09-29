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
// Optional (fill in whenever you have them). The editor on the site, at
// .../#2024/edit, writes all of this for you.
//   type:       "playlist" (default) or "album"
//   title:      the playlist's name
//   note:       a sentence or two about the year, in his words
//   songs:      how many songs are on the playlist (one soundprint ring each)
//   mood:       "calm", "mellow", "upbeat" or "loud" (the soundprint's texture)
//   genres:     e.g. ["indie", "jazz"] (one soundprint lobe each)
//   newArtists: % of songs by artists new to him that year (drawn dotted)
//   monthly:    songs added each month, Jan to Dec, e.g. [8, 5, 9, 12, 7, 6, 10, 14, 9, 6, 8, 6]
//   anthem:     his #1 song, played from the print's center, e.g.
//               { title: "…", artist: "…", service: "tidal", id: "12345", bpm: 96 }
//   moments:    memories pinned to songs by playlist position, e.g.
//               [{ song: 12, note: "Our road trip to the coast" }]
//   shared:     playlist positions of songs you both love, e.g. [1, 4, 12]
//   albums:     his favorite albums in order, e.g.
//               [{ title: "…", artist: "…", cover: "covers/2024/01-album-name.jpg" }]
//               Cover images go in public/covers/<year>/ with the same file name.
const years = [
  { year: 2025, service: "tidal", id: "" },
  { year: 2024, service: "spotify", id: "2PqZ6i0tCTtyCcX8JHpAds", title: "Songs I liked 2024" },
  { year: 2023, service: "spotify", id: "1TZVeN4UXjp3YzeP2dv7Qg" },
  { year: 2022, service: "spotify", id: "4fawHenj9g4R7DKXTICKXZ" },
  { year: 2021, service: "spotify", id: "7kMFVHHgWx4LdntQtdgPtw" },
];

export default years;
