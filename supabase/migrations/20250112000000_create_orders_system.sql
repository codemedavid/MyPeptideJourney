-- Migration: Create Orders Management System
-- This migration creates tables for storing orders and order items

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping Information
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  
  -- Order Details
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  payment_method_id TEXT REFERENCES payment_methods(id),
  payment_method_name TEXT,
  notes TEXT,
  
  -- Order Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Product Information
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  
  -- Variation Information (if applicable)
  variation_id UUID REFERENCES product_variations(id),
  variation_name TEXT,
  
  -- Order Details
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for customers to view their orders)
-- Note: In production, you might want to restrict this based on user authentication
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to order_items" ON order_items
  FOR SELECT USING (true);

-- Create policies for public insert access (for checkout)
CREATE POLICY "Allow public insert access to orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert access to order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Create policies for admin update access (for order confirmation)
-- Note: In production, you should use proper authentication
CREATE POLICY "Allow admin update access to orders" ON orders
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

