import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { EXPORT_GUIDE_SYSTEM_PROMPT } from '@/lib/ai-prompts'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    const { messages } = await req.json()

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: EXPORT_GUIDE_SYSTEM_PROMPT,
      messages,
      maxTokens: 600,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('AI chat error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
