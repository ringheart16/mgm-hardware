import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Category } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Layers, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ category_name: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name,
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.category_id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      loadCategories();
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
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      setDeleteConfirmId(null);
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete category');
    }
  };

  const columns: Column<Category>[] = [
    {
      header: 'ID',
      accessor: (c) => <span className="font-mono text-xs text-slate-500">#{c.category_id}</span>,
      className: 'w-16',
    },
    {
      header: 'Category Name',
      accessor: (c) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100">{c.category_name}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: (c) => <span className="text-slate-400 text-xs">{c.description || '—'}</span>,
    },
    {
      header: 'Products Count',
      accessor: (c) => (
        <Badge variant="amber" size="sm">
          {c.products_count ?? 0} items
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" /> Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize hardware catalog into electrical, plumbing, power tools, and hardware groups.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search categories..."
        actions={(c) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenEdit(c)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Edit Category"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirmId(c.category_id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Delete Category"
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
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        subtitle="Specify category name and description"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={formData.category_name}
            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
            placeholder="e.g. Plumbing Materials"
            required
            autoFocus
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of items in this category"
              rows={3}
              className="block w-full rounded-xl bg-slate-950/60 border border-slate-800 focus:border-amber-500/80 focus:ring-amber-500/20 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Category Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p>
              Are you sure? Categories containing products cannot be deleted until all products are
              reassigned or removed.
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
