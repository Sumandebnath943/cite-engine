import { create } from 'zustand';

export interface ThreatItem { threat: string; severity: 'critical' | 'high' | 'medium' | 'low'; explanation: string; timeframe: string; }
export interface SkillAnalysisItem { skill: string; relevanceScore: number; halfLifeYears: number; status: 'declining' | 'stable' | 'growing' | 'emerging'; replacementRisk: 'high' | 'medium' | 'low'; note: string; }
export interface UrgentAction { action: string; priority: 'critical' | 'high' | 'medium'; timeframe: 'immediate' | '30days' | '90days' | '6months'; impact: string; }
export interface UpskillItem { skill: string; reason: string; currentDemandScore: number; projectedDemandScore: number; timeToLearn: string; estimatedSalaryImpact: string; resource: string; resourceUrl: string; priority: 'critical' | 'high' | 'medium'; }

export interface ScanResult {
  overallScore: number;
  scoreLabel: string;
  scoreSummary: string;
  automationRiskScore: number;
  industryHealthScore: number;
  skillRelevanceScore: number;
  roleResilienceScore: number;
  timelineToDisruption: string;
  topThreats: ThreatItem[];
  skillAnalysis: SkillAnalysisItem[];
  protectiveFactors: string[];
  urgentActions: UrgentAction[];
  upskillPathway: UpskillItem[];
  industryOutlook: string;
  roleEvolutionPrediction: string;
  euphemismAlerts: string[];
}

export interface EmployerSignal { signal: string; severity: string; source: string; date: string; url?: string; euphemismsDetected?: string[]; }
export interface EuphemismDecoder { phrase: string; translation: string; riskLevel: 'high' | 'medium' | 'low'; }
export interface NewsResult {
  threatLevel: string;
  threatLevelScore: number;
  employerSignals: EmployerSignal[];
  industrySignals: EmployerSignal[];
  euphemismDecoder: EuphemismDecoder[];
  overallIntelSummary: string;
  recommendedActions: string[];
  hasLiveData?: boolean;
}

export interface RadarProfileInput {
  jobTitle: string;
  employer: string;
  industry: string;
  yearsExperience: string;
  location: string;
  skills: string[];
  dailyTasks: string;
}

interface RadarState {
  phase: 'setup' | 'loading' | 'results';
  profileData: RadarProfileInput;
  scanResult: ScanResult | null;
  newsResult: NewsResult | null;
  activeTab: string;
  isLoading: boolean;
  isNewsLoading: boolean;
  plannedSkills: string[];
  completedActions: string[];
  error: string | null;
  lastScannedAt: Date | null;

  setPhase: (p: 'setup' | 'loading' | 'results') => void;
  setProfileData: (d: Partial<RadarProfileInput>) => void;
  setScanResult: (r: ScanResult) => void;
  setNewsResult: (r: NewsResult) => void;
  setActiveTab: (t: string) => void;
  setIsLoading: (v: boolean) => void;
  setIsNewsLoading: (v: boolean) => void;
  togglePlannedSkill: (s: string) => void;
  toggleCompletedAction: (a: string) => void;
  setError: (e: string | null) => void;
  resetAll: () => void;
}

const defaultProfile: RadarProfileInput = {
  jobTitle: '', employer: '', industry: '', yearsExperience: '', location: '', skills: [], dailyTasks: '',
};

export const useRadarStore = create<RadarState>((set) => ({
  phase: 'setup', profileData: defaultProfile, scanResult: null, newsResult: null,
  activeTab: 'threat', isLoading: false, isNewsLoading: false,
  plannedSkills: [], completedActions: [], error: null, lastScannedAt: null,

  setPhase: (phase) => set({ phase }),
  setProfileData: (d) => set((s) => ({ profileData: { ...s.profileData, ...d } })),
  setScanResult: (scanResult) => set({ scanResult, phase: 'results', isLoading: false, lastScannedAt: new Date() }),
  setNewsResult: (newsResult) => set({ newsResult, isNewsLoading: false }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsNewsLoading: (isNewsLoading) => set({ isNewsLoading }),
  togglePlannedSkill: (s) => set((st) => ({ plannedSkills: st.plannedSkills.includes(s) ? st.plannedSkills.filter((x) => x !== s) : [...st.plannedSkills, s] })),
  toggleCompletedAction: (a) => set((st) => ({ completedActions: st.completedActions.includes(a) ? st.completedActions.filter((x) => x !== a) : [...st.completedActions, a] })),
  setError: (error) => set({ error, isLoading: false }),
  resetAll: () => set({ phase: 'setup', profileData: defaultProfile, scanResult: null, newsResult: null, activeTab: 'threat', error: null, lastScannedAt: null }),
}));
