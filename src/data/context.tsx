/**
 * Pinly App Context & Data Provider
 * Single point of access for DataClient, i18n, Theme, Browser Navigation, QA overrides
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { DataClient } from './client';
import { MockDataClient } from './mock/mockClient';
import { Locale, Role, User, Workspace } from './types';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

interface AppContextType {
  client: DataClient;
  mockClient: MockDataClient;
  user: User;
  workspace: Workspace;
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  role: Role | 'client' | 'admin';
  setRole: (r: Role | 'client' | 'admin') => void;
  t: (key: string) => string;
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  // Permissions helpers
  canManageBilling: boolean;
  canManageBranding: boolean;
  canManageMembers: boolean;
  canAccessAdmin: boolean;
  canSendReview: boolean;
  canApproveDirectly: boolean;
  // QA Flags
  qaEmpty: boolean;
  setQaEmpty: (v: boolean) => void;
  qaError: boolean;
  setQaError: (v: boolean) => void;
  qaLoading: boolean;
  setQaLoading: (v: boolean) => void;
  qaWebsiteBlocked: boolean;
  setQaWebsiteBlocked: (v: boolean) => void;
  qaFrozenAccount: boolean;
  setQaFrozenAccount: (v: boolean) => void;
  currentRoute: string;
  navigateTo: (route: string) => void;
  openVoiceAssistant: boolean;
  setOpenVoiceAssistant: (v: boolean) => void;
  reducedMotion: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const singletonMockClient = new MockDataClient();

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinly_locale');
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'en';
  });

  const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinly_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  };

  const [theme, setThemeState] = useState<'light' | 'dark'>(getInitialTheme);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [role, setRoleState] = useState<Role | 'client' | 'admin'>('owner');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Synchronize route with real browser URL / navigation history & query parameters
  const getInitialRoute = (): string => {
    if (typeof window !== 'undefined') {
      const full = window.location.pathname + window.location.search;
      return full && full !== '' ? full : '/';
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [openVoiceAssistant, setOpenVoiceAssistant] = useState<boolean>(false);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const full = (window.location.pathname || '/') + (window.location.search || '');
      setCurrentRoute(full);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // System theme changes listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('pinly_theme')) {
        const sysTheme = e.matches ? 'dark' : 'light';
        setThemeState(sysTheme);
      }
    };
    mql.addEventListener('change', handleSystemThemeChange);
    return () => mql.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Reduced motion listener
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    };
    if (mql.matches) {
      document.documentElement.classList.add('reduce-motion');
    }
    mql.addEventListener('change', handleMotionChange);
    return () => mql.removeEventListener('change', handleMotionChange);
  }, []);

  // QA flags
  const [qaEmpty, setQaEmpty] = useState<boolean>(false);
  const [qaError, setQaError] = useState<boolean>(false);
  const [qaLoading, setQaLoading] = useState<boolean>(false);
  const [qaWebsiteBlocked, setQaWebsiteBlocked] = useState<boolean>(false);
  const [qaFrozenAccount, setQaFrozenAccount] = useState<boolean>(false);

  const [user, setUser] = useState<User>({
    id: 'usr_nazim',
    name: 'Nazim Jbaara',
    email: 'nazemjbaara@gmail.com',
    locale: 'en',
    theme: 'light',
    mfaEnabled: true,
    isPlatformAdmin: true,
  });

  const [workspace, setWorkspace] = useState<Workspace>({
    id: 'ws_studio_noor',
    name: 'Studio Noor',
    primaryColor: '#FF5A3C',
    clientLocale: 'en',
    timezone: 'UTC',
    planId: 'plan_agency',
    planStatus: 'active',
    storageUsedBytes: 14 * 1024 * 1024 * 1024,
  });

  const setRole = (newRole: Role | 'client' | 'admin') => {
    setRoleState(newRole);
    setUser((prev) => ({
      ...prev,
      isPlatformAdmin: newRole === 'admin',
    }));
  };

  // Permission Computations
  const canManageBilling = role === 'owner' || role === 'admin';
  const canManageBranding = (role === 'owner' || role === 'admin') && workspace.planId === 'plan_agency';
  const canManageMembers = role === 'owner' || role === 'admin';
  const canAccessAdmin = role === 'admin' || user.isPlatformAdmin;
  const canSendReview = role === 'owner' || role === 'member';
  const canApproveDirectly = role === 'client';

  // Sync QA flags with mock client
  useEffect(() => {
    singletonMockClient.simulateEmpty = qaEmpty;
    singletonMockClient.simulateError = qaError;
    singletonMockClient.simulateLoading = qaLoading;
    singletonMockClient.simulateWebsiteBlocked = qaWebsiteBlocked;
  }, [qaEmpty, qaError, qaLoading, qaWebsiteBlocked]);

  useEffect(() => {
    if (qaFrozenAccount) {
      setWorkspace((prev) => ({ ...prev, planStatus: 'frozen' }));
    } else {
      setWorkspace((prev) => ({ ...prev, planStatus: 'active' }));
    }
  }, [qaFrozenAccount]);

  // Sync theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync RTL and lang attribute
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinly_locale', l);
    }
    singletonMockClient.setLocale(l);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinly_theme', t);
    }
    singletonMockClient.setTheme(t);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const showToast = (message: string, type: ToastItem['type'] = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const translations = useMemo(() => {
    return locale === 'ar' ? arTranslations : enTranslations;
  }, [locale]);

  const t = (key: string): string => {
    const val = (translations as Record<string, string>)[key];
    return val || key;
  };

  const navigateTo = (route: string) => {
    if (typeof window !== 'undefined') {
      const currentFull = window.location.pathname + window.location.search;
      if (currentFull !== route) {
        window.history.pushState(null, '', route);
      }
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        client: singletonMockClient,
        mockClient: singletonMockClient,
        user,
        workspace,
        locale,
        setLocale,
        theme,
        setTheme,
        toggleTheme,
        role,
        setRole,
        t,
        toasts,
        showToast,
        removeToast,
        canManageBilling,
        canManageBranding,
        canManageMembers,
        canAccessAdmin,
        canSendReview,
        canApproveDirectly,
        qaEmpty,
        setQaEmpty,
        qaError,
        setQaError,
        qaLoading,
        setQaLoading,
        qaWebsiteBlocked,
        setQaWebsiteBlocked,
        qaFrozenAccount,
        setQaFrozenAccount,
        currentRoute,
        navigateTo,
        openVoiceAssistant,
        setOpenVoiceAssistant,
        reducedMotion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useData = () => {
  const { client } = useApp();
  return client;
};
