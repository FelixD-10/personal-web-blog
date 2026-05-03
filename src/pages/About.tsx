import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/BlogComponents';

export default function About() {
  return (
    <div>

      {/* Mission */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader title="About Me" />

        <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
          <p>I’m a full-stack web developer focused on building simple and practical web applications.</p>
          <p>I specialize in landing pages, blog systems, and admin dashboards using React, Node.js, and MongoDB.</p>
          <p>This blog is where I share real projects, case studies, and development process.</p>
          <p>My goal is to build fast, clean, and functional web systems that help businesses launch quickly.</p>
          <p>If you need a landing page or MVP, feel free to contact me.</p>
        </div>
      </section>
      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What I Focus On" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
             {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Real, working products',
              description: 'I build systems that are not just ideas — they are deployed and usable.',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Fast delivery',
              description: 'I focus on shipping quickly without sacrificing structure and maintainability.',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 8c-3.866 0-7 1.79-7 4v4h14v-4c0-2.21-3.134-4-7-4zm0-4a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              ),
              title: 'Practical solutions',
              description: 'Every project is designed to solve a real business need, not just showcase code.',
            }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="text-indigo-600 mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader title="Built With" subtitle="The technology behind this blog" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'React', desc: 'Frontend UI' },
            { name: 'Express', desc: 'Backend API' },
            { name: 'MongoDB', desc: 'Database' },
            { name: 'Tailwind', desc: 'Styling' },
            { name: 'TypeScript', desc: 'Type Safety' },
            { name: 'JWT', desc: 'Authentication' },
            { name: 'Mongoose', desc: 'ODM' },
            { name: 'Vite', desc: 'Build Tool' },
          ].map((tech) => (
            <div key={tech.name} className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="font-semibold text-gray-900">{tech.name}</p>
              <p className="text-xs text-gray-500 mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want to get in touch?</h2>
          <p className="text-indigo-100 mb-6">We would love to hear from you.</p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
