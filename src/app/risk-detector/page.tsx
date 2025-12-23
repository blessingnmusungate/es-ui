"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropoutRiskRequest,
  DropoutRiskResponse,
  evaluateDropoutRiskApi,
  getFactsApi,
  FactsResponse,
} from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

// Convert camelCase to readable label
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function RiskDetectorPage() {
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [facts, setFacts] = useState<FactsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<DropoutRiskRequest>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DropoutRiskResponse | null>(null);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("es_auth_token");
      if (!token) {
        // User is not logged in, redirect to login page
        setIsAuthenticated(false);
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Load facts from backend on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated === false) {
      return; // Don't fetch if not authenticated
    }

    async function fetchFacts() {
      try {
        const data = await getFactsApi();
        setFacts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load facts"
        );
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated === true) {
      fetchFacts();
    }
  }, [isAuthenticated]);

  const filledCount = useMemo(
    () =>
      Object.values(form).reduce(
        (count, value) => (value ? count + 1 : count),
        0,
      ),
    [form],
  );

  const totalFacts = facts ? Object.keys(facts).length : 0;
  const canSubmit = filledCount >= 3 && !isSubmitting && !loading;

  function updateField(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (filledCount < 3) {
      setError("Please provide at least 3 facts before running the expert system.");
      return;
    }

    setIsSubmitting(true);
    const startTime = Date.now();
    const minDelay = 900; // Minimum 0.9 seconds to show animation

    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("es_auth_token")
          : null;
      const res = await evaluateDropoutRiskApi(form, token);
      
      // Ensure minimum delay for animation visibility
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, minDelay - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      
      setResult(res);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to evaluate dropout risk. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Smooth scroll to results when they arrive
  useEffect(() => {
    if (result && resultsRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [result]);

  // Show loading/redirecting message if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Student Dropout Risk Detector
          </h1>
          <p className="mt-4 text-base font-medium text-slate-900">Redirecting to login...</p>
        </section>
      </div>
    );
  }

  if (loading || isAuthenticated === null) {
    return (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Student Dropout Risk Detector
          </h1>
          <p className="mt-4 text-base font-medium text-slate-900">Loading facts...</p>
        </section>
      </div>
    );
  }

  if (error && !facts) {
    return (
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
        <section>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Student Dropout Risk Detector
          </h1>
          <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
        </section>
      </div>
    );
  }

  if (!facts) {
    return null;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Student Dropout Risk Detector
        </h1>
        <p className="mt-2 text-base font-medium text-slate-900">
          Provide at least <span className="font-bold">three</span> facts about a student to evaluate their dropout risk.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Preserve order from backend - no sorting */}
            {Object.entries(facts).map(([key, options]) => (
              <div key={key} className="space-y-1.5 text-base">
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold text-slate-900"
                >
                  {formatLabel(key)}
                </label>
                <select
                  id={key}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={(form[key] as string | undefined) ?? ""}
                  onChange={(e) => updateField(key, e.target.value)}
                >
                  <option value="">Not specified</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-slate-900">
            <p>
              Facts provided:{" "}
              <span className="font-bold">{filledCount}</span> / {totalFacts}
            </p>
            <p>
              Minimum required:{" "}
              <span className="font-bold text-blue-700">3</span>
            </p>
          </div>

          {error && (
            <p className="text-sm font-bold text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            {isSubmitting ? "Evaluating..." : "Run Expert System"}
          </button>
        </form>
      </section>

      <section className="space-y-4" ref={resultsRef}>
        <div className="rounded-2xl border bg-slate-50 p-6 text-slate-900 shadow-md">
          <h2 className="text-lg font-bold">Dropout Risk Result</h2>
          {!result && (
            <p className="mt-3 text-sm font-medium text-slate-900">
              Run the expert system to see the predicted dropout risk level,
              explanation, and recommended remedy actions.
            </p>
          )}
          {result && (
            <div className="mt-4 space-y-3 text-sm">
              <p className="font-medium text-slate-900">
                Risk level:{" "}
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-blue-900">
                  {result.riskLevel}
                </span>
              </p>
              <p className="font-medium text-slate-900">
                Will drop out:{" "}
                <span className="font-bold">
                  {result.willDropout ? "Yes" : "No"}
                </span>
              </p>
              <div>
                <p className="mb-1 font-bold text-slate-900">
                  Explanation
                </p>
                <p className="font-medium text-slate-900">{result.explanation}</p>
              </div>
              {result.remedies?.length > 0 && (
                <div>
                  <p className="mb-1 font-bold text-slate-900">
                    Recommended actions
                  </p>
                  <ul className="list-disc space-y-1 pl-5 font-medium text-slate-900">
                    {result.remedies.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
