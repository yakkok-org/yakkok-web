import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import sirv from "sirv";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");
const indexPath = resolve(distDir, "index.html");

const ROUTES = ["/"];

async function startServer() {
  const handler = sirv(distDir, {
    single: true,
    dev: false,
    etag: false,
  });
  const server = createServer((req, res) => handler(req, res, () => {
    res.statusCode = 404;
    res.end();
  }));
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((r) => server.close(r)),
  };
}

async function prerender() {
  const server = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(`${server.url}${route}`, { waitUntil: "networkidle0", timeout: 30000 });

      // useEffect로 inject되는 JSON-LD가 head에 들어갈 때까지 한 번 더 대기
      await page.waitForSelector('script[data-seo="structured-data"]', { timeout: 5000 }).catch(() => {
        console.warn(`[prerender] JSON-LD script not found for ${route}`);
      });

      const html = await page.content();
      const outPath = route === "/" ? indexPath : resolve(distDir, route.replace(/^\//, ""), "index.html");
      await writeFile(outPath, html, "utf8");
      console.log(`[prerender] wrote ${outPath}`);
      await page.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }
}

prerender().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
