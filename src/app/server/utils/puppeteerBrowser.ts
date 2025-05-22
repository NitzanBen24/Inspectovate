import { Browser } from 'puppeteer';
import chromium from '@sparticuz/chromium';
import path from 'path';

export async function launchBrowser(): Promise<any> {
  const isProduction = process.env.VERCEL === '1';
  const executablePath = path.join(process.cwd(), '.next', 'server', 'bin', 'chromium');
  console.log('Chromium executable path:', executablePath);

  if (isProduction) {
    const puppeteer = await import('puppeteer-core');
    return await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });
  } else {
    const puppeteer = await import('puppeteer');
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
}
