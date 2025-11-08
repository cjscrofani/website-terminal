import { TerminalProvider } from '@/components/terminal-provider'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            React Terminal Search
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            A retro terminal-style search interface for Next.js
          </p>
          <div className="flex items-center justify-center gap-4">
            <kbd className="px-4 py-2 bg-purple-800/50 text-white rounded-lg border border-purple-500/50 text-sm font-mono">
              ⌘ K
            </kbd>
            <span className="text-purple-200">or</span>
            <kbd className="px-4 py-2 bg-purple-800/50 text-white rounded-lg border border-purple-500/50 text-sm font-mono">
              Ctrl K
            </kbd>
            <span className="text-purple-200">to open terminal</span>
          </div>
        </div>

        {/* Commands Demo */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Try These Commands
          </h2>
          <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border border-purple-500/30 font-mono">
            <div className="space-y-3 text-green-400">
              <div className="flex items-center gap-2">
                <span className="text-green-500">❯</span>
                <code>help</code>
                <span className="text-purple-300 text-sm ml-auto">Show available commands</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">❯</span>
                <code>ls</code>
                <span className="text-purple-300 text-sm ml-auto">List all pages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">❯</span>
                <code>cd blog</code>
                <span className="text-purple-300 text-sm ml-auto">Navigate to blog</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">❯</span>
                <code>grep project</code>
                <span className="text-purple-300 text-sm ml-auto">Search for "project"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">❯</span>
                <code>meow</code>
                <span className="text-purple-300 text-sm ml-auto">Easter egg 🐱</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Component */}
      <TerminalProvider />
    </main>
  )
}
