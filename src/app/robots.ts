import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/login/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
