import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

export async function launchBrowser() {
    console.log('Launching browser!!:')
	
    if (isDev) {
        // Use local Chrome with default args (or minimal args)        
        return puppeteer.launch({
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          headless: false,
          args: [],
          defaultViewport: null,
        });
	} 
	  
	console.log('executablePath!!:',path.join(process.cwd(),'node_modules/@sparticuz/chromium/bin/'))
	//console.log('Chromium path:', await chromium.executablePath());

	// Production: use @sparticuz/chromium
	const executablePath = path.join(process.cwd(),'node_modules/@sparticuz/chromium/bin/');
	//await chromium.executablePath();
	
	if (!executablePath) {
		throw new Error("Chromium executablePath is undefined. Deployment may be missing binary.");
	}
	
	console.log('executablePath!!:',executablePath)

	return puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath,
		headless: chromium.headless,
	});
      
}
