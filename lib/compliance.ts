// /lib/compliance.ts
// Tradeshifters — Static FE Circular Content + Compliance Disclaimers

import type { FECircular } from '@/types';

// ─── Legal Disclaimer ────────────────────────────────────────────────────────

export const LEGAL_DISCLAIMER = `This information is provided for educational purposes only and does not constitute legal, financial, or regulatory advice. Bangladesh Bank Foreign Exchange (FE) Circulars are subject to amendment by Bangladesh Bank at any time. The content on this platform reflects our best understanding of the regulations as of the date of publication. Tradeshifters makes no warranty as to the accuracy, completeness, or timeliness of this information. Always consult your Authorized Dealer (AD) bank and a qualified legal advisor licensed in Bangladesh before entering into any export transaction, opening foreign currency accounts, or filing EXP forms. Non-compliance with Bangladesh Bank foreign exchange regulations may result in penal interest, reporting obligations, revocation of export privileges, or other enforcement action.`;

export const SHORT_DISCLAIMER = `Educational use only. Not legal/financial advice. Verify all compliance steps with your AD bank. Bangladesh Bank regulations are subject to change.`;

// ─── FE Circular Reference Data ──────────────────────────────────────────────

export const FE_CIRCULARS: FECircular[] = [
  {
    number: '42',
    title: 'EXP Form Submission & Export Proceeds Certification',
    summary:
      'Mandates submission of the EXP (Export) form to the Authorized Dealer bank prior to each export shipment. The EXP form certifies that export proceeds will be repatriated within the prescribed timeline and is required for Customs clearance.',
    key_points: [
      'EXP form must be submitted to AD bank BEFORE shipment departure',
      'AD bank endorses and certifies the export declaration on the EXP form',
      'Original EXP form accompanies the Customs export declaration (B/E)',
      'Applies to all modes: courier, air freight, sea freight, digital/software exports',
      'Specific obligations apply to shipments above USD 10,000',
      'One EXP form per consignment — bulk or split shipments require separate forms',
      'Failure to submit EXP form before shipment is a regulatory violation',
    ],
    applicability: 'All Bangladeshi exporters exporting goods or services and receiving foreign currency proceeds.',
    mandatory: true,
  },
  {
    number: '43',
    title: 'AD Bank Authorization & Foreign Currency Account Management',
    summary:
      'Requires that all foreign currency receipts from export activities be received through an Authorized Dealer bank in Bangladesh. Exporters cannot retain export proceeds in overseas payment platforms indefinitely.',
    key_points: [
      'All export proceeds must be received via an Authorized Dealer (AD) bank',
      'Exporters may open an ERQ (Export Retention Quota) account with their AD bank',
      'Up to 60% of net FOB value may be retained in ERQ for approved purposes',
      'Remaining proceeds must be converted to Bangladeshi Taka (BDT)',
      'Payoneer and similar platforms must transfer proceeds to AD bank within deadlines',
      'AD bank issues foreign currency endorsement confirming receipt on EXP form',
      'Using informal remittance channels (hundi) for export proceeds is prohibited',
    ],
    applicability: 'All exporters receiving foreign currency from international buyers, including digital platform payments (Payoneer, Wise, etc.).',
    mandatory: true,
  },
  {
    number: '48',
    title: 'Export Proceeds Repatriation Timeline & Enforcement',
    summary:
      'Establishes that export proceeds must be fully repatriated to Bangladesh within four months of the shipment date. Extensions and deferred payment arrangements require prior approval from Bangladesh Bank.',
    key_points: [
      '4-month (120-day) repatriation deadline applies from date of shipment',
      'Extensions available via AD bank application to Bangladesh Bank — not automatic',
      'Deferred payment exports (up to 180 days net) require prior Bangladesh Bank approval',
      'Advance payment receipts (up to 25% of contract value) are permitted without prior approval',
      'Late repatriation attracts penal interest charged by AD bank on behalf of Bangladesh Bank',
      'Non-repatriation without valid reasons may result in suspension of export privileges',
      'Exporters must file quarterly repatriation reports with their AD bank',
    ],
    applicability: 'All exporters. Penal interest applies to amounts not repatriated within the 4-month window.',
    mandatory: true,
  },
];

// ─── Platform Compliance Notes ────────────────────────────────────────────────

export const PLATFORM_COMPLIANCE: Record<
  string,
  {
    platform: string;
    compliant_route: string;
    caution: string;
    tips: string[];
  }
> = {
  payoneer: {
    platform: 'Payoneer',
    compliant_route:
      'Receive export proceeds to your Payoneer account → Transfer to your Bangladesh AD bank within 4 months (FE Circular 48) → AD bank processes EXP form endorsement.',
    caution:
      'Do NOT hold proceeds in Payoneer indefinitely. Payoneer balances held beyond 4 months from shipment date may constitute a repatriation violation under FE Circular 48.',
    tips: [
      'Inform your AD bank that you use Payoneer as your collection method — get this in writing',
      'Keep Payoneer transaction receipts for every payment to present to your AD bank',
      'Transfer proceeds to your AD bank promptly — do not wait until the 4-month deadline',
      'Your export invoice amount and Payoneer receipt must match the EXP form value',
      'Payoneer is accepted by most major Bangladesh AD banks for export proceeds',
    ],
  },
  alibaba: {
    platform: 'Alibaba.com',
    compliant_route:
      'Receive Trade Assurance payment via Alibaba → Withdraw to Payoneer or bank → Route through Bangladesh AD bank → EXP form endorsed.',
    caution:
      'Alibaba Trade Assurance payments count as export proceeds. The repatriation clock starts from the date of shipment, not the date of payment release.',
    tips: [
      'Set up Payoneer as your Alibaba withdrawal method for fastest bank routing',
      'Gold Supplier membership significantly improves buyer trust and order volume',
      'Your Alibaba product descriptions should reference Bangladesh-origin labelling',
      'Ensure invoice currency and EXP form currency match — USD invoicing is standard',
      'Trade Assurance provides buyer protection and also benefits your AD bank documentation',
    ],
  },
};

// ─── Documentation Checklist (Static) ────────────────────────────────────────

export interface DocCheckItem {
  name: string;
  description: string;
  issuing_authority: string;
  fe_circular_ref?: string;
  mandatory: boolean;
  estimated_cost: string;
  estimated_time: string;
}

export const DOCUMENTATION_CHECKLIST: DocCheckItem[] = [
  {
    name: 'Export Registration Certificate (ERC)',
    description: 'Primary export authorization issued by the Export Promotion Bureau (EPB)',
    issuing_authority: 'Export Promotion Bureau (EPB), Dhaka',
    mandatory: true,
    estimated_cost: 'BDT 5,000 – 15,000',
    estimated_time: '7–14 business days',
  },
  {
    name: 'Trade License',
    description: 'Business operating license from City Corporation or Municipality',
    issuing_authority: 'City Corporation / Municipality',
    mandatory: true,
    estimated_cost: 'BDT 500 – 5,000 per year',
    estimated_time: '5–10 business days',
  },
  {
    name: 'TIN Certificate',
    description: 'Taxpayer Identification Number from National Board of Revenue',
    issuing_authority: 'National Board of Revenue (NBR)',
    mandatory: true,
    estimated_cost: 'Free',
    estimated_time: '1–3 business days (online)',
  },
  {
    name: 'EXP Form',
    description: 'Export Proceeds Form submitted to AD bank before each shipment',
    issuing_authority: 'Your Authorized Dealer (AD) Bank',
    fe_circular_ref: 'FE Circular No. 42',
    mandatory: true,
    estimated_cost: 'Bank charges vary',
    estimated_time: '1–2 business days per submission',
  },
  {
    name: 'AD Bank Authorization Letter',
    description: 'Letter from AD bank confirming your export banking relationship',
    issuing_authority: 'Your Authorized Dealer (AD) Bank',
    fe_circular_ref: 'FE Circular No. 43',
    mandatory: true,
    estimated_cost: 'Bank charges vary',
    estimated_time: '3–5 business days',
  },
  {
    name: 'GSP Certificate of Origin',
    description: 'Generalized System of Preferences origin certificate for duty-free access to EU, USA, etc.',
    issuing_authority: 'Export Promotion Bureau (EPB)',
    mandatory: false,
    estimated_cost: 'BDT 500 – 2,000 per certificate',
    estimated_time: '2–5 business days',
  },
  {
    name: 'BGMEA Membership (RMG only)',
    description: 'Bangladesh Garment Manufacturers and Exporters Association membership',
    issuing_authority: 'BGMEA',
    mandatory: false,
    estimated_cost: 'BDT 10,000 – 50,000 per year',
    estimated_time: '10–20 business days',
  },
  {
    name: 'Certificate of Origin (Generic)',
    description: 'Standard origin certificate for non-GSP markets',
    issuing_authority: 'DCCI (Dhaka Chamber) or EPB',
    mandatory: false,
    estimated_cost: 'BDT 200 – 1,000 per certificate',
    estimated_time: '1–3 business days',
  },
];

// ─── Cost Snapshot Data (Illustrative) ───────────────────────────────────────

export const COST_SNAPSHOT = [
  { item: 'Payoneer Account Setup', estimate: 'Free', currency: 'USD', illustrative: true },
  { item: 'Alibaba Gold Supplier (1 year)', estimate: 'USD 1,499 – 2,999', currency: 'USD', illustrative: true },
  { item: 'ERC Application (EPB)', estimate: 'BDT 5,000 – 15,000', currency: 'BDT', illustrative: true },
  { item: 'GSP Certificate of Origin (per shipment)', estimate: 'USD 50 – 120', currency: 'USD', illustrative: true },
  { item: 'Freight Insurance (sea/air)', estimate: '0.5% – 1.5% of CIF value', currency: 'percentage', illustrative: true },
  { item: 'Payoneer Transaction Fee', estimate: '1% – 3% per transaction', currency: 'percentage', illustrative: true },
  { item: 'AD Bank EXP Form Fee', estimate: 'BDT 500 – 2,000 per EXP', currency: 'BDT', illustrative: true },
  { item: 'Alibaba Trade Assurance Fee', estimate: '0% – 3% of order value', currency: 'percentage', illustrative: true },
];

// ─── Key Bangladesh Bank Contact Info ─────────────────────────────────────────

export const REGULATORY_CONTACTS = {
  bangladesh_bank: {
    name: 'Bangladesh Bank (Central Bank)',
    department: 'Foreign Exchange Policy Department',
    website: 'https://www.bb.org.bd',
    phone: '02-9530001-10',
    note: 'For FE Circular queries and export finance guidance',
  },
  epb: {
    name: 'Export Promotion Bureau (EPB)',
    department: 'ERC & Documentation',
    website: 'https://www.epb.gov.bd',
    phone: '02-9563170',
    note: 'For ERC applications, GSP certificates, and export statistics',
  },
  bgmea: {
    name: 'BGMEA (RMG exporters only)',
    department: 'Membership & Export Support',
    website: 'https://www.bgmea.com.bd',
    note: 'For RMG-specific documentation and quota management',
  },
};
