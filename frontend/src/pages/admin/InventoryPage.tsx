import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Product } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { formatCurrency } from '../../utils/helpers';
import { Boxes, SlidersHorizontal, ArrowUpDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

  // Edit stock form
  const [stockQuantity, setStockQuantity] = useState<string>('0');
  const [reorderLevel, setReorderLevel] = useState<string>('5');

  // Adjust stock form
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('Restock from supplier');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInventory();
  }, [statusFilter]);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/inventory', { params });
      setInventory(res.data);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setStockQuantity(String(p.stock_quantity));
    setReorderLevel(String(p.reorder_level));
  };

  const handleOpenAdjust = (p: Product) => {
    setAdjustingProduct(p);
    setAdjustmentAmount('');
    setAdjustmentReason('Stock reconciliation');
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    try {
      await api.put(`/inventory/${editingProduct.product_id}/stock`, {
        stock_quantity: parseInt(stockQuantity),
        reorder_level: parseInt(reorderLevel),
      });
      toast.success('Stock levels updated');
      setEditingProduct(null);
      loadInventory();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    setIsSubmitting(true);
    try {
      await api.post(`/inventory/${adjustingProduct.product_id}/adjust`, {
        adjustment: parseInt(adjustmentAmount),
        reason: adjustmentReason,
      });
      toast.success('Stock adjustment applied');
      setAdjustingProduct(null);
      loadInventory();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Adjustment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      header: 'Code',
      accessor: (p) => <span className="font-mono text-xs text-amber-400 font-semibold">{p.product_code}</span>,
      className: 'w-24',
    },
    {
      header: 'Product Details',
      accessor: (p) => (
        <div>
          <span className="font-semibold text-slate-100">{p.product_name}</span>
          <p className="text-xs text-slate-400">
            {p.category?.category_name} • Unit: {formatCurrency(p.unit_price)}
          </p>
        </div>
      ),
    },
    {
      header: 'Current Stock',
      accessor: (p) => (
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-100">{p.stock_quantity}</span>
          <span className="text-xs text-slate-400">units</span>
        </div>
      ),
    },
    {
      header: 'Reorder Level',
      accessor: (p) => (
        <span className="text-xs text-slate-300 font-medium">Min {p.reorder_level} units</span>
      ),
    },
    {
      header: 'Status',
      accessor: (p) => {
        if (p.stock_quantity <= 0) {
          return (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          );
        }
        if (p.stock_quantity <= p.reorder_level) {
          return (
            <Badge variant="warning" size="sm">
              Low Stock
            </Badge>
          );
        }
        return (
          <Badge variant="success" size="sm">
            In Stock
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
            <Boxes className="w-6 h-6 text-amber-400" /> Stock & Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stock monitoring, replenishment alerts, and inventory adjustments.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800/80 w-fit">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            statusFilter === ''
              ? 'bg-amber-500 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Items ({inventory.length})
        </button>
        <button
          onClick={() => setStatusFilter('low')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            statusFilter === 'low'
              ? 'bg-amber-500 text-slate-950 font-semibold'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Low Stock
        </button>
        <button
          onClick={() => setStatusFilter('out')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            statusFilter === 'out'
              ? 'bg-rose-500 text-white font-semibold'
              : 'text-rose-400 hover:text-rose-300'
          }`}
        >
          Out of Stock
        </button>
        <button
          onClick={() => setStatusFilter('in')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            statusFilter === 'in'
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          In Stock
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={inventory}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search inventory by product code or description..."
        actions={(p) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowUpDown className="w-3.5 h-3.5" />}
              onClick={() => handleOpenAdjust(p)}
            >
              Adjust
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              onClick={() => handleOpenEdit(p)}
            >
              Set Level
            </Button>
          </div>
        )}
      />

      {/* Set Stock Level Modal */}
      <Modal
        isOpen={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        title={`Set Stock: ${editingProduct?.product_name}`}
        subtitle={`Product Code: ${editingProduct?.product_code}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveStock} className="space-y-4">
          <Input
            label="Current Physical Count (Units)"
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Reorder Alert Threshold"
            type="number"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
            helperText="System will trigger warnings when stock falls to this quantity"
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Update Stock Level
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={adjustingProduct !== null}
        onClose={() => setAdjustingProduct(null)}
        title={`Adjust Stock: ${adjustingProduct?.product_name}`}
        subtitle={`Current Stock: ${adjustingProduct?.stock_quantity} units`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdjustment} className="space-y-4">
          <Input
            label="Quantity Adjustment (+ to add, - to deduct)"
            type="number"
            placeholder="e.g. +20 or -5"
            value={adjustmentAmount}
            onChange={(e) => setAdjustmentAmount(e.target.value)}
            helperText="Enter positive number to restock, or negative for write-off/damaged goods"
            required
            autoFocus
          />

          <Select
            label="Reason for Adjustment"
            value={adjustmentReason}
            onChange={(e) => setAdjustmentReason(e.target.value)}
            options={[
              { value: 'Restock from supplier', label: 'Restock from supplier' },
              { value: 'Stock count reconciliation', label: 'Stock count reconciliation' },
              { value: 'Damaged or defective goods', label: 'Damaged or defective goods' },
              { value: 'Customer return', label: 'Customer return' },
              { value: 'Store internal use', label: 'Store internal use' },
            ]}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setAdjustingProduct(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Apply Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
