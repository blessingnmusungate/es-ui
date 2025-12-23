"use client";

import { FormEvent, useEffect, useState } from "react";
import { loginApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("es_auth_token");
      if (token) {
        router.push("/risk-detector");
      }
    }
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const startTime = Date.now();
    const minDelay = 900; // Minimum 0.9 seconds to show animation

    try {
      const res = await loginApi({ email, password });
      
      // Ensure minimum delay for animation visibility
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, minDelay - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      
      if (typeof window !== "undefined") {
        window.localStorage.setItem("es_auth_token", res.token);
        if (res.userName) {
          window.localStorage.setItem("es_user_name", res.userName);
        }
      }
      router.push("/risk-detector");
      router.refresh(); // Refresh to update navigation state
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Sign in
      </h1>
      <p className="mt-2 text-base font-medium text-slate-900">
        Authenticate against your backend before accessing the expert system.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="space-y-1.5 text-base">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-900"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-medium shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 text-base">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-900"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-base font-medium shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm font-bold text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSubmitting && <LoadingSpinner size="sm" />}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
