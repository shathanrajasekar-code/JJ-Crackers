-- Jegajothi Crackers Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ta TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  mrp INTEGER NOT NULL,
  discount_percent INTEGER,
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

-- Admin Users Table (for Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (auth.jwt() ->> 'email')
    )
  );

-- Enquiries Policies
CREATE POLICY "Anyone can create enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view enquiries"
  ON enquiries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (auth.jwt() ->> 'email')
    )
  );

-- Admin Users Policies
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (auth.jwt() ->> 'email')
    )
  );

-- Seed Data
INSERT INTO products (name_en, name_ta, slug, category, price, mrp, discount_percent, badge_text, in_stock, is_featured) VALUES
-- Sparklers
('Golden Crown Sparklers', 'தங்க கிரீட மினுக்குகள்', 'golden-crown-sparklers', 'sparklers', 499, 1249, 60, '🔥 Best Seller', true, true),
('Magic Color Sparklers (50pcs)', 'வண்ண மினுக்குகள் (50)', 'magic-color-sparklers', 'sparklers', 180, 400, 55, '55% OFF', true, false),
('Silver Rain Sparklers', 'வெள்ளி மழை மினுக்குகள்', 'silver-rain-sparklers', 'sparklers', 350, 800, 56, '✨ Festival Offer', true, false),

-- Flower Pots
('Temple Grandeur Flower Pot', 'கோவில் மலர் பாத்திரம்', 'temple-flower-pot', 'flowerpots', 850, 1890, 55, '✨ Festival Offer', true, true),
('Mini Flower Pots (20pcs)', 'சிறிய மலர் பானைகள் (20)', 'mini-flower-pots', 'flowerpots', 220, 500, 56, '56% OFF', true, false),
('Deluxe Ground Wheel', 'டீலக்ஸ் கிரவுண்ட் வீல்', 'deluxe-ground-wheel', 'flowerpots', 680, 1500, 55, '🔥 Selling Fast', true, false),

-- Rockets
('Maratha Sky Rockets (10pcs)', 'மராட்டா வானவேடு (10)', 'maratha-sky-rockets', 'rockets', 1199, 3999, 70, '70% OFF', true, true),
('Sky Dragon Rockets', 'வான் டிராகன் ராக்கெட்டுகள்', 'sky-dragon-rockets', 'rockets', 950, 2200, 57, '57% OFF', true, false),
('Thunder Bolt Rockets (5pcs)', 'தண்டர் போல்ட் (5)', 'thunder-bolt-rockets', 'rockets', 750, 1800, 58, '🔥 Hot', true, false),

-- Chakkars
('Royal Chakra Whirls', 'ராஜ சக்கர சுழல்கள்', 'royal-chakra-whirls', 'chakkars', 320, 920, 65, '65% OFF', true, false),
('Royal Chakkars Big Box', 'ராஜ சக்கரம் பெரிய பெட்டி', 'royal-chakkars-big', 'chakkars', 450, 900, 50, '50% OFF', true, false),
('Color Wheel Chakkar', 'வண்ண சக்கரம்', 'color-wheel-chakkar', 'chakkars', 280, 600, 53, '53% OFF', true, false),

-- Aerial
('Celestial Sky Bursts', 'வான் வெடிகள்', 'celestial-sky-bursts', 'aerial', 1550, 3100, 50, '👑 Premium', true, true),
('Majestic Aerial Shells 12-shot', 'மகிமையான வான் குண்டுகள்', 'majestic-aerial-shells', 'aerial', 1250, 2500, 50, '50% OFF', true, false),
('Comet Tail Aerials (8pcs)', 'வால்மீன் வான் குண்டுகள் (8)', 'comet-tail-aerials', 'aerial', 890, 1800, 51, '51% OFF', true, false),

-- Gift Boxes
('Imperial Diwali Gift Box', 'இம்பீரியல் தீபாவளி பெட்டி', 'imperial-gift-box', 'giftbox', 2450, 4100, 40, '🔥 Selling Fast', true, true),
('Family Celebration Box', 'குடும்ப கொண்டாட்ட பெட்டி', 'family-celebration-box', 'giftbox', 1850, 3500, 47, '47% OFF', true, false),
('Kids Joy Pack', 'குழந்தைகள் மகிழ்ச்சி பேக்', 'kids-joy-pack', 'giftbox', 550, 1200, 54, '🎁 Kids Special', true, false);

-- Create a function to add admin user
CREATE OR REPLACE FUNCTION add_admin_user(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_users (email) VALUES (user_email)
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Example: Add your admin email (replace with your actual email)
-- SELECT add_admin_user('admin@jegajothicrackers.com');
