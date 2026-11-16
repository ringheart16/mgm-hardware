import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Receipt, ShoppingCart, Users, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMySales();
  }, []);

  const loadMySales = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/sales');
      setSales(res.data);
    } catch {
      console.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const todaySalesTotal = sales
    .filter((s) => s.sale_date === new Date().toISOString().split('T')[0])
    .reduce((sum, s) => sum + Number(s.total_amount), 0);

  const totalMySalesCount = sales.length;
  const totalMyRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);

  return (
    <div className="space-y-6">
      {/* Cashier Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Cashier & Sales Counter
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Welcome, {user?.employee?.first_name || user?.username}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ready to process customer checkouts and manage point of sale operations.
          </p>
        </div>
        <Link to="/user/pos">
          <Button variant="primary" size="lg" icon={<Receipt className="w-5 h-5" />}>
            Open POS Register
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Today's Shift Sales"
          value={formatCurrency(todaySalesTotal)}
          subtitle="Processed at your counter"
          icon={<Receipt className="w-5 h-5" />}
          variant="amber"
        />
        <StatsCard
          title="My Total Transactions"
          value={totalMySalesCount}
          subtitle="All completed invoices"
          icon={<History className="w-5 h-5" />}
          variant="blue"
        />
        <StatsCard
          title="Total Lifetime Collections"
          value={formatCurrency(totalMyRevenue)}
          subtitle="Revenue generated"
          icon={<ShoppingCart className="w-5 h-5" />}
          variant="emerald"
        />
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/user/pos"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              Start New Customer Checkout
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select hardware supplies, apply discounts, accept GCash, Maya, Cash or Card
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/user/products"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between group"
        >
          <div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              Check Product Stock & Prices
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Quickly look up item availability and unit pricing for customer inquiries
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent My Transactions */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-100">My Recent Invoices</h3>
          <Link to="/user/transactions" className="text-xs text-amber-400 hover:text-amber-300">
            View All Transactions →
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading your transactions...</div>
        ) : sales.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No transactions recorded yet today.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {sales.slice(0, 5).map((sale) => (
              <div key={sale.sale_id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    {sale.customer?.customer_name || 'Walk-in Customer'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Invoice #{sale.sale_id} • {formatDate(sale.sale_date)} •{' '}
                    <span className="text-amber-400">{sale.payment?.payment_method || 'Cash'}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-100">
                    {formatCurrency(sale.total_amount)}
                  </p>
                  <Badge variant="success" size="sm">
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
