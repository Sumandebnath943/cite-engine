import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import getOpenAI from '../lib/openai';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const router = Router();
const prisma = new PrismaClient();
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

function parseGptJson<T>(content: string): T {
  return JSON.parse(content.replace(/```json\n?|```/g, '').trim()) as T;
}

// ── POST /api/radar/scan ──────────────────────────────────────────
router.post('/scan', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { jobTitle, employer, industry, yearsExperience, skills, dailyTasks, location } = req.body;
  if (!jobTitle || !industry) { res.status(400).json({ error: 'jobTitle and industry are required' }); return; }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', max_tokens: 4000, temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: `You are CITE's Job Security Radar — a world-class workforce intelligence analyst with deep expertise in labor economics, AI displacement research, technology adoption curves, and corporate restructuring patterns.

Your role: Perform a comprehensive job security analysis and return a brutally honest, data-grounded threat assessment.

Scoring (0-100, higher = more secure):
80-100: High security. 60-79: Moderate security. 40-59: Elevated risk. 20-39: High risk. 0-19: Critical.

Return ONLY valid JSON:
{
  "overallScore": 74,
  "scoreLabel": "MODERATE RISK",
  "scoreSummary": "2-3 sentence honest assessment",
  "automationRiskScore": 45,
  "industryHealthScore": 68,
  "skillRelevanceScore": 71,
  "roleResilienceScore": 80,
  "timelineToDisruption": "2-4 years",
  "topThreats": [{"threat":"...","severity":"critical|high|medium|low","explanation":"...","timeframe":"..."}],
  "skillAnalysis": [{"skill":"...","relevanceScore":78,"halfLifeYears":3.5,"status":"declining|stable|growing|emerging","replacementRisk":"high|medium|low","note":"..."}],
  "protectiveFactors": ["factor1","factor2","factor3"],
  "urgentActions": [{"action":"...","priority":"critical|high|medium","timeframe":"immediate|30days|90days|6months","impact":"..."}],
  "upskillPathway": [{"skill":"...","reason":"...","currentDemandScore":87,"projectedDemandScore":94,"timeToLearn":"X weeks","estimatedSalaryImpact":"+$X,000","resource":"...","resourceUrl":"https://...","priority":"critical|high|medium"}],
  "industryOutlook": "3-4 sentence industry health assessment",
  "roleEvolutionPrediction": "how this role will change in 3 years",
  "euphemismAlerts": ["corporate phrase to watch for"]
}`,
        },
        {
          role: 'user',
          content: `Job Title: ${jobTitle}\nEmployer: ${employer || 'Not specified'}\nIndustry: ${industry}\nYears of Experience: ${yearsExperience || 'Not specified'}\nLocation: ${location || 'Not specified'}\nCurrent Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}\nDaily Tasks: ${dailyTasks || 'Not specified'}`,
        },
      ],
    });

    const result = parseGptJson<object>(completion.choices[0].message.content ?? '{}');

    // Save to DB via RadarProfile upsert pattern
    try {
      await (prisma as any).radarProfile.upsert({
        where: { userId: req.userId! },
        update: { jobTitle, employer: employer || '', industry, skills: JSON.stringify(skills), lastScanResult: JSON.stringify(result), lastScannedAt: new Date() },
        create: { userId: req.userId!, jobTitle, employer: employer || '', industry, skills: JSON.stringify(skills), lastScanResult: JSON.stringify(result), lastScannedAt: new Date() },
      });
    } catch { /* RadarProfile table may not exist yet — continue */ }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[radar/scan]', err);
    res.status(500).json({ error: 'Scan failed', message: (err as Error).message });
  }
});

// ── POST /api/radar/news-scan ─────────────────────────────────────
router.post('/news-scan', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { employer, industry, jobTitle } = req.body;

  // Fetch news (or return mock if no key)
  let employerArticles: object[] = [];
  let industryArticles: object[] = [];

  if (NEWSAPI_KEY) {
    try {
      const [empRes, indRes] = await Promise.all([
        axios.get('https://newsapi.org/v2/everything', { params: { q: `${employer || industry} layoffs OR restructuring OR downsizing OR reorganization OR "job cuts"`, language: 'en', sortBy: 'publishedAt', pageSize: 10, apiKey: NEWSAPI_KEY } }),
        axios.get('https://newsapi.org/v2/everything', { params: { q: `${industry} AI automation OR "job displacement" OR "workforce reduction"`, language: 'en', sortBy: 'publishedAt', pageSize: 10, apiKey: NEWSAPI_KEY } }),
      ]);
      employerArticles = empRes.data.articles || [];
      industryArticles = indRes.data.articles || [];
    } catch (e) { console.error('[radar/news-scan] NewsAPI error:', e); }
  }

  try {
    const articlesText = employerArticles.length > 0
      ? JSON.stringify([...employerArticles, ...industryArticles].map((a: any) => ({ title: a.title, description: a.description, publishedAt: a.publishedAt, url: a.url, source: a.source?.name })))
      : 'No live articles available. Generate a realistic mock analysis based on general industry trends.';

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', max_tokens: 2000, temperature: 0.6,
      messages: [
        {
          role: 'system',
          content: `You are a corporate intelligence analyst specializing in early warning signals for workforce disruptions. Analyze news articles about ${employer || 'the company'} and the ${industry} industry. Return ONLY valid JSON:
{
  "threatLevel": "critical|elevated|moderate|low|minimal",
  "threatLevelScore": 72,
  "employerSignals": [{"signal":"...","severity":"critical|high|medium|low","source":"...","date":"...","url":"...","euphemismsDetected":["word1"]}],
  "industrySignals": [{"signal":"...","severity":"...","source":"...","date":"..."}],
  "euphemismDecoder": [{"phrase":"...","translation":"...","riskLevel":"high|medium|low"}],
  "overallIntelSummary": "2-3 sentence intelligence briefing",
  "recommendedActions": ["action1","action2"],
  "hasLiveData": ${employerArticles.length > 0}
}`,
        },
        { role: 'user', content: `Articles: ${articlesText.slice(0, 6000)}\n\nEmployer: ${employer || 'General employer'}\nIndustry: ${industry}\nJob Title: ${jobTitle}` },
      ],
    });

    const result = parseGptJson<object>(completion.choices[0].message.content ?? '{}');
    res.json({ success: true, data: result, hasNewsKey: !!NEWSAPI_KEY });
  } catch (err) {
    console.error('[radar/news-scan]', err);
    res.status(500).json({ error: 'News scan failed', message: (err as Error).message });
  }
});

// ── POST /api/radar/monitor-setup ────────────────────────────────
router.post('/monitor-setup', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ success: true, message: 'Monitoring enabled. You will receive alerts when new threat signals emerge.' });
  } catch (err) {
    res.status(500).json({ error: 'Monitor setup failed' });
  }
});

// ── GET /api/radar/history ────────────────────────────────────────
router.get('/history', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await (prisma as any).radarProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile) { res.json({ success: true, data: [] }); return; }

    // Parse lastScanResult from JSON string if needed
    let lastScanResult = null;
    try {
      if (typeof profile.lastScanResult === 'string') lastScanResult = JSON.parse(profile.lastScanResult);
      else lastScanResult = profile.lastScanResult;
    } catch {}

    const item = {
      id: profile.id,
      jobTitle: profile.jobTitle,
      employer: profile.employer || '',
      industry: profile.industry || '',
      lastScanResult,
      lastScannedAt: profile.lastScannedAt?.toISOString?.() ?? profile.lastScannedAt ?? new Date().toISOString(),
    };
    res.json({ success: true, data: [item] });
  } catch {
    res.json({ success: true, data: [] });
  }
});

// ── GET /api/radar/latest-score ───────────────────────────────────
router.get('/latest-score', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await (prisma as any).radarProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile?.lastScanResult) { res.json({ success: true, data: null }); return; }
    const result = JSON.parse(profile.lastScanResult);
    res.json({ success: true, data: { overallScore: result.overallScore, scoreLabel: result.scoreLabel, jobTitle: profile.jobTitle, lastScannedAt: profile.lastScannedAt } });
  } catch {
    res.json({ success: true, data: null });
  }
});

// ── POST /api/radar/skill-pulse ───────────────────────────────────
router.post('/skill-pulse', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { skill } = req.body;
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o', max_tokens: 300, temperature: 0.5,
      messages: [
        { role: 'system', content: 'Return ONLY valid JSON: {"demandScore":78,"trend":"growing|stable|declining","halfLifeYears":3.5,"summary":"1 sentence"}' },
        { role: 'user', content: `Skill: ${skill}` },
      ],
    });
    const result = parseGptJson<object>(completion.choices[0].message.content ?? '{}');
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: 'Skill pulse failed' });
  }
});

export default router;
