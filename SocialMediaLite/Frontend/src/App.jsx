// ─────────────────────────────────────────────────────────
// App.jsx
//
// ROLE: Root component — sets up routing with react-router-dom.
//       Also wraps everything in AuthProvider so all pages
//       can access the global user state.
//
// ROUTES:
//   /login   → LoginPage   (public)
//   /signup  → SignupPage  (public)
//   /        → FeedPage    (protected — redirect to /login if not logged in)
//
// ProtectedRoute component:
//   - Reads user from AuthContext
//   - If user exists      → render the page
//   - If loading          → show loading spinner (checking cookie on startup)
//   - If no user          → redirect to /login
//
// REACT CONCEPTS YOU WILL USE HERE:
//   BrowserRouter  → enables URL-based routing
//   Routes + Route → match URL to component
//   Navigate       → programmatic redirect
//   Context        → AuthProvider wraps all routes so every page can useAuth()
// ─────────────────────────────────────────────────────────

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage  from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FeedPage   from './pages/FeedPage'

// TODO: import { AuthProvider, useAuth } from './context/AuthContext'

// ── ProtectedRoute ────────────────────────────────────────
// Wraps any route that requires the user to be logged in.
// Uncomment when AuthContext is implemented.
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth()
//   if (loading) return <div className="page-loading">Loading...</div>
//   return user ? children : <Navigate to="/login" />
// }

const App = () => {
  return (
    // TODO: wrap with <AuthProvider> once you implement AuthContext
    // <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected route — wrap with ProtectedRoute once auth is ready */}
          {/* <Route path="/" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} /> */}
          <Route path="/" element={<FeedPage />} />

          {/* Catch-all: redirect any unknown URL to feed */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    // </AuthProvider>
  )
}

export default App