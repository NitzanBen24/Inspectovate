import chromium from '@sparticuz/chromium';


export async function launchBrowser() {
    const isProduction = process.env.VERCEL === '1';

    if (isProduction) {
        const executablePath = await chromium.executablePath();
        const puppeteerCore = (await import('puppeteer-core')).default;

        return puppeteerCore.launch({
            args: chromium.args,
            executablePath,
            headless: true,
        });
    } else {
        const puppeteer = (await import('puppeteer')).default;

        return puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }
}
