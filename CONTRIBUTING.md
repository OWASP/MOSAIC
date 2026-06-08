This repository contains files (under 'code'), issues and discussions. 

# For whom?
This platform is primarily for [MOSAIC participants](docs/memberorganizations.md), but as this is an open collaboration: MOSAIC welcomes input from others, as long as these are respectful and aiming to help.

# How to use Discussions
Use GitHub Discussions for suggestions, ideas and questions.

# How to use Issues
We generally do not use GitHub Issues. 

# How to propose a change to files

1. Open the file you want to change.
2. Click the edit button (pencil icon).
3. Make your change.
4. Agree to submit the pull request (the proposal of your change).
5. An assigned code owner will review the change before it becomes part of the main branch.

Note: you may get questions from Github during this process — just agree to them. Explanation for your information:
- If you have a 'writer' role and you save your edit, GitHub asks "Create a new branch for this commit and start a pull request."
- If you don't have a 'writer' role, you are asked to create a fork when you start editing: this is a copy of the repository in your own space, where you make the change, and then it becomes a proposal for the 'main' content.

Note: the files are typically documents, as this is a collaboration platform on standards and guidelines.

# Website

The public site lives in [`content/mosaic/`](content/mosaic/). It is built with Hugo and deployed to Firebase Hosting via GitHub Actions.

## Build locally

```bash
npm run build:site
npm run serve
```

Open http://localhost:3000

## Firebase Hosting release retention

Hosting keeps previous releases for rollbacks. We cap retention at **5 releases per channel** (live and preview).

Maintainers run [`scripts/set-hosting-retention.js`](scripts/set-hosting-retention.js) with the Firebase service account used for deploys. The script authenticates via one of:

1. **`firebase-service-account.json`** at the repository root (recommended locally). Copy the JSON from the `FIREBASE_SERVICE_ACCOUNT` GitHub Actions secret into this file. The file is gitignored — never commit it.
2. **`FIREBASE_SERVICE_ACCOUNT`** environment variable (JSON string; used in CI).
3. **`GOOGLE_APPLICATION_CREDENTIALS`** environment variable (path to a service account JSON file).

```bash
# after placing firebase-service-account.json in the repo root:
npm run hosting:retention

# or with an explicit count (1–100):
node scripts/set-hosting-retention.js 5
```

Optional environment variables: `FIREBASE_PROJECT` (default `mozaic-56ca8`), `FIREBASE_SITE` (default `mozaic-56ca8`).

The live deploy workflow runs this automatically before each production deploy.

## Analytics

The site uses [GoatCounter](https://www.goatcounter.com/) for privacy-friendly, cookie-free page view statistics. The tracking snippet is in [`content/mosaic/layouts/_default/baseof.html`](content/mosaic/layouts/_default/baseof.html):

```html
<script data-goatcounter="https://mosaic.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

GoatCounter collects aggregate page views only (no personal data, no cookies). Do not add additional trackers without discussion.
