import React from 'react';
import { Wrench } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <Wrench className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-white font-heading">
          MGM <span className="text-amber-400">Hardware</span>
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Supplies & Inventory Management System
        </p>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-500 relative z-10">
        Connected to <span className="text-slate-400 font-mono">mgm_hardware_db</span>
      </div>
    </div>
  );
};
