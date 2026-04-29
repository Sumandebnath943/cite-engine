import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ── GET /api/dashboard/stats ──────────────────────────────────────
router.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalPivots, totalScripts, radarProfile] = await Promise.all([
      prisma.resume.count({ where: { userId: req.userId! } }),
      prisma.conversation.count({ where: { userId: req.userId! } }),
      (prisma as any).radarProfile.findUnique({ where: { userId: req.userId! }, select: { lastScanResult: true } }),
    ]);

    let latestScore: number | null = null;
    let scoreLabel: string | null = null;
    if (radarProfile?.lastScanResult) {
      try {
        const r = JSON.parse(radarProfile.lastScanResult);
        latestScore = r.overallScore ?? null;
        scoreLabel = r.scoreLabel ?? null;
      } catch {}
    }

    res.json({
      success: true,
      data: {
        totalPivots,
        totalScripts,
        totalScans: radarProfile ? 1 : 0,
        latestScore,
        scoreLabel,
      },
    });
  } catch (err) {
    console.error('[dashboard/stats]', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ── GET /api/dashboard/activity ───────────────────────────────────
router.get('/activity', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [resumes, conversations, radarProfile] = await Promise.all([
      prisma.resume.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, targetRole: true, rawText: true, createdAt: true },
      }),
      prisma.conversation.findMany({
        where: { userId: req.userId! },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, scenario: true, createdAt: true },
      }),
      (prisma as any).radarProfile.findUnique({
        where: { userId: req.userId! },
        select: { jobTitle: true, lastScanResult: true, lastScannedAt: true },
      }),
    ]);

    const items: object[] = [];

    resumes.forEach((r: any) => {
      items.push({
        type: 'pivot',
        description: r.targetRole ? `Translated resume → ${r.targetRole}` : 'Ran career pivot analysis',
        createdAt: r.createdAt,
        linkPath: '/dashboard/pivot',
      });
    });

    conversations.forEach((c: any) => {
      items.push({
        type: 'copilot',
        description: `Generated script: ${c.scenario || 'Conversation'}`,
        createdAt: c.createdAt,
        linkPath: '/dashboard/copilot',
      });
    });

    if (radarProfile?.lastScannedAt) {
      let score: number | null = null;
      try { score = JSON.parse(radarProfile.lastScanResult).overallScore; } catch {}
      items.push({
        type: 'radar',
        description: `Ran radar scan: ${radarProfile.jobTitle}${score ? ` — Score ${score}` : ''}`,
        createdAt: radarProfile.lastScannedAt,
        linkPath: '/dashboard/radar',
      });
    }

    items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ success: true, data: items.slice(0, 10) });
  } catch (err) {
    console.error('[dashboard/activity]', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// ── PUT /api/user/profile ─────────────────────────────────────────
router.put('/profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.userId! },
      data: { name },
      select: { id: true, name: true, email: true },
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ── DELETE /api/dashboard/account ────────────────────────────────
router.delete('/account', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: req.userId! } });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
