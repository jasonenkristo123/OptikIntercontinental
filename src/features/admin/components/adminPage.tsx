'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  getAdminOrders,
  confirmOrder,
  cancelOrder
} from '@/app/actions/orderActions';
import {
  getFrames,
  deleteFrame
} from '@/app/actions/frameActions';
import {
  getMasterData,
  createMasterItem,
  deleteMasterItem
} from '@/app/actions/masterActions';
import {
  Order,
  Frame,
  MasterItem,
  AuthenticityTag,
  LensType
} from '@/shared/types/database';

import FrameFormModal from './frameFormModal';
import MasterLookupTab from './masterLookupTab';

import {
  ShoppingBag,
  Glasses,
  Sliders,
  Database,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  RefreshCw,
  Edit2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LensMatrixTab from './lensMatrixTab';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'frames' | 'matrix' | 'master'>('orders');
  const [isPending, startTransition] = useTransition();

  // Modal & Edit States
  const [isFrameModalOpen, setIsFrameModalOpen] = useState(false);
  const [selectedFrameToEdit, setSelectedFrameToEdit] = useState<Frame | null>(null);

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);

  // Pagination States
  const [orderPage, setOrderPage] = useState(1);
  const [framePage, setFramePage] = useState(1);
  const itemsPerPage = 10;

  const paginatedOrders = orders.slice((orderPage - 1) * itemsPerPage, orderPage * itemsPerPage);
  const totalOrderPages = Math.ceil(orders.length / itemsPerPage) || 1;

  const paginatedFrames = frames.slice((framePage - 1) * itemsPerPage, framePage * itemsPerPage);
  const totalFramePages = Math.ceil(frames.length / itemsPerPage) || 1;
  const [masterData, setMasterData] = useState<{
    categories: MasterItem[];
    materials: MasterItem[];
    authenticity: AuthenticityTag[];
    lensTypes: LensType[];
    budgets: MasterItem[];
  }>({ categories: [], materials: [], authenticity: [], lensTypes: [], budgets: [] });

  // Load All Data
  const loadData = () => {
    startTransition(async () => {
      const [fetchedOrders, fetchedFrames, fetchedMaster] = await Promise.all([
        getAdminOrders(),
        getFrames(),
        getMasterData(),
      ]);
      setOrders(fetchedOrders);
      setFrames(fetchedFrames);
      setMasterData(fetchedMaster);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers untuk Order Action
  const handleConfirmOrder = async (orderId: string) => {
    await confirmOrder(orderId);
    loadData();
  };

  const handleCancelOrder = async (orderId: string) => {
    await cancelOrder(orderId);
    loadData();
  };

  // Handler Hapus Frame
  const handleDeleteFrame = async (frameId: string) => {
    if (confirm('Yakin ingin menghapus frame ini?')) {
      await deleteFrame(frameId);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream-50 p-6 rounded-sm border border-cream-300">
        <div>
          <h1 className="text-2xl font-serif font-normal text-charcoal-900">Dashboard Kelola Optik</h1>
          <p className="text-stone-500 text-sm mt-1">
            Atur pesanan pelanggan, stok frame, matriks lensa dinamis, dan master data.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isPending}
          className="self-start sm:self-auto flex items-center gap-2 bg-cream-200 hover:bg-cream-300 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-sm border border-cream-400 transition"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cream-300 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-semibold transition ${activeTab === 'orders'
              ? 'bg-charcoal-900 text-cream-50 shadow-lg shadow-stone-900/10'
              : 'bg-cream-50 text-stone-500 hover:text-charcoal-900 border border-cream-300'
            }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('frames')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-semibold transition ${activeTab === 'frames'
              ? 'bg-charcoal-900 text-cream-50 shadow-lg shadow-stone-900/10'
              : 'bg-cream-50 text-stone-500 hover:text-charcoal-900 border border-cream-300'
            }`}
        >
          <Glasses className="w-4 h-4" />
          <span>Frames ({frames.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-semibold transition ${activeTab === 'matrix'
              ? 'bg-charcoal-900 text-cream-50 shadow-lg shadow-stone-900/10'
              : 'bg-cream-50 text-stone-500 hover:text-charcoal-900 border border-cream-300'
            }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Matrix Lensa</span>
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-semibold transition ${activeTab === 'master'
              ? 'bg-charcoal-900 text-cream-50 shadow-lg shadow-stone-900/10'
              : 'bg-cream-50 text-stone-500 hover:text-charcoal-900 border border-cream-300'
            }`}
        >
          <Database className="w-4 h-4" />
          <span>Master Lookup</span>
        </button>
      </div>

      {/* TAB CONTENT 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-cream-50 rounded-sm border border-cream-300 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="bg-cream-100 text-stone-500 text-xs uppercase tracking-wider border-b border-cream-300">
                <tr>
                  <th className="p-4">Order ID & Waktu</th>
                  <th className="p-4">Kontak / Customer</th>
                  <th className="p-4">Rincian Item</th>
                  <th className="p-4">Total Harga</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-300">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-stone-400">
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream-200/50 transition">
                      <td className="p-4 font-mono font-bold text-charcoal-900">
                        {order.id}
                        <div className="text-[11px] font-sans text-stone-400 font-normal mt-0.5">
                          {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-charcoal-900">{order.contact_info}</div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          Umur: {order.customer_profile?.ageGroup || '-'} | History:{' '}
                          {order.customer_profile?.hasBoughtBefore ? 'Pernah Beli' : 'Baru'}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-cream-100 p-2 rounded-lg border border-cream-300 text-xs">
                            {item.frameName && <div className="font-semibold text-stone-700">🕶️ {item.frameName}</div>}
                            {item.lensDetails && (
                              <div className="text-stone-500 mt-0.5">
                                🔍 Lensa: {item.lensDetails.brandName} - {item.lensDetails.lensTypeName} ({item.lensDetails.indexValue})
                              </div>
                            )}
                          </div>
                        ))}
                      </td>

                      <td className="p-4 font-serif font-normal text-charcoal-900">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'CONFIRMED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'CANCELLED'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {order.status === 'PENDING_PAYMENT' && (
                          <>
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              title="Konfirmasi Pesanan"
                              className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg border border-emerald-200 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              title="Batalkan Pesanan & Kembalikan Stok"
                              className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg border border-rose-200 transition"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Order Pagination Controls */}
          {totalOrderPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-cream-300 bg-cream-50">
              <span className="text-sm text-stone-500">
                Menampilkan {(orderPage - 1) * itemsPerPage + 1} - {Math.min(orderPage * itemsPerPage, orders.length)} dari {orders.length} pesanan
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                  disabled={orderPage === 1}
                  className="p-1.5 rounded-sm border border-cream-300 text-stone-500 hover:bg-cream-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-charcoal-900 px-2">
                  Halaman {orderPage} dari {totalOrderPages}
                </span>
                <button
                  onClick={() => setOrderPage(p => Math.min(totalOrderPages, p + 1))}
                  disabled={orderPage === totalOrderPages}
                  className="p-1.5 rounded-sm border border-cream-300 text-stone-500 hover:bg-cream-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'frames' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-serif font-normal text-charcoal-900">Katalog Produk Frame Kacamata</h2>
            <button
              onClick={() => {
                setSelectedFrameToEdit(null);
                setIsFrameModalOpen(true);
              }}
              className="flex items-center gap-2 bg-charcoal-900 hover:bg-stone-800 text-cream-50 font-semibold text-xs px-4 py-2.5 rounded-sm shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Frame Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedFrames.map((frame) => (
              <div key={frame.id} className="bg-cream-50 border border-cream-300 rounded-sm overflow-hidden p-4 flex gap-4 items-center">
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={frame.image_url}
                    alt={frame.name}
                    fill
                    className="object-cover rounded-sm bg-cream-100 border border-cream-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-normal text-charcoal-900 truncate text-sm">{frame.name}</h3>
                  <p className="text-xs text-charcoal-900 mt-0.5">
                    {frame.category?.name} • {frame.material?.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Stok: <strong className="text-stone-700">{frame.stock} pcs</strong></p>
                  <p className="text-sm font-serif font-normal text-charcoal-900 mt-1">
                    Rp {Number(frame.price).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setSelectedFrameToEdit(frame);
                      setIsFrameModalOpen(true);
                    }}
                    className="p-2 text-stone-500 hover:text-charcoal-900 hover:bg-cream-200 rounded-lg transition"
                    title="Edit Frame"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFrame(frame.id)}
                    className="p-2 text-rose-700 hover:bg-rose-100 rounded-lg transition"
                    title="Hapus Frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Frame Pagination Controls */}
          {totalFramePages > 1 && (
            <div className="flex items-center justify-between p-4 border border-cream-300 rounded-sm bg-cream-50 mt-4">
              <span className="text-sm text-stone-500">
                Menampilkan {(framePage - 1) * itemsPerPage + 1} - {Math.min(framePage * itemsPerPage, frames.length)} dari {frames.length} frame
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFramePage(p => Math.max(1, p - 1))}
                  disabled={framePage === 1}
                  className="p-1.5 rounded-sm border border-cream-300 text-stone-500 hover:bg-cream-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-charcoal-900 px-2">
                  Halaman {framePage} dari {totalFramePages}
                </span>
                <button
                  onClick={() => setFramePage(p => Math.min(totalFramePages, p + 1))}
                  disabled={framePage === totalFramePages}
                  className="p-1.5 rounded-sm border border-cream-300 text-stone-500 hover:bg-cream-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: MATRIX LENSA */}
      {activeTab === 'matrix' && (
        <LensMatrixTab
          masterData={masterData}
          onRefresh={loadData}
        />
      )}

      {/* TAB CONTENT 4: MASTER LOOKUP */}
      {activeTab === 'master' && (
        <MasterLookupTab data={masterData} onRefresh={loadData} />
      )}

      {/* MODAL FORM ADD / EDIT FRAME */}
      <FrameFormModal
        isOpen={isFrameModalOpen}
        onClose={() => setIsFrameModalOpen(false)}
        onSuccess={loadData}
        initialData={selectedFrameToEdit}
        categories={masterData.categories}
        materials={masterData.materials}
        authenticity={masterData.authenticity}
      />
    </div>
  );
}