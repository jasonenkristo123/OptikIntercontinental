'use client';

import { useState } from 'react';
import { useCartStore } from '@/shared/store/useCartStore';
import { createOrder } from '@/app/actions/orderActions';
import { X, Trash2, MessageSquare, Clock } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clearCart, remainingSeconds } = useCartStore();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCheckoutWA = async () => {
    if (!whatsappNumber.trim()) {
      alert('Masukkan nomor WhatsApp Anda untuk konfirmasi pesanan.');
      return;
    }

    setLoading(true);
    try {
      // 1. Simpan pesanan ke database Supabase
      const newOrder = await createOrder({
        contactInfo: whatsappNumber,
        customerProfile: items[0]?.customerProfile || {},
        prescriptionData: items[0]?.prescriptionData || {},
        items: items.map(item => ({
          id: item.id,
          frameId: item.frameId,
          frameName: item.frameName,
          framePrice: item.framePrice,
          lensDetails: item.lensDetails as any, // Bypass strict LensSelectionDetails for now if IDs are missing
          totalItemPrice: item.totalPrice,
        })),
        totalPrice: totalPrice,
      });

      // 2. Format pesan WhatsApp
      const text = `Halo CS Optik Intercontinental, saya ingin memesan:\n\n` +
        `📌 ORDER ID: #${newOrder.id}\n` +
        `-----------------------------------\n` +
        items.map((item) => {
          let textItem = `🕶️ ${item.frameName || 'Lenses Only'} - Rp ${item.totalPrice.toLocaleString('id-ID')}\n`;
          if (item.lensDetails) {
            textItem += `   🔍 Lensa: ${item.lensDetails.brandName} (${item.lensDetails.lensTypeName})\n`;
          }
          return textItem;
        }).join('\n') +
        `-----------------------------------\n` +
        `💰 TOTAL HARGA: Rp ${totalPrice.toLocaleString('id-ID')}\n\n` +
        `Mohon infokan lokasi toko dan link QRIS untuk pembayaran. Terima kasih!`;

      // 3. Redirect ke WhatsApp CS
      const waUrl = `https://wa.me/6281233633727?text=${encodeURIComponent(text)}`;
      clearCart();
      closeCart();
      window.open(waUrl, '_blank');
    } catch (err: any) {
      alert(err.message || 'Gagal memproses pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-charcoal-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-cream-100 h-full flex flex-col shadow-2xl text-charcoal-900">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-cream-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-bold">Your Selection</h2>
            <span className="text-xs font-mono text-stone-500">({items.length})</span>
          </div>
          <button onClick={closeCart} className="p-2 text-stone-500 hover:text-charcoal-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Countdown Banner */}
        {items.length > 0 && (
          <div className="bg-amber-100/80 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>Stock reservation timer:</span>
            </div>
            <span className="font-mono font-bold text-amber-800">{formatTimer(remainingSeconds)}</span>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-stone-500 font-light text-sm">
              Your bag is currently empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-sm border border-cream-300 flex gap-4 text-xs">
                {item.frameImage && (
                  <img src={item.frameImage} alt="" className="w-16 h-16 object-cover bg-cream-100 rounded-sm" />
                )}
                <div className="flex-1 space-y-1">
                  <div className="font-serif font-bold text-sm">{item.frameName || 'Custom Lens Only'}</div>
                  {item.lensDetails && (
                    <div className="text-stone-500">
                      Lensa: {item.lensDetails.brandName} ({item.lensDetails.lensTypeName})
                    </div>
                  )}
                  <div className="font-bold text-charcoal-900 pt-1">
                    Rp {item.totalPrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-stone-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Form */}
        {items.length > 0 && (
          <div className="p-6 border-t border-cream-300 bg-cream-50 space-y-4">
            <div className="flex justify-between font-serif text-lg font-bold">
              <span>Subtotal</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">
                WhatsApp / Mobile Number
              </label>
              <input
                type="text"
                placeholder="e.g. 08123456789"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-white border border-cream-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-charcoal-900"
              />
            </div>

            <button
              onClick={handleCheckoutWA}
              disabled={loading}
              className="w-full bg-charcoal-900 hover:bg-stone-800 text-cream-50 py-3.5 rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Order via WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}