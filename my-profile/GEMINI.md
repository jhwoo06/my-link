# Project Overview: My Profile

A modern web application built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**. This project uses the Next.js App Router and is configured with **TypeScript** for enhanced type safety and developer experience.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Fonts:** Geist Sans & Geist Mono (via `next/font`)

## ⚠️ Important Note for AI Agents
This project uses **Next.js 16**, which may contain breaking changes, new APIs, or different file structures compared to your training data. 
- Always refer to `node_modules/next/dist/docs/` for the most accurate and up-to-date documentation.
- Heed any deprecation notices encountered during development.
- Refer to `AGENTS.md` for specific rules regarding this version of Next.js.

## Getting Started

### Prerequisites
- Node.js installed on your system.

### Installation
From the `my-profile` directory, install the dependencies:
```bash
npm install
```

### Commands
| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Production Start** | `npm run start` |
| **Linting** | `npm run lint` |

## Project Structure
- `app/`: Contains the application routes, layouts, and global styles.
- `public/`: Static assets like SVG icons and logos.
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.
- `postcss.config.mjs`: PostCSS configuration (supporting Tailwind CSS 4).

## Development Conventions
- **Routing:** Use the App Router convention (folders for routes, `page.tsx` for route components).
- **Styling:** Prefer Tailwind CSS utility classes. The project uses `globals.css` for root-level styling and font variables.
- **Type Safety:** Maintain strict TypeScript usage. Define interfaces/types for props and state.
- **Components:** Organize reusable components (if any are added) into a `components/` directory.
