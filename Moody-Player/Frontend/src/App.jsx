// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — The ROOT component
//
// IMPORTANT REACT CONCEPT: "Lifting State Up"
//
// Both FaceDetector and MusicPlayer need to share the mood.
// FaceDetector PRODUCES the mood (from the camera).
// MusicPlayer CONSUMES the mood (to show songs).
//
// The solution: put the mood state HERE in App (the common parent).
// Then:
//   → Pass a callback (onMoodChange) DOWN to FaceDetector
//   → FaceDetector calls it when mood changes → state updates here
//   → Pass currentMood DOWN to MusicPlayer as a prop
//   → MusicPlayer re-renders with the new mood's songs
//
// Data Flow:
//   FaceDetector ──calls──► onMoodChange("happy") ──► App state
//   App state ──prop──► MusicPlayer (shows happy songs)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react'
import FaceDetector from './components/FaceDetector'
import MusicPlayer from './components/MusicPlayer'
import './App.css'

const App = () => {
  // currentMood lives HERE — in the parent — so both children can use it
  // null = no mood detected yet
  // "happy" / "sad" / etc. = mood detected by FaceDetector
  const [currentMood, setCurrentMood] = useState(null);

  // This function is passed DOWN to FaceDetector as a prop called onMoodChange
  // When FaceDetector calls onMoodChange("happy"), this runs → state updates
  // → App re-renders → MusicPlayer receives the new mood
  const handleMoodChange = (mood) => {
    setCurrentMood(mood);
  };

  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app-header">
        <h1>🎵 Moody Player</h1>
        <p>Your mood, your music.</p>
      </header>

      {/* ── Two Column Layout ─────────────────────────────────────────────
          Left  → FaceDetector (camera + mood detection + emotion bars)
          Right → MusicPlayer (songs based on mood)
      ─────────────────────────────────────────────────────────────────── */}
      <main className="app-main app-columns">

        {/* LEFT: FaceDetector
            We pass handleMoodChange as the onMoodChange prop
            Every time mood changes, FaceDetector will call this function */}
        <section className="app-col">
          <FaceDetector onMoodChange={handleMoodChange} />
        </section>

        {/* RIGHT: MusicPlayer
            We pass currentMood as a prop
            MusicPlayer will re-render every time currentMood changes */}
        <section className="app-col">
          <MusicPlayer currentMood={currentMood} />
        </section>

      </main>
    </div>
  )
}

export default App