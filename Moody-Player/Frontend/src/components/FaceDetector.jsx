// ─────────────────────────────────────────────────────────────────────────────
// FaceDetector.jsx
//
// MOOD LOCKING FLOW:
//   1. User clicks "Start Camera" → camera opens, 5-second sampling begins
//   2. Every 300ms, the dominant emotion is added to a votes array
//   3. After 5 seconds → pick the most voted emotion → LOCK the mood
//   4. onMoodChange() is called ONCE with the locked mood → songs fetch
//   5. Camera stays on so the face box is visible, but mood no longer changes
//   6. "Re-detect Mood" button resets everything and starts over
//
// PROPS:
//   onMoodChange(mood, expressions)   → called once when mood is locked
//   onExpressionsUpdate(expressions)  → called every 300ms for live bars
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const LOCK_AFTER_MS  = 5000; // sample for 5 seconds before locking
const DETECT_INTERVAL = 300; // run detection every 300ms

const FaceDetector = ({ onMoodChange, onExpressionsUpdate }) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting,   setIsDetecting]   = useState(false);
  const [isMoodLocked,  setIsMoodLocked]  = useState(false);
  const [statusText,    setStatusText]    = useState("Loading AI models...");
  const [countdown,     setCountdown]     = useState(null); // seconds left
  const [cameraGranted, setCameraGranted] = useState(null);

  // Refs for mutable values that shouldn't cause re-renders
  const moodVotes     = useRef({});   // { happy: 4, sad: 1, ... }
  const lockTimerRef  = useRef(null);
  const intervalRef   = useRef(null);
  const countdownRef  = useRef(null);

  // ── STEP 1: Load AI Models ────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setIsModelLoaded(true);
        setStatusText("Click Start Camera to begin");
      } catch (e) {
        console.error("Model load failed:", e);
        setStatusText("Model load failed ❌");
      }
    };
    load();
    return () => stopCameraStream();
  }, []);

  // ── Helper: stop the actual camera stream ─────────────────────────────────
  const stopCameraStream = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  // ── Helper: clear all timers ──────────────────────────────────────────────
  const clearAllTimers = () => {
    clearInterval(intervalRef.current);
    clearTimeout(lockTimerRef.current);
    clearInterval(countdownRef.current);
  };

  // ── STEP 2: Start Camera + 5-second mood sampling ─────────────────────────
  const startDetection = async () => {
    if (!isModelLoaded) return;

    // Ask for camera permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraGranted(true);
    } catch (e) {
      setCameraGranted(false);
      setStatusText("Camera access denied ❌");
      return;
    }

    // Reset state for a fresh scan
    moodVotes.current = {};
    setIsDetecting(true);
    setIsMoodLocked(false);
    setCountdown(Math.ceil(LOCK_AFTER_MS / 1000));

    // Countdown display timer (ticks every second)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    // Detection loop — samples mood every 300ms
    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) {
        setStatusText("No face detected 👀");
        return;
      }

      // Draw face box + landmarks on canvas
      const cv  = canvasRef.current;
      const vid = videoRef.current;
      cv.width  = vid.videoWidth;
      cv.height = vid.videoHeight;
      faceapi.matchDimensions(cv, { width: vid.videoWidth, height: vid.videoHeight });
      const resized = faceapi.resizeResults(detection, { width: vid.videoWidth, height: vid.videoHeight });
      cv.getContext("2d").clearRect(0, 0, cv.width, cv.height);
      faceapi.draw.drawDetections(cv, resized);
      faceapi.draw.drawFaceLandmarks(cv, resized);

      const expressions = detection.expressions;

      // Find dominant emotion for this sample
      const dominant = Object.entries(expressions).reduce(
        (max, [e, s]) => s > max.score ? { emotion: e, score: s } : max,
        { emotion: "", score: 0 }
      );

      // Add vote for this emotion
      moodVotes.current[dominant.emotion] = (moodVotes.current[dominant.emotion] || 0) + 1;

      // Send live expressions to App.jsx for the animated bars (no mood lock yet)
      onExpressionsUpdate?.(expressions);

      setStatusText(`Analyzing your mood... 🔍`);

    }, DETECT_INTERVAL);

    // ── After LOCK_AFTER_MS: pick winner and lock mood ──────────────────────
    lockTimerRef.current = setTimeout(() => {
      clearInterval(intervalRef.current); // stop the sampling loop

      const votes = moodVotes.current;
      const lockedMood = Object.entries(votes).reduce(
        (winner, [emotion, count]) => count > winner.count
          ? { emotion, count }
          : winner,
        { emotion: "neutral", count: 0 }
      ).emotion;

      setIsMoodLocked(true);
      setIsDetecting(false);
      setCountdown(null);
      setStatusText(`Mood locked: ${lockedMood} 🔒`);

      // Tell App.jsx the final locked mood — this triggers song fetch
      onMoodChange?.(lockedMood, null);

    }, LOCK_AFTER_MS);
  };

  // ── Stop Camera completely ─────────────────────────────────────────────────
  const stopCamera = () => {
    clearAllTimers();
    stopCameraStream();

    if (canvasRef.current) {
      canvasRef.current.getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setIsDetecting(false);
    setIsMoodLocked(false);
    setCameraGranted(null);
    setCountdown(null);
    setStatusText("Click Start Camera to begin");
    onMoodChange?.(null, null);
    onExpressionsUpdate?.(null);
  };

  // ── Re-detect: keep camera on, restart the 5-second sampling ─────────────
  const reDetect = () => {
    clearAllTimers();
    if (canvasRef.current) {
      canvasRef.current.getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    moodVotes.current = {};
    setIsMoodLocked(false);
    onMoodChange?.(null, null);    // clear songs while re-detecting
    onExpressionsUpdate?.(null);
    startDetection();              // restart the whole flow
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>

      {/* ── Circular Camera Ring ── */}
      <div className="cam-ring">
        <div className="cam-inner">

          {/* Placeholder when camera is off */}
          {!cameraGranted && (
            <div className="cam-placeholder">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="cam-placeholder-svg">
                <circle cx="50" cy="34" r="21" fill="#3a3a52" />
                <path d="M8 95 Q8 62 50 62 Q92 62 92 95 Z" fill="#3a3a52" />
              </svg>
            </div>
          )}

          {/* Countdown ring overlay during sampling */}
          {isDetecting && countdown !== null && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                background: "rgba(0,0,0,0.55)", borderRadius: "50%",
                width: "56px", height: "56px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.6rem", fontWeight: 800, color: "#a78bfa",
              }}>
                {countdown}
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ opacity: cameraGranted ? 1 : 0 }}
          />
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Status text */}
      <p className={`cam-status ${isModelLoaded ? "ready" : ""}`}>
        {statusText}
      </p>

      {/* Button logic:
          - Not started → "Start Camera"
          - Detecting (sampling) → no button (countdown is showing)
          - Mood locked → "Re-detect Mood" + "Stop Camera"
          - Camera granted but not locked/detecting → "Stop Camera" */}
      {!cameraGranted && !isDetecting && (
        <button
          className="cam-btn start"
          onClick={startDetection}
          disabled={!isModelLoaded}
        >
          📷 {isModelLoaded ? "Start Camera" : "Loading models..."}
        </button>
      )}

      {isMoodLocked && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="cam-btn start" onClick={reDetect}>
            🔄 Re-detect Mood
          </button>
          <button className="cam-btn stop" onClick={stopCamera}>
            ⏹ Stop
          </button>
        </div>
      )}

      {isDetecting && (
        <button className="cam-btn stop" onClick={stopCamera}>
          ✕ Cancel
        </button>
      )}
    </div>
  );
};

export default FaceDetector;
