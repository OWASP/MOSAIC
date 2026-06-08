#!/usr/bin/env node
"use strict";

const path = require("path");

const firebaseToolsRoot = (() => {
  try {
    return path.dirname(require.resolve("firebase-tools/package.json"));
  } catch {
    return "/opt/homebrew/Cellar/firebase-cli/15.19.1/libexec/lib/node_modules/firebase-tools";
  }
})();

const auth = require(path.join(firebaseToolsRoot, "lib/auth"));
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

async function setRetention(channelId) {
  const res = await api.patch(
    `/projects/${projectId}/sites/${siteId}/channels/${channelId}`,
    { retainedReleaseCount: retention },
    { queryParams: { updateMask: "retainedReleaseCount" } }
  );
  console.log(`${channelId}: retainedReleaseCount=${res.body.retainedReleaseCount}`);
}

async function authenticate() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    await requireAuth.requireAuth({ project: projectId });
    return;
  }
  const account =
    auth.getProjectDefaultAccount(process.cwd()) || auth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) {
    console.error("Not logged in. Run: firebase login");
    process.exit(1);
  }
  auth.setRefreshToken(account.tokens.refresh_token);
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
