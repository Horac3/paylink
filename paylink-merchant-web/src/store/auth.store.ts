import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MerchantInfo {
  id: string;
  email: string;
  businessName: string;
  feeTier: string;
}

interface AuthStore {
  token: string | null;
  refreshToken: string | null;
  merchant: MerchantInfo | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, merchant: MerchantInfo | null) => void;
  clearAuth: () => void;
}

const PERSIST_KEY = 'paylink_merchant_auth';

// Read persisted auth synchronously so the first render has the correct state
// and ProtectedRoute never redirects a logged-in user to /login.
const loadPersistedState = (): Partial<AuthStore> => {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    return raw ? (JSON.parse(raw).state ?? {}) : {};
  } catch {
    return {};
  }
};

const saved = loadPersistedState();

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: (saved.token as string | null) ?? null,
      refreshToken: (saved.refreshToken as string | null) ?? null,
      merchant: (saved.merchant as MerchantInfo | null) ?? null,
      isAuthenticated: saved.isAuthenticated === true,
      setAuth: (token, refreshToken, merchant) =>
        set({ token, refreshToken, merchant, isAuthenticated: true }),
      clearAuth: () =>
        set({ token: null, refreshToken: null, merchant: null, isAuthenticated: false }),
    }),
    {
      name: PERSIST_KEY,
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        merchant: state.merchant,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
