// Every year's print side by side, the lifetime print, and the poster download.
import React, { useCallback, useMemo, useState } from "react";
import PrintCanvas from "./PrintCanvas";
import { drawYear, drawLayers, lifetimeLayers } from "../lib/soundprint";
import { renderPoster, downloadCanvas } from "../lib/exportImage";
import { useLightScheme } from "../hooks";

const StripPrint = ({ model, light }) => {
  const render = useCallback((ctx, size) => drawYear(ctx, size, model, { light }), [model, light]);
  return <PrintCanvas className="strip-canvas" render={render} />;
};

const YearStrip = ({ entries, models, accents, selected, onSelect }) => {
  const light = useLightScheme();
  const [saving, setSaving] = useState(false);
  const layers = useMemo(() => lifetimeLayers(entries.map((e) => models.get(e.year))), [entries, models]);
  const renderLife = useCallback((ctx, size) => drawLayers(ctx, size, layers, { light }), [layers, light]);
  const first = entries[entries.length - 1]?.year;
  const last = entries[0]?.year;

  const poster = async () => {
    setSaving(true);
    try {
      const items = entries.map((e) => ({ model: models.get(e.year), accent: accents.get(e.year) }));
      downloadCanvas(await renderPoster(items), `soundprint-poster-${first}-${last}.png`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="years-h">
      <div className="sec-head">
        <h2 id="years-h">Every year</h2>
        <p>How his taste has moved, {first} to {last}</p>
      </div>
      <div className="strip">
        {[...entries].reverse().map((e) => (
          <button
            key={e.year}
            type="button"
            className="strip-item"
            aria-current={e.year === selected ? "true" : undefined}
            onClick={() => onSelect(e.year)}
            style={{ "--year-accent": accents.get(e.year) }}
          >
            <StripPrint model={models.get(e.year)} light={light} />
            <span>{e.year}</span>
          </button>
        ))}
      </div>

      <div className="panel lifetime">
        <PrintCanvas
          className="life-canvas"
          render={renderLife}
          label={`Lifetime soundprint, ${first} to ${last}, one band per year`}
        />
        <div className="print-text">
          <p className="catno">All years together</p>
          <h2>
            The lifetime <span>soundprint</span>
          </h2>
          <p>
            Each year is one band of rings, {first} in the middle and {last} on the outside, drawn in that year's
            colors and shapes.
          </p>
          <div className="actions">
            <button type="button" className="btn primary" onClick={poster} disabled={saving}>
              {saving ? "Preparing…" : "Download poster"}
            </button>
          </div>
          <p className="muted small">
            A 12 × 18 inch print at 300 dpi with the lifetime print and every year. Ready for a print shop.
          </p>
        </div>
      </div>
    </section>
  );
};

export default YearStrip;
