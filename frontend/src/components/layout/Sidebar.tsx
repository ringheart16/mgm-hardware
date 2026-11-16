import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePWA } from '../../hooks/usePWA';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  Truck,
  Users2,
  ShoppingCart,
  Receipt,
  CreditCard,
  UserCog,
  FileBarChart,
  Settings,
  History,
  User,
  Wrench,
  ChevronRight,
  Download,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const { isInstallable, installApp } = usePWA();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Layers },
    { to: '/admin/inventory', label: 'Inventory & Stock', icon: Boxes },
    { to: '/admin/suppliers', label: 'Suppliers', icon: Truck },
    { to: '/admin/customers', label: 'Customers', icon: Users2 },
    { to: '/admin/purchases', label: 'Purchases', icon: ShoppingCart },
    { to: '/admin/pos', label: 'Sales / POS', icon: Receipt },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/users', label: 'Users', icon: UserCog },
    { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const userLinks = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/products', label: 'Products', icon: Package },
    { to: '/user/pos', label: 'Sales / POS', icon: Receipt },
    { to: '/user/customers', label: 'Customers', icon: Users2 },
    { to: '/user/payments', label: 'Payments', icon: CreditCard },
    { to: '/user/transactions', label: 'My Transactions', icon: History },
    { to: '/user/profile', label: 'Profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              MGM <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">Hardware</span>
            </span>
            <p className="text-[11px] text-slate-400 -mt-0.5">Supplies & POS</p>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 uppercase">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.username}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                {user?.role} {user?.employee ? `• ${user.employee.first_name}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {isAdmin ? 'Administration' : 'Cashier Portal'}
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-slate-950 stroke-[2.5]'
                            : 'text-slate-400 group-hover:text-amber-400'
                        }`}
                      />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive
                          ? 'text-slate-950 opacity-80'
                          : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 text-center">
          {isInstallable && (
            <button
              onClick={installApp}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Install Mobile App</span>
            </button>
          )}
          <p className="text-[10px] text-slate-500">MGM Hardware Supplies v1.0</p>
        </div>
      </aside>
    </>
  );
};
