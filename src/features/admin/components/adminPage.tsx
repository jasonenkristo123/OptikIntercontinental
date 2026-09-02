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
  Edit2
} from 'lucide-react';
import LensMatrixTab from './lensMatrixTab';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'frames' | 'matrix' | 'master'>('orders');
  const [isPending, startTransition] = useTransition();

  // Modal & Edit States
  const [isFrameModalOpen, setIsFrameModalOpen] = useState(false);
  const [selectedFrameToEdit, setSelectedFrameToEdit] = useState<Frame | null>(null);

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Kelola Optik</h1>
          <p className="text-slate-400 text-sm mt-1">
            Atur pesanan pelanggan, stok frame, matriks lensa dinamis, dan master data.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={isPending}
          className="self-start sm:self-auto flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('frames')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'frames'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
        >
          <Glasses className="w-4 h-4" />
          <span>Frames ({frames.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'matrix'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Matrix Lensa</span>
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === 'master'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
        >
          <Database className="w-4 h-4" />
          <span>Master Lookup</span>
        </button>
      </div>

      {/* TAB CONTENT 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID & Waktu</th>
                  <th className="p-4">Kontak / Customer</th>
                  <th className="p-4">Rincian Item</th>
                  <th className="p-4">Total Harga</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500">
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4 font-mono font-bold text-blue-400">
                        {order.id}
                        <div className="text-[11px] font-sans text-slate-500 font-normal mt-0.5">
                          {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-white">{order.contact_info}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Umur: {order.customer_profile?.ageGroup || '-'} | History:{' '}
                          {order.customer_profile?.hasBoughtBefore ? 'Pernah Beli' : 'Baru'}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-xs">
                            {item.frameName && <div className="font-semibold text-slate-200">🕶️ {item.frameName}</div>}
                            {item.lensDetails && (
                              <div className="text-slate-400 mt-0.5">
                                🔍 Lensa: {item.lensDetails.brandName} - {item.lensDetails.lensTypeName} ({item.lensDetails.indexValue})
                              </div>
                            )}
                          </div>
                        ))}
                      </td>

                      <td className="p-4 font-bold text-white">
                        Rp {Number(order.total_price).toLocaleString('id-ID')}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${order.status === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : order.status === 'CANCELLED'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
                              className="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg border border-emerald-500/30 transition"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              title="Batalkan Pesanan & Kembalikan Stok"
                              className="p-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-lg border border-rose-500/30 transition"
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
        </div>
      )}

      {/* TAB CONTENT 2: FRAMES CATALOG MANAGEMENT */}
      {activeTab === 'frames' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Katalog Produk Frame Kacamata</h2>
            <button
              onClick={() => {
                setSelectedFrameToEdit(null);
                setIsFrameModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Frame Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frames.map((frame) => (
              <div key={frame.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 flex gap-4 items-center">
                <img
                  src={frame.image_url}
                  alt={frame.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-950 border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate text-sm">{frame.name}</h3>
                  <p className="text-xs text-blue-400 mt-0.5">
                    {frame.category?.name} • {frame.material?.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Stok: <strong className="text-slate-200">{frame.stock} pcs</strong></p>
                  <p className="text-sm font-bold text-white mt-1">
                    Rp {Number(frame.price).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setSelectedFrameToEdit(frame);
                      setIsFrameModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    title="Edit Frame"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFrame(frame.id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Hapus Frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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