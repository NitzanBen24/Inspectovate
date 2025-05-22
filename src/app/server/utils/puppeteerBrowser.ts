import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium";
import path from "path";
import { fileURLToPath } from "url";

// Detect environment
const isProduction = process.env.VERCEL;

// Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define local Chromium binary path (adjust if needed)
// const localChromiumPath = path.join("/var/task/public/chromium/chromium");
const localChromiumPath = path.join(__dirname, "../../../chromium");

export async function launchBrowser(): Promise<Browser> {
  if (isProduction) {
    const executablePath = path.join(process.cwd(), "chromium", "chromium"); 

    return await puppeteer.launch({
      args: chromium.args,
      executablePath: localChromiumPath,
      headless: chromium.headless,
    });
  } else {
    return await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}
