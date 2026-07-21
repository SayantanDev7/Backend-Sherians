// ─────────────────────────────────────────────────────────────────────────────
// mockSongs.js  (lives in src/services/)
//
// This is temporary MOCK DATA — later you will replace this with a real
// API call to your Express backend (GET /api/songs?mood=happy)
//
// Each mood key maps to an array of song objects.
// ─────────────────────────────────────────────────────────────────────────────

const mockSongs = {
  happy: [
    { id: 1, title: "Happy", artist: "Pharrell Williams", duration: "3:53", cover: "😄" },
    { id: 2, title: "Can't Stop the Feeling", artist: "Justin Timberlake", duration: "3:56", cover: "🎉" },
    { id: 3, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: "4:30", cover: "🕺" },
    { id: 4, title: "Walking on Sunshine", artist: "Katrina & The Waves", duration: "3:59", cover: "☀️" },
  ],
  sad: [
    { id: 5, title: "Someone Like You", artist: "Adele", duration: "4:45", cover: "😢" },
    { id: 6, title: "The Night We Met", artist: "Lord Huron", duration: "3:28", cover: "🌧️" },
    { id: 7, title: "Skinny Love", artist: "Bon Iver", duration: "3:58", cover: "🍂" },
    { id: 8, title: "Fix You", artist: "Coldplay", duration: "4:55", cover: "💙" },
  ],
  angry: [
    { id: 9,  title: "Break Stuff", artist: "Limp Bizkit", duration: "2:46", cover: "😠" },
    { id: 10, title: "Given Up", artist: "Linkin Park", duration: "3:09", cover: "🔥" },
    { id: 11, title: "Bulls on Parade", artist: "Rage Against the Machine", duration: "3:52", cover: "⚡" },
    { id: 12, title: "Killing in the Name", artist: "RATM", duration: "5:13", cover: "💢" },
  ],
  fearful: [
    { id: 13, title: "Mad World", artist: "Gary Jules", duration: "3:09", cover: "😨" },
    { id: 14, title: "Breathe (2 AM)", artist: "Anna Nalick", duration: "4:08", cover: "🌙" },
    { id: 15, title: "The Sound of Silence", artist: "Simon & Garfunkel", duration: "3:05", cover: "🕯️" },
    { id: 16, title: "Exile Vilify", artist: "The National", duration: "3:21", cover: "🌫️" },
  ],
  disgusted: [
    { id: 17, title: "Creep", artist: "Radiohead", duration: "3:56", cover: "🤢" },
    { id: 18, title: "Loser", artist: "Beck", duration: "3:55", cover: "😒" },
    { id: 19, title: "Fake Plastic Trees", artist: "Radiohead", duration: "4:50", cover: "🌿" },
    { id: 20, title: "Basket Case", artist: "Green Day", duration: "3:01", cover: "🧺" },
  ],
  surprised: [
    { id: 21, title: "Mr. Brightside", artist: "The Killers", duration: "3:42", cover: "😲" },
    { id: 22, title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", cover: "🎸" },
    { id: 23, title: "Take On Me", artist: "A-ha", duration: "3:47", cover: "✨" },
    { id: 24, title: "Africa", artist: "Toto", duration: "4:55", cover: "🌍" },
  ],
  neutral: [
    { id: 25, title: "Lo-Fi Study Beats", artist: "ChilledCow", duration: "∞", cover: "😐" },
    { id: 26, title: "Clair de Lune", artist: "Debussy", duration: "5:00", cover: "🎹" },
    { id: 27, title: "Experience", artist: "Ludovico Einaudi", duration: "5:14", cover: "🌊" },
    { id: 28, title: "Comptine d'un autre été", artist: "Yann Tiersen", duration: "2:33", cover: "🍃" },
  ],
};

export default mockSongs;
