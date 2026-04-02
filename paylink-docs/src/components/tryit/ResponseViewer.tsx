import { CodeBlock } from '../docs/CodeBlock';
import { formatJson } from '../../utils/formatJson';
import type { ApiResult } from '../../types';

interface ResponseViewerProps {
  result: ApiResult;
}

function statusColor(status: number): string {
  if (status >= 200 && status < 300) return 'text-success';
  if (status >= 400 && status < 500) return 'text-warning';
  return 'text-error';
}

export function ResponseViewer({ result }: ResponseViewerProps) {
  return (
    <div className="mt-3">
      <div className="flex items-center gap-3 mb-2">
        <span className={`font-mono text-sm font-semibold ${statusColor(result.status)}`}>
          {result.status}
        </span>
        <span className="text-xs text-text-secondary">{result.duration}ms</span>
        {result.error && (
          <span className="text-xs text-error">{result.error}</span>
        )}
      </div>
      {result.data !== null && (
        <CodeBlock code={formatJson(result.data)} language="json" />
      )}
    </div>
  );
}
