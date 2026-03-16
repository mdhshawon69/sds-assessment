"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/auth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slideDown, tapScale } from "@/app/lib/motion";

export default function Navbar() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-zinc-950/80"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
          CineWatch
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/search", label: "Search" },
            { href: "/watchlist", label: "Watchlist" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {user?.name}
              </span>
              <motion.button
                whileTap={tapScale}
                onClick={logout}
                className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={tapScale}>
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className="text-zinc-900 dark:text-white">
            {mobileOpen ? (
              <path d="M1 1L17 13M1 13L17 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M0 1H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 7H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 13H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden border-t border-zinc-100 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
              {[
                { href: "/", label: "Home" },
                { href: "/search", label: "Search" },
                { href: "/watchlist", label: "Watchlist" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {loading ? null : isAuthenticated ? (
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  whileTap={tapScale}
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-full bg-zinc-100 py-2 text-sm font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                >
                  Logout ({user?.name})
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-full bg-zinc-900 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-zinc-900 cursor-pointer"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
