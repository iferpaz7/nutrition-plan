import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Scheduled functions are configured in netlify.toml
  // See: https://docs.netlify.com/functions/create-cli-functions/
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
