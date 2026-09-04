
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

// --- FRAME TYPES ---
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
  category?: MasterItem;
  material?: MasterItem;
  authenticity?: AuthenticityTag;
}

export interface CreateFramePayload {
  name: string;
  category_id: string;
  material_id: string;
  authenticity_id: string;
  price: number;
  stock: number;
  image_url: string;
}

// --- LENS MATRIX TYPES ---
export interface LensBrand {
  id: string;
  name: string;
  budget_range_id: string;
  description?: string;
  logo_url?: string;
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
  index_value: string;
  price_adder: number;
  color_id?: string | null;
  coating_id?: string | null;
  rec_sph_min?: number;
  rec_sph_max?: number;
  rec_cyl_max?: number;
  description?: string;
  is_available: boolean;
}

export interface CreateLensIndexPayload {
  brand_id: string;
  index_value: string;
  price_adder: number;
  color_id?: string | null;
  coating_id?: string | null;
  rec_sph_min?: number;
  rec_sph_max?: number;
  rec_cyl_max?: number;
  description?: string;
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

// --- ORDER & CHECKOUT STRICT TYPES ---
export interface CustomerProfile {
  ageGroup: '< 18' | '18-40' | '> 40' | string;
  hasBoughtBefore: boolean;
}

export interface PrescriptionData {
  method: 'EXACT' | 'APPROXIMATE' | 'IN_STORE_EXAM';
  sphRight?: number;
  sphLeft?: number;
  cylRight?: number;
  cylLeft?: number;
  axisRight?: number;
  axisLeft?: number;
  pd?: number;
  addition?: number;
  approximateRange?: string;
}

export interface LensSelectionDetails {
  brandId: string;
  brandName: string;
  lensTypeId: string;
  lensTypeName: string;
  indexId?: string;
  indexValue?: string;
  colorId?: string;
  colorName?: string;
  coatingId?: string;
  coatingName?: string;
  calculatedPrice: number;
}

export interface OrderItem {
  id: string;
  frameId?: string;
  frameName?: string;
  framePrice?: number;
  lensDetails?: LensSelectionDetails;
  totalItemPrice: number;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';

export interface Order {
  id: string;
  created_at?: string;
  contact_info: string;
  customer_profile: CustomerProfile;
  prescription_data: PrescriptionData;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  reserved_until: string;
}

export interface CreateOrderPayload {
  contactInfo: string;
  customerProfile: CustomerProfile;
  prescriptionData: PrescriptionData;
  items: OrderItem[];
  totalPrice: number;
}