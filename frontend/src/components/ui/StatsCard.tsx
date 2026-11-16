import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'amber' | 'blue' | 'emerald' | 'rose' | 'purple';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'amber',
}) => {
  const variantStyles = {
    amber: 'from-amber-500/10 to-amber-500/0 text-amber-400 border-amber-500/20',
    blue: 'from-sky-500/10 to-sky-500/0 text-sky-400 border-sky-500/20',
    emerald: 'from-emerald-500/10 to-emerald-500/0 text-emerald-400 border-emerald-500/20',
    rose: 'from-rose-500/10 to-rose-500/0 text-rose-400 border-rose-500/20',
    purple: 'from-purple-500/10 to-purple-500/0 text-purple-400 border-purple-500/20',
  };

  const iconBgStyles = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${variantStyles[variant]} bg-slate-900 border border-slate-800/80 p-5 shadow-sm hover:border-slate-700 transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h4 className="mt-2 text-2xl font-bold tracking-tight text-slate-100">{value}</h4>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <span
                className={`font-semibold ${
                  trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}
              </span>
              <span className="ml-1 text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`rounded-xl p-3 border ${iconBgStyles[variant]} shadow-sm shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
