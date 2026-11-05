import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const employeeSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: optionalText(40),
  jobTitle: z.string().trim().min(1, "Job title is required").max(120),
  departmentId: z.coerce.number().int().positive().nullable().optional(),
  hireDate: z
    .union([z.literal(""), z.string().date()])
    .optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const departmentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: optionalText(500),
});

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}
