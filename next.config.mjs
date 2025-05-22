import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium', 'bin'),
            to: path.join(process.cwd(), '.next', 'server', 'bin'),
          },
        ],
      })
    );

    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';

    return config;
  },
};

export default nextConfig;
