'use client';

import { useState, useMemo } from 'react';
import { Frame } from '@/shared/types/database';
import { useCartStore } from '@/shared/store/useCartStore';
import { useWizardStore } from '@/shared/store/useWizardStore';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';

interface Props {
  frames: Frame[];
}

export default function FrameCatalog({ frames }: Props) {
  const { addItem } = useCartStore();
  const { openWizard } = useWizardStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000000);

  // Filter Logic
  const filteredFrames = useMemo(() => {
    return frames.filter((frame) => {
      const matchCat = selectedCategory === 'All' || frame.category?.name === selectedCategory;
      const matchMat = selectedMaterial === 'All' || frame.material?.name === selectedMaterial;
      const matchPrice = Number(frame.price) <= maxPrice;
      return matchCat && matchMat && matchPrice;
    });
  }, [frames, selectedCategory, selectedMaterial, maxPrice]);

  const handleBuyFrameOnly = (frame: Frame) => {
    addItem({
      id: `frame-${frame.id}-${Date.now()}`,
      frameId: frame.id,
      frameName: frame.name,
      framePrice: Number(frame.price),
      frameImage: frame.image_url,
      totalPrice: Number(frame.price),
    });
  };

  return (
    <section id="frames" className="max-w-7xl mx-auto px-6 py-16 space-y-10">
      
      {/* Section Header & Top Filter Bar */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500">Koleksi Kacamata</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-900 mt-1">
            Bingkai Pilihan
          </h2>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-cream-200/60 p-4 rounded-xl border border-cream-300/80 flex flex-wrap gap-4 items-center justify-between text-xs">
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-stone-500 font-medium mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Target:
            </span>
            {['All', 'Men', 'Women', 'Kids', 'Unisex'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-charcoal-900 text-cream-50'
                    : 'bg-cream-50 text-stone-700 hover:bg-cream-100'
                }`}
              >
                {cat === 'All' ? 'Semua' : cat === 'Men' ? 'Pria' : cat === 'Women' ? 'Wanita' : cat === 'Kids' ? 'Anak' : cat}
              </button>
            ))}
          </div>

          {/* Material & Price Filter */}
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="bg-cream-50 border border-cream-300 rounded-lg px-3 py-1.5 text-stone-700 focus:outline-none"
            >
              <option value="All">Semua Material</option>
              <option value="Acetate">Acetate</option>
              <option value="Metal">Metal</option>
              <option value="Titanium">Titanium</option>
              <option value="TR90">TR90</option>
            </select>

            <div className="flex items-center gap-2 text-stone-600 font-mono text-[11px]">
              <span>Harga Maks:</span>
              <input
                type="range"
                min={200000}
                max={2000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-charcoal-900 cursor-pointer"
              />
              <span className="font-bold text-charcoal-900">Rp {(maxPrice / 1000).toFixed(0)}k</span>
            </div>
          </div>

        </div>
      </div>

      {/* Frame Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFrames.length === 0 ? (
          <div className="col-span-full text-center py-16 text-stone-500 font-light text-sm">
            Tidak ada bingkai yang cocok dengan kriteria pilihan Anda.
          </div>
        ) : (
          filteredFrames.map((frame) => (
            <div
              key={frame.id}
              className="bg-cream-50 border border-cream-300/80 rounded-sm overflow-hidden flex flex-col justify-between group hover:border-charcoal-900/40 transition duration-300 shadow-sm"
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] bg-cream-200/50 overflow-hidden">
                <Image
                  src={frame.image_url}
                  alt={frame.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Top-Right Authenticity Badge */}
                <div className="absolute top-3 right-3 bg-charcoal-900/90 text-cream-50 text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{frame.authenticity?.name || '100% Original'}</span>
                </div>

                {/* Bottom-Left Material Badge */}
                <div className="absolute bottom-3 left-3 bg-cream-50/90 text-charcoal-900 text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-cream-300">
                  {frame.material?.name || 'Titanium'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1">
                    <span>Kategori: {frame.category?.name}</span>
                    <span className="text-amber-700 font-semibold">Tersisa {frame.stock}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-900">{frame.name}</h3>
                  <p className="font-serif font-bold text-charcoal-900 text-base mt-2">
                    Rp {Number(frame.price).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* 2 CTA Buttons */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <button
                    onClick={() => handleBuyFrameOnly(frame)}
                    className="border border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-cream-50 font-medium py-2.5 rounded-sm transition text-center"
                  >
                    Beli Bingkai Saja
                  </button>
                  <button
                    onClick={() => openWizard(frame, 1)}
                    className="bg-charcoal-900 text-cream-50 hover:bg-stone-800 font-medium py-2.5 rounded-sm transition text-center"
                  >
                    Sesuaikan Lensa
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </section>
  );
}