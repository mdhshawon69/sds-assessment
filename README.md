# CineWatch

A movie discovery and watchlist app built with Next.js, React, and the TMDB API.  
Search for movies, view details, and save favorites to a personal watchlist.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **TMDB API** for movie data
- **localStorage** for auth and watchlist persistence

## Getting Started

### Prerequisites

- Node.js 18+
- A free TMDB API key — get one at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Install & Run

```bash
git clone <repo-url>
cd sds-assesment
npm install
```

Create a `.env.local` file in the project root:

```
TMDB_API_KEY=your_tmdb_api_key_here
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── api/
│   ├── search/route.ts          Server-side TMDB search proxy
│   └── movie/[id]/route.ts      Server-side TMDB detail proxy
├── components/
│   ├── Navbar.tsx                Shared navigation bar
│   └── PageTransition.tsx        Framer Motion page wrapper
├── lib/
│   ├── auth.ts                   Mock auth (useAuth hook, login, register, logout)
│   ├── tmdb.ts                   Movie types and TMDB helpers
│   ├── watchlist.ts              Per-user watchlist (localStorage)
│   └── motion.ts                 Shared Framer Motion variants
├── login/page.tsx                Login page
├── register/page.tsx             Register page
├── search/page.tsx               Movie search with results grid
├── movie/[id]/page.tsx           Movie detail page
├── watchlist/page.tsx            User watchlist (protected)
├── page.tsx                      Landing page
├── layout.tsx                    Root layout
└── globals.css                   Global styles
```

## Features

### Authentication

Mock auth using localStorage. Two demo accounts are seeded on first visit:

| Email               | Password      |
|---------------------|---------------|
| demo@example.com    | demo1234      |
| russo@example.com   | password123   |

New accounts can be registered and persist across sessions.  
Session is stored in localStorage — no backend required.

### Movie Search

Search by title via the TMDB API. Results display as a responsive poster grid.  
The TMDB API key stays server-side through a Next.js route handler (`/api/search`).

### Movie Details

Click any movie to see its full details: poster, genres, plot, release date, runtime, and ratings.

### Watchlist

Authenticated users can add/remove movies from their watchlist.  
Each user has an isolated watchlist scoped by email in localStorage.  
The watchlist page is protected — unauthenticated users are redirected to login.

### Animations

Framer Motion powers all transitions:

- Staggered page entrances
- Scroll-triggered feature cards on the landing page
- Animated mobile navigation menu
- Card hover lift effects
- Button tap microinteractions
- Smooth add/remove transitions in the watchlist

## API Routes

| Route              | Method | Description                     |
|--------------------|--------|---------------------------------|
| `/api/search?q=`   | GET    | Proxies TMDB movie search       |
| `/api/movie/[id]`  | GET    | Proxies TMDB movie details      |

Both routes keep the TMDB API key on the server.

## Environment Variables

| Variable       | Required | Description         |
|----------------|----------|---------------------|
| `TMDB_API_KEY` | Yes      | Your TMDB API key   |
