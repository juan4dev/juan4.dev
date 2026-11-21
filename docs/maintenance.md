# Dependency maintenance

Dependabot checks npm packages on Mondays at 09:00 and GitHub Actions at 09:15,
Europe/Madrid. npm patches are grouped; minor Astro and Tailwind updates have
separate groups. Major updates remain individual pull requests.

Only verified Dependabot patch PRs are merged automatically. The patch workflow
does not check out PR code. It waits for both required checks (`build` and
`dependency-review`), merges the expected commit using squash, then explicitly
starts the Pages deployment. Minor and major updates need manual review.

The `build` check runs `npm ci`, `astro check`, the production build and Chromium
smoke tests. The smoke tests check local assets, project navigation, keyboard
theme selection and persistence. The deployment runs the same tests against the
published URL. A failed post-deploy test flags the deployment workflow; it does
not roll back automatically.

## Repository setting

The ruleset for `main` must require `build` and `dependency-review`, including an
up-to-date branch. Keep these names stable when editing the workflows. The
automation refuses to merge if these required checks are absent. Do not add a
bypass for GitHub Actions.

## Review an update

1. Read the dependency changes and release/migration notes for minor or major
   updates, especially Astro, TypeScript and Tailwind.
2. Update the PR branch from `main` when GitHub requests it. Dependabot normally
   rebases its PRs automatically; an existing PR can also be rebased from GitHub.
3. Wait for both required checks on the updated branch before merging.
4. Check the Pages deployment, including its final `verify` job.

Do not bypass a failing install with `--force` or `--legacy-peer-deps`. A major
update can stay open while waiting for compatible upstream packages.

For local verification (Node 24):

```sh
npm ci
npm run build
npx playwright install chromium
npm run test:smoke
```

The same smoke tests can target an existing deployment:

```sh
SMOKE_BASE_URL=https://juan4.dev npm run test:smoke
```
