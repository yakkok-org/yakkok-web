import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import sirv from "sirv";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");
const indexPath = resolve(distDir, "index.html");

const ROUTES = [
  "/",
  "/faq",
  "/blog",
  "/blog/parents-seven-ways",
  "/blog/supplement-combinations",
  "/blog/hypertension-missed-dose",
  "/blog/dementia-checklist",
  "/blog/heartworm-schedule",
];

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
    // 모든 라우트를 먼저 렌더한 뒤 결과를 모았다가 한 번에 기록한다.
    // 라우트별로 즉시 write하면, 다음 라우트 요청 시 sirv가 갱신된 index.html을
    // SPA fallback으로 서빙해 라우트 간 컨텐츠가 섞일 수 있다.
    const results = [];
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(`${server.url}${route}`, { waitUntil: "networkidle0", timeout: 30000 });

      // React 마운트(#root에 자식 생성)까지 명시적으로 대기
      await page.waitForFunction(
        () => document.getElementById("root")?.children.length > 0,
        { timeout: 10000 }
      ).catch(() => {
        console.warn(`[prerender] React did not mount in time for ${route}`);
      });

      // useEffect로 inject되는 JSON-LD가 head에 들어갈 때까지 한 번 더 대기
      await page.waitForSelector('script[data-seo^="structured-data"]', { timeout: 5000 }).catch(() => {
        console.warn(`[prerender] JSON-LD script not found for ${route}`);
      });

      const html = await page.content();
      const outPath = route === "/" ? indexPath : resolve(distDir, route.replace(/^\//, ""), "index.html");
      results.push({ route, outPath, html });
      await page.close();
    }

    for (const { route, outPath, html } of results) {
      if (route !== "/") {
        await mkdir(dirname(outPath), { recursive: true });
      }
      await writeFile(outPath, html, "utf8");
      console.log(`[prerender] wrote ${outPath}`);
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
