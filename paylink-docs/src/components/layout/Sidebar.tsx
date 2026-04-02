import { NavLink } from 'react-router-dom';
import { navGroups } from '../../data/endpoints';

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-surface border-r border-border flex flex-col z-20">
      <div className="px-5 py-4 border-b border-border flex-shrink-0">
        <span className="text-text-primary font-semibold text-base tracking-tight">PayLink</span>
        <span className="ml-2 text-xs text-text-secondary font-mono bg-border/50 px-1.5 py-0.5 rounded">API</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="px-2 mb-1 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `block px-3 py-1.5 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/20 text-accent font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-border/30'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-5 py-3 border-t border-border flex-shrink-0">
        <p className="text-xs text-text-secondary">v1.0 · Malawi</p>
      </div>
    </aside>
  );
}
