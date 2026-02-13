# Contact Form Lambda Handler

AWS Lambda function that handles contact form submissions from gjphotos.com.

## Architecture

- **Function Name:** `ContactFormHandler`
- **Runtime:** Node.js 20.x
- **Region:** us-east-1
- **Trigger:** API Gateway (or Function URL)

## Email Configuration

- **From:** `Gary Jiang Photography <noreply@gjphotos.com>`
- **To:** `bowengary@hotmail.com`
- **Reply-To:** `bowengary@hotmail.com`
- **Service:** Amazon SES (Simple Email Service)

## Setup

### Prerequisites

1. **Verified Domain in SES:** `gjphotos.com` must be verified in Amazon SES
2. **DNS Records:** DKIM, SPF, and DMARC records must be configured in Cloudflare
3. **AWS CLI:** Installed and configured with appropriate credentials
4. **IAM Role:** Lambda function needs `ContactFormLambdaRole` with SES send permissions

### Environment

The Lambda function expects form submissions with:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "message": "Your message here",
  "newsletter": true
}
```

## Deployment

### Manual Deployment

```bash
# From the lambda/ directory
npm run deploy
```

This will:
1. Package `index.mjs` into `function.zip`
2. Upload to AWS Lambda `ContactFormHandler`

### Manual Steps

```bash
# Package the function
zip -r function.zip index.mjs

# Upload to AWS
aws lambda update-function-code \
  --function-name ContactFormHandler \
  --region us-east-1 \
  --zip-file fileb://function.zip
```

## GitHub Actions Deployment

To set up automatic deployment via GitHub Actions:

1. **Add AWS credentials to GitHub Secrets:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. **Create `.github/workflows/deploy-lambda.yml`:**

```yaml
name: Deploy Lambda

on:
  push:
    branches: [main]
    paths:
      - 'lambda/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Package Lambda
        run: |
          cd lambda
          zip -r function.zip index.mjs

      - name: Deploy to Lambda
        run: |
          cd lambda
          aws lambda update-function-code \
            --function-name ContactFormHandler \
            --region us-east-1 \
            --zip-file fileb://function.zip
```

## Testing

Send a POST request to your API Gateway endpoint or Lambda Function URL:

```bash
curl -X POST https://your-api-gateway-url.amazonaws.com/contact \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "message": "Test message",
    "newsletter": false
  }'
```

## Monitoring

Check CloudWatch Logs:
```bash
aws logs tail /aws/lambda/ContactFormHandler --follow --region us-east-1
```

## Troubleshooting

### Emails going to junk/spam
- Verify `gjphotos.com` is verified in SES
- Check DNS records (DKIM, SPF, DMARC) are properly configured
- Ensure `Source` email uses verified domain (`noreply@gjphotos.com`)

### Function errors
- Check CloudWatch Logs for error details
- Verify IAM role has SES permissions
- Ensure all required fields are included in request body

## Files

- `index.mjs` - Main Lambda handler
- `package.json` - Dependencies and deployment scripts
- `function.zip` - Generated deployment package (gitignored)
