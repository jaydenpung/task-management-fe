/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/task',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
}