import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import './index.css';
import App from './App.jsx';
import Profile from './pages/Profile.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Root.jsx logic lives here in main.jsx for simplicity (no react-router needed)
//
// How it works:
//   - `user` is null  → show the Profile page (login / signup)
//   - `user` has data → show the main App (face detection + music)
//
// `onAuthSuccess` is passed to Profile and called with the user object
// after a successful login. This updates `user` and triggers a re-render
// which unmounts Profile and mounts App.
// ─────────────────────────────────────────────────────────────────────────────

const Root = () => {
  // null = not logged in, object = logged-in user data from backend
  const [user, setUser] = useState(null);

  // Called by Profile after a successful login response
  const handleAuthSuccess = (userData) => {
    setUser(userData); // triggers re-render → shows App
  };

  // Show Profile page if not logged in, otherwise show the main app
  return user ? <App user={user} /> : <Profile onAuthSuccess={handleAuthSuccess} />;
};

createRoot(document.getElementById('root')).render(<Root />);

