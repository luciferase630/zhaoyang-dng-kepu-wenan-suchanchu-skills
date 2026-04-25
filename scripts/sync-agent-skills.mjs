#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalSkillsDir = path.join(root, "plugins", "zhaoyang-dng-kepu-wenan-suchanchu", "skills");
const mirrorRoots = [
  path.join(root, ".claude", "skills"),
  path.join(root, ".agents", "skills"),
];

function copyDir(from, to) {
  fs.rmSync(to, { recursive: true, force: true });
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(source, target);
    else if (entry.isFile()) fs.copyFileSync(source, target);
  }
}

for (const mirrorRoot of mirrorRoots) {
  fs.mkdirSync(mirrorRoot, { recursive: true });
  for (const entry of fs.readdirSync(canonicalSkillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    copyDir(path.join(canonicalSkillsDir, entry.name), path.join(mirrorRoot, entry.name));
    console.log(`synced ${entry.name} -> ${path.relative(root, mirrorRoot)}`);
  }
}
