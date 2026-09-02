import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  frameId?: string;
  frameName?: string;
  framePrice?: number;
  frameImage?: string;
  lensDetails?: {
    brandId: string;
    brandName: string;
    lensTypeName: string;
    indexValue: string;
    colorName?: string;
    coatingName?: string;
    calculatedPrice: number;
  };
  prescriptionData?: any;
  customerProfile?: any;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  expiresAt: number | null; // Timestamp masa berlaku reservasi
  remainingSeconds: number;
  
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateTimer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      expiresAt: null,
      remainingSeconds: 600, // 10 menit = 600 detik

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const state = get();
        const expiresAt = state.items.length === 0 ? Date.now() + 10 * 60 * 1000 : state.expiresAt;
        
        set({
          items: [...state.items, item],
          expiresAt,
          isOpen: true,
        });
      },

      removeItem: (id) => {
        const nextItems = get().items.filter((i) => i.id !== id);
        set({
          items: nextItems,
          expiresAt: nextItems.length === 0 ? null : get().expiresAt,
          remainingSeconds: nextItems.length === 0 ? 600 : get().remainingSeconds,
        });
      },

      clearCart: () => set({ items: [], expiresAt: null, remainingSeconds: 600 }),

      updateTimer: () => {
        const { expiresAt, clearCart } = get();
        if (!expiresAt) return;

        const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
        if (diff <= 0) {
          clearCart(); // Reset keranjang & lepaskan reservasi stok jika waktu habis
        } else {
          set({ remainingSeconds: diff });
        }
      },
    }),
    { name: 'optik-cart-storage' }
  )
);