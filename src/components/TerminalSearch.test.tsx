import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TerminalSearch } from './TerminalSearch';
import { SiteData } from '../lib/terminal-commands';

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockPathname = '/about';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => mockPathname,
}));

const mockSiteData: SiteData = {
  pages: [
    { path: '/', name: 'Home', description: 'Homepage' },
    { path: '/about', name: 'About', description: 'About us' },
    { path: '/blog', name: 'Blog', description: 'Blog posts' },
  ],
  content: [
    { slug: 'guide', title: 'Guide', description: 'A helpful guide' },
  ],
  currentPath: '/about',
};

describe('TerminalSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any open dialogs
    const dialogs = document.querySelectorAll('[role="dialog"]');
    dialogs.forEach(dialog => dialog.remove());
  });

  describe('trigger button', () => {
    it('should render default trigger button', () => {
      render(<TerminalSearch siteData={mockSiteData} />);
      expect(screen.getByLabelText('Open terminal search')).toBeInTheDocument();
      expect(screen.getByText('terminal')).toBeInTheDocument();
    });

    it('should render custom terminal title', () => {
      render(<TerminalSearch siteData={mockSiteData} terminalTitle="my-terminal" />);
      expect(screen.getByText('my-terminal')).toBeInTheDocument();
    });

    it('should render custom trigger button', () => {
      const CustomButton = <button>Custom Trigger</button>;
      render(<TerminalSearch siteData={mockSiteData} triggerButton={CustomButton} />);
      expect(screen.getByText('Custom Trigger')).toBeInTheDocument();
    });

    it('should open terminal when trigger button is clicked', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);
      const button = screen.getByLabelText('Open terminal search');

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });
    });
  });

  describe('keyboard shortcuts', () => {
    it('should open terminal with Cmd+K', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });
    });

    it('should open terminal with Ctrl+K', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });
    });

    it('should toggle terminal with repeated shortcut', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);

      // Open
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      // Close
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Type a command...')).not.toBeInTheDocument();
      });
    });

    it('should use custom shortcut key', async () => {
      render(<TerminalSearch siteData={mockSiteData} shortcutKey="t" />);

      fireEvent.keyDown(document, { key: 't', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });
    });

    it('should respect shortcut modifier (ctrl only)', async () => {
      render(<TerminalSearch siteData={mockSiteData} shortcutModifier="ctrl" />);

      // Meta should not work
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
      expect(screen.queryByPlaceholderText('Type a command...')).not.toBeInTheDocument();

      // Ctrl should work
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });
    });
  });

  describe('terminal display', () => {
    it('should display welcome message', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByText(/Welcome to the terminal search interface/)).toBeInTheDocument();
      });
    });

    it('should display custom welcome message', async () => {
      const customWelcome = ['Custom welcome!', 'Line 2'];
      render(<TerminalSearch siteData={mockSiteData} welcomeMessage={customWelcome} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByText('Custom welcome!')).toBeInTheDocument();
        expect(screen.getByText('Line 2')).toBeInTheDocument();
      });
    });

    it('should focus input when opened', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        const input = screen.getByPlaceholderText('Type a command...');
        expect(input).toHaveFocus();
      }, { timeout: 200 });
    });
  });

  describe('command execution', () => {
    it('should execute help command', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'help{Enter}');

      await waitFor(() => {
        expect(screen.getByText(/Available Commands:/)).toBeInTheDocument();
      });
    });

    it('should execute pwd command', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'pwd{Enter}');

      await waitFor(() => {
        expect(screen.getByText('~/about')).toBeInTheDocument();
      });
    });

    it('should execute ls command', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'ls{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Available Pages:')).toBeInTheDocument();
      });
    });

    it('should clear input after command execution', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...') as HTMLInputElement;
      await user.type(input, 'pwd{Enter}');

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should display command in history', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'pwd{Enter}');

      await waitFor(() => {
        const commands = screen.getAllByText('pwd');
        expect(commands.length).toBeGreaterThan(0);
      });
    });
  });

  describe('clear command', () => {
    it('should clear terminal history', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');

      // Execute a command
      await user.type(input, 'pwd{Enter}');
      await waitFor(() => {
        expect(screen.getByText('~/about')).toBeInTheDocument();
      });

      // Clear
      await user.type(input, 'clear{Enter}');

      await waitFor(() => {
        expect(screen.queryByText('~/about')).not.toBeInTheDocument();
      });
    });
  });

  describe('navigation commands', () => {
    it('should navigate with cd command', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'cd blog{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/blog');
      }, { timeout: 1000 });
    });
  });

  describe('command history navigation', () => {
    it('should navigate through command history with arrow keys', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...') as HTMLInputElement;

      // Execute commands
      await user.type(input, 'pwd{Enter}');
      await user.type(input, 'ls{Enter}');

      // Navigate back with arrow up
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input.value).toBe('ls');

      // Navigate back again
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input.value).toBe('pwd');

      // Navigate forward
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect(input.value).toBe('ls');
    });
  });

  describe('custom commands', () => {
    it('should execute custom commands', async () => {
      const user = userEvent.setup();
      const customCommands = [
        {
          name: 'test',
          description: 'Test command',
          handler: () => ({ output: ['Custom output'] }),
        },
      ];

      render(<TerminalSearch siteData={mockSiteData} customCommands={customCommands} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'test{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Custom output')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should display error messages in red', async () => {
      const user = userEvent.setup();
      render(<TerminalSearch siteData={mockSiteData} />);

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('Type a command...');
      await user.type(input, 'invalidcommand{Enter}');

      await waitFor(() => {
        const errorText = screen.getByText(/command not found: invalidcommand/);
        expect(errorText).toBeInTheDocument();
        expect(errorText.className).toContain('text-red-400');
      });
    });
  });

  describe('close button', () => {
    it('should close terminal when close button is clicked', async () => {
      render(<TerminalSearch siteData={mockSiteData} />);

      // Open terminal
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument();
      });

      // Click close button
      const closeButton = screen.getByLabelText('Close terminal');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Type a command...')).not.toBeInTheDocument();
      });
    });
  });
});
