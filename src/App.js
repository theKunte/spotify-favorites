import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import years from "./data/years";
import PlayerEmbed from "./components/PlayerEmbed";

// Newest year first, skipping years that don't have a playlist yet
const playableYears = years
  .filter((entry) => entry.id)
  .sort((a, b) => b.year - a.year);
const yearsWithPlaylists = playableYears.map((entry) => entry.year);

const App = () => {
  const [selectedYear, setSelectedYear] = useState(yearsWithPlaylists[0]);
  const yearPickerRef = useRef(null);
  const selectedEntry = playableYears.find((e) => e.year === selectedYear);

  const scrollYears = (direction) => {
    const currentIndex = yearsWithPlaylists.indexOf(selectedYear);
    if (currentIndex !== -1) {
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < yearsWithPlaylists.length) {
        setSelectedYear(yearsWithPlaylists[newIndex]);
      }
    }
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
      <div className="left-column">
        <div className="year-picker-wrapper">
          <button onClick={() => scrollYears(-1)}>▲</button>
          <div className="year-picker" ref={yearPickerRef}>
            {yearsWithPlaylists.map((year) => (
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

      <div className="right-column">
        <h2>Playlist for {selectedYear}</h2>
        {selectedEntry ? (
          <PlayerEmbed entry={selectedEntry} />
        ) : (
          <p>No playlist available for this year.</p>
        )}
      </div>
    </div>
  );
};

export default App;
