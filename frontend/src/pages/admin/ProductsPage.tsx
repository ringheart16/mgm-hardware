import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Product, Category, Supplier } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    category_id: '',
    supplier_id: '',
    unit_price: '',
    stock_quantity: '',
    reorder_level: '5',
  });

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStockStatus]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedStockStatus) params.stock_status = selectedStockStatus;

      const [prodRes, catRes, supRes] = await Promise.all([
        api.get('/products', { params }),
        api.get('/categories').catch((err) => {
          console.error('Failed to load categories', err);
          return { data: [] };
        }),
        api.get('/suppliers').catch((err) => {
          console.error('Failed to load suppliers', err);
          return { data: [] };
        }),
      ]);

      setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.data || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setSuppliers(Array.isArray(supRes.data) ? supRes.data : []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      product_code: 'PRD-' + Math.floor(1000 + Math.random() * 9000),
      product_name: '',
      category_id: categories[0]?.category_id ? String(categories[0].category_id) : '',
      supplier_id: suppliers[0]?.supplier_id ? String(suppliers[0].supplier_id) : '',
      unit_price: '',
      stock_quantity: '0',
      reorder_level: '5',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      product_code: product.product_code,
      product_name: product.product_name,
      category_id: String(product.category_id),
      supplier_id: String(product.supplier_id),
      unit_price: String(product.unit_price),
      stock_quantity: String(product.stock_quantity),
      reorder_level: String(product.reorder_level),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.product_id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product added successfully');
      }
      setIsModalOpen(false);
      loadData();
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
      await api.delete(`/products/${id}`);
      toast.success('Product removed successfully');
      setDeleteConfirmId(null);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete product');
    }
  };

  const columns: Column<Product>[] = [
    {
      header: 'Code',
      accessor: (p) => <span className="font-mono text-xs text-amber-400 font-semibold">{p.product_code}</span>,
    },
    {
      header: 'Product Name',
      accessor: (p) => (
        <div>
          <span className="font-medium text-slate-100">{p.product_name}</span>
          <p className="text-[11px] text-slate-400 font-mono">
            {p.supplier?.supplier_name || 'No supplier'}
          </p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: (p) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          {p.category?.category_name || '—'}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: (p) => <span className="font-semibold text-slate-100">{formatCurrency(p.unit_price)}</span>,
    },
    {
      header: 'Stock',
      accessor: (p) => {
        let badgeVariant: 'danger' | 'warning' | 'success' = 'success';
        let label = `${p.stock_quantity} in stock`;

        if (p.stock_quantity <= 0) {
          badgeVariant = 'danger';
          label = 'Out of Stock';
        } else if (p.stock_quantity <= p.reorder_level) {
          badgeVariant = 'warning';
          label = `Low (${p.stock_quantity})`;
        }

        return (
          <div className="flex flex-col gap-0.5">
            <Badge variant={badgeVariant} size="sm">
              {label}
            </Badge>
            <span className="text-[10px] text-slate-500">Min: {p.reorder_level}</span>
          </div>
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
            <Package className="w-6 h-6 text-amber-400" /> Products Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, and manage hardware inventory items and pricing.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
          >
            Add New Product
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
        <div className="w-44">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories.map((c) => ({
              value: c.category_id,
              label: c.category_name,
            }))}
            placeholder="All Categories"
          />
        </div>

        <div className="w-44">
          <Select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            options={[
              { value: 'in', label: 'In Stock' },
              { value: 'low', label: 'Low Stock' },
              { value: 'out', label: 'Out of Stock' },
            ]}
            placeholder="All Stock Levels"
          />
        </div>

        {(selectedCategory || selectedStockStatus) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory('');
              setSelectedStockStatus('');
            }}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search products by name or code..."
        searchFilter={(p, term) =>
          p.product_name.toLowerCase().includes(term) ||
          p.product_code.toLowerCase().includes(term)
        }
        actions={
          isAdmin
            ? (p) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(p.product_id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            : undefined
        }
      />

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Hardware Product'}
        subtitle="Specify product specifications, pricing, and reorder limits"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Code"
              value={formData.product_code}
              onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
              required
            />
            <Input
              label="Product Name"
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="e.g. 1/2 HP Submersible Pump"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categories.map((c) => ({
                value: c.category_id,
                label: c.category_name,
              }))}
              required
            />
            <Select
              label="Supplier"
              value={formData.supplier_id}
              onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
              options={suppliers.map((s) => ({
                value: s.supplier_id,
                label: s.supplier_name,
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Unit Price (₱)"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              required
            />
            <Input
              label="Stock Quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              required
            />
            <Input
              label="Reorder Level"
              type="number"
              value={formData.reorder_level}
              onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p>
              Are you sure you want to delete this product? This action cannot be undone if sales or
              purchase records depend on it.
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
