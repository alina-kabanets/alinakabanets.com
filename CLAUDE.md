@AGENTS.md

# Portfolio — alinakabanets.com

Personal portfolio of Alina Kabanets (Product Engineer). Next.js 16 App Router, React 19, Tailwind v4, deployed on Vercel (Hobby, personal account) from `main`.

## Conventions
- **Content lives in `content/`** (`profile.ts`, `projects.ts`). Never hard-code personal details or project copy in components; the planned creative version (`/studio`) and blog will read the same data.
- **Design tokens** are in `app/globals.css` (`paper`, `ink`, `muted`, `line`, `tint`). One typeface (Inter, optical sizing). No accent colour. Layout is a 12-column grid: small label on the left, content from the middle column.
- **Every page is static.** Don't introduce request-time APIs, and keep client components to interactive bits only (header menu, work view toggle, copy email).
- **Motion must never gate content** and must respect `prefers-reduced-motion`.
- **Analytics**: Umami via `data-umami-event` attributes (`case-study-open`, `cv-click`, `email-click`, `email-copy`, `linkedin-click`, `github-click`). Loads only when `UMAMI_WEBSITE_ID` is set and `VERCEL_ENV=production`.
- **Security headers / CSP** live in `next.config.ts`. Any new third-party origin must be added to the CSP.
- **Case studies**: `draft: true` in `projects.ts` keeps a page noindexed and out of the sitemap. Template order: summary → problem → what I did → key moments → results → reflection → next project.

## Checks before pushing
`npm run lint && npm run build`
