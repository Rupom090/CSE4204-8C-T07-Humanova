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
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      totalScans: 2847,
      hallucinationRate: 18.3,
      tokenSavings: '124K',
      providerReliability: 94.2,
    };
  },

  enhancePrompt: async (prompt: string, mode: string): Promise<{ enhancedPrompt: string; savings: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      enhancedPrompt: `[Mode: ${mode}] Please analyze and provide comprehensive details regarding: ${prompt}. Ensure all metrics, financial figures, and claims are supported by solid factual evidence. Cite official documentation or data points. Ensure the response format is precise, structured, and organized without fluff.`,
      savings: Math.floor(Math.random() * 20) + 15, // 15% - 35% savings
    };
  },

  runScan: async (prompt: string, provider: 'openai' | 'gemini' | 'deepseek', model: string): Promise<Scan> => {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generates a mock scan response
    const scanId = `scan-${Math.floor(Math.random() * 9000) + 1000}`;
    const score = Math.floor(Math.random() * 50) + 50; // 50 to 100

    let responseText = '';
    let claims: Claim[] = [];

    if (provider === 'openai') {
      responseText = `OpenAI GPT-4o analyzed the prompt. AI systems are increasingly being used in regulated spaces. The European AI Act is the first official legislative framework for artificial intelligence, classifying systems by risk (Low, Medium, High, Unacceptable). Additionally, the Act mandates that all High-Risk AI installations must register under a centralized EU registry database by June 2026, which is fully operational and open today.`;
      claims = [
        {
          id: `${scanId}-claim-1`,
          text: 'The European AI Act is the first official legislative framework for artificial intelligence, classifying systems by risk (Low, Medium, High, Unacceptable).',
          category: 'verified',
          score: 96,
          details: 'Highly verified. The EU AI Act was officially approved by the European Parliament in March 2024 and publishes a risk-based categorization system for AI models.',
          evidence: [
            {
              id: `${scanId}-ev-1`,
              title: 'EU Artificial Intelligence Act - official portal',
              url: 'https://artificialintelligenceact.eu/',
              authorityScore: 98,
              retrievalScore: 96,
              trustRating: 'high',
            }
          ]
        },
        {
          id: `${scanId}-claim-2`,
          text: 'Act mandates that all High-Risk AI installations must register under a centralized EU registry database by June 2026, which is fully operational and open today.',
          category: 'uncertain',
          score: 65,
          details: 'Uncertain. While high-risk AI registry database requirements are indeed part of the Act, the public interface registry database is currently under draft development by the AI Office and is not fully operational today.',
          evidence: [
            {
              id: `${scanId}-ev-2`,
              title: 'European AI Office updates and timeline',
              url: 'https://digital-strategy.ec.europa.eu/en/policies/european-ai-office',
              authorityScore: 92,
              retrievalScore: 70,
              trustRating: 'medium',
            }
          ]
        }
      ];
    } else if (provider === 'gemini') {
      responseText = `Google Gemini indicates that the Global Artificial Intelligence Market will grow at an unprecedented CAGR of 84.6% to reach $8.5 Trillion by 2028. This growth is heavily supported by the direct deployment of generative AI systems across 100% of global Fortune 500 financial institutions, who reported zero security breaches from their direct integrations.`;
      claims = [
        {
          id: `${scanId}-claim-1`,
          text: 'Global Artificial Intelligence Market will grow at an unprecedented CAGR of 84.6% to reach $8.5 Trillion by 2028.',
          category: 'uncertain',
          score: 55,
          details: 'Uncertain: Market forecasts widely differ. Standard consensus CAGR estimate ranges between 28% and 37%, hitting a size of $1.3B - $1.8B by 2030. $8.5T by 2028 is an outlier estimation from private, unverified surveys.',
          evidence: [
            {
              id: `${scanId}-ev-1`,
              title: 'Precedence Research: Artificial Intelligence Market Size',
              url: 'https://www.precedenceresearch.com/artificial-intelligence-market',
              authorityScore: 84,
              retrievalScore: 50,
              trustRating: 'medium',
            }
          ]
        },
        {
          id: `${scanId}-claim-2`,
          text: 'deployment of generative AI systems across 100% of global Fortune 500 financial institutions, who reported zero security breaches from their direct integrations.',
          category: 'hallucinated',
          score: 8,
          details: 'CRITICAL HALLUCINATION: Numerous Fortune 500 banks restrict generative AI API integrations due to risk compliance, and multiple data leakage incidents related to ChatGPT and public LLMs have been documented.',
          evidence: [
            {
              id: `${scanId}-ev-2`,
              title: 'Gartner Research: LLM Data Leaks & Enterprise Mitigations',
              url: 'https://www.gartner.com/en/newsroom/press-releases',
              authorityScore: 90,
              retrievalScore: 12,
              trustRating: 'low',
            }
          ]
        }
      ];
    } else {
      responseText = `DeepSeek analyzed corporate sustainability protocols. Large language models (LLMs) require massive computational workloads. Research shows training GPT-4 emitted roughly 18,000 metric tons of carbon, which is equivalent to 1,200 cross-continental flights. These figures were officially approved by the World Carbon Audit Council, certifying OpenAI as carbon neutral.`;
      claims = [
        {
          id: `${scanId}-claim-1`,
          text: 'training GPT-4 emitted roughly 18,000 metric tons of carbon, which is equivalent to 1,200 cross-continental flights.',
          category: 'uncertain',
          score: 68,
          details: 'The precise carbon footprint of GPT-4 training is not officially published by OpenAI. 18,000 tons is an estimate derived from carbon calculation papers, but flights equivalence is exaggerated.',
          evidence: [
            {
              id: `${scanId}-ev-1`,
              title: 'The Carbon Footprint of Machine Learning Training',
              url: 'https://arxiv.org/abs/2211.02001',
              authorityScore: 86,
              retrievalScore: 74,
              trustRating: 'medium',
            }
          ]
        },
        {
          id: `${scanId}-claim-2`,
          text: 'officially approved by the World Carbon Audit Council, certifying OpenAI as carbon neutral.',
          category: 'hallucinated',
          score: 15,
          details: 'CRITICAL HALLUCINATION: The "World Carbon Audit Council" does not exist. OpenAI has not published any carbon-neutrality certificates for LLM training.',
          evidence: [
            {
              id: `${scanId}-ev-2`,
              title: 'OpenAI official commitment to environmental responsibility',
              url: 'https://openai.com/charter',
              authorityScore: 95,
              retrievalScore: 10,
              trustRating: 'low',
            }
          ]
        }
      ];
    }

    const calculatedScore = claims.reduce((acc, curr) => acc + curr.score, 0) / claims.length;

    return {
      id: scanId,
      prompt,
      response: responseText,
      confidenceScore: Math.round(calculatedScore) || 75,
      status: 'completed',
      timestamp: new Date().toISOString(),
      duration: 2100,
      model,
      provider,
      claims,
      tokenUsage: {
        promptTokens: Math.floor(Math.random() * 100) + 120,
        completionTokens: Math.floor(Math.random() * 150) + 180,
        totalTokens: 340,
        savings: Math.floor(Math.random() * 20) + 15,
      }
    };
  }
};
