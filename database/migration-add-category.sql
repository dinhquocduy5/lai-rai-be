-- Migration: Add category column to menu_items table
-- Run this script on existing databases to add the category feature

-- Add category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'menu_items' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE menu_items ADD COLUMN category VARCHAR(100);
        RAISE NOTICE 'Category column added successfully';
    ELSE
        RAISE NOTICE 'Category column already exists';
    END IF;
END $$;

-- Optional: Update existing items with default categories based on type
-- UPDATE menu_items SET category = 'Món ăn' WHERE type = 'food' AND category IS NULL;
-- UPDATE menu_items SET category = 'Đồ uống' WHERE type = 'drink' AND category IS NULL;

SELECT 'Migration completed! Category column is now available.' as message;
