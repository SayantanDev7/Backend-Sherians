// ─────────────────────────────────────────────────────────
// Navbar.jsx
//
// ROLE: Top navigation bar. Visible on every protected page.
//       Shows the app logo, logged-in username, and logout button.
//
// FLOW:
//   - Reads the current user from AuthContext (useAuth hook)
//   - Logout button clears the user from context and redirects to /login
//     (Note: the httpOnly cookie expires naturally on browser close /
//      or you can add a POST /auth/logout route on the backend later)
//
// PROPS RECEIVED: none (reads user from context directly)
//
// REACT CONCEPTS YOU WILL USE HERE:
//   useAuth    → get user + setUser from global context
//   useNavigate → redirect to /login after logout
// ─────────────────────────────────────────────────────────

import React from 'react'

const Navbar = ({ onCreatePost }) => {
  // TODO: const { user, setUser } = useAuth()
  // TODO: const navigate = useNavigate()

  // Logout: clear user from context → navigate to /login
  const handleLogout = () => {
    // TODO: setUser(null)
    // TODO: navigate('/login')
    // Optional: await api.post('/auth/logout') if you add that route
    console.log('logout clicked')
  }

  return (
    <nav className="navbar">

      {/* Left: App logo */}
      <div className="navbar__logo">SnapLite</div>

      {/* Right: username + logout */}
      <div className="navbar__right">

        {/* Show the logged-in username — comes from AuthContext */}
        <span className="navbar__username">
          {/* TODO: @{user?.username} */}
          @username
        </span>

        {/* "New Post" button → opens CreatePostModal */}
        <button className="btn btn-primary" onClick={onCreatePost}>
          + New Post
        </button>

        {/* Logout button */}
        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </nav>
  )
}

export default Navbar
