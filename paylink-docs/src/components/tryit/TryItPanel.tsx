import { useState } from 'react';
import { Play, Lock } from 'lucide-react';
import { useApiContext } from '../../context/ApiContext';
import { ResponseViewer } from './ResponseViewer';
import type { Endpoint, ApiResult, Param } from '../../types';

interface TryItPanelProps {
  endpoint: Endpoint;
}

function buildUrl(baseUrl: string, path: string, pathValues: Record<string, string>, queryValues: Record<string, string>): string {
  let resolved = path.replace(/:([a-zA-Z]+)/g, (_, key: string) => pathValues[key] ?? `:${key}`);
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(queryValues)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `${baseUrl}${resolved}${qs ? `?${qs}` : ''}`;
}

function ParamInput({ param, value, onChange, prefix }: {
  param: Param;
  value: string;
  onChange: (v: string) => void;
  prefix: string;
}) {
  const id = `${prefix}_${param.name}`;
  return (
    <div key={id} className="flex items-start gap-3">
      <div className="w-32 flex-shrink-0 pt-2">
        <label htmlFor={id} className="text-xs font-mono text-accent">{param.name}</label>
        {!param.required && <span className="block text-xs text-text-secondary">optional</span>}
      </div>
      {param.options ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-bg border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary font-mono focus:outline-none focus:border-accent"
        >
          <option value="">— select —</option>
          {param.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          id={id}
          type={param.name.toLowerCase().includes('password') || param.name.toLowerCase().includes('token') ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.example !== undefined ? String(param.example) : ''}
          className="flex-1 bg-bg border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary font-mono focus:outline-none focus:border-accent placeholder:text-border"
        />
      )}
    </div>
  );
}

export function TryItPanel({ endpoint }: TryItPanelProps) {
  const { baseUrl, token } = useApiContext();
  const [pathValues, setPathValues] = useState<Record<string, string>>({});
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);

  const noAuth = endpoint.auth && !token;

  const send = async () => {
    setLoading(true);
    setResult(null);
    const url = buildUrl(baseUrl, endpoint.path, pathValues, queryValues);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (endpoint.auth && token) headers['Authorization'] = `Bearer ${token}`;

    let body: string | undefined;
    if (endpoint.bodyParams?.length) {
      const obj: Record<string, unknown> = {};
      for (const p of endpoint.bodyParams) {
        const v = bodyValues[p.name];
        if (v !== undefined && v !== '') {
          obj[p.name] = p.type === 'number' ? Number(v) : v;
        }
      }
      if (Object.keys(obj).length) body = JSON.stringify(obj);
    }

    const start = Date.now();
    try {
      const res = await fetch(url, {
        method: endpoint.method,
        headers,
        body,
      });
      const duration = Date.now() - start;
      let data: unknown = null;
      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = text || null; }
      setResult({ status: res.status, data, duration });
    } catch (err) {
      setResult({ status: 0, data: null, duration: Date.now() - start, error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Play size={13} className="text-accent" />
        Try it
      </h4>

      {noAuth && (
        <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 border border-warning/20 rounded-lg px-3 py-2 mb-4">
          <Lock size={12} />
          This endpoint requires authentication. Set your token via the <strong>Config</strong> button (top right).
        </div>
      )}

      <div className="space-y-3">
        {endpoint.pathParams?.map((p) => (
          <ParamInput
            key={p.name}
            param={p}
            value={pathValues[p.name] ?? ''}
            onChange={(v) => setPathValues((prev) => ({ ...prev, [p.name]: v }))}
            prefix="path"
          />
        ))}
        {endpoint.queryParams?.map((p) => (
          <ParamInput
            key={p.name}
            param={p}
            value={queryValues[p.name] ?? ''}
            onChange={(v) => setQueryValues((prev) => ({ ...prev, [p.name]: v }))}
            prefix="query"
          />
        ))}
        {endpoint.bodyParams?.map((p) => (
          <ParamInput
            key={p.name}
            param={p}
            value={bodyValues[p.name] ?? ''}
            onChange={(v) => setBodyValues((prev) => ({ ...prev, [p.name]: v }))}
            prefix="body"
          />
        ))}
      </div>

      <button
        onClick={send}
        disabled={loading || noAuth}
        className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <Play size={13} />
        {loading ? 'Sending…' : 'Send Request'}
      </button>

      {result && <ResponseViewer result={result} />}
    </div>
  );
}
