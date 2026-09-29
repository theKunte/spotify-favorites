# Soundprint

This simple project displays the albums and songs that I liked  over the years. You can select the year and listen to the songs that I enjoyed during that time, from Spotify and Tidal playlists.
## What's on the page

For each year: the playlist and its player, a note, his favorite albums, and his **soundprint**, a fingerprint-like image drawn from the year's music:

| Part of the print | Comes from |
|---|---|
| Rings | one per song on the playlist (thicker = earlier on it) |
| Colors | the album covers |
| Lobes | one per genre |
| Smooth or jagged edges | the mood |
| Dotted rings | songs by artists new to him that year |
| Outer arcs | songs added each month |
| Dots | moments pinned to songs |
| Center button | his anthem, which plays when pressed; the print pulses at its tempo |

Plus: "Songs we both love" highlighting, a download button for each year's print, every year side by side, a lifetime print with one band per year, and a 12×18 inch poster download.

Anything not filled in yet is simply left out, so the site works with just a playlist link per year.

## Updating the content

Everything the site shows comes from `src/data/years.js`. The comments at the top of that file list every field.

1. On the site, choose **Add or edit details** at the bottom (or go to `…/#2024/edit`).
2. Fill in the details. The page previews them as you type (only in your browser).
3. Click **Copy code** and paste it over that year's entry in `src/data/years.js`.
4. If you added album covers, use the **Save** buttons and upload the files to `public/covers/<year>/`.
5. Run `npm run deploy`. The live site updates within a minute or two.

To add a new year, use **Add another year** in the editor with the playlist's share link. You can make these edits on github.com with the pencil (edit) button, no computer setup needed.

## Available Scripts

- `npm run dev` starts the site locally at http://localhost:5173/spotify-favorites/
- `npm test` runs the tests
- `npm run lint` checks the code with ESLint
- `npm run build` builds the site into `build/`
- `npm run deploy` builds and publishes to GitHub Pages


![image](https://github.com/user-attachments/assets/cfe0740b-99a4-4f93-87e4-f57bda0b1698)
