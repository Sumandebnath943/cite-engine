import { create } from 'zustand';

// ── Types ─────────────────────────────────────────────────────────
export interface TranslatedBullet {
  original: string;
  translated: string;
  skill: string;
}

export interface TranslationResult {
  translatedBullets: TranslatedBullet[];
  linkedInHeadline: string;
  linkedInSummary: string;
  professionalBio: string;
  hiddenTransferableSkills: string[];
  industryDialectNotes: string;
  confidenceScore: number;
}

export interface UrgentSkill {
  skill: string;
  reason: string;
  timeToLearn: string;
  resource: string;
  resourceUrl: string;
  priority: 'critical' | 'high' | 'medium';
}

export interface LearningPath {
  gapAnalysis: string;
  urgentSkills: UrgentSkill[];
  strengthsToLeverage: string[];
  estimatedReadinessTimeline: string;
  readinessPercentage: number;
}

export interface HistoryRecord {
  id: string;
  currentRole: string;
  targetRole: string;
  targetIndustry: string;
  confidenceScore: number;
  createdAt: string;
  translationResult?: TranslationResult;
  learningPath?: LearningPath;
}

export interface PivotFormData {
  resumeText: string;
  currentRole: string;
  targetRole: string;
  targetIndustry: string;
  additionalContext: string;
}

type Phase = 'input' | 'loading' | 'results';

interface PivotState {
  phase: Phase;
  formData: PivotFormData;
  translationResult: TranslationResult | null;
  learningPath: LearningPath | null;
  isLoading: boolean;
  error: string | null;
  history: HistoryRecord[];

  setPhase: (p: Phase) => void;
  setFormData: (d: Partial<PivotFormData>) => void;
  setResults: (t: TranslationResult, l: LearningPath) => void;
  setError: (e: string | null) => void;
  setHistory: (h: HistoryRecord[]) => void;
  loadHistoryResult: (r: HistoryRecord) => void;
  resetAll: () => void;
}

const defaultForm: PivotFormData = {
  resumeText: '',
  currentRole: '',
  targetRole: '',
  targetIndustry: '',
  additionalContext: '',
};

export const usePivotStore = create<PivotState>((set) => ({
  phase: 'input',
  formData: defaultForm,
  translationResult: null,
  learningPath: null,
  isLoading: false,
  error: null,
  history: [],

  setPhase: (phase) => set({ phase }),
  setFormData: (d) => set((s) => ({ formData: { ...s.formData, ...d } })),
  setResults: (translationResult, learningPath) =>
    set({ translationResult, learningPath, isLoading: false, phase: 'results' }),
  setError: (error) => set({ error, isLoading: false }),
  setHistory: (history) => set({ history }),
  loadHistoryResult: (r) =>
    set({
      phase: r.translationResult ? 'results' : 'input',
      translationResult: r.translationResult ?? null,
      learningPath: r.learningPath ?? null,
      formData: {
        ...defaultForm,
        currentRole: r.currentRole,
        targetRole: r.targetRole,
        targetIndustry: r.targetIndustry,
      },
    }),
  resetAll: () =>
    set({
      phase: 'input',
      formData: defaultForm,
      translationResult: null,
      learningPath: null,
      error: null,
      isLoading: false,
    }),
}));
