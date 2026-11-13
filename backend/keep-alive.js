"use strict";

const intervalMs = 2 * 60 * 1000;
const timeoutMs = 15 * 1000;
const target = process.env.KEEPALIVE_URL;

if (!target) {
  throw new Error("Set KEEPALIVE_URL to the deployed service's /health URL.");
}

const healthUrl = new URL(target);
if (healthUrl.protocol !== "https:" && healthUrl.protocol !== "http:") {
  throw new Error("KEEPALIVE_URL must use HTTP or HTTPS.");
}

async function ping() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(healthUrl, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Health check returned HTTP ${response.status}`);
    }
    console.log(`${new Date().toISOString()} Health check succeeded (${response.status})`);
  } catch (error) {
    console.error(`${new Date().toISOString()} Health check failed:`, error);
  } finally {
    clearTimeout(timeout);
  }
}

console.log(`Pinging ${healthUrl} every ${intervalMs / 1000} seconds`);
void ping();
setInterval(ping, intervalMs);
