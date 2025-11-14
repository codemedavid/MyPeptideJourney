-- Add Complete Set category as the first category (after "All Products")
-- First, shift all existing categories' sort_order by 1
UPDATE categories 
SET sort_order = sort_order + 1 
WHERE id != 'all';

-- Insert Complete Set category with sort_order 0.5 (between "all" at 0 and others at 1+)
INSERT INTO categories (id, name, icon, sort_order, active)
VALUES (
  'complete-set',
  'Complete Set',
  'Package',
  0.5,
  true
)
ON CONFLICT (id) DO UPDATE
SET name = 'Complete Set',
    icon = 'Package',
    sort_order = 0.5,
    active = true;

-- Update products with "Complete Set" in name to use the complete-set category
UPDATE products 
SET category = 'complete-set'
WHERE name LIKE '% Complete Set';

