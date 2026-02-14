#!/bin/bash

# Update Lambda Runtime
# Usage: ./update-runtime.sh [runtime]
# Example: ./update-runtime.sh nodejs22.x

set -e

FUNCTION_NAME="ContactFormHandler"
REGION="us-east-1"
RUNTIME="${1:-nodejs22.x}"

echo "🔄 Updating Lambda runtime to: $RUNTIME"

aws lambda update-function-configuration \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --runtime "$RUNTIME" \
  --query '[Runtime,State,LastUpdateStatus]' \
  --output table

echo ""
echo "✅ Runtime updated successfully!"
echo ""
echo "Current configuration:"
aws lambda get-function \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --query 'Configuration.[FunctionName,Runtime,LastModified]' \
  --output table
