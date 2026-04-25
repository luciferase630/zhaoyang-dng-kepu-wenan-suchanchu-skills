# 朝阳不吐不快 dng 科普文案速产出 Skills

## 中文版

### 快速开始

这个仓库现在同时支持 Codex、Claude Code、Kimi Code 和通用 Agent Skills 目录约定。下载后可以直接把三套 skills 暴露给不同 coding agents：

- Codex：使用 plugin marketplace。
- Claude Code：读取 `.claude/skills`。
- Kimi Code 和其他兼容 agents：读取 `.agents/skills`，也可以读取 `.claude/skills`。
- npm / npx：提供 `zhaoyang-install-skills`、`zhaoyang-canvas`、`zhaoyang-doctor`、`zhaoyang-validate` 命令。

推荐的 npm 下载流程：

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
npx zhaoyang-install-skills all --force
npx zhaoyang-doctor
```

需要实时 Excalidraw 画布时，再开一个终端启动 canvas：

```bash
npx zhaoyang-canvas start
```

首次运行 `zhaoyang-canvas start` 会把 `mcp-excalidraw-server@1.0.6` 安装到当前项目的 `.zhaoyang-canvas/runtime` 缓存目录。之后在浏览器打开 `http://127.0.0.1:3000`。Codex plugin 的 `.mcp.json` 默认使用 `npx mcp-excalidraw-server@1.0.6` 启动 MCP server，不要求 Docker。

### 前置条件

- Node.js 18 或更高版本。仓库附带 `.node-version`，开发时推荐 Node 22。
- 至少一个支持 skills 的 coding agent：Codex、Claude Code、Kimi Code，或兼容 `SKILL.md` 目录约定的 agent。
- Excalidraw 实时画布需要本地 canvas server。默认地址是 `http://127.0.0.1:3000`。
- Docker 只是可选 fallback，不是默认路径。

### 这个仓库包含什么

三个 skills：

- `$zhaoyang-explainer-scriptwriter`：起草、改写和结构化完整中文科普视频口播稿。
- `$zhaoyang-excalidraw-explainer`：设计“朝阳不吐不快”风格的 Excalidraw 教学板、知识图和视频讲解画布。
- `$zhaoyang-excalidraw-toolkit`：通过 Excalidraw MCP 工具或本地 canvas REST API 操作画布。

三套入口：

- `plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills`：Codex plugin 使用的 canonical skills。
- `.claude/skills`：Claude Code 项目级 skills。
- `.agents/skills`：Kimi Code 和通用 Agent Skills 目录。

`package.json` 的包名是 `zhaoyang-dng-kepu-wenan-suchanchu-skills`，Codex plugin 名是 `zhaoyang-dng-kepu-wenan-suchanchu`。包名带 `-skills` 后缀用于表示这是分发仓库，plugin 名保持更短。

### 安装方式

#### 推荐方式 A：Codex plugin marketplace

```bash
codex plugin marketplace add luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills --ref main
```

安装后重启 Codex，然后在 Plugin Directory 中启用 `朝阳不吐不快 dng 科普文案速产出`。

本地 clone 后也可以注册本地路径：

```bash
codex plugin marketplace add <path-to-local-clone>
```

#### 推荐方式 B：Claude Code / Kimi Code 项目级 skills

clone 仓库后，在仓库根目录启动 Claude Code 或 Kimi Code。仓库已经内置：

```text
.claude/skills
.agents/skills
```

如果希望把 skills 安装到用户级目录：

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
npx zhaoyang-install-skills claude --force
npx zhaoyang-install-skills kimi --force
```

也可以一次安装到 Claude、Kimi、通用 agents 和 Codex 的默认 skills 目录：

```bash
npx zhaoyang-install-skills all --force
```

安装后重启对应 coding agent。

#### 备选方式：只安装单个 skill

如果只需要其中一个 skill，可以使用 Codex 的 `$skill-installer`：

```text
Use $skill-installer to install from GitHub repo luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills with path plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills/zhaoyang-explainer-scriptwriter
```

```text
Use $skill-installer to install from GitHub repo luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills with path plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills/zhaoyang-excalidraw-explainer
```

```text
Use $skill-installer to install from GitHub repo luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills with path plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills/zhaoyang-excalidraw-toolkit
```

#### npm 下载后注册到 Codex

npm 只下载文件，不会自动启用 Codex plugin。下载后可以注册 `node_modules` 中的插件路径：

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
codex plugin marketplace add ./node_modules/zhaoyang-dng-kepu-wenan-suchanchu-skills
```

### Excalidraw 与 MCP 运行环境

脚本写作 skill 不依赖 Excalidraw。实时绘图、画布检查、导入导出等工作流需要 Excalidraw runtime。

默认 Node/npm 路径：

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
npx zhaoyang-canvas start
```

`zhaoyang-canvas start` 会在首次运行时自动下载 runtime 到 `.zhaoyang-canvas/runtime`。这个目录是本地缓存，不需要提交到 Git。

默认 MCP 配置在：

```text
plugins/zhaoyang-dng-kepu-wenan-suchanchu/.mcp.json
```

它使用：

```text
npx -y mcp-excalidraw-server@1.0.6
```

并连接到：

```text
EXPRESS_SERVER_URL=http://127.0.0.1:3000
ENABLE_CANVAS_SYNC=true
```

Docker fallback 模板保留在：

```text
plugins/zhaoyang-dng-kepu-wenan-suchanchu/.mcp.docker.json
```

需要 Docker 时再手动使用该模板。

### 常用命令

```bash
npx zhaoyang-doctor
npx zhaoyang-canvas start
npx zhaoyang-canvas start --detached
npx zhaoyang-canvas status
npx zhaoyang-canvas stop
npx zhaoyang-install-skills all --force
npx zhaoyang-validate
```

### 使用示例

起草完整口播稿：

```text
Use $zhaoyang-explainer-scriptwriter to write a Chinese explainer video script about AI token economics.
```

设计 Excalidraw 教学板：

```text
Use $zhaoyang-excalidraw-explainer to turn this topic into a clear Excalidraw explainer canvas: 为什么普通人容易误解货币政策？
```

脚本和画布联动：

```text
Use $zhaoyang-explainer-scriptwriter and $zhaoyang-excalidraw-explainer to create a script plus canvas hooks for this topic: 新能源车价格战到底在争什么？
```

直接操作实时画布：

```text
Use $zhaoyang-excalidraw-toolkit to inspect the current Excalidraw canvas, fix overlapping labels, and export a PNG.
```

### 排错

#### npm 下载后 Codex 没有出现 plugin

npm 不会自动注册 Codex plugin。执行：

```bash
codex plugin marketplace add ./node_modules/zhaoyang-dng-kepu-wenan-suchanchu-skills
```

然后重启 Codex。

#### Excalidraw canvas 连不上

先启动 canvas：

```bash
npx zhaoyang-canvas start
```

再检查：

```bash
npx zhaoyang-canvas status
npx zhaoyang-doctor
```

#### Windows 里 inline JSON 参数报错

不要在 Windows 终端里依赖 `--data '<json>'`。推荐写入 JSON 文件，再使用 `--file`：

```bash
node scripts/create-element.cjs --file element.json
node scripts/update-element.cjs --id <id> --file updates.json
```

#### 清空画布有风险

`clear-canvas.cjs` 默认会要求确认。自动化场景必须显式传：

```bash
node scripts/clear-canvas.cjs --force
```

#### Docker 相关提示

Docker 不是默认路径。只有在你选择 `.mcp.docker.json` 或运行 `npm run excalidraw:canvas:docker` 时才需要 Docker。

### 开发与发布

维护者文档见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### 参考链接

- [OpenAI Codex Skills](https://developers.openai.com/codex/skills/)
- [OpenAI Codex Build Plugins](https://developers.openai.com/codex/plugins/build/)
- [openai/skills](https://github.com/openai/skills)
- [Agent Skills specification](https://agentskills.io/specification)
- [yctimlin/mcp_excalidraw](https://github.com/yctimlin/mcp_excalidraw)
- [mcp-excalidraw-server on npm](https://www.npmjs.com/package/mcp-excalidraw-server)
- [npm package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### 许可证

MIT

## English Version

### Quick Start

This repository now supports Codex, Claude Code, Kimi Code, and generic Agent Skills directory conventions. After downloading it, the three skills can be exposed to different coding agents:

- Codex: use the plugin marketplace.
- Claude Code: read `.claude/skills`.
- Kimi Code and compatible agents: read `.agents/skills`; they can also read `.claude/skills`.
- npm / npx: use `zhaoyang-install-skills`, `zhaoyang-canvas`, `zhaoyang-doctor`, and `zhaoyang-validate`.

Recommended npm download flow:

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
npx zhaoyang-install-skills all --force
npx zhaoyang-doctor
```

When you need a live Excalidraw canvas, start the canvas in another terminal:

```bash
npx zhaoyang-canvas start
```

On first run, `zhaoyang-canvas start` installs `mcp-excalidraw-server@1.0.6` into the current project's `.zhaoyang-canvas/runtime` cache directory. Then open `http://127.0.0.1:3000` in a browser. The Codex plugin `.mcp.json` uses `npx mcp-excalidraw-server@1.0.6` by default and does not require Docker.

### Prerequisites

- Node.js 18 or newer. The repository includes `.node-version`; Node 22 is recommended for development.
- At least one coding agent that supports skills: Codex, Claude Code, Kimi Code, or another agent compatible with the `SKILL.md` directory convention.
- Live Excalidraw workflows require a local canvas server. The default URL is `http://127.0.0.1:3000`.
- Docker is an optional fallback only.

### What Is Included

Three skills:

- `$zhaoyang-explainer-scriptwriter`: draft, rewrite, and structure complete Chinese explainer-video scripts.
- `$zhaoyang-excalidraw-explainer`: design Zhaoyang-style Excalidraw teaching boards, knowledge maps, and video-explainer canvases.
- `$zhaoyang-excalidraw-toolkit`: operate Excalidraw through MCP tools or the local canvas REST API.

Three entrypoints:

- `plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills`: canonical skills used by the Codex plugin.
- `.claude/skills`: project-level skills for Claude Code.
- `.agents/skills`: project-level skills for Kimi Code and generic Agent Skills users.

The package name is `zhaoyang-dng-kepu-wenan-suchanchu-skills`; the Codex plugin name is `zhaoyang-dng-kepu-wenan-suchanchu`. The package name keeps the `-skills` suffix to make it clear that this is the distribution repository.

### Install

#### Recommended A: Codex plugin marketplace

```bash
codex plugin marketplace add luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills --ref main
```

Restart Codex after installation, then enable `朝阳不吐不快 dng 科普文案速产出` in the Plugin Directory.

For a local clone:

```bash
codex plugin marketplace add <path-to-local-clone>
```

#### Recommended B: Claude Code / Kimi Code project skills

After cloning the repository, start Claude Code or Kimi Code from the repository root. The repository already includes:

```text
.claude/skills
.agents/skills
```

To install the skills into user-level agent directories:

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
npx zhaoyang-install-skills claude --force
npx zhaoyang-install-skills kimi --force
```

Or install them into Claude, Kimi, generic agents, and Codex skill directories at once:

```bash
npx zhaoyang-install-skills all --force
```

Restart the target coding agent after installation.

#### Alternative: install one skill only

Use Codex `$skill-installer` if you only want one skill:

```text
Use $skill-installer to install from GitHub repo luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills with path plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills/zhaoyang-explainer-scriptwriter
```

```text
Use $skill-installer to install from GitHub repo luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills with path plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills/zhaoyang-excalidraw-explainer
```

```text
Use $skill-installer to install from GitHub repo luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills with path plugins/zhaoyang-dng-kepu-wenan-suchanchu/skills/zhaoyang-excalidraw-toolkit
```

#### Register Codex after npm download

npm only downloads files. It does not activate the Codex plugin. Register the package path after installation:

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
codex plugin marketplace add ./node_modules/zhaoyang-dng-kepu-wenan-suchanchu-skills
```

### Excalidraw And MCP Runtime

The scriptwriting skill does not require Excalidraw. Live drawing, canvas inspection, import, and export workflows require an Excalidraw runtime.

Default Node/npm path:

```bash
npm install https://github.com/luciferase630/zhaoyang-dng-kepu-wenan-suchanchu-skills/archive/refs/heads/main.tar.gz
npx zhaoyang-canvas start
```

`zhaoyang-canvas start` downloads the runtime into `.zhaoyang-canvas/runtime` on first use. This is a local cache directory and should not be committed to Git.

The default MCP config is:

```text
plugins/zhaoyang-dng-kepu-wenan-suchanchu/.mcp.json
```

It uses:

```text
npx -y mcp-excalidraw-server@1.0.6
```

and connects to:

```text
EXPRESS_SERVER_URL=http://127.0.0.1:3000
ENABLE_CANVAS_SYNC=true
```

The Docker fallback template is:

```text
plugins/zhaoyang-dng-kepu-wenan-suchanchu/.mcp.docker.json
```

Use it manually only when Docker is the desired runtime.

### Commands

```bash
npx zhaoyang-doctor
npx zhaoyang-canvas start
npx zhaoyang-canvas start --detached
npx zhaoyang-canvas status
npx zhaoyang-canvas stop
npx zhaoyang-install-skills all --force
npx zhaoyang-validate
```

### Usage Examples

Draft a complete script:

```text
Use $zhaoyang-explainer-scriptwriter to write a Chinese explainer video script about AI token economics.
```

Design an Excalidraw teaching board:

```text
Use $zhaoyang-excalidraw-explainer to turn this topic into a clear Excalidraw explainer canvas: 为什么普通人容易误解货币政策？
```

Use script plus canvas together:

```text
Use $zhaoyang-explainer-scriptwriter and $zhaoyang-excalidraw-explainer to create a script plus canvas hooks for this topic: 新能源车价格战到底在争什么？
```

Operate the live canvas directly:

```text
Use $zhaoyang-excalidraw-toolkit to inspect the current Excalidraw canvas, fix overlapping labels, and export a PNG.
```

### Troubleshooting

#### npm download does not show a Codex plugin

npm does not activate Codex plugins. Run:

```bash
codex plugin marketplace add ./node_modules/zhaoyang-dng-kepu-wenan-suchanchu-skills
```

Then restart Codex.

#### Excalidraw canvas is not reachable

Start the canvas:

```bash
npx zhaoyang-canvas start
```

Then check:

```bash
npx zhaoyang-canvas status
npx zhaoyang-doctor
```

#### Inline JSON fails on Windows shells

Do not rely on `--data '<json>'` in Windows terminals. Prefer JSON files and `--file`:

```bash
node scripts/create-element.cjs --file element.json
node scripts/update-element.cjs --id <id> --file updates.json
```

#### Clearing the canvas is destructive

`clear-canvas.cjs` asks for confirmation by default. Automation must pass:

```bash
node scripts/clear-canvas.cjs --force
```

#### Docker messages

Docker is not the default path. Docker is needed only when you choose `.mcp.docker.json` or run `npm run excalidraw:canvas:docker`.

### Development And Publishing

Maintainer notes live in [CONTRIBUTING.md](CONTRIBUTING.md).

### References

- [OpenAI Codex Skills](https://developers.openai.com/codex/skills/)
- [OpenAI Codex Build Plugins](https://developers.openai.com/codex/plugins/build/)
- [openai/skills](https://github.com/openai/skills)
- [Agent Skills specification](https://agentskills.io/specification)
- [yctimlin/mcp_excalidraw](https://github.com/yctimlin/mcp_excalidraw)
- [mcp-excalidraw-server on npm](https://www.npmjs.com/package/mcp-excalidraw-server)
- [npm package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)

### License

MIT
