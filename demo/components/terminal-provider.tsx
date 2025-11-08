'use client';

import { usePathname } from 'next/navigation';
import { TerminalSearch, CustomCommand } from 'react-terminal-search';
import 'react-terminal-search/dist/styles/terminal.css';

export function TerminalProvider() {
  const pathname = usePathname();

  const siteData = {
    pages: [
      { path: '/', name: 'Home', description: 'Homepage and demo' },
      { path: '/blog', name: 'Blog', description: 'Technical articles and tutorials' },
      { path: '/projects', name: 'Projects', description: 'Open source projects' },
      { path: '/about', name: 'About', description: 'About this demo' },
    ],
    content: [
      {
        slug: 'getting-started',
        title: 'Getting Started with React Terminal Search',
        description: 'Learn how to integrate the terminal into your Next.js app',
      },
      {
        slug: 'custom-commands',
        title: 'Creating Custom Commands',
        description: 'Extend the terminal with your own commands',
      },
      {
        slug: 'styling-guide',
        title: 'Styling and Customization',
        description: 'Customize the look and feel of your terminal',
      },
      {
        slug: 'project-alpha',
        title: 'Project Alpha',
        description: 'An amazing open source project',
      },
      {
        slug: 'project-beta',
        title: 'Project Beta',
        description: 'Another cool project to explore',
      },
    ],
    currentPath: pathname,
  };

  const customCommands: CustomCommand[] = [
    {
      name: 'time',
      description: 'Show current time',
      handler: () => ({
        output: [`Current time: ${new Date().toLocaleTimeString()}`],
      }),
    },
    {
      name: 'joke',
      // No description = hidden easter egg
      handler: () => ({
        output: [
          'Why do programmers prefer dark mode?',
          '',
          'Because light attracts bugs! 🐛',
        ],
      }),
    },
    {
      name: 'whoami',
      description: 'Display user information',
      handler: () => ({
        output: [
          'User: Demo User',
          'Role: Visitor',
          'Location: Terminal Interface',
        ],
      }),
    },
  ];

  return (
    <TerminalSearch
      siteData={siteData}
      customCommands={customCommands}
      welcomeMessage={[
        'Welcome to React Terminal Search Demo! 🚀',
        'Type "help" to see available commands.',
        'Try "joke" for a surprise!',
      ]}
      terminalTitle="demo.terminal"
    />
  );
}
