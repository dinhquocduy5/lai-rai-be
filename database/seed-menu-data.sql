-- Menu Data for Lai Rai Restaurant
-- Extracted from actual menu photos
-- Run this after setup.sql to add real menu items

-- Clear existing menu items (if you want to start fresh)
-- TRUNCATE TABLE menu_items CASCADE;

-- Insert menu items from actual restaurant menu

-- ==============================================
-- LỐT BỤNG TRƯỚC CUỘC CHIẾN (Appetizers)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Cơm chiên trứng tôi', 69000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Cơm chiên hải sản', 89000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Mì xào hải sản', 89000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Mì xào bò', 89000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Trứng chiên hành', 39000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Trứng chiên cà chua', 49000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Trứng chiên tôm', 79000, 'food', 'Lót bụng trước cuộc chiến'),
  ('Cháo hào sữa', 69000, 'food', 'Lót bụng trước cuộc chiến');

-- ==============================================
-- CHUA CHUA ĐỦA MÔI (Salads/Fresh Rolls)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Gỏi bò càng cua', 99000, 'food', 'Chua chua đưa môi'),
  ('Gỏi bò mắm thái', 99000, 'food', 'Chua chua đưa môi'),
  ('Gỏi tôm tai heo mắm thái', 99000, 'food', 'Chua chua đưa môi'),
  ('Gỏi xoài khô hố', 89000, 'food', 'Chua chua đưa môi'),
  ('Gỏi dứa leo khô hố', 89000, 'food', 'Chua chua đưa môi'),
  ('Gỏi gà mắm thái', 99000, 'food', 'Chua chua đưa môi'),
  ('Canh chua khô hố', 99000, 'food', 'Chua chua đưa môi'),
  ('Gỏi xoài khô bò', 79000, 'food', 'Chua chua đưa môi'),
  ('Gỏi dứa leo khô bò', 79000, 'food', 'Chua chua đưa môi'),
  ('Gỏi tôm mực chân gà rút xương mắm thai', 159000, 'food', 'Chua chua đưa môi'),
  ('Gỏi rau tiến vua tôm mực', 149000, 'food', 'Chua chua đưa môi'),
  ('Gỏi thái tôm sống', 129000, 'food', 'Chua chua đưa môi'),
  ('Gỏi hải sản tôm mực', 149000, 'food', 'Chua chua đưa môi'),
  ('Sốt thái thập cẩm', 149000, 'food', 'Chua chua đưa môi');

-- ==============================================
-- LÀI RAI NÈ (Lai Rai Specialties)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Tôm khô củ kiệu', 79000, 'food', 'Lài rai nè'),
  ('Đậu hủ chiên', 59000, 'food', 'Lài rai nè'),
  ('Khô mực nướng', 79000, 'food', 'Lài rai nè'),
  ('Khô mực chiên nước mắm', 89000, 'food', 'Lài rai nè'),
  ('Tóp mỡ giòn rum', 49000, 'food', 'Lài rai nè'),
  ('Cá thát lát chiên giòn', 89000, 'food', 'Lài rai nè'),
  ('Khô bò', 49000, 'food', 'Lài rai nè'),
  ('Bắp rang tỏi mỡ', 59000, 'food', 'Lài rai nè'),
  ('Chân gà rút xương sốt thái', 99000, 'food', 'Lài rai nè'),
  ('Chân gà rút xương chiên nước mắm', 99000, 'food', 'Lài rai nè'),
  ('Khô bò vàng chiên', 69000, 'food', 'Lài rai nè'),
  ('Mực hấp gừng', 129000, 'food', 'Lài rai nè'),
  ('Dộp xào lá quế', 79000, 'food', 'Lài rai nè'),
  ('Dộp hấp thái', 79000, 'food', 'Lài rai nè'),
  ('Cá trứng chiên giòn', 79000, 'food', 'Lài rai nè');

-- ==============================================
-- RAU TƯƠI THANH ĐẠM (Fresh Vegetables)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Bí nụ xào', 69000, 'food', 'Rau tươi thanh đạm'),
  ('Rau muống xào', 49000, 'food', 'Rau tươi thanh đạm');

-- ==============================================
-- CHÚT THỊT CHO CHẮC (Chicken Dishes)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Gà hấp tỏi', 280000, 'food', 'Chút thịt cho chắc'),
  ('Gà hấp lá chanh', 280000, 'food', 'Chút thịt cho chắc'),
  ('Gà hấp rượu', 280000, 'food', 'Chút thịt cho chắc'),
  ('Cánh gà chiên nước mắm', 89000, 'food', 'Chút thịt cho chắc'),
  ('Chân gà hấp hành', 79000, 'food', 'Chút thịt cho chắc'),
  ('Chân gà nước mắm', 79000, 'food', 'Chút thịt cho chắc');

-- ==============================================
-- LÀM CHÚT TÔM HEN (Shrimp Dishes)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Tôm sốt thái', 119000, 'food', 'Làm chút tôm hen'),
  ('Tôm hấp', 99000, 'food', 'Làm chút tôm hen'),
  ('Tôm tắc thiên', 109000, 'food', 'Làm chút tôm hen'),
  ('Tôm cháy bơ tỏi', 109000, 'food', 'Làm chút tôm hen');

-- ==============================================
-- UM BÒ ĐÊ (Beef Dishes)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Bò viên chiên', 79000, 'food', 'Um bò đê'),
  ('Bò viên nước mắm', 79000, 'food', 'Um bò đê'),
  ('Bò viên sả ớt', 79000, 'food', 'Um bò đê'),
  ('Bò cuộn cải xanh', 99000, 'food', 'Um bò đê'),
  ('Bò xào củ hành', 119000, 'food', 'Um bò đê'),
  ('Bò xào bí nụ', 129000, 'food', 'Um bò đê'),
  ('Bò sốt tiêu đen', 139000, 'food', 'Um bò đê');

-- ==============================================
-- NHẢY NHẢY NÈ (Frog Dishes)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Ếch chiên giòn', 79000, 'food', 'Nhảy nhảy nè'),
  ('Ếch chiên mắm', 79000, 'food', 'Nhảy nhảy nè');

-- ==============================================
-- NO NÊ ẤM BỤNG (Hotpot)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Lẩu cá thác lác', 199000, 'food', 'No nê ấm bụng'),
  ('Lẩu thái', 199000, 'food', 'No nê ấm bụng'),
  ('Lẩu gà chanh sả', 179000, 'food', 'No nê ấm bụng'),
  ('Lẩu cá các loại', 199000, 'food', 'No nê ấm bụng'),
  ('Lẩu thập cẩm', 199000, 'food', 'No nê ấm bụng'),
  ('Lẩu ếch', 169000, 'food', 'No nê ấm bụng');

-- ==============================================
-- GIẢI KHÁT LAI RAI (Beverages)
-- ==============================================
INSERT INTO menu_items (name, price, type, category) VALUES
  ('Nước suối', 10000, 'drink', 'Giải khát Lai Rai'),
  ('Nước ngọt', 15000, 'drink', 'Giải khát Lai Rai'),
  ('Tiger bạc lon', 18000, 'drink', 'Giải khát Lai Rai'),
  ('Sài gòn xanh', 15000, 'drink', 'Giải khát Lai Rai'),
  ('Heineken', 20000, 'drink', 'Giải khát Lai Rai'),
  ('Khăn lạnh', 2000, 'drink', 'Giải khát Lai Rai');

-- Success message
SELECT 'Menu data inserted successfully! Total items: ' || COUNT(*) || ' items' as message
FROM menu_items;

-- Show summary by type
SELECT 
  type,
  COUNT(*) as item_count,
  MIN(price) as min_price,
  MAX(price) as max_price,
  ROUND(AVG(price)) as avg_price
FROM menu_items
GROUP BY type
ORDER BY type;

-- Show summary by category
SELECT 
  category,
  type,
  COUNT(*) as item_count,
  MIN(price) as min_price,
  MAX(price) as max_price,
  ROUND(AVG(price)) as avg_price
FROM menu_items
GROUP BY category, type
ORDER BY category, type;
