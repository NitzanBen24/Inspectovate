const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';

    // config.module.rules.push({
    //   test: /\.js\.map$/,
    //   use: 'ignore-loader',
    // });

    return config;
  },
  // Make sure to include chromium binaries folder in output if needed (Vercel specifics)
  output: 'standalone', 
};

export default nextConfig;
