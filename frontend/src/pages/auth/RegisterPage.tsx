import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register(formData);
      toast.success('Account created successfully! Welcome to MGM Hardware.');
      navigate('/user/dashboard');
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      const firstErr = errs ? (Object.values(errs) as any[])[0]?.[0] : null;
      const msg = err.response?.data?.message || firstErr || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Register a new cashier/staff account"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="first_name"
            placeholder="John"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <Input
          label="Username"
          name="username"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          icon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Min. 6 characters"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock className="w-4 h-4" />}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          placeholder="Re-enter password"
          value={formData.password_confirmation}
          onChange={handleChange}
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
          Create Account
        </Button>

        <div className="pt-2 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
