// ─────────────────────────────────────────────────────────────────────────────
// FaceDetector.jsx
//
// This component does 4 things:
//   1. Asks for camera permission and shows the webcam feed
//   2. Loads the face-api.js AI models from /public/models/
//   3. Runs face + expression detection every 300ms
//   4. Shows ALL 7 emotion bars + calls onMoodChange to inform the parent (App)
//
// NEW CONCEPT: Props going UP (child → parent via callback)
//   App.jsx passes a function called onMoodChange to this component.
//   When mood changes, we CALL that function to send the mood UP to App.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

// FaceDetector receives one prop: onMoodChange
// onMoodChange is a FUNCTION passed by App.jsx
// When we detect a mood, we call: onMoodChange("happy")
// This updates the state in App, which then passes mood to MusicPlayer
const FaceDetector = ({ onMoodChange }) => {
  const videoRef = useRef(null);  // reference to <video> element
  const canvasRef = useRef(null); // reference to <canvas> element

  const [isModelLoaded, setIsModelLoaded]   = useState(false);
  const [currentMood, setCurrentMood]       = useState("");     // dominant mood name
  const [allExpressions, setAllExpressions] = useState(null);  // { happy: 0.9, sad: 0.05, ... }
  const [isDetecting, setIsDetecting]       = useState(false);

  // ── STEP 1: Load AI Models ───────────────────────────────────────────────
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("❌ Model load failed:", err);
      }
    };
    loadModels();
  }, []);

  // ── STEP 2: Start Webcam ─────────────────────────────────────────────────
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("❌ Webcam error:", err);
      }
    };
    startWebcam();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ── STEP 3: Start Detection ──────────────────────────────────────────────
  const startDetection = () => {
    if (!isModelLoaded) return;
    setIsDetecting(true);

    const interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      // Detect face + expressions
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) {
        setCurrentMood("No face detected 👀");
        setAllExpressions(null);
        // Tell App.jsx no mood is active
        if (onMoodChange) onMoodChange(null);
        return;
      }

      // ── Draw on Canvas ─────────────────────────────────────────────────
      const canvas = canvasRef.current;
      const video  = videoRef.current;
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      faceapi.matchDimensions(canvas, { width: video.videoWidth, height: video.videoHeight });
      const resized = faceapi.resizeResults(detection, { width: video.videoWidth, height: video.videoHeight });
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceLandmarks(canvas, resized);

      // ── Get the Dominant Emotion ───────────────────────────────────────
      const expressions = detection.expressions;

      // Store ALL expressions so we can draw the bars
      setAllExpressions(expressions);

      // Find the one with the highest score
      const dominant = Object.entries(expressions).reduce(
        (max, [emotion, score]) => (score > max.score ? { emotion, score } : max),
        { emotion: "", score: 0 }
      );

      const moodLabel = `${getMoodEmoji(dominant.emotion)} ${dominant.emotion}`;
      setCurrentMood(moodLabel);

      // ── LIFT STATE UP ──────────────────────────────────────────────────
      // Call the parent's callback with just the emotion name string
      // App.jsx will receive "happy" / "sad" / etc. and pass it to MusicPlayer
      if (onMoodChange) onMoodChange(dominant.emotion);

    }, 300);

    window._detectionInterval = interval;
  };

  const stopDetection = () => {
    clearInterval(window._detectionInterval);
    setIsDetecting(false);
    setCurrentMood("");
    setAllExpressions(null);
    if (onMoodChange) onMoodChange(null); // clear mood in App too
    if (canvasRef.current) {
      canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getMoodEmoji = (mood) => ({
    happy: "😄", sad: "😢", angry: "😠",
    fearful: "😨", disgusted: "🤢", surprised: "😲", neutral: "😐",
  }[mood] || "🎭");

  // Color for each emotion bar
  const getEmotionColor = (emotion) => ({
    happy:     "#facc15",
    sad:       "#60a5fa",
    angry:     "#f87171",
    fearful:   "#c084fc",
    disgusted: "#4ade80",
    surprised: "#fb923c",
    neutral:   "#94a3b8",
  }[emotion] || "#a78bfa");

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="face-detector">
      <h2 className="detector-title">🎭 Mood Detector</h2>

      <p className="status-text">
        {isModelLoaded ? "✅ AI Models Ready" : "⏳ Loading AI Models..."}
      </p>

      {/* Webcam + Canvas overlay */}
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
        <canvas ref={canvasRef} className="detection-canvas" />
      </div>

      {/* ── Dominant Mood Badge ────────────────────────────────────────────── */}
      {currentMood && (
        <div className="mood-display">
          <h3>Detected Mood</h3>
          <p className="mood-text">{currentMood}</p>
        </div>
      )}

      {/* ── STEP 1: Emotion Breakdown Bars ────────────────────────────────── */}
      {/* This is new! We show ALL 7 emotions as animated progress bars      */}
      {/* allExpressions is the object: { happy: 0.9, sad: 0.02, ... }       */}
      {allExpressions && (
        <div className="emotion-bars">
          <p className="emotion-bars-title">Expression Breakdown</p>

          {/* Object.entries() turns { happy: 0.9 } into [["happy", 0.9], ...]  */}
          {/* We sort so the highest score is at the top                         */}
          {Object.entries(allExpressions)
            .sort(([, a], [, b]) => b - a) // sort descending by score
            .map(([emotion, score]) => (
              <div key={emotion} className="emotion-bar-row">

                {/* Emotion label on the left */}
                <span className="emotion-bar-label">
                  {getMoodEmoji(emotion)} {emotion}
                </span>

                {/* The bar track (gray background) */}
                <div className="emotion-bar-track">
                  {/* The filled portion — width is the score as a % */}
                  {/* score is 0.0 → 1.0, multiply by 100 to get 0%→100% */}
                  <div
                    className="emotion-bar-fill"
                    style={{
                      width: `${(score * 100).toFixed(1)}%`,
                      backgroundColor: getEmotionColor(emotion),
                    }}
                  />
                </div>

                {/* Percentage on the right */}
                <span className="emotion-bar-pct">
                  {(score * 100).toFixed(1)}%
                </span>

              </div>
            ))}
        </div>
      )}

      {/* Start / Stop buttons */}
      <div className="button-group">
        {!isDetecting ? (
          <button onClick={startDetection} disabled={!isModelLoaded} className="btn btn-start">
            {isModelLoaded ? "🚀 Start Detection" : "⏳ Loading..."}
          </button>
        ) : (
          <button onClick={stopDetection} className="btn btn-stop">
            ⏹ Stop Detection
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceDetector;
