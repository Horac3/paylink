import type { Param } from '../../types';

interface ParamTableProps {
  title: string;
  params: Param[];
}

export function ParamTable({ title, params }: ParamTableProps) {
  if (!params.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">{title}</h4>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-2 text-xs text-text-secondary font-medium w-36">Name</th>
              <th className="text-left px-4 py-2 text-xs text-text-secondary font-medium w-24">Type</th>
              <th className="text-left px-4 py-2 text-xs text-text-secondary font-medium w-20">Required</th>
              <th className="text-left px-4 py-2 text-xs text-text-secondary font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr
                key={p.name}
                className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-bg' : 'bg-surface/30'}`}
              >
                <td className="px-4 py-2.5 font-mono text-xs text-accent">{p.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">{p.type}</td>
                <td className="px-4 py-2.5 text-xs">
                  {p.required ? (
                    <span className="text-error">required</span>
                  ) : (
                    <span className="text-text-secondary">optional</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-xs text-text-secondary leading-relaxed">
                  {p.description}
                  {p.options && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.options.map((o) => (
                        <code key={o} className="bg-border/40 text-text-primary px-1 py-0.5 rounded text-xs">{o}</code>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
