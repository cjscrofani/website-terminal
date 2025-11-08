export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-8">About</h1>
        <div className="max-w-3xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
            <p className="text-lg text-purple-200 mb-4">
              This is a demo of the React Terminal Search component - a retro
              terminal-style search interface for Next.js applications.
            </p>
            <p className="text-lg text-purple-200 mb-4">
              The terminal provides Unix-like commands for navigating your site,
              including <code className="bg-black/30 px-2 py-1 rounded">cd</code>,{' '}
              <code className="bg-black/30 px-2 py-1 rounded">ls</code>,{' '}
              <code className="bg-black/30 px-2 py-1 rounded">grep</code>, and more.
            </p>
            <p className="text-lg text-purple-200">
              Press <kbd className="bg-purple-800/50 px-2 py-1 rounded">⌘K</kbd> or{' '}
              <kbd className="bg-purple-800/50 px-2 py-1 rounded">Ctrl+K</kbd> to
              open the terminal and try it out!
            </p>
          </div>
        </div>

        <a
          href="/"
          className="inline-block mt-8 text-purple-300 hover:text-purple-200"
        >
          ← Back to home
        </a>
      </div>
    </main>
  );
}
