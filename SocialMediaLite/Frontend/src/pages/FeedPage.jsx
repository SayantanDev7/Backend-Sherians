// ─────────────────────────────────────────────────────────
// FeedPage.jsx
//
// ROLE: The main page after login. Fetches and displays all posts.
//       Also controls whether the CreatePostModal is open or closed.
//
// FLOW:
//   Component mounts
//     → useEffect fires immediately (runs once on mount)
//     → GET /api/posts/all  (no auth required)
//     → Saves posts array to state
//     → Renders a PostCard for each post
//
//   User clicks "New Post"
//     → showModal becomes true
//     → CreatePostModal appears
//
//   After post is published (onPostCreated callback)
//     → fetchPosts() runs again to refresh the list
//
// REACT CONCEPTS YOU WILL USE HERE:
//   useState  → posts array, showModal boolean
//   useEffect → fetch posts when the component first renders
//   .map()    → render one PostCard per post
//   Props     → pass onDelete / onPostCreated callbacks down to children
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'

// SAMPLE DATA — remove this once you connect to the real backend
const SAMPLE_POSTS = [
  {
    _id: '1',
    imageUrl: 'https://placehold.co/400x400/16161f/7c3aed?text=Post+1',
    caption: 'My first post on SnapLite!',
    aiCaption: 'A stunning visual moment worth sharing ✨ #photography',
    author: { _id: 'user1', username: 'alice' },
    likes: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    imageUrl: 'https://placehold.co/400x400/16161f/a78bfa?text=Post+2',
    caption: 'Golden hour vibes.',
    aiCaption: 'Bathed in warm golden light as the sun sets on the horizon 🌅 #sunset #golden',
    author: { _id: 'user2', username: 'bob' },
    likes: ['user1'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    imageUrl: 'https://placehold.co/400x400/16161f/6d28d9?text=Post+3',
    caption: '',
    aiCaption: 'Nature in its purest form 🌿 #nature #peace',
    author: { _id: 'user1', username: 'alice' },
    likes: [],
    createdAt: new Date().toISOString(),
  },
]

const FeedPage = () => {
  // posts: array of post objects fetched from backend
  const [posts, setPosts] = useState(SAMPLE_POSTS) // TODO: change to useState([])

  // loading: true while waiting for the API response
  const [loading, setLoading] = useState(false)

  // showModal: controls whether CreatePostModal is visible
  const [showModal, setShowModal] = useState(false)

  // ── Fetch all posts from backend ──────────────────────
  const fetchPosts = async () => {
    setLoading(true)

    // TODO: Call your backend
    // try {
    //   const res = await api.get('/posts/all')
    //   setPosts(res.data.posts)  // backend returns { posts: [...] }
    // } catch (err) {
    //   console.error('Failed to fetch posts:', err)
    // } finally {
    //   setLoading(false)
    // }

    setLoading(false)
  }

  // useEffect runs once when the component first mounts ([] = no dependencies)
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div>

      {/* Navbar at the top — passes handler to open the modal */}
      <Navbar onCreatePost={() => setShowModal(true)} />

      <div className="feed-page">

        <div className="feed-page__header">
          <h1 className="feed-page__title">Feed</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {posts.length} posts
          </span>
        </div>

        {/* Post grid */}
        {loading ? (
          <div className="page-loading">
            <span className="spinner" style={{ width: 20, height: 20 }} />
            Loading posts...
          </div>
        ) : (
          <div className="feed-grid">

            {posts.length === 0 ? (
              // Empty state
              <div className="feed-empty">
                <span className="feed-empty__icon">📸</span>
                <p className="feed-empty__text">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              // Render one PostCard per post
              // key must be unique — use post._id from MongoDB
              // onDelete → passed to PostCard so it can trigger a refresh after deletion
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={fetchPosts}
                />
              ))
            )}

          </div>
        )}

      </div>

      {/* CreatePostModal — rendered only when showModal is true */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onPostCreated={() => {
            fetchPosts()        // refresh the feed
            setShowModal(false) // close the modal
          }}
        />
      )}

    </div>
  )
}

export default FeedPage
