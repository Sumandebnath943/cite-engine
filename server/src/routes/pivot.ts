import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import getOpenAI from '../lib/openai';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ── Helper: safe JSON parse from GPT ──────────────────────────────
function parseGptJson<T>(content: string): T {
  const cleaned = content.replace(/```json\n?|```/g, '').trim();
  return JSON.parse(cleaned) as T;
}

// ── POST /api/pivot/translate ─────────────────────────────────────
router.post('/translate', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { resumeText, currentRole, targetRole, targetIndustry, additionalContext } = req.body;

  if (!resumeText || !currentRole || !targetRole || !targetIndustry) {
    res.status(400).json({ error: 'resumeText, currentRole, targetRole, and targetIndustry are required' });
    return;
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are CITE's Career Pivot Translation Engine — the world's most sophisticated professional identity rewriter. You are not a resume editor. You are a cognitive linguist for careers.

Your job: Take a professional's existing experience written in the dialect of their CURRENT industry and completely rewrite it in the precise dialect, terminology, metrics, and cultural language of their TARGET industry.

Rules:
1. Never invent experience they don't have. Reframe what exists.
2. Use the exact power verbs, KPIs, and buzzwords hiring managers in the target industry expect to see.
3. Every bullet point must follow the format: [Action Verb] + [What] + [Measurable Impact]
4. Identify 3-5 non-obvious transferable skills the user doesn't realize they have.
5. Rewrite their LinkedIn headline and summary section.
6. Generate a professional bio (3rd person, 120 words).

Return ONLY a valid JSON object with this exact structure:
{
  "translatedBullets": [
    { "original": "...", "translated": "...", "skill": "transferable skill identified" }
  ],
  "linkedInHeadline": "...",
  "linkedInSummary": "...",
  "professionalBio": "...",
  "hiddenTransferableSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "industryDialectNotes": "2-3 sentences explaining key language shifts made",
  "confidenceScore": 85
}`,
        },
        {
          role: 'user',
          content: `Current Role: ${currentRole}
Target Role: ${targetRole}
Target Industry: ${targetIndustry}
Resume/Experience: ${resumeText}
Additional Context: ${additionalContext || 'None provided'}`,
        },
      ],
    });

    const content = completion.choices[0].message.content ?? '{}';
    const result = parseGptJson<object>(content);

    // Persist to DB
    await prisma.resume.create({
      data: {
        userId: req.userId!,
        filename: `${currentRole} → ${targetRole}`,
        rawText: resumeText,
        targetRole,
        translatedResume: JSON.stringify(result),
      },
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[pivot/translate]', err);
    res.status(500).json({ error: 'Translation failed', message: (err as Error).message });
  }
});

// ── POST /api/pivot/learning-path ─────────────────────────────────
router.post('/learning-path', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentSkills, targetRole, targetIndustry, translationResult } = req.body;

  if (!targetRole || !targetIndustry) {
    res.status(400).json({ error: 'targetRole and targetIndustry are required' });
    return;
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are CITE's Career Upskilling Intelligence Engine.

Analyze the gap between a professional's current skillset and their target role.
Return ONLY a valid JSON object:
{
  "gapAnalysis": "2-3 sentence honest assessment of the skill gap",
  "urgentSkills": [
    {
      "skill": "...",
      "reason": "...",
      "timeToLearn": "X weeks",
      "resource": "...",
      "resourceUrl": "https://...",
      "priority": "critical|high|medium"
    }
  ],
  "strengthsToLeverage": ["...", "...", "..."],
  "estimatedReadinessTimeline": "X months",
  "readinessPercentage": 72
}`,
        },
        {
          role: 'user',
          content: `Target Role: ${targetRole}
Target Industry: ${targetIndustry}
Current Skills: ${currentSkills || 'Not specified'}
Translation Context: ${translationResult ? JSON.stringify(translationResult).slice(0, 1000) : 'Not provided'}`,
        },
      ],
    });

    const content = completion.choices[0].message.content ?? '{}';
    const result = parseGptJson<object>(content);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[pivot/learning-path]', err);
    res.status(500).json({ error: 'Learning path generation failed', message: (err as Error).message });
  }
});

// ── POST /api/pivot/linkedin-optimize ────────────────────────────
router.post('/linkedin-optimize', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { linkedInData, targetRole } = req.body;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `You are a LinkedIn optimization expert. Rewrite the provided LinkedIn content for the target role.
Return ONLY a valid JSON object:
{
  "headline": "...",
  "summary": "...",
  "featuredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}`,
        },
        {
          role: 'user',
          content: `Target Role: ${targetRole}\nLinkedIn Data: ${JSON.stringify(linkedInData)}`,
        },
      ],
    });

    const content = completion.choices[0].message.content ?? '{}';
    const result = parseGptJson<object>(content);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[pivot/linkedin-optimize]', err);
    res.status(500).json({ error: 'LinkedIn optimization failed', message: (err as Error).message });
  }
});

// ── GET /api/pivot/history ────────────────────────────────────────
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        filename: true,
        targetRole: true,
        translatedResume: true,
        learningPath: true,
        createdAt: true,
      },
    });

    const history = resumes.map((r) => {
      const parts = r.filename.split(' → ');
      let translationResult = null;
      let learningPath = null;
      try { if (r.translatedResume) translationResult = JSON.parse(r.translatedResume); } catch {}
      try { if (r.learningPath) learningPath = JSON.parse(r.learningPath); } catch {}

      return {
        id: r.id,
        currentRole: parts[0] || '',
        targetRole: parts[1] || r.targetRole || '',
        targetIndustry: '',
        confidenceScore: translationResult?.confidenceScore ?? 0,
        createdAt: r.createdAt.toISOString(),
        translationResult,
        learningPath,
      };
    });

    res.json({ success: true, data: history });
  } catch (err) {
    console.error('[pivot/history]', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
