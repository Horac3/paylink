import type { ReactNode } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
}

const styles: Record<AlertVariant, { container: string; icon: string; Icon: typeof Info }> = {
  info: { container: 'bg-blue-50 border-blue-200 text-blue-800', icon: 'text-blue-500', Icon: Info },
  success: { container: 'bg-green-50 border-green-200 text-green-800', icon: 'text-green-500', Icon: CheckCircle },
  warning: { container: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: 'text-yellow-500', Icon: AlertTriangle },
  error: { container: 'bg-red-50 border-red-200 text-red-800', icon: 'text-red-500', Icon: XCircle },
};

export function Alert({ variant = 'info', title, children }: AlertProps) {
  const { container, icon, Icon } = styles[variant];
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${container}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${icon}`} />
      <div className="flex-1 text-sm">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
