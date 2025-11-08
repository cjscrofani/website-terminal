export default function ProjectsPage() {
  const projects = [
    {
      slug: 'project-alpha',
      title: 'Project Alpha',
      description: 'An amazing open source project',
      tech: ['React', 'TypeScript', 'Next.js'],
    },
    {
      slug: 'project-beta',
      title: 'Project Beta',
      description: 'Another cool project to explore',
      tech: ['Node.js', 'Express', 'PostgreSQL'],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-8">Projects</h1>
        <p className="text-xl text-purple-200 mb-12">
          Open source projects and demos
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:border-purple-400 transition-all"
            >
              <h2 className="text-2xl font-semibold text-white mb-3">
                {project.title}
              </h2>
              <p className="text-purple-200 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
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
