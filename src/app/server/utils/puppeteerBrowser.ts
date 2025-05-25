//import chromium from '@sparticuz/chromium-min';
import chromium from 'chrome-aws-lambda';
import puppeteerCore from 'puppeteer-core';

const isDev = process.env.NODE_ENV !== 'production';

export async function launchBrowser() {
    console.log('Launching browser!!:')
    if (isDev) {
        // Use local Chrome with default args (or minimal args)
        const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        return puppeteerCore.launch({
          executablePath,
          headless: false, // for dev, you probably want to see the browser
          // Optionally minimal or no args:
          args: [],
          defaultViewport: null, // or your preferred viewport
        });
      } else {
        // Production with chrome-aws-lambda Chromium
        const executablePath = await chromium.executablePath;
        console.log('executablePath!!:',executablePath)
        return puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath,
          headless: chromium.headless,
        });
      }
}
