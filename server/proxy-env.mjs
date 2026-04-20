import { ProxyAgent, setGlobalDispatcher } from "undici";

export function installProxyFromEnv() {
  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  if (!proxyUrl) {
    return false;
  }

  setGlobalDispatcher(new ProxyAgent(proxyUrl));
  return true;
}
