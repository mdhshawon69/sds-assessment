"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie, TMDBSearchResponse, posterUrl, releaseYear } from "@/app/lib/tmdb";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "@/app/lib/watchlist";
import { useAuth } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, stagger, staggerItem, tapScale } from "@/app/lib/motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const list = getWatchlist();
    setWatchlistIds(new Set(list.map((m) => m.id)));
  }, []);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data: TMDBSearchResponse & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
        setResults([]);
      } else {
        setResults(data.results || []);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleWatchlist(movie: Movie) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const inList = watchlistIds.has(movie.id);
    if (inList) {
      removeFromWatchlist(movie.id);
      setWatchlistIds((prev) => {
        const next = new Set(prev);
        next.delete(movie.id);
        return next;
      });
    } else {
      addToWatchlist(movie);
      setWatchlistIds((prev) => new Set(prev).add(movie.id));
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 pt-28 pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Search movies
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Find any movie by title from the TMDB database.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        onSubmit={handleSearch}
        className="mx-auto mb-12 flex max-w-2xl gap-3"
      >
        <div className="relative flex-1">
          <svg
            className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pr-4 pl-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800"
          />
        </div>
        <motion.button
          whileTap={tapScale}
          type="submit"
          disabled={loading || !query.trim()}
          className="shrink-0 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Searching..." : "Search"}
        </motion.button>
      </motion.form>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-2/3 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-3 h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-auto max-w-md text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <motion.button
              whileTap={tapScale}
              onClick={() => {
                const form = document.querySelector("form");
                form?.requestSubmit();
              }}
              className="mt-4 rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Try again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && !searched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <svg className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Type a movie title and hit Search to get started.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {!loading && !error && searched && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <svg className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              No movies found for &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
              Try a different title or check your spelling.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!loading && !error && results.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p variants={staggerItem} className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Showing {results.length} result{results.length !== 1 && "s"}
            </motion.p>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  variants={staggerItem}
                  custom={i}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <MovieCard
                    movie={movie}
                    inWatchlist={watchlistIds.has(movie.id)}
                    onToggleWatchlist={() => toggleWatchlist(movie)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MovieCard({
  movie,
  inWatchlist,
  onToggleWatchlist,
}: {
  movie: Movie;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
}) {
  const poster = posterUrl(movie.poster_path);
  const year = releaseYear(movie.release_date);

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        {poster ? (
          <Image
            src={poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 bg-linear-to-t from-black/70 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Link
            href={`/movie/${movie.id}`}
            className="w-full rounded-lg bg-white/90 py-2 text-center text-xs font-semibold text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white"
          >
            Details
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWatchlist();
            }}
            className={`w-full rounded-lg py-2 text-center text-xs font-semibold backdrop-blur-sm transition-colors ${
              inWatchlist
                ? "bg-emerald-500/90 text-white hover:bg-emerald-500"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {inWatchlist ? "✓ Added" : "+ Watchlist"}
          </button>
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
          {movie.title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{year}</span>
          {movie.vote_average > 0 && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                ★ {movie.vote_average.toFixed(1)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 flex gap-2 md:hidden">
        <Link
          href={`/movie/${movie.id}`}
          className="flex-1 rounded-lg border border-zinc-200 py-1.5 text-center text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Details
        </Link>
        <button
          onClick={onToggleWatchlist}
          className={`flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition-colors ${
            inWatchlist
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          }`}
        >
          {inWatchlist ? "✓ Added" : "+ Watchlist"}
        </button>
      </div>
    </div>
  );
}
