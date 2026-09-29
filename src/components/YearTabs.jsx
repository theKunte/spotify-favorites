// Record-store divider tabs, one per year, newest first.
import React, { useCallback, useRef } from "react";
import PrintCanvas from "./PrintCanvas";
import { drawYear } from "../lib/soundprint";
import { SERVICE_NAMES } from "../lib/links";

const TabPrint = ({ model }) => {
  const render = useCallback(
    (ctx, size) => drawYear(ctx, size, model, { mono: getComputedStyle(ctx.canvas).color, ringStep: 3 }),
    [model]
  );
  return <PrintCanvas className="mini" render={render} />;
};

const YearTabs = ({ entries, models, selected, onSelect }) => {
  const listRef = useRef(null);
  const onKeyDown = (e) => {
    const i = entries.findIndex((en) => en.year === selected);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: entries.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const k = Math.max(0, Math.min(entries.length - 1, next));
    onSelect(entries[k].year);
    listRef.current?.children[k]?.focus();
  };

  return (
    <nav aria-label="Choose a year">
      <div className="tabs" role="tablist" aria-label="Years" ref={listRef} onKeyDown={onKeyDown}>
        {entries.map((entry) => {
          const on = entry.year === selected;
          const songs = Number(entry.songs) > 0 ? ` · ${entry.songs} songs` : "";
          return (
            <button
              key={entry.year}
              type="button"
              role="tab"
              className="tab"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onSelect(entry.year)}
            >
              <TabPrint model={models.get(entry.year)} />
              <span className="yr">{entry.year}</span>
              <span className="meta">{SERVICE_NAMES[entry.service]}{songs}</span>
            </button>
          );
        })}
      </div>
      <p className="hint">Tip: use ← → to flip through the years</p>
    </nav>
  );
};

export default YearTabs;
