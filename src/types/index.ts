// Peptide Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  discount_price: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  discount_active: boolean;
  
  // Peptide-specific fields
  purity_percentage: number;
  molecular_weight: string | null;
  cas_number: string | null;
  sequence: string | null;
  storage_conditions: string;
  
  // Stock and availability
  stock_quantity: number;
  available: boolean;
  featured: boolean;
  
  // Images and metadata
  image_url: string | null;
  safety_sheet_url: string | null;
  
  // Complete set details
  show_complete_set_details?: boolean;
  
  created_at: string;
  updated_at: string;
  
  // Relations
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  quantity_mg: number;
  price: number;
  stock_quantity: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  account_number: string;
  account_name: string;
  qr_code_url: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  value: string;
  type: string;
  description: string | null;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  variation?: ProductVariation;
  quantity: number;
  price: number;
}

// Order Types
export interface OrderDetails {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  variation_id?: string | null;
  variation_name?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  shipping_country: string;
  total_amount: number;
  shipping_fee: number;
  payment_method_id?: string | null;
  payment_method_name?: string | null;
  notes?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmed_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}
