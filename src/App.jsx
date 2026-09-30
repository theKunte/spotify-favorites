import React, { useCallback, useMemo, useState } from "react";
import "./App.css";
import years from "./data/years";
import { mergeEntries, accentFor } from "./lib/entries";
import { loadDrafts, saveDrafts } from "./lib/drafts";
import { printModel } from "./lib/soundprint";
import { useCoverPalettes, useRoute } from "./hooks";
import YearTabs from "./components/YearTabs";
import Hero from "./components/Hero";
import SoundprintPanel from "./components/SoundprintPanel";
import AlbumWall from "./components/AlbumWall";
import Listen from "./components/Listen";
import YearStrip from "./components/YearStrip";
import Editor from "./components/Editor";
import Backdrop from "./components/Backdrop";

const baseYears = new Set(years.filter((y) => y.id).map((y) => y.year));

const App = () => {
  const [drafts, setDrafts] = useState(loadDrafts);
  const [storageOk, setStorageOk] = useState(true);
  const [route, go] = useRoute();
  const [anthemYear, setAnthemYear] = useState(null);

  const entries = useMemo(() => mergeEntries(years, drafts), [drafts]);
  const paletteFor = useCoverPalettes(entries);
  const accents = useMemo(() => new Map(entries.map((e) => [e.year, accentFor(e)])), [entries]);
  const models = useMemo(
    () => new Map(entries.map((e) => [e.year, printModel(e, { palette: paletteFor(e), accent: accents.get(e.year) })])),
    [entries, paletteFor, accents]
  );

  const entry = entries.find((e) => e.year === route.year) || entries[0];
  const editing = route.edit;

  const select = useCallback((year) => go(year, editing), [go, editing]);

  const updateDrafts = (fn) => {
    const next = fn(drafts);
    setDrafts(next);
    setStorageOk(saveDrafts(next));
  };

  if (!entry) {
    return (
      <main className="wrap">
        <h1 className="brand">
          Sound<span>print</span>
        </h1>
        <p>No playlists yet. Add one to src/data/years.js.</p>
      </main>
    );
  }

  const accent = accents.get(entry.year);
  const model = models.get(entry.year);

  return (
    <>
      <Backdrop model={model} accent={accent} />
      <div className="wrap" style={{ "--accent": accent }}>
        <header className="top">
          <h1 className="brand">
            Sound<span>print</span>
          </h1>
          <p>The albums and songs he played most, one year at a time.</p>
        </header>

        <YearTabs entries={entries} models={models} selected={entry.year} onSelect={select} />

        <main className="main">
          <Hero entry={entry} editing={editing} />
          <SoundprintPanel
            key={entry.year}
            entry={entry}
            model={model}
            accent={accent}
            editing={editing}
            onPlayAnthem={() => {
              setAnthemYear(entry.year);
              document.getElementById("listen-h")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
          <AlbumWall entry={entry} editing={editing} />
          <Listen entry={entry} playingAnthem={anthemYear === entry.year} onBack={() => setAnthemYear(null)} />
          <YearStrip entries={entries} models={models} accents={accents} selected={entry.year} onSelect={select} />
          {editing && (
            <Editor
              key={entry.year}
              entry={entry}
              draft={drafts[entry.year] || {}}
              isNewYear={!baseYears.has(entry.year)}
              storageOk={storageOk}
              onChange={(patch) =>
                updateDrafts((d) => ({ ...d, [entry.year]: { ...(d[entry.year] || {}), ...patch } }))
              }
              onClear={() =>
                updateDrafts((d) => {
                  const next = { ...d };
                  delete next[entry.year];
                  return next;
                })
              }
              onAddYear={(year, link) => {
                updateDrafts((d) => ({ ...d, [year]: { ...(d[year] || {}), ...link } }));
                go(year, true);
              }}
            />
          )}
        </main>

        <footer className="foot">
          {editing ? (
            <a href={`#${entry.year}`}>Close the editor</a>
          ) : (
            <a href={`#${entry.year}/edit`}>Add or edit details</a>
          )}
        </footer>
      </div>
    </>
  );
};

export default App;
