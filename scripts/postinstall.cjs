#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const LINKS = [
  { source: path.join("dist", "skills"), target: path.join(".claude", "skills") },
  { source: path.join("dist", "agents"), target: path.join(".claude", "agents") },
];

function findProjectRoot(startDir) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "package.json")) && !dir.includes("node_modules")) return dir;
    dir = path.dirname(dir);
  }
  return null;
}

function createLink(src, tgt) {
  if (fs.existsSync(tgt)) {
    const stat = fs.lstatSync(tgt);
    if (stat.isSymbolicLink()) {
      if (path.resolve(fs.readlinkSync(tgt)) === path.resolve(src)) {
        console.log(`  ✓ ${tgt} (already linked)`);
        return;
      }
      fs.unlinkSync(tgt);
    } else {
      console.log(`  ⚠ ${tgt} exists and is not a symlink — skipped`);
      return;
    }
  }
  fs.mkdirSync(path.dirname(tgt), { recursive: true });
  if (process.platform === "win32") fs.symlinkSync(src, tgt, "junction");
  else fs.symlinkSync(path.relative(path.dirname(tgt), src), tgt);
  console.log(`  ✓ ${tgt} → ${src}`);
}

function main() {
  const pkgDir = __dirname.replace(/[\\/]scripts$/, "");
  const root = findProjectRoot(path.resolve(pkgDir, "..", "..", ".."));
  if (!root || path.resolve(root) === path.resolve(pkgDir)) return;

  console.log(`\n🔗 cosmos: linking to ${root}\n`);
  for (const l of LINKS) {
    const src = path.resolve(pkgDir, l.source);
    if (!fs.existsSync(src)) continue;
    createLink(src, path.resolve(root, l.target));
  }
  console.log("\n✅ cosmos: setup complete\n");
}

main();
