import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100 py-16 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-cream-300/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cream-200/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Location */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-cream-50 tracking-tight">Optik Intercontinental</h3>
              <div className="h-1 w-12 bg-cream-200 mt-2 rounded-full" />
            </div>
            <p className="text-cream-300 text-sm leading-relaxed">
              Meningkatkan penglihatan Anda dengan kacamata premium dan layanan perawatan mata profesional. Lihat dunia dengan jelas dan bergaya.
            </p>
            <div className="flex items-start gap-3 group">
              <div className="bg-charcoal-800 p-2 rounded-lg group-hover:bg-cream-100 group-hover:text-charcoal-900 transition-colors duration-300">
                <MapPin className="w-4 h-4 text-cream-200 group-hover:text-charcoal-900 transition-colors" />
              </div>
              <p className="text-sm text-cream-300 leading-relaxed mt-1 group-hover:text-cream-100 transition-colors">
                Jl. Example Road No. 123<br />
                City, State 12345<br />
                Indonesia
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cream-50">Tautan Cepat</h4>
            <ul className="space-y-3">
              {[
                { name: "Beranda", href: "/" },
                { name: "Belanja Lensa", href: "/shop" },
                { name: "Tentang Kami", href: "/about" },
                { name: "Kontak", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-cream-300 hover:text-white transition-all duration-300 flex items-center gap-2 hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cream-300 opacity-0 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cream-50">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-4 text-cream-300 hover:text-white transition-colors"
                >
                  <div className="bg-charcoal-800 p-2.5 rounded-lg group-hover:bg-[#25D366] transition-colors duration-300 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-cream-200 group-hover:text-white" />
                  </div>
                  <span className="text-sm">+62 812-3456-7890 (WA)</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+6281234567890" 
                  className="group flex items-center gap-4 text-cream-300 hover:text-white transition-colors"
                >
                  <div className="bg-charcoal-800 p-2.5 rounded-lg group-hover:bg-blue-500 transition-colors duration-300 shadow-sm">
                    <Phone className="w-4 h-4 text-cream-200 group-hover:text-white" />
                  </div>
                  <span className="text-sm">+62 812-3456-7890</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@optikintercontinental.com" 
                  className="group flex items-center gap-4 text-cream-300 hover:text-white transition-colors"
                >
                  <div className="bg-charcoal-800 p-2.5 rounded-lg group-hover:bg-red-500 transition-colors duration-300 shadow-sm">
                    <Mail className="w-4 h-4 text-cream-200 group-hover:text-white" />
                  </div>
                  <span className="text-sm">info@optik.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Maps */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cream-50">Terhubung & Kunjungi Kami</h4>
            <p className="text-cream-300 text-sm mb-6 leading-relaxed">
              Ikuti media sosial kami untuk koleksi terbaru dan tips perawatan mata.
            </p>
            <div className="flex gap-3 mb-8">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-charcoal-800 p-3 rounded-full text-cream-200 hover:text-white hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-charcoal-800 p-3 rounded-full text-cream-200 hover:text-white hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
            
            <div className="p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-800 hover:border-cream-300/30 transition-colors">
              <h4 className="text-xs font-semibold mb-3 text-cream-200 uppercase tracking-wider">Lokasi Toko</h4>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 bg-cream-100 text-charcoal-900 rounded-lg text-sm font-medium hover:bg-white transition-colors hover:shadow-md active:scale-95"
              >
                <MapPin className="w-4 h-4" />
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-charcoal-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream-300 text-sm">
            &copy; {new Date().getFullYear()} Optik Intercontinental. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-6 text-sm text-cream-300">
            <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <span className="w-1 h-1 rounded-full bg-charcoal-800" />
            <Link href="/terms" className="hover:text-white transition-colors">Syarat dan Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
