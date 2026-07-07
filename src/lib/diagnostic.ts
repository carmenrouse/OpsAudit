import Anthropic from "@anthropic-ai/sdk";
import type { IntakeData } from "~/lib/intake-schema";
import type { DiagnosticReport } from "~/lib/report-store";

const SYSTEM_PROMPT = `You are an expert operations consultant specializing in Lean, Theory of Constraints (TOC), and Queuing Theory for small-to-midsize service businesses.

Given the following intake data from a business, produce a structured operational diagnostic report.

Analyze using:
1. **LEAN** — identify waste (defects, overprocessing, waiting, inventory, motion, transportation, underutilized talent)
2. **THEORY OF CONSTRAINTS** — find the bottleneck(s) limiting throughput
3. **QUEUING THEORY** — analyze variability, arrival rates, service rates, and wait times

Respond with a valid JSON object. Use the exact structure below — no markdown, no extra text, just JSON:

{
  "summary": "2-3 sentence executive summary of key findings",
  "inefficiencies": [
    {
      "title": "Short name of the inefficiency",
      "annualCost": 50000,
      "rootCause": "Root cause explanation",
      "framework": "lean",
      "description": "Detailed description of the issue"
    }
  ],
  "quickWins": [
    {
      "title": "Quick win name",
      "effort": "Estimated hours to implement",
      "impact": "Description of the expected impact"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "title": "Recommendation name",
      "estimatedROI": "e.g., 3x ROI within 6 months",
      "timeframe": "0-30 days",
      "description": "Detailed implementation description"
    }
  ]
}

Guidelines:
- annualCost should be realistic estimates in USD based on the data provided
- framework must be one of: "lean", "toc", "queuing"
- priority values range from 1 (most urgent) to 5 (least urgent)
- timeframe must be one of: "0-30 days", "30-90 days", "90+ days"
- Include 3-5 inefficiencies, 2-3 quick wins, and 3-5 recommendations
- Base all analysis on the specific data provided — don't make up facts`;

function buildUserPrompt(data: IntakeData): string {
  return `Please analyze this service business and produce an operational diagnostic report.

BUSINESS PROFILE:
- Name: ${data.businessName}
- Industry: ${data.industry}
- Employees: ${data.employeeCount}

OPERATIONS & STAFFING:
- Key Workflows: ${data.keyWorkflows}
- Current Tools/Software: ${data.currentTools}
- Staff Roles:
${(data.roles ?? []).map((r) => `  - ${r.title}: ${r.headcount} employees${r.utilizationRate ? ` (${r.utilizationRate}% utilization)` : ""}`).join("\n")}

REVENUE & PAIN POINTS:
${data.avgRevenuePerEmployee ? `- Avg Revenue/Employee: $${data.avgRevenuePerEmployee}` : ""}
${data.monthlyThroughput ? `- Monthly Throughput: ${data.monthlyThroughput}` : ""}
- Pain Points:
${(data.painPoints ?? []).map((p) => `  - ${p.description}${p.quantifiedImpact ? ` (Impact: ${p.quantifiedImpact})` : ""}`).join("\n")}

COSTS:
${data.annualLaborCost ? `- Annual Labor Cost: $${data.annualLaborCost.toLocaleString()}` : ""}
${data.annualMaterialCost ? `- Annual Material Cost: $${data.annualMaterialCost.toLocaleString()}` : ""}
${data.annualOverhead ? `- Annual Overhead: $${data.annualOverhead.toLocaleString()}` : ""}

Please identify the most critical operational inefficiencies, their annual costs, root causes, and provide prioritized recommendations.`;
}

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Please set it in your .env file."
    );
  }
  return new Anthropic({ apiKey });
}

export async function generateDiagnosticReport(
  intakeData: IntakeData
): Promise<DiagnosticReport> {
  const client = getClient();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildUserPrompt(intakeData),
          },
        ],
      });

      const content = response.content
        .filter((block) => block.type === "text")
        .map((block) => ("text" in block ? block.text : ""))
        .join("");

      // Parse the response as JSON
      const parsed = JSON.parse(content) as DiagnosticReport;

      // Basic validation
      if (!parsed.summary || !Array.isArray(parsed.inefficiencies) || !Array.isArray(parsed.recommendations)) {
        throw new Error("Response missing required fields");
      }

      return parsed;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // Wait before retrying
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw new Error(
    `Failed to generate diagnostic report after 3 attempts: ${lastError?.message ?? "Unknown error"}`
  );
}
