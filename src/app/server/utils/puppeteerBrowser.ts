//import chromium from '@sparticuz/chromium-min';
// import chromium from 'chrome-aws-lambda';
// import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import path from 'path';
import fs from "fs";

const isDev = process.env.NODE_ENV !== 'production';

export async function launchBrowser() {
    console.log('Launching browser!!:')

	console.log('executablePath!!:',path.join(process.cwd(),'node_modules/@sparticuz/chromium/bin/' ))
	console.log("Chromium exists!!:", fs.existsSync("/var/task/node_modules/@sparticuz/chromium/bin/chromium.br"));

    const executablePath = isDev
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : 'node_modules/@sparticuz/chromium/bin/'
	
	//: await chromium.executablePath(); 	

	//: path.join(process.cwd(),'node_modules/@sparticuz/chromium/bin/' );
	//: path.join(process.cwd(), 'vendor/chromium/chromium.br');
	//
	

	

    if (isDev) {
        // Use local Chrome with default args (or minimal args)        
        return puppeteer.launch({
          executablePath,
          headless: false, // for dev, you probably want to see the browser
          args: [],
          defaultViewport: null, // or your preferred viewport
        });
      } else {
        // const executablePath = await chromium.executablePath();
        console.log('executablePath!!:',executablePath)
        return puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath,
          headless: chromium.headless,
        });
      }
}
