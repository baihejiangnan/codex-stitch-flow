# README For AI Agents

You are helping a user configure Codex + Stitch MCP for frontend UI work.

Goal:

```text
Codex can create a local HTML preview first, use Stitch MCP to generate or read UI screens, then implement production frontend code and verify it in a browser.
```

Work carefully. Do not ask the user to copy files manually when you can update local files yourself.

## Expected Repo

You are inside or near:

```text
codex-stitch-frontend-kit/
```

Important files:

```text
package.json
server/stitch-proxy.mjs
server/stitch-auth.mjs
server/proxy-env.mjs
scripts/verify-stitch.mjs
scripts/setup-oauth.ps1
skills/stitch-frontend-workflow/SKILL.md
mcp/codex-config.toml.snippet
```

## Setup Plan

1. Inspect the repo.
2. Run `npm install` if `node_modules` is missing.
3. Run `npm run check`.
4. Check whether `gcloud` exists.
5. Ensure the user has a Google Cloud Project ID.
6. Configure OAuth ADC.
7. Verify Stitch tools with `npm run verify:stitch`.
8. Install the Codex skill.
9. Add the Stitch MCP server to Codex config.
10. Tell the user to restart Codex.

## Commands

### Install and Check

PowerShell:

```powershell
cd D:\path\to\codex-stitch-frontend-kit
npm install
npm run check
```

### Locate gcloud

Try:

```powershell
Get-Command gcloud -ErrorAction SilentlyContinue
```

If not found, search common paths:

```powershell
Get-ChildItem -Path "C:\Program Files","C:\Program Files (x86)","D:\" -Recurse -Filter gcloud.cmd -ErrorAction SilentlyContinue | Select-Object -First 10 FullName
```

Use the absolute `gcloud.cmd` path if PATH is not refreshed.

### Create or Set Project

Never invent a project ID silently. If the user asks you to pick one, choose a valid lowercase id such as:

```text
<username>-stitch-lab-0421
```

Then run:

```powershell
gcloud projects create <project-id> --name="Codex Stitch Frontend Lab"
gcloud config set project <project-id>
```

If project creation fails because the ID is taken, choose another and retry.

### OAuth ADC

Preferred:

```powershell
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform
gcloud auth application-default set-quota-project <project-id>
```

Fallback if browser auth fails:

```powershell
gcloud auth application-default login --no-browser --scopes=https://www.googleapis.com/auth/cloud-platform
```

Explain the remote bootstrap flow:

```text
Old terminal waits for output.
New terminal runs the generated --remote-bootstrap command.
Browser opens and completes auth.
New terminal prints a localhost URL.
Paste that URL back into the old terminal.
```

Do not ask the user to paste access tokens into chat. If they accidentally paste a `ya29...` token, warn that it is sensitive.

### Verify ADC

```powershell
gcloud auth application-default print-access-token
```

Do not print the token back to the user.

### Verify Stitch

```powershell
$env:GOOGLE_CLOUD_PROJECT="<project-id>"
npm run verify:stitch
```

Success should look like:

```text
Auth mode: oauth-adc
Proxy installed: true
Stitch MCP tools available: 12
```

If this fails with `UND_ERR_CONNECT_TIMEOUT`, inspect proxy settings:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -match 'proxy|PROXY' }
Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' | Select-Object ProxyEnable,ProxyServer,AutoConfigURL
```

If a proxy exists, ensure `HTTP_PROXY` and `HTTPS_PROXY` are available to the MCP server config.

## Install Codex Skill

Windows:

```powershell
$target = "$env:USERPROFILE\.codex\skills\stitch-frontend-workflow"
if (Test-Path $target) { Remove-Item -Recurse -Force -LiteralPath $target }
Copy-Item -Recurse -LiteralPath ".\skills\stitch-frontend-workflow" -Destination $target
```

## Configure Codex MCP

Codex config is commonly:

```text
C:\Users\<user>\.codex\config.toml
```

Append this, adapting paths and project id:

```toml
[mcp_servers.stitch]
type = "stdio"
command = "node"
args = ["D:\\path\\to\\codex-stitch-frontend-kit\\server\\stitch-proxy.mjs"]
startup_timeout_sec = 30
tool_timeout_sec = 300

[mcp_servers.stitch.env]
GOOGLE_CLOUD_PROJECT = "<project-id>"
```

If the machine uses a local proxy:

```toml
HTTP_PROXY = "http://127.0.0.1:7897"
HTTPS_PROXY = "http://127.0.0.1:7897"
```

Do not overwrite existing MCP servers. Append only the `stitch` block if it does not already exist. If it exists, update it carefully.

## Final Verification

Run:

```powershell
npm run check
$env:GOOGLE_CLOUD_PROJECT="<project-id>"
npm run verify:stitch
```

Then tell the user:

- Stitch OAuth ADC is configured.
- Stitch MCP tools are visible.
- Codex skill is installed.
- Codex config was updated.
- Codex must be restarted to load the new MCP server.

## First User Prompt After Restart

Give the user this:

```text
使用 stitch-frontend-workflow skill。
通过 Stitch MCP 创建一个中文 AI 工作流页面设计。
先生成本地 HTML 预览，再让 Stitch 生成 UI 方向，最后把选定方向落到当前前端项目并做浏览器截图验证。
```

## Safety

- Never commit real API keys, OAuth tokens, ADC files, or `ya29...` access tokens.
- Never display access tokens in final responses.
- Do not delete existing user Codex config.
- Do not block frontend work if Stitch MCP fails; fall back to local HTML preview.
