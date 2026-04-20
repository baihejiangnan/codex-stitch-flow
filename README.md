# Codex Stitch Flow

让 Codex 通过 Stitch MCP 获取 UI 设计、HTML、截图和设计上下文，再把它们落成可维护的前端代码。

实测不推荐这么玩，这么玩会消耗很多的token在一个界面设计上。

## 仓库信息

推荐仓库名：

```text
codex-stitch-flow
```

GitHub 描述：

```text
通过 MCP 连接 Codex 与 Google Stitch：包含 OAuth 配置、本地 HTML 预览、AI UI 生成和浏览器验证的前端工作流。
```

这个仓库是一套可克隆的前端工作流配置，不是普通应用模板。它把我们刚跑通的流程固化下来：

```text
想法
  -> Codex 先生成可打开的 HTML 预览
  -> Stitch / Gemini 生成更高保真的 UI 方向
  -> Codex 通过 MCP 读取 Stitch 设计
  -> Codex 落成真实前端代码
  -> 浏览器截图验证桌面和移动端
```

你也可以把项目地址丢给你的 AI，让你的 AI 帮你完成配置。给 AI 看的完整操作说明在 [README.AI.md](./README.AI.md)。

## 里面有什么

- `skills/stitch-frontend-workflow/SKILL.md`：给 Codex 用的工作流技能。
- `server/stitch-proxy.mjs`：本地 stdio MCP server，代理到 Google Stitch SDK。
- `server/stitch-auth.mjs`：支持 API key、显式 OAuth token、OAuth ADC。
- `server/proxy-env.mjs`：让 Node 读取 `HTTP_PROXY` / `HTTPS_PROXY`，解决 Node fetch 不走系统代理的问题。
- `mcp/`：Codex / Claude / Cursor 配置模板。
- `templates/`：`DESIGN.md`、页面简报、本地 HTML 预览模板。
- `examples/`：可以直接复制给 Codex 的第一次运行提示词。
- `CONTRIBUTORS.md`：记录这个工作流的共同创作者。

## 快速开始

### 1. 安装依赖

```bash
git clone <your-fork-url> codex-stitch-frontend-kit
cd codex-stitch-frontend-kit
npm install
npm run check
```

### 2. 准备 Google Cloud Project

OAuth 方式需要一个 Google Cloud Project。已有项目就直接用；没有可以创建一个：

```powershell
gcloud projects create your-project-id --name="Codex Stitch Frontend Lab"
gcloud config set project your-project-id
```

Project ID 创建后不能改名，建议用小写字母、数字和连字符，例如：

```text
yourname-stitch-lab-0421
```

### 3. 配置 OAuth ADC

安装 Google Cloud CLI 后运行：

```powershell
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform
gcloud auth application-default set-quota-project your-project-id
```

如果浏览器授权失败，可以用无浏览器模式：

```powershell
gcloud auth application-default login --no-browser --scopes=https://www.googleapis.com/auth/cloud-platform
```

它会让你在另一个终端执行 `--remote-bootstrap` 命令，把输出再粘回来。

成功后会生成：

```text
C:\Users\<you>\AppData\Roaming\gcloud\application_default_credentials.json
```

### 4. 验证 Stitch MCP

PowerShell：

```powershell
$env:GOOGLE_CLOUD_PROJECT="your-project-id"
npm run verify:stitch
```

成功时你会看到类似：

```text
Auth mode: oauth-adc
Proxy installed: true
Stitch MCP tools available: 12
```

可用工具通常包括：

```text
create_project
list_projects
generate_screen_from_text
get_screen
list_screens
edit_screens
generate_variants
create_design_system
update_design_system
apply_design_system
```

### 5. 配置 Codex MCP

把下面片段加入 Codex 的 `config.toml`。Windows 常见路径：

```text
C:\Users\<you>\.codex\config.toml
```

```toml
[mcp_servers.stitch]
type = "stdio"
command = "node"
args = ["D:\\path\\to\\codex-stitch-frontend-kit\\server\\stitch-proxy.mjs"]
startup_timeout_sec = 30
tool_timeout_sec = 300

[mcp_servers.stitch.env]
GOOGLE_CLOUD_PROJECT = "your-project-id"
```

如果你的网络需要本地代理，例如 `127.0.0.1:7897`，再加：

```toml
HTTP_PROXY = "http://127.0.0.1:7897"
HTTPS_PROXY = "http://127.0.0.1:7897"
```

然后重启 Codex，让 MCP server 生效。

### 6. 安装 Codex Skill

把 skill 复制到 Codex skills 目录：

```powershell
Copy-Item -Recurse .\skills\stitch-frontend-workflow "$env:USERPROFILE\.codex\skills\"
```

然后对 Codex 说：

```text
使用 stitch-frontend-workflow skill。
帮我做一个中文 AI 工作流控制台页面。
先生成 HTML 预览，再用 Stitch MCP 生成 UI 方向，最后落到当前前端项目里。
```

## 我们实际跑通时踩过的坑

- 普通 `gcloud init` 登录不等于 ADC 登录；MCP 代理需要 `gcloud auth application-default login`。
- 如果报 `cloud-platform scope is required but not consented`，重新用 `--scopes=https://www.googleapis.com/auth/cloud-platform` 登录。
- 如果浏览器登录失败，用 `--no-browser` 和 `--remote-bootstrap`。
- 如果 Node 报 `UND_ERR_CONNECT_TIMEOUT`，多半是 Node 没走系统代理；本仓库已通过 `server/proxy-env.mjs` 读取 `HTTP_PROXY/HTTPS_PROXY`。
- 不要把 `ya29...` access token 发给别人或提交到仓库。

## Codex 使用原则

这个 kit 的 skill 会要求 Codex：

1. 新前端页面先产出本地 HTML 预览，除非用户明确跳过。
2. Stitch MCP 可用时，优先用 Stitch 生成或读取设计方向。
3. Stitch MCP 不可用时，不阻塞，继续做本地预览并说明缺什么。
4. Stitch 导出的 HTML 只能作为设计参考，不能无脑复制进生产代码。
5. 落地工程后必须检查响应式、交互、可访问性和浏览器截图。

## 截图

这里可以放后续截图：

```text
docs/images/
  oauth-login.png
  verify-stitch-tools.png
  codex-stitch-preview.png
```

## 更多文档

- [README.AI.md](./README.AI.md)：给 AI agent 的自主配置说明。
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)：贡献者和协作说明。
- [docs/oauth-adc-setup.md](./docs/oauth-adc-setup.md)：OAuth ADC 细节。
- [docs/setup-stitch-mcp.md](./docs/setup-stitch-mcp.md)：MCP 接入说明。
- [examples/first-run-request.md](./examples/first-run-request.md)：第一次让 Codex 运行的提示词。
