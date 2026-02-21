/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // build static HTML with next export
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // trailing slash is helpful for static hosts, optional
  // exportTrailingSlash: true,
}

export default nextConfig
