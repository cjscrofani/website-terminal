"use client";

import { useState, useEffect, useRef, KeyboardEvent, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { parseCommand, SiteData, CommandResult, CustomCommand } from "../lib/terminal-commands";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface HistoryEntry {
  command: string;
  result: CommandResult;
}

export interface TerminalSearchProps {
  siteData: SiteData;
  customCommands?: CustomCommand[];
  triggerButton?: ReactNode;
  welcomeMessage?: string[];
  terminalTitle?: string;
  shortcutKey?: string; // default: "k"
  shortcutModifier?: "ctrl" | "meta" | "both"; // default: "both"
}

export function TerminalSearch({
  siteData,
  customCommands,
  triggerButton,
  welcomeMessage,
  terminalTitle = "terminal",
  shortcutKey = "k",
  shortcutModifier = "both",
}: TerminalSearchProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const defaultWelcome = [
    'Welcome to the terminal search interface.',
    'Type "help" to see available commands.',
  ];

  // Keyboard shortcut to open terminal
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const matchesModifier =
        shortcutModifier === "both"
          ? e.metaKey || e.ctrlKey
          : shortcutModifier === "meta"
          ? e.metaKey
          : e.ctrlKey;

      if (matchesModifier && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey, shortcutModifier]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const result = parseCommand(input, siteData, customCommands);

    // Add to command history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Handle clear command
    if (result.clear) {
      setHistory([]);
      setInput("");
      return;
    }

    // Add to display history
    setHistory(prev => [...prev, { command: input, result }]);
    setInput("");

    // Handle navigation
    if (result.navigate) {
      setTimeout(() => {
        router.push(result.navigate!);
        setOpen(false);
        setHistory([]);
      }, 500);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);

      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {triggerButton || (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 bg-background border rounded-lg shadow-lg hover:shadow-xl transition-all group"
          aria-label="Open terminal search"
        >
          <span className="text-sm font-mono">{terminalTitle}</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-muted rounded">
            <span className="text-xs">⌘</span>
            {shortcutKey.toUpperCase()}
          </kbd>
        </button>
      )}

      {/* Terminal Dialog */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 max-w-3xl h-[600px] max-h-[80vh] translate-x-[-50%] translate-y-[-50%] p-0 gap-0 bg-black/95 border border-green-500/30 font-mono overflow-hidden flex flex-col shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <div className="flex flex-col h-full w-full">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-green-500/30 bg-green-950/20 flex-shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer flex items-center justify-center group relative"
                    aria-label="Close terminal"
                  >
                    <span className="absolute text-[8px] font-bold text-black opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </span>
                  </button>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-green-400 text-sm ml-2">{terminalTitle}</span>
              </div>

              {/* Terminal Output */}
              <div
                ref={outputRef}
                className="terminal-output flex-1 overflow-y-auto p-4 space-y-2 min-h-0"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(34, 197, 94, 0.3) transparent'
                }}
              >
                {/* Welcome Message */}
                {history.length === 0 && (
                  <div className="text-green-400/70 text-sm space-y-1 mb-4">
                    {(welcomeMessage || defaultWelcome).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    <p className="text-green-400/50 text-xs mt-2">
                      Press {shortcutModifier === "meta" ? "Cmd" : shortcutModifier === "ctrl" ? "Ctrl" : "Cmd/Ctrl"}+
                      {shortcutKey.toUpperCase()} to toggle terminal
                    </p>
                  </div>
                )}

                {/* Command History */}
                {history.map((entry, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">❯</span>
                      <span className="text-green-300">{entry.command}</span>
                    </div>
                    {entry.result.output.length > 0 && (
                      <div
                        className={`ml-4 text-sm ${
                          entry.result.error ? "text-red-400" : "text-green-400/80"
                        }`}
                      >
                        {entry.result.output.map((line, lineIdx) => (
                          <div key={lineIdx} className="whitespace-pre-wrap break-words">
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-green-500/30 bg-green-950/20 flex-shrink-0"
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="text-green-400">❯</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-green-300 outline-none placeholder:text-green-400/30 caret-green-400"
                    placeholder="Type a command..."
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
