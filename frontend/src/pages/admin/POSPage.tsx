import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { Product, Category, Customer, Sale, PaymentMethod } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, formatDateTime, printReceipt } from '../../utils/helpers';
import {
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Printer,
  X,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  UserPlus,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const POSPage: React.FC = () => {
  const { user } = useAuth();
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    totalItems,
    customerId,
    setCustomerId,
  } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Category Tabs
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Quick New Customer Modal
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  // Receipt Modal
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  useEffect(() => {
    loadPOSData();
  }, []);

  const loadPOSData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, custRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories').catch(() => ({ data: [] })),
        api.get('/customers').catch(() => ({ data: [] })),
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.data || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      const custList = Array.isArray(custRes.data) ? custRes.data : [];
      setCustomers(custList);
      if (custList[0] && !customerId) {
        setCustomerId(custList[0].customer_id);
      }
    } catch {
      toast.error('Failed to load POS data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCat =
        selectedCategory === 'all' || product.category_id === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        product.product_name.toLowerCase().includes(term) ||
        product.product_code.toLowerCase().includes(term);
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleOpenCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setAmountPaid(totalAmount.toString());
    setReferenceNumber('');
    setIsCheckoutOpen(true);
  };

  const handleCreateQuickCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    try {
      const res = await api.post('/customers', {
        customer_name: newCustomerName,
        phone: newCustomerPhone,
      });
      toast.success('Customer added');
      setCustomers([...customers, res.data]);
      setCustomerId(res.data.customer_id);
      setIsNewCustomerOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
    } catch {
      toast.error('Failed to create customer');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tender = parseFloat(amountPaid) || 0;

    if (tender < totalAmount) {
      toast.error('Amount paid cannot be less than total amount');
      return;
    }

    if (
      ['GCash', 'Maya', 'Bank Transfer'].includes(paymentMethod) &&
      !referenceNumber.trim()
    ) {
      toast.error(`Please provide reference number for ${paymentMethod}`);
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        customer_id: customerId || customers[0]?.customer_id || 1,
        items: items.map((i) => ({
          product_id: i.product.product_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
        payment_method: paymentMethod,
        amount_paid: tender,
        reference_number: referenceNumber || null,
      };

      const res = await api.post('/sales', payload);
      toast.success('Sale transaction completed!');
      setCompletedSale(res.data);
      clearCart();
      setIsCheckoutOpen(false);

      // Refresh product stock in catalog
      loadPOSData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const changeDue = Math.max(0, (parseFloat(amountPaid) || 0) - totalAmount);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-5 -m-2 sm:-m-4">
      {/* Left: Product Catalog & Search */}
      <div className="flex-1 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        {/* Top Controls: Search & Category Tabs */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search products by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                autoFocus
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsNewCustomerOpen(true)}
            >
              New Customer
            </Button>
          </div>

          {/* Category Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Items
            </button>
            {categories.map((c) => (
              <button
                key={c.category_id}
                onClick={() => setSelectedCategory(c.category_id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === c.category_id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {c.category_name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <Search className="w-8 h-8 text-slate-600" />
              <p className="text-sm">No hardware supplies found matching criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock_quantity <= 0;
                const isLow =
                  product.stock_quantity > 0 &&
                  product.stock_quantity <= product.reorder_level;

                return (
                  <div
                    key={product.product_id}
                    onClick={() => !isOutOfStock && addItem(product)}
                    className={`relative p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-slate-950/40 border-slate-800/40 opacity-50 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 cursor-pointer shadow-sm active:scale-[0.98]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-mono text-[10px] text-amber-400 font-semibold">
                          {product.product_code}
                        </span>
                        <Badge
                          variant={isOutOfStock ? 'danger' : isLow ? 'warning' : 'neutral'}
                          size="sm"
                        >
                          {isOutOfStock ? 'Empty' : `${product.stock_quantity} left`}
                        </Badge>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug">
                        {product.product_name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {product.category?.category_name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">
                        {formatCurrency(product.unit_price)}
                      </span>
                      <button
                        disabled={isOutOfStock}
                        className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 flex items-center justify-center transition-colors disabled:opacity-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: POS Cart & Checkout Bar */}
      <div className="w-full lg:w-96 bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col overflow-hidden shadow-xl shrink-0">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Current Order</h3>
              <p className="text-[11px] text-slate-400">{totalItems} items in cart</p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Customer Selector */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/40">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Customer / Contractor
          </label>
          <select
            value={customerId || ''}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/80"
          >
            {customers.map((c) => (
              <option key={c.customer_id} value={c.customer_id}>
                {c.customer_name} {c.phone ? `(${c.phone})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 p-3 overflow-y-auto divide-y divide-slate-800/60">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-10">
              <ShoppingCart className="w-10 h-10 text-slate-700" />
              <p className="text-xs">Select items from catalog to start transaction</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.product_id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {item.product.product_name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatCurrency(item.unit_price)} each
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-100">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.product_id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold text-slate-100 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.product_id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.product_id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary & Checkout Button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-200">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Tax (Included)</span>
            <span className="font-semibold text-slate-200">₱0.00</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-sm font-bold text-slate-200">Total Due</span>
            <span className="text-xl font-extrabold text-amber-400">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={items.length === 0}
            onClick={handleOpenCheckout}
            icon={<CheckCircle className="w-5 h-5" />}
          >
            Proceed to Payment
          </Button>
        </div>
      </div>

      {/* Checkout / Payment Method Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Complete Payment & Checkout"
        subtitle={`Total Amount: ${formatCurrency(totalAmount)}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Cash', 'GCash', 'Maya', 'Bank Transfer', 'Card'] as PaymentMethod[]).map(
                (method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                      paymentMethod === method
                        ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {method === 'Cash' && <Banknote className="w-5 h-5" />}
                    {(method === 'GCash' || method === 'Maya') && <QrCode className="w-5 h-5" />}
                    {method === 'Bank Transfer' && <Building className="w-5 h-5" />}
                    {method === 'Card' && <CreditCard className="w-5 h-5" />}
                    <span>{method}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Reference Number for Digital/Bank/Card */}
          {paymentMethod !== 'Cash' && (
            <Input
              label={`${paymentMethod} Transaction Reference / Approval Code`}
              placeholder="e.g. 1029384756"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
              autoFocus
            />
          )}

          {/* Amount Paid */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount Tendered / Paid (₱)"
              type="number"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              required
              autoFocus={paymentMethod === 'Cash'}
            />
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Change to Return
              </label>
              <div className="h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center px-3.5 font-bold text-base text-emerald-400">
                {formatCurrency(changeDue)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="lg" isLoading={isProcessing}>
              Confirm & Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Receipt Modal */}
      <Modal
        isOpen={completedSale !== null}
        onClose={() => setCompletedSale(null)}
        title="Transaction Completed"
        subtitle="Official Store Invoicing Receipt"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Printable Ticket Receipt */}
          <div
            id="pos-receipt"
            className="printable-receipt p-6 rounded-2xl bg-white text-slate-950 shadow-inner font-mono text-xs border border-slate-200"
          >
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="font-extrabold text-base tracking-wider uppercase">MGM HARDWARE</h2>
              <p className="text-[10px] text-slate-600">Supplies & Construction Materials</p>
              <p className="text-[10px] text-slate-600">XAMPP Server • mgm_hardware_db</p>
              <p className="text-[11px] font-bold mt-1">
                INVOICE #{completedSale?.sale_id.toString().padStart(6, '0')}
              </p>
            </div>

            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDateTime(completedSale?.sale_date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{user?.username || 'Staff'}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold">{completedSale?.customer?.customer_name}</span>
              </div>
            </div>

            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1.5">
              {completedSale?.details?.map((item) => (
                <div key={item.sale_detail_id} className="flex justify-between">
                  <div className="flex-1 pr-2">
                    <p className="font-semibold">{item.product?.product_name}</p>
                    <p className="text-[10px] text-slate-600">
                      {item.quantity} x {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <span className="font-bold">
                    {formatCurrency(item.quantity * Number(item.unit_price))}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2.5 space-y-1 text-[11px]">
              <div className="flex justify-between text-sm font-extrabold pt-1">
                <span>TOTAL:</span>
                <span>{formatCurrency(completedSale?.total_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Payment Method:</span>
                <span className="font-semibold">{completedSale?.payment?.payment_method}</span>
              </div>
              {completedSale?.payment?.reference_number && (
                <div className="flex justify-between text-slate-700">
                  <span>Ref No:</span>
                  <span className="font-mono">{completedSale?.payment?.reference_number}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700">
                <span>Amount Tendered:</span>
                <span>{formatCurrency(completedSale?.payment?.amount_paid)}</span>
              </div>
              <div className="flex justify-between text-slate-700 font-bold">
                <span>Change:</span>
                <span>{formatCurrency(completedSale?.payment?.change_amount)}</span>
              </div>
            </div>

            <div className="text-center pt-4 text-[10px] text-slate-500 border-t border-dashed border-slate-400 mt-3">
              <p>Thank you for shopping at MGM Hardware!</p>
              <p>Items may be exchanged within 7 days with this receipt.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setCompletedSale(null)}>
              Done
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

      {/* Quick Add Customer Modal */}
      <Modal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        title="Quick Customer Register"
        subtitle="Add a new contractor or customer for this order"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateQuickCustomer} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="e.g. Alex Tan"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Phone Number"
            placeholder="e.g. 09171234567"
            value={newCustomerPhone}
            onChange={(e) => setNewCustomerPhone(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewCustomerOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Customer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
