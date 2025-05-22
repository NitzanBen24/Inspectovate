import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium";
import path from "path";
import { fileURLToPath } from "url";

// Detect environment
const isProduction = process.env.VERCEL;

export async function launchBrowser(): Promise<Browser> {
  if (isProduction) {
    const chromiumPath = path.join(
      process.cwd(),
      '.next',
      'server',
      'app',
      'api',
      'bin',
      'chromium'
    );

    return await puppeteer.launch({
      args: chromium.args,
      executablePath: chromiumPath,
      headless: chromium.headless,
    });
  } else {
    return await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}

