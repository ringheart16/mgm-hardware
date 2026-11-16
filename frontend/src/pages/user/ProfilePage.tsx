import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Lock, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.put('/profile', profileData);
      updateUser(res.data);
      toast.success('Profile details updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.put('/change-password', passwordData);
      toast.success('Password updated successfully');
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-6 h-6 text-amber-400" /> Account & Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your credentials, cashier display name, and password security.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Shield className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">Personal Information</h3>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-3.5">
          <Input
            label="Username"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSavingProfile}
              icon={<Save className="w-4 h-4" />}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Lock className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-3.5">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.current_password}
            onChange={(e) =>
              setPasswordData({ ...passwordData, current_password: e.target.value })
            }
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Min. 6 characters"
            value={passwordData.password}
            onChange={(e) =>
              setPasswordData({ ...passwordData, password: e.target.value })
            }
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter password"
            value={passwordData.password_confirmation}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                password_confirmation: e.target.value,
              })
            }
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              isLoading={isSavingPassword}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
