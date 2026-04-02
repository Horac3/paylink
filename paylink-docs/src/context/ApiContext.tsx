import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ApiContextValue {
  baseUrl: string;
  token: string;
  theme: Theme;
  setBaseUrl: (url: string) => void;
  setToken: (token: string) => void;
  toggleTheme: () => void;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [baseUrl, setBaseUrl] = useState<string>(
    () => localStorage.getItem('paylink_base_url') ?? 'http://localhost:3000/api/v1'
  );
  const [token, setToken] = useState<string>(
    () => localStorage.getItem('paylink_token') ?? ''
  );
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('paylink_theme') as Theme | null) ?? 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleSetBaseUrl = (url: string) => {
    localStorage.setItem('paylink_base_url', url);
    setBaseUrl(url);
  };

  const handleSetToken = (t: string) => {
    localStorage.setItem('paylink_token', t);
    setToken(t);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('paylink_theme', next);
      return next;
    });
  };

  return (
    <ApiContext.Provider value={{ baseUrl, token, theme, setBaseUrl: handleSetBaseUrl, setToken: handleSetToken, toggleTheme }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext(): ApiContextValue {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApiContext must be used within ApiProvider');
  return ctx;
}
