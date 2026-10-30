# Code Quality

ESLint + Prettier, enforced on commit by Husky + lint-staged.

```bash
npm run lint          # eslint . --fix
npm run lint:check    # eslint . (no fixes)
npm run format        # prettier --write "src/**/*.{js,vue,css,md}"
npm run format:check
```

- **Pre-commit** (`.husky/pre-commit` → `npx lint-staged`): staged `*.{js,vue}` get `eslint --fix` +
  `prettier --write`; `*.{css,md,json}` get `prettier --write`.
- **Config**: `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `lint-staged` block in
  `package.json`.
- **Node**: tooling needs Node 18+; use 22 to match CI (`nvm use 22`).
- CI does not run lint today. To add it, put `npm run lint:check` and `npm run format:check` before
  the deploy step in `.github/workflows/deploy.yml`.
