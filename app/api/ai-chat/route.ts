// /app/api/ai-chat/route.ts
// Tradeshifters — ExportGuide AI Chat Endpoint (Vercel AI SDK)

import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { EXPORT_GUIDE_SYSTEM_PROMPT } from '@/lib/ai-prompts';
import { AIChatRequestSchema } from '@/lib/validators';
import { createServerClientInstance } from '@/lib/supabase';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const runtime = 'edge';

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = createServerClientInstance();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse + validate request body
    const body = await req.json();
    const parsed = AIChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, session_id, interview_context } = parsed.data;

    // 3. Build contextual system prompt
    const contextualPrompt = buildContextualPrompt(interview_context);

    // 4. Stream response using Vercel AI SDK
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: contextualPrompt,
      messages: convertToCoreMessages(messages),
      maxTokens: 600,
      temperature: 0.7,
      onFinish: async ({ text }) => {
        // 5. Persist assistant message to Supabase if session exists
        if (session_id) {
          await persistMessage(supabase, session_id, user.id, messages, text);
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error('[ai-chat] Error:', err);

    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── Helper: Build context-aware system prompt ────────────────────────────────

function buildContextualPrompt(context?: Partial<{
  product_category: string | null;
  avg_order_value: string | null;
  exp_form_status: string | null;
  ad_bank: string | null;
}>) {
  let prompt = EXPORT_GUIDE_SYSTEM_PROMPT;

  if (context && Object.values(context).some(Boolean)) {
    prompt += '\n\n## Current Session Context (already collected)\n';
    if (context.product_category) prompt += `- Product Category: ${context.product_category}\n`;
    if (context.avg_order_value) prompt += `- AOV Range: ${context.avg_order_value}\n`;
    if (context.exp_form_status) prompt += `- EXP Form Status: ${context.exp_form_status}\n`;
    if (context.ad_bank) prompt += `- AD Bank: ${context.ad_bank}\n`;
    prompt += '\nDo NOT re-ask questions about data points already collected above.';
  }

  return prompt;
}

// ─── Helper: Persist conversation to Supabase ─────────────────────────────────

async function persistMessage(
  supabase: ReturnType<typeof createServerClientInstance>,
  sessionId: string,
  userId: string,
  userMessages: Array<{ role: string; content: string }>,
  assistantResponse: string
) {
  try {
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Append to raw_responses in assessment_sessions.ai_interview_data
    const { data: session } = await supabase
      .from('assessment_sessions')
      .select('ai_interview_data')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!session) return;

    const existing = session.ai_interview_data ?? { raw_responses: [] };
    const rawResponses = existing.raw_responses ?? [];

    rawResponses.push({
      role: 'user' as const,
      content: lastUserMessage.content,
      timestamp: new Date().toISOString(),
    });
    rawResponses.push({
      role: 'assistant' as const,
      content: assistantResponse,
      timestamp: new Date().toISOString(),
    });

    await supabase
      .from('assessment_sessions')
      .update({
        ai_interview_data: { ...existing, raw_responses: rawResponses },
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('user_id', userId);
  } catch (err) {
    // Non-fatal — log and continue
    console.error('[ai-chat] persist error:', err);
  }
}
