# Gary Jiang Photography

Photography portfolio and blog for [gjphotos.com](https://gjphotos.com), built with Vue 3 + Vite and
hosted on AWS S3 + CloudFront.

## Quick start

Requires Node 22 ([nvm](https://github.com/nvm-sh/nvm) recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build locally
```

## Documentation

| I want to…                       | Read                                             |
| -------------------------------- | ------------------------------------------------ |
| Understand the code layout       | [docs/architecture.md](docs/architecture.md)     |
| Add photos or a gallery category | [docs/galleries.md](docs/galleries.md)           |
| Write or edit a blog post        | [docs/blogs.md](docs/blogs.md)                   |
| Match the visual style           | [docs/design-system.md](docs/design-system.md)   |
| Deploy the site                  | [docs/deployment.md](docs/deployment.md)         |
| Work on the contact form backend | [docs/contact-lambda.md](docs/contact-lambda.md) |
| Lint / format                    | [docs/code-quality.md](docs/code-quality.md)     |

## Working with Claude Code

[CLAUDE.md](CLAUDE.md) is the agent entry point and indexes the docs above. Repeatable workflows
live as skills in [.claude/skills/](.claude/skills/): `/new-blog`, `/add-gallery-photos` and
`/deploy`.
