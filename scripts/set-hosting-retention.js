#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const defaultCredentialsFile = path.join(repoRoot, "firebase-service-account.json");

const firebaseToolsRoot = (() => {
  try {
    return path.dirname(require.resolve("firebase-tools/package.json"));
  } catch {
    return "/opt/homebrew/Cellar/firebase-cli/15.19.1/libexec/lib/node_modules/firebase-tools";
  }
})();

const requireAuth = require(path.join(firebaseToolsRoot, "lib/requireAuth"));
const { Client } = require(path.join(firebaseToolsRoot, "lib/apiv2"));
const { hostingApiOrigin } = require(path.join(firebaseToolsRoot, "lib/api"));

const projectId = process.env.FIREBASE_PROJECT || "mozaic-56ca8";
const siteId = process.env.FIREBASE_SITE || "mozaic-56ca8";
const retention = Number(process.argv[2] || process.env.RETAINED_RELEASE_COUNT || "5");

if (!Number.isInteger(retention) || retention < 1 || retention > 100) {
  console.error("Retention must be an integer between 1 and 100.");
  process.exit(1);
}

const api = new Client({
  urlPrefix: hostingApiOrigin(),
  apiVersion: "v1beta1",
  auth: true,
});

function resolveCredentialsFile() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const tempFile = path.join(
      os.tmpdir(),
      `mosaic-firebase-sa-${process.pid}.json`
    );
    fs.writeFileSync(tempFile, process.env.FIREBASE_SERVICE_ACCOUNT, {
      mode: 0o600,
    });
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

async function authenticate() {
  const credentialsFile = resolveCredentialsFile();
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsFile;
  await requireAuth.requireAuth({ project: projectId });
}

async function setRetention(channelId) {
  const res = await api.patch(
    `/projects/${projectId}/sites/${siteId}/channels/${channelId}`,
    { retainedReleaseCount: retention },
    { queryParams: { updateMask: "retainedReleaseCount" } }
  );
  console.log(`${channelId}: retainedReleaseCount=${res.body.retainedReleaseCount}`);
}

async function main() {
  await authenticate();

  const list = await api.get(`/projects/${projectId}/sites/${siteId}/channels`, {
    queryParams: { pageSize: 100 },
  });
  const channels = list.body.channels || [];
  if (!channels.length) {
    console.error("No hosting channels found.");
    process.exit(1);
  }
  for (const channel of channels) {
    const channelId = channel.name.split("/").pop();
    await setRetention(channelId);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
