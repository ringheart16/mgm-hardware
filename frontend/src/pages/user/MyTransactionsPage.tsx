import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Sale } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, formatDateTime, printReceipt } from '../../utils/helpers';
import { History, Eye, Printer, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyTransactionsPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  useEffect(() => {
    loadMySales();
  }, []);

  const loadMySales = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/sales');
      setSales(res.data);
    } catch {
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<Sale>[] = [
    {
      header: 'Invoice #',
      accessor: (s) => (
        <span className="font-mono text-xs text-amber-400 font-bold">
          INV-{s.sale_id.toString().padStart(5, '0')}
        </span>
      ),
      className: 'w-28',
    },
    {
      header: 'Customer',
      accessor: (s) => (
        <span className="font-medium text-slate-200">
          {s.customer?.customer_name || 'Walk-in Customer'}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (s) => <span className="text-xs text-slate-300">{formatDate(s.sale_date)}</span>,
    },
    {
      header: 'Payment Method',
      accessor: (s) => (
        <span className="text-xs text-slate-300 font-medium">
          {s.payment?.payment_method || 'Cash'}
        </span>
      ),
    },
    {
      header: 'Reference',
      accessor: (s) => (
        <span className="font-mono text-xs text-slate-400">
          {s.payment?.reference_number || '—'}
        </span>
      ),
    },
    {
      header: 'Amount Paid',
      accessor: (s) => (
        <span className="font-bold text-sm text-emerald-400">
          {formatCurrency(s.total_amount)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (s) => (
        <Badge variant={s.status === 'completed' ? 'success' : 'danger'} size="sm">
          {s.status}
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
            <History className="w-6 h-6 text-amber-400" /> My Transaction History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Orders processed by your cashier account. Reprint invoices and inspect customer tickets.
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={sales}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search by invoice number, customer, or reference..."
        searchFilter={(s, term) =>
          `INV-${s.sale_id}`.toLowerCase().includes(term) ||
          (s.customer?.customer_name || '').toLowerCase().includes(term) ||
          (s.payment?.reference_number || '').toLowerCase().includes(term)
        }
        actions={(s) => (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-3.5 h-3.5" />}
              onClick={() => setViewingSale(s)}
            >
              Receipt
            </Button>
          </div>
        )}
      />

      {/* Receipt Modal */}
      <Modal
        isOpen={viewingSale !== null}
        onClose={() => setViewingSale(null)}
        title={`Invoice #${viewingSale?.sale_id.toString().padStart(6, '0')}`}
        subtitle={`Customer: ${viewingSale?.customer?.customer_name}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div
            id="reprint-receipt"
            className="printable-receipt p-5 rounded-xl bg-white text-slate-950 font-mono text-xs space-y-3"
          >
            <div className="text-center border-b border-dashed border-slate-400 pb-2">
              <h3 className="font-bold text-sm tracking-wider uppercase">MGM HARDWARE</h3>
              <p className="text-[10px] text-slate-600">Supplies & POS Terminal</p>
              <p className="text-[10px] text-slate-600">
                INVOICE #{viewingSale?.sale_id.toString().padStart(6, '0')}
              </p>
            </div>

            <div className="text-[11px] space-y-1 border-b border-dashed border-slate-400 pb-2">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDateTime(viewingSale?.sale_date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold">{viewingSale?.customer?.customer_name}</span>
              </div>
            </div>

            <div className="space-y-1 border-b border-dashed border-slate-400 pb-2">
              {viewingSale?.details?.map((d) => (
                <div key={d.sale_detail_id} className="flex justify-between text-[11px]">
                  <span>
                    {d.quantity}x {d.product?.product_name || `Product #${d.product_id}`}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(d.quantity * Number(d.unit_price))}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] space-y-1 pt-1">
              <div className="flex justify-between text-sm font-bold">
                <span>TOTAL:</span>
                <span>{formatCurrency(viewingSale?.total_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Method:</span>
                <span className="font-semibold">{viewingSale?.payment?.payment_method}</span>
              </div>
              {viewingSale?.payment?.reference_number && (
                <div className="flex justify-between text-slate-700">
                  <span>Ref No:</span>
                  <span className="font-mono">{viewingSale?.payment?.reference_number}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setViewingSale(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => printReceipt()}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
