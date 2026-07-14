import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d2d-life.firebaseapp.com';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/provision`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      // Custom frequency updates to match the Semi-Final match periods starting July 15, 2026
      lastModified: new Date('2026-07-13T00:00:00.000Z'),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ];
}
