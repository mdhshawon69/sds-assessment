"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/auth";
import { motion } from "framer-motion";
import { staggerSlow, staggerItem, scaleUp, tapScale, hoverScale } from "@/app/lib/motion";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-2xl text-center"
      >
        <motion.div
          variants={staggerItem}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
          />
          Powered by TMDB
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="text-5xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-6xl dark:text-white"
        >
          Your movies,{" "}
          <span className="bg-linear-to-r from-zinc-900 via-zinc-600 to-zinc-400 bg-clip-text text-transparent dark:from-white dark:via-zinc-300 dark:to-zinc-500">
            one watchlist.
          </span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-zinc-500 dark:text-zinc-400"
        >
          Search thousands of movies, explore details, and save the ones you love
          to your personal watchlist. Simple, fast, beautiful.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          {loading ? (
            <div className="h-12 w-40 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
          ) : isAuthenticated ? (
            <motion.div whileHover={hoverScale} whileTap={tapScale}>
              <Link
                href="/watchlist"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white transition-all hover:bg-zinc-700 hover:shadow-lg dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Go to Watchlist
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={hoverScale} whileTap={tapScale}>
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white transition-all hover:bg-zinc-700 hover:shadow-lg dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Get started — it&apos;s free
                </Link>
              </motion.div>
              <motion.div whileHover={hoverScale} whileTap={tapScale}>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-8 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  Sign in
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      <div className="mt-24 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: "Search", desc: "Find any movie instantly" },
          { title: "Details", desc: "Ratings, cast, and synopsis" },
          { title: "Watchlist", desc: "Save for later, watch anytime" },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            variants={scaleUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 transition-colors hover:border-zinc-200 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
          >
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {f.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
