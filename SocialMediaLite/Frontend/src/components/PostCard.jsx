// ─────────────────────────────────────────────────────────
// PostCard.jsx
//
// ROLE: Displays a single post — image, author, captions, delete button.
//       The delete button is only shown if the logged-in user is the author.
//
// PROPS RECEIVED:
//   post     → the post object from the backend:
//              { _id, imageUrl, caption, aiCaption, author: { _id, username }, createdAt }
//   onDelete → callback function from FeedPage to refresh the feed after deletion
//
// FLOW (delete):
//   User clicks delete
//     → DELETE /api/posts/:id  (protected — cookie sent automatically)
//     → Call onDelete() to trigger a fresh GET /api/posts/all in FeedPage
//
// REACT CONCEPTS YOU WILL USE HERE:
//   useAuth → compare logged-in user._id with post.author._id
//             to decide whether to show the delete button
//   props   → post data passed down from FeedPage
// ─────────────────────────────────────────────────────────

import React from 'react'

const PostCard = ({ post, onDelete }) => {
  // TODO: const { user } = useAuth()

  // Check if the logged-in user is the author of this post
  // This controls whether the delete button is shown
  // TODO: const isOwner = user?._id === post.author._id
  const isOwner = true // remove this line once you have real user from context

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return

    // TODO: Call your backend
    // try {
    //   await api.delete(`/posts/${post._id}`)
    //   onDelete() // tell FeedPage to refresh the list
    // } catch (err) {
    //   console.error('Delete failed:', err)
    // }

    console.log('delete post:', post._id)
  }

  return (
    <div className="post-card">

      {/* Post image — URL comes from ImageKit (stored in post.imageUrl) */}
      <img
        className="post-card__image"
        src={post?.imageUrl || 'https://placehold.co/400x400/16161f/7c3aed?text=No+Image'}
        alt="post"
      />

      <div className="post-card__body">

        {/* Author username — populated by .populate('author', 'username email') in backend */}
        <div className="post-card__author">
          By <span>@{post?.author?.username || 'unknown'}</span>
        </div>

        {/* AI Caption — shown only if it exists (aiCaption can be empty string) */}
        {post?.aiCaption && (
          <div className="post-card__ai-caption">
            ✨ {post.aiCaption}
          </div>
        )}

        {/* User's own caption */}
        {post?.caption && (
          <p className="post-card__caption">{post.caption}</p>
        )}

        {/* Footer: likes count + delete button */}
        <div className="post-card__footer">

          <div className="post-card__likes">
            ♡ {post?.likes?.length || 0} likes
          </div>

          {/* Only show delete button if this user owns the post */}
          {isOwner && (
            <button className="btn btn-danger" onClick={handleDelete}>
              🗑 Delete
            </button>
          )}

        </div>

      </div>
    </div>
  )
}

export default PostCard
