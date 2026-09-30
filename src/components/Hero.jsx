// The big year, his note, and a record sleeve with the top album's cover.
import React from "react";
import { coverSrc } from "../lib/entries";
import { SERVICE_NAMES } from "../lib/links";

const Hero = ({ entry, editing }) => {
  const albums = (entry.albums || []).filter((a) => a.title || a.cover);
  const lead = albums.find((a) => a.cover);
  const songs = Number(entry.songs) || 0;
  return (
    <section className="hero" aria-live="polite">
      <div className="hero-text">
        <p className="catno">
          Vol. {String(entry.year - 2020).padStart(2, "0")} · Cat. no. SP-{entry.year}
        </p>
        <h2 className="big">{entry.year}</h2>
        {entry.title && <p className="playlist-title">{entry.title}</p>}
        {entry.note ? (
          <p className="note quote">{entry.note}</p>
        ) : (
          editing && <p className="note todo">No note yet. Add one in the editor below.</p>
        )}
        {(songs > 0 || albums.length > 0) && (
          <ul className="stats">
            {songs > 0 && (
              <li>
                <b>{songs}</b>
                <span>songs</span>
              </li>
            )}
            {albums.length > 0 && (
              <li>
                <b>{albums.length}</b>
                <span>albums</span>
              </li>
            )}
          </ul>
        )}
        <span className="pill">
          <i />
          Playlist on {SERVICE_NAMES[entry.service]}
        </span>
      </div>
      {/* keyed by year so the sleeve and record slide in again on each change */}
      <div className="deck" aria-hidden="true" key={entry.year}>
        <div className="record" />
        <div className="sleeve">
          {lead ? (
            <img src={coverSrc(lead.cover)} alt="" />
          ) : (
            <div className="sleeve-type">
              <span>Soundprint</span>
              <b>{entry.year}</b>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
