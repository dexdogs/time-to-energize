/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@data'] = path.join(__dirname, 'data')
    return config
  },
}

module.exports = nextConfig
