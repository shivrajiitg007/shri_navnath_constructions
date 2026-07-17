import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,15}$/, "Please enter a valid mobile number"),
  email: z.union([z.string().trim().email("Please enter a valid email"), z.literal("")]).optional(),
  project_location: z.string().trim().max(150).optional().or(z.literal("")),
  construction_type: z.enum(["Residential", "Commercial", "Civil / Infrastructure", "Renovation", "Other"]),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Tell us a little more about the project").max(2000),
});
export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const otpEmailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const otpCodeSchema = z.object({
  token: z.string().trim().length(6, "Enter the 6-digit code"),
});

export const employeeSchema = z.object({
  name: z.string().trim().min(2).max(100),
  designation: z.string().trim().max(100).optional().or(z.literal("")),
  experience_years: z.coerce.number().int().min(0).max(60).optional(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  photo_url: z.string().optional().or(z.literal("")),
});
export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  construction_type: z.string().trim().max(100).optional().or(z.literal("")),
  status: z.enum(["ongoing", "completed"]),
  cover_image: z.string().optional().or(z.literal("")),
  is_hidden: z.boolean().optional(),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;
