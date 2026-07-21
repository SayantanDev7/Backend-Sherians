import { useState,useEffect } from "react";
import mockSongs from "../services/mockSongs";
const MoodSongs = ({mood}) => {
  const [songs, setSongs] = useState([]);


  useEffect(() => {
    setSongs(mockSongs[mood] || []);
  }, [mood]);

  return (
    <div>
      <h2>{mood.toUpperCase()} Songs</h2>

      {songs.map((song) => (
        <div key={song.id}>
          <h3>{song.cover} {song.title}</h3>
          <p>{song.artist}</p>
          <span>{song.duration}</span>
        </div>
      ))}
    </div>
  );
};

export default MoodSongs;