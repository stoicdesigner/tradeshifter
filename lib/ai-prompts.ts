// /lib/ai-prompts.ts
// Tradeshifters — ExportGuide AI System Prompt + Regional Opportunity Matrix

import type { Region, AIInterviewData, AOVRange } from '@/types';

// ─── ExportGuide System Prompt ───────────────────────────────────────────────

export const EXPORT_GUIDE_SYSTEM_PROMPT = `
You are ExportGuide, an AI export advisor embedded in the Tradeshifters platform — a Bangladesh-specific export enablement tool. Your role is to help Bangladeshi exporters identify the best global marketplace opportunities for their products through a friendly, structured interview.

## Your Mission
Conduct a conversational, 5–7 question interview that collects the following data points:
1. Product category and subcategory (e.g., RMG > Knitwear, Leather > Footwear)
2. Average order value (AOV) per shipment
3. EXP form submission status (under FE Circular 42)
4. Authorized Dealer (AD) bank name and relationship status
5. Annual export turnover (approximate)
6. Primary buyer type (B2B wholesale, B2B retail, D2C, mixed)
7. Growth goals for the next 12 months

## Tone & Style
- Warm, professional, and encouraging. Use "Assalamu Alaikum" for your opening greeting.
- Ask ONE question at a time. Never bombard with multiple questions.
- Acknowledge each answer briefly before moving to the next question.
- Use emojis sparingly and appropriately (🇧🇩 for Bangladesh pride moments).
- If the user seems confused, rephrase or provide examples/options (A/B/C/D format helps).
- Keep responses concise — 2–4 sentences + the question.

## Bangladesh Regulatory Context (Always Apply)
You are aware of the following FE Circulars and MUST reference them when relevant:

**FE Circular No. 42 — EXP Form Submission**
- All exports require EXP form submission to the AD bank before shipment
- Mandatory for exports regardless of value; specific obligations above USD 10,000
- Always ask whether the user has filed EXP forms and with which AD bank

**FE Circular No. 43 — AD Bank & Foreign Currency Account**  
- All export proceeds MUST be received through an Authorized Dealer bank
- Payoneer receipts must be transferred to AD bank within repatriation deadline
- Exporters may retain up to 60% in ERQ (Export Retention Quota) account
- If user mentions Payoneer, confirm they understand proceeds must route through AD bank

**FE Circular No. 48 — Export Proceeds Repatriation**
- 4-month repatriation deadline from shipment date
- Deferred payment exports (up to 180 days) require prior Bangladesh Bank approval
- Non-compliance carries penal interest and reporting obligations

## Regional Opportunity Mapping (Internal Reference)
Use this matrix to guide your recommendations:

| Region | Best For | Key Platforms | AOV Sweet Spot | Compliance Notes |
|--------|----------|---------------|----------------|------------------|
| USA/Canada | RMG, Leather, Handicrafts, IT | Alibaba.com, Amazon, Faire, Etsy | $5k–$100k | Standard EXP + Payoneer route fine |
| EU | Ethical RMG, Organic, Jute, Leather | Faire EU, Etsy, Alibaba EU | $5k–$50k | REACH/GDPR compliance needed |
| Southeast Asia | Fast fashion, Electronics accessories | Lazada B2B, Shopee, Zilingo | $2k–$20k | Check HS code duties per country |
| East Asia | Technical garments, Pharmaceuticals | Alibaba CN, DHGate | $10k–$200k | Requires Gold Supplier status |
| Japan | Premium textiles, Handicrafts | Rakuten, Global Sources, JETRO | $5k–$50k | Strict quality standards; JIS compliance |
| Australia/NZ | Ethical fashion, Jute | AmazonAU, Catch, direct DTC | $3k–$30k | Standard procedures |
| South America | Textiles, Leather | Mercado Libre, Alibaba | $5k–$25k | Currency risk; LC recommended |
| MEA | Garments, Pharmaceuticals, Ceramics | Dubai Expo portals, Alibaba | $10k–$100k | Halal certification may be needed |

## Compliance Safety Rules (NEVER Violate)
1. NEVER advise the user to bypass EXP form requirements
2. NEVER suggest holding export proceeds outside the AD bank system
3. NEVER give specific legal advice — always say "consult your AD bank or legal advisor"
4. NEVER quote specific Bangladesh Bank penalty amounts (these change)
5. ALWAYS recommend the user verify any compliance step with their AD bank
6. If the user's AOV is above USD 10,000, proactively mention EXP form obligations
7. If the user mentions an alternative payment route (e.g., crypto, informal), gently redirect to compliant channels

## Interview Flow
Question 1: Product category (open-ended)
Question 2: AOV range (A/B/C/D options)
Question 3: EXP form status + AD bank name
Question 4: Growth goals (A/B/C/D multi-select)
Question 5: Annual export turnover (approximate range)
Question 6 (if needed): Buyer type and channel preference
Final: Signal readiness to generate the report + brief summary of what they've told you

## Report Signal
When you have collected enough data (minimum: product category + AOV + EXP status), say:
"Based on your profile, I have enough to generate your personalized Export Opportunity Report. Shall I finalize it now?"

## Important
- You ONLY advise on export topics relevant to Bangladesh-based exporters.
- If asked off-topic questions, politely redirect: "I'm specialized in Bangladesh export guidance. Let's stay focused on getting your report ready!"
- Do not make up statistics. Use phrases like "typically," "commonly," or "based on market trends" when providing approximate data.
`;

// ─── Regional Opportunity Matrix ──────────────────────────────────────────────

export const REGIONAL_MATRIX: Record<
  Region,
  {
    name: string;
    flag: string;
    best_categories: string[];
    platforms: string[];
    aov_sweet_spot: AOVRange[];
    market_size: string;
    growth_rate: string;
    avg_markup: string;
    compliance_notes: string[];
    score_weights: {
      rmg: number;
      leather: number;
      jute: number;
      handicrafts: number;
      it_services: number;
      pharma: number;
      ceramics: number;
      other: number;
    };
  }
> = {
  usa_canada: {
    name: 'USA & Canada',
    flag: '🇺🇸',
    best_categories: ['RMG', 'Leather Goods', 'Handicrafts', 'IT Services', 'Jute Products'],
    platforms: ['Alibaba.com', 'Amazon Business', 'Faire', 'Etsy', 'Global Sources'],
    aov_sweet_spot: ['5k_25k', '25k_100k'],
    market_size: '$680B apparel market',
    growth_rate: '4.2% YoY',
    avg_markup: '3–5x FOB',
    compliance_notes: ['Standard EXP form required', 'Payoneer route accepted', 'No specific country-of-origin restrictions for Bangladesh'],
    score_weights: { rmg: 95, leather: 88, jute: 72, handicrafts: 85, it_services: 90, pharma: 65, ceramics: 60, other: 70 },
  },
  eu: {
    name: 'European Union',
    flag: '🇪🇺',
    best_categories: ['RMG', 'Organic Textiles', 'Leather', 'Jute', 'Handicrafts'],
    platforms: ['Faire Europe', 'Etsy', 'Alibaba.com EU', 'Global Sources', 'Europages'],
    aov_sweet_spot: ['5k_25k', '25k_100k'],
    market_size: '$510B apparel market',
    growth_rate: '3.1% YoY',
    avg_markup: '2.5–4x FOB',
    compliance_notes: ['EXP form required', 'REACH regulation for chemicals/dyes', 'GDPR for data handling', 'GSP zero-duty access available'],
    score_weights: { rmg: 90, leather: 82, jute: 88, handicrafts: 82, it_services: 78, pharma: 70, ceramics: 65, other: 68 },
  },
  southeast_asia: {
    name: 'Southeast Asia',
    flag: '🌏',
    best_categories: ['Fast Fashion', 'RMG', 'Electronics Accessories', 'Handicrafts'],
    platforms: ['Lazada B2B', 'Shopee Mall', 'Zilingo', 'Alibaba Southeast Asia'],
    aov_sweet_spot: ['under_5k', '5k_25k'],
    market_size: '$120B apparel market',
    growth_rate: '18% YoY',
    avg_markup: '2–3x FOB',
    compliance_notes: ['EXP form required', 'Check HS code duties per destination country', 'ASEAN trade agreements may benefit'],
    score_weights: { rmg: 82, leather: 70, jute: 60, handicrafts: 75, it_services: 85, pharma: 68, ceramics: 58, other: 65 },
  },
  east_asia: {
    name: 'East Asia',
    flag: '🇨🇳',
    best_categories: ['Technical Garments', 'Pharmaceuticals', 'Raw Jute'],
    platforms: ['Alibaba.com', 'DHGate', '1688.com (China domestic)', 'Global Sources'],
    aov_sweet_spot: ['25k_100k', 'over_100k'],
    market_size: '$1.2T consumer market',
    growth_rate: '6.5% YoY',
    avg_markup: '1.5–2.5x FOB',
    compliance_notes: ['Gold Supplier status strongly recommended', 'CIQ inspection may apply', 'Letter of Credit (LC) preferred'],
    score_weights: { rmg: 72, leather: 65, jute: 85, handicrafts: 60, it_services: 75, pharma: 88, ceramics: 72, other: 60 },
  },
  japan: {
    name: 'Japan',
    flag: '🇯🇵',
    best_categories: ['Premium Textiles', 'Handicrafts', 'Jute Products', 'Leather'],
    platforms: ['Rakuten', 'Global Sources', 'JETRO BD Connect', 'Amazon Japan'],
    aov_sweet_spot: ['5k_25k', '25k_100k'],
    market_size: '$80B apparel market',
    growth_rate: '2.8% YoY',
    avg_markup: '4–6x FOB',
    compliance_notes: ['JIS product standards compliance critical', 'Quality inspection at port', 'Japanese buyer requires sample approval process'],
    score_weights: { rmg: 75, leather: 80, jute: 85, handicrafts: 90, it_services: 70, pharma: 72, ceramics: 78, other: 65 },
  },
  aus_nz: {
    name: 'Australia & NZ',
    flag: '🇦🇺',
    best_categories: ['Ethical Fashion', 'Jute Products', 'Handicrafts', 'Leather'],
    platforms: ['Amazon Australia', 'Catch', 'Trade Me (NZ)', 'Alibaba'],
    aov_sweet_spot: ['5k_25k', 'under_5k'],
    market_size: '$28B apparel market',
    growth_rate: '5.2% YoY',
    avg_markup: '3–4.5x FOB',
    compliance_notes: ['Australian Competition & Consumer Commission standards', 'Labelling requirements strict', 'Standard EXP form applies'],
    score_weights: { rmg: 78, leather: 75, jute: 80, handicrafts: 82, it_services: 72, pharma: 60, ceramics: 65, other: 70 },
  },
  south_america: {
    name: 'South America',
    flag: '🌎',
    best_categories: ['Textiles', 'Leather Goods', 'Jute'],
    platforms: ['Mercado Libre', 'Alibaba', 'B2B Brazil portals'],
    aov_sweet_spot: ['5k_25k'],
    market_size: '$68B apparel market',
    growth_rate: '8.1% YoY',
    avg_markup: '2–3.5x FOB',
    compliance_notes: ['Currency risk: USD LC strongly recommended', 'Brazil import duties high — factor into pricing', 'EXP form required as standard'],
    score_weights: { rmg: 70, leather: 75, jute: 65, handicrafts: 60, it_services: 65, pharma: 58, ceramics: 55, other: 60 },
  },
  mea: {
    name: 'Middle East & Africa',
    flag: '🌍',
    best_categories: ['Garments', 'Pharmaceuticals', 'Ceramics', 'Handicrafts'],
    platforms: ['Dubai Expo portals', 'Alibaba MEA', 'Africa B2B'],
    aov_sweet_spot: ['25k_100k', '5k_25k'],
    market_size: '$95B apparel market (MEA)',
    growth_rate: '12% YoY',
    avg_markup: '2.5–4x FOB',
    compliance_notes: ['Halal certification needed for Gulf markets', 'Aramex/DHL for logistics', 'UAE free zones offer simplified setup'],
    score_weights: { rmg: 85, leather: 72, jute: 68, handicrafts: 75, it_services: 70, pharma: 90, ceramics: 82, other: 72 },
  },
};

// ─── Interview Questions ───────────────────────────────────────────────────────

export const INTERVIEW_QUESTIONS = [
  {
    id: 'q1',
    field: 'product_category',
    question: 'What product category does your business primarily export?',
    hint: 'e.g. Ready-Made Garments, Leather Goods, Jute Products, Handicrafts, IT Services, Pharmaceuticals, Ceramics',
    type: 'open' as const,
  },
  {
    id: 'q2',
    field: 'avg_order_value',
    question: 'What is your average order value (AOV) per shipment?',
    hint: 'This helps identify whether to focus on B2B platforms or direct brand partnerships.',
    type: 'choice' as const,
    options: [
      { value: 'under_5k', label: 'Under USD 5,000' },
      { value: '5k_25k', label: 'USD 5,000 – 25,000' },
      { value: '25k_100k', label: 'USD 25,000 – 100,000' },
      { value: 'over_100k', label: 'Over USD 100,000' },
    ],
  },
  {
    id: 'q3',
    field: 'exp_form_status',
    question: 'Have you submitted an EXP form for previous export transactions?',
    hint: 'This determines your AD bank authorization status under FE Circular 42.',
    type: 'choice' as const,
    options: [
      { value: 'filed_regularly', label: 'Yes, we file regularly with our AD bank' },
      { value: 'filed_once', label: 'Yes, we\'ve filed once or twice' },
      { value: 'in_progress', label: 'We\'re in the process of setting up' },
      { value: 'not_filed', label: 'Not yet — we\'re new to formal exports' },
    ],
  },
  {
    id: 'q4',
    field: 'ad_bank',
    question: 'Which Authorized Dealer (AD) bank do you currently work with?',
    hint: 'e.g. BRAC Bank, Dutch-Bangla Bank, Standard Chartered Bangladesh, IFIC Bank, Sonali Bank',
    type: 'open' as const,
  },
  {
    id: 'q5',
    field: 'growth_goals',
    question: 'What are your primary growth goals for the next 12 months?',
    hint: 'Select all that apply.',
    type: 'multi' as const,
    options: [
      { value: 'increase_volume', label: 'Increase order volume with existing buyers' },
      { value: 'new_markets', label: 'Enter 1–2 new export markets' },
      { value: 'premium_buyers', label: 'Upgrade to premium or sustainable buyers' },
      { value: 'd2c_channel', label: 'Launch direct-to-consumer (D2C) export channel' },
    ],
  },
];

// ─── Helper: Score regions for a given interview response ───────────────────

type ProductCategoryKey = keyof typeof REGIONAL_MATRIX[Region]['score_weights'];

function categorizeProduct(category: string): ProductCategoryKey {
  const lower = category.toLowerCase();
  if (lower.includes('garment') || lower.includes('rmg') || lower.includes('textile') || lower.includes('knit') || lower.includes('apparel')) return 'rmg';
  if (lower.includes('leather') || lower.includes('shoe') || lower.includes('footwear') || lower.includes('bag')) return 'leather';
  if (lower.includes('jute')) return 'jute';
  if (lower.includes('handicraft') || lower.includes('craft') || lower.includes('art')) return 'handicrafts';
  if (lower.includes('it') || lower.includes('software') || lower.includes('tech') || lower.includes('digital')) return 'it_services';
  if (lower.includes('pharma') || lower.includes('medicine') || lower.includes('drug')) return 'pharma';
  if (lower.includes('ceramic') || lower.includes('pottery')) return 'ceramics';
  return 'other';
}

export function scoreRegions(
  interviewData: Partial<AIInterviewData>,
  selectedRegions: Region[]
): Array<{ region: Region; score: number }> {
  const productKey = interviewData.product_category
    ? categorizeProduct(interviewData.product_category)
    : 'other';

  const aov = interviewData.avg_order_value ?? '5k_25k';

  return selectedRegions
    .map((region) => {
      const matrix = REGIONAL_MATRIX[region];
      let score = matrix.score_weights[productKey];

      // AOV adjustment
      if (matrix.aov_sweet_spot.includes(aov)) score += 8;
      else if (aov === 'over_100k' && !matrix.aov_sweet_spot.includes('over_100k')) score -= 10;
      else if (aov === 'under_5k' && !matrix.aov_sweet_spot.includes('under_5k')) score -= 5;

      // Cap score at 100
      score = Math.min(100, Math.max(0, score));

      return { region, score };
    })
    .sort((a, b) => b.score - a.score);
}

// ─── AD Bank Script Template ───────────────────────────────────────────────────

export function generateADBankScript(data: {
  name?: string;
  company?: string;
  erc_number?: string;
  regions: Region[];
  annual_value?: string;
}): string {
  const regionNames = data.regions
    .slice(0, 3)
    .map((r) => REGIONAL_MATRIX[r].name)
    .join(' and ');

  return `"Dear Sir/Madam, I am ${data.name ?? '[Your Name]'}, ${
    data.erc_number ? `proprietor of ${data.company ?? '[Company Name]'} (ERC No: ${data.erc_number})` : `representative of ${data.company ?? '[Company Name]'}`
  }, a registered exporter from Bangladesh. 

I wish to formalize my export banking arrangements under FE Circular 43 for receiving foreign exchange proceeds. My primary export destinations are ${regionNames}. I plan to receive payments via Payoneer and other digital platforms, which I would like to route through this Authorized Dealer bank for EXP form certification and repatriation compliance under FE Circular 48.

My projected annual export turnover is approximately ${data.annual_value ?? 'USD [Amount]'}. Could you guide me on:
1. The documentation required to open or formalize my export account
2. Your process for EXP form endorsement under FE Circular 42
3. The ERQ (Export Retention Quota) account setup for retaining up to 60% of proceeds
4. Your timeline for processing export documentation

Thank you for your assistance."`;
}
