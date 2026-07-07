import { z } from "zod";

const roleSchema = z.object({
  title: z.string().min(1, "Role title is required"),
  headcount: z.coerce.number().int().min(1, "At least 1 employee required"),
  utilizationRate: z.coerce.number().min(0).max(100).optional().nullable(),
});

const painPointSchema = z.object({
  description: z.string().min(1, "Pain point description is required"),
  quantifiedImpact: z.string().optional().nullable(),
});

export const intakeSchema = z.object({
  // Step 1: Business Profile
  businessName: z.string().min(1, "Business name is required"),
  industry: z.enum(["restaurant", "clinic", "field-service", "logistics", "other"], {
    errorMap: () => ({ message: "Please select an industry" }),
  }),
  employeeCount: z.coerce
    .number()
    .int()
    .min(1, "At least 1 employee required")
    .max(10000, "Max 10,000 employees"),

  // Step 2: Operations & Staffing
  keyWorkflows: z.string().min(1, "Please describe your key workflows"),
  currentTools: z.string().min(1, "Please list your tools/software"),
  roles: z.array(roleSchema).min(1, "At least one role is required"),

  // Step 3: Revenue & Pain Points
  avgRevenuePerEmployee: z.coerce.number().min(0).optional().nullable(),
  monthlyThroughput: z.string().optional().nullable(),
  painPoints: z.array(painPointSchema).min(1, "At least one pain point is required"),

  // Step 4: Costs
  annualLaborCost: z.coerce.number().min(0).optional().nullable(),
  annualMaterialCost: z.coerce.number().min(0).optional().nullable(),
  annualOverhead: z.coerce.number().min(0).optional().nullable(),
});

export type IntakeData = z.infer<typeof intakeSchema>;

// Per-step schemas for progressive validation
export const step1Schema = intakeSchema.pick({
  businessName: true,
  industry: true,
  employeeCount: true,
});

export const step2Schema = intakeSchema.pick({
  keyWorkflows: true,
  currentTools: true,
  roles: true,
});

export const step3Schema = intakeSchema.pick({
  avgRevenuePerEmployee: true,
  monthlyThroughput: true,
  painPoints: true,
});

export const step4Schema = intakeSchema.pick({
  annualLaborCost: true,
  annualMaterialCost: true,
  annualOverhead: true,
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;

export const industries = [
  { value: "restaurant", label: "Restaurant / Food Service" },
  { value: "clinic", label: "Medical Clinic" },
  { value: "field-service", label: "Field Service" },
  { value: "logistics", label: "Logistics / Delivery" },
  { value: "other", label: "Other" },
] as const;
