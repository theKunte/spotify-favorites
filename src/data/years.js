// One entry per year. To add a year, copy an entry and change the fields.
//
//   service: "tidal" or "spotify"
//   type:    "playlist" (default), "album" or "track"
//   id:      the ID from the share link
//            Tidal:   tidal.com/browse/playlist/<id>  (a long UUID)
//            Spotify: open.spotify.com/playlist/<id>
//
// Years with an empty id are hidden until a playlist is added.
const years = [
  { year: 2025, service: "tidal", id: "" },
  { year: 2024, service: "spotify", id: "2PqZ6i0tCTtyCcX8JHpAds" },
  { year: 2023, service: "spotify", id: "1TZVeN4UXjp3YzeP2dv7Qg" },
  { year: 2022, service: "spotify", id: "4fawHenj9g4R7DKXTICKXZ" },
  { year: 2021, service: "spotify", id: "7kMFVHHgWx4LdntQtdgPtw" },
];

export default years;
