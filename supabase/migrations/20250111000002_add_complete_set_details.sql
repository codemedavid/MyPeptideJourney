-- Add show_complete_set_details field to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_complete_set_details BOOLEAN DEFAULT false;

-- Add comment to explain the field
COMMENT ON COLUMN products.show_complete_set_details IS 'When true, displays complete set inclusion details (peptide, bac water, syringes, container, alcohol pads)';

