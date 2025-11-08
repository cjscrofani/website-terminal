# Custom Commands Examples

This guide shows various examples of custom commands you can add to the terminal.

## Basic Custom Command

```tsx
const customCommands = [
  {
    name: 'hello',
    description: 'Say hello',
    handler: (args) => ({
      output: [`Hello, ${args[0] || 'World'}!`]
    })
  }
];
```

Usage: `hello` or `hello John`

## Theme Toggle

```tsx
import { useTheme } from 'next-themes';

const { setTheme, theme } = useTheme();

const customCommands = [
  {
    name: 'theme',
    description: 'Toggle dark/light mode',
    handler: () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      return {
        output: [`Switched to ${newTheme} mode ✨`]
      };
    }
  }
];
```

## Multi-line ASCII Art

```tsx
const customCommands = [
  {
    name: 'logo',
    description: 'Display company logo',
    handler: () => ({
      output: [
        '',
        '  ███╗   ███╗██╗   ██╗ █████╗ ██████╗ ██████╗ ',
        '  ████╗ ████║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗',
        '  ██╔████╔██║ ╚████╔╝ ███████║██████╔╝██████╔╝',
        '  ██║╚██╔╝██║  ╚██╔╝  ██╔══██║██╔═══╝ ██╔═══╝ ',
        '  ██║ ╚═╝ ██║   ██║   ██║  ██║██║     ██║     ',
        '  ╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝     ',
        '',
        '  Welcome to MyApp!',
        ''
      ]
    })
  }
];
```

## Navigation Command

```tsx
const customCommands = [
  {
    name: 'dashboard',
    description: 'Go to dashboard',
    handler: () => ({
      output: ['Opening dashboard...'],
      navigate: '/dashboard'
    })
  }
];
```

## API Integration

```tsx
const customCommands = [
  {
    name: 'stats',
    description: 'Show site statistics',
    handler: async () => {
      const stats = await fetch('/api/stats').then(r => r.json());
      return {
        output: [
          'Site Statistics:',
          '',
          `  Visitors Today: ${stats.visitors}`,
          `  Page Views: ${stats.pageViews}`,
          `  Uptime: ${stats.uptime}%`
        ]
      };
    }
  }
];
```

## Interactive Command with Arguments

```tsx
const customCommands = [
  {
    name: 'calc',
    description: 'Simple calculator (usage: calc 5 + 3)',
    handler: (args) => {
      if (args.length < 3) {
        return {
          output: ['Usage: calc <number> <operator> <number>'],
          error: true
        };
      }

      const [a, op, b] = args;
      const num1 = parseFloat(a);
      const num2 = parseFloat(b);

      let result;
      switch (op) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num1 / num2; break;
        default:
          return {
            output: ['Invalid operator. Use: +, -, *, /'],
            error: true
          };
      }

      return {
        output: [`${a} ${op} ${b} = ${result}`]
      };
    }
  }
];
```

## Social Links

```tsx
const customCommands = [
  {
    name: 'social',
    description: 'View social media links',
    handler: () => ({
      output: [
        'Social Media:',
        '',
        '  Twitter: https://twitter.com/username',
        '  GitHub: https://github.com/username',
        '  LinkedIn: https://linkedin.com/in/username',
        '',
        'Tip: Click any link to open!'
      ]
    })
  }
];
```

## Copy to Clipboard

```tsx
const customCommands = [
  {
    name: 'email',
    description: 'Copy email address',
    handler: () => {
      navigator.clipboard.writeText('hello@example.com');
      return {
        output: ['📋 Email copied to clipboard!']
      };
    }
  }
];
```

## Easter Egg (Hidden Command)

```tsx
const customCommands = [
  {
    name: 'konami',
    // No description = hidden from help menu
    handler: () => ({
      output: [
        '',
        '  ⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ 🅱️ 🅰️',
        '',
        '  🎮 Cheat code activated!',
        '  You found the secret command!',
        ''
      ]
    })
  }
];
```

## Command with State Access

```tsx
import { useSession } from 'next-auth/react';

export function TerminalProvider() {
  const { data: session } = useSession();

  const customCommands = [
    {
      name: 'whoami',
      description: 'Show current user',
      handler: () => ({
        output: session
          ? [`Logged in as: ${session.user.name}`]
          : ['Not logged in. Run "login" to authenticate.']
      })
    }
  ];

  return <TerminalSearch customCommands={customCommands} />;
}
```

## Clear with Confirmation

```tsx
const customCommands = [
  {
    name: 'reset',
    description: 'Clear all data (with confirmation)',
    handler: (args) => {
      if (args[0] === '--confirm') {
        // Clear your data here
        return {
          output: ['✅ All data cleared!'],
          clear: true
        };
      }
      return {
        output: [
          '⚠️  This will clear all data!',
          'Run "reset --confirm" to proceed.'
        ]
      };
    }
  }
];
```

## Time/Date Commands

```tsx
const customCommands = [
  {
    name: 'time',
    description: 'Show current time',
    handler: () => ({
      output: [new Date().toLocaleTimeString()]
    })
  },
  {
    name: 'date',
    description: 'Show current date',
    handler: () => ({
      output: [new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })]
    })
  }
];
```

## Combine Multiple Custom Commands

```tsx
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

export function useTerminalCommands() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const customCommands = [
    {
      name: 'theme',
      description: 'Toggle theme',
      handler: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return { output: ['Theme toggled!'] };
      }
    },
    {
      name: 'dashboard',
      description: 'Go to dashboard',
      handler: () => ({
        output: ['Opening dashboard...'],
        navigate: '/dashboard'
      })
    },
    {
      name: 'email',
      description: 'Copy email',
      handler: () => {
        navigator.clipboard.writeText('hello@example.com');
        return { output: ['Email copied!'] };
      }
    }
  ];

  return customCommands;
}

// In your component:
const customCommands = useTerminalCommands();
<TerminalSearch customCommands={customCommands} />
```

These examples should give you plenty of ideas for extending the terminal with your own custom functionality!
