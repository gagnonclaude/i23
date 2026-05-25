// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
const platform = process.platform;
const arch = process.arch;

function copyIfExists(src, dest) {
  try {
    if (fs.existsSync(src)) {
      if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`  Copied: ${path.basename(dest)}`);
    }
  } catch (e) {
    console.warn(`  Warning: could not copy ${path.basename(src)}: ${e.message}`);
  }
}

console.log(`postinstall: platform=${platform} arch=${arch}`);

if (platform !== "darwin") {
  console.log("postinstall: skipping darwin-specific bindings (not on macOS)");
  process.exit(0);
}

const root = path.resolve(__dirname, "..");
const nm = path.join(root, "node_modules");

const lcSrc = path.join(nm, `lightningcss-${platform}-${arch}`, `lightningcss.${platform}-${arch}.node`);
const lcDest = path.join(nm, "lightningcss", `lightningcss.${platform}-${arch}.node`);
copyIfExists(lcSrc, lcDest);

const swcSrcDir = path.join(nm, "@swc", `core-${platform}-${arch}`);
const swcDestDir = path.join(nm, "next-intl", "node_modules", "@swc", `core-${platform}-${arch}`);
if (fs.existsSync(swcSrcDir)) {
  if (!fs.existsSync(swcDestDir)) fs.mkdirSync(swcDestDir, { recursive: true });
  for (const file of fs.readdirSync(swcSrcDir)) {
    copyIfExists(path.join(swcSrcDir, file), path.join(swcDestDir, file));
  }
}

console.log("postinstall: done.");
