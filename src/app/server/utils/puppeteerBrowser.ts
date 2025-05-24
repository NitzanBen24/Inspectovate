import chromium from '@sparticuz/chromium-min';


export async function launchBrowser() {
    const isProduction = process.env.VERCEL === '1';

    if (isProduction) {
        const { default: puppeteerCore } = await import('puppeteer-core');        
        return puppeteerCore.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });
    } else {
        const { default: puppeteer } = await import('puppeteer');
        return puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }
}
