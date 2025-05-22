import { Browser } from 'puppeteer';
import chromium from '@sparticuz/chromium';

export async function launchBrowser(): Promise<any> {
  const isProduction = process.env.VERCEL === '1';

  if (isProduction) {
    const puppeteer = await import('puppeteer-core');
    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(), // ✅ proper path
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
