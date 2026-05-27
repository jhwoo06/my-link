# Project Overview: My Link / My Profile

A modern web application workspace centered around a **Next.js 16**, **React 19**, and **Tailwind CSS 4** project. This project serves as a personal profile/portfolio using the Next.js App Router and is configured with **TypeScript**.

## Tech Stack
- **Workspace Root:** `c:\Users\jhwoo\Desktop\my-link`
- **Main Application:** `my-profile/`
- **Framework:** Next.js 16.2.2 (App Router)
- **Library:** React 19.2.4
- **Styling:** Tailwind CSS 4 (using `@tailwindcss/postcss`)
- **Language:** TypeScript 5.x
- **Fonts:** Geist Sans & Geist Mono (via `next/font`)

## ⚠️ Important Note for AI Agents
This project uses **Next.js 16** and **Tailwind CSS 4**, which contain breaking changes and new APIs compared to earlier versions.
- **Next.js 16:** APIs, conventions, and file structures may differ from training data. Refer to `node_modules/next/dist/docs/` for up-to-date documentation.
- **Tailwind CSS 4:** Uses `@import "tailwindcss";` and CSS-based configuration.
- Heed any deprecation notices encountered during development.
- Refer to `my-profile/AGENTS.md` for specific rules regarding this version of Next.js.

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- `npm` or `yarn`

### Installation
From the root directory, navigate to the `my-profile` directory and install dependencies:
```bash
cd my-profile
npm install
```

### Commands
Execute these commands from within the `my-profile/` directory:

| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Production Start** | `npm run start` |
| **Linting** | `npm run lint` |

## Project Structure
- `my-profile/app/`: Next.js App Router routes, layouts, and global styles.
- `my-profile/public/`: Static assets like SVG icons and logos.
- `my-profile/next.config.ts`: Next.js configuration.
- `my-profile/tsconfig.json`: TypeScript configuration.
- `my-profile/postcss.config.mjs`: PostCSS configuration supporting Tailwind CSS 4.

## Development Conventions
- **Routing:** Follow the App Router convention (folders for routes, `page.tsx` for route components).
- **Styling:** Use Tailwind CSS 4 utility classes. Configuration is handled via CSS variables and `@theme` blocks in `my-profile/app/globals.css`.
- **Type Safety:** Maintain strict TypeScript usage. Define interfaces/types for all props and state.
- **Path Aliases:** Use the `@/` prefix to import modules from the project root (e.g., `import { ... } from "@/components/..."`).
- **Components:** Reusable components should be placed in `my-profile/components/`.
- **Validation:** Always run `npm run lint` and `npm run build` to verify changes before finalizing.
