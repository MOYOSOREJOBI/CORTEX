# Release Checklist

Steps before each release.

## Code Quality

- [ ] All TypeScript errors resolved. `pnpm build` passes.
- [ ] All linting errors resolved. `pnpm lint` passes.
- [ ] All tests pass. `pnpm test` passes.
- [ ] No console errors on load or during normal use.
- [ ] No TODO comments remain in source code.
- [ ] No placeholder copy in UI text.

## Features

- [ ] Root route opens the dashboard.
- [ ] All 7 sidebar tabs work (Dashboard, Search, Memories, Processing, Privacy, Analytics, About).
- [ ] Tab switching is instant.
- [ ] URL hash updates on tab change.
- [ ] Refresh preserves the active tab.
- [ ] Keyboard shortcuts Ctrl+1 through Ctrl+7 work.
- [ ] Add, edit, delete, undo delete memory works.
- [ ] Search returns results with Why matched panel.
- [ ] Processing shows real progress and handles cancel.
- [ ] Export produces an encrypted file.
- [ ] Import restores data and validates schema.
- [ ] App lock blocks access until passphrase entered.
- [ ] Wipe removes all local data after confirmation.
- [ ] Profile shows Moyosore Jobi with local avatar.

## Documentation

- [ ] README covers setup, dev, test, build, deploy.
- [ ] README covers data model.
- [ ] QA checklist covers all features.
- [ ] About page includes full tutorial.

## CI

- [ ] GitHub Actions workflow runs lint, test, build.
- [ ] CI passes on the release branch.

## Deployment

- [ ] Build completes without errors.
- [ ] Static pages generate correctly.
- [ ] Production server starts without errors.
- [ ] Avatar image loads from local asset.
- [ ] Font Awesome icons load correctly.
