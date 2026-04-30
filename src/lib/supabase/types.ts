export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name_en: string;
          name_ta: string;
          slug: string;
          category: string;
          price: number;
          mrp: number;
          discount_percent: number | null;
          badge_text: string | null;
          image_url: string | null;
          images: Json;
          description_en: string | null;
          description_ta: string | null;
          in_stock: boolean;
          is_featured: boolean;
          is_eco_friendly: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name_en: string;
          name_ta: string;
          slug: string;
          category: string;
          price: number;
          mrp: number;
          discount_percent?: number | null;
          badge_text?: string | null;
          image_url?: string | null;
          images?: Json;
          description_en?: string | null;
          description_ta?: string | null;
          in_stock?: boolean;
          is_featured?: boolean;
          is_eco_friendly?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_ta?: string;
          slug?: string;
          category?: string;
          price?: number;
          mrp?: number;
          discount_percent?: number | null;
          badge_text?: string | null;
          image_url?: string | null;
          images?: Json;
          description_en?: string | null;
          description_ta?: string | null;
          in_stock?: boolean;
          is_featured?: boolean;
          is_eco_friendly?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          customer_name: string | null;
          customer_phone: string;
          customer_city: string | null;
          items: Json;
          total_amount: number | null;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          customer_phone: string;
          customer_city?: string | null;
          items: Json;
          total_amount?: number | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string | null;
          customer_phone?: string;
          customer_city?: string | null;
          items?: Json;
          total_amount?: number | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
