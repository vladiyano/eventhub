/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/event/:path*',
        destination: `${process.env.NEXT_PUBLIC_EVENT_API ?? 'http://localhost:4101'}/:path*`,
      },
      {
        source: '/api/attendee/:path*',
        destination: `${process.env.NEXT_PUBLIC_ATTENDEE_API ?? 'http://localhost:4102'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
