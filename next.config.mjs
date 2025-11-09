/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  headers: async () => [
    {
      source: '/.well-known/farcaster.json',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=utf-8' },
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
export default nextConfig
