import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await login({ username, password }, remember);
      toast.success(`Welcome back, ${user.username}!`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.username?.[0] ||
        'Failed to log in. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle="Enter your credentials to access the system"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Username or Email"
          type="text"
          placeholder="admin or cashier"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<User className="w-4 h-4" />}
          autoFocus
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-slate-900 cursor-pointer accent-amber-500"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Sign In
        </Button>

        <div className="pt-2 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Create account
          </Link>
        </div>

        {/* Demo Credentials Helper */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Default Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
              }}
              className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-colors"
            >
              <span className="text-amber-400 font-bold block">Admin</span>
              <span>admin / admin123</span>
            </div>
            <div
              onClick={() => {
                setUsername('cashier');
                setPassword('cashier123');
              }}
              className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-colors"
            >
              <span className="text-amber-400 font-bold block">Cashier</span>
              <span>cashier / cashier123</span>
            </div>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};
