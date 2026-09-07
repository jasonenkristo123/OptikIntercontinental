'use client';

import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Budi Santoso',
    role: 'Pembeli Terverifikasi',
    comment: 'Proses pemesanan via WA sangat cepat. Kacamata Titanium-nya sangat ringan dan lensa Blue Protect-nya terasa adem saat dipakai coding seharian.',
    rating: 5,
  },
  {
    name: 'Siti Rahmawati',
    role: 'Pembeli Terverifikasi',
    comment: 'Awalnya ragu beli kacamata online, tapi wizard kalkulator lensanya sangat membantu menentukan ketebalan index 1.67 untuk minus tinggi saya.',
    rating: 5,
  },
  {
    name: 'Michael Tan',
    role: 'Pembeli Terverifikasi',
    comment: 'Lensa Progressive-nya sangat presisi. CS di WhatsApp ramah dan langsung mengonfirmasi status pembayaran QRIS.',
    rating: 5,
  },
];

export default function CustomerReviews() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-16 space-y-10"
      aria-labelledby="reviews-heading"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="text-center space-y-2">
        <p className="text-xs font-mono uppercase tracking-widest text-stone-500">Testimoni</p>
        <h2 id="reviews-heading" className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-900">
          Dipercaya oleh Pengguna Kacamata
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((rev, idx) => (
          <article
            key={idx}
            className="bg-cream-50 border border-cream-300 p-6 rounded-sm space-y-4 shadow-sm"
            itemScope
            itemType="https://schema.org/Review"
            itemProp="itemListElement"
          >
            <div className="flex text-amber-500 gap-1" aria-label={`Rating: ${rev.rating} dari 5 bintang`}>
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />
              ))}
              <meta itemProp="reviewRating" content={String(rev.rating)} />
            </div>
            <blockquote className="text-xs text-stone-700 font-light leading-relaxed italic" itemProp="reviewBody">
              "{rev.comment}"
            </blockquote>
            <footer className="pt-2 border-t border-cream-200 flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-charcoal-900" itemProp="author" itemScope itemType="https://schema.org/Person">
                <span itemProp="name">{rev.name}</span>
              </span>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> {rev.role}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}