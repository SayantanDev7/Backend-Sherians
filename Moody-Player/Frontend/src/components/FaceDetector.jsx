// ─────────────────────────────────────────────────────────────────────────────
// FaceDetector.jsx
//
// CORRECT FLOW (fixed):
//   1. On mount → only load AI models (no camera auto-start)
//   2. User clicks "Start Camera" → ask for permission → start stream → start detection
//   3. User clicks "Stop Camera"  → stop detection loop → stop video tracks → show placeholder
//
// PROPS:
//   onMoodChange(mood, expressions) → callback to lift state up to App.jsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const FaceDetector = ({ onMoodChange }) => {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting,   setIsDetecting]   = useState(false);
  const [statusText,    setStatusText]    = useState("Loading AI models...");

  // null = not yet started, true = camera on, false = denied or stopped
  const [cameraGranted, setCameraGranted] = useState(null);

  // ── STEP 1: Load AI Models (runs once on mount — no camera yet) ───────────
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

    // Cleanup on unmount: stop camera if it was running
    return () => stopCameraStream();
  }, []);

  // ── Helper: stop the actual camera stream ─────────────────────────────────
  // Called both from stopDetection() and cleanup on unmount
  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      // getTracks() gives all video/audio tracks — we stop every one
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null; // clear the reference
    }
  };

  // ── STEP 2: Start Camera + Detection (triggered by button click) ──────────
  const startDetection = async () => {
    if (!isModelLoaded) return;

    // Ask browser for camera permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Attach stream to <video> element so it starts showing feed
      if (videoRef.current) videoRef.current.srcObject = stream;

      setCameraGranted(true);  // show video, hide placeholder
      setIsDetecting(true);
      setStatusText("Reading your mood...");
    } catch (e) {
      // User denied camera OR no camera found
      setCameraGranted(false);
      setStatusText("Camera access denied ❌");
      return; // stop here — don't start detection
    }

    // Run expression detection every 300ms
    const interval = setInterval(async () => {
      // readyState 4 = HAVE_ENOUGH_DATA — video is fully playing
      if (!videoRef.current || videoRef.current.readyState !== 4) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (!detection) {
        setStatusText("No face detected 👀");
        onMoodChange?.(null, null);
        return;
      }

      // Draw face box + landmark dots on the canvas overlay
      const cv  = canvasRef.current;
      const vid = videoRef.current;
      cv.width  = vid.videoWidth;
      cv.height = vid.videoHeight;
      faceapi.matchDimensions(cv, { width: vid.videoWidth, height: vid.videoHeight });
      const resized = faceapi.resizeResults(detection, { width: vid.videoWidth, height: vid.videoHeight });
      cv.getContext("2d").clearRect(0, 0, cv.width, cv.height);
      faceapi.draw.drawDetections(cv, resized);
      faceapi.draw.drawFaceLandmarks(cv, resized);

      // Find the emotion with the highest confidence score
      const expressions = detection.expressions;
      const dominant = Object.entries(expressions).reduce(
        (max, [e, s]) => s > max.score ? { emotion: e, score: s } : max,
        { emotion: "", score: 0 }
      );

      setStatusText(`Mood: ${dominant.emotion}`);

      // Send mood + full expressions object up to App.jsx via prop callback
      onMoodChange?.(dominant.emotion, expressions);

    }, 300);

    // Store interval ID on window so stopDetection can clear it
    window._detectionInterval = interval;
  };

  // ── STEP 3: Stop Camera + Detection (triggered by button click) ───────────
  const stopDetection = () => {
    // 1. Stop the detection loop
    clearInterval(window._detectionInterval);

    // 2. Stop the actual camera stream (this turns off the camera light)
    stopCameraStream();

    // 3. Clear the canvas drawing
    if (canvasRef.current) {
      canvasRef.current.getContext("2d")
        .clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    // 4. Reset all state — show placeholder again
    setIsDetecting(false);
    setCameraGranted(null);   // back to "not yet started" → shows placeholder
    setStatusText("Click Start Camera to begin");
    onMoodChange?.(null, null); // clear mood in App.jsx
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>

      {/* ── Circular Camera Ring ── */}
      <div className="cam-ring">
        <div className="cam-inner">

          {/* User silhouette placeholder — shown when camera is off or not yet started */}
          {!cameraGranted && (
            <div className="cam-placeholder">
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="cam-placeholder-svg"
              >
                {/* Head circle */}
                <circle cx="50" cy="34" r="21" fill="#3a3a52" />
                {/* Shoulders / body */}
                <path d="M8 95 Q8 62 50 62 Q92 62 92 95 Z" fill="#3a3a52" />
              </svg>
            </div>
          )}

          {/* Video element — always in DOM so ref works.
              Invisible when camera is off (opacity: 0) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ opacity: cameraGranted ? 1 : 0 }}
          />

          {/* Canvas overlaid on video for face boxes + landmarks */}
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Status text */}
      <p className={`cam-status ${isModelLoaded ? "ready" : ""}`}>
        {statusText}
      </p>

      {/* Start / Stop button — switches based on isDetecting state */}
      {!isDetecting ? (
        <button
          className="cam-btn start"
          onClick={startDetection}
          disabled={!isModelLoaded}
        >
          📷 {isModelLoaded ? "Start Camera" : "Loading models..."}
        </button>
      ) : (
        <button className="cam-btn stop" onClick={stopDetection}>
          ⏹ Stop Camera
        </button>
      )}
    </div>
  );
};

export default FaceDetector;
