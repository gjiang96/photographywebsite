# Deployment

Static site on S3, served through CloudFront.

| Resource                | Value                                 |
| ----------------------- | ------------------------------------- |
| S3 bucket               | `gary-jiang-photography-site`         |
| CloudFront distribution | `E2ZB5ZF53WQHAS`                      |
| CloudFront URL          | https://d31ag7cwqtvro0.cloudfront.net |
| Region                  | us-east-1                             |

## What `deploy.sh` does

1. `npm run build` → `dist/`
2. `aws s3 sync dist/ --delete` with `max-age=31536000` (everything except `index.html`)
3. Uploads `index.html` with `max-age=0, must-revalidate`
4. Creates a CloudFront `/*` invalidation (live in about 5 minutes)

## Ways to deploy

| Target | How                                               | Trigger                                            |
| ------ | ------------------------------------------------- | -------------------------------------------------- |
| Site   | `.github/workflows/deploy.yml` runs `./deploy.sh` | **Manual only**: Actions tab → Deploy to AWS → Run |
| Site   | `./deploy.sh` locally                             | Needs `aws configure` + Node 22                    |
| Lambda | `.github/workflows/deploy-lambda.yml`             | Automatic on push to `main` touching `lambda/**`   |

Pushing to `main` does **not** deploy the site. Both workflows use the repo secrets
`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`.

Manual cache clear:

```bash
aws cloudfront create-invalidation --distribution-id E2ZB5ZF53WQHAS --paths "/*"
```

## Troubleshooting

- **"Invalid credentials" in Actions**: check the repo secrets and that the IAM user has S3 +
  CloudFront permissions.
- **Site didn't change**: wait for the invalidation, then hard-refresh.
- **Build fails**: confirm Node 22 and run `npm ci`.

## Cost

About $5–10/month, mostly CloudFront transfer. S3 storage is negligible.

The `/deploy` skill runs this end to end.
