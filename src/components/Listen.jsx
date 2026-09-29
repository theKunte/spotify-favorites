// The year's playlist player, or his anthem when it was picked from the print.
import React from "react";
import PlayerEmbed from "./PlayerEmbed";
import { openUrl, SERVICE_NAMES } from "../lib/links";

const Listen = ({ entry, playingAnthem, onBack }) => {
  const anthem = playingAnthem && entry.anthem?.id ? { ...entry.anthem, type: "track" } : null;
  const item = anthem || entry;
  const name = SERVICE_NAMES[item.service];
  return (
    <section aria-labelledby="listen-h">
      <div className="sec-head">
        <h2 id="listen-h">{anthem ? "His anthem" : "Listen"}</h2>
        {anthem && (
          <button type="button" className="btn" onClick={onBack}>
            Back to the full playlist
          </button>
        )}
      </div>
      <div className="listen">
        <PlayerEmbed
          key={`${item.service}-${item.id}`}
          item={item}
          title={anthem ? `${name} player: ${anthem.title}` : `${name} playlist for ${entry.year}`}
        />
        <p>
          <a href={openUrl(item)} target="_blank" rel="noreferrer">
            Open {anthem ? `“${anthem.title}”` : `the ${entry.year} playlist`} in {name} ↗
          </a>{" "}
          <span className="muted">Full songs play for {name} subscribers; everyone else hears previews.</span>
        </p>
      </div>
    </section>
  );
};

export default Listen;
