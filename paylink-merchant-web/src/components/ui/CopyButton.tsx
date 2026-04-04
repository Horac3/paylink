import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => void copy(text)}
      title="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition hover:bg-gray-100 ${
        copied ? 'text-status-success' : 'text-text-secondary'
      } ${className}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
