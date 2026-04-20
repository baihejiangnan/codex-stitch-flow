#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StitchProxy } from "@google/stitch-sdk";
import { installProxyFromEnv } from "./proxy-env.mjs";
import { resolveStitchAuth } from "./stitch-auth.mjs";

async function main() {
  installProxyFromEnv();

  const { config } = await resolveStitchAuth();
  const proxy = new StitchProxy(config);

  const transport = new StdioServerTransport();
  await proxy.start(transport);
}

main().catch((error) => {
  console.error("Failed to start Stitch MCP proxy.");
  console.error(error);
  process.exit(1);
});
