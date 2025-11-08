export default function BlogPage() {
  const posts = [
    {
      slug: 'getting-started',
      title: 'Getting Started with React Terminal Search',
      date: '2024-01-15',
      excerpt: 'Learn how to integrate the terminal into your Next.js app',
    },
    {
      slug: 'custom-commands',
      title: 'Creating Custom Commands',
      date: '2024-01-20',
      excerpt: 'Extend the terminal with your own commands',
    },
    {
      slug: 'styling-guide',
      title: 'Styling and Customization',
      date: '2024-01-25',
      excerpt: 'Customize the look and feel of your terminal',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-8">Blog</h1>
        <p className="text-xl text-purple-200 mb-12">
          Latest articles and tutorials
        </p>

        <div className="grid gap-6 max-w-3xl">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:border-purple-400 transition-all"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-purple-300 mb-3">{post.date}</p>
              <p className="text-purple-200">{post.excerpt}</p>
            </article>
          ))}
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
