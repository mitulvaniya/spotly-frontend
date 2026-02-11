# SPOTLY - Premium City Discovery Platform

SPOTLY is a modern, high-performance web application for discovering the best dining, nightlife, and hidden gems in your city. It features a premium UI, AI-powered recommendations, and seamless social integration.

## 🚀 Key Features

- **Premium UI/UX:** Glassmorphism design, smooth animations (Framer Motion), and responsive layouts.
- **Smart Discovery:** Categorized spots, trending lists, and AI-powered concierge.
- **Authentication:** Secure Google OAuth and Email/Password login (JWT + HttpOnly Cookies).
- **Social Features:** Wishlists, user profiles, and reviews.
- **Admin Dashboard:** Manage spots, users, and categories.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, Mongoose.
- **Database:** MongoDB Atlas.
- **Authentication:** Google Identity Services, JWT.
- **Deployment:** Vercel (Frontend) + Render (Backend).

## 📦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mitulvaniya/spotly-frontend.git
   cd spotly-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Open:** [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

- **Frontend:** Auto-deploys to **Vercel** on push to `main`.
- **Backend:** Auto-deploys to **Render** on push to `main`.

---
© 2026 SPOTLY Inc. All rights reserved.
