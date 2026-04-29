import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import getOpenAI from '../lib/openai';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

function parseGptJson<T>(content: string): T {
  return JSON.parse(content.replace(/```json\n?|```/g, '').trim()) as T;
}

// ── POST /api/copilot/generate-script ────────────────────────────
router.post('/generate-script', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { scenarioType, rawContext, desiredTone, nonNegotiables, relationshipPreservation, counterpartyDescription } = req.body;
  if (!scenarioType || !rawContext) { res.status(400).json({ error: 'scenarioType and rawContext are required' }); return; }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', max_tokens: 4000, temperature: 0.75,
      messages: [
        {
          role: 'system',
          content: `You are CITE's Conversation Copilot — a world-class communication strategist, negotiation coach, and emotional intelligence expert combined.

Your role: Transform raw emotional context into a perfectly calibrated communication script. You strip away counterproductive emotion, identify the user's core interests vs. stated positions, and craft language that achieves the desired outcome while preserving relationships where possible.

You have deep expertise in:
- Salary negotiation (anchoring, BATNA, market positioning)
- Workplace conflict resolution (nonviolent communication, interest-based negotiation)
- Difficult personal conversations (boundary setting, relationship repair)
- High-stakes business communication (co-founder disputes, investor conversations)
- Employment transitions (resignations, terminations, performance conversations)

Rules:
1. Always lead with empathy acknowledgment before advocacy
2. Use the user's specific details — never generic advice
3. Anticipate the top 3 objections the counterparty will raise
4. Provide exact word-for-word scripts, not vague guidance
5. Calibrate language precisely to the requested tone
6. Include a "nuclear option" fallback line for worst-case resistance

Return ONLY valid JSON:
{
  "scenarioSummary": "1 sentence objective summary",
  "emotionalRisks": ["risk1", "risk2", "risk3"],
  "openingStatement": "exact word-for-word opening line",
  "coreScript": [{"beat":"Opening","yourLine":"...","purpose":"...","toneNote":"..."}],
  "anticipatedObjections": [{"objection":"...","counterResponse":"...","psychologyNote":"..."}],
  "closingStatement": "exact closing line",
  "nuclearOption": "last resort line",
  "emailVersion": "full email version if applicable",
  "toneAnalysis": "2 sentences on communication strategy",
  "confidenceScore": 88
}`,
        },
        {
          role: 'user',
          content: `Scenario: ${scenarioType}\nContext: ${rawContext}\nTone: ${desiredTone}\nNon-negotiables: ${nonNegotiables}\nRelationship preservation: ${relationshipPreservation}%\nCounterparty: ${counterpartyDescription}`,
        },
      ],
    });
    const result = parseGptJson<object>(completion.choices[0].message.content ?? '{}');
    await prisma.conversation.create({ data: { userId: req.userId!, scenario: scenarioType, tone: desiredTone, script: JSON.stringify(result) } });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[copilot/generate-script]', err);
    res.status(500).json({ error: 'Script generation failed', message: (err as Error).message });
  }
});

// ── POST /api/copilot/roleplay-message ───────────────────────────
router.post('/roleplay-message', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { conversationHistory, personaDescription, scenarioContext, difficultyLevel, userObjective } = req.body;

  const behaviorMap: Record<string, string> = {
    cooperative: 'Somewhat open, but have concerns. Ask clarifying questions. Occasionally push back but yield to good arguments.',
    neutral: 'Professional and measured. Neither helping nor blocking. Require clear justification before agreeing to anything.',
    resistant: 'Have strong objections. Use corporate/deflection language. Bring up budget, policy, timing. Require significant persuasion.',
    hostile: 'Dismissive, defensive, or aggressive. Use gaslighting tactics, blame-shifting, or stonewalling. Only yield if the argument is exceptionally well-constructed.',
  };

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', max_tokens: 600, temperature: 0.85,
      messages: [
        {
          role: 'system',
          content: `You are roleplaying as ${personaDescription} in a high-stakes conversation.
Scenario: ${scenarioContext}
User's objective: ${userObjective}
Your resistance level: ${difficultyLevel}
Behavior: ${behaviorMap[difficultyLevel] || behaviorMap.neutral}

Stay completely in character. Do NOT break character. Do NOT be helpful as an AI. You ARE this person.
Keep responses to 2-4 sentences. Be realistic, not cartoonishly mean.
After your response, on a new line add: [SIGNAL: cooperative/resistant/hostile]`,
        },
        ...(conversationHistory || []),
      ],
    });

    const raw = completion.choices[0].message.content ?? '';
    const signalMatch = raw.match(/\[SIGNAL:\s*(cooperative|neutral|resistant|hostile)\]/i);
    const signal = signalMatch ? signalMatch[1].toLowerCase() : 'neutral';
    const text = raw.replace(/\[SIGNAL:[^\]]+\]/gi, '').trim();

    // Generate 3 quick suggestions for the user's next response
    let suggestions: string[] = [];
    try {
      const sugComp = await getOpenAI().chat.completions.create({
        model: 'gpt-4o', max_tokens: 200, temperature: 0.7,
        messages: [
          { role: 'system', content: 'Based on the roleplay conversation, suggest 3 short response options for the user (each max 12 words). Return as JSON array: ["option1","option2","option3"]' },
          { role: 'user', content: `Last AI message: "${text}"\nUser objective: ${userObjective}` },
        ],
      });
      suggestions = parseGptJson<string[]>(sugComp.choices[0].message.content ?? '[]');
    } catch { suggestions = ['Can you elaborate on that?', "I understand your concern, but...", 'Let me be direct about this.']; }

    res.json({ success: true, data: { text, signal, suggestions } });
  } catch (err) {
    console.error('[copilot/roleplay-message]', err);
    res.status(500).json({ error: 'Roleplay failed', message: (err as Error).message });
  }
});

// ── POST /api/copilot/analyze-roleplay ───────────────────────────
router.post('/analyze-roleplay', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { conversationHistory, userObjective, scenarioType } = req.body;
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', max_tokens: 2000, temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: `You are a communication coach analyzing a practice conversation. Return ONLY valid JSON:
{
  "overallScore": 78,
  "objectiveAchieved": true,
  "strengths": ["specific thing user did well"],
  "improvements": ["specific thing to improve with exact rephrasing"],
  "keyMoments": [{"userMessage":"...","analysis":"...","betterAlternative":"..."}],
  "emotionalIntelligenceScore": 82,
  "persuasionScore": 71,
  "clarityScore": 85,
  "finalVerdict": "2-3 sentence overall coaching summary"
}`,
        },
        { role: 'user', content: `Scenario: ${scenarioType}\nObjective: ${userObjective}\nConversation:\n${JSON.stringify(conversationHistory)}` },
      ],
    });
    const result = parseGptJson<object>(completion.choices[0].message.content ?? '{}');
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[copilot/analyze-roleplay]', err);
    res.status(500).json({ error: 'Analysis failed', message: (err as Error).message });
  }
});

// ── GET /api/copilot/history ──────────────────────────────────────
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const convs = await prisma.conversation.findMany({
      where: { userId: req.userId! }, orderBy: { createdAt: 'desc' }, take: 10,
      select: { id: true, scenario: true, tone: true, createdAt: true },
    });
    res.json({ success: true, data: convs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ── POST /api/copilot/save ────────────────────────────────────────
router.post('/save', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { scenario, tone, script, messages } = req.body;
  try {
    const conv = await prisma.conversation.create({
      data: { userId: req.userId!, scenario, tone, script: JSON.stringify(script), messages: JSON.stringify(messages) },
    });
    res.json({ success: true, data: conv });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save conversation' });
  }
});

export default router;
