"use client";

import { useEffect, useState } from "react";
import { getFactsApi, FactsResponse } from "@/lib/api";

// Convert camelCase to readable label
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function KnowledgeBasePage() {
  const [facts, setFacts] = useState<FactsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFacts() {
      try {
        const data = await getFactsApi();
        setFacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load facts");
      } finally {
        setLoading(false);
      }
    }
    fetchFacts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Knowledge Base Facts
        </h1>
        <p className="mt-4 text-base font-medium text-slate-900">
          Loading facts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Knowledge Base Facts
        </h1>
        <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
      </div>
    );
  }

  if (!facts) {
    return null;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Knowledge Base Facts
      </h1>
      <p className="mt-2 text-base font-medium text-slate-900">
        The expert system evaluates student dropout risk based on the following
        knowledge base facts. On the Risk Detector page, you must provide at
        least <span className="font-bold">2</span> of these facts before running
        an assessment.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Available Facts
        </h2>
        <ul className="grid gap-4 text-base text-slate-900 sm:grid-cols-2">
          {/* Preserve order from backend - no sorting */}
          {Object.entries(facts).map(([key, values]) => (
            <li key={key} className="flex flex-col">
              <span className="font-bold text-slate-900">
                {formatLabel(key)}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {values.join(" / ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
