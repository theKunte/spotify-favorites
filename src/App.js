import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPlaying, setIsPlaying] = useState(false);
  const yearPickerRef = useRef(null);
  const playlists = {
    2025: "",
    2024: "https://open.spotify.com/embed/playlist/2PqZ6i0tCTtyCcX8JHpAds?si=CvqF1HlRR-qzYC60Hr7yCg&pi=moggBQWiSYWfs",
    2023: "https://open.spotify.com/embed/playlist/1TZVeN4UXjp3YzeP2dv7Qg?si=5zD1LIIaQgOhxYr0zSYMJw&pi=QeeD67v1QSa6f",
    2022: "https://open.spotify.com/embed/playlist/4fawHenj9g4R7DKXTICKXZ?si=Vfm5hJuTSIiyNO8chu8bYA&pi=117Yf7AOR_eas",
    2021: "https://open.spotify.com/embed/playlist/7kMFVHHgWx4LdntQtdgPtw?si=fsG2vwBVSYOZS1tz_VmmgQ&pi=QC_-FTY3RACC8",
  };

  const yearsWithPlaylists = Object.keys(playlists)
    .filter((year) => playlists[year])
    .map(Number);

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

  // Handler to set isPlaying when the iframe is interacted with
  const handlePlayerInteraction = () => setIsPlaying(true);

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
        {/* Only show animation if a song is playing */}
        {isPlaying && (
          <div className="music-bars-bg">
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
            <div className="music-bar"></div>
          </div>
        )}
        <h2>Playlist for {selectedYear}</h2>
        {playlists[selectedYear] ? (
          <iframe
            src={playlists[selectedYear]}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            title={`Spotify Playlist ${selectedYear}`}
            onPlay={handlePlayerInteraction}
            onFocus={handlePlayerInteraction}
            onClick={handlePlayerInteraction}
          ></iframe>
        ) : (
          <p>No playlist available for this year.</p>
        )}
      </div>
    </div>
  );
};

export default App;
