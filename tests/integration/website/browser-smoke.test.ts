import { AxeBuilder } from "@axe-core/playwright";
import { chromium, type Browser, type BrowserContext } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  ensureWebsiteBuilt,
  RESPONSIVE_WIDTHS,
  startWebsitePreview,
  WEBSITE_SMOKE_PATHS,
} from "../../helpers/website/build.js";

const TEST_TIMEOUT_MS = 120_000;

describe.sequential("website browser smoke", () => {
  let browser: Browser;
  let context: BrowserContext;
  let baseUrl: string;
  let stopServer: (() => Promise<void>) | undefined;

  beforeAll(async () => {
    await ensureWebsiteBuilt();
    const preview = await startWebsitePreview();
    baseUrl = preview.server.url;
    stopServer = preview.stop;
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
  }, TEST_TIMEOUT_MS);

  afterAll(async () => {
    await context?.close();
    await browser?.close();
    await stopServer?.();
  });

  for (const path of WEBSITE_SMOKE_PATHS) {
    it(`loads ${path} with title, h1, and skip link`, async () => {
      const page = await context.newPage();
      try {
        await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded" });
        expect(await page.title()).toContain("a11yst");
        expect(await page.locator("h1").count()).toBeGreaterThan(0);
        const skipLink = page.locator(
          'a.md-skip, a[href="#content"], a[href="#main-content"], a[href="#_top"]',
        );
        expect(await skipLink.count()).toBeGreaterThan(0);
      } finally {
        await page.close();
      }
    }, TEST_TIMEOUT_MS);
  }

  it("passes axe smoke checks on key pages", async () => {
    for (const path of WEBSITE_SMOKE_PATHS) {
      const page = await context.newPage();
      try {
        await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        expect(results.violations, `${path} axe violations`).toEqual([]);
      } finally {
        await page.close();
      }
    }
  }, TEST_TIMEOUT_MS);

  it("scales representative docs content at mobile widths without page-wide overflow", async () => {
    for (const width of [320, 375]) {
      const page = await context.newPage();
      try {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(new URL("/reference/configuration/", baseUrl).href, {
          waitUntil: "domcontentloaded",
        });
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "200%";
        });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(overflow, `configuration at ${width}px with 200% text`).toBe(false);
      } finally {
        await page.close();
      }
    }
  }, TEST_TIMEOUT_MS);

  it("has no unhandled page errors on representative routes", async () => {
    for (const path of ["/", "/getting-started/", "/reference/configuration/", "/ci/"]) {
      const page = await context.newPage();
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      try {
        await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
        expect(pageErrors, `${path} page errors`).toEqual([]);
      } finally {
        await page.close();
      }
    }
  }, TEST_TIMEOUT_MS);

  it("has no failed asset requests on representative routes", async () => {
    for (const path of ["/", "/getting-started/", "/reference/configuration/", "/ci/"]) {
      const page = await context.newPage();
      const failedAssets: string[] = [];
      page.on("response", (response) => {
        const pathname = new URL(response.url()).pathname;
        if (
          response.status() === 404 &&
          /\.(css|js|svg|png|woff2?|json)$/i.test(pathname) &&
          !pathname.endsWith("/versions.json")
        ) {
          failedAssets.push(pathname);
        }
      });
      try {
        await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);
        expect(failedAssets, `${path} failed assets`).toEqual([]);
      } finally {
        await page.close();
      }
    }
  }, TEST_TIMEOUT_MS);

  it("keeps representative docs pages free of page-wide horizontal overflow", async () => {
    const docsPaths = ["/getting-started/", "/reference/configuration/", "/frameworks/react/"];
    for (const width of RESPONSIVE_WIDTHS) {
      for (const path of docsPaths) {
        const page = await context.newPage();
        try {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(new URL(path, baseUrl).href, { waitUntil: "domcontentloaded" });
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
          );
          expect(overflow, `${path} at ${width}px`).toBe(false);
        } finally {
          await page.close();
        }
      }
    }
  }, TEST_TIMEOUT_MS);

  it("keeps the landing page free of page-wide horizontal overflow on mobile widths", async () => {
    for (const width of [320, 375, 768]) {
      const page = await context.newPage();
      try {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(overflow, `/ at ${width}px`).toBe(false);
      } finally {
        await page.close();
      }
    }
  }, TEST_TIMEOUT_MS);

  it("shows left navigation, search, and right TOC at desktop widths", async () => {
    const page = await context.newPage();
    try {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(new URL("/getting-started/", baseUrl).href, { waitUntil: "domcontentloaded" });
      expect(await page.locator(".md-sidebar--primary").count()).toBeGreaterThan(0);
      expect(await page.locator(".md-sidebar--secondary").count()).toBeGreaterThan(0);
      expect(await page.locator('[data-md-component="search"]').count()).toBeGreaterThan(0);
      await page.setViewportSize({ width: 1920, height: 1080 });
      expect(await page.locator(".md-sidebar--secondary").isVisible()).toBe(true);
    } finally {
      await page.close();
    }
  }, TEST_TIMEOUT_MS);

  it("supports mobile navigation and search without page-wide overflow", async () => {
    for (const width of [320, 375]) {
      const page = await context.newPage();
      try {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(new URL("/getting-started/", baseUrl).href, { waitUntil: "domcontentloaded" });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(overflow, `horizontal overflow at ${width}px`).toBe(false);
        await page.evaluate(() => {
          const drawer = document.querySelector("#__drawer");
          if (drawer instanceof HTMLInputElement) {
            drawer.checked = true;
            drawer.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
        expect(await page.locator(".md-nav--primary").count()).toBeGreaterThan(0);
      } finally {
        await page.close();
      }
    }
  }, TEST_TIMEOUT_MS);
});
