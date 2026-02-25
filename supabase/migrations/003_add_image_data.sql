-- Add image_data column for storing base64 encoded images
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_data TEXT;

-- Create index for faster lookups when image_data is present
CREATE INDEX IF NOT EXISTS idx_products_image_data ON products ((image_data IS NOT NULL));
