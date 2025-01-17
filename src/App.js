import React, { useEffect } from "react";
import "./App.css";
import TotalListeningTime from "./components/TotalListeningTime";
import SongList from "./components/SongList";

function App() {
  const [songsByYear, setSongsByYear] = React.useState({});
  const [totalTime, setTotalTime] = React.useState({});

  useEffect(() => {
    // Fetch data from Spotify API
    const fetchDatat = async () => {
      // Replace with actual API calls using access token
      const mockData = {
        2020: [
          {
            name: "Song 1",
            artist: "Artist 1",
            duration: 180,
          },
          {
            name: "Song 2",
            artist: "Artist 2",
            duration: 240,
          },
        ],
        2019: [
          {
            name: "Song 3",
            artist: "Artist 3",
            duration: 120,
          },
          {
            name: "Song 4",
            artist: "Artist 4",
            duration: 300,
          },
        ],
      };
      const mockTotalTime = 12000; // in seconds
      setSongsByYear(mockData);
      setTotalTime(mockTotalTime);
    };

    fetchDatat();
  }, []);

  return (
    <div className="App">
      <h1>My Spotify Stats</h1>
      <TotalListeningTime totalTime={totalTime} />
      {Object.keys(songsByYear).map((year) => (
        <div key={year} className="year-section">
          <h2>{year}</h2>
          <SongList songs={songsByYear[year]} />
        </div>
      ))}
    </div>
  );
}

export default App;
