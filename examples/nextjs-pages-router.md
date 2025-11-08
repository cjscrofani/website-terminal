# Next.js Pages Router Example

This example shows how to integrate React Terminal Search into a Next.js Pages Router application.

## Installation

```bash
npm install react-terminal-search
```

## Setup

### 1. Create a Terminal Provider Component

`components/terminal-provider.tsx`:

```tsx
import { useRouter } from 'next/router';
import { TerminalSearch } from 'react-terminal-search';
import 'react-terminal-search/dist/styles/terminal.css';

// Import your site data
import { projects } from '@/lib/data/projects';

export function TerminalProvider() {
  const router = useRouter();

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
    currentPath: router.pathname,
  };

  return <TerminalSearch siteData={siteData} />;
}
```

### 2. Add to _app.tsx

`pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app';
import { TerminalProvider } from '@/components/terminal-provider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <TerminalProvider />
    </>
  );
}
```

### 3. Configure Tailwind CSS

Make sure your `tailwind.config.js` includes the package:

```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add this line:
    './node_modules/react-terminal-search/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## With Custom Commands

Add custom commands for your app:

```tsx
import { useRouter } from 'next/router';
import { TerminalSearch, CustomCommand } from 'react-terminal-search';
import { useTheme } from 'next-themes';

export function TerminalProvider() {
  const router = useRouter();
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
    },
    {
      name: 'reload',
      description: 'Reload the current page',
      handler: () => {
        router.reload();
        return {
          output: ['Reloading page...']
        };
      }
    }
  ];

  const siteData = {
    pages: [/* ... */],
    currentPath: router.pathname,
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

## Dynamic Content from API

Fetch and display dynamic content:

```tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TerminalSearch } from 'react-terminal-search';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
}

export function TerminalProvider() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch blog posts
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to load posts:', err));
  }, []);

  const siteData = {
    pages: [
      { path: '/', name: 'Home', description: 'Homepage' },
      { path: '/blog', name: 'Blog', description: 'All blog posts' },
      { path: '/about', name: 'About', description: 'About me' },
    ],
    content: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.excerpt,
    })),
    currentPath: router.pathname,
  };

  return <TerminalSearch siteData={siteData} />;
}
```

## Using with getStaticProps

If you have static content from `getStaticProps`, you can pass it through context:

```tsx
// pages/_app.tsx
import { createContext, useContext } from 'react';
import type { AppProps } from 'next/app';

interface AppContextType {
  staticData?: any;
}

const AppContext = createContext<AppContextType>({});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContext.Provider value={{ staticData: pageProps.staticData }}>
      <Component {...pageProps} />
      <TerminalProvider />
    </AppContext.Provider>
  );
}

// components/terminal-provider.tsx
export function TerminalProvider() {
  const router = useRouter();
  const { staticData } = useContext(AppContext);

  const siteData = {
    pages: [/* ... */],
    content: staticData?.projects || [],
    currentPath: router.pathname,
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

## API Routes Integration

Create a search API endpoint for server-side search:

```tsx
// pages/api/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '@/lib/posts';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query required' });
  }

  const posts = getAllPosts();
  const results = posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json(results);
}
```

That's it! Press `Cmd+K` or `Ctrl+K` to open the terminal.

## Differences from App Router

Key differences when using Pages Router:
- Use `useRouter` from `next/router` instead of `next/navigation`
- Access pathname via `router.pathname` instead of `usePathname()`
- Add the provider to `_app.tsx` instead of `layout.tsx`
- The TerminalProvider component doesn't need `'use client'` directive
