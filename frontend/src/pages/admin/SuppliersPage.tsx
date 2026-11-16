import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Supplier } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Truck, Plus, Edit2, Trash2, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    supplier_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch {
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      supplier_name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({
      supplier_name: sup.supplier_name,
      contact_person: sup.contact_person || '',
      phone: sup.phone || '',
      email: sup.email || '',
      address: sup.address || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSupplier) {
        await api.put(`/suppliers/${editingSupplier.supplier_id}`, formData);
        toast.success('Supplier updated successfully');
      } else {
        await api.post('/suppliers', formData);
        toast.success('Supplier created successfully');
      }
      setIsModalOpen(false);
      loadSuppliers();
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
      await api.delete(`/suppliers/${id}`);
      toast.success('Supplier removed successfully');
      setDeleteConfirmId(null);
      loadSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete supplier');
    }
  };

  const columns: Column<Supplier>[] = [
    {
      header: 'Supplier Name',
      accessor: (s) => (
        <div>
          <span className="font-semibold text-slate-100">{s.supplier_name}</span>
          <p className="text-xs text-slate-400">Contact: {s.contact_person || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      accessor: (s) => (
        <div className="space-y-0.5 text-xs text-slate-300">
          {s.phone && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{s.phone}</span>
            </div>
          )}
          {s.email && (
            <div className="flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{s.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Address',
      accessor: (s) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 max-w-xs truncate">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span>{s.address || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Supplied Items',
      accessor: (s) => (
        <span className="font-semibold text-slate-300 text-xs">
          {s.products_count ?? 0} products
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-amber-400" /> Hardware Suppliers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vendor contacts, addresses, and product supply channels.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Supplier
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={suppliers}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search suppliers by name, email, or contact person..."
        searchFilter={(s, term) =>
          s.supplier_name.toLowerCase().includes(term) ||
          (s.contact_person || '').toLowerCase().includes(term) ||
          (s.email || '').toLowerCase().includes(term)
        }
        actions={(s) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenEdit(s)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Edit Supplier"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirmId(s.supplier_id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Delete Supplier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}
        subtitle="Manage vendor contact credentials and address"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Supplier Company Name"
            value={formData.supplier_name}
            onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
            placeholder="e.g. Cebu Hardware Supply"
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Person"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              placeholder="e.g. Juan Santos"
            />
            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. 09171234567"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. orders@cebuhardware.com"
          />

          <Input
            label="Complete Address / City"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="e.g. Cebu City"
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingSupplier ? 'Save Changes' : 'Register Supplier'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Supplier Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p>
              Are you sure? Suppliers associated with products or purchase orders cannot be deleted.
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
