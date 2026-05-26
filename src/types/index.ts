export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Verifier' | 'Auditor' | 'Viewer';
  reputationScore?: number;
  badge?: 'Beginner' | 'Trusted' | 'Expert';
}

export interface Organization {
  id: string;
  name: string;
  plan: 'Growth' | 'Enterprise' | 'Custom';
  membersCount: number;
}

export interface Provider {
  id: 'openai' | 'gemini' | 'deepseek';
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  reliability: number; // percentage
  latency: number; // in ms
  lastUsed?: string;
  tokenSavings?: number;
}

export interface EvidenceSource {
  id: string;
  title: string;
  url: string;
  authorityScore: number; // 0 - 100
  retrievalScore: number; // 0 - 100
  trustRating: 'high' | 'medium' | 'low';
}

export interface Claim {
  id: string;
  text: string;
  category: 'verified' | 'uncertain' | 'hallucinated';
  score: number; // 0 - 100
  details: string;
  evidence: EvidenceSource[];
}

export interface Scan {
  id: string;
  prompt: string;
  enhancedPrompt?: string;
  response: string;
  confidenceScore: number; // 0 - 100
  status: 'queued' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  duration: number; // in ms
  claims: Claim[];
  model: string;
  provider: 'openai' | 'gemini' | 'deepseek';
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    savings: number; // in percentage or cost
  };
}

export interface ModerationReport {
  id: string;
  scanId: string;
  title: string;
  reason: 'FAKE_CITATION' | 'FABRICATED_STAT' | 'CONTRADICTION' | 'HALLUCINATION';
  description: string;
  severity: 'high' | 'medium' | 'low';
  reporter: {
    name: string;
    reputation: number;
    badge: 'Beginner' | 'Trusted' | 'Expert';
  };
  votes: {
    upvotes: number;
    downvotes: number;
  };
  userVote?: 'up' | 'down';
  status: 'pending' | 'reviewed' | 'resolved';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
}
