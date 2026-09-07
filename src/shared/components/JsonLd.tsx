import { getBaseUrl, siteConfig } from "@/lib/siteConfig";

export default function JsonLd() {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Optician", "LocalBusiness", "Store"],
    name: siteConfig.name,
    description: siteConfig.description,
    url: baseUrl,
    logo: `${baseUrl}/icon`,
    image: `${baseUrl}/opengraph-image`,
    priceRange: "Rp Rp",
    currenciesAccepted: "IDR",
    paymentAccepted: "Cash, Credit Card, QRIS, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Koleksi & Layanan Optik Intercontinental",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pemeriksaan Mata & Konsultasi Lensa Gratis",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Frame & Bingkai Kacamata Premium",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Lensa Minus, Plus, Silinder & Progresif",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
