import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export function Topbar() {
  const { merchant, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div>
        <p className="text-sm font-semibold text-text-primary">{merchant?.businessName ?? 'Merchant'}</p>
        <p className="text-xs text-text-secondary">{merchant?.email}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut size={16} />
        Logout
      </Button>
    </header>
  );
}
