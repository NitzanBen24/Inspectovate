import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium";

// Detect environment
const isProduction = process.env.AWS_REGION || process.env.VERCEL;

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
