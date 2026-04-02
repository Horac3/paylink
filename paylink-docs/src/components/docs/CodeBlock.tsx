import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, Check } from 'lucide-react';
import { useApiContext } from '../../context/ApiContext';

interface CodeBlockProps {
  code: string;
  language: string;
  label?: string;
}

export function CodeBlock({ code, language, label }: CodeBlockProps) {
  const { theme } = useApiContext();
  const [copied, setCopied] = useState(false);

  const prismTheme = theme === 'dark' ? themes.oneDark : themes.oneLight;
  const codeBg = theme === 'dark' ? '#0d1117' : '#f1f5f9';

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
          <span className="text-xs text-text-secondary font-mono">{label}</span>
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors">
              {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      )}
      <Highlight code={code.trim()} language={language} theme={prismTheme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} text-xs leading-relaxed overflow-x-auto p-4 m-0`}
            style={{ ...style, background: codeBg, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      {!label && (
        <div className="flex justify-end px-3 py-1.5 bg-code-bg border-t border-border">
          <CopyToClipboard text={code} onCopy={handleCopy}>
            <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors">
              {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}
