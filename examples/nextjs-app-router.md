# Next.js App Router Example

This example shows how to integrate React Terminal Search into a Next.js App Router application.

## Installation

```bash
npm install react-terminal-search
```

## Setup

### 1. Create a Terminal Provider Component

`components/terminal-provider.tsx`:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { TerminalSearch } from 'react-terminal-search';
import 'react-terminal-search/dist/styles/terminal.css';

// Import your site data
import { projects } from '@/lib/data/projects';

export function TerminalProvider() {
  const pathname = usePathname();

  const siteData = {
    pages: [
      { path: '/', name: 'Home', description: 'Homepage and introduction' },
      { path: '/projects', name: 'Projects', description: 'Technical projects and builds' },
      { path: '/blog', name: 'Blog', description: 'Technical writing' },
      { path: '/contact', name: 'Contact', description: 'Get in touch' },
    ],
    content: projects.map(p => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
    })),
    currentPath: pathname,
  };

  return <TerminalSearch siteData={siteData} />;
}
```

### 2. Add to Root Layout

`app/layout.tsx`:

```tsx
import { TerminalProvider } from '@/components/terminal-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <TerminalProvider />
      </body>
    </html>
  );
}
```

## With Custom Commands

Add custom commands for your app:

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { TerminalSearch, CustomCommand } from 'react-terminal-search';
import { useTheme } from 'next-themes';

export function TerminalProvider() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const customCommands: CustomCommand[] = [
    {
      name: 'theme',
      description: 'Toggle dark/light mode',
      handler: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return {
          output: [`Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode`]
        };
      }
    },
    {
      name: 'email',
      description: 'Copy email to clipboard',
      handler: () => {
        navigator.clipboard.writeText('hello@example.com');
        return {
          output: ['Email copied to clipboard!']
        };
      }
    }
  ];

  const siteData = {
    pages: [/* ... */],
    currentPath: pathname,
  };

  return (
    <TerminalSearch
      siteData={siteData}
      customCommands={customCommands}
      terminalTitle="myapp.terminal"
    />
  );
}
```

## Dynamic Content from CMS

Fetch and display dynamic content:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TerminalSearch } from 'react-terminal-search';

export function TerminalProvider() {
  const pathname = usePathname();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch blog posts
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const siteData = {
    pages: [/* static pages */],
    content: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.excerpt,
    })),
    currentPath: pathname,
  };

  return <TerminalSearch siteData={siteData} />;
}
```

## Custom Styling

Override default styles in your `globals.css`:

```css
/* Custom terminal colors */
.terminal-output {
  /* Your custom styles */
}

/* Change terminal accent color */
.text-green-400 {
  color: #00ff00; /* Brighter green */
}

.bg-green-500\/30 {
  background-color: rgba(0, 255, 0, 0.3);
}
```

That's it! Press `Cmd+K` or `Ctrl+K` to open the terminal.
