export type Role = 'admin' | 'user';
export type AccountStatus = 'active' | 'inactive' | 'suspended';

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  position?: string;
  department?: string;
  phone?: string;
  email?: string;
}

export interface User {
  user_id: number;
  employee_id?: number | null;
  username: string;
  email: string;
  role: Role;
  status: AccountStatus;
  employee?: Employee;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  description?: string;
  products_count?: number;
}

export interface Supplier {
  supplier_id: number;
  supplier_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  products_count?: number;
}

export interface Customer {
  customer_id: number;
  customer_name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Product {
  product_id: number;
  product_code: string;
  product_name: string;
  category_id: number;
  supplier_id: number;
  unit_price: number | string;
  stock_quantity: number;
  reorder_level: number;
  category?: Category;
  supplier?: Supplier;
}

export type PaymentMethod = 'Cash' | 'GCash' | 'Maya' | 'Bank Transfer' | 'Card';

export interface Payment {
  payment_id: number;
  sale_id: number;
  payment_method: PaymentMethod;
  reference_number?: string | null;
  amount_paid: number | string;
  change_amount: number | string;
  payment_date: string;
  received_by?: number | null;
  sale?: Sale;
  received_by_user?: User;
}

export interface SaleDetail {
  sale_detail_id?: number;
  sale_id?: number;
  product_id: number;
  quantity: number;
  unit_price: number | string;
  product?: Product;
}

export interface Sale {
  sale_id: number;
  customer_id: number;
  employee_id: number;
  sale_date: string;
  total_amount: number | string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  customer?: Customer;
  employee?: Employee;
  details?: SaleDetail[];
  payment?: Payment;
}

export interface PurchaseDetail {
  purchase_detail_id?: number;
  purchase_id?: number;
  product_id: number;
  quantity: number;
  unit_cost: number | string;
  product?: Product;
}

export interface Purchase {
  purchase_id: number;
  supplier_id: number;
  employee_id: number;
  purchase_date: string;
  total_amount: number | string;
  supplier?: Supplier;
  employee?: Employee;
  details?: PurchaseDetail[];
}

export interface SystemSetting {
  setting_id: number;
  setting_name: string;
  setting_value: string;
  description?: string;
}

export interface DashboardData {
  stats: {
    total_products: number;
    total_customers: number;
    today_sales: number;
    month_sales: number;
    total_sales: number;
    total_sales_count: number;
    month_purchases: number;
    low_stock_count: number;
    out_of_stock_count: number;
  };
  low_stock_products: Product[];
  out_of_stock_products: Product[];
  recent_sales: Sale[];
  sales_by_month: { month: string; total: string | number; count: number }[];
  top_products: { product_name: string; total_qty: number; total_revenue: string | number }[];
  sales_by_category: { category_name: string; total: string | number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  unit_price: number;
}
