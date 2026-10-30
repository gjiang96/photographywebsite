---
name: deploy
description:
  Build and deploy the photography site to S3 + CloudFront, or deploy the contact form Lambda. Use
  only when the user explicitly asks to deploy or ship.
disable-model-invocation: true
---

Background: `docs/deployment.md` (site) and `docs/contact-lambda.md` (Lambda).

## Step 1: Decide the target

Ask whether this is the **site**, the **Lambda**, or both, unless the user said.

## Step 2: Pre-flight

- `git status`: warn about uncommitted changes, since the deploy ships the working tree.
- `npm run lint:check` and `npm run build` must pass.
- `aws sts get-caller-identity` must succeed. If not, stop and ask the user to run `aws configure`.
  Never enter credentials yourself.

## Step 3: Deploy

Confirm with the user before running either command; both change production.

- **Site**: `./deploy.sh`. Or tell the user to run the "Deploy to AWS" workflow from the GitHub
  Actions tab (manual trigger only).
- **Lambda**: `cd lambda && ./deploy.sh`. A push to `main` touching `lambda/**` also deploys it.

## Step 4: Report

Give the CloudFront invalidation ID (site) or the function's `LastUpdateStatus` (Lambda), and remind
the user that site changes take about 5 minutes to appear.
