export interface CorpusItem {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export interface VerificationAnalysis {
  score: number;
  noisePercent: number;
  detectedFacts: string[];
  detectedHype: string[];
  modelName: string;
}

export interface VerificationResponse {
  query: string;
  answer: string;
  isSimulated: boolean;
  injectedChunks: CorpusItem[];
  analysis: VerificationAnalysis;
}

export interface TimelineMilestone {
  year: string;
  era: string;
  title: string;
  subtitle: string;
  description: string;
  coordinates?: string;
  evidence: string;
  jsonLdSnippet: string;
}

export interface QCParameter {
  name: string;
  value: string;
  status: "nominal" | "warning" | "optimal";
  sensorId: string;
  unit: string;
  target: string;
}

export interface MemberRegistration {
  name: string;
  email: string;
  phone: string;
  tier: "Gold" | "Platinum" | "BlackCard";
  cid: string;
  registeredAt: string;
  status: "pending" | "approved";
  halfsphereId: string | null;
  halfsphereSynced: boolean;
}
