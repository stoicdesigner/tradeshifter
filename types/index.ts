// Tradeshifters — Shared TypeScript Types
// Bangladesh Export Platform · Phase 1 MVP

export type Region =
  | 'usa_canada'
  | 'eu'
  | 'southeast_asia'
  | 'east_asia'
  | 'japan'
  | 'aus_nz'
  | 'south_america'
  | 'mea';

export type Platform = 'payoneer' | 'alibaba';

export type KycStatus = 'completed' | 'pending' | 'not_started';

export type OnboardingStep = 1 | 2 | 3 | 4;

export type ReportStatus = 'not_generated' | 'generating' | 'ready';

// ─── User Profile ───────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  ad_bank: string | null;
  erc_number: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Assessment Session ──────────────────────────────────────────────────────

export interface AssessmentSession {
  id: string;
  user_id: string;
  current_step: OnboardingStep;
  selected_regions: Region[];
  kyc_status: KycSessionStatus;
  ai_interview_data: AIInterviewData | null;
  report_status: ReportStatus;
  created_at: string;
  updated_at: string;
}

// ─── KYC Checklist ──────────────────────────────────────────────────────────

export interface KycCheckItem {
  id: string;
  platform: Platform;
  label: string;
  detail: string;
  link?: string;
  required: boolean;
}

export interface KycSessionStatus {
  payoneer: Record<string, boolean>;
  alibaba: Record<string, boolean>;
}

export const PAYONEER_CHECKLIST: KycCheckItem[] = [
  { id: 'p1', platform: 'payoneer', label: 'Create Payoneer Account', detail: 'Register at payoneer.com with business email', link: 'https://www.payoneer.com', required: true },
  { id: 'p2', platform: 'payoneer', label: 'National ID / Passport Upload', detail: 'Government-issued photo ID required', required: true },
  { id: 'p3', platform: 'payoneer', label: 'Business Registration Documents', detail: 'Trade license or incorporation certificate', required: true },
  { id: 'p4', platform: 'payoneer', label: 'Bank Account Linking', detail: 'Link your Bangladesh AD bank account', required: true },
  { id: 'p5', platform: 'payoneer', label: 'Phone Verification', detail: 'Mobile OTP verification required', link: 'https://www.payoneer.com', required: true },
  { id: 'p6', platform: 'payoneer', label: 'Tax Information Submission', detail: 'TIN or equivalent Bangladesh tax ID', link: 'https://www.payoneer.com', required: true },
  { id: 'p7', platform: 'payoneer', label: 'Payoneer Account Approval', detail: 'Await 2–5 business day review', required: true },
];

export const ALIBABA_CHECKLIST: KycCheckItem[] = [
  { id: 'a1', platform: 'alibaba', label: 'Create Alibaba Supplier Account', detail: 'Register as a seller on alibaba.com', link: 'https://seller.alibaba.com', required: true },
  { id: 'a2', platform: 'alibaba', label: 'Business Verification (BV)', detail: 'Submit company & legal representative documents', required: true },
  { id: 'a3', platform: 'alibaba', label: 'Product Listing (Min 5 SKUs)', detail: 'Create compliant product descriptions with images', required: true },
  { id: 'a4', platform: 'alibaba', label: 'Trade Assurance Setup', detail: 'Enable buyer payment protection feature', link: 'https://www.alibaba.com/trade-assurance', required: true },
  { id: 'a5', platform: 'alibaba', label: 'Export License / ERC Submission', detail: 'Export Registration Certificate required', required: true },
  { id: 'a6', platform: 'alibaba', label: 'Gold Supplier Membership', detail: 'Optional but strongly recommended for credibility', link: 'https://supplier.alibaba.com', required: false },
  { id: 'a7', platform: 'alibaba', label: 'Payoneer Integration', detail: 'Link Payoneer to receive export payments', required: true },
];

// ─── AI Interview ────────────────────────────────────────────────────────────

export interface AIInterviewData {
  product_category: string | null;
  product_subcategory: string | null;
  avg_order_value: AOVRange | null;
  exp_form_status: EXPFormStatus | null;
  ad_bank: string | null;
  growth_goals: GrowthGoal[];
  annual_export_value: string | null;
  target_buyer_type: BuyerType | null;
  raw_responses: ChatMessage[];
}

export type AOVRange = 'under_5k' | '5k_25k' | '25k_100k' | 'over_100k';
export type EXPFormStatus = 'filed_regularly' | 'filed_once' | 'not_filed' | 'in_progress';
export type GrowthGoal = 'increase_volume' | 'new_markets' | 'premium_buyers' | 'd2c_channel';
export type BuyerType = 'b2b_wholesale' | 'b2b_retail' | 'd2c' | 'mixed';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface ExportOpportunityReport {
  id: string;
  session_id: string;
  user_id: string;
  generated_at: string;
  top_regions: RegionOpportunity[];
  platform_recommendations: PlatformRecommendation[];
  documentation_checklist: DocumentItem[];
  ad_bank_script: string;
  cost_snapshot: CostItem[];
  compliance_notes: string[];
}

export interface RegionOpportunity {
  region: Region;
  rank: number;
  score: number; // 0–100
  market_size: string;
  platforms: string[];
  rationale: string;
  key_metrics: Record<string, string>;
}

export interface PlatformRecommendation {
  platform: string;
  priority: 'primary' | 'secondary' | 'optional';
  reason: string;
  estimated_reach: string;
  setup_cost: string;
}

export interface DocumentItem {
  name: string;
  status: 'ready' | 'needed' | 'optional';
  fe_circular_ref?: string;
  notes?: string;
}

export interface CostItem {
  item: string;
  estimate: string;
  currency: 'USD' | 'BDT' | 'percentage';
  notes?: string;
  illustrative: boolean;
}

// ─── Compliance ───────────────────────────────────────────────────────────────

export interface FECircular {
  number: string;
  title: string;
  summary: string;
  key_points: string[];
  applicability: string;
  mandatory: boolean;
}

// ─── Zod-validated form types (mirrors validators.ts schemas) ────────────────

export interface OnboardingStep1Form {
  selected_regions: Region[];
}

export interface OnboardingStep2Form {
  kyc_status: KycSessionStatus;
}

export interface UserProfileForm {
  full_name: string;
  company_name: string;
  phone?: string;
  ad_bank?: string;
  erc_number?: string;
}

// ─── API Response types ───────────────────────────────────────────────────────

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export type SaveKycStatusRequest = {
  session_id: string;
  platform: Platform;
  item_id: string;
  checked: boolean;
};

export type GenerateReportRequest = {
  session_id: string;
};
