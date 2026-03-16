import { Movie } from "./tmdb";

const WATCHLIST_PREFIX = "cinewatch_watchlist";
const SESSION_KEY = "cinewatch_session";

function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session).email ?? null;
  } catch {
    return null;
  }
}

function watchlistKey(): string {
  const email = getCurrentUserEmail();
  return email ? `${WATCHLIST_PREFIX}_${email}` : WATCHLIST_PREFIX;
}

function getStoredWatchlist(): Movie[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(watchlistKey());
  return stored ? JSON.parse(stored) : [];
}

function saveWatchlist(movies: Movie[]) {
  localStorage.setItem(watchlistKey(), JSON.stringify(movies));
}

export function getWatchlist(): Movie[] {
  return getStoredWatchlist();
}

export function addToWatchlist(movie: Movie): Movie[] {
  const list = getStoredWatchlist();
  if (list.some((m) => m.id === movie.id)) return list;
  const updated = [movie, ...list];
  saveWatchlist(updated);
  return updated;
}

export function removeFromWatchlist(movieId: number): Movie[] {
  const list = getStoredWatchlist();
  const updated = list.filter((m) => m.id !== movieId);
  saveWatchlist(updated);
  return updated;
}

export function isInWatchlist(movieId: number): boolean {
  return getStoredWatchlist().some((m) => m.id === movieId);
}
