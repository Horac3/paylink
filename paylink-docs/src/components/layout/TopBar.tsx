import { useState } from 'react';
import { Settings, X, Sun, Moon } from 'lucide-react';
import { useApiContext } from '../../context/ApiContext';

export function TopBar() {
  const { baseUrl, token, theme, setBaseUrl, setToken, toggleTheme } = useApiContext();
  const [open, setOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(baseUrl);
  const [tokenDraft, setTokenDraft] = useState(token);

  const save = () => {
    setBaseUrl(urlDraft);
    setToken(tokenDraft);
    setOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-60 right-0 h-12 bg-surface border-b border-border flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="font-mono text-xs text-accent truncate max-w-xs">{baseUrl}</span>
          {token && (
            <span className="text-xs bg-success/10 text-success border border-success/20 px-1.5 py-0.5 rounded">
              Authenticated
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            <Settings size={15} />
            <span>Config</span>
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface border border-border rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-text-primary font-semibold">API Configuration</h2>
              <button onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">
                  Base URL
                </label>
                <input
                  type="text"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent"
                  placeholder="http://localhost:3000/api/v1"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5 font-medium uppercase tracking-wider">
                  Bearer Token
                </label>
                <input
                  type="password"
                  value={tokenDraft}
                  onChange={(e) => setTokenDraft(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-mono focus:outline-none focus:border-accent"
                  placeholder="eyJhbGciOiJSUzI1NiIs..."
                />
                <p className="text-xs text-text-secondary mt-1.5">
                  Paste your access token from <code className="text-accent">/auth/login</code>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={save}
                className="flex-1 bg-primary hover:bg-primary/80 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 border border-border text-text-secondary hover:text-text-primary rounded-lg py-2 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
