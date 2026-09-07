'use client';

import { useState, useMemo, useEffect } from 'react';
import { Frame } from '@/shared/types/database';
import { useCartStore } from '@/shared/store/useCartStore';
import { useWizardStore } from '@/shared/store/useWizardStore';
import { Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight, Glasses } from 'lucide-react';
import Image from 'next/image';
import LensCatalog from './lensCatalog';

interface Props {
  frames: Frame[];
}

export default function FrameCatalog({ frames }: Props) {
  const { addItem } = useCartStore();
  const { openWizard } = useWizardStore();

  const [activeTab, setActiveTab] = useState<'frames' | 'lens_only'>('frames');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  
  const uniqueMaterials = useMemo(() => {
    const materials = new Set<string>();
    frames.forEach(f => {
      if (f.material?.name) materials.add(f.material.name);
    });
    return Array.from(materials).sort();
  }, [frames]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    frames.forEach(f => {
      if (f.category?.name) categories.add(f.category.name);
    });
    return Array.from(categories).sort();
  }, [frames]);

  const absoluteMaxPrice = useMemo(() => {
    if (!frames || frames.length === 0) return 2000000;
    const max = Math.max(...frames.map(f => Number(f.price) || 0));
    return Math.max(2000000, Math.ceil(max / 100000) * 100000); 
  }, [frames]);

  const [maxPrice, setMaxPrice] = useState<number>(absoluteMaxPrice);

  useEffect(() => {
    setMaxPrice(absoluteMaxPrice);
  }, [absoluteMaxPrice]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const filteredFrames = useMemo(() => {
    return frames.filter((frame) => {
      const matchCat = selectedCategory === 'All' || frame.category?.name === selectedCategory;
      const matchMat = selectedMaterial === 'All' || frame.material?.name === selectedMaterial;
      const matchPrice = Number(frame.price) <= maxPrice;
      return matchCat && matchMat && matchPrice;
    });
  }, [frames, selectedCategory, selectedMaterial, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedMaterial, maxPrice]);

  const totalPages = Math.ceil(filteredFrames.length / itemsPerPage) || 1;
  const paginatedFrames = filteredFrames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const handleTabBuyLensOnly = () => {
    setActiveTab('lens_only');
    openWizard(undefined, 1);
  };

  return (
    <section id="frames" className="max-w-7xl mx-auto px-6 py-16 space-y-10" aria-labelledby="catalog-heading">      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream-300 pb-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-stone-500">Katalog Produk</p>
          <h2 id="catalog-heading" className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-900 mt-1">
            {activeTab === 'frames' ? 'Bingkai Pilihan' : 'Kustomisasi Lensa'}
          </h2>
        </div>

        <div className="inline-flex p-1.5 bg-cream-200/90 rounded-xl border border-cream-300 shadow-inner self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('frames')}
            className={`px-5 py-2.5 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'frames'
                ? 'bg-charcoal-900 text-cream-50 shadow-md'
                : 'text-stone-600 hover:text-charcoal-900 hover:bg-cream-100/70'
            }`}
          >
            <Glasses className="w-4 h-4" aria-hidden="true" />
            <span>Koleksi Bingkai</span>
          </button>

          <button
            type="button"
            onClick={handleTabBuyLensOnly}
            className={`px-5 cursor-pointer py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'lens_only'
                ? 'bg-charcoal-900 text-cream-50 shadow-md'
                : 'text-stone-600 hover:text-charcoal-900 hover:bg-cream-100/70'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span>Beli Lensa Saja</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: LENS ONLY */}
      {activeTab === 'lens_only' ? (
        <LensCatalog
          onOpenWizard={() => openWizard(undefined, 1)}
          onSwitchToFrames={() => setActiveTab('frames')}
        />
      ) : (
        /* TAB CONTENT 2: FRAMES CATALOG */
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Filters Bar */}
          <div className="bg-cream-200/60 p-4 rounded-xl border border-cream-300/80 flex flex-wrap gap-4 items-center justify-between text-xs">
            
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-stone-500 font-medium mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Target:
              </span>
              {['All', ...uniqueCategories].map((cat) => (
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
                {uniqueMaterials.map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 text-stone-600 font-mono text-[11px]">
                <span>Harga Maks:</span>
                <input
                  type="range"
                  min={200000}
                  max={absoluteMaxPrice}
                  step={50000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-charcoal-900 cursor-pointer"
                />
                <span className="font-bold text-charcoal-900">Rp {maxPrice.toLocaleString('id-ID')}</span>
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
              paginatedFrames.map((frame) => (
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

                    {/* Top-Right Authenticity Badge / Logo */}
                    {frame.authenticity?.name?.toLowerCase().includes('original') && (
                      <div className="absolute top-3 right-3">
                        {frame.brand?.logo_url ? (
                          <div className="bg-white/95 px-2 py-1 rounded shadow-sm backdrop-blur-sm border border-cream-200 flex items-center justify-center">
                            <Image
                              src={frame.brand.logo_url}
                              alt={frame.brand.name}
                              width={48}
                              height={18}
                              className="object-contain h-4 w-auto"
                            />
                          </div>
                        ) : (
                          <div className="bg-charcoal-900/90 text-cream-50 text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>{frame.brand?.name || frame.authenticity.name}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom-Left Material Badge */}
                    <div className="absolute bottom-3 left-3 text-charcoal-900 text-xs md:text-lg font-bold uppercase px-2 py-0.5 ">
                      {frame.material?.name}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-stone-500 font-mono mb-1">
                        <span>{frame.brand?.name ? `${frame.brand.name} • ${frame.category?.name}` : `Kategori: ${frame.category?.name}`}</span>
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
                        Beli Dengan Lensa
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-sm border border-cream-300 text-stone-500 hover:bg-cream-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-sm font-medium text-charcoal-900">
                Halaman {currentPage} dari {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-sm border border-cream-300 text-stone-500 hover:bg-cream-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}