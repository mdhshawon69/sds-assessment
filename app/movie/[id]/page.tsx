"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MovieDetail,
  posterUrl,
  formatDate,
  formatRuntime,
  releaseYear,
  toMovie,
} from "@/app/lib/tmdb";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/app/lib/watchlist";
import { useAuth } from "@/app/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { slideFromLeft, slideFromRight, fadeUp, tapScale } from "@/app/lib/motion";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);

  const fetchMovie = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/movie/${id}`);
      const data: MovieDetail & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Movie not found.");
        setMovie(null);
      } else {
        setMovie(data);
        setInWatchlist(isInWatchlist(data.id));
      }
    } catch {
      setError("Network error. Please check your connection.");
      setMovie(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  function toggleWatchlist() {
    if (!movie) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      setInWatchlist(false);
    } else {
      addToWatchlist(toMovie(movie));
      setInWatchlist(true);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-5xl px-6 pt-28 pb-16">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="w-full shrink-0 md:w-80">
            <div className="aspect-2/3 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-16 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-screen flex-col items-center justify-center px-6 pt-16"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
          <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {error || "Movie not found."}
        </p>
        <div className="mt-6 flex gap-3">
          <motion.button
            whileTap={tapScale}
            onClick={fetchMovie}
            className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Try again
          </motion.button>
          <Link
            href="/search"
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Back to Search
          </Link>
        </div>
      </motion.div>
    );
  }

  const poster = posterUrl(movie.poster_path, "w780");
  const year = releaseYear(movie.release_date);

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-6 pt-28 pb-16">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/search"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </Link>
      </motion.div>

      <div className="flex flex-col gap-10 md:flex-row">
        <motion.div
          variants={slideFromLeft}
          initial="hidden"
          animate="visible"
          className="w-full shrink-0 md:w-80"
        >
          <div className="relative aspect-2/3 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            {poster ? (
              <Image
                src={poster}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-16 w-16 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <motion.button
              whileTap={tapScale}
              onClick={toggleWatchlist}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer ${inWatchlist
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                }`}
            >
              <AnimatePresence mode="wait">
                {inWatchlist ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    In Watchlist
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Watchlist
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {inWatchlist && (
                <motion.button
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  whileTap={tapScale}
                  onClick={toggleWatchlist}
                  className="w-full overflow-hidden rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
                >
                  Remove from Watchlist
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          variants={slideFromRight}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {movie.title}
            {year !== "—" && (
              <span className="ml-3 text-2xl font-normal text-zinc-400 dark:text-zinc-500">
                ({year})
              </span>
            )}
          </h1>

          {movie.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400"
            >
              &ldquo;{movie.tagline}&rdquo;
            </motion.p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{formatDate(movie.release_date)}</span>
            {movie.runtime && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
            {movie.vote_average > 0 && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average.toFixed(1)}
                  <span className="text-zinc-400 dark:text-zinc-600">
                    ({movie.vote_count.toLocaleString()})
                  </span>
                </span>
              </>
            )}
            {movie.status && movie.status !== "Released" && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  {movie.status}
                </span>
              </>
            )}
          </div>

          {movie.genres.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {movie.genres.map((genre) => (
                <motion.span
                  key={genre.id}
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                >
                  {genre.name}
                </motion.span>
              ))}
            </motion.div>
          )}

          {movie.overview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Plot</h2>
              <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {movie.overview}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
