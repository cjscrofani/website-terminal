export interface CommandResult {
  output: string[];
  error?: boolean;
  navigate?: string;
  clear?: boolean;
}

export interface Page {
  path: string;
  name: string;
  description: string;
}

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
}

export interface SiteData {
  pages: Page[];
  content?: ContentItem[];
  currentPath: string;
}

export interface CustomCommand {
  name: string;
  description?: string; // If provided, shows in help menu
  handler: (args: string[], siteData: SiteData) => CommandResult;
}

export function parseCommand(
  input: string,
  siteData: SiteData,
  customCommands?: CustomCommand[]
): CommandResult {
  const parts = input.trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Check custom commands first
  if (customCommands) {
    const customCmd = customCommands.find(cmd => cmd.name.toLowerCase() === command);
    if (customCmd) {
      return customCmd.handler(args, siteData);
    }
  }

  switch (command) {
    case 'help':
      const helpOutput = [
        'Available Commands:',
        '',
        '  cd [page]      - Navigate to a page',
        '  ls             - List available pages and sections',
        '  pwd            - Print current page path',
        '  cat [page]     - Display page information',
        '  grep [term]    - Search for content across the site',
        '  find [term]    - Find pages or content by name',
        '  clear          - Clear terminal history',
        '  help           - Show this help message',
      ];

      // Add custom commands to help if they have descriptions
      if (customCommands && customCommands.some(cmd => cmd.description)) {
        helpOutput.push('');
        helpOutput.push('Custom Commands:');
        customCommands.forEach(cmd => {
          if (cmd.description) {
            helpOutput.push(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
          }
        });
      }

      return { output: helpOutput };

    case 'clear':
      return { output: [], clear: true };

    case 'pwd':
      return { output: [`~${siteData.currentPath}`] };

    case 'ls':
      if (args[0] === 'content' && siteData.content) {
        return {
          output: [
            'Content:',
            '',
            ...siteData.content.map(item => `  ${item.slug}`),
            '',
            'Use "cat [item-name]" for details',
          ],
        };
      }
      return {
        output: [
          'Available Pages:',
          '',
          ...siteData.pages.map(p => `  ${p.path}`),
          '',
          siteData.content ? 'Use "ls content" to see all content items' : '',
        ].filter(Boolean),
      };

    case 'cd':
      if (!args[0]) {
        return { output: [''], navigate: '/' };
      }

      const target = args[0].toLowerCase().replace(/^\//, '');

      // Check pages
      const page = siteData.pages.find(
        p => p.path === `/${target}` || p.name.toLowerCase() === target
      );
      if (page) {
        return { output: [`Navigating to ${page.name}...`], navigate: page.path };
      }

      // Check content items
      if (siteData.content) {
        const item = siteData.content.find(c => c.slug === target);
        if (item) {
          return {
            output: [`Navigating to ${item.title}...`],
            navigate: `/content/${target}`
          };
        }
      }

      // Special cases
      if (target === 'home' || target === '~') {
        return { output: ['Navigating to home...'], navigate: '/' };
      }

      return {
        output: [`cd: no such page or item: ${args[0]}`],
        error: true,
      };

    case 'cat':
      if (!args[0]) {
        return {
          output: ['cat: missing operand', 'Try "cat [page]" or "help" for more info'],
          error: true,
        };
      }

      const catTarget = args[0].toLowerCase().replace(/^\//, '');
      const catPage = siteData.pages.find(
        p => p.path === `/${catTarget}` || p.name.toLowerCase() === catTarget
      );

      if (catPage) {
        return {
          output: [
            `Page: ${catPage.name}`,
            `Path: ${catPage.path}`,
            `Description: ${catPage.description}`,
            '',
            `Use "cd ${catTarget}" to navigate`,
          ],
        };
      }

      if (siteData.content) {
        const catItem = siteData.content.find(c => c.slug === catTarget);
        if (catItem) {
          return {
            output: [
              `Item: ${catItem.title}`,
              `Path: /content/${catItem.slug}`,
              `Description: ${catItem.description}`,
              '',
              `Use "cd ${catTarget}" to navigate`,
            ],
          };
        }
      }

      return {
        output: [`cat: ${args[0]}: No such page or item`],
        error: true,
      };

    case 'grep':
    case 'find':
      if (!args[0]) {
        return {
          output: [`${command}: missing search term`, 'Try "help" for usage info'],
          error: true,
        };
      }

      const searchTerm = args.join(' ').toLowerCase();
      const matchingPages = siteData.pages.filter(
        p => p.name.toLowerCase().includes(searchTerm) ||
             p.description.toLowerCase().includes(searchTerm)
      );
      const matchingContent = siteData.content?.filter(
        c => c.title.toLowerCase().includes(searchTerm) ||
             c.description.toLowerCase().includes(searchTerm)
      ) || [];

      if (matchingPages.length === 0 && matchingContent.length === 0) {
        return { output: [`No results found for "${searchTerm}"`] };
      }

      const results: string[] = [];
      if (matchingPages.length > 0) {
        results.push('Pages:', '');
        matchingPages.forEach(p => {
          results.push(`  ${p.path}`);
          results.push(`    ${p.name}`);
        });
      }
      if (matchingContent.length > 0) {
        if (results.length > 0) results.push('');
        results.push('Content:', '');
        matchingContent.forEach(c => {
          results.push(`  /content/${c.slug}`);
          results.push(`    ${c.title}`);
        });
      }

      return { output: results };

    case 'meow':
      return {
        output: [
          '',
          '     /\\_/\\  ',
          '    ( o.o ) ',
          '     > ^ <  ',
          '    /|   |\\',
          '   (_|   |_)',
          '',
          '  *meow meow*',
          '',
        ],
      };

    default:
      if (input.trim() === '') {
        return { output: [] };
      }
      return {
        output: [
          `command not found: ${command}`,
          'Type "help" for available commands',
        ],
        error: true,
      };
  }
}
