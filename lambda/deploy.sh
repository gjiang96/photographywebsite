#!/bin/bash

# Deploy ContactFormHandler Lambda function
# Usage: ./deploy.sh

set -e

echo "📦 Packaging Lambda function..."
zip -r function.zip index.mjs

echo "🚀 Deploying to AWS Lambda..."
aws lambda update-function-code \
  --function-name ContactFormHandler \
  --region us-east-1 \
  --zip-file fileb://function.zip

echo "✅ Deployment complete!"

# Check deployment status
echo ""
echo "🔍 Checking function status..."
aws lambda get-function \
  --function-name ContactFormHandler \
  --region us-east-1 \
  --query 'Configuration.[State,LastUpdateStatus]' \
  --output text

echo ""
echo "✨ Lambda function deployed successfully!"
