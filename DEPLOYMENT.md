# Deployment Guide

This project uses GitHub Actions to automatically deploy to AWS S3 + CloudFront.

## Architecture

- **S3 Bucket**: `gary-jiang-photography-site` (static website hosting)
- **CloudFront Distribution**: `E2ZB5ZF53WQHAS` (CDN + HTTPS)
- **CloudFront URL**: https://d31ag7cwqtvro0.cloudfront.net

---

## Setup GitHub Actions (One-Time Setup)

### 1. Add AWS Credentials to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:

   **Secret 1:**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: Your AWS Access Key ID

   **Secret 2:**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: Your AWS Secret Access Key

### 2. Push to GitHub

Once secrets are configured, every push to `main` will automatically deploy!

```bash
git add .
git commit -m "Add deployment workflow"
git push origin main
```

---

## Manual Deployment (Local)

You can also deploy manually from your local machine:

```bash
./deploy.sh
```

**Requirements:**
- AWS CLI configured (`aws configure`)
- Node.js 22+ installed

---

## Deployment Workflow

When you push to `main`:

1. ✅ GitHub Actions triggers
2. 📦 Builds the Vue.js app (`npm run build`)
3. ☁️ Syncs files to S3 bucket
4. 🔄 Invalidates CloudFront cache
5. 🎉 Site is live in ~5 minutes

---

## Making Updates

### Update Photos:
1. Add/remove photos in `public/images/`
2. Update `src/data/galleries.js` if needed
3. Commit and push to GitHub
4. GitHub Actions deploys automatically

### Update Code:
1. Make changes to Vue components
2. Test locally: `npm run dev`
3. Commit and push to GitHub
4. GitHub Actions deploys automatically

---

## Manual CloudFront Cache Invalidation

If you need to manually clear the CloudFront cache:

```bash
aws cloudfront create-invalidation \
  --distribution-id E2ZB5ZF53WQHAS \
  --paths "/*"
```

---

## Cost Estimate

- **S3 Storage**: ~$0.011/month (485 MB)
- **CloudFront Data Transfer**: ~$3-5/month (low traffic)
- **Total**: ~$5-10/month

---

## Troubleshooting

### GitHub Actions fails with "Invalid credentials"
- Check that AWS secrets are correctly added in GitHub Settings
- Verify AWS IAM user has S3 and CloudFront permissions

### Site doesn't update after deployment
- Wait 5 minutes for CloudFront cache invalidation
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)

### Build fails
- Check Node.js version (requires 22+)
- Run `npm install` to ensure dependencies are installed
