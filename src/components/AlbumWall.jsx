// His favorite albums of the year, in order.
import React from "react";
import { coverSrc } from "../lib/entries";

const AlbumWall = ({ entry, editing }) => {
  const albums = (entry.albums || []).filter((a) => a.title || a.cover);
  if (!albums.length && !editing) return null;
  return (
    <section aria-labelledby="wall-h">
      <div className="sec-head">
        <h2 id="wall-h">Album wall</h2>
        {albums.length > 0 && <p>His top {albums.length} of {entry.year}</p>}
      </div>
      <div className="wall">
        {albums.length ? (
          albums.map((a, k) => (
            <figure className="cover" key={`${k}-${a.title}`}>
              <span className="art">
                {a.cover ? <img src={coverSrc(a.cover)} alt="" loading="lazy" /> : <span className="noart">{a.title}</span>}
                <span className="rank">#{k + 1}</span>
              </span>
              <figcaption>
                <span className="t">{a.title || "Untitled"}</span>
                <span className="a">{a.artist}</span>
              </figcaption>
            </figure>
          ))
        ) : (
          <>
            {[0, 1, 2, 3, 4].map((k) => (
              <div className="ghost" key={k} />
            ))}
            <p className="wall-empty">No albums for {entry.year} yet. Add his favorites in the editor below.</p>
          </>
        )}
      </div>
    </section>
  );
};

export default AlbumWall;
