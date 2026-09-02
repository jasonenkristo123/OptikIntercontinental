'use client';

import { useWizardStore } from '@/shared/store/useWizardStore';
import { Eye, Sun, Shield, Car, Glasses, Layers, ArrowRight } from 'lucide-react';

const LENS_SOLUTIONS = [
  {
    title: 'Single Vision',
    desc: 'Daily distance or reading lenses for minus, plus, & astigmatism.',
    icon: Eye,
    startingPrice: 'Rp 150.000',
  },
  {
    title: 'Progressive Lenses',
    desc: 'No-line multifocal for seamless distance & reading sight.',
    icon: Layers,
    startingPrice: 'Rp 450.000',
  },
  {
    title: 'Bifocal Lenses',
    desc: 'Classic Flat Top or Kryptok segmented dual-view lenses.',
    icon: Glasses,
    startingPrice: 'Rp 250.000',
  },
  {
    title: 'Anti-Radiation / Blue Protect',
    desc: 'Blocks harmful blue light from phones, tablets, & monitors.',
    icon: Shield,
    startingPrice: 'Rp 200.000',
  },
  {
    title: 'Driving Lenses',
    desc: 'Anti-glare coating engineered for day & night driving safety.',
    icon: Car,
    startingPrice: 'Rp 350.000',
  },
  {
    title: 'Photochromic / Transitions',
    desc: 'Sun-adaptive lenses that darken automatically outdoors.',
    icon: Sun,
    startingPrice: 'Rp 300.000',
  },
];

export default function LensCatalog() {
  const { openWizard } = useWizardStore();

  return (
    <section id="lenses" className="bg-cream-200/40 py-16 border-y border-cream-300">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-500">Precision Optics</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-900 mt-1">
              Standalone Lens Solutions
            </h2>
          </div>
          <p className="text-xs text-stone-600 max-w-md font-light">
            Already have your favorite frame? Order high-precision optical lenses tailored directly to your prescription.
          </p>
        </div>

        {/* 6 Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LENS_SOLUTIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-cream-50 p-6 rounded-sm border border-cream-300 flex flex-col justify-between space-y-4 hover:border-charcoal-900 transition duration-300 group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-charcoal-900 group-hover:bg-charcoal-900 group-hover:text-cream-50 transition duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-charcoal-900">{item.title}</h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500">Starting from <strong className="text-charcoal-900">{item.startingPrice}</strong></span>
                  <button
                    onClick={() => openWizard(undefined, 4)} // Langsung ke Step 4 Tipe Lensa
                    className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Standalone Banner */}
        <div className="bg-charcoal-900 text-cream-50 p-8 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-normal">Need help choosing your lens specification?</h3>
            <p className="text-xs text-stone-400 mt-1 font-light">Use our step-by-step optical calculator to find the exact thickness, coating, and prescription match.</p>
          </div>
          <button
            onClick={() => openWizard(undefined, 1)}
            className="shrink-0 bg-cream-50 text-charcoal-900 px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider hover:bg-cream-200 transition"
          >
            Open Lens Wizard
          </button>
        </div>

      </div>
    </section>
  );
}   