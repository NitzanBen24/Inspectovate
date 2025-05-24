import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export async function launchBrowser() {
    return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
}
