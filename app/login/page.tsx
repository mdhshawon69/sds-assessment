"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/lib/auth";
import { motion } from "framer-motion";
import { staggerSlow, staggerItem, tapScale } from "@/app/lib/motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) router.replace("/");
  }, [loading, isAuthenticated, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.error || "Login failed.");
        setSubmitting(false);
      } else {
        router.push("/");
      }
    }, 400);
  }

  if (loading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <motion.div
        variants={staggerSlow}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={staggerItem} className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Sign in to your CineWatch account
          </p>
        </motion.div>

        <motion.form variants={staggerItem} onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 dark:focus:ring-zinc-800"
            />
          </div>

          <motion.button
            whileTap={tapScale}
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900" />
            ) : (
              "Sign in"
            )}
          </motion.button>
        </motion.form>

        <motion.p variants={staggerItem} className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-zinc-900 hover:underline dark:text-white">
            Create one
          </Link>
        </motion.p>

        <motion.div variants={staggerItem} className="mt-8 rounded-xl border border-dashed border-zinc-200 p-4 dark:border-zinc-800">
          <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-500">Demo accounts</p>
          <div className="space-y-1 text-xs text-zinc-400 dark:text-zinc-600">
            <p>demo@example.com / demo1234</p>
            <p>russo@example.com / password123</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
