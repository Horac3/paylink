import type { HttpMethod } from '../../types';

const methodStyles: Record<HttpMethod, string> = {
  GET:    'bg-success/10 text-success border-success/20',
  POST:   'bg-primary/10 text-accent border-primary/20',
  PUT:    'bg-warning/10 text-warning border-warning/20',
  PATCH:  'bg-warning/10 text-warning border-warning/20',
  DELETE: 'bg-error/10 text-error border-error/20',
};

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span className={`inline-block border text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${methodStyles[method]}`}>
      {method}
    </span>
  );
}
