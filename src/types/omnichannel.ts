// Typy dla ujednoliconej struktury wielokanałowej (Omnichannel)

export type PlatformSource = 'allegro' | 'woocommerce' | 'erli' | 'amazon' | 'emag' | 'internal';

export interface GlobalOrder {
  id: string; // Nasze wewnętrzne UUID w Supabase
  user_id: string;
  platform_source: PlatformSource;
  external_order_id: string; // ID po stronie Allegro/Woo
  buyer_name: string;
  buyer_email?: string;
  total_amount: number;
  currency: string;
  payment_status: 'paid' | 'pending' | 'canceled' | 'refunded';
  shipping_method?: string;
  delivery_address?: any;
  line_items: any[];
  created_at: string;
  updated_at: string;
}

export interface GlobalProduct {
  id: string;
  user_id: string;
  sku: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  images?: string[];
  attributes?: Record<string, any>;
  platform_source: PlatformSource;
  external_product_id?: string;
  created_at: string;
  updated_at: string;
}
