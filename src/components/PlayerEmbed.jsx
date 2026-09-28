// Embedded Tidal or Spotify player for one year's playlist.
import React from "react";
import { embedUrl } from "../embedUrl";

const SERVICE_NAMES = { tidal: "Tidal", spotify: "Spotify" };

const PlayerEmbed = ({ entry }) => (
  <iframe
    src={embedUrl(entry)}
    width="100%"
    height="380"
    style={{ border: 0 }}
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    allowFullScreen
    loading="lazy"
    title={`${SERVICE_NAMES[entry.service]} playlist for ${entry.year}`}
  ></iframe>
);

export default PlayerEmbed;
