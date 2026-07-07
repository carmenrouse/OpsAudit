import type { IntakeData } from "~/lib/intake-schema";

export interface DiagnosticReport {
  inefficiencies: Array<{
    title: string;
    annualCost: number;
    rootCause: string;
    framework: "lean" | "toc" | "queuing";
    description: string;
  }>;
  quickWins: Array<{
    title: string;
    effort: string;
    impact: string;
  }>;
  recommendations: Array<{
    priority: number;
    title: string;
    estimatedROI: string;
    timeframe: "0-30 days" | "30-90 days" | "90+ days";
    description: string;
  }>;
  summary: string;
}

interface SessionEntry {
  intakeData: IntakeData;
  report: DiagnosticReport | null;
  paid: boolean;
  createdAt: Date;
}

// In-memory store. For MVP, data persists only for the server's lifetime.
const store = new Map<string, SessionEntry>();

/**
 * Store intake data and return a session token.
 */
export function createSession(intakeData: IntakeData): string {
  const token = crypto.randomUUID();
  store.set(token, {
    intakeData,
    report: null,
    paid: false,
    createdAt: new Date(),
  });
  return token;
}

/**
 * Retrieve a session entry by token.
 */
export function getSession(token: string): SessionEntry | undefined {
  return store.get(token);
}

/**
 * Mark a session as paid.
 */
export function markPaid(token: string): boolean {
  const entry = store.get(token);
  if (!entry) return false;
  entry.paid = true;
  return true;
}

/**
 * Store a diagnostic report for a session.
 */
export function storeReport(token: string, report: DiagnosticReport): boolean {
  const entry = store.get(token);
  if (!entry) return false;
  entry.report = report;
  return true;
}

/**
 * Get intake data by token.
 */
export function getIntakeData(token: string): IntakeData | undefined {
  return store.get(token)?.intakeData;
}

/**
 * Check if a session has paid.
 */
export function isPaid(token: string): boolean {
  return store.get(token)?.paid ?? false;
}

/**
 * Get report by token.
 */
export function getReport(token: string): DiagnosticReport | undefined {
  return store.get(token)?.report;
}
