import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency, formatDate, printReceipt } from '../../utils/helpers';
import {
  FileBarChart,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  CreditCard,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'inventory' | 'payments'>('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [salesReport, setSalesReport] = useState<{ sales: any[]; summary: any } | null>(null);
  const [purchaseReport, setPurchaseReport] = useState<{ purchases: any[]; summary: any } | null>(null);
  const [inventoryReport, setInventoryReport] = useState<{ products: any[]; summary: any } | null>(null);
  const [paymentReport, setPaymentReport] = useState<{ payments: any[]; by_method: any; total_collected: any } | null>(null);

  useEffect(() => {
    fetchReport();
  }, [activeTab, dateFrom, dateTo]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      if (activeTab === 'sales') {
        const res = await api.get('/reports/sales', { params });
        setSalesReport(res.data);
      } else if (activeTab === 'purchases') {
        const res = await api.get('/reports/purchases', { params });
        setPurchaseReport(res.data);
      } else if (activeTab === 'inventory') {
        const res = await api.get('/reports/inventory');
        setInventoryReport(res.data);
      } else if (activeTab === 'payments') {
        const res = await api.get('/reports/payments', { params });
        setPaymentReport(res.data);
      }
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileBarChart className="w-6 h-6 text-amber-400" /> Business Intelligence & Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and print financial summaries, procurement logs, and stock valuation audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-800/80 no-print">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sales & Revenue
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'purchases'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inventory Valuation
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Payment Collections
          </button>
        </div>

        {/* Date Filters (Hidden on Print) */}
        {activeTab !== 'inventory' && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300"
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-300"
            />
          </div>
        )}
      </div>

      {/* Printable Report Header */}
      <div className="hidden print-only text-center pb-4 border-b border-slate-300">
        <h2 className="text-xl font-bold uppercase">MGM HARDWARE SUPPLIES</h2>
        <p className="text-xs">Official Management Audit Report • Generated on {new Date().toLocaleDateString()}</p>
        <p className="text-xs font-semibold uppercase mt-1">Module: {activeTab.toUpperCase()} REPORT</p>
      </div>

      {/* Sales Report Tab */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Revenue
              </p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-2">
                {formatCurrency(salesReport?.summary?.total_sales ?? 0)}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Transactions
              </p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-2">
                {salesReport?.summary?.total_transactions ?? 0}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Average Sale Value
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">
                {formatCurrency(salesReport?.summary?.average_sale ?? 0)}
              </h3>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salesReport?.sales?.map((s: any) => (
                  <tr key={s.sale_id}>
                    <td className="p-3 font-mono text-amber-400 font-bold">
                      INV-{s.sale_id.toString().padStart(5, '0')}
                    </td>
                    <td className="p-3 font-medium text-slate-200">
                      {s.customer?.customer_name || 'Walk-in'}
                    </td>
                    <td className="p-3">{formatDate(s.sale_date)}</td>
                    <td className="p-3">{s.payment?.payment_method || 'Cash'}</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {formatCurrency(s.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Purchases Report Tab */}
      {activeTab === 'purchases' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Procurement
              </p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-2">
                {formatCurrency(purchaseReport?.summary?.total_purchases ?? 0)}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Orders
              </p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-2">
                {purchaseReport?.summary?.total_orders ?? 0}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Average Purchase Order
              </p>
              <h3 className="text-2xl font-extrabold text-sky-400 mt-2">
                {formatCurrency(purchaseReport?.summary?.average_purchase ?? 0)}
              </h3>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Purchase Date</th>
                  <th className="p-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchaseReport?.purchases?.map((p: any) => (
                  <tr key={p.purchase_id}>
                    <td className="p-3 font-mono text-amber-400 font-bold">
                      PO-{p.purchase_id.toString().padStart(4, '0')}
                    </td>
                    <td className="p-3 font-medium text-slate-200">
                      {p.supplier?.supplier_name}
                    </td>
                    <td className="p-3">{formatDate(p.purchase_date)}</td>
                    <td className="p-3 text-right font-bold text-slate-100">
                      {formatCurrency(p.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Valuation Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Stock Valuation
              </p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">
                {formatCurrency(inventoryReport?.summary?.total_stock_value ?? 0)}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Catalog Items
              </p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-2">
                {inventoryReport?.summary?.total_products ?? 0}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Low Stock Warnings
              </p>
              <h3 className="text-2xl font-extrabold text-amber-400 mt-2">
                {inventoryReport?.summary?.low_stock ?? 0}
              </h3>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Out of Stock Items
              </p>
              <h3 className="text-2xl font-extrabold text-rose-400 mt-2">
                {inventoryReport?.summary?.out_of_stock ?? 0}
              </h3>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">In Stock</th>
                  <th className="p-3 text-right">Retail Unit Price</th>
                  <th className="p-3 text-right">Asset Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inventoryReport?.products?.map((p: any) => (
                  <tr key={p.product_id}>
                    <td className="p-3 font-semibold text-slate-200">
                      {p.product_name} <span className="text-slate-500 font-mono text-[10px]">({p.product_code})</span>
                    </td>
                    <td className="p-3">{p.category?.category_name}</td>
                    <td className="p-3 text-center font-bold text-slate-100">
                      {p.stock_quantity}
                    </td>
                    <td className="p-3 text-right">{formatCurrency(p.unit_price)}</td>
                    <td className="p-3 text-right font-bold text-amber-400">
                      {formatCurrency(p.stock_quantity * Number(p.unit_price))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Collections Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Total Collections
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                {formatCurrency(paymentReport?.total_collected ?? 0)}
              </h3>
            </div>
          </div>

          {/* Breakdown By Method */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(paymentReport?.by_method || {}).map(([method, val]: any) => (
              <div key={method} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-xs font-semibold text-slate-400">{method}</p>
                <p className="text-base font-bold text-slate-100 mt-1">
                  {formatCurrency(val.total)}
                </p>
                <p className="text-[10px] text-slate-500">{val.count} payments</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Payment ID</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paymentReport?.payments?.map((pay: any) => (
                  <tr key={pay.payment_id}>
                    <td className="p-3 font-mono text-slate-400">
                      #PAY-{pay.payment_id.toString().padStart(4, '0')}
                    </td>
                    <td className="p-3 font-semibold text-slate-200">{pay.payment_method}</td>
                    <td className="p-3 font-mono text-amber-300">
                      {pay.reference_number || '—'}
                    </td>
                    <td className="p-3">{formatDate(pay.payment_date)}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      {formatCurrency(pay.amount_paid)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
