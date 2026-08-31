// Master Entity Types
export interface MasterItem {
  id: string;
  name: string;
  created_at?: string;
}

export interface LensType extends MasterItem {
  description?: string;
}

export interface AuthenticityTag extends MasterItem {
  has_logo: boolean;
  logo_url?: string;
}

export interface BudgetRange extends MasterItem {
  description?: string;
}

// Frame Entity (Relational Dynamic)
export interface Frame {
  id: string;
  name: string;
  category_id: string;
  material_id: string;
  authenticity_id: string;
  price: number;
  stock: number;
  image_url: string;
  created_at?: string;
  // Dynamic relation objects (saat di-join query)
  category?: MasterItem;
  material?: MasterItem;
  authenticity?: AuthenticityTag;
}

// Lens Brand & Matrix Types
export interface LensBrand {
  id: string;
  name: string;
  budget_range_id: string;
  description?: string;
  is_active: boolean;
  budget_range?: BudgetRange;
}

export interface BrandLensType {
  id: string;
  brand_id: string;
  lens_type_id: string;
  base_price: number;
  stock: number;
  is_available: boolean;
  lens_type?: LensType;
}

export interface BrandLensIndex {
  id: string;
  brand_id: string;
  index_value: string; // e.g., '1.56', '1.61', '1.67'
  price_adder: number;
  rec_sph_min: number;
  rec_sph_max: number;
  rec_cyl_max: number;
  description?: string;
  is_available: boolean;
}

export interface BrandLensColor {
  id: string;
  brand_id: string;
  color_name: string;
  price_adder: number;
  is_available: boolean;
}

export interface BrandLensCoating {
  id: string;
  brand_id: string;
  coating_name: string;
  price_adder: number;
  is_available: boolean;
}

// Order Type
export type OrderStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' | string;

export interface Order {
  id: string;
  created_at?: string;
  contact_info: string;
  customer_profile: Record<string, any>;
  prescription_data: Record<string, any>;
  items: Record<string, any>[];
  total_price: number;
  status: OrderStatus;
  reserved_until: string;
}