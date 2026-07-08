import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import {
  getSession,
  storeReport,
  markPaid,
} from "~/lib/report-store";
import type { DiagnosticReport } from "~/lib/report-store";
import { generateDiagnosticReport } from "~/lib/diagnostic";

// Server function to generate and retrieve report
const getOrGenerateReport = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const session = getSession(token);
    if (!session) {
      return { status: "not-found" as const };
    }

    if (session.report) {
      return { status: "found" as const, report: session.report, paid: session.paid };
    }

    try {
      const report = await generateDiagnosticReport(session.intakeData);
      storeReport(token, report);
      return { status: "found" as const, report, paid: session.paid };
    } catch (err) {
      return {
        status: "error" as const,
        error: err instanceof Error ? err.message : "Failed to generate report",
      };
    }
  });

// Server function to mark a session as paid (for dev testing)
const mockPay = createServerFn({ method: "POST" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const paid = markPaid(token);
    return { success: paid };
  });

export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ReportPage,
});

function ReportPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [reportState, setReportState] = useState<{
    status: "loading" | "found" | "not-found" | "no-token" | "error";
    report?: DiagnosticReport;
    paid: boolean;
    error?: string;
  }>({ status: "loading", paid: false });

  useEffect(() => {
    if (!token) {
      setReportState({ status: "no-token", paid: false });
      return;
    }

    async function load() {
      setReportState({ status: "loading", paid: false });
      const result = await getOrGenerateReport({ data: token });
      if (result.status === "not-found") {
        setReportState({ status: "not-found", paid: false });
      } else if (result.status === "error") {
        setReportState({ status: "error", paid: false, error: result.error });
      } else {
        setReportState({
          status: "found",
          report: result.report,
          paid: result.paid,
        });
      }
    }
    load();
  }, [token]);

  const handleMockPay = async () => {
    if (!token) return;
    await mockPay({ data: token });
    setReportState((prev) => ({ ...prev, paid: true }));
  };

  // ─── No Token ──────────────────────────────────────────────
  if (reportState.status === "no-token") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">No Session Found</h2>
          <p className="mt-2 text-gray-600">
            Please complete an intake to generate your diagnostic report.
          </p>
          <Link
            to="/intake"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Start Your Audit
          </Link>
        </div>
      </div>
    );
  }

  // ─── Loading State ─────────────────────────────────────────
  if (reportState.status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Analyzing Your Operations
          </h2>
          <p className="mt-2 text-gray-600">
            Our AI is applying Lean, Theory of Constraints, and Queuing Theory to
            your business data. This takes about 30 seconds...
          </p>
          <div className="mt-6 space-y-2 text-left text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Evaluating workflows and processes
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Identifying bottlenecks and waste
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Calculating cost of inefficiencies
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Prioritizing recommendations by ROI
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Not Found ─────────────────────────────────────────────
  if (reportState.status === "not-found") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Session Not Found</h2>
          <p className="mt-2 text-gray-600">
            This report link is invalid or has expired. Please start a new audit.
          </p>
          <Link
            to="/intake"
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Start New Audit
          </Link>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (reportState.status === "error") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Report Generation Failed
          </h2>
          <p className="mt-2 text-gray-600">{reportState.error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Not Paid — Preview ─────────────────────────────────────
  if (!reportState.paid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
              Your Diagnostic Report Is Ready
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Unlock the full report to see exactly where your business is losing
              money and what to fix first.
            </p>
          </div>

          {/* Preview — blurred summary */}
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Executive Summary</h2>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200 blur-sm" />
              <div className="h-4 w-5/6 rounded bg-gray-200 blur-sm" />
              <div className="h-4 w-4/6 rounded bg-gray-200 blur-sm" />
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div className="h-5 w-3/4 rounded bg-gray-200 blur-sm" />
                  <div className="mt-3 space-y-1">
                    <div className="h-3 w-full rounded bg-gray-200 blur-sm" />
                    <div className="h-3 w-5/6 rounded bg-gray-200 blur-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link
              to="/pricing"
              search={{ session: token }}
              className="inline-flex items-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
            >
              Unlock Full Report — From $199
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              One-time purchase. Instant access. No subscription required.
            </p>
          </div>

          {/* Dev mock pay button */}
          <div className="mt-12 border-t border-gray-100 pt-8">
            <details className="group">
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Development: Mock Payment
              </summary>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleMockPay}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Simulate Payment (Dev Only)
                </button>
              </div>
            </details>
          </div>
        </div>
      </div>
    );
  }

  // ─── Full Report (Paid) ─────────────────────────────────────
  const report = reportState.report!;
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Print Button */}
        <div className="mb-8 flex items-center justify-between no-print">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </button>
        </div>

        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              OA
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Operational Diagnostic Report
              </h1>
              <p className="text-sm text-gray-500">Generated by OpsAudit AI</p>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-indigo-50 to-emerald-50 p-6">
            <h2 className="text-lg font-bold text-gray-900">Executive Summary</h2>
            <p className="mt-2 text-gray-700 leading-relaxed">{report.summary}</p>
          </div>

          {/* Inefficiencies */}
          <h2 className="mt-10 text-xl font-bold text-gray-900">
            Inefficiencies Identified
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {report.inefficiencies
              .sort((a, b) => b.annualCost - a.annualCost)
              .map((ineff, i) => {
                const frameworkColors: Record<string, string> = {
                  lean: "border-l-amber-500 bg-amber-50",
                  toc: "border-l-indigo-500 bg-indigo-50",
                  queuing: "border-l-emerald-500 bg-emerald-50",
                };
                const frameworkLabels: Record<string, string> = {
                  lean: "Lean",
                  toc: "Theory of Constraints",
                  queuing: "Queuing Theory",
                };
                return (
                  <div
                    key={i}
                    className={`rounded-xl border border-l-4 p-5 ${frameworkColors[ineff.framework] ?? "border-l-gray-500 bg-gray-50"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{ineff.title}</h3>
                        <span className="mt-1 inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {frameworkLabels[ineff.framework] ?? ineff.framework}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-lg font-bold text-red-600">
                          ${ineff.annualCost.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">annual cost</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{ineff.description}</p>
                    <div className="mt-3 rounded-lg bg-white/60 p-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Root Cause
                      </span>
                      <p className="mt-1 text-sm text-gray-700">{ineff.rootCause}</p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Quick Wins */}
          {report.quickWins.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-bold text-gray-900">Quick Wins</h2>
              <p className="mt-1 text-sm text-gray-500">
                High-impact changes you can make in under 30 days.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {report.quickWins.map((win, i) => (
                  <div
                    key={i}
                    className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                        !
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{win.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{win.impact}</p>
                        <span className="mt-2 inline-block rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          ~{win.effort} effort
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommendations */}
          <h2 className="mt-10 text-xl font-bold text-gray-900">
            Prioritized Recommendations
          </h2>
          <div className="mt-4 space-y-4">
            {report.recommendations
              .sort((a, b) => a.priority - b.priority)
              .map((rec, i) => {
                const timeframeColors: Record<string, string> = {
                  "0-30 days": "border-l-emerald-500",
                  "30-90 days": "border-l-amber-500",
                  "90+ days": "border-l-indigo-500",
                };
                const timeframeBg: Record<string, string> = {
                  "0-30 days": "bg-emerald-50",
                  "30-90 days": "bg-amber-50",
                  "90+ days": "bg-indigo-50",
                };
                const timeframeDot: Record<string, string> = {
                  "0-30 days": "bg-emerald-500",
                  "30-90 days": "bg-amber-500",
                  "90+ days": "bg-indigo-500",
                };
                return (
                  <div
                    key={i}
                    className={`rounded-xl border border-l-4 p-5 ${timeframeColors[rec.timeframe]} ${timeframeBg[rec.timeframe]}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                          {rec.priority}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{rec.title}</h3>
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${timeframeDot[rec.timeframe]}`}
                            />
                            {rec.timeframe}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {rec.estimatedROI}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{rec.description}</p>
                  </div>
                );
              })}
          </div>

          {/* Footer */}
          <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            <p>
              Generated by OpsAudit on {new Date().toLocaleDateString()}. This
              report uses Lean, Theory of Constraints, and Queuing Theory
              frameworks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
