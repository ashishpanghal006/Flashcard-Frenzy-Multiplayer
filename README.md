# 🎮 Flashcard Frenzy – Multiplayer Quiz App

A real-time multiplayer flashcard quiz game where players join with the same **Match ID** and compete to answer questions first.  
The first correct answer earns a point, and scores update instantly across all connected players.  
Each match’s questions and results are stored in the database for later review.

---

## ✨ Features
- 🔑 Unique player IDs
- 🎲 Can start a new match by sharing the `matchId`
- ⚡ Real-time score synchronization across all players (via Supabase Realtime)
- 📚 Questions and scores stored in MongoDB for persistence
- 🌍 Deployed on Vercel

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15, React, TypeScript, TailwindCSS  
- **Backend:** Next.js API Routes  
- **Database:** MongoDB Atlas (for matches, players, questions, scores)  
- **Realtime:** Supabase Broadcast Channels  
- **Deployment:** Vercel  
