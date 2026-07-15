# Community Christmas

A web app for **Marmalade Trust's** Community Christmas initiative — bringing people
together to tackle loneliness over the festive season.

Built with [Next.js](https://nextjs.org) (App Router), React, TypeScript and
[Tailwind CSS](https://tailwindcss.com).

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the app by modifying files in `app/`. Pages auto-update as you edit.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the local development server   |
| `npm run build` | Create a production build            |
| `npm run start` | Run the production build locally     |
| `npm run lint`  | Lint the codebase with ESLint        |

## Project Structure

```
app/           App Router routes, layout and global styles
public/        Static assets
```

## Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to load and optimize [Geist](https://vercel.com/font). The font is exposed through the
`--font-sans` / `--font-mono` CSS variables and applied globally in `app/globals.css`.

## Branching & Contributions

- `main` — production / stable.
- `development` — integration branch; feature work is merged here first.
- Feature branches (e.g. `fix/…`, `feat/…`) — branch off `development` and open a PR back into it.

## Deploy

The app is intended to be deployed on the [Vercel Platform](https://vercel.com/new).
See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)
for details.
