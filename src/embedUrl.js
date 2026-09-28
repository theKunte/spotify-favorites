// Builds the embeddable player URL for a Tidal or Spotify playlist, album or track.
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
