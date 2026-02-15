# Code Quality Setup

## Tools Installed

- **ESLint** - JavaScript/Vue linter
- **Prettier** - Code formatter
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

## NPM Scripts

```bash
# Format all code
npm run format

# Lint and auto-fix issues
npm run lint

# Check formatting (CI/CD)
npm run format:check

# Check linting (CI/CD)
npm run lint:check
```

## Automatic Linting on Commit

When you commit code, these tools run automatically:

- ✅ ESLint fixes auto-fixable issues
- ✅ Prettier formats code
- ✅ Only staged files are processed

## Manual Usage

```bash
# Format specific file
npx prettier --write src/components/MyComponent.vue

# Lint specific file
npx eslint src/components/MyComponent.vue --fix
```

## CI/CD Integration

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Lint code
  run: npm run lint:check

- name: Check formatting
  run: npm run format:check
```

## Node.js Version Requirement

⚠️ **IMPORTANT**: Your current Node.js version is v16.13.1

The linting tools require **Node.js 18+**. Please upgrade:

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify
node --version  # Should show v20.x.x
```

After upgrading Node, run:

```bash
npm install  # Reinstall dependencies
```

## Configuration Files

- `eslint.config.js` - ESLint rules
- `.prettierrc.json` - Prettier formatting rules
- `.prettierignore` - Files to ignore
- `.husky/pre-commit` - Git pre-commit hook
- `package.json` - lint-staged configuration

## What Was Formatted

All files in `src/` were auto-formatted with Prettier:

- ✅ Vue components
- ✅ JavaScript files
- ✅ CSS files
