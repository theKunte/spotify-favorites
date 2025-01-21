import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const playlists = {
    // Test playlist
    2025: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    2024: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    2023: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    2022: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    2021: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    2020: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M", // Test playlist
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="app-container">
      <div className="left-column">
        <h2>Select Year</h2>
        <select value={selectedYear} onChange={handleYearChange}>
          {Object.keys(playlists).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="right-column">
        <h2>Playlist for {selectedYear}</h2>
        <iframe
          src={playlists[selectedYear]}
          width="100%"
          height="380"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          title={`Spotify Playlist ${selectedYear}`}
        ></iframe>
      </div>
    </div>
  );
};

export default App;
