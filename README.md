# Soundprint

**Live site:** https://thekunte.github.io/spotify-favorites/

Soundprint is a year-by-year archive of my husband's favorite music. He wanted one place to look back at the songs and albums he loved each year, and to keep listening to them, no matter which streaming service they were on. His playlists started on Spotify and now live on Tidal, and both show up side by side here.

Each year gets its own page with the playlist ready to play, a few words about what that year sounded like, his favorite albums, and his **soundprint**: a fingerprint-like image drawn from that year's music.

## What makes it different

- **One archive across streaming services.** Spotify years and Tidal years sit on the same timeline, so switching apps doesn't split his music history in two.
- **Every year, not just this one.** Year-end recaps from streaming apps show up once and disappear. This keeps every year together and adds the next one each January.
- **Personal, not just stats.** A note in his words, memories pinned to specific songs, his anthem of the year, and the songs we both love.
- **Music turned into art.** Each year's soundprint is drawn from the playlist itself and can be downloaded as an image or a 12×18 inch poster.
- **Private and free.** No accounts, no logins, no tracking. It's a static site hosted for free on GitHub Pages, and we own all of it.

## What's on the page

- **Year tabs**, newest first. Arrow keys flip through them, and each year has its own link (for example `…/#2023`).
- **The year's playlist**, playable right on the page. Full songs play for subscribers of that service; everyone else hears previews. There's also a link to open it in the app.
- **The soundprint** for the year, with a legend explaining what each part means.
- **Album wall** with his top albums and their covers.
- **Every year side by side**, plus a **lifetime soundprint** with one band of rings per year.
- **Downloads:** each year's print as an image, and a printable poster of all the years.

### How to read a soundprint

| Part of the print | Comes from |
|---|---|
| Rings | one per song on the playlist (thicker = earlier on it) |
| Colors | the album covers |
| Lobes | one per genre |
| Smooth or jagged edges | the mood (calm, mellow, upbeat or loud) |
| Dotted rings | songs by artists that were new to him that year |
| Outer arcs | songs added each month, January at the top |
| Dots | moments pinned to songs; select one to read it |
| Center button | his anthem of the year, which plays when pressed; the print pulses at its tempo |

The same music always draws the same print. Anything not filled in yet is simply left out, so a year works with just a playlist link.

## Supported services

| Service | What works |
|---|---|
| Tidal | Playlists and albums (embedded player), songs for the anthem |
| Spotify | Playlists and albums (embedded player), songs for the anthem |

Adding another service with an embeddable player takes one small change in `src/lib/embedUrl.js` and `src/lib/links.js`.

## Updating the content

Everything the site shows comes from `src/data/years.js`. The comments at the top of that file explain every field.

1. On the site, choose **Add or edit details** at the bottom of the page (or go to `…/#2024/edit`).
2. Fill in the details. The page previews them as you type. Drafts are kept only in your browser.
3. Click **Copy code** and paste it over that year's entry in `src/data/years.js`.
4. If you added album covers, use the **Save** buttons and upload the files to `public/covers/<year>/`.
5. Run `npm run deploy`. The live site updates within a minute or two.

**Adding a new year:** in the editor, use **Add another year** with the playlist's share link (in Tidal or Spotify: **Share → Copy link**).

You can make all of these edits on github.com with the pencil (edit) button, with no setup on your computer.

## Running it on your computer

You need [Node.js](https://nodejs.org) 24 LTS (versions 20.19+ and 22.12+ also work).

```bash
npm install
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Starts the site at http://localhost:5173/spotify-favorites/ |
| `npm test` | Runs the tests |
| `npm run lint` | Checks the code with ESLint |
| `npm run build` | Builds the site into `build/` |
| `npm run deploy` | Builds and publishes to GitHub Pages |

## How it's built

React 19 and Vite, with no backend. The soundprints are drawn on `<canvas>` by `src/lib/soundprint.js`, the page sections live in `src/components/`, and all of the content is in `src/data/years.js`.

## Ideas for later

- **Fill in the details automatically** from a Spotify data download ("extended streaming history") or Last.fm: real play counts, songs per month and new artists, with no typing. The file would be read in the browser and never uploaded.
- **Bring the Spotify years over to Tidal** with a playlist transfer tool, so every year plays in the app he uses now.
- **More services**, such as Apple Music, YouTube Music or Deezer.
- **A thumbprint-shaped soundprint** as an alternative to the round one.
- **Year-over-year highlights:** artists he kept coming back to, and how his genres shifted.
- **Photos and liner notes** for each year.
- **Shareable story images** sized for phones.
- **A "make your own" page** so friends can create their soundprint from their own data.
