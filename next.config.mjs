/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // the hadith search API reads its index from disk
  experimental: { outputFileTracingIncludes: { '/api/hadith/search': ['./data/sahihayn/**'], '/api/quran/search': ['./data/quran/search.json'], '/surah/[number]': ['./data/quran/en/**', './public/data/quran/**'] } },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'everyayah.com' },
      { protocol: 'https', hostname: 'api.quran.com' },
      { protocol: 'https', hostname: 'cdn.islamic.network' },
      { protocol: 'https', hostname: 'www.mp3quran.net' },
      { protocol: 'https', hostname: 'mp3quran.net' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
