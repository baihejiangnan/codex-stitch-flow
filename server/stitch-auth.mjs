import { GoogleAuth } from "google-auth-library";

const CLOUD_PLATFORM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";

function hasApiKey() {
  return Boolean(process.env.STITCH_API_KEY);
}

function hasExplicitOAuthToken() {
  return Boolean(process.env.STITCH_ACCESS_TOKEN && process.env.GOOGLE_CLOUD_PROJECT);
}

function hasAdcOAuthConfig() {
  return Boolean(process.env.GOOGLE_CLOUD_PROJECT);
}

async function getAdcAccessToken() {
  const auth = new GoogleAuth({
    scopes: [CLOUD_PLATFORM_SCOPE]
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();

  if (!token?.token) {
    throw new Error("Google ADC did not return an access token.");
  }

  return token.token;
}

export async function resolveStitchAuth() {
  const baseUrl = process.env.STITCH_HOST;

  if (hasApiKey()) {
    return {
      mode: "api-key",
      config: {
        apiKey: process.env.STITCH_API_KEY,
        baseUrl
      }
    };
  }

  if (hasExplicitOAuthToken()) {
    return {
      mode: "oauth-token",
      config: {
        accessToken: process.env.STITCH_ACCESS_TOKEN,
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        baseUrl
      }
    };
  }

  if (hasAdcOAuthConfig()) {
    const accessToken = await getAdcAccessToken();

    return {
      mode: "oauth-adc",
      config: {
        accessToken,
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        baseUrl
      }
    };
  }

  throw new Error(
    [
      "Missing Stitch authentication.",
      "Set STITCH_API_KEY, or set GOOGLE_CLOUD_PROJECT and authenticate with Google Application Default Credentials.",
      "PowerShell example:",
      '$env:GOOGLE_CLOUD_PROJECT=\"your-google-cloud-project-id\"',
      "gcloud auth application-default login"
    ].join("\n")
  );
}
