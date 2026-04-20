# Stitch MCP Setup Notes

This kit exposes Stitch through a local stdio MCP server:

```text
Codex / Claude / Cursor
  -> stdio MCP
  -> server/stitch-proxy.mjs
  -> @google/stitch-sdk StitchProxy
  -> Stitch MCP endpoint
```

## Authentication

Use one of these:

### OAuth ADC

Recommended for this kit:

```bash
export GOOGLE_CLOUD_PROJECT="your-google-cloud-project-id"
gcloud auth application-default login
```

The MCP proxy will use Google Application Default Credentials to request an OAuth access token.

### API key

```bash
export STITCH_API_KEY="your-stitch-api-key"
```

## Verify

```bash
npm run verify:stitch
```

Expected result:

```text
Stitch MCP tools available: <number>
- create_project: ...
- generate_screen_from_text: ...
```

Tool names can change. Codex should discover tools before calling them.

## Codex Behavior

When MCP is configured correctly, Codex can use Stitch as a design source:

- Generate new screens from a prompt.
- Retrieve existing project screens.
- Fetch HTML and screenshots.
- Extract design context.

When MCP is not configured, Codex should still create a local HTML preview and continue normal frontend development.
