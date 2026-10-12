"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth, HealthStatus, ApiError } from "@/lib/api";
import { Header, Footer } from "@/components/layout";
import { Button, StatusBadge } from "@/components/ui";

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkBackendHealth();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while communicating with the backend.");
      }
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    checkBackendHealth()
      .then((data) => {
        if (!ignore) {
          setHealth(data);
          setError(null);
          setLastChecked(new Date().toLocaleTimeString());
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError("An unknown error occurred while communicating with the backend.");
          }
          setHealth(null);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col items-center">
        {/* Banner Section */}
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-xs font-mono mb-4 text-slate-700 dark:text-slate-300">
            <span>Pre-Hackathon Foundation Shell</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            ChakraSaakshya Foundation
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Reusable framework foundation for the graph-powered waste-chain investigation agent. The core FalkorDB custody schema and investigation engine will be implemented during the hackathon.
          </p>
        </div>

        {/* System Communication Card */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Backend Service Linkage
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verifies frontend-to-backend communication via generic health endpoint.
              </p>
            </div>
            <Button
              variant="outline"
              isLoading={loading}
              onClick={fetchHealth}
              aria-label="Refresh backend health check"
            >
              Refresh Status
            </Button>
          </div>

          <div className="mt-6">
            {/* Loading State */}
            {loading && !health && !error && (
              <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-3">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin dark:border-slate-700 dark:border-t-slate-200" />
                <span className="text-xs">Connecting to FastAPI backend...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    <StatusBadge status="error" label="Connection Failed" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-rose-800 dark:text-rose-300">
                      {error}
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                      Ensure the FastAPI backend server is running locally on port 8000:
                    </p>
                    <code className="block mt-2 px-3 py-1.5 rounded bg-rose-100/70 dark:bg-rose-950/60 text-xs font-mono text-rose-900 dark:text-rose-200">
                      python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {health && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                        Backend Service Reachable
                      </span>
                      <span className="text-xs block text-emerald-700 dark:text-emerald-400">
                        {health.app_name}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status="success" label={health.status.toUpperCase()} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500 block">Environment:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {health.environment}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-500 block">Server Timestamp (UTC):</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {health.timestamp}
                    </span>
                  </div>
                </div>

                {lastChecked && (
                  <p className="text-right text-[11px] text-slate-400">
                    Last client check: {lastChecked}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kickoff Notice Box */}
        <div className="w-full mt-8 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center space-x-2 font-medium text-slate-900 dark:text-slate-100">
            <span>🛡️ Hackathon Rule Compliance</span>
          </div>
          <p>
            Under official competition guidelines, core waste-investigation agent logic, FalkorDB schema initialization, Cypher queries, and project-specific custody visualization are strictly reserved for the hackathon event period (15–18 October 2026 IST).
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
