// ─────────────────────────────────────────────────────────
// CreatePostModal.jsx
//
// ROLE: The "create post" form in a modal overlay.
//       This component chains 2 API calls:
//
//       STEP 1 — Generate AI Caption
//         User picks an image → clicks "Generate AI Caption"
//         → POST /api/ai/caption  (multipart/form-data, field name = "image")
//         → Backend returns: { caption, imageUrl, fileId }
//         → Show the caption in the UI
//         → Save imageUrl (from ImageKit) in state
//
//       STEP 2 — Publish Post
//         User writes their own caption → clicks "Publish"
//         → POST /api/posts/create  (JSON: { imageUrl, caption, aiCaption })
//         → Backend saves the post to MongoDB
//         → Call onPostCreated() to refresh the feed
//         → Close the modal
//
// PROPS RECEIVED:
//   onClose       → function to close this modal (from FeedPage)
//   onPostCreated → function to refresh the post list (from FeedPage)
//
// REACT CONCEPTS YOU WILL USE HERE:
//   useState  → image file, preview URL, aiCaption, imageUrl, userCaption, loading states
//   FormData  → required to send a file to the backend (multipart/form-data)
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react'

const CreatePostModal = ({ onClose, onPostCreated }) => {

  // The actual File object chosen by the user (sent to the backend)
  const [imageFile, setImageFile] = useState(null)

  // A temporary browser URL for the image preview (created with URL.createObjectURL)
  const [previewUrl, setPreviewUrl] = useState('')

  // The AI-generated caption returned from /api/ai/caption
  const [aiCaption, setAiCaption] = useState('')

  // The ImageKit CDN URL returned from /api/ai/caption — this is what gets saved to the DB
  const [imageUrl, setImageUrl] = useState('')

  // The user's own caption typed into the textarea
  const [caption, setCaption] = useState('')

  // Loading states for each async step
  const [loadingAI, setLoadingAI]       = useState(false)
  const [loadingPublish, setLoadingPublish] = useState(false)
  const [error, setError] = useState('')

  // ── When user picks a file ──────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file) // save the File object for API upload

    // Create a local preview URL so we can show the image before uploading
    setPreviewUrl(URL.createObjectURL(file))

    // Reset previous AI results when a new image is selected
    setAiCaption('')
    setImageUrl('')
    setError('')
  }

  // ── Remove chosen image ─────────────────────────────────
  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl('')
    setAiCaption('')
    setImageUrl('')
  }

  // ── STEP 1: Generate AI Caption ─────────────────────────
  const handleGenerateCaption = async () => {
    if (!imageFile) return
    setLoadingAI(true)
    setError('')

    // TODO: Send the image to your backend
    // FormData is needed because we are uploading a file (multipart/form-data)
    // try {
    //   const formData = new FormData()
    //   formData.append('image', imageFile)  // field name must match multer: upload.single('image')
    //
    //   const res = await api.post('/ai/caption', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' },
    //   })
    //
    //   setAiCaption(res.data.caption)  // AI-generated text
    //   setImageUrl(res.data.imageUrl)  // ImageKit CDN URL — used when publishing
    // } catch (err) {
    //   setError('Failed to generate caption. Try again.')
    // } finally {
    //   setLoadingAI(false)
    // }

    // PLACEHOLDER — remove when you implement the TODO above
    setAiCaption('A beautiful moment captured in time ✨ #photography #vibes')
    setImageUrl('https://placehold.co/600x600')
    setLoadingAI(false)
  }

  // ── STEP 2: Publish Post ────────────────────────────────
  const handlePublish = async () => {
    if (!imageUrl) return // can't publish without uploading to ImageKit first
    setLoadingPublish(true)
    setError('')

    // TODO: Create the post in the backend
    // try {
    //   await api.post('/posts/create', {
    //     imageUrl,     // from ImageKit (returned by /ai/caption)
    //     caption,      // user's own caption
    //     aiCaption,    // AI-generated caption
    //   })
    //   onPostCreated()  // tell FeedPage to refresh the list
    //   onClose()        // close this modal
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Failed to publish post')
    // } finally {
    //   setLoadingPublish(false)
    // }

    console.log('publishing with:', { imageUrl, caption, aiCaption })
    setLoadingPublish(false)
    onClose()
  }

  return (
    // Backdrop — clicking it closes the modal
    <div className="modal-backdrop" onClick={onClose}>

      {/* Modal box — stop click from bubbling to backdrop */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title">Create Post</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Error message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Image selection ───────────────────────── */}
        {!previewUrl ? (
          // Drop zone shown when no image is selected yet
          <label className="upload-zone">
            <span className="upload-zone__icon">🖼</span>
            <span className="upload-zone__text">
              <strong>Click to choose an image</strong>
            </span>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </label>
        ) : (
          // Preview shown after image is selected
          <div className="upload-preview">
            <img src={previewUrl} alt="preview" />
            <button className="upload-preview__remove" onClick={handleRemoveImage}>✕</button>
          </div>
        )}

        {/* ── AI Caption button (Step 1) ─────────────── */}
        <button
          className="btn btn-primary btn-full"
          onClick={handleGenerateCaption}
          disabled={!imageFile || loadingAI}
          style={{ marginBottom: '0.75rem' }}
        >
          {loadingAI ? <span className="spinner" /> : '✨'}
          {loadingAI ? ' Generating caption...' : ' Generate AI Caption'}
        </button>

        {/* AI caption result — shown after step 1 completes */}
        {aiCaption && (
          <div className="ai-result">
            <span className="ai-result__label">✨ AI Caption</span>
            {aiCaption}
          </div>
        )}

        {/* ── User's own caption ─────────────────────── */}
        <div className="form-group">
          <label>Your Caption</label>
          <textarea
            className="form-input"
            placeholder="Write your own caption (optional)..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={300}
          />
        </div>

        {/* ── Publish button (Step 2) ────────────────── */}
        {/* Only enabled after AI caption is generated (which also uploads to ImageKit) */}
        <div className="modal__actions">
          <button
            className="btn btn-primary btn-full"
            onClick={handlePublish}
            disabled={!imageUrl || loadingPublish}
          >
            {loadingPublish ? <span className="spinner" /> : null}
            {loadingPublish ? ' Publishing...' : 'Publish Post'}
          </button>

          <button className="btn btn-ghost btn-full" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreatePostModal
