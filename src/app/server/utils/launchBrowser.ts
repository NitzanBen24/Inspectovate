export async function launchBrowser() {
    if (process.env.VERCEL === '1') {
      const mod = await import('./launchBrowser.prod');
      return mod.launchBrowser();
    } else {
      const mod = await import('./launchBrowser.dev');
      return mod.launchBrowser();
    }
  }
  