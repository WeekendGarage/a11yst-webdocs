import { describe, expect, it } from "vitest";
import {
  classifyWebsiteRoute,
  countRoutesByFamily,
  ensureWebsiteBuilt,
  listBuiltHtmlFiles,
  REQUIRED_WEBSITE_ROUTES,
  routePathFromHtmlFile,
} from "../../helpers/website/build.js";

describe("website route inventory", () => {
  it("builds the full public route set", async () => {
    await ensureWebsiteBuilt();
    const builtRoutes = (await listBuiltHtmlFiles()).map(routePathFromHtmlFile);
    expect(builtRoutes).toHaveLength(REQUIRED_WEBSITE_ROUTES.length);
    for (const route of REQUIRED_WEBSITE_ROUTES) {
      expect(builtRoutes, route).toContain(route);
    }
  });

  it("classifies routes into documentation families", async () => {
    await ensureWebsiteBuilt();
    const counts = await countRoutesByFamily();
    expect(counts.HOME).toBe(1);
    expect(counts.GETTING_STARTED).toBe(1);
    expect(counts.CORE_CONCEPTS).toBe(2);
    expect(counts.REGRESSION).toBe(6);
    expect(counts.REPORTS).toBe(1);
    expect(counts.SOURCE_INTELLIGENCE).toBe(4);
    expect(counts.FRAMEWORKS).toBe(7);
    expect(counts.CI).toBe(1);
    expect(counts.REFERENCE).toBe(6);
    expect(counts.COMMUNITY).toBe(3);
    expect(counts.TROUBLESHOOTING).toBe(1);
    expect(classifyWebsiteRoute("/reference/cli/")).toBe("REFERENCE");
    expect(classifyWebsiteRoute("/core-concepts/route-discovery-and-planning/")).toBe(
      "CORE_CONCEPTS",
    );
  });
});
