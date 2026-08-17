import { chromium } from "playwright";
import { describe, expect, it } from "vitest";
import { ensureWebsiteBuilt, startWebsitePreview } from "../../helpers/website/build.js";

const TEST_TIMEOUT_MS = 120_000;

describe.sequential("website JS-disabled home", () => {
  it(
    "keeps essential landing content visible without JavaScript",
    async () => {
      await ensureWebsiteBuilt();
      const preview = await startWebsitePreview();
      const browser = await chromium.launch({ headless: true });
      try {
        const context = await browser.newContext({ javaScriptEnabled: false });
        const page = await context.newPage();
        await page.goto(preview.server.url, { waitUntil: "domcontentloaded" });
        const body = await page.locator("body").innerText();
        expect(body).toContain("Your accessibility analyst.");
        expect(body).toMatch(/Get started|Read the docs/i);
        expect(body).toMatch(/a11yst audit/i);
        expect(await page.locator('a[href*="getting-started"]').count()).toBeGreaterThan(0);
        await context.close();
      } finally {
        await browser.close();
        await preview.stop();
      }
    },
    TEST_TIMEOUT_MS,
  );
});
