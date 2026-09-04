// ─────────────────────────────────────────────────────────
// LoginPage.jsx
//
// ROLE: Shows the login form. Sends credentials to the backend.
//
// FLOW:
//   User fills email + password
//     → handleSubmit() fires on form submit
//     → POST /api/auth/login  { email, password }
//     → Backend sets a JWT cookie in the browser automatically
//     → Save the returned user to AuthContext (setUser)
//     → Navigate to "/" (FeedPage)
//
// REACT CONCEPTS YOU WILL USE HERE:
//   useState   → track form fields (email, password) and error message
//   useNavigate → redirect to feed after login
//   useAuth    → get setUser from AuthContext to store the logged-in user
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  // TODO: const { setUser } = useAuth()
  // TODO: const navigate = useNavigate()

  // useState: track what the user types in the form
  const [form, setForm] = useState({ email: '', password: '' })

  // useState: store any error message from the backend
  const [error, setError] = useState('')

  // useState: disable the button while the API call is running
  const [loading, setLoading] = useState(false)

  // Called when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault() // prevent page refresh
    setError('')
    setLoading(true)

    // TODO: Call your backend
    // try {
    //   const res = await api.post('/auth/login', form)
    //   setUser(res.data.user)
    //   navigate('/')
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Login failed')
    // } finally {
    //   setLoading(false)
    // }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-card__logo">SnapLite</div>
        <p className="auth-card__sub">Sign in to your account</p>

        {/* Error alert — only shown when error state has a value */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Email field */}
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              // onChange updates only the email key, keeps other keys the same
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Submit button — shows spinner while loading */}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Link to SignupPage */}
        <div className="auth-card__footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
