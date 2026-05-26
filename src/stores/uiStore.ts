import { create } from 'zustand';
import { toaster } from '@/components/ui/basic-toast';

export interface NotificationToast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

interface UiState {
  sidebarCollapsed: boolean;
  notifications: NotificationToast[];
  sandboxAuditing: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addNotification: (message: string, type?: NotificationToast['type']) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  setSandboxAuditing: (auditing: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  sandboxAuditing: false,
  setSandboxAuditing: (auditing: boolean) => set({ sandboxAuditing: auditing }),
  notifications: [
    {
      id: 'notif-1',
      type: 'warning',
      message: 'Hallucination rate exceeded 15% threshold for OpenAI in last 24h.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'success',
      message: 'Monthly automated PDF trust report generated successfully.',
      timestamp: '1 day ago',
      read: true,
    },
    {
      id: 'notif-3',
      type: 'info',
      message: 'New moderation report queued for verifier review.',
      timestamp: '3 days ago',
      read: true,
    },
  ],

  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

  addNotification: (message: string, type: NotificationToast['type'] = 'info') => {
    const newNotif: NotificationToast = {
      id: `notif-${Date.now()}`,
      type,
      message,
      timestamp: 'Just now',
      read: false,
    };

    // Trigger beautiful Ark UI Toaster notifications
    const titleMap = {
      success: 'Success',
      error: 'System Error',
      warning: 'Warning Alert',
      info: 'Notification'
    };

    toaster.create({
      title: titleMap[type] || 'System Message',
      description: message,
      type: type,
    });

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  clearNotifications: () => set({ notifications: [] }),
}));
