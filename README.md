# React Terminal Search

A beautiful retro terminal-style search interface for React/Next.js applications with Unix-like commands. Navigate your site using classic command-line operations like `cd`, `ls`, `grep`, and more!

![Terminal Search Demo](https://via.placeholder.com/800x400?text=Terminal+Search+Interface)

## Features

- 🖥️ **Authentic Terminal UI** - Classic green-on-black terminal aesthetics with macOS-style window chrome
- ⌨️ **Keyboard-First** - Quick access with customizable keyboard shortcuts (default: Cmd/Ctrl+K)
- 🔍 **Unix-Like Commands** - Familiar commands: `cd`, `ls`, `pwd`, `cat`, `grep`, `find`, `clear`, `help`
- 🎨 **Fully Customizable** - Custom commands, welcome messages, styling, and more
- 📜 **Command History** - Navigate previous commands with arrow keys
- 🐱 **Easter Eggs Included** - Hidden `meow` command (because why not?)
- ♿ **Accessible** - Keyboard navigation and screen reader support
- 🎯 **TypeScript** - Full type safety and autocompletion

## Prerequisites

This package requires:
- React 18+ or 19+
- Next.js 14+ (for `useRouter` and `usePathname` hooks)
- Tailwind CSS 3+ (for styling)
- TypeScript 5+ (optional but recommended)

If you don't have Tailwind CSS installed, follow the [Tailwind CSS installation guide](https://tailwindcss.com/docs/installation) for your framework.

## Installation

```bash
npm install react-terminal-search
# or
yarn add react-terminal-search
# or
pnpm add react-terminal-search
```

## Quick Start

### 1. Ensure Tailwind CSS is Set Up

This component uses Tailwind CSS classes. Make sure your `tailwind.config.js` includes the package in the content array:

```js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add this line:
    './node_modules/react-terminal-search/**/*.{js,ts,jsx,tsx}',
  ],
  // ... rest of config
};
```

### 2. Import the Component and Styles

```tsx
import { TerminalSearch } from 'react-terminal-search';
import 'react-terminal-search/dist/styles/terminal.css';
```

### 3. Define Your Site Data

```tsx
const siteData = {
  pages: [
    { path: '/', name: 'Home', description: 'Homepage' },
    { path: '/about', name: 'About', description: 'About us' },
    { path: '/blog', name: 'Blog', description: 'Latest posts' },
  ],
  content: [
    {
      slug: 'getting-started',
      title: 'Getting Started Guide',
      description: 'Learn the basics'
    },
  ],
  currentPath: '/about', // Current page path
};
```

### 4. Add to Your Layout

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { TerminalSearch } from 'react-terminal-search';

export default function Layout({ children }) {
  const pathname = usePathname();

  const siteData = {
    pages: [/* your pages */],
    currentPath: pathname,
  };

  return (
    <>
      {children}
      <TerminalSearch siteData={siteData} />
    </>
  );
}
```

That's it! Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the terminal.

## Built-in Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show all available commands | `help` |
| `cd [page]` | Navigate to a page | `cd blog` |
| `ls` | List all pages | `ls` |
| `ls content` | List all content items | `ls content` |
| `pwd` | Show current path | `pwd` |
| `cat [page]` | Display page details | `cat about` |
| `grep [term]` | Search across site | `grep guide` |
| `find [term]` | Find pages/content | `find getting` |
| `clear` | Clear terminal history | `clear` |
| `meow` | 🐱 Secret easter egg | `meow` |

## API Reference

### `<TerminalSearch>`

Main component for the terminal interface.

#### Props

```typescript
interface TerminalSearchProps {
  // Site data (required)
  siteData: SiteData;

  // Custom commands (optional)
  customCommands?: CustomCommand[];

  // Custom trigger button (optional)
  triggerButton?: ReactNode;

  // Welcome message lines (optional)
  welcomeMessage?: string[];

  // Terminal title in header (default: "terminal")
  terminalTitle?: string;

  // Keyboard shortcut key (default: "k")
  shortcutKey?: string;

  // Shortcut modifier (default: "both")
  shortcutModifier?: "ctrl" | "meta" | "both";
}
```

### `SiteData`

```typescript
interface SiteData {
  // Array of pages
  pages: Page[];

  // Optional content items (blog posts, docs, etc.)
  content?: ContentItem[];

  // Current page path
  currentPath: string;
}

interface Page {
  path: string;        // URL path (e.g., "/about")
  name: string;        // Display name
  description: string; // Brief description
}

interface ContentItem {
  slug: string;        // URL slug
  title: string;       // Display title
  description: string; // Brief description
}
```

### `CustomCommand`

```typescript
interface CustomCommand {
  name: string;
  description?: string; // Shows in help if provided
  handler: (args: string[], siteData: SiteData) => CommandResult;
}

interface CommandResult {
  output: string[];     // Lines to display
  error?: boolean;      // Red text if true
  navigate?: string;    // Path to navigate to
  clear?: boolean;      // Clear terminal if true
}
```

## Advanced Usage

### Custom Commands

Add your own commands to extend functionality:

```tsx
const customCommands = [
  {
    name: 'weather',
    description: 'Show current weather',
    handler: (args) => ({
      output: ['☀️ Currently sunny, 72°F']
    })
  },
  {
    name: 'theme',
    description: 'Toggle dark/light mode',
    handler: (args) => {
      toggleTheme(); // Your theme toggle function
      return {
        output: ['Theme toggled!']
      };
    }
  },
  {
    name: 'joke',
    // No description = hidden from help (easter egg!)
    handler: () => ({
      output: [
        'Why do programmers prefer dark mode?',
        '',
        'Because light attracts bugs! 🐛'
      ]
    })
  }
];

<TerminalSearch
  siteData={siteData}
  customCommands={customCommands}
/>
```

### Custom Trigger Button

Replace the default floating button:

```tsx
<TerminalSearch
  siteData={siteData}
  triggerButton={
    <button onClick={() => setOpen(true)}>
      Open Terminal 💻
    </button>
  }
/>
```

### Custom Welcome Message

```tsx
<TerminalSearch
  siteData={siteData}
  welcomeMessage={[
    'Welcome to MyApp Terminal!',
    'Type "help" to get started.',
    '💡 Tip: Try the "meow" command!'
  ]}
/>
```

### Custom Keyboard Shortcut

```tsx
// Use Ctrl+T instead of Cmd/Ctrl+K
<TerminalSearch
  siteData={siteData}
  shortcutKey="t"
  shortcutModifier="ctrl"
/>
```

### Dynamic Site Data

Update site data based on current route:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function TerminalProvider({ children }) {
  const pathname = usePathname();

  const siteData = useMemo(() => ({
    pages: [
      { path: '/', name: 'Home', description: 'Homepage' },
      { path: '/blog', name: 'Blog', description: 'Latest posts' },
      // ... more pages
    ],
    content: getBlogPosts(), // Your function to get posts
    currentPath: pathname,
  }), [pathname]);

  return (
    <>
      {children}
      <TerminalSearch siteData={siteData} />
    </>
  );
}
```

## Styling

The terminal uses green-on-black retro styling by default. Import the CSS file:

```tsx
import 'react-terminal-search/dist/styles/terminal.css';
```

To customize colors, override the CSS classes:

```css
.terminal-output {
  /* Custom scrollbar */
}

/* Customize terminal colors */
.text-green-400 {
  color: #your-color;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Examples

See the `examples/` directory for complete working examples:

- [Next.js App Router Example](./examples/nextjs-app-router.md)
- [Next.js Pages Router Example](./examples/nextjs-pages-router.md)
- [Custom Commands Example](./examples/custom-commands.md)
