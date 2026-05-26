import { create } from 'zustand';
import { Scan } from '@/types';
import { mockScans, apiService } from '@/services/api';

interface ScanState {
  scans: Scan[];
  activeScan: Scan | null;
  recentScans: Scan[];
  isScanning: boolean;
  setScan: (scan: Scan) => void;
  setActiveScanById: (id: string) => void;
  startScan: (prompt: string, provider: 'openai' | 'gemini' | 'deepseek', model: string) => Promise<Scan>;
}

export const useScanStore = create<ScanState>((set, get) => ({
  scans: mockScans,
  activeScan: mockScans[0],
  recentScans: mockScans,
  isScanning: false,

  setScan: (scan) => {
    set((state) => {
      const exists = state.scans.some((s) => s.id === scan.id);
      const updatedScans = exists
        ? state.scans.map((s) => (s.id === scan.id ? scan : s))
        : [scan, ...state.scans];
      return {
        scans: updatedScans,
        activeScan: scan,
        recentScans: updatedScans.slice(0, 5),
      };
    });
  },

  setActiveScanById: (id) => {
    const scan = get().scans.find((s) => s.id === id) || null;
    set({ activeScan: scan });
  },

  startScan: async (prompt, provider, model) => {
    set({ isScanning: true });
    
    // Create pre-scan item
    const tempScanId = `scan-${Math.floor(Math.random() * 9000) + 1000}`;
    const initialScan: Scan = {
      id: tempScanId,
      prompt,
      response: '',
      confidenceScore: 0,
      status: 'queued',
      timestamp: new Date().toISOString(),
      duration: 0,
      claims: [],
      model,
      provider,
      tokenUsage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        savings: 0,
      }
    };

    // Add to scans list immediately as 'queued'
    set((state) => ({
      scans: [initialScan, ...state.scans],
      activeScan: initialScan,
      recentScans: [initialScan, ...state.scans].slice(0, 5),
    }));

    // Transition to processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    set((state) => {
      const processingScan: Scan = { ...initialScan, status: 'processing' };
      return {
        scans: state.scans.map((s) => (s.id === tempScanId ? processingScan : s)),
        activeScan: processingScan,
      };
    });

    try {
      const result = await apiService.runScan(prompt, provider, model);
      // Replace with final result
      set((state) => {
        const finalScans = state.scans.map((s) => (s.id === tempScanId ? result : s));
        return {
          scans: finalScans,
          activeScan: result,
          recentScans: finalScans.slice(0, 5),
          isScanning: false,
        };
      });
      return result;
    } catch (e) {
      set((state) => {
        const failedScan: Scan = { ...initialScan, status: 'failed' };
        return {
          scans: state.scans.map((s) => (s.id === tempScanId ? failedScan : s)),
          activeScan: failedScan,
          isScanning: false,
        };
      });
      throw e;
    }
  },
}));
