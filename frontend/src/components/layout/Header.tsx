import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, LogOut, ShoppingCart, User, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const posPath = isAdmin ? '/admin/pos' : '/user/pos';
  const profilePath = isAdmin ? '/admin/settings' : '/user/profile';

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-slate-400 font-medium">Database: mgm_hardware_db</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Cart / POS Quick Link */}
        <Link
          to={posPath}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
        >
          <ShoppingCart className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">POS Cart</span>
          {totalItems > 0 && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Role Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-xs text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="capitalize font-medium">{user?.role}</span>
        </div>

        {/* Profile Link */}
        <Link
          to={profilePath}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Account Profile"
        >
          <User className="w-4 h-4" />
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
