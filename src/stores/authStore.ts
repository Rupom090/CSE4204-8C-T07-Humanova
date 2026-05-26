import { create } from 'zustand';
import { User, Organization } from '@/types';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateOrganization: (orgName: string) => void;
}

// Persist the signed out status in localStorage to allow full login/logout flows
const isLoggedOut = localStorage.getItem('humanova_authenticated') === 'false';

const defaultUser: User = {
  id: 'user-1',
  name: 'Aiden Vance',
  email: 'aiden.vance@humanova.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  role: 'Admin',
  reputationScore: 940,
  badge: 'Expert',
};

const defaultOrg: Organization = {
  id: 'org-1',
  name: 'Humanova Inc.',
  plan: 'Enterprise',
  membersCount: 14,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: isLoggedOut ? null : defaultUser,
  organization: isLoggedOut ? null : defaultOrg,
  token: isLoggedOut ? null : 'mock-jwt-token-12345',
  isAuthenticated: !isLoggedOut,

  login: async (email: string) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    localStorage.setItem('humanova_authenticated', 'true');
    set({
      user: {
        id: 'user-1',
        name: 'Aiden Vance',
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        role: 'Admin',
        reputationScore: 940,
        badge: 'Expert',
      },
      organization: defaultOrg,
      token: 'mock-jwt-token-12345',
      isAuthenticated: true,
    });
    return true;
  },

  logout: () => {
    localStorage.setItem('humanova_authenticated', 'false');
    set({
      user: null,
      organization: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateOrganization: (orgName: string) => {
    set((state) => ({
      organization: state.organization
        ? { ...state.organization, name: orgName }
        : { id: 'org-1', name: orgName, plan: 'Enterprise', membersCount: 14 },
    }));
  },
}));
