import chromium from '@sparticuz/chromium-min';


export async function launchBrowser() {
    const isProduction = process.env.VERCEL === '1';
    console.log('isProduction', isProduction)

    if (isProduction) {
        const executablePath = await chromium.executablePath();

        const { default: puppeteerCore } = await import('puppeteer-core');
        
        return puppeteerCore.launch({
            args: chromium.args,
            executablePath,
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
