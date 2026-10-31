# Contact Form Lambda

`lambda/index.mjs` receives contact form posts and emails them via Amazon SES.

| Setting     | Value                                                            |
| ----------- | ---------------------------------------------------------------- |
| Function    | `ContactFormHandler` (Node.js 22.x, us-east-1)                   |
| Endpoint    | `API_ENDPOINT` in `src/components/ContactForm.vue` (API Gateway) |
| IAM role    | `ContactFormLambdaRole` (SES send permission)                    |
| From        | `Gary Jiang Photography <noreply@gjphotos.com>`                  |
| To/Reply-To | `bowengary@hotmail.com`                                          |

Prerequisites: `gjphotos.com` verified in SES, with DKIM/SPF/DMARC records in Cloudflare.

## Request body

```json
{ "first_name": "…", "last_name": "…", "email": "…", "message": "…" }
```

## Deploy

Pushing changes under `lambda/` to `main` deploys automatically
(`.github/workflows/deploy-lambda.yml`). Manually, from `lambda/`:

```bash
npm run deploy     # zips index.mjs and runs update-function-code
```

`lambda/deploy.sh` does the same and prints the function status. `function.zip` is gitignored.

## Runtime upgrades

When AWS deprecates a Node runtime
([lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)):

```bash
lambda/update-runtime.sh nodejs22.x
```

## Unit tests

`lambda/index.test.mjs` runs on `node:test` with SES stubbed, so it needs no AWS credentials:

```bash
cd lambda && npm ci && npm test
```

## Testing and logs

```bash
curl -X POST <API_ENDPOINT> -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","message":"Test"}'

aws logs tail /aws/lambda/ContactFormHandler --follow --region us-east-1
```

## Troubleshooting

- **Mail lands in spam**: check the SES domain verification and DKIM/SPF/DMARC records, and that
  `Source` uses `noreply@gjphotos.com`.
- **Function errors**: check CloudWatch logs, the IAM role's SES permission, and that all fields are
  in the body.
