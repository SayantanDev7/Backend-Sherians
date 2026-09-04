// ─────────────────────────────────────────────────────────
// SignupPage.jsx
//
// ROLE: Registration form. Identical structure to LoginPage
//       but with an extra "username" field.
//
// FLOW:
//   User fills username + email + password
//     → handleSubmit() fires
//     → POST /api/auth/signup  { username, email, password }
//     → On success → navigate to /login  (user must log in after signup)
//     → On error   → show error message
//
// REACT CONCEPTS YOU WILL USE HERE:
//   useState   → form fields + error + loading
//   useNavigate → redirect to /login after success
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignupPage = () => {
  // TODO: const navigate = useNavigate()

  // useState: all three fields in one object
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // TODO: Call your backend
    // try {
    //   await api.post('/auth/signup', form)
    //   setSuccess('Account created! Redirecting to login...')
    //   setTimeout(() => navigate('/login'), 1500)
    // } catch (err) {
    //   setError(err.response?.data?.message || 'Signup failed')
    // } finally {
    //   setLoading(false)
    // }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-card__logo">SnapLite</div>
        <p className="auth-card__sub">Create your account</p>

        {/* Show error or success alert based on state */}
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="yourname"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

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

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

      </div>
    </div>
  )
}

export default SignupPage
