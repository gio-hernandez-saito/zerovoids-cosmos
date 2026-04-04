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

function main() {
  const pkgDir = __dirname.replace(/[\\/]scripts$/, "");
  const root = findProjectRoot(path.resolve(pkgDir, "..", "..", ".."));
  if (!root || path.resolve(root) === path.resolve(pkgDir)) return;

  console.log(`\n🧹 cosmos: cleaning up from ${root}\n`);
  for (const l of LINKS) {
    const src = path.resolve(pkgDir, l.source);
    const tgt = path.resolve(root, l.target);
    if (!fs.existsSync(tgt)) continue;
    const stat = fs.lstatSync(tgt);
    if (!stat.isSymbolicLink()) continue;
    if (path.resolve(fs.readlinkSync(tgt)) === path.resolve(src)) {
      fs.unlinkSync(tgt);
      console.log(`  ✓ removed ${tgt}`);
    }
  }
  console.log("\n✅ cosmos: cleanup complete\n");
}

main();
