# Soundprint

This simple project displays the albums and songs that I liked  over the years. You can select the year and listen to the songs that I enjoyed during that time, from Spotify and Tidal playlists.
## Updating the content

Everything the site shows comes from `src/data/years.js`. Each year needs only its service and playlist ID; everything else is optional and can be added over time.

**Add a new year**
1. In Tidal, open the playlist, choose **Share → Copy link**, and copy the ID at the end of the link.
2. Add a line to `src/data/years.js`: `{ year: 2025, service: "tidal", id: "the-id" },`

**Add details to a year** (note, songs, mood, genres, favorite albums)
1. Fill in the "Add details" editor in the Soundprint mockup and click **Copy code**.
2. In `src/data/years.js`, replace that year's line with the copied code.
3. Upload any album covers to `public/covers/<year>/` using the file names shown in the editor.

**Publish**: run `npm run deploy`. The live site updates within a minute or two.

You can make all of these edits on github.com with the pencil (edit) button, no computer setup needed.

## Available Scripts

- `npm run dev` starts the site locally at http://localhost:5173/spotify-favorites/
- `npm test` runs the tests
- `npm run lint` checks the code with ESLint
- `npm run build` builds the site into `build/`
- `npm run deploy` builds and publishes to GitHub Pages


![image](https://github.com/user-attachments/assets/cfe0740b-99a4-4f93-87e4-f57bda0b1698)
