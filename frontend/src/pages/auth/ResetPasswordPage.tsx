import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Key, Lock, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) setEmail(qEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/reset-password', {
        email,
        temp_password: tempPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success('Password reset successfully! Please sign in with your new password.');
      navigate('/login');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.errors?.temp_password?.[0] ||
        'Failed to reset password. Please check your temporary code.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a new password using your temporary key"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@mgmhardware.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Temporary Key / Code"
          type="text"
          placeholder="e.g. 7A8B9C0D"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
          icon={<Key className="w-4 h-4" />}
          required
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Min. 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Reset Password
        </Button>

        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
