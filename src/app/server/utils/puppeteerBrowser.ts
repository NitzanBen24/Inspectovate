import chromium from '@sparticuz/chromium';

export async function launchBrowser() {
  const isProduction = process.env.VERCEL === '1';

  if (isProduction) {
    // @sparticuz/chromium handles extraction internally and returns correct path
    const executablePath = await chromium.executablePath();

    return await import('puppeteer-core').then(({ default: puppeteerCore }) =>
      puppeteerCore.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
      })
    );
  } else {
    // Use full puppeteer for local development
    return await import('puppeteer').then(({ default: puppeteer }) =>
      puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
    );
  }
}
