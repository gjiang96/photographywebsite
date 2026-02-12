#!/bin/bash

# Photography Website Deployment Script
# Deploys to AWS S3 + CloudFront

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Configuration
S3_BUCKET="gary-jiang-photography-site"
CLOUDFRONT_DISTRIBUTION_ID="E2ZB5ZF53WQHAS"
BUILD_DIR="dist"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build the application
echo -e "${BLUE}📦 Building application...${NC}"
npm run build

if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build failed: $BUILD_DIR directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"

# Step 2: Sync to S3 (excluding index.html for now)
echo -e "${BLUE}☁️  Uploading to S3...${NC}"
aws s3 sync "$BUILD_DIR/" "s3://$S3_BUCKET" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html"

# Step 3: Upload index.html with different cache settings
echo -e "${BLUE}📄 Uploading index.html...${NC}"
aws s3 cp "$BUILD_DIR/index.html" "s3://$S3_BUCKET/index.html" \
    --cache-control "public, max-age=0, must-revalidate"

echo -e "${GREEN}✅ Files uploaded to S3${NC}"

# Step 4: Invalidate CloudFront cache
echo -e "${BLUE}🔄 Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}✅ Cache invalidation created: $INVALIDATION_ID${NC}"

# Step 5: Get CloudFront URL
CLOUDFRONT_URL=$(aws cloudfront get-distribution \
    --id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --query 'Distribution.DomainName' \
    --output text)

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📍 Your site is available at:${NC}"
echo -e "   https://$CLOUDFRONT_URL"
echo ""
echo -e "${BLUE}⏳ Cache invalidation in progress...${NC}"
echo -e "   Changes will be visible in ~5 minutes"
echo ""
