-- =========================================================================
-- JJ CRACKERS: SUPABASE STORAGE SETUP FOR PRODUCT IMAGES
-- =========================================================================
-- Run this in your Supabase Dashboard:
-- https://supabase.com/dashboard -> Select Project -> SQL Editor -> New Query
-- Paste this script and click "Run".
-- =========================================================================

-- 1. Create the product-images public bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif', 'image/heic', 'image/heif'];

-- 2. Enable Storage RLS Policies for product-images bucket

-- Allow public read access to all images
DROP POLICY IF EXISTS "Public product image view" ON storage.objects;
CREATE POLICY "Public product image view"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow image upload (Insert)
DROP POLICY IF EXISTS "Public product image insert" ON storage.objects;
CREATE POLICY "Public product image insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow image update
DROP POLICY IF EXISTS "Public product image update" ON storage.objects;
CREATE POLICY "Public product image update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow image delete
DROP POLICY IF EXISTS "Public product image delete" ON storage.objects;
CREATE POLICY "Public product image delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
