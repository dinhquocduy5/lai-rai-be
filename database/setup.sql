-- Database Setup Script for Lai Rai Restaurant
-- PostgreSQL / Supabase Compatible

-- Set timezone to UTC (store all timestamps in UTC)
SET timezone = 'UTC';

-- Drop tables if exists (for clean setup)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS tables CASCADE;

-- Create tables table
CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('available', 'occupied')) DEFAULT 'available'
);

-- Create menu_items table
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('food', 'drink')) NOT NULL,
  category VARCHAR(100)
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  table_id INTEGER REFERENCES tables(id) ON DELETE RESTRICT,
  check_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  check_out TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Create order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_order_time NUMERIC(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  payment_method VARCHAR(10) CHECK (payment_method = 'cash') DEFAULT 'cash'
);

-- Create indexes for better performance
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_paid_at ON payments(paid_at);

-- Insert sample data for testing
-- Tables
INSERT INTO tables (name, status) VALUES
  ('Bàn 1', 'available'),
  ('Bàn 2', 'available'),
  ('Bàn 3', 'available'),
  ('Bàn 4', 'available'),
  ('Bàn 5', 'available'),
  ('Bàn 6', 'available'),
  ('Bàn 7', 'available'),
  ('Bàn 8', 'available'),
  ('Bàn VIP 1', 'available'),
  ('Bàn VIP 2', 'available');

-- Menu Items - Food (Sample data with categories)
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Phở bò', 50000, 'food', 'Món chính'),
  ('Phở gà', 45000, 'food', 'Món chính'),
  ('Bún chả', 45000, 'food', 'Món chính'),
  ('Cơm tấm', 40000, 'food', 'Món chính'),
  ('Bánh mì', 25000, 'food', 'Món ăn sáng'),
  ('Bún bò Huế', 50000, 'food', 'Món chính'),
  ('Mì Quảng', 45000, 'food', 'Món chính'),
  ('Cao lầu', 40000, 'food', 'Món chính');

-- Menu Items - Drinks (Sample data with categories)
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Trà đá', 5000, 'drink', 'Giải khát Lai Rai'),
  ('Nước ngọt', 15000, 'drink', 'Giải khát Lai Rai'),
  ('Bia Tiger', 20000, 'drink', 'Giải khát Lai Rai'),
  ('Bia Heineken', 25000, 'drink', 'Giải khát Lai Rai'),
  ('Cà phê đen', 20000, 'drink', 'Giải khát Lai Rai'),
  ('Cà phê sữa', 25000, 'drink', 'Giải khát Lai Rai'),
  ('Nước cam', 30000, 'drink', 'Giải khát Lai Rai'),
  ('Sinh tố bơ', 35000, 'drink', 'Giải khát Lai Rai');

-- Success message
SELECT 'Database setup completed successfully!' AS message;
