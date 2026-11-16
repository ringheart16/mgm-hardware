import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { SystemSetting } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Save, Lock, User, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch {
      toast.error('Failed to load system settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (id: number, val: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.setting_id === id ? { ...s, setting_value: val } : s))
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.put('/settings', { settings });
      toast.success('System settings saved successfully');
    } catch {
      toast.error('Failed to update system settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await api.put('/profile', profileData);
      updateUser(res.data);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.put('/change-password', passwordData);
      toast.success('Password changed successfully');
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
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-amber-400" /> System Settings & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Store parameters, database configuration, and account credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Settings Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Settings className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-100">Global Store Settings</h3>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-xs text-slate-500">Loading settings...</div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.setting_id}>
                  {setting.setting_name === 'Low Stock Alert' ? (
                    <Select
                      label={setting.setting_name}
                      value={setting.setting_value}
                      onChange={(e) =>
                        handleSettingChange(setting.setting_id, e.target.value)
                      }
                      options={[
                        { value: 'Enabled', label: 'Enabled' },
                        { value: 'Disabled', label: 'Disabled' },
                      ]}
                      helperText={setting.description}
                    />
                  ) : (
                    <Input
                      label={setting.setting_name}
                      value={setting.setting_value}
                      onChange={(e) =>
                        handleSettingChange(setting.setting_id, e.target.value)
                      }
                      helperText={setting.description}
                      required
                    />
                  )}
                </div>
              ))}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isSavingSettings}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Store Settings
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* User Profile Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-100">Account Details</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <Input
                label="Username"
                value={profileData.username}
                onChange={(e) =>
                  setProfileData({ ...profileData, username: e.target.value })
                }
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                required
              />

              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                isLoading={isSavingProfile}
              >
                Update Profile Info
              </Button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-100">Security & Password</h3>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3.5">
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
                placeholder="Re-enter new password"
                value={passwordData.password_confirmation}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password_confirmation: e.target.value,
                  })
                }
                required
              />

              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                isLoading={isSavingPassword}
              >
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
