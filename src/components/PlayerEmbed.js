// Embedded Tidal or Spotify player for one year's playlist.
import React from "react";

const SERVICE_NAMES = { tidal: "Tidal", spotify: "Spotify" };

export const embedUrl = ({ service, type = "playlist", id }) => {
  switch (service) {
    case "tidal":
      return `https://embed.tidal.com/${type}s/${id}`;
    case "spotify":
      return `https://open.spotify.com/embed/${type}/${id}`;
    default:
      throw new Error(`Unknown music service: ${service}`);
  }
};

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
