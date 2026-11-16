import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempPasswordInfo, setTempPasswordInfo] = useState<{
    temp_password?: string;
    message?: string;
    email?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      const res = await api.post('/forgot-password', { email });
      setTempPasswordInfo({
        temp_password: res.data.temp_password,
        message: res.data.message,
        email,
      });
      toast.success('Temporary password generated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your account email to receive a temporary reset password"
    >
      {!tempPasswordInfo ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@mgmhardware.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Generate Temporary Password
          </Button>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <KeyRound className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 mb-2">
              Your temporary password for <span className="font-semibold text-slate-100">{tempPasswordInfo.email}</span> is:
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-lg font-bold text-amber-400 select-all tracking-wider">
              {tempPasswordInfo.temp_password}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Use this temporary code on the Reset Password page to create a new password.
            </p>
          </div>

          <Link
            to={`/reset-password?email=${encodeURIComponent(tempPasswordInfo.email || '')}`}
            className="block w-full"
          >
            <Button variant="primary" size="lg" className="w-full">
              Proceed to Reset Password
            </Button>
          </Link>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
