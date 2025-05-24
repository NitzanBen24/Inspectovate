const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';
    return config;
  },
};

export default nextConfig;
