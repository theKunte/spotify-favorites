// Fill in a year's details, preview them on the page, and copy the code for
// src/data/years.js. Drafts stay in this browser until they're added there.
import React, { useState } from "react";
import { buildSnippet } from "../lib/snippet";
import { parseShareLink, SERVICE_NAMES } from "../lib/links";
import { MONTHS } from "../lib/soundprint";

const splitList = (text) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Resize an uploaded cover to 500px so drafts stay small
function readCover(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 500;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    img.src = url;
  });
}

function saveDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
}

const Field = ({ id, label, hint, children }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    {children}
    {hint && <small>{hint}</small>}
  </div>
);

const Editor = ({ entry, draft, isNewYear, storageOk, onChange, onClear, onAddYear }) => {
  const [status, setStatus] = useState("");
  const [armed, setArmed] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newError, setNewError] = useState("");

  const y = entry.year;
  const albums = entry.albums || [];
  const moments = entry.moments || [];
  const monthly = entry.monthly || Array(12).fill("");
  const anthem = entry.anthem || {};
  const genresText = draft._genresText ?? (entry.genres || []).join(", ");
  const sharedText = draft._sharedText ?? (entry.shared || []).join(", ");
  const anthemLink = draft._anthemLink ?? "";
  const playlistLink = draft._playlistLink ?? "";
  const anthemLinkBad = anthemLink && !parseShareLink(anthemLink);
  const playlistParsed = playlistLink ? parseShareLink(playlistLink) : null;

  const clean = Object.fromEntries(Object.entries(entry).filter(([k]) => !k.startsWith("_")));
  const { code, uploads } = buildSnippet(clean);
  const hasDraft = Object.keys(draft).length > 0;

  const setAlbum = (k, patch) => onChange({ albums: albums.map((a, i) => (i === k ? { ...a, ...patch } : a)) });
  const setMoment = (k, patch) => onChange({ moments: moments.map((m, i) => (i === k ? { ...m, ...patch } : m)) });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied. Now follow the steps below.");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("snippet"));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      setStatus("Selected. Press Ctrl+C (or ⌘C) to copy.");
    }
  };

  const clear = () => {
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 3000);
      return;
    }
    setArmed(false);
    onClear();
  };

  const addYear = (e) => {
    e.preventDefault();
    const year = Number(newYear);
    const parsed = parseShareLink(newLink);
    if (!(year >= 1990 && year <= 2100)) return setNewError("Enter a year, like 2025.");
    if (!parsed || parsed.type === "track") return setNewError("Paste a Tidal or Spotify playlist or album link.");
    setNewError("");
    setNewYear("");
    setNewLink("");
    onAddYear(year, parsed);
  };

  return (
    <section className="editor-sec" aria-labelledby="edit-h">
      <div className="sec-head">
        <h2 id="edit-h">Edit {y}</h2>
        <p>The page above updates as you type</p>
      </div>
      <p className="notice">
        Changes here are a preview in this browser only. To publish them, copy the code into{" "}
        <code>src/data/years.js</code> and deploy.
        {!storageOk && " This browser isn't saving drafts, so copy the code before you leave."}
      </p>

      <div className="panel editor">
        <form className="form" onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <fieldset>
            <legend>The playlist</legend>
            <Field
              id="f-playlist"
              label={isNewYear ? "Playlist link" : "Change the playlist link"}
              hint={
                playlistLink
                  ? playlistParsed
                    ? `Using this ${SERVICE_NAMES[playlistParsed.service]} ${playlistParsed.type}.`
                    : "That doesn't look like a Tidal or Spotify link."
                  : `Now: ${SERVICE_NAMES[entry.service]} ${entry.type || "playlist"} ${entry.id}`
              }
            >
              <input
                type="url"
                id="f-playlist"
                placeholder="Paste a share link from Tidal or Spotify"
                value={playlistLink}
                onChange={(e) => {
                  const p = parseShareLink(e.target.value);
                  onChange({
                    _playlistLink: e.target.value,
                    ...(p && p.type !== "track" ? { service: p.service, type: p.type, id: p.id } : {}),
                  });
                }}
              />
            </Field>
            <Field id="f-title" label="Playlist name">
              <input type="text" id="f-title" value={entry.title || ""} placeholder="e.g. Songs I liked 2024" onChange={(e) => onChange({ title: e.target.value })} />
            </Field>
            <Field id="f-note" label="A note about the year">
              <textarea id="f-note" value={entry.note || ""} placeholder="In his words: what the year sounded like" onChange={(e) => onChange({ note: e.target.value })} />
            </Field>
          </fieldset>

          <fieldset>
            <legend>The groove</legend>
            <div className="row2">
              <Field id="f-songs" label="Songs on the playlist">
                <input type="number" id="f-songs" min="1" max="1000" value={entry.songs ?? ""} placeholder="e.g. 100" onChange={(e) => onChange({ songs: e.target.value })} />
              </Field>
              <Field id="f-mood" label="Mood">
                <select id="f-mood" value={entry.mood || ""} onChange={(e) => onChange({ mood: e.target.value })}>
                  <option value="">Choose…</option>
                  <option value="calm">Calm</option>
                  <option value="mellow">Mellow</option>
                  <option value="upbeat">Upbeat</option>
                  <option value="loud">Loud</option>
                </select>
              </Field>
            </div>
            <Field id="f-genres" label="Genres" hint="Separate with commas. One lobe each.">
              <input type="text" id="f-genres" value={genresText} placeholder="e.g. indie, jazz, hip-hop" onChange={(e) => onChange({ _genresText: e.target.value, genres: splitList(e.target.value) })} />
            </Field>
            <Field id="f-new" label="Songs by artists new to him (%)" hint="Those rings are drawn dotted. Leave empty if you're not sure.">
              <input type="number" id="f-new" min="0" max="100" value={entry.newArtists ?? ""} placeholder="e.g. 40" onChange={(e) => onChange({ newArtists: e.target.value === "" ? undefined : e.target.value })} />
            </Field>
            <div className="field">
              <span className="lbl" id="f-months-l">Songs added each month</span>
              <div className="months" role="group" aria-labelledby="f-months-l">
                {MONTHS.map((mon, k) => (
                  <label key={mon} className="month">
                    <span>{mon}</span>
                    <input
                      type="number"
                      min="0"
                      id={`f-month-${k}`}
                      value={monthly[k] ?? ""}
                      onChange={(e) => onChange({ monthly: monthly.map((v, i) => (i === k ? e.target.value : v)) })}
                    />
                  </label>
                ))}
              </div>
              <small>In Spotify or Tidal, sort the playlist by date added and count each month.</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>His anthem</legend>
            <Field id="f-anthem-link" label="Song link" hint={
                anthemLinkBad
                  ? "That doesn't look like a Tidal or Spotify song link."
                  : anthem.id && !anthemLink
                    ? `Now: ${SERVICE_NAMES[anthem.service]} song ${anthem.id}. Paste a new link to change it.`
                    : "Share link to his #1 song of the year. It plays from the print's center."
              }>
              <input
                type="url"
                id="f-anthem-link"
                value={anthemLink}
                placeholder="Paste a share link to the song"
                onChange={(e) => {
                  const p = parseShareLink(e.target.value);
                  onChange({
                    _anthemLink: e.target.value,
                    ...(p && p.type === "track" ? { anthem: { ...anthem, service: p.service, id: p.id } } : {}),
                  });
                }}
              />
            </Field>
            <div className="row3">
              <Field id="f-anthem-title" label="Song">
                <input type="text" id="f-anthem-title" value={anthem.title || ""} onChange={(e) => onChange({ anthem: { ...anthem, title: e.target.value } })} />
              </Field>
              <Field id="f-anthem-artist" label="Artist">
                <input type="text" id="f-anthem-artist" value={anthem.artist || ""} onChange={(e) => onChange({ anthem: { ...anthem, artist: e.target.value } })} />
              </Field>
              <Field id="f-anthem-bpm" label="Tempo (BPM)">
                <input type="number" id="f-anthem-bpm" min="40" max="220" value={anthem.bpm ?? ""} placeholder="e.g. 96" onChange={(e) => onChange({ anthem: { ...anthem, bpm: e.target.value } })} />
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <legend>Moments</legend>
            <p className="muted small">Pin a memory to a song. Use its position on the playlist (1 is the first song).</p>
            <div className="rows">
              {moments.map((m, k) => (
                <div className="moment-row" key={k}>
                  <input type="number" min="1" id={`f-moment-song-${k}`} aria-label={`Moment ${k + 1}: song number`} value={m.song ?? ""} placeholder="#" onChange={(e) => setMoment(k, { song: e.target.value })} />
                  <input type="text" id={`f-moment-note-${k}`} aria-label={`Moment ${k + 1}: note`} value={m.note || ""} placeholder="e.g. Our road trip to the coast" onChange={(e) => setMoment(k, { note: e.target.value })} />
                  <button type="button" className="btn icon" aria-label={`Remove moment ${k + 1}`} onClick={() => onChange({ moments: moments.filter((_, i) => i !== k) })}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="actions">
              <button type="button" className="btn" onClick={() => onChange({ moments: [...moments, { song: "", note: "" }] })}>
                Add a moment
              </button>
            </div>
            <Field id="f-shared" label="Songs you both love" hint="Their positions on the playlist, separated by commas. They light up with “Songs we both love”.">
              <input
                type="text"
                id="f-shared"
                value={sharedText}
                placeholder="e.g. 1, 4, 12"
                onChange={(e) => onChange({ _sharedText: e.target.value, shared: splitList(e.target.value).map(Number).filter((n) => n > 0) })}
              />
            </Field>
          </fieldset>

          <fieldset>
            <legend>Favorite albums</legend>
            <p className="muted small">Up to 10, in order. Tap a square to add the cover; its colors feed the groove.</p>
            <div className="rows">
              {albums.map((a, k) => (
                <div className="album-row" key={k}>
                  <label className="thumb" title="Add cover image">
                    {a.cover ? <img src={a.cover.startsWith("data:") ? a.cover : `${import.meta.env.BASE_URL}${a.cover}`} alt="" /> : <span>Add cover</span>}
                    <input
                      type="file"
                      accept="image/*"
                      id={`f-cover-${k}`}
                      aria-label={`Cover image for album ${k + 1}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        readCover(file)
                          .then((cover) => setAlbum(k, { cover }))
                          .catch(() => setStatus("That file couldn't be read as an image. Try a JPG or PNG."));
                      }}
                    />
                  </label>
                  <input type="text" id={`f-album-title-${k}`} aria-label={`Album ${k + 1} title`} placeholder="Album title" value={a.title || ""} onChange={(e) => setAlbum(k, { title: e.target.value })} />
                  <input type="text" className="artist" id={`f-album-artist-${k}`} aria-label={`Album ${k + 1} artist`} placeholder="Artist" value={a.artist || ""} onChange={(e) => setAlbum(k, { artist: e.target.value })} />
                  <button type="button" className="btn icon" aria-label={`Remove album ${k + 1}`} onClick={() => onChange({ albums: albums.filter((_, i) => i !== k) })}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {albums.length < 10 && (
              <div className="actions">
                <button type="button" className="btn" onClick={() => onChange({ albums: [...albums, { title: "", artist: "", cover: "" }] })}>
                  Add an album
                </button>
              </div>
            )}
          </fieldset>

          {hasDraft && (
            <div className="actions">
              <button type="button" className="btn" onClick={clear}>
                {armed ? `Click again to discard ${y} changes` : `Discard ${y} changes`}
              </button>
            </div>
          )}
        </form>

        <div className="out">
          <div className="field">
            <span className="lbl">Paste this into src/data/years.js</span>
            <pre className="code" id="snippet">{code}</pre>
          </div>
          <div className="actions">
            <button type="button" className="btn primary" onClick={copy}>
              Copy code
            </button>
          </div>
          <p className="status" role="status">
            {status}
          </p>
          <ol className="steps">
            <li>
              On GitHub, open <code>src/data/years.js</code> and click the pencil icon to edit.
            </li>
            <li>
              {isNewYear ? (
                <>Add the copied code inside the list, above the newest year.</>
              ) : (
                <>
                  Replace the entry that starts with <code>{`{ year: ${y},`}</code> with the copied code.
                </>
              )}
            </li>
            {uploads.length > 0 && (
              <li>
                Save the covers below and upload them to <code>public/covers/{y}/</code> without renaming them.
                <div className="uploads">
                  {uploads.map((u) => (
                    <button key={u.path} type="button" className="btn small" onClick={() => saveDataUrl(u.data, u.path.split("/").pop())}>
                      Save {u.path.split("/").pop()}
                    </button>
                  ))}
                </div>
              </li>
            )}
            <li>
              Commit, then run <code>npm run deploy</code> (or ask Claude to deploy it).
            </li>
          </ol>
        </div>
      </div>

      <form className="panel add-year" onSubmit={addYear}>
        <h3>Add another year</h3>
        <div className="add-row">
          <Field id="f-new-year" label="Year">
            <input type="number" id="f-new-year" min="1990" max="2100" value={newYear} placeholder="2025" onChange={(e) => setNewYear(e.target.value)} />
          </Field>
          <Field id="f-new-link" label="Playlist link">
            <input type="url" id="f-new-link" value={newLink} placeholder="Paste a Tidal or Spotify playlist link" onChange={(e) => setNewLink(e.target.value)} />
          </Field>
          <button type="submit" className="btn primary">
            Add year
          </button>
        </div>
        {newError && (
          <p className="error" role="alert">
            {newError}
          </p>
        )}
      </form>
    </section>
  );
};

export default Editor;
