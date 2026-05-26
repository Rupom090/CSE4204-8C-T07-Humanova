import { create } from 'zustand';
import { Provider } from '@/types';

interface ProviderState {
  providers: Provider[];
  apiKeys: {
    openai: string;
    gemini: string;
    deepseek: string;
  };
  setApiKey: (provider: 'openai' | 'gemini' | 'deepseek', key: string) => void;
  updateProviderStatus: (providerId: Provider['id'], status: Provider['status']) => void;
}

export const useProviderStore = create<ProviderState>((set) => ({
  providers: [
    {
      id: 'openai',
      name: 'OpenAI GPT-4o',
      status: 'operational',
      reliability: 95.8,
      latency: 420,
      lastUsed: '3 mins ago',
      tokenSavings: 34.5,
    },
    {
      id: 'gemini',
      name: 'Gemini 1.5 Pro',
      status: 'operational',
      reliability: 94.2,
      latency: 350,
      lastUsed: '12 mins ago',
      tokenSavings: 28.1,
    },
    {
      id: 'deepseek',
      name: 'DeepSeek V3',
      status: 'degraded',
      reliability: 90.5,
      latency: 890,
      lastUsed: '1 hour ago',
      tokenSavings: 42.8,
    },
  ],
  apiKeys: {
    openai: 'sk-proj-••••••••••••••••3aB2',
    gemini: 'AIzaSy••••••••••••••••9jK1',
    deepseek: 'sk-ds-••••••••••••••••8aC7',
  },

  setApiKey: (provider, key) => {
    set((state) => ({
      apiKeys: {
        ...state.apiKeys,
        [provider]: key,
      },
    }));
  },

  updateProviderStatus: (providerId, status) => {
    set((state) => ({
      providers: state.providers.map((p) =>
        p.id === providerId ? { ...p, status } : p
      ),
    }));
  },
}));
