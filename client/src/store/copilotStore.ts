import { create } from 'zustand';

export interface CopilotFormData {
  scenarioType: string;
  rawContext: string;
  desiredTone: 'Direct' | 'Diplomatic' | 'Assertive' | 'Empathetic' | '';
  nonNegotiables: string;
  counterpartyDescription: string;
  relationshipPreservation: number;
}

export interface ScriptBeat { beat: string; yourLine: string; purpose: string; toneNote: string; }
export interface Objection { objection: string; counterResponse: string; psychologyNote: string; }
export interface ScriptResult {
  scenarioSummary: string;
  emotionalRisks: string[];
  openingStatement: string;
  coreScript: ScriptBeat[];
  anticipatedObjections: Objection[];
  closingStatement: string;
  nuclearOption: string;
  emailVersion: string;
  toneAnalysis: string;
  confidenceScore: number;
}

export interface RoleplayMessage { role: 'user' | 'assistant'; content: string; signal?: string; timestamp: number; }

export interface KeyMoment { userMessage: string; analysis: string; betterAlternative: string; }
export interface AnalysisResult {
  overallScore: number;
  objectiveAchieved: boolean;
  strengths: string[];
  improvements: string[];
  keyMoments: KeyMoment[];
  emotionalIntelligenceScore: number;
  persuasionScore: number;
  clarityScore: number;
  finalVerdict: string;
}

// ── History ────────────────────────────────────────────────────────
export interface CopilotHistoryRecord {
  id: string;
  scenarioType: string;
  createdAt: string;
  scriptResult?: ScriptResult | null;
  confidenceScore?: number;
}

type Phase = 'setup' | 'loading-script' | 'script' | 'loading-roleplay' | 'roleplay' | 'loading-analysis' | 'analysis';

const defaultForm: CopilotFormData = {
  scenarioType: '', rawContext: '', desiredTone: '', nonNegotiables: '',
  counterpartyDescription: '', relationshipPreservation: 50,
};

interface CopilotState {
  phase: Phase;
  formData: CopilotFormData;
  scriptResult: ScriptResult | null;
  messages: RoleplayMessage[];
  difficultyLevel: 'cooperative' | 'neutral' | 'resistant' | 'hostile';
  suggestions: string[];
  analysisResult: AnalysisResult | null;
  sessionStart: number | null;
  isAITyping: boolean;
  error: string | null;
  history: CopilotHistoryRecord[];
  isFromHistory: boolean;

  setPhase: (p: Phase) => void;
  setFormData: (d: Partial<CopilotFormData>) => void;
  setScriptResult: (r: ScriptResult) => void;
  addMessage: (m: RoleplayMessage) => void;
  setDifficulty: (d: CopilotState['difficultyLevel']) => void;
  setSuggestions: (s: string[]) => void;
  setAITyping: (v: boolean) => void;
  setAnalysisResult: (r: AnalysisResult) => void;
  startSession: () => void;
  setError: (e: string | null) => void;
  resetAll: () => void;
  resetToScript: () => void;
  resetToRoleplay: () => void;
  setHistory: (h: CopilotHistoryRecord[]) => void;
  loadFromHistory: (record: CopilotHistoryRecord) => void;
}

export const useCopilotStore = create<CopilotState>((set) => ({
  phase: 'setup', formData: defaultForm, scriptResult: null, messages: [],
  difficultyLevel: 'neutral', suggestions: [], analysisResult: null,
  sessionStart: null, isAITyping: false, error: null,
  history: [], isFromHistory: false,

  setPhase: (phase) => set({ phase }),
  setFormData: (d) => set((s) => ({ formData: { ...s.formData, ...d } })),
  setScriptResult: (scriptResult) => set({ scriptResult, phase: 'script', isFromHistory: false }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setDifficulty: (difficultyLevel) => set({ difficultyLevel }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setAITyping: (isAITyping) => set({ isAITyping }),
  setAnalysisResult: (analysisResult) => set({ analysisResult, phase: 'analysis' }),
  startSession: () => set({ sessionStart: Date.now(), messages: [], phase: 'roleplay' }),
  setError: (error) => set({ error }),
  setHistory: (history) => set({ history }),

  loadFromHistory: (record) => set({
    phase: record.scriptResult ? 'script' : 'setup',
    scriptResult: record.scriptResult ?? null,
    formData: { ...defaultForm, scenarioType: record.scenarioType },
    messages: [],
    analysisResult: null,
    isFromHistory: true,
  }),

  resetAll: () => set({
    phase: 'setup', formData: defaultForm, scriptResult: null, messages: [],
    analysisResult: null, sessionStart: null, suggestions: [], error: null, isFromHistory: false,
  }),
  resetToScript: () => set({ phase: 'script', messages: [], analysisResult: null }),
  resetToRoleplay: () => set({ phase: 'roleplay', messages: [], sessionStart: Date.now(), analysisResult: null }),
}));
