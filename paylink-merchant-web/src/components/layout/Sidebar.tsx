import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Link2, ArrowLeftRight, BarChart2, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/links', label: 'Links', Icon: Link2 },
  { to: '/transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { to: '/analytics', label: 'Analytics', Icon: BarChart2 },
  { to: '/settings', label: 'Settings', Icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <span className="text-xl font-bold text-primary">PayLink</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition mb-0.5 ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
