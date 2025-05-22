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
            from: path.resolve('node_modules/@sparticuz/chromium/bin'),
            to: path.resolve('.next/server/bin'),
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
