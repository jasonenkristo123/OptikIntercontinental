'use client';

import { Eye, Layers, Shield, Sparkles, ArrowRight, CheckCircle2, Sliders, FileText } from 'lucide-react';

interface Props {
  onOpenWizard: () => void;
  onSwitchToFrames?: () => void;
}

const LENS_FEATURES = [
  {
    icon: Eye,
    title: 'Resep Optik Akurat',
    desc: 'Mendukung ukuran SPH (minus/plus), CYL (silinder), AXIS, PD, hingga ADD untuk mata presbiopia.',
    badge: '100% Akurat',
  },
  {
    icon: Layers,
    title: 'Indeks Ketipisan Fleksibel',
    desc: 'Pilihan indeks dari Standard 1.50, Tipis 1.56/1.60, hingga Ultra-Thin 1.67/1.74 untuk estetika maksimal.',
    badge: 'Standard s/d 1.74',
  },
  {
    icon: Shield,
    title: 'Teknologi Coating Modern',
    desc: 'Perlindungan Blue Cut radiasi gawai, Photocromic adaptif sinar matahari, dan anti-silau berkendara.',
    badge: 'Multi-Coatings',
  },
  {
    icon: Sparkles,
    title: 'Pemasangan Presisi Gratis',
    desc: 'Kirimkan bingkai lama Anda atau bawa langsung ke toko fisik kami untuk pemasangan presisi tanpa biaya tambahan.',
    badge: 'Free Fitting',
  },
];

const WIZARD_STEPS_PREVIEW = [
  { step: '01', title: 'Data Resep', desc: 'Input ukuran dokter atau pilih cek gratis di toko' },
  { step: '02', title: 'Anggaran & Merek', desc: 'Pilihan brand ternama sesuai budget Anda' },
  { step: '03', title: 'Kustom Indeks & Fitur', desc: 'Pilih ketipisan, warna, dan lapisan lensa' },
  { step: '04', title: 'Konfirmasi Pesanan', desc: 'Pesanan instan langsung terhubung ke WhatsApp' },
];

export default function LensCatalog({ onOpenWizard, onSwitchToFrames }: Props) {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-cream-50 border border-cream-300 rounded-sm p-8 sm:p-12 relative overflow-hidden shadow-sm">
        {/* Subtle decorative accent */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200/80 border border-cream-300 text-charcoal-900 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Kustomisasi Lensa Optik Terpisah</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal-900 leading-tight">
            Pesan Lensa Saja Sesuai Resep Anda
          </h2>

          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            Sudah memiliki bingkai kacamata favorit atau ingin memperbarui lensa lama? Di Optik Intercontinental, seluruh lensa dikustomisasi secara presisi sesuai resep mata dan kebutuhan harian Anda tanpa harus membeli bingkai baru.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenWizard}
              className="inline-flex items-center gap-2.5 bg-charcoal-900 text-cream-50 px-6 py-3.5 rounded-sm text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-stone-800 transition group shadow-md"
            >
              <span>Mulai Kustomisasi Lensa</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onSwitchToFrames && (
              <button
                onClick={onSwitchToFrames}
                className="inline-flex items-center gap-2 border border-charcoal-900/30 text-charcoal-900 px-5 py-3.5 rounded-sm text-xs sm:text-sm font-medium hover:bg-cream-200/60 transition"
              >
                <span>Lihat Katalog Bingkai</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {LENS_FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-cream-50 p-6 rounded-sm border border-cream-300 flex flex-col justify-between space-y-4 hover:border-charcoal-900/40 hover:shadow-md transition duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-charcoal-900 group-hover:bg-charcoal-900 group-hover:text-cream-50 transition duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cream-200/80 text-stone-600">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">{feat.title}</h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step by Step Guide & Launch Banner */}
      <div className="bg-charcoal-900 text-cream-50 rounded-sm p-8 sm:p-10 border border-stone-800 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Proses Cepat & Terpandu</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal mt-1">4 Langkah Kustomisasi Lensa</h3>
          </div>
          <p className="text-xs text-stone-400 max-w-md font-light">
            Kalkulator kami memandu Anda memilih kombinasi resep, anggaran, dan coating terbaik dalam hitungan menit.
          </p>
        </div>

        {/* 4 Steps preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WIZARD_STEPS_PREVIEW.map((s, idx) => (
            <div key={idx} className="bg-stone-900/60 p-5 rounded border border-stone-800 space-y-2">
              <span className="text-amber-400 font-mono text-xs font-bold">{s.step}</span>
              <h4 className="font-serif text-sm font-semibold text-cream-100">{s.title}</h4>
              <p className="text-xs text-stone-400 font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950/40 p-6 rounded border border-stone-800">
          <div className="flex items-center gap-3 text-xs text-stone-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Resep dapat diverifikasi manual oleh optisi kami sebelum proses pengerjaan.</span>
          </div>

          <button
            onClick={onOpenWizard}
            className="w-full sm:w-auto shrink-0 bg-cream-50 text-charcoal-900 px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider hover:bg-cream-200 transition text-center"
          >
            Buka Kalkulator Lensa
          </button>
        </div>
      </div>
    </div>
  );
}