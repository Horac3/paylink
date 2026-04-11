import { useState } from 'react';
import { FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { SANDBOX_DEPOSIT_NUMBERS, type SandboxNumber } from '../../constants/sandboxNumbers';

interface SandboxPickerProps {
  onSelect: (number: SandboxNumber) => void;
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  SUBMITTED:  'bg-yellow-100 text-yellow-700',
  FAILED:     'bg-red-100 text-red-700',
};

/**
 * Dev-only sandbox test number picker for the recipient phone field.
 * Renders only in development builds.
 */
export function SandboxPicker({ onSelect }: SandboxPickerProps) {
  const [open, setOpen] = useState(false);

  if (import.meta.env.PROD) return null;

  const groups: Record<string, SandboxNumber[]> = { COMPLETED: [], SUBMITTED: [], FAILED: [] };
  for (const n of SANDBOX_DEPOSIT_NUMBERS) {
    groups[n.expectedStatus]?.push(n);
  }

  return (
    <div className="rounded-xl border border-dashed border-yellow-300 bg-yellow-50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <FlaskConical size={14} className="text-yellow-600" />
          <span className="text-xs font-semibold text-yellow-700">Sandbox test numbers</span>
        </div>
        {open
          ? <ChevronUp size={14} className="text-yellow-600" />
          : <ChevronDown size={14} className="text-yellow-600" />
        }
      </button>

      {open && (
        <div className="border-t border-yellow-200 divide-y divide-yellow-100">
          {(['COMPLETED', 'SUBMITTED', 'FAILED'] as const).map((status) => (
            <div key={status} className="px-3 py-2">
              <p className="text-[10px] font-bold tracking-wide uppercase text-yellow-600 mb-1.5">
                {status}
              </p>
              <div className="flex flex-col gap-1">
                {groups[status]?.map((n) => (
                  <button
                    key={n.msisdn}
                    type="button"
                    onClick={() => {
                      onSelect(n);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left bg-white hover:bg-yellow-50 border border-yellow-100 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-mono font-medium text-gray-700">
                        +{n.msisdn}
                      </span>
                      {n.failureCode && (
                        <span className="ml-2 text-[10px] text-gray-400">{n.failureCode}</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                      {status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
