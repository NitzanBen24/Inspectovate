import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    
    config.resolve.alias['@fortawesome/fontawesome-svg-core/styles.css'] =
      '@fortawesome/fontawesome-svg-core';
    
    return config;

  },
  // experimental: {
  //   outputFileTracingIncludes: {
  //     './src/app/api/generate-pdf/': [
  //       resolve(__dirname, 'node_modules', '@sparticuz', 'chromium-min', 'bin', 'chromium.br'),
  //     ],
  //   },
  // },
};

export default nextConfig;
