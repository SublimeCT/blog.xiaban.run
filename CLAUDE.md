# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static blog built with **Fuwari** - an Astro-based blog template. The site is a Chinese-language personal blog at "下班就跑" (blog.xiaban.run) featuring modern web technologies and customizable themes.

## Development Commands

**Package Manager**: `pnpm` (enforced via preinstall hook)

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Full build pipeline: lint → build → pagefind indexing
- `pnpm check` - Run Astro type checking
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Run Biome linting with auto-fix
- `pnpm format` - Format code with Biome
- `pnpm new-post <filename>` - Create new blog post
- `pnpm preview` - Preview production build

**Deployment**: `pnpm build:deploy` builds and deploys to remote server via rsync

## Technology Stack

- **Framework**: Astro 5.13.7 with Svelte integration
- **Styling**: Tailwind CSS with typography plugin
- **Content**: Markdown with extended syntax (admonitions, GitHub cards, math via KaTeX)
- **Code Highlighting**: Expressive Code with custom themes and plugins
- **Search**: Pagefind for client-side search
- **Transitions**: Swup for smooth page transitions
- **Linting**: Biome for code formatting and linting

## Project Structure

### Key Configuration Files
- `src/config.ts` - Main site configuration (theme, navigation, profile, analytics)
- `astro.config.mjs` - Astro configuration with integrations and markdown plugins
- `tsconfig.json` - TypeScript config with path aliases for `@/*` mappings

### Content Management
- **Posts**: `src/content/posts/` - Markdown files with frontmatter
- **Pages**: `src/content/pages/` - Static pages like About, Links
- **Assets**: `src/assets/` - Images, fonts, and static assets
- **New Post Script**: `scripts/new-post.js` - Automated post creation

### Architecture Patterns
- **Path Aliases**: TypeScript paths map `@components/*`, `@utils/*`, etc. to source directories
- **Component Architecture**: Astro components for layouts, widgets, and content rendering
- **Plugin System**: Custom remark/rehype plugins for extended Markdown features
- **Theme System**: Configurable theme colors with CSS custom properties

### Key Features
- **Dark/Light Mode**: Theme switching with customizable colors
- **Extended Markdown**: Admonitions, GitHub repo cards, math support
- **Responsive Design**: Mobile-first with Tailwind utilities
- **Search Integration**: Pagefind indexing in build process
- **Analytics**: Microsoft Clarity integration configured
- **Image Optimization**: Sharp integration for responsive images

## Code Style

- **Formatter**: Biome (configured in `biome.json`)
- **TypeScript**: Strict mode enabled, no JavaScript allowed
- **Import Style**: Use path aliases (`@components/...`) over relative paths
- **Component Organization**: Group by function (layouts, widgets, misc)
- **Markdown**: Extended syntax with custom directives and components

## Build Process

The build pipeline includes:
1. Biome linting and formatting
2. Astro static site generation
3. Pagefind search index creation
4. Optional deployment to production server

## Special Notes

- The blog uses Chinese as the primary language (`lang: "zh_CN"`)
- All assets referenced in config should be relative to `/src` or `/public`
- Theme configuration supports both fixed and customizable color schemes
- Deploy script uses rsync to push to a specific production server