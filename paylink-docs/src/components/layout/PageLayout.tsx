import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="pt-12 pl-60 min-h-screen">
      <div className="max-w-4xl px-8 py-10">
        <div className="mb-8 pb-6 border-b border-border">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">{title}</h1>
          <p className="text-text-secondary">{description}</p>
        </div>
        <div className="space-y-12">{children}</div>
      </div>
    </div>
  );
}
