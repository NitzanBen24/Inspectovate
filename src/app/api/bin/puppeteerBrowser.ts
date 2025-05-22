import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium";

// Detect environment
const isProduction = process.env.VERCEL;
console.log('check.this!!',isProduction)
export async function launchBrowser(): Promise<Browser> {
  if (isProduction) {
    return await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    return await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}
