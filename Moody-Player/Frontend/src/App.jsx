import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import FaceDetector from './components/FaceDetector'
import MusicPlayer  from './components/MusicPlayer'
import { getSongsByMood } from './services/api'

// ── Greeting helper ──────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

// ── Mood description helper ──────────────────────────────────────────────────
const moodDesc = {
  happy:     "Great! Let's play some feel-good tracks for you.",
  sad:       "It's okay to feel low. Here's some comfort music.",
  angry:     "Channel that energy — here's something intense.",
  fearful:   "Take a breath. Let the music calm you down.",
  disgusted: "Something different to shift that feeling.",
  surprised: "Whoa! Let's match that energy right now.",
  neutral:   "Feeling balanced? Here's some smooth listening.",
}

// ── Mood emoji ───────────────────────────────────────────────────────────────
const moodEmoji = {
  happy:"😄", sad:"😢", angry:"😠", fearful:"😨",
  disgusted:"🤢", surprised:"😲", neutral:"😐"
}

const App = () => {
  const [currentMood, setCurrentMood] = useState(null)
  const [allExpressions, setAllExpressions] = useState(null)

  // Songs fetched from the backend
  const [songs, setSongs]       = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Which song is "playing" in the right panel + bottom bar
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [liked, setLiked]               = useState(false)
  const [progress, setProgress]         = useState(0)

  // Real audio element ref for playback
  const audioRef = useRef(null)

  // ── Fetch songs from backend when mood changes ────────────────────────────
  useEffect(() => {
    if (!currentMood) {
      setSongs([])
      return
    }
    const fetchSongs = async () => {
      setIsLoading(true)
      try {
        const data = await getSongsByMood(currentMood)
        setSongs(data)
        setCurrentIndex(0)   // reset to first song on mood change
        setIsPlaying(false)
      } catch (err) {
        console.error('Failed to fetch songs:', err.message)
        setSongs([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchSongs()
  }, [currentMood])

  // ── Control HTML audio element when song or play state changes ────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const currentSong = songs[currentIndex]
    if (!currentSong?.audio) return

    // If the src changed, load the new song
    if (audio.src !== currentSong.audio) {
      audio.src = currentSong.audio
      audio.load()
    }

    if (isPlaying) {
      audio.play().catch(e => console.error('Playback error:', e))
    } else {
      audio.pause()
    }
  }, [isPlaying, currentIndex, songs])

  // Called by FaceDetector whenever mood changes
  const handleMoodChange = (mood, expressions) => {
    setCurrentMood(mood)
    setAllExpressions(expressions || null)
    if (mood) {
      setCurrentIndex(0)
      setIsPlaying(false)
    }
  }

  // Called every 300ms during sampling for live expression bars
  // Does NOT change currentMood or fetch songs — only updates the bars
  const handleExpressionsUpdate = (expressions) => {
    setAllExpressions(expressions || null)
  }

  const currentSong = songs[currentIndex]

  const nextSong = () => {
    setCurrentIndex(i => (i + 1) % songs.length)
    setIsPlaying(true) // auto-play next
  }
  const prevSong = () => {
    setCurrentIndex(i => (i - 1 + songs.length) % songs.length)
    setIsPlaying(true) // auto-play prev
  }
  const togglePlay = () => setIsPlaying(p => !p)

  // Emotion color map
  const emotionColor = {
    happy:"#4ade80", sad:"#60a5fa", angry:"#f87171",
    fearful:"#c084fc", disgusted:"#4ade80", surprised:"#fb923c", neutral:"#94a3b8"
  }

  return (
    <div className="app-shell">

      {/* Hidden audio element — controlled via audioRef */}
      <audio ref={audioRef} onEnded={nextSong} />

      {/* ════════════════════════════════════════════════════════
          LEFT SIDEBAR
      ════════════════════════════════════════════════════════ */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <div className="logo-bar" />
            <div className="logo-bar" />
            <div className="logo-bar" />
            <div className="logo-bar" />
          </div>
          <span className="logo-text">Moody <span>Player</span></span>
        </div>

        {/* Nav */}
        <button className="nav-item active">
          <span className="nav-icon"></span> Home
        </button>
        <button className="nav-item">
          <span className="nav-icon">🎵</span> My Library
        </button>
        <button className="nav-item">
          <span className="nav-icon">❤️</span> Favorites
        </button>
        <button className="nav-item">
          <span className="nav-icon">👤</span> Profile
        </button>
        

        <div className="sidebar-spacer" />

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <div className="user-name">You</div>
            <div className="user-plan">Free plan</div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════════ */}
      <main className="main-content">

        {/* Page header */}
        <div className="page-header">
          <div>
            <h1>{getGreeting()} 👋</h1>
            <p>Let's match your mood with music</p>
          </div>
          <button className="how-it-works-btn">ℹ️ How it works?</button>
        </div>

        {/* ── Mood Detection Card ── */}
        <div className="mood-card">

          {/* Circular cam zone — FaceDetector provides the video/canvas refs
              but the styling is fully controlled here now */}
          <div className="cam-zone">
            <FaceDetector
              onMoodChange={handleMoodChange}
              onExpressionsUpdate={handleExpressionsUpdate}
            />
          </div>

          {/* Mood info on the right side of the card */}
          <div className="mood-info">
            {currentMood ? (
              <>
                <span className="mood-info-label">Your current mood</span>

                {/* Big mood name — class changes per mood for color */}
                <div className={`mood-name-big ${currentMood}`}>
                  {currentMood} {moodEmoji[currentMood]}
                </div>

                <p className="mood-desc">
                  {moodDesc[currentMood] || "Music matched to your mood."}
                </p>

                {/* Animated waveform — only shows when detecting */}
                <div className={`waveform ${isPlaying ? "" : "paused"}`}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="wave-bar" />
                  ))}
                </div>

                {/* Mini emotion bars */}
                {allExpressions && (
                  <div className="emotion-bars-mini">
                    {Object.entries(allExpressions)
                      .sort(([,a],[,b]) => b - a)
                      .slice(0, 4) // show top 4 only to keep it clean
                      .map(([emotion, score]) => (
                        <div key={emotion} className="ebar-row">
                          <span className="ebar-label">{emotion}</span>
                          <div className="ebar-track">
                            <div
                              className="ebar-fill"
                              style={{
                                width: `${(score * 100).toFixed(0)}%`,
                                backgroundColor: emotionColor[emotion] || "#a78bfa"
                              }}
                            />
                          </div>
                          <span className="ebar-pct">{(score * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              // No mood yet — waiting state
              <div className="empty-mood-state">
                <span className="mood-info-label">Your current mood</span>
                <div className="empty-mood-name">Start the camera to<br/>Detect expression</div>
                <p className="empty-mood-desc">
                  Allow camera access and click Start Camera. We'll read your mood in seconds.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Recommended Songs ── */}
        <div>
          <div className="section-header">
            <span className="section-title">
              Recommended for your mood ✨
            </span>
            <button className="see-all">See all</button>
          </div>

          {isLoading ? (
            <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
              🎵 Loading songs for your mood...
            </p>
          ) : songs.length > 0 ? (
            <div className="song-cards-row">
              {songs.map((song, idx) => (
                <div
                  key={song._id}
                  className={`song-card ${currentIndex === idx ? 'active' : ''}`}
                  onClick={() => { setCurrentIndex(idx); setIsPlaying(true) }}
                >
                  <div className="song-card-art">
                    {/* DB songs don't have cover art yet — use emoji fallback */}
                    🎵
                    <div className="play-overlay">
                      <button className="play-overlay-btn">
                        {currentIndex === idx && isPlaying ? '⏸' : '▶'}
                      </button>
                    </div>
                  </div>
                  <p className="song-card-title">{song.title}</p>
                  <div className="song-card-artist">
                    <span>{song.artist}</span>
                    <button className="heart-btn">♡</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>
              {currentMood
                ? `No songs found for "${currentMood}" mood.`
                : "Start face detection to get song recommendations."}
            </p>
          )}
        </div>

      </main>

      {/* ════════════════════════════════════════════════════════
          RIGHT PANEL — NOW PLAYING
      ════════════════════════════════════════════════════════ */}
      <aside className="right-panel">
        <div className="rp-header">
          <span>Now Playing</span>
          <button className="rp-dots">···</button>
        </div>

        {/* Album art */}
        <div className="rp-art">
          {currentSong ? currentSong.cover : "🎵"}
        </div>

        {/* Song meta */}
        <div className="rp-song-meta">
          <div>
            <div className="rp-song-title">
              {currentSong ? currentSong.title : "No song selected"}
            </div>
            <div className="rp-song-artist">
              {currentSong ? currentSong.artist : "Start detection to begin"}
            </div>
          </div>
          <button
            className="rp-heart"
            onClick={() => setLiked(l => !l)}
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Progress */}
        <div className="rp-progress">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: currentSong ? `${progress}%` : "0%" }}
            />
          </div>
          <div className="progress-times">
            <span>1:23</span>
            <span>{currentSong ? currentSong.duration : "0:00"}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="rp-controls">
          <button className="rp-ctrl-btn">⇄</button>
          <button className="rp-ctrl-btn" onClick={prevSong}>⏮</button>
          <button className="rp-play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="rp-ctrl-btn" onClick={nextSong}>⏭</button>
          <button className="rp-ctrl-btn">↺</button>
        </div>

        {/* Up Next */}
        <div className="up-next">
          <p className="up-next-title">Up Next</p>
          {songs.slice(0, 3).map((song, idx) => (
            <div
              key={song.id}
              className="up-next-item"
              onClick={() => { setCurrentIndex(idx); setIsPlaying(true) }}
            >
              <div className="up-next-art">{song.cover}</div>
              <div className="up-next-info">
                <div className="up-next-name">{song.title}</div>
                <div className="up-next-artist">{song.artist}</div>
              </div>
              <span className="up-next-drag">⋮⋮</span>
            </div>
          ))}

          {!currentSong && (
            <p style={{ color: "var(--text3)", fontSize: "0.78rem", padding: "0.5rem 0" }}>
              No songs queued yet
            </p>
          )}

          <button className="add-queue-btn">+ Add to queue</button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          BOTTOM PLAYBAR  (fixed across all columns)
      ════════════════════════════════════════════════════════ */}
      <div className="bottom-bar">
        {/* Left: current song info */}
        <div className="bb-song">
          <div className="bb-art">{currentSong ? currentSong.cover : "🎵"}</div>
          <div className="bb-info">
            <div className="bb-title">{currentSong ? currentSong.title : "—"}</div>
            <div className="bb-artist">{currentSong ? currentSong.artist : "No song playing"}</div>
          </div>
          <button className="bb-heart">❤️</button>
        </div>

        {/* Center: controls */}
        <div className="bb-controls">
          <button className="bb-ctrl">⇄</button>
          <button className="bb-ctrl" onClick={prevSong}>⏮</button>
          <button className="bb-play" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="bb-ctrl" onClick={nextSong}>⏭</button>
          <button className="bb-ctrl">↺</button>
        </div>

        {/* Right: volume */}
        <div className="bb-right">
          <span className="bb-vol-icon">🔊</span>
          <input
            type="range"
            min="0" max="100" defaultValue="70"
            className="bb-vol-slider"
          />
          <button className="bb-eq-icon">≡</button>
        </div>
      </div>

    </div>
  )
}

export default App