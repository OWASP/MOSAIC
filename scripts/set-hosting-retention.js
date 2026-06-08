#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { GoogleAuth } = require("google-auth-library");

const repoRoot = path.resolve(__dirname, "..");
const defaultCredentialsFile = path.join(repoRoot, "firebase-service-account.json");
const hostingApi = "https://firebasehosting.googleapis.com/v1beta1";

const projectId = process.env.FIREBASE_PROJECT || "mozaic-56ca8";
const siteId = process.env.FIREBASE_SITE || "mozaic-56ca8";
const retention = Number(process.argv[2] || process.env.RETAINED_RELEASE_COUNT || "5");

if (!Number.isInteger(retention) || retention < 1 || retention > 100) {
  console.error("Retention must be an integer between 1 and 100.");
  process.exit(1);
}

function resolveCredentialsFile() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const tempFile = path.join(os.tmpdir(), `mosaic-firebase-sa-${process.pid}.json`);
    fs.writeFileSync(tempFile, process.env.FIREBASE_SERVICE_ACCOUNT, { mode: 0o600 });
    return tempFile;
  }

  if (fs.existsSync(defaultCredentialsFile)) {
    return defaultCredentialsFile;
  }

  console.error(
    [
      "Firebase service account credentials not found.",
      "",
      "Provide one of:",
      `  - ${defaultCredentialsFile}`,
      "  - FIREBASE_SERVICE_ACCOUNT (JSON string; used in GitHub Actions)",
      "  - GOOGLE_APPLICATION_CREDENTIALS (path to a service account JSON file)",
    ].join("\n")
  );
  process.exit(1);
}

async function getAccessToken(credentialsFile) {
  const auth = new GoogleAuth({
    keyFile: credentialsFile,
    scopes: ["https://www.googleapis.com/auth/firebase"],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) {
    throw new Error("Failed to obtain access token from service account.");
  }
  return token;
}

async function hostingRequest(token, method, apiPath, body) {
  const response = await fetch(`${hostingApi}${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${method} ${apiPath} failed (${response.status}): ${detail}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function setRetention(token, channelId) {
  const result = await hostingRequest(
    token,
    "PATCH",
    `/projects/${projectId}/sites/${siteId}/channels/${channelId}?updateMask=retainedReleaseCount`,
    { retainedReleaseCount: retention }
  );
  console.log(`${channelId}: retainedReleaseCount=${result.retainedReleaseCount}`);
}

async function main() {
  const credentialsFile = resolveCredentialsFile();
  const token = await getAccessToken(credentialsFile);

  const list = await hostingRequest(
    token,
    "GET",
    `/projects/${projectId}/sites/${siteId}/channels?pageSize=100`
  );
  const channels = list.channels || [];
  if (!channels.length) {
    console.error("No hosting channels found.");
    process.exit(1);
  }

  for (const channel of channels) {
    const channelId = channel.name.split("/").pop();
    await setRetention(token, channelId);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
