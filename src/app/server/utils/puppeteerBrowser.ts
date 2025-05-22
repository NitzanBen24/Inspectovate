import path from 'path';
import puppeteer, { Browser } from 'puppeteer'; // used locally
import puppeteerCore from 'puppeteer-core';     // used on production
import chromium from '@sparticuz/chromium';

export async function launchBrowser(): Promise<any> {
  const isProduction = process.env.VERCEL === '1';

  if (isProduction) {
    const executablePath = path.join(
      process.cwd(),
      '.next',
      'server',
      'bin',
      'chromium' // name of the binary in the bin folder
    );

    return await puppeteerCore.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });
  } else {
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
}
