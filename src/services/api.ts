import { Scan, Claim, ModerationReport, AuditLog } from '@/types';

// Seed data for scans
export const mockScans: Scan[] = [
  {
    id: 'scan-2847',
    prompt: 'What are the main financial results reported by Nvidia for Q4 FY25?',
    enhancedPrompt: 'Analyze Nvidia Q4 FY25 earnings report. Provide revenue, net income, year-over-year growth metrics, and gross margin details. Include citations for verified metrics.',
    response: 'NVIDIA reported record revenue of $26.04 billion for the fourth quarter of FY25, up 22% from the previous quarter and up 265% from a year ago. Net income for the quarter was $12.28 billion, or $4.93 per diluted share. Gross margins remained incredibly strong at 76.0% on a GAAP basis, driven by massive demand for the Hopper GPU architecture (H100) and initial shipping revenues of the newer Blackwell architecture. The company projected next quarter revenue to hit $28.0 billion.',
    confidenceScore: 94,
    status: 'completed',
    timestamp: '2026-05-25T14:24:00Z',
    duration: 3200,
    model: 'GPT-4o',
    provider: 'openai',
    tokenUsage: {
      promptTokens: 180,
      completionTokens: 290,
      totalTokens: 470,
      savings: 32,
    },
    claims: [
      {
        id: 'claim-1',
        text: 'NVIDIA reported record revenue of $26.04 billion for the fourth quarter of FY25, up 22% from the previous quarter and up 265% from a year ago.',
        category: 'verified',
        score: 98,
        details: 'Verified against Nvidia Q4 FY25 official investor relations reports. Revenue matches $26.04B exactly. Quarter-over-quarter and year-over-year values match reported figures.',
        evidence: [
          {
            id: 'ev-1',
            title: 'NVIDIA Announces Financial Results for Fourth Quarter and Fiscal 2025',
            url: 'https://investor.nvidia.com/news/press-release-details/2025/NVIDIA-Announces-Financial-Results-for-Fourth-Quarter-and-Fiscal-2025',
            authorityScore: 99,
            retrievalScore: 98,
            trustRating: 'high',
          }
        ]
      },
      {
        id: 'claim-2',
        text: 'Net income for the quarter was $12.28 billion, or $4.93 per diluted share.',
        category: 'verified',
        score: 97,
        details: 'GAAP net income was indeed $12.285B and GAAP diluted EPS was $4.93. Highly verified against official filing reports.',
        evidence: [
          {
            id: 'ev-2',
            title: 'Nvidia SEC Form 10-K fiscal year 2025 filing',
            url: 'https://www.sec.gov/edgar/browse/?CIK=1045810',
            authorityScore: 98,
            retrievalScore: 95,
            trustRating: 'high',
          }
        ]
      },
      {
        id: 'claim-3',
        text: 'Gross margins remained incredibly strong at 76.0% on a GAAP basis, driven by massive demand for the Hopper GPU architecture (H100) and initial shipping revenues of the newer Blackwell architecture.',
        category: 'uncertain',
        score: 72,
        details: 'The GAAP gross margin was actually 76.0% (GAAP) and 76.7% (non-GAAP). Blackwell volume shipments were still ramping, and shipping revenue details were partially redacted/confidential in SEC files.',
        evidence: [
          {
            id: 'ev-3',
            title: 'Nvidia Q4 FY25 Earnings Call Transcript',
            url: 'https://www.fool.com/earnings/call-transcripts/nvidia-earnings-call-q4-2025',
            authorityScore: 85,
            retrievalScore: 78,
            trustRating: 'medium',
          }
        ]
      }
    ]
  },
  {
    id: 'scan-2846',
    prompt: 'Summarize the safety guidelines of the Gemini AI model from Google.',
    response: 'Google built Gemini around safety parameters. The model operates under four key safety filters: Hate Speech, Harassment, Sexually Explicit, and Dangerous Content. Additionally, Google claims that Gemini 1.5 Pro has passed a rigorous 100% compliance audit conducted by the AI Safety Alliance, making it legally certified as hallucination-free in all enterprise installations.',
    confidenceScore: 45,
    status: 'completed',
    timestamp: '2026-05-25T11:05:00Z',
    duration: 2800,
    model: 'Gemini 1.5 Pro',
    provider: 'gemini',
    tokenUsage: {
      promptTokens: 140,
      completionTokens: 210,
      totalTokens: 350,
      savings: 18,
    },
    claims: [
      {
        id: 'claim-4',
        text: 'Google built Gemini around safety parameters. The model operates under four key safety filters: Hate Speech, Harassment, Sexually Explicit, and Dangerous Content.',
        category: 'verified',
        score: 95,
        details: 'Confirmed in official Google developer documentation for Vertex AI Gemini API safety settings.',
        evidence: [
          {
            id: 'ev-4',
            title: 'Gemini API Safety Guidance - Google Cloud Docs',
            url: 'https://ai.google.dev/gemini-api/docs/safety-guidance',
            authorityScore: 98,
            retrievalScore: 94,
            trustRating: 'high',
          }
        ]
      },
      {
        id: 'claim-5',
        text: 'rigorous 100% compliance audit conducted by the AI Safety Alliance, making it legally certified as hallucination-free in all enterprise installations.',
        category: 'hallucinated',
        score: 12,
        details: 'CRITICAL HALLUCINATION: No such audit exists, and the AI Safety Alliance does not issue certificates certifying LLMs as "100% legally hallucination-free". Google officially disclaims any liability for output generation errors.',
        evidence: [
          {
            id: 'ev-5',
            title: 'AI Safety Alliance official program scope',
            url: 'https://www.aisafetyalliance.org/scope-and-charter',
            authorityScore: 78,
            retrievalScore: 22,
            trustRating: 'low',
          }
        ]
      }
    ]
  }
];

export const mockReports: ModerationReport[] = [
  {
    id: 'rep-1',
    scanId: 'scan-2846',
    title: 'Google Gemini safety certification citation claim',
    reason: 'FAKE_CITATION',
    description: 'The scan claimed that Google Gemini is officially certified as "hallucination-free" by the AI Safety Alliance. This audit certification is entirely fictional and does not exist in any public material.',
    severity: 'high',
    reporter: {
      name: 'Dr. Sarah Connor',
      reputation: 820,
      badge: 'Trusted',
    },
    votes: {
      upvotes: 42,
      downvotes: 1,
    },
    status: 'pending',
    timestamp: '2 hours ago',
  },
  {
    id: 'rep-2',
    scanId: 'scan-2847',
    title: 'Nvidia Blackwell shipping timing accuracy',
    reason: 'CONTRADICTION',
    description: 'Claim regarding Blackwell shipping revenues was marked as Uncertain. Some sources mention Blackwell initial pilot shipments occurred in late FY25, while full volume production occurs in FY26. It is not fully hallucinated, but ambiguous.',
    severity: 'low',
    reporter: {
      name: 'Linus B.',
      reputation: 340,
      badge: 'Beginner',
    },
    votes: {
      upvotes: 12,
      downvotes: 8,
    },
    status: 'reviewed',
    timestamp: '1 day ago',
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    user: 'Aiden Vance',
    action: 'Scan Executed',
    target: 'Nvidia Q4 FY25 Financial Results',
    timestamp: '2026-05-25T14:24:00Z',
    ip: '192.168.1.14',
  },
  {
    id: 'log-2',
    user: 'Aiden Vance',
    action: 'API Key Rotated',
    target: 'DeepSeek Integration Engine key',
    timestamp: '2026-05-25T13:02:00Z',
    ip: '192.168.1.14',
  },
  {
    id: 'log-3',
    user: 'System Cron',
    action: 'Monthly PDF Summary Exported',
    target: 'Platform overall trust logs',
    timestamp: '2026-05-25T00:00:00Z',
    ip: 'localhost',
  }
];

export const apiService = {
  getDashboardStats: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/analytics/dashboard', {
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) return await response.json();
    } catch (e) {
      console.error(e);
    }
    // Fallback if backend isn't ready
    return {
      totalScans: 2847,
      hallucinationRate: 18.3,
      tokenSavings: '124K',
      providerReliability: 94.2,
    };
  },

  chat: async (messages: {role: string, content: string}[], provider: string = 'openai', model: string = 'GPT-4o'): Promise<string> => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ messages, provider, model })
      });
      
      if (response.ok) {
         const data = await response.json();
         return data.response || data.reply || data.message || "Message received from backend.";
      }
    } catch (e) {
      console.error("Backend chat failed, using fallback...", e);
    }
    
    // Fallback Mock Data
    return `Simulated backend response from ${model}. Note: Backend API connection failed. Please ensure the backend is running at http://localhost:8000.`;
  },

  enhancePrompt: async (prompt: string, mode: string): Promise<{ enhancedPrompt: string; savings: number }> => {
    // Note: Assuming /prompts endpoint doesn't exactly match this yet, returning mock format but you can hook this up to your exact backend route
    return {
      enhancedPrompt: `[Mode: ${mode}] Please analyze and provide comprehensive details regarding: ${prompt}. Ensure all metrics, financial figures, and claims are supported by solid factual evidence. Cite official documentation or data points. Ensure the response format is precise, structured, and organized without fluff.`,
      savings: Math.floor(Math.random() * 20) + 15, // 15% - 35% savings
    };
  },

  runScan: async (prompt: string, provider: 'openai' | 'gemini' | 'deepseek', model: string): Promise<Scan> => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Uncomment if using token auth
        },
        body: JSON.stringify({ prompt, provider, model })
      });
      
      if (response.ok) {
         const data = await response.json();
         return data;
      }
    } catch (e) {
      console.error("Backend scan failed, using mock data for demo...", e);
    }
    
    // Fallback to mock behavior if backend is not fully seeded or auth fails
    const scanId = `scan-${Math.floor(Math.random() * 9000) + 1000}`;
    return {
      id: scanId,
      prompt,
      response: `Response from ${provider} using ${model}. (Fallback Mock Data)`,
      confidenceScore: 85,
      status: 'completed',
      timestamp: new Date().toISOString(),
      duration: 1500,
      model,
      provider,
      claims: [],
      tokenUsage: {
        promptTokens: 100,
        completionTokens: 200,
        totalTokens: 300,
        savings: 15,
      }
    };
  }
};
