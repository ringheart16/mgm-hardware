import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DashboardData } from '../../types';
import { StatsCard } from '../../components/ui/StatsCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  Boxes,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 p-6 rounded-2xl border border-slate-800/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time operations, inventory alerts, and sales performance for MGM Hardware Supplies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/pos">
            <Button variant="primary" icon={<Receipt className="w-4 h-4" />}>
              Open POS Terminal
            </Button>
          </Link>
          <Link to="/admin/inventory">
            <Button variant="secondary" icon={<Boxes className="w-4 h-4" />}>
              Manage Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Sales"
          value={formatCurrency(stats?.today_sales ?? 0)}
          subtitle="All processed transactions today"
          icon={<DollarSign className="w-5 h-5" />}
          variant="amber"
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.month_sales ?? 0)}
          subtitle="Current calendar month"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="emerald"
        />
        <StatsCard
          title="Total Products"
          value={stats?.total_products ?? 0}
          subtitle={`Across ${data?.sales_by_category?.length ?? 0} categories`}
          icon={<Package className="w-5 h-5" />}
          variant="blue"
        />
        <StatsCard
          title="Low & Out of Stock"
          value={(stats?.low_stock_count ?? 0) + (stats?.out_of_stock_count ?? 0)}
          subtitle={`${stats?.out_of_stock_count ?? 0} items completely empty`}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={
            (stats?.low_stock_count ?? 0) + (stats?.out_of_stock_count ?? 0) > 0 ? 'rose' : 'emerald'
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Revenue Trend (Monthly)</h3>
              <p className="text-xs text-slate-400">Monthly sales totals in Philippine Pesos</p>
            </div>
            <Badge variant="amber">Live Data</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.sales_by_month || []}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₱${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Sales']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Bar Chart */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Top Selling Products</h3>
            <p className="text-xs text-slate-400 mb-4">By quantity sold</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.top_products || []}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={10} />
                  <YAxis
                    dataKey="product_name"
                    type="category"
                    stroke="#64748b"
                    fontSize={10}
                    width={80}
                    tickFormatter={(v) => (v.length > 10 ? `${v.substring(0, 10)}...` : v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '11px',
                    }}
                    formatter={(v: any) => [`${v} units sold`, 'Quantity']}
                  />
                  <Bar dataKey="total_qty" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <Link
            to="/admin/reports"
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center justify-end gap-1 mt-2 font-medium"
          >
            View full report <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Two Column Section: Stock Alerts & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items Alert Card */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Stock Reorder Warnings</h3>
                <p className="text-xs text-slate-400">Items at or below reorder threshold</p>
              </div>
            </div>
            <Link to="/admin/inventory">
              <Button variant="outline" size="sm">
                Restock All
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-hidden">
            {data?.low_stock_products?.length === 0 && data?.out_of_stock_products?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                All inventory levels are healthy. No items need replenishment.
              </p>
            ) : (
              [...(data?.out_of_stock_products || []), ...(data?.low_stock_products || [])]
                .slice(0, 5)
                .map((product) => (
                  <div key={product.product_id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-200">{product.product_name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {product.product_code} • {product.category?.category_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-200">
                          {product.stock_quantity} in stock
                        </p>
                        <p className="text-[10px] text-slate-500">Min: {product.reorder_level}</p>
                      </div>
                      <Badge variant={product.stock_quantity <= 0 ? 'danger' : 'warning'}>
                        {product.stock_quantity <= 0 ? 'Out of Stock' : 'Low Stock'}
                      </Badge>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Recent Completed Sales</h3>
                <p className="text-xs text-slate-400">Latest recorded invoices & payments</p>
              </div>
            </div>
            <Link to="/admin/pos">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {data?.recent_sales?.slice(0, 5).map((sale) => (
              <div key={sale.sale_id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-200">
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
                    {sale.payment_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
