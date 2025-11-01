-- Seed Tables for Lai Rai Restaurant
-- Creates 10 tables for the restaurant

-- Clear existing tables (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE tables CASCADE;

-- Insert 10 tables
INSERT INTO tables (name, status) VALUES
  ('Bàn 1', 'available'),
  ('Bàn 2', 'available'),
  ('Bàn 3', 'available'),
  ('Bàn 4', 'available'),
  ('Bàn 5', 'available'),
  ('Bàn 6', 'available'),
  ('Bàn 7', 'available'),
  ('Bàn 8', 'available'),
  ('Bàn 9', 'available'),
  ('Bàn 10', 'available');

-- Success message
SELECT 'Tables created successfully! Total tables: ' || COUNT(*) || ' tables' as message
FROM tables;

-- Show all tables with their current status
SELECT 
  id,
  name,
  status,
  CASE 
    WHEN status = 'available' THEN '✓ Sẵn sàng'
    WHEN status = 'occupied' THEN '✗ Đang sử dụng'
    ELSE status
  END as status_display
FROM tables
ORDER BY id;
