-- Zestaw zapytań SQL do utworzenia ujednoliconych tabel Omnichannel dla e-commerce
-- Skopiuj ten kod i wykonaj go w SQL Editor w panelu Supabase

-- Tabela dla ujednoliconych zamówień
CREATE TABLE IF NOT EXISTS public.global_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_source varchar(50) NOT NULL, -- 'allegro', 'woocommerce', 'erli', etc.
  external_order_id varchar(100) NOT NULL, -- ID zamówienia na platformie bazowej
  buyer_name varchar(255) NOT NULL,
  buyer_email varchar(255),
  total_amount decimal(10, 2) NOT NULL,
  currency varchar(3) DEFAULT 'PLN',
  payment_status varchar(50) NOT NULL,
  shipping_method varchar(100),
  delivery_address jsonb, -- Skompresowane dane adresowe
  line_items jsonb NOT NULL, -- Lista zakupionych produktów
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Zapobiegaj duplikowaniu tego samego zamówienia z danej platformy dla tego samego użytkownika
  UNIQUE(user_id, platform_source, external_order_id)
);

-- Tabela dla bazy produktowej PIM (Product Information Management)
CREATE TABLE IF NOT EXISTS public.global_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sku varchar(100) NOT NULL,
  title varchar(255) NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  currency varchar(3) DEFAULT 'PLN',
  stock integer DEFAULT 0,
  images jsonb, -- Tablica z URLami zdjęć
  attributes jsonb, -- Dynamiczne parametry (kolor, rozmiar, kategoria itp.)
  platform_source varchar(50) DEFAULT 'internal',
  external_product_id varchar(100),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  UNIQUE(user_id, sku)
);

-- Zabezpieczenia RLS (Row Level Security) - Jeśli włączone, użytkownicy widzą tylko własne dane
ALTER TABLE public.global_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Użytkownicy mogą zarządzać tylko własnymi zamówieniami" 
ON public.global_orders FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Użytkownicy mogą zarządzać tylko własnymi produktami" 
ON public.global_products FOR ALL 
USING (auth.uid() = user_id);
