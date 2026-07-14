import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d2d-life.firebaseapp.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',          // Public Entry Portal
          '/provision', // Device Enrollment Guide & PWA Provisioner
          '/support',   // Semi-Finals Volunteer Support Hub & FAQ
        ],
        disallow: [
          '/auth',      // Login Endpoint (should remain hidden from indexes)
          '/calibrate', // Hardware Diagnostics & Sector Anchoring
          '/deck',      // Live Crowd Control Operations Deck
          '/off-ramp',  // Post-Shift Secure Data Purge & Check-out
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
