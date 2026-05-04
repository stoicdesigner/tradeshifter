// /lib/validators.ts
// Tradeshifters — Zod Validation Schemas

import { z } from 'zod';

// ─── Region ─────────────────────────────────────────────────────────────────

export const RegionSchema = z.enum([
  'usa_canada',
  'eu',
  'southeast_asia',
  'east_asia',
  'japan',
  'aus_nz',
  'south_america',
  'mea',
]);

// ─── Step 1: Region Selection ────────────────────────────────────────────────

export const Step1Schema = z.object({
  selected_regions: z
    .array(RegionSchema)
    .min(1, 'Please select at least one target region')
    .max(8, 'Maximum 8 regions allowed'),
});

export type Step1FormData = z.infer<typeof Step1Schema>;

// ─── KYC Status ─────────────────────────────────────────────────────────────

export const KycItemSchema = z.object({
  item_id: z.string(),
  checked: z.boolean(),
});

export const KycStatusSchema = z.object({
  payoneer: z.record(z.string(), z.boolean()),
  alibaba: z.record(z.string(), z.boolean()),
});

export const SaveKycSchema = z.object({
  session_id: z.string().uuid(),
  platform: z.enum(['payoneer', 'alibaba']),
  item_id: z.string().min(1),
  checked: z.boolean(),
});

export type SaveKycData = z.infer<typeof SaveKycSchema>;

// ─── AI Interview ────────────────────────────────────────────────────────────

export const AOVRangeSchema = z.enum(['under_5k', '5k_25k', '25k_100k', 'over_100k']);

export const EXPFormStatusSchema = z.enum([
  'filed_regularly',
  'filed_once',
  'not_filed',
  'in_progress',
]);

export const GrowthGoalSchema = z.enum([
  'increase_volume',
  'new_markets',
  'premium_buyers',
  'd2c_channel',
]);

export const BuyerTypeSchema = z.enum(['b2b_wholesale', 'b2b_retail', 'd2c', 'mixed']);

export const AIInterviewDataSchema = z.object({
  product_category: z.string().min(1).max(100).nullable(),
  product_subcategory: z.string().max(100).nullable(),
  avg_order_value: AOVRangeSchema.nullable(),
  exp_form_status: EXPFormStatusSchema.nullable(),
  ad_bank: z.string().max(100).nullable(),
  growth_goals: z.array(GrowthGoalSchema).max(4),
  annual_export_value: z.string().max(50).nullable(),
  target_buyer_type: BuyerTypeSchema.nullable(),
  raw_responses: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      timestamp: z.string(),
    })
  ),
});

export type AIInterviewFormData = z.infer<typeof AIInterviewDataSchema>;

// ─── AI Chat API ─────────────────────────────────────────────────────────────

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

export const AIChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(50),
  session_id: z.string().uuid().optional(),
  interview_context: AIInterviewDataSchema.partial().optional(),
});

export type AIChatRequest = z.infer<typeof AIChatRequestSchema>;

// ─── User Profile ────────────────────────────────────────────────────────────

export const UserProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name too long')
    .trim(),
  company_name: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name too long')
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  ad_bank: z.string().max(100).optional().or(z.literal('')),
  erc_number: z
    .string()
    .max(50)
    .regex(/^[A-Z0-9\-\/]*$/, 'Invalid ERC number format')
    .optional()
    .or(z.literal('')),
});

export type UserProfileFormData = z.infer<typeof UserProfileSchema>;

// ─── Auth ────────────────────────────────────────────────────────────────────

export const SignInSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and a number'
      ),
    confirm_password: z.string(),
    full_name: z.string().min(2).max(100).trim(),
    company_name: z.string().min(2).max(200).trim(),
    agree_terms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type SignInFormData = z.infer<typeof SignInSchema>;
export type SignUpFormData = z.infer<typeof SignUpSchema>;

// ─── Report generation ───────────────────────────────────────────────────────

export const GenerateReportSchema = z.object({
  session_id: z.string().uuid(),
});

export type GenerateReportData = z.infer<typeof GenerateReportSchema>;
