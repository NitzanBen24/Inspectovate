import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {     
    
    // // Ignore source map files
    // config.module.rules.push({
    //   test: /\.map$/,
    //   use: 'ignore-loader',
    // });
    
    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';

    return config;
  },
};

export default nextConfig;
