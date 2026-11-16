import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Customer } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { Users2, Plus, Edit2, Trash2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      customer_name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      customer_name: c.customer_name,
      contact_person: c.contact_person || '',
      phone: c.phone || '',
      email: c.email || '',
      address: c.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.customer_id}`, formData);
        toast.success('Customer profile updated');
      } else {
        await api.post('/customers', formData);
        toast.success('New customer registered');
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (err: any) {
      const errs = err.response?.data?.errors;
      const firstErr = errs ? (Object.values(errs) as any[])[0]?.[0] : null;
      toast.error(err.response?.data?.message || firstErr || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/customers/${id}`);
      toast.success('Customer record deleted');
      setDeleteConfirmId(null);
      loadCustomers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete customer with sales history');
    }
  };

  const columns: Column<Customer>[] = [
    {
      header: 'Customer / Company',
      accessor: (c) => (
        <div>
          <span className="font-semibold text-slate-100">{c.customer_name}</span>
          <p className="text-xs text-slate-400">Contact: {c.contact_person || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: (c) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Phone className="w-3 h-3 text-amber-400" />
          <span>{c.phone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: (c) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Mail className="w-3 h-3 text-slate-500" />
          <span>{c.email || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: (c) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 max-w-xs truncate">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span>{c.address || '—'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-amber-400" /> Customers Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contractors, builders, and retail client account details for checkout and invoicing.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Register Customer
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={customers}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search customers by name, phone, or company..."
        searchFilter={(c, term) =>
          c.customer_name.toLowerCase().includes(term) ||
          (c.contact_person || '').toLowerCase().includes(term) ||
          (c.phone || '').includes(term)
        }
        actions={(c) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenEdit(c)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Edit Customer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {isAdmin && (
              <button
                onClick={() => setDeleteConfirmId(c.customer_id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete Customer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Register New Customer'}
        subtitle="Customer details used on sales invoices and receipts"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Name or Company"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            placeholder="e.g. Cebu Builders Inc."
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder="e.g. Robert Lim"
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 09181111111"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. robert@cebubuilders.com"
          />

          <Input
            label="Address / Delivery Location"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="e.g. Cebu City"
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingCustomer ? 'Save Changes' : 'Save Customer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Customer Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p>
              Are you sure? Customers with sales history cannot be deleted to protect accounting
              integrity.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
