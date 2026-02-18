# CORTEX — Vercel Deployment Guide

## Vercel Settings

| Setting           | Value                    |
|--------------------|--------------------------|
| Root Directory     | `apps/web`               |
| Framework Preset   | Next.js                  |
| Install Command    | `pnpm install`           |
| Build Command      | `pnpm run build`         |
| Output Directory   | (default — `.next`)      |
| Node.js Version    | 20.x                     |
| Env Variables      | None required             |

## One-Click Deploy

1. Push the repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repository
4. Set **Root Directory** to `apps/web`
5. Vercel auto-detects Next.js — click **Deploy**

## Manual CLI Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# From the repo root
cd apps/web
vercel --prod
```

When prompted:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** No (first time)
- **Project name:** cortex
- **Directory:** `./` (since you're already in apps/web)
- **Override settings?** No

## Troubleshooting

### Build fails with "Module not found"
- Ensure the Root Directory is set to `apps/web` in Vercel settings
- Run `pnpm install` locally to verify dependencies resolve

### TypeScript errors
- Run `pnpm build` locally first to catch type errors
- All type errors must be fixed before deploying

### CSS not loading
- Verify `postcss.config.mjs` and `tailwind.config.ts` are in `apps/web/`
- Check that `globals.css` imports Tailwind directives

### Font Awesome icons missing
- Icons load via CDN in `layout.tsx` — requires internet access
- No build-time dependency on Font Awesome

## iOS Code and Web Builds

The iOS app (`apps/ios/`) does **not** affect web builds. It is excluded from the pnpm workspace and has no JavaScript dependencies. Vercel only builds the `apps/web/` directory.
