import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';
import type { Endpoint } from '../../types';
import { MethodBadge } from './MethodBadge';
import { ParamTable } from './ParamTable';
import { CodeBlock } from './CodeBlock';
import { TryItPanel } from '../tryit/TryItPanel';
import { formatJson } from '../../utils/formatJson';
import { generateCodeExample } from '../../utils/generateCodeExample';
import { useApiContext } from '../../context/ApiContext';

type TabKey = 'curl' | 'js' | 'python';

const tabLabels: { key: TabKey; label: string }[] = [
  { key: 'curl', label: 'cURL' },
  { key: 'js', label: 'JavaScript' },
  { key: 'python', label: 'Python' },
];

const langMap: Record<TabKey, string> = { curl: 'bash', js: 'javascript', python: 'python' };

interface EndpointDocProps {
  endpoint: Endpoint;
}

export function EndpointDoc({ endpoint }: EndpointDocProps) {
  const { baseUrl, token } = useApiContext();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<TabKey>('curl');
  const [showTryIt, setShowTryIt] = useState(false);

  const example = generateCodeExample(endpoint, baseUrl, token, {}, tab);

  return (
    <div id={endpoint.id} className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-surface hover:bg-border/20 transition-colors text-left"
      >
        <span className="flex-shrink-0">
          {open ? <ChevronDown size={15} className="text-text-secondary" /> : <ChevronRight size={15} className="text-text-secondary" />}
        </span>
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-text-primary">{endpoint.path}</code>
        <span className="text-sm text-text-secondary flex-1 truncate">{endpoint.title}</span>
        {endpoint.auth && (
          <Lock size={13} className="text-text-secondary flex-shrink-0" aria-label="Requires authentication" />
        )}
      </button>

      {open && (
        <div className="border-t border-border">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 divide-y xl:divide-y-0 xl:divide-x divide-border">
            {/* Left: docs */}
            <div className="p-5 space-y-5">
              <p className="text-sm text-text-secondary leading-relaxed">{endpoint.description}</p>

              {endpoint.auth && (
                <div className="flex items-center gap-2 text-xs text-text-secondary bg-border/20 border border-border rounded-lg px-3 py-2">
                  <Lock size={12} />
                  Requires <code className="text-accent ml-0.5">Authorization: Bearer &lt;token&gt;</code>
                </div>
              )}

              {endpoint.pathParams && <ParamTable title="Path Parameters" params={endpoint.pathParams} />}
              {endpoint.queryParams && <ParamTable title="Query Parameters" params={endpoint.queryParams} />}
              {endpoint.bodyParams && <ParamTable title="Request Body" params={endpoint.bodyParams} />}

              <div>
                <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Response</h4>
                <CodeBlock code={formatJson(endpoint.responseExample)} language="json" />
              </div>
            </div>

            {/* Right: code + try it */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex gap-1 mb-2">
                  {tabLabels.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                        tab === key
                          ? 'bg-primary/20 text-accent'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <CodeBlock code={example} language={langMap[tab]} />
              </div>

              <button
                onClick={() => setShowTryIt((p) => !p)}
                className="text-xs text-accent hover:text-accent/80 transition-colors underline underline-offset-2"
              >
                {showTryIt ? 'Hide try-it panel' : 'Try it in the browser →'}
              </button>

              {showTryIt && <TryItPanel endpoint={endpoint} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
