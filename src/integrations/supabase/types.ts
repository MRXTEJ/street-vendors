export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          order_id: string
          price_per_unit: number
          quantity: number
          raw_material_id: string | null
          total_price: number
          unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          order_id: string
          price_per_unit: number
          quantity: number
          raw_material_id?: string | null
          total_price: number
          unit: string
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          order_id?: string
          price_per_unit?: number
          quantity?: number
          raw_material_id?: string | null
          total_price?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_raw_material_id_fkey"
            columns: ["raw_material_id"]
            isOneToOne: false
            referencedRelation: "raw_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          id: string
          items: Json
          notes: string | null
          phone: string | null
          status: string
          supplier_id: string | null
          total_amount: number
          updated_at: string
          user_id: string
          vendor_id: string | null
          vendor_name: string
          voice_order: boolean | null
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          items: Json
          notes?: string | null
          phone?: string | null
          status?: string
          supplier_id?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
          vendor_id?: string | null
          vendor_name: string
          voice_order?: boolean | null
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          items?: Json
          notes?: string | null
          phone?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
          vendor_name?: string
          voice_order?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          unit: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          unit?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          unit?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          address: string | null
          created_at: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          language_preference: string | null
          phone: string | null
          role: string | null
          shop_name: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          phone?: string | null
          role?: string | null
          shop_name?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string | null
          address?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          language_preference?: string | null
          phone?: string | null
          role?: string | null
          shop_name?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      raw_materials: {
        Row: {
          category: string
          created_at: string
          description: string | null
          expiry_date: string | null
          harvest_date: string | null
          id: string
          image_url: string | null
          is_available: boolean | null
          min_order_quantity: number | null
          name: string
          origin_location: string | null
          price_per_unit: number
          quality_grade: string | null
          stock_quantity: number | null
          subcategory: string | null
          supplier_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          min_order_quantity?: number | null
          name: string
          origin_location?: string | null
          price_per_unit: number
          quality_grade?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          supplier_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          min_order_quantity?: number | null
          name?: string
          origin_location?: string | null
          price_per_unit?: number
          quality_grade?: string | null
          stock_quantity?: number | null
          subcategory?: string | null
          supplier_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "raw_materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_ratings: {
        Row: {
          comment: string | null
          created_at: string
          delivery_rating: number | null
          id: string
          order_id: string | null
          pricing_rating: number | null
          quality_rating: number | null
          rating: number
          supplier_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          order_id?: string | null
          pricing_rating?: number | null
          quality_rating?: number | null
          rating: number
          supplier_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          order_id?: string | null
          pricing_rating?: number | null
          quality_rating?: number | null
          rating?: number
          supplier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_ratings_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string
          business_name: string
          business_type: string
          city: string
          contact_person: string
          created_at: string
          delivery_areas: string[] | null
          delivery_charges: number | null
          email: string | null
          gst_number: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          min_order_amount: number | null
          phone: string
          pincode: string
          rating: number | null
          state: string
          total_ratings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          business_name: string
          business_type: string
          city: string
          contact_person: string
          created_at?: string
          delivery_areas?: string[] | null
          delivery_charges?: number | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          min_order_amount?: number | null
          phone: string
          pincode: string
          rating?: number | null
          state: string
          total_ratings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          business_name?: string
          business_type?: string
          city?: string
          contact_person?: string
          created_at?: string
          delivery_areas?: string[] | null
          delivery_charges?: number | null
          email?: string | null
          gst_number?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          min_order_amount?: number | null
          phone?: string
          pincode?: string
          rating?: number | null
          state?: string
          total_ratings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          name: string
          position: number
          role: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          name: string
          position: number
          role: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          position?: number
          role?: string
        }
        Relationships: []
      }
      vendor_ratings: {
        Row: {
          comment: string | null
          created_at: string
          delivery_rating: number | null
          id: string
          order_id: string | null
          quality_rating: number | null
          rating: number
          user_id: string
          vendor_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          order_id?: string | null
          quality_rating?: number | null
          rating: number
          user_id: string
          vendor_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          delivery_rating?: number | null
          id?: string
          order_id?: string | null
          quality_rating?: number | null
          rating?: number
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string
          category: string
          created_at: string
          delivery_time_max: number | null
          delivery_time_min: number | null
          id: string
          is_active: boolean | null
          phone: string
          rating: number | null
          shop_description: string | null
          shop_name: string
          total_ratings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          category: string
          created_at?: string
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          id?: string
          is_active?: boolean | null
          phone: string
          rating?: number | null
          shop_description?: string | null
          shop_name: string
          total_ratings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          category?: string
          created_at?: string
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          id?: string
          is_active?: boolean | null
          phone?: string
          rating?: number | null
          shop_description?: string | null
          shop_name?: string
          total_ratings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
