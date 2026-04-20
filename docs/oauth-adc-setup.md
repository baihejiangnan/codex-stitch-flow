# OAuth ADC Setup

This kit supports OAuth through Google Application Default Credentials.

The MCP server reads:

```text
GOOGLE_CLOUD_PROJECT
```

Then it uses `google-auth-library` to load local Application Default Credentials and request a short-lived OAuth access token.

## 1. Install Google Cloud CLI

Install `gcloud` from:

```text
https://cloud.google.com/sdk/docs/install
```

After installation, open a new terminal and confirm:

```bash
gcloud --version
```

## 2. Authenticate

PowerShell:

```powershell
cd D:\frontxuan\codex-stitch-frontend-kit
.\scripts\setup-oauth.ps1 -ProjectId "your-google-cloud-project-id"
```

Manual equivalent:

```bash
gcloud config set project your-google-cloud-project-id
gcloud auth application-default set-quota-project your-google-cloud-project-id
gcloud auth application-default login
```

If Stitch requires the Stitch API to be enabled for your project, enable it in Google Cloud Console or with the relevant `gcloud services enable` command for your environment.

## 3. Verify

PowerShell:

```powershell
$env:GOOGLE_CLOUD_PROJECT="your-google-cloud-project-id"
npm run verify:stitch
```

Expected:

```text
Auth mode: oauth-adc
Stitch MCP tools available: <number>
```

## 4. Configure Codex MCP

Use `mcp/codex-mcp.example.json` and set:

```json
{
  "env": {
    "GOOGLE_CLOUD_PROJECT": "your-google-cloud-project-id"
  }
}
```

The local ADC file created by `gcloud auth application-default login` is used automatically by `server/stitch-proxy.mjs`.

## Token Refresh Note

The MCP server resolves an OAuth access token when it starts. If a long-running MCP session eventually receives an auth failure, restart the MCP host so the proxy can request a fresh token from ADC.
