import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const yearPickerRef = useRef(null);
  const playlists = {
    2023: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    2022: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
  };

  const range = 5; // Number of years to show above and below the current year

  const generateYears = (centerYear) => {
    const years = [];
    for (let i = -range; i <= range; i++) {
      years.push(centerYear + i);
    }
    return years;
  };

  const years = generateYears(selectedYear);

  const scrollYears = (direction) => {
    setSelectedYear((prev) => prev + direction);
  };

  useEffect(() => {
    if (yearPickerRef.current) {
      const selectedItem =
        yearPickerRef.current.querySelector(`.year.selected`);
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedYear]);

  return (
    <div className="app-container">
      {/* Left Column: Year Picker */}
      <div className="left-column">
        <div className="year-picker-wrapper">
          <button onClick={() => scrollYears(-1)}>▲</button>
          <div className="year-picker" ref={yearPickerRef}>
            {years.map((year) => (
              <div
                key={year}
                className={`year ${
                  year === selectedYear ? "current-year selected" : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </div>
            ))}
          </div>
          <button onClick={() => scrollYears(1)}>▼</button>
        </div>
      </div>

      {/* Right Column: Spotify Playlist */}
      <div className="right-column">
        <h2>Playlist for {selectedYear}</h2>
        {playlists[selectedYear] ? (
          <iframe
            src={playlists[selectedYear]}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title={`Spotify Playlist ${selectedYear}`}
          ></iframe>
        ) : (
          <p>No playlist available for this year.</p>
        )}
      </div>
    </div>
  );
};

export default App;
