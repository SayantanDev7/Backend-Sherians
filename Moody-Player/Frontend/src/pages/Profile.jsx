import React, { useState } from 'react';
import { signup, login } from '../services/api';
import './Profile.css';

// ─────────────────────────────────────────────────────────────────────────────
// Profile.jsx — Authentication page (Sign Up / Sign In)
//
// Flow:
//   1. New user lands here first (before seeing the main app)
//   2. They can toggle between "Sign Up" and "Sign In" panels
//   3. On success → parent component (main.jsx) switches to <App />
//
// Props:
//   onAuthSuccess — callback fired after successful login or signup
// ─────────────────────────────────────────────────────────────────────────────

const Profile = ({ onAuthSuccess }) => {
  // Controls which panel is visible: 'signup' or 'login'
  const [mode, setMode] = useState('signup');

  // Form field states
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // UI feedback states
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  // ── Reset all fields and errors when switching panels ──────────────────────
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  // ── Handle Sign Up form submission ─────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call POST /auth/signup via api.js
      const data = await signup(username, email, password);

      if (data.success) {
        // Signup succeeded → switch to login so user can sign in
        switchMode('login');
        setError('✅ Account created! Please sign in.');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      // axios puts the backend error message inside err.response.data
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Sign In form submission ─────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call POST /auth/login via api.js
      const data = await login(email, password);

      if (data.success) {
        // Login succeeded → tell parent to show the main app
        onAuthSuccess(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${mode === 'login' ? 'login-mode' : ''}`}>

        {/* ── LEFT PANEL — red gradient with welcome text & toggle button ── */}
        <div className="auth-left">
          <div className="auth-left-content">
            {mode === 'signup' ? (
              <>
                <h2>Welcome Back!</h2>
                <p>Already have an account?<br />Sign in to continue listening.</p>
                {/* Switch to login panel */}
                <button className="auth-switch-btn" onClick={() => switchMode('login')}>
                  SIGN IN
                </button>
              </>
            ) : (
              <>
                <h2>Hello, Friend!</h2>
                <p>Don't have an account yet?<br />Sign up and start your journey.</p>
                {/* Switch to signup panel */}
                <button className="auth-switch-btn" onClick={() => switchMode('signup')}>
                  SIGN UP
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL — white form area ────────────────────────────────── */}
        <div className="auth-right">

          {mode === 'signup' ? (
            /* ─── SIGN UP FORM ─────────────────────────────────────────── */
            <form className="auth-form" onSubmit={handleSignup}>
              <h1>Create Account</h1>

              {/* Error / success message */}
              {error && <p className={`auth-msg ${error.startsWith('✅') ? 'auth-msg--success' : 'auth-msg--error'}`}>{error}</p>}

              {/* Username input */}
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />

              {/* Email input */}
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password input */}
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />

              {/* Submit button */}
              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'SIGN UP'}
              </button>
            </form>
          ) : (
            /* ─── SIGN IN FORM ─────────────────────────────────────────── */
            <form className="auth-form" onSubmit={handleLogin}>
              <h1>Sign In</h1>

              {/* Error / success message */}
              {error && <p className={`auth-msg ${error.startsWith('✅') ? 'auth-msg--success' : 'auth-msg--error'}`}>{error}</p>}

              {/* Email input */}
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password input */}
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Submit button */}
              <button className="auth-submit-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'SIGN IN'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
