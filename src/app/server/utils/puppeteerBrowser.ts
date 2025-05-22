const isProduction = process.env.VERCEL === '1';

export async function launchBrowser() {
  if (isProduction) {
    const puppeteer = (await import('puppeteer-core')).default;
    const chromium = (await import('@sparticuz/chromium')).default;
    const headlessMode = chromium.headless === "new" ? true : chromium.headless;

    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: headlessMode,
    });
  } else {
    const puppeteer = (await import('puppeteer')).default;

    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
}
