-- =============================================
-- JJ CRACKERS - RUN THIS IN SUPABASE SQL EDITOR
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- Paste this entire file and click "Run"
-- =============================================

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ta TEXT DEFAULT '',
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  mrp INTEGER NOT NULL,
  discount_percent INTEGER DEFAULT 0,
  badge_text TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  description_en TEXT,
  description_ta TEXT,
  in_stock BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_eco_friendly BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Combo Packs Table
CREATE TABLE IF NOT EXISTS combo_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  combo_name TEXT NOT NULL,
  total_items INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  offer_price INTEGER NOT NULL,
  combo_type TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_city TEXT,
  customer_pincode TEXT,
  customer_state TEXT,
  customer_district TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'confirmed',
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  customer_city TEXT,
  items JSONB NOT NULL,
  total_amount INTEGER,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE combo_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert products" ON products;
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update products" ON products;
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete products" ON products;
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

-- Combo Packs: Anyone can read
DROP POLICY IF EXISTS "Anyone can view combos" ON combo_packs;
CREATE POLICY "Anyone can view combos" ON combo_packs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert combos" ON combo_packs;
CREATE POLICY "Anyone can insert combos" ON combo_packs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update combos" ON combo_packs;
CREATE POLICY "Anyone can update combos" ON combo_packs FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete combos" ON combo_packs;
CREATE POLICY "Anyone can delete combos" ON combo_packs FOR DELETE USING (true);

-- Orders: Anyone can read/create
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
CREATE POLICY "Anyone can update orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Enquiries: Anyone can read/create
DROP POLICY IF EXISTS "Anyone can view enquiries" ON enquiries;
CREATE POLICY "Anyone can view enquiries" ON enquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create enquiries" ON enquiries;
CREATE POLICY "Anyone can create enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Contact Messages: Anyone can read/create
DROP POLICY IF EXISTS "Anyone can view contact messages" ON contact_messages;
CREATE POLICY "Anyone can view contact messages" ON contact_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update contact messages" ON contact_messages;
CREATE POLICY "Anyone can update contact messages" ON contact_messages FOR UPDATE USING (true) WITH CHECK (true);

-- Newsletter: Anyone can read/create
DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view subscribers" ON newsletter_subscribers;
CREATE POLICY "Anyone can view subscribers" ON newsletter_subscribers FOR SELECT USING (true);
