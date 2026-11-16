import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Purchase, Supplier, Product } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ShoppingCart, Plus, Eye, Trash2, Calendar, User, DollarSign, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Purchase Form
  const [supplierId, setSupplierId] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [items, setItems] = useState<
    { product_id: number; quantity: number; unit_cost: number }[]
  >([]);

  useEffect(() => {
    loadPurchases();
    loadMeta();
  }, []);

  const loadPurchases = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/purchases');
      setPurchases(res.data);
    } catch {
      toast.error('Failed to load purchases');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMeta = async () => {
    try {
      const [supRes, prodRes] = await Promise.all([
        api.get('/suppliers'),
        api.get('/products'),
      ]);
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
      if (supRes.data[0]) setSupplierId(String(supRes.data[0].supplier_id));
    } catch {
      console.error('Failed to load suppliers/products');
    }
  };

  const handleOpenCreate = () => {
    if (products.length > 0) {
      setItems([
        {
          product_id: products[0].product_id,
          quantity: 10,
          unit_cost: Number(products[0].unit_price) * 0.7, // wholesale estimate
        },
      ]);
    }
    setIsCreateModalOpen(true);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    setItems([
      ...items,
      {
        product_id: products[0].product_id,
        quantity: 5,
        unit_cost: Number(products[0].unit_price) * 0.7,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    const updated = [...items];
    if (field === 'product_id') {
      const prod = products.find((p) => p.product_id === Number(val));
      updated[index].product_id = Number(val);
      if (prod) {
        updated[index].unit_cost = Number(prod.unit_price) * 0.7;
      }
    } else if (field === 'quantity') {
      updated[index].quantity = Math.max(1, parseInt(val) || 1);
    } else if (field === 'unit_cost') {
      updated[index].unit_cost = Math.max(0, parseFloat(val) || 0);
    }
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Add at least one product item');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/purchases', {
        supplier_id: parseInt(supplierId),
        employee_id: 1, // Admin employee
        purchase_date: purchaseDate,
        items,
      });
      toast.success('Purchase order created and stock replenished!');
      setIsCreateModalOpen(false);
      loadPurchases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? Deleting this purchase will reverse the added stock quantity.')) {
      return;
    }
    try {
      await api.delete(`/purchases/${id}`);
      toast.success('Purchase deleted and inventory adjusted');
      loadPurchases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot delete purchase');
    }
  };

  const columns: Column<Purchase>[] = [
    {
      header: 'PO Number',
      accessor: (p) => <span className="font-mono text-xs text-amber-400 font-bold">PO-{p.purchase_id.toString().padStart(4, '0')}</span>,
      className: 'w-28',
    },
    {
      header: 'Supplier',
      accessor: (p) => (
        <div>
          <span className="font-semibold text-slate-100">{p.supplier?.supplier_name}</span>
          <p className="text-[11px] text-slate-400">{p.supplier?.contact_person || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: (p) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatDate(p.purchase_date)}</span>
        </div>
      ),
    },
    {
      header: 'Received By',
      accessor: (p) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {p.employee ? `${p.employee.first_name} ${p.employee.last_name}` : 'Warehouse'}
          </span>
        </div>
      ),
    },
    {
      header: 'Total Cost',
      accessor: (p) => (
        <span className="font-bold text-slate-100 text-sm">
          {formatCurrency(p.total_amount)}
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
            <ShoppingCart className="w-6 h-6 text-amber-400" /> Purchase Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Procurement records, inventory replenishment, and wholesale supplier purchases.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
          New Purchase Order
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={purchases}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search purchases by PO number or supplier..."
        searchFilter={(p, term) =>
          `PO-${p.purchase_id}`.toLowerCase().includes(term) ||
          (p.supplier?.supplier_name || '').toLowerCase().includes(term)
        }
        actions={(p) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewingPurchase(p)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="View Line Items"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(p.purchase_id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Delete Purchase"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {/* View Purchase Modal */}
      <Modal
        isOpen={viewingPurchase !== null}
        onClose={() => setViewingPurchase(null)}
        title={`Purchase Order PO-${viewingPurchase?.purchase_id.toString().padStart(4, '0')}`}
        subtitle={`Supplier: ${viewingPurchase?.supplier?.supplier_name} • Date: ${formatDate(
          viewingPurchase?.purchase_date
        )}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Unit Cost</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {viewingPurchase?.details?.map((detail) => (
                  <tr key={detail.purchase_detail_id}>
                    <td className="p-3 font-medium text-slate-200">
                      {detail.product?.product_name || `Product #${detail.product_id}`}
                    </td>
                    <td className="p-3 text-center">{detail.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(detail.unit_cost)}</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {formatCurrency(detail.quantity * Number(detail.unit_cost))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Cost</span>
            <span className="text-lg font-bold text-amber-400">
              {formatCurrency(viewingPurchase?.total_amount)}
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setViewingPurchase(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Purchase Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Purchase Order"
        subtitle="Stock will be automatically credited to product inventory upon creation"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              options={suppliers.map((s) => ({
                value: s.supplier_id,
                label: s.supplier_name,
              }))}
              required
            />

            <Input
              label="Purchase Date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Items Ordered</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Item
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex-1">
                    <select
                      value={item.product_id}
                      onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-xs text-slate-100"
                    >
                      {products.map((p) => (
                        <option key={p.product_id} value={p.product_id}>
                          {p.product_code} - {p.product_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-xs text-slate-100 text-center"
                    />
                  </div>

                  <div className="w-28">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Unit Cost"
                      value={item.unit_cost}
                      onChange={(e) => handleItemChange(idx, 'unit_cost', e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 text-xs text-slate-100 text-right"
                    />
                  </div>

                  <div className="w-28 text-right font-bold text-xs text-slate-200">
                    {formatCurrency(item.quantity * item.unit_cost)}
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total & Submit */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Purchase</span>
            <span className="text-xl font-extrabold text-amber-400">
              {formatCurrency(calculateTotal())}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Purchase Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
