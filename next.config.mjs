const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';
    
    // Add chromium-min binaries to be included in the build output
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    return config;
  },
  experimental: {
    // Next.js 14 experimental flag for app dir (if used)
    appDir: true,
  },
  // Make sure to include chromium binaries folder in output if needed (Vercel specifics)
  output: 'standalone', 
};

export default nextConfig;
