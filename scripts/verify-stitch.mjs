#!/usr/bin/env node

import { stitch } from "@google/stitch-sdk";
import { installProxyFromEnv } from "../server/proxy-env.mjs";
import { resolveStitchAuth } from "../server/stitch-auth.mjs";

try {
  const proxyInstalled = installProxyFromEnv();
  const { mode, config } = await resolveStitchAuth();

  if (mode !== "api-key") {
    process.env.STITCH_ACCESS_TOKEN = config.accessToken;
    process.env.GOOGLE_CLOUD_PROJECT = config.projectId;
  }

  const { tools } = await stitch.listTools();

  console.log(`Auth mode: ${mode}`);
  console.log(`Proxy installed: ${proxyInstalled}`);
  console.log(`Stitch MCP tools available: ${tools.length}`);
  for (const tool of tools) {
    console.log(`- ${tool.name}: ${tool.description || "No description"}`);
  }
} catch (error) {
  console.error("Unable to list Stitch tools.");
  console.error(error);
  process.exit(1);
}
