import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const mkdocs = join(websiteDir, ".venv", "bin", "mkdocs");
const port = process.env.WEBSITE_PORT ?? "8000";

execFileSync(mkdocs, ["serve", "--dev-addr", `127.0.0.1:${port}`], {
  cwd: websiteDir,
  stdio: "inherit",
});
