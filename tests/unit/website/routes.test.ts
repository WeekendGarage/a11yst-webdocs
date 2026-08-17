import { describe, expect, it } from "vitest";
import {
  ensureWebsiteBuilt,
  listBuiltHtmlFiles,
  REQUIRED_WEBSITE_ROUTES,
  routePathFromHtmlFile,
} from "../../helpers/website/build.js";

describe("website routes", () => {
  it("builds all required foundation routes", async () => {
    await ensureWebsiteBuilt();
    const htmlFiles = await listBuiltHtmlFiles();
    const builtRoutes = htmlFiles.map(routePathFromHtmlFile);
    for (const route of REQUIRED_WEBSITE_ROUTES) {
      expect(builtRoutes, `missing route ${route}`).toContain(route);
    }
  });
});
