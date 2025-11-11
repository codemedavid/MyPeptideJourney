-- Update product prices based on new pricing structure

-- First, add UNIQUE constraint to name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_name_key'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_name_key UNIQUE (name);
  END IF;
END $$;

-- Update Tirzepatide 20mg to ₱3,000
UPDATE products 
SET base_price = 3000.00
WHERE name = 'Tirzepatide 20mg';

-- Add Tirzepatide 30mg if it doesn't exist, or update if it does
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions)
VALUES (
  'Tirzepatide 30mg',
  'Tirzepatide is a glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist for research purposes. Higher dose for stronger results and longer use. 30mg per vial.',
  'research',
  3500.00,
  99.0,
  true,
  true,
  40,
  'Store at -20°C'
)
ON CONFLICT (name) DO UPDATE
SET base_price = 3500.00;

-- Update AOD-9604 to ₱2,000 and rename to "AOD Set"
UPDATE products 
SET base_price = 2000.00,
    name = 'AOD Set',
    description = 'Modified fragment of human growth hormone (HGH) C-terminus. Fat-burning peptide to boost metabolism. Researched for its potential metabolic effects without affecting blood sugar. 5mg per vial.'
WHERE name = 'AOD-9604 5mg';

-- Add AOD w/ AA and BAC Water Set
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions)
VALUES (
  'AOD w/ AA and BAC Water Set',
  'Complete kit with AOD-9604 peptide, amino acid (AA3), and bacteriostatic water. Everything you need for fat-burning peptide research in one convenient set.',
  'research',
  2100.00,
  99.0,
  true,
  true,
  50,
  'Store at -20°C'
)
ON CONFLICT (name) DO UPDATE
SET base_price = 2100.00;

-- Update NAD+ 500mg to ₱2,000
UPDATE products 
SET base_price = 2000.00,
    name = 'NAD+ 500mg Set',
    description = 'Nicotinamide Adenine Dinucleotide - Essential coenzyme involved in cellular energy production and metabolic processes. For energy, recovery, and anti-aging benefits. Research-grade quality. 500mg per vial.'
WHERE name = 'NAD+ 500mg' OR name LIKE 'NAD+%';

-- Update GHK-Cu 100mg to ₱1,500
UPDATE products 
SET base_price = 1500.00,
    name = 'GHK-Cu 100mg Set',
    description = 'Copper peptide complex with regenerative properties. For skin repair, hair growth, and healing support. Known for its potential in tissue repair and anti-aging research applications. 100mg per vial.'
WHERE name = 'GHK-Cu 100mg' OR name LIKE 'GHK-Cu%';

-- Update Semax 10mg to ₱1,500
UPDATE products 
SET base_price = 1500.00,
    name = 'Semax 10mg Set',
    description = 'Nootropic peptide derived from ACTH. For focus, mood, and mental clarity enhancement. Enhances cognitive function, memory, and provides neuroprotective effects in research studies. 10mg per vial.'
WHERE name = 'Semax 10mg' OR name LIKE 'Semax%';

