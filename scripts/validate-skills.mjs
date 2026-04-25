#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginName = "zhaoyang-dng-kepu-wenan-suchanchu";
const pluginDir = path.join(root, "plugins", pluginName);
const skillDir = path.join(pluginDir, "skills");
const agentSkillMirrorDirs = [
  path.join(root, ".claude", "skills"),
  path.join(root, ".agents", "skills"),
];
const skillNames = [
  "zhaoyang-excalidraw-explainer",
  "zhaoyang-explainer-scriptwriter",
  "zhaoyang-excalidraw-toolkit"
];

function fail(message) {
  console.error(`validate-skills: ${message}`);
  process.exitCode = 1;
}

function readUtf8(file) {
  const buffer = fs.readFileSync(file);
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    fail(`${file} has a UTF-8 BOM; save it as UTF-8 without BOM.`);
  }
  const text = buffer.toString("utf8");
  if (text.includes("\r\n")) {
    fail(`${file} contains CRLF line endings; use LF.`);
  }
  return text;
}

function assertPathExists(file) {
  if (!fs.existsSync(file)) {
    fail(`missing path: ${file}`);
  }
}

function parseSkillFrontmatter(text, file) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    fail(`${file} is missing YAML frontmatter.`);
    return {};
  }
  if (/^description:\s*[>|]/m.test(match[1])) {
    fail(`${file} must keep frontmatter description on one line; multiline YAML is not supported.`);
  }
  const result = {};
  for (const line of match[1].split("\n")) {
    const pair = line.match(/^([a-z_]+):\s*(.*)$/);
    if (pair) {
      result[pair[1]] = pair[2].replace(/^['"]|['"]$/g, "");
    }
  }
  return result;
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const nested of listFiles(full)) out.push(path.join(entry.name, nested));
    } else if (entry.isFile()) {
      out.push(entry.name);
    }
  }
  return out.sort();
}

function assertMirroredSkill(canonicalDir, mirrorDir, skillName) {
  assertPathExists(mirrorDir);
  const canonicalFiles = listFiles(canonicalDir);
  const mirrorFiles = listFiles(mirrorDir);
  if (canonicalFiles.join("\n") !== mirrorFiles.join("\n")) {
    fail(`${mirrorDir} must mirror ${canonicalDir}; run npm run sync:agent-skills.`);
    return;
  }
  for (const rel of canonicalFiles) {
    const canonicalText = readUtf8(path.join(canonicalDir, rel));
    const mirrorText = readUtf8(path.join(mirrorDir, rel));
    if (canonicalText !== mirrorText) {
      fail(`${path.join(mirrorDir, rel)} differs from canonical ${skillName}; run npm run sync:agent-skills.`);
    }
  }
}

for (const skillName of skillNames) {
  const dir = path.join(skillDir, skillName);
  const skillMd = path.join(dir, "SKILL.md");
  const openaiYaml = path.join(dir, "agents", "openai.yaml");
  const referencesDir = path.join(dir, "references");

  assertPathExists(skillMd);
  assertPathExists(openaiYaml);
  assertPathExists(referencesDir);

  const skillText = readUtf8(skillMd);
  const metadata = parseSkillFrontmatter(skillText, skillMd);

  if (metadata.name !== skillName) {
    fail(`${skillMd} frontmatter name must be ${skillName}, got ${metadata.name ?? "<missing>"}.`);
  }
  if (!metadata.description || metadata.description.length < 40) {
    fail(`${skillMd} must include a useful description.`);
  }
  if (!/^[a-z0-9-]+$/.test(skillName)) {
    fail(`${skillName} must be lowercase kebab-case.`);
  }

  const openaiText = readUtf8(openaiYaml);
  if (!openaiText.includes(`$${skillName}`)) {
    fail(`${openaiYaml} default_prompt should mention $${skillName}.`);
  }
  if (openaiText.includes("$chaoyang-") || skillText.includes("chaoyang-")) {
    fail(`${skillName} still contains old chaoyang skill references.`);
  }

  for (const mirrorRoot of agentSkillMirrorDirs) {
    assertMirroredSkill(dir, path.join(mirrorRoot, skillName), skillName);
  }
}

const pluginJsonPath = path.join(pluginDir, ".codex-plugin", "plugin.json");
const mcpJsonPath = path.join(pluginDir, ".mcp.json");
const mcpDockerJsonPath = path.join(pluginDir, ".mcp.docker.json");
const marketplacePath = path.join(root, ".agents", "plugins", "marketplace.json");
const packageJsonPath = path.join(root, "package.json");
const readmePath = path.join(root, "README.md");
const thirdPartyPath = path.join(root, "THIRD_PARTY_NOTICES.md");
const contributingPath = path.join(root, "CONTRIBUTING.md");

for (const file of [pluginJsonPath, mcpJsonPath, mcpDockerJsonPath, marketplacePath, packageJsonPath]) {
  assertPathExists(file);
  JSON.parse(readUtf8(file));
}
assertPathExists(readmePath);
assertPathExists(thirdPartyPath);
assertPathExists(contributingPath);
readUtf8(readmePath);
readUtf8(thirdPartyPath);
readUtf8(contributingPath);

const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, "utf8"));
if (pluginJson.name !== pluginName) {
  fail(`plugin.json name must be ${pluginName}.`);
}
if (pluginJson.skills !== "./skills/") {
  fail('plugin.json skills must be "./skills/".');
}
if (pluginJson.mcpServers !== "./.mcp.json") {
  fail('plugin.json mcpServers must be "./.mcp.json".');
}

const mcpJson = JSON.parse(fs.readFileSync(mcpJsonPath, "utf8"));
if (!mcpJson.mcpServers?.excalidraw) {
  fail("plugin .mcp.json must define mcpServers.excalidraw.");
} else {
  const server = mcpJson.mcpServers.excalidraw;
  if (server.command !== "npx" || !server.args?.includes("mcp-excalidraw-server@1.0.6")) {
    fail('plugin .mcp.json must use npx mcp-excalidraw-server@1.0.6 as the default no-Docker MCP path.');
  }
  if (server.env?.EXPRESS_SERVER_URL !== "http://127.0.0.1:3000") {
    fail("plugin .mcp.json must point EXPRESS_SERVER_URL at http://127.0.0.1:3000.");
  }
}

const marketplace = JSON.parse(fs.readFileSync(marketplacePath, "utf8"));
const entry = marketplace.plugins?.find((item) => item.name === pluginName);
if (!entry) {
  fail(`marketplace.json must include ${pluginName}.`);
} else {
  const expectedPath = `./plugins/${pluginName}`;
  if (entry.source?.source !== "local" || entry.source?.path !== expectedPath) {
    fail(`marketplace source must be local ${expectedPath}.`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
for (const scriptName of [
  "validate",
  "sync:agent-skills",
  "excalidraw:doctor",
  "excalidraw:canvas:start",
  "excalidraw:canvas:stop",
  "excalidraw:canvas:status",
  "excalidraw:canvas:docker"
]) {
  if (!packageJson.scripts?.[scriptName]) {
    fail(`package.json must define script ${scriptName}.`);
  }
}
for (const binName of ["zhaoyang-validate", "zhaoyang-doctor", "zhaoyang-canvas", "zhaoyang-install-skills"]) {
  if (!packageJson.bin?.[binName]) {
    fail(`package.json must define bin ${binName}.`);
  }
}
const publicTextFiles = [
  readmePath,
  thirdPartyPath,
  contributingPath,
  path.join(skillDir, "zhaoyang-explainer-scriptwriter", "references", "corpus-notes.md"),
  packageJsonPath,
  pluginJsonPath,
  mcpJsonPath,
  mcpDockerJsonPath,
  marketplacePath,
  path.join(root, "LICENSE")
];
const driveLetterPathPattern = /[A-Za-z]:\\/;
const personalEmailPattern = /[0-9]{5,}@(?:q{2}|163|126|gmail|outlook)\.com/i;
const userHomePattern = /Users[\\/][^\\/\s]+/i;
const windowsUserPattern = /[A-Za-z]:\\Users\\[^\\\s]+/i;
for (const file of publicTextFiles) {
  const text = readUtf8(file);
  if (driveLetterPathPattern.test(text)) fail(`${file} contains a drive-letter absolute path.`);
  if (personalEmailPattern.test(text)) fail(`${file} contains a personal email domain.`);
  if (userHomePattern.test(text)) fail(`${file} contains a user-home path.`);
  if (windowsUserPattern.test(text)) fail(`${file} contains a Windows user-home path.`);
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("validate-skills: ok");
