import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { Payment } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { CreditCard, Banknote, QrCode, Building, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  useEffect(() => {
    loadPayments();
  }, [methodFilter, dateFrom, dateTo]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (methodFilter) params.payment_method = methodFilter;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await api.get('/payments', { params });
      setPayments(res.data);
    } catch {
      toast.error('Failed to load payment transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const totalCollected = useMemo(() => {
    return payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  }, [payments]);

  const methodIcons: Record<string, React.ReactNode> = {
    Cash: <Banknote className="w-3.5 h-3.5 text-emerald-400" />,
    GCash: <QrCode className="w-3.5 h-3.5 text-sky-400" />,
    Maya: <QrCode className="w-3.5 h-3.5 text-emerald-400" />,
    'Bank Transfer': <Building className="w-3.5 h-3.5 text-purple-400" />,
    Card: <CreditCard className="w-3.5 h-3.5 text-amber-400" />,
  };

  const columns: Column<Payment>[] = [
    {
      header: 'Payment ID',
      accessor: (p) => (
        <span className="font-mono text-xs text-slate-400">
          #PAY-{p.payment_id.toString().padStart(4, '0')}
        </span>
      ),
      className: 'w-24',
    },
    {
      header: 'Invoice #',
      accessor: (p) => (
        <span className="font-mono text-xs text-amber-400 font-bold">
          INV-{p.sale_id.toString().padStart(5, '0')}
        </span>
      ),
      className: 'w-24',
    },
    {
      header: 'Customer',
      accessor: (p) => (
        <span className="font-medium text-slate-200">
          {p.sale?.customer?.customer_name || 'Walk-in Customer'}
        </span>
      ),
    },
    {
      header: 'Method',
      accessor: (p) => (
        <div className="flex items-center gap-1.5">
          {methodIcons[p.payment_method] || <CreditCard className="w-3.5 h-3.5" />}
          <span className="text-xs font-semibold text-slate-200">{p.payment_method}</span>
        </div>
      ),
    },
    {
      header: 'Reference Number',
      accessor: (p) => (
        <span className="font-mono text-xs text-slate-400">
          {p.reference_number ? (
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-amber-300">
              {p.reference_number}
            </span>
          ) : (
            <span className="text-slate-600">—</span>
          )}
        </span>
      ),
    },
    {
      header: 'Payment Date',
      accessor: (p) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{formatDateTime(p.payment_date)}</span>
        </div>
      ),
    },
    {
      header: 'Amount Paid',
      accessor: (p) => (
        <span className="font-bold text-sm text-emerald-400">
          {formatCurrency(p.amount_paid)}
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
            <CreditCard className="w-6 h-6 text-amber-400" /> Payment Transactions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cash collections, e-wallet transfers (GCash/Maya), and card payment references.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Total Filtered Collections
            </p>
            <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalCollected)}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
        <div className="w-48">
          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            options={[
              { value: 'Cash', label: 'Cash' },
              { value: 'GCash', label: 'GCash' },
              { value: 'Maya', label: 'Maya' },
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'Card', label: 'Credit/Debit Card' },
            ]}
            placeholder="All Payment Methods"
          />
        </div>

        <div className="w-40">
          <Input
            type="date"
            placeholder="Date From"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="w-40">
          <Input
            type="date"
            placeholder="Date To"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {(methodFilter || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMethodFilter('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={payments}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search payments by reference number or customer..."
        searchFilter={(p, term) =>
          (p.reference_number || '').toLowerCase().includes(term) ||
          (p.sale?.customer?.customer_name || '').toLowerCase().includes(term) ||
          `INV-${p.sale_id}`.toLowerCase().includes(term)
        }
      />
    </div>
  );
};
