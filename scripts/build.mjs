import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const mkdocs = join(websiteDir, ".venv", "bin", "mkdocs");

execFileSync("node", ["scripts/ensure-venv.mjs"], {
  cwd: websiteDir,
  stdio: "inherit",
});

execFileSync(mkdocs, ["build", "--strict"], {
  cwd: websiteDir,
  stdio: "inherit",
});
