// The selected year's soundprint, with everything that can be layered on it:
// the anthem at the center, a heartbeat at the anthem's tempo, pinned moments,
// songs you both love, and a download button.
import React, { useCallback, useState } from "react";
import PrintCanvas from "./PrintCanvas";
import { drawYear, yearLayer, momentPoints, centerPoint, MOODS, MONTHS } from "../lib/soundprint";
import { rgbCss } from "../lib/color";
import { renderAvatar, downloadCanvas } from "../lib/exportImage";
import { useLightScheme } from "../hooks";

const pct = (v) => `${(v * 100).toFixed(2)}%`;

const Todo = ({ children }) => <span className="todo">{children}</span>;

const SoundprintPanel = ({ entry, model, accent, editing, onPlayAnthem }) => {
  const light = useLightScheme();
  const [together, setTogether] = useState(false);
  const [openMoment, setOpenMoment] = useState(null);
  const [saving, setSaving] = useState(false);

  const showTogether = together && model.shared.size > 0;
  const render = useCallback(
    (ctx, size, progress) =>
      drawYear(ctx, size, model, { progress, light, together: showTogether, fadeDraft: editing }),
    [model, light, showTogether, editing]
  );

  const layer = yearLayer(model);
  const [cx, cy] = centerPoint(model, layer);
  const moments = momentPoints(model, layer);
  const anthem = entry.anthem?.id ? entry.anthem : null;
  const bpm = Number(anthem?.bpm) || 0;

  const download = async () => {
    setSaving(true);
    try {
      downloadCanvas(await renderAvatar(model, { accent }), `groove-${entry.year}.png`);
    } finally {
      setSaving(false);
    }
  };

  const peak = model.monthly ? model.monthly.indexOf(Math.max(...model.monthly)) : -1;
  const label = model.complete
    ? `Groove for ${entry.year}: ${model.songs} rings, ${model.genres.length} lobes, ${model.mood} texture`
    : `Groove for ${entry.year}, still a sketch until more details are added`;

  return (
    <section className="panel print-sec" aria-labelledby="print-h">
      <div className="print-wrap">
        <div
          className={bpm ? "print-beat" : undefined}
          style={bpm ? { animationDuration: `${(60 / bpm).toFixed(3)}s` } : undefined}
        >
          <PrintCanvas className="print-canvas" render={render} animateKey={entry.year} label={label} />
        </div>
        {!model.complete && editing && <span className="draft-tag">Draft</span>}
        {anthem && (
          <button
            type="button"
            className="anthem-dot"
            style={{ left: pct(cx), top: pct(cy) }}
            onClick={onPlayAnthem}
            aria-label={`Play his anthem of ${entry.year}: ${anthem.title} by ${anthem.artist}`}
            title={`${anthem.title} · ${anthem.artist}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
        {moments.map((m, k) => (
          <button
            key={`${m.song}-${k}`}
            type="button"
            className="moment"
            style={{ left: pct(m.x), top: pct(m.y) }}
            aria-expanded={openMoment === k}
            aria-label={`Song ${m.song}: ${m.note}`}
            onClick={() => setOpenMoment(openMoment === k ? null : k)}
            onBlur={() => setOpenMoment(null)}
          >
            <span className={`moment-note${m.x > 0.6 ? " left" : ""}`} hidden={openMoment !== k}>
              <b>Song {m.song}</b> {m.note}
            </span>
          </button>
        ))}
      </div>

      <div className="print-text">
        <p className="catno">His avatar for the year</p>
        <h2 id="print-h">
          The {entry.year} <span>groove</span>
        </h2>
        <p>
          Drawn from the playlist itself. Every year's music makes different grooves, and the same music always
          makes the same ones.
        </p>
        {(model.mood || model.genres.length > 0) && (
          <ul className="chips">
            {model.mood && <li className="mood">{model.mood}</li>}
            {model.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        )}
        <div className="actions">
          <button type="button" className="btn primary" onClick={download} disabled={saving}>
            {saving ? "Preparing…" : "Download image"}
          </button>
          {model.shared.size > 0 && (
            <button type="button" className="btn" aria-pressed={together} onClick={() => setTogether(!together)}>
              {together ? "Show every song" : `Songs we both love (${model.shared.size})`}
            </button>
          )}
        </div>
        <ul className="legend">
          <li>
            <b>Rings</b>
            <span>
              {model.songs ? (
                <>
                  <em>{model.songs}</em>one per song on the playlist
                </>
              ) : (
                editing ? <Todo>Add the number of songs</Todo> : "A sketch until the song count is added"
              )}
            </span>
          </li>
          <li>
            <b>Weight</b>
            <span>Thicker rings come earlier on the playlist. The center is its first song.</span>
          </li>
          <li>
            <b>Colors</b>
            <span>
              {model.fromCovers ? (
                <>
                  {model.palette.map((c) => (
                    <span key={c.join()} className="swatch" style={{ background: rgbCss(c) }} />
                  ))}{" "}
                  taken from this year's album covers
                </>
              ) : editing ? (
                <Todo>Add album covers to color it</Todo>
              ) : (
                "This year's accent color"
              )}
            </span>
          </li>
          {(model.genres.length > 0 || editing) && (
            <li>
              <b>Lobes</b>
              <span>
                {model.genres.length ? (
                  <>
                    <em>{model.genres.length}</em>one per genre
                  </>
                ) : (
                  <Todo>Add genres</Todo>
                )}
              </span>
            </li>
          )}
          {(model.mood || editing) && (
            <li>
              <b>Texture</b>
              <span>
                {model.mood ? `${MOODS[model.mood].label}, from the “${model.mood}” mood` : <Todo>Pick a mood</Todo>}
              </span>
            </li>
          )}
          {model.newArtists !== null && (
            <li>
              <b>Dotted</b>
              <span>
                <em>{model.newArtists}%</em>songs by artists new to him this year
              </span>
            </li>
          )}
          {model.monthly && (
            <li>
              <b>Outer arcs</b>
              <span>
                Songs added each month, January at the top. Busiest month: {MONTHS[peak]}.
              </span>
            </li>
          )}
          {moments.length > 0 && (
            <li>
              <b>Moments</b>
              <span>
                <em>{moments.length}</em>
                {moments.length === 1 ? "memory" : "memories"} pinned to songs. Select a dot to read it.
              </span>
            </li>
          )}
          {anthem && (
            <li>
              <b>Anthem</b>
              <span>
                {anthem.title} · {anthem.artist}. Press the center to play it
                {bpm ? `. The print beats at its ${bpm} BPM.` : "."}
              </span>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default SoundprintPanel;
