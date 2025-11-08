import { describe, it, expect } from 'vitest';
import { parseCommand, SiteData } from './terminal-commands';

const mockSiteData: SiteData = {
  pages: [
    { path: '/', name: 'Home', description: 'Homepage' },
    { path: '/about', name: 'About', description: 'About us page' },
    { path: '/blog', name: 'Blog', description: 'Latest blog posts' },
    { path: '/contact', name: 'Contact', description: 'Get in touch' },
  ],
  content: [
    { slug: 'getting-started', title: 'Getting Started', description: 'Learn the basics' },
    { slug: 'advanced-guide', title: 'Advanced Guide', description: 'Advanced techniques' },
  ],
  currentPath: '/about',
};

describe('parseCommand', () => {
  describe('help command', () => {
    it('should display help message', () => {
      const result = parseCommand('help', mockSiteData);
      expect(result.output).toContain('Available Commands:');
      expect(result.output.some(line => line.includes('cd [page]'))).toBe(true);
      expect(result.output.some(line => line.includes('ls'))).toBe(true);
    });

    it('should include custom commands in help if they have descriptions', () => {
      const customCommands = [
        {
          name: 'weather',
          description: 'Show weather',
          handler: () => ({ output: ['Sunny'] }),
        },
        {
          name: 'secret',
          // No description - should not appear in help
          handler: () => ({ output: ['Secret!'] }),
        },
      ];
      const result = parseCommand('help', mockSiteData, customCommands);
      expect(result.output.some(line => line.includes('weather'))).toBe(true);
      expect(result.output.some(line => line.includes('secret'))).toBe(false);
    });
  });

  describe('clear command', () => {
    it('should return clear flag', () => {
      const result = parseCommand('clear', mockSiteData);
      expect(result.clear).toBe(true);
      expect(result.output).toEqual([]);
    });
  });

  describe('pwd command', () => {
    it('should display current path', () => {
      const result = parseCommand('pwd', mockSiteData);
      expect(result.output).toEqual(['~/about']);
    });
  });

  describe('ls command', () => {
    it('should list all pages', () => {
      const result = parseCommand('ls', mockSiteData);
      expect(result.output).toContain('Available Pages:');
      expect(result.output).toContain('  /');
      expect(result.output).toContain('  /about');
      expect(result.output).toContain('  /blog');
    });

    it('should list content items when "ls content" is called', () => {
      const result = parseCommand('ls content', mockSiteData);
      expect(result.output).toContain('Content:');
      expect(result.output).toContain('  getting-started');
      expect(result.output).toContain('  advanced-guide');
    });

    it('should handle site data without content', () => {
      const siteDataNoContent = { ...mockSiteData, content: undefined };
      const result = parseCommand('ls content', siteDataNoContent);
      expect(result.output).toContain('Available Pages:');
    });
  });

  describe('cd command', () => {
    it('should navigate to home when no argument provided', () => {
      const result = parseCommand('cd', mockSiteData);
      expect(result.navigate).toBe('/');
      expect(result.output).toEqual(['']);
    });

    it('should navigate to page by path', () => {
      const result = parseCommand('cd /blog', mockSiteData);
      expect(result.navigate).toBe('/blog');
      expect(result.output).toContain('Navigating to Blog...');
    });

    it('should navigate to page by name', () => {
      const result = parseCommand('cd about', mockSiteData);
      expect(result.navigate).toBe('/about');
      expect(result.output).toContain('Navigating to About...');
    });

    it('should navigate to content item by slug', () => {
      const result = parseCommand('cd getting-started', mockSiteData);
      expect(result.navigate).toBe('/content/getting-started');
      expect(result.output).toContain('Navigating to Getting Started...');
    });

    it('should handle "home" alias', () => {
      const result = parseCommand('cd home', mockSiteData);
      expect(result.navigate).toBe('/');
      expect(result.output).toContain('Navigating to home...');
    });

    it('should handle "~" alias', () => {
      const result = parseCommand('cd ~', mockSiteData);
      expect(result.navigate).toBe('/');
      expect(result.output).toContain('Navigating to home...');
    });

    it('should return error for non-existent page', () => {
      const result = parseCommand('cd nonexistent', mockSiteData);
      expect(result.error).toBe(true);
      expect(result.output).toContain('cd: no such page or item: nonexistent');
      expect(result.navigate).toBeUndefined();
    });

    it('should be case insensitive', () => {
      const result = parseCommand('cd ABOUT', mockSiteData);
      expect(result.navigate).toBe('/about');
    });
  });

  describe('cat command', () => {
    it('should display page details by name', () => {
      const result = parseCommand('cat about', mockSiteData);
      expect(result.output).toContain('Page: About');
      expect(result.output).toContain('Path: /about');
      expect(result.output).toContain('Description: About us page');
    });

    it('should display page details by path', () => {
      const result = parseCommand('cat /blog', mockSiteData);
      expect(result.output).toContain('Page: Blog');
      expect(result.output).toContain('Path: /blog');
    });

    it('should display content item details', () => {
      const result = parseCommand('cat getting-started', mockSiteData);
      expect(result.output).toContain('Item: Getting Started');
      expect(result.output).toContain('Path: /content/getting-started');
      expect(result.output).toContain('Description: Learn the basics');
    });

    it('should return error when no argument provided', () => {
      const result = parseCommand('cat', mockSiteData);
      expect(result.error).toBe(true);
      expect(result.output).toContain('cat: missing operand');
    });

    it('should return error for non-existent item', () => {
      const result = parseCommand('cat nonexistent', mockSiteData);
      expect(result.error).toBe(true);
      expect(result.output).toContain('cat: nonexistent: No such page or item');
    });
  });

  describe('grep command', () => {
    it('should find pages matching search term', () => {
      const result = parseCommand('grep blog', mockSiteData);
      expect(result.output).toContain('Pages:');
      expect(result.output).toContain('  /blog');
    });

    it('should find content matching search term', () => {
      const result = parseCommand('grep guide', mockSiteData);
      expect(result.output).toContain('Content:');
      expect(result.output).toContain('  /content/advanced-guide');
    });

    it('should find both pages and content', () => {
      const result = parseCommand('grep started', mockSiteData);
      expect(result.output).toContain('Content:');
      expect(result.output).toContain('  /content/getting-started');
    });

    it('should handle multi-word search terms', () => {
      const result = parseCommand('grep getting started', mockSiteData);
      expect(result.output.length).toBeGreaterThan(0);
    });

    it('should return no results message when nothing found', () => {
      const result = parseCommand('grep xyz123notfound', mockSiteData);
      expect(result.output).toContain('No results found for "xyz123notfound"');
    });

    it('should return error when no search term provided', () => {
      const result = parseCommand('grep', mockSiteData);
      expect(result.error).toBe(true);
      expect(result.output).toContain('grep: missing search term');
    });

    it('should be case insensitive', () => {
      const result = parseCommand('grep BLOG', mockSiteData);
      expect(result.output.length).toBeGreaterThan(0);
    });
  });

  describe('find command', () => {
    it('should work the same as grep', () => {
      const grepResult = parseCommand('grep blog', mockSiteData);
      const findResult = parseCommand('find blog', mockSiteData);
      expect(findResult.output).toEqual(grepResult.output);
    });

    it('should return error when no search term provided', () => {
      const result = parseCommand('find', mockSiteData);
      expect(result.error).toBe(true);
      expect(result.output).toContain('find: missing search term');
    });
  });

  describe('meow command', () => {
    it('should display cat ASCII art', () => {
      const result = parseCommand('meow', mockSiteData);
      expect(result.output.join('\n')).toContain('o.o');
      expect(result.output.join('\n')).toContain('meow meow');
    });
  });

  describe('custom commands', () => {
    it('should execute custom command', () => {
      const customCommands = [
        {
          name: 'test',
          handler: () => ({ output: ['Custom command output'] }),
        },
      ];
      const result = parseCommand('test', mockSiteData, customCommands);
      expect(result.output).toEqual(['Custom command output']);
    });

    it('should pass arguments to custom command handler', () => {
      const customCommands = [
        {
          name: 'echo',
          handler: (args) => ({ output: args }),
        },
      ];
      const result = parseCommand('echo hello world', mockSiteData, customCommands);
      expect(result.output).toEqual(['hello', 'world']);
    });

    it('should pass siteData to custom command handler', () => {
      const customCommands = [
        {
          name: 'getpath',
          handler: (args, siteData) => ({ output: [siteData.currentPath] }),
        },
      ];
      const result = parseCommand('getpath', mockSiteData, customCommands);
      expect(result.output).toEqual(['/about']);
    });

    it('should prioritize custom commands over built-in commands', () => {
      const customCommands = [
        {
          name: 'help',
          handler: () => ({ output: ['Custom help'] }),
        },
      ];
      const result = parseCommand('help', mockSiteData, customCommands);
      expect(result.output).toEqual(['Custom help']);
    });

    it('should be case insensitive for custom commands', () => {
      const customCommands = [
        {
          name: 'Test',
          handler: () => ({ output: ['Works'] }),
        },
      ];
      const result = parseCommand('test', mockSiteData, customCommands);
      expect(result.output).toEqual(['Works']);
    });
  });

  describe('unknown command', () => {
    it('should return error for unknown command', () => {
      const result = parseCommand('unknowncmd', mockSiteData);
      expect(result.error).toBe(true);
      expect(result.output).toContain('command not found: unknowncmd');
      expect(result.output.some(line => line.includes('help'))).toBe(true);
    });

    it('should return empty output for empty input', () => {
      const result = parseCommand('', mockSiteData);
      expect(result.output).toEqual([]);
    });

    it('should handle whitespace-only input', () => {
      const result = parseCommand('   ', mockSiteData);
      expect(result.output).toEqual([]);
    });
  });

  describe('command parsing', () => {
    it('should handle extra whitespace', () => {
      const result = parseCommand('  cd   blog  ', mockSiteData);
      expect(result.navigate).toBe('/blog');
    });

    it('should handle tabs and multiple spaces', () => {
      const result = parseCommand('cd\t\tblog', mockSiteData);
      expect(result.navigate).toBe('/blog');
    });
  });
});
