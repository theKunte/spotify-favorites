// Embedded Tidal or Spotify player for a playlist, album or track.
import React from "react";
import { embedUrl } from "../lib/embedUrl";
import { SERVICE_NAMES } from "../lib/links";

const PlayerEmbed = ({ item, title }) => (
  <iframe
    src={embedUrl(item)}
    width="100%"
    height={item.type === "track" ? 160 : 380}
    style={{ border: 0, borderRadius: 12, display: "block" }}
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    allowFullScreen
    loading="lazy"
    title={title || `${SERVICE_NAMES[item.service]} ${item.type || "playlist"}`}
  ></iframe>
);

export default PlayerEmbed;
