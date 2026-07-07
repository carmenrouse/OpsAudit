import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  intakeSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  industries,
  type IntakeData,
} from "~/lib/intake-schema";
import { createSession } from "~/lib/report-store";

// Server function: validate intake and create session
const submitIntake = createServerFn({ method: "POST" })
  .validator(z.any())
  .handler(async ({ data }) => {
    const parsed = intakeSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false as const,
        error: "Invalid intake data. Please review your answers.",
      };
    }
    const token = createSession(parsed.data);
    return { success: true as const, token };
  });

export const Route = createFileRoute("/intake")({
  component: IntakePage,
});

// ─── Step Components ─────────────────────────────────────────

function Step1_BusinessProfile({
  data,
  onChange,
  errors,
}: {
  data: Partial<IntakeData>;
  onChange: (patch: Partial<IntakeData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          id="businessName"
          type="text"
          value={data.businessName ?? ""}
          onChange={(e) => onChange({ businessName: e.target.value })}
          className={`mt-1 block w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.businessName ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="Acme Services Inc."
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
        )}
      </div>

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
          Industry <span className="text-red-500">*</span>
        </label>
        <select
          id="industry"
          value={data.industry ?? ""}
          onChange={(e) => onChange({ industry: e.target.value as IntakeData["industry"] })}
          className={`mt-1 block w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.industry ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
        >
          <option value="">Select your industry</option>
          {industries.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
        )}
      </div>

      <div>
        <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700">
          Number of Employees <span className="text-red-500">*</span>
        </label>
        <input
          id="employeeCount"
          type="number"
          min={1}
          value={data.employeeCount ?? ""}
          onChange={(e) => onChange({ employeeCount: e.target.value ? Number(e.target.value) : undefined })}
          className={`mt-1 block w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.employeeCount ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="50"
        />
        {errors.employeeCount && (
          <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>
        )}
      </div>
    </div>
  );
}

function Step2_OperationsStaffing({
  data,
  onChange,
  errors,
}: {
  data: Partial<IntakeData>;
  onChange: (patch: Partial<IntakeData>) => void;
  errors: Record<string, string>;
}) {
  const roles = data.roles ?? [];

  const updateRole = (index: number, field: string, value: string | number | null) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ roles: updated });
  };

  const addRole = () => {
    onChange({
      roles: [...roles, { title: "", headcount: 1, utilizationRate: null }],
    });
  };

  const removeRole = (index: number) => {
    onChange({ roles: roles.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="keyWorkflows" className="block text-sm font-medium text-gray-700">
          Key Workflows <span className="text-red-500">*</span>
        </label>
        <textarea
          id="keyWorkflows"
          value={data.keyWorkflows ?? ""}
          onChange={(e) => onChange({ keyWorkflows: e.target.value })}
          rows={3}
          className={`mt-1 block w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.keyWorkflows ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="Describe your main operational workflows (e.g., order-to-cash, patient intake, scheduling, dispatch...)"
        />
        {errors.keyWorkflows && (
          <p className="mt-1 text-sm text-red-600">{errors.keyWorkflows}</p>
        )}
      </div>

      <div>
        <label htmlFor="currentTools" className="block text-sm font-medium text-gray-700">
          Current Tools / Software <span className="text-red-500">*</span>
        </label>
        <textarea
          id="currentTools"
          value={data.currentTools ?? ""}
          onChange={(e) => onChange({ currentTools: e.target.value })}
          rows={2}
          className={`mt-1 block w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.currentTools ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="List tools/software you use (e.g., Salesforce, QuickBooks, scheduling app...)"
        />
        {errors.currentTools && (
          <p className="mt-1 text-sm text-red-600">{errors.currentTools}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Staff Roles <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={addRole}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            + Add Role
          </button>
        </div>
        {errors.roles && (
          <p className="mt-1 text-sm text-red-600">{errors.roles}</p>
        )}
        <div className="mt-2 space-y-3">
          {roles.map((role, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) => updateRole(i, "title", e.target.value)}
                    placeholder="Role title (e.g., Server, Technician)"
                    className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Headcount</label>
                      <input
                        type="number"
                        min={1}
                        value={role.headcount}
                        onChange={(e) => updateRole(i, "headcount", Number(e.target.value))}
                        className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500">Utilization % (optional)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={role.utilizationRate ?? ""}
                        onChange={(e) =>
                          updateRole(i, "utilizationRate", e.target.value ? Number(e.target.value) : null)
                        }
                        placeholder="e.g., 75"
                        className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeRole(i)}
                  className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Remove role"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {roles.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Add at least one role to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step3_RevenuePainPoints({
  data,
  onChange,
  errors,
}: {
  data: Partial<IntakeData>;
  onChange: (patch: Partial<IntakeData>) => void;
  errors: Record<string, string>;
}) {
  const painPoints = data.painPoints ?? [];

  const updatePainPoint = (index: number, field: string, value: string) => {
    const updated = [...painPoints];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ painPoints: updated });
  };

  const addPainPoint = () => {
    onChange({
      painPoints: [...painPoints, { description: "", quantifiedImpact: "" }],
    });
  };

  const removePainPoint = (index: number) => {
    onChange({ painPoints: painPoints.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="avgRevenuePerEmployee" className="block text-sm font-medium text-gray-700">
          Avg Revenue Per Employee (optional)
        </label>
        <input
          id="avgRevenuePerEmployee"
          type="number"
          min={0}
          value={data.avgRevenuePerEmployee ?? ""}
          onChange={(e) =>
            onChange({ avgRevenuePerEmployee: e.target.value ? Number(e.target.value) : null })
          }
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 150000"
        />
      </div>

      <div>
        <label htmlFor="monthlyThroughput" className="block text-sm font-medium text-gray-700">
          Monthly Throughput (optional)
        </label>
        <input
          id="monthlyThroughput"
          type="text"
          value={data.monthlyThroughput ?? ""}
          onChange={(e) => onChange({ monthlyThroughput: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 100 orders/day, 50 patients/week"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Operational Pain Points <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={addPainPoint}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            + Add Pain Point
          </button>
        </div>
        {errors.painPoints && (
          <p className="mt-1 text-sm text-red-600">{errors.painPoints}</p>
        )}
        <div className="mt-2 space-y-3">
          {painPoints.map((pp, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={pp.description}
                    onChange={(e) => updatePainPoint(i, "description", e.target.value)}
                    placeholder="Describe the pain point (e.g., Scheduling conflicts)"
                    className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={pp.quantifiedImpact ?? ""}
                    onChange={(e) => updatePainPoint(i, "quantifiedImpact", e.target.value)}
                    placeholder="Quantified impact (optional, e.g., We lose 10 hours/week)"
                    className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePainPoint(i)}
                  className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Remove pain point"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {painPoints.length === 0 && (
            <p className="text-sm text-gray-400 italic">
              Add at least one pain point you're experiencing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Step4_Costs({
  data,
  onChange,
}: {
  data: Partial<IntakeData>;
  onChange: (patch: Partial<IntakeData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        All cost fields are optional. Fill in what you know — even partial data helps us
        produce a more accurate diagnostic.
      </p>

      <div>
        <label htmlFor="annualLaborCost" className="block text-sm font-medium text-gray-700">
          Annual Labor Cost (optional)
        </label>
        <input
          id="annualLaborCost"
          type="number"
          min={0}
          value={data.annualLaborCost ?? ""}
          onChange={(e) =>
            onChange({ annualLaborCost: e.target.value ? Number(e.target.value) : null })
          }
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 2500000"
        />
      </div>

      <div>
        <label htmlFor="annualMaterialCost" className="block text-sm font-medium text-gray-700">
          Annual Material / Supply Cost (optional)
        </label>
        <input
          id="annualMaterialCost"
          type="number"
          min={0}
          value={data.annualMaterialCost ?? ""}
          onChange={(e) =>
            onChange({ annualMaterialCost: e.target.value ? Number(e.target.value) : null })
          }
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 500000"
        />
      </div>

      <div>
        <label htmlFor="annualOverhead" className="block text-sm font-medium text-gray-700">
          Annual Overhead (optional)
        </label>
        <input
          id="annualOverhead"
          type="number"
          min={0}
          value={data.annualOverhead ?? ""}
          onChange={(e) =>
            onChange({ annualOverhead: e.target.value ? Number(e.target.value) : null })
          }
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 300000"
        />
      </div>
    </div>
  );
}

// ─── Main Intake Page ─────────────────────────────────────────

const STEPS = [
  { title: "Business Profile", component: Step1_BusinessProfile },
  { title: "Operations & Staffing", component: Step2_OperationsStaffing },
  { title: "Revenue & Pain Points", component: Step3_RevenuePainPoints },
  { title: "Costs & Finalize", component: Step4_Costs },
];

const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

function IntakePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [intakeData, setIntakeData] = useState<Partial<IntakeData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateData = (patch: Partial<IntakeData>) => {
    setIntakeData((prev) => ({ ...prev, ...patch }));
    // Clear relevant errors on change
    const cleared = { ...errors };
    for (const key of Object.keys(patch)) {
      delete cleared[key];
    }
    setErrors(cleared);
  };

  const validateStep = (stepIndex: number): boolean => {
    const schema = stepSchemas[stepIndex];
    const result = schema.safeParse(intakeData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitIntake({ data: intakeData });
      if (result.success) {
        navigate({ to: "/pricing", search: { session: result.token } });
      } else {
        setSubmitError(result.error);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const StepComponent = STEPS[step].component;
  const progress = ((step + 1) / STEPS.length) * 100;
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Start Your Operational Audit
          </h1>
          <p className="mt-2 text-gray-600">
            Step {step + 1} of {STEPS.length} &mdash; {STEPS[step].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            {STEPS.map((s, i) => (
              <span
                key={s.title}
                className={`${
                  i <= step ? "font-semibold text-indigo-600" : ""
                } transition-colors`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <StepComponent
            data={intakeData}
            onChange={updateData}
            errors={errors}
          />

          {/* Error message */}
          {submitError && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className={`rounded-lg px-6 py-3 text-sm font-semibold transition-all ${
                step === 0
                  ? "cursor-not-allowed text-gray-300"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Back
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Run My Audit →"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
              >
                Continue →
              </button>
            )}
          </div>
        </div>

        {/* Trust signal */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Your data is processed securely and never shared. No account required.
        </p>
      </div>
    </div>
  );
}
