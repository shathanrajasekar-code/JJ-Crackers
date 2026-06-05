import { create } from 'zustand';

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  activeTab: string;
  login: (token: string) => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  checkSession: () => boolean;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  token: null,
  activeTab: 'overview',

  login: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jj-admin-token', token);
      localStorage.setItem('jj-admin-login-time', Date.now().toString());
    }
    set({ isAuthenticated: true, token });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jj-admin-token');
      localStorage.removeItem('jj-admin-login-time');
    }
    set({ isAuthenticated: false, token: null, activeTab: 'overview' });
  },

  setActiveTab: (tab: string) => {
    set({ activeTab: tab });
  },

  checkSession: () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('jj-admin-token');
    const loginTime = localStorage.getItem('jj-admin-login-time');
    if (!token || !loginTime) return false;
    
    // 8 hour session expiry
    const elapsed = Date.now() - parseInt(loginTime);
    if (elapsed > 8 * 60 * 60 * 1000) {
      get().logout();
      return false;
    }
    
    set({ isAuthenticated: true, token });
    return true;
  },
}));
