//  a list of favorite songs.

import React from "react";

const SongList = ({ songs }) => {
  return (
    <ul>
      {songs.map((song) => (
        <li>
          {song.name} by {song.artist} ({Math.floor(song.duration / 60)}:
          {song.duration % 60})
        </li>
      ))}
      ;
    </ul>
  );
};

export default SongList;
