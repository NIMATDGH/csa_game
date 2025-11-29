# Quiz Spin Arena

A production-ready React single-page application for the Quiz Spin Arena experience: registration/login, subject-based quiz play with a spinning difficulty wheel, auto-synced rankings, and an admin-controlled final match.

## Features
- LocalStorage-backed registration and login (no backend required)
- Subject selection with animated difficulty wheel
- Timed questions with scoring modifiers including risk mode, skip, steal, and double spin options
- Global ranking board refreshed every 60 seconds
- Admin panel (password: `admin123`) to trigger the final match for the top 5 players
- Final match mode with dedicated question bank and winner announcement
- TailwindCSS-driven bright arcade-inspired UI

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```

## Project Structure
```
src/
  admin/
  components/
  data/
  pages/
  styles/
  utils/
```

All persistent data is stored in `localStorage` using the `users`, `ranking`, `currentUser`, and final match keys.
