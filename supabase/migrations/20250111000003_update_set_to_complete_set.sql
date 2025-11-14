-- Update product names: Change "Set" to "Complete Set"
UPDATE products 
SET name = REPLACE(name, ' Set', ' Complete Set')
WHERE name LIKE '% Set';

-- Enable complete set details for all products with "Set" or "Complete Set" in the name
UPDATE products 
SET show_complete_set_details = true
WHERE name LIKE '% Set' OR name LIKE '% Complete Set';

