// ─────────────────────────────────────────────────────────────────────────────
// MusicPlayer.jsx
//
// This component receives the current mood from App.jsx as a "prop"
// and shows a list of songs matching that mood.
//
// KEY REACT CONCEPT HERE:
//   Props = data passed FROM a parent component TO a child component
//   Like a function argument — App sends mood, MusicPlayer receives it
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import mockSongs from "../services/mockSongs";
import MoodSongs from "./Songs";

// 🎵 MusicPlayer receives two props:
//   currentMood  → the detected emotion string (e.g. "happy")
//   expressions  → the full object { happy: 0.9, sad: 0.05, ... }
const MusicPlayer = ({ currentMood }) => {
  // songs = the list of songs for the current mood
  // When currentMood changes, we update this list
  const [songs, setSongs] = useState([]);

  // currentIndex = which song in the list is "selected" / playing
  const [currentIndex, setCurrentIndex] = useState(0);

  // isPlaying = visual toggle for play/pause (no real audio yet)
  const [isPlaying, setIsPlaying] = useState(false);

  // ── When mood changes, load new songs ─────────────────────────────────────
  // useEffect with [currentMood] as dependency → runs every time mood changes
  // This is how React "reacts" to changes — when currentMood updates,
  // this effect fires and loads the matching songs
  useEffect(() => {
    if (!currentMood) return; // do nothing if no mood detected yet

    // Look up songs for this mood in our mock data
    // e.g. currentMood = "happy" → mockSongs["happy"] → array of 4 songs
    const moodSongs = mockSongs[currentMood] || mockSongs["neutral"];

    setSongs(moodSongs);     // update song list
    setCurrentIndex(0);      // reset to first song whenever mood changes
    setIsPlaying(false);     // stop any playing state
  }, [currentMood]); // ← dependency array: only re-run when currentMood changes

  // ── Helpers ───────────────────────────────────────────────────────────────

  // Go to the next song (with wraparound — after last song, go back to first)
  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  // Go to the previous song
  const prevSong = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  // Toggle play/pause (visual only for now — backend audio comes later)
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Click any song in the list to select it
  const selectSong = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true); // auto-play when selected
  };

  // Emoji for mood badge
  const getMoodColor = (mood) => {
    const colors = {
      happy: "#facc15",
      sad: "#60a5fa",
      angry: "#f87171",
      fearful: "#c084fc",
      disgusted: "#4ade80",
      surprised: "#fb923c",
      neutral: "#94a3b8",
    };
    return colors[mood] || "#a78bfa";
  };

  // ── RENDER: No Mood Yet ───────────────────────────────────────────────────
  // If no mood is detected, show a waiting state
  if (!currentMood) {
    return (
      <div className="music-player music-player--empty">
        <p className="mp-empty-icon">🎵</p>
        <p className="mp-empty-text">Start face detection to get your playlist</p>
      </div>
    );
  }

  // The song that's currently "playing"
  const currentSong = songs[currentIndex];

  // ── RENDER: Full Player ───────────────────────────────────────────────────
  return (
    <div className="music-player">

      {/* ── Mood Badge ────────────────────────────────────────────────────── */}
      {/* Shows which mood is driving the playlist */}
      <div className="mp-mood-badge" style={{ borderColor: getMoodColor(currentMood) }}>
        <span className="mp-mood-label">Playlist for</span>
        <span className="mp-mood-name" style={{ color: getMoodColor(currentMood) }}>
          {currentMood}
        </span>
      </div>

      {/* ── Now Playing Card ──────────────────────────────────────────────── */}
      {currentSong && (
        <div className="mp-now-playing">
          {/* Big emoji as album art placeholder */}
          <div className="mp-album-art">{currentSong.cover}</div>

          <div className="mp-song-info">
            <p className="mp-song-title">{currentSong.title}</p>
            <p className="mp-song-artist">{currentSong.artist}</p>
            <p className="mp-song-duration">{currentSong.duration}</p>
          </div>

          {/* ── Controls ────────────────────────────────────────────────── */}
          {/* Prev → Play/Pause → Next */}
          <div className="mp-controls">
            <button className="mp-btn" onClick={prevSong} title="Previous">
              ⏮
            </button>

            {/* Toggle play/pause visual state */}
            <button className="mp-btn mp-btn--play" onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶️"}
            </button>

            <button className="mp-btn" onClick={nextSong} title="Next">
              ⏭
            </button>
          </div>

          {/* Note: real audio playback will come when backend is ready */}
          {isPlaying && (
            <p className="mp-playing-note">🎧 Playing — connect backend for real audio</p>
          )}
        </div>
      )}

      {/* ── Song List ─────────────────────────────────────────────────────── */}
      {/* MoodSongs is a child component that receives the mood as a prop     */}
      {/* and renders the song list internally using its own map()            */}
      <MoodSongs mood={currentMood} />
    </div>
  );
};

export default MusicPlayer;
