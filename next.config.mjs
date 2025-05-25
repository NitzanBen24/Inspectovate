const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';

    return config;
  },
  // Make sure to include chromium binaries folder in output if needed (Vercel specifics)
  output: 'standalone', 
};

export default nextConfig;
