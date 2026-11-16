import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Employee } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { UserCog, Plus, Edit2, Shield, UserX, UserCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    employee_id: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const [usersRes, empRes] = await Promise.all([
        api.get('/users'),
        // Let's get employees by checking existing customers/employees or load directly
        api.get('/users'),
      ]);
      setUsers(usersRes.data);
    } catch {
      toast.error('Failed to load user accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active',
      employee_id: '1',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      email: u.email,
      password: '',
      role: u.role,
      status: u.status,
      employee_id: u.employee_id ? String(u.employee_id) : '1',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
      };

      if (!editingUser || formData.password) {
        payload.password = formData.password;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.user_id}`, payload);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', payload);
        toast.success('User account created');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      const firstErr = errs ? (Object.values(errs) as any[])[0]?.[0] : null;
      toast.error(err.response?.data?.message || firstErr || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (userToToggle: User) => {
    if (userToToggle.user_id === currentUser?.user_id) {
      toast.error('You cannot deactivate your own logged-in account');
      return;
    }

    const nextStatus = userToToggle.status === 'active' ? 'inactive' : 'active';

    try {
      await api.put(`/users/${userToToggle.user_id}`, {
        username: userToToggle.username,
        email: userToToggle.email,
        role: userToToggle.role,
        status: nextStatus,
      });
      toast.success(`User set to ${nextStatus}`);
      loadUsers();
    } catch {
      toast.error('Failed to change user status');
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'User',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 uppercase">
            {u.username[0]}
          </div>
          <div>
            <span className="font-semibold text-slate-100">{u.username}</span>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Employee',
      accessor: (u) => (
        <span className="text-xs text-slate-300">
          {u.employee
            ? `${u.employee.first_name} ${u.employee.last_name} (${u.employee.position || 'Staff'})`
            : 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'System Role',
      accessor: (u) => (
        <Badge variant={u.role === 'admin' ? 'amber' : 'info'} size="sm">
          {u.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Account Status',
      accessor: (u) => {
        const variants: Record<string, 'success' | 'danger' | 'warning'> = {
          active: 'success',
          inactive: 'neutral' as any,
          suspended: 'danger',
        };
        return (
          <Badge variant={variants[u.status] || 'neutral'} size="sm">
            {u.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <UserCog className="w-6 h-6 text-amber-400" /> User Accounts & Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage administrator and cashier logins, roles, and status verification.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add User Account
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search users by username or email..."
        actions={(u) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleOpenEdit(u)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Edit User"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {u.user_id !== currentUser?.user_id && (
              <button
                onClick={() => handleToggleStatus(u)}
                className={`p-1.5 rounded-lg transition-colors ${
                  u.status === 'active'
                    ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                }`}
                title={u.status === 'active' ? 'Deactivate User' : 'Activate User'}
              >
                {u.status === 'active' ? (
                  <UserX className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        )}
      />

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit Account: ${editingUser.username}` : 'Create User Account'}
        subtitle="Set authentication credentials, role authority, and account status"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              autoFocus
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <Input
            label={editingUser ? 'New Password (leave blank to keep current)' : 'Account Password'}
            type="password"
            placeholder="Min. 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingUser}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Access Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'admin', label: 'Admin (Full System Access)' },
                { value: 'user', label: 'User / Cashier (POS & Sales)' },
              ]}
              required
            />

            <Select
              label="Account Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive (Deactivated)' },
                { value: 'suspended', label: 'Suspended' },
              ]}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
