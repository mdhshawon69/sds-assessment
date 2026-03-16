"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth";
import { Movie, posterUrl, releaseYear } from "@/app/lib/tmdb";
import { getWatchlist, removeFromWatchlist } from "@/app/lib/watchlist";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, listItem, tapScale } from "@/app/lib/motion";

export default function WatchlistPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!loading && isAuthenticated) {
      setMovies(getWatchlist());
      setReady(true);
    }
  }, [loading, isAuthenticated, router]);

  function handleRemove(movieId: number) {
    const updated = removeFromWatchlist(movieId);
    setMovies(updated);
  }

  if (loading || !ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 pt-28 pb-16">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Your Watchlist
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {movies.length > 0
            ? `${user?.name}, you have ${movies.length} movie${movies.length !== 1 ? "s" : ""} saved.`
            : `Welcome back, ${user?.name}.`}
        </p>
      </motion.div>

      <AnimatePresence>
        {movies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 dark:border-zinc-800"
          >
            <svg className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-2.625 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125M18 12H6m12 0c.621 0 1.125-.504 1.125-1.125M18 12c.621 0 1.125.504 1.125 1.125m0-2.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.5V9.375m0 4.125c0 .621-.504 1.125-1.125 1.125M6 13.5c0 .621.504 1.125 1.125 1.125m12-2.25v4.125c0 .621.504 1.125 1.125 1.125M18 13.5c0 .621-.504 1.125-1.125 1.125" />
            </svg>
            <p className="text-sm text-zinc-400 dark:text-zinc-600">
              Your watchlist is empty.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={tapScale}>
              <Link
                href="/search"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find movies
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {movies.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence initial={true}>
            {movies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={listItem}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <WatchlistItem
                  movie={movie}
                  onRemove={() => handleRemove(movie.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function WatchlistItem({
  movie,
  onRemove,
}: {
  movie: Movie;
  onRemove: () => void;
}) {
  const poster = posterUrl(movie.poster_path);
  const year = releaseYear(movie.release_date);

  return (
    <div className="group flex gap-4 rounded-2xl border border-zinc-100 bg-white p-4 transition-colors hover:border-zinc-200 sm:gap-5 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-zinc-700">
      <Link href={`/movie/${movie.id}`} className="shrink-0">
        <div className="relative h-28 w-[75px] overflow-hidden rounded-xl bg-zinc-100 sm:h-36 sm:w-24 dark:bg-zinc-800">
          {poster ? (
            <Image
              src={poster}
              alt={movie.title}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg className="h-6 w-6 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link href={`/movie/${movie.id}`} className="group/title">
            <h3 className="truncate text-sm font-semibold text-zinc-900 transition-colors group-hover/title:text-zinc-600 sm:text-base dark:text-white dark:group-hover/title:text-zinc-300">
              {movie.title}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{year}</span>
            {movie.vote_average > 0 && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <svg className="h-3 w-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                </span>
              </>
            )}
          </div>
          {movie.overview && (
            <p className="mt-2 hidden text-xs leading-relaxed text-zinc-500 sm:line-clamp-2 dark:text-zinc-400">
              {movie.overview}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/movie/${movie.id}`}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Details
          </Link>
          <motion.button
            whileTap={tapScale}
            onClick={onRemove}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            Remove
          </motion.button>
        </div>
      </div>
    </div>
  );
}
