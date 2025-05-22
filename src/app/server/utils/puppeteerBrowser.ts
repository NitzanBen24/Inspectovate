import chromium from '@sparticuz/chromium';

export async function launchBrowser() {  
    // @sparticuz/chromium handles extraction internally and returns correct path
    const executablePath = await chromium.executablePath();

    return await import('puppeteer-core').then(({ default: puppeteerCore }) =>
      puppeteerCore.launch({
        args: chromium.args,
        executablePath,
        //headless: chromium.headless,
      })
    );
  
}
