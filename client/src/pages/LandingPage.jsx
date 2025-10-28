import React from 'react';
import { Logo, ThemeSwitcher, TwitterIcon, GitHubIcon, LinkedInIcon, CollaborationIcon, DashboardIconSvg, TasksIcon } from '../components/Icons';

const LandingPage = ({ navigate, theme, setTheme }) => {
  const features = [
    {
      icon: <CollaborationIcon />,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with shared boards, real-time updates, and instant feedback loops.',
    },
    {
      icon: <DashboardIconSvg />,
      title: 'Dynamic Project Boards',
      description: 'Visualize your workflow with customizable Kanban boards. Drag, drop, and conquer your tasks.',
    },
    {
      icon: <TasksIcon />,
      title: 'Intelligent Task Assignment',
      description: 'Assign tasks, set priorities, and track progress with an intuitive and powerful interface.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="font-bold text-xl text-slate-800 dark:text-white">Synergize</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <button onClick={() => navigate('auth', 'signIn')} className="hidden md:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Sign In
          </button>
          <button onClick={() => navigate('auth', 'signUp')} className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl px-4 py-2 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40">
            Get Started
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="text-center py-20 md:py-32 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Organize Your Team,
            </span>
            <br />
            Achieve Your Goals.
          </h1>
          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-8">
            Synergize is the minimalist, futuristic platform designed to bring clarity and efficiency to your team's workflow.
          </p>
          <button onClick={() => navigate('auth', 'signUp')} className="text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl px-8 py-4 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-indigo-500/40">
            Start for Free
          </button>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Why Synergize?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} style={{ animationDelay: `${index * 150}ms` }} className="animate-fadeIn will-change-transform bg-white dark:bg-slate-800/60 p-8 rounded-3xl shadow-lg hover:shadow-2xl dark:shadow-slate-900/50 transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
                  <div className="mb-4 inline-block p-3 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400">
          <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Logo />
                        <span className="font-bold text-xl text-slate-800 dark:text-white">Synergize</span>
                      </div>
                      <p className="text-sm">The future of team productivity.</p>
                      <div className="flex space-x-4 mt-4 text-slate-500 dark:text-slate-400">
                          <a href="#" className="hover:text-indigo-500 transition-colors"><TwitterIcon /></a>
                          <a href="#" className="hover:text-indigo-500 transition-colors"><GitHubIcon /></a>
                          <a href="#" className="hover:text-indigo-500 transition-colors"><LinkedInIcon /></a>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Product</h3>
                      <ul className="space-y-2 text-sm">
                          <li><a href="#" className="hover:text-indigo-500 transition-colors">Features</a></li>
                          <li><a href="#" className="hover:text-indigo-500 transition-colors">Pricing</a></li>
                          <li><a href="#" className="hover:text-indigo-500 transition-colors">Integrations</a></li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Company</h3>
                      <ul className="space-y-2 text-sm">
                          <li><a href="#" className="hover:text-indigo-500 transition-colors">About Us</a></li>
                          <li><a href="#" className="hover:text-indigo-500 transition-colors">Careers</a></li>
                          <li><a href="#" className="hover:text-indigo-500 transition-colors">Contact</a></li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Stay Updated</h3>
                      <p className="text-sm mb-3">Get the latest news and updates.</p>
                      <form className="flex">
                          <input type="email" placeholder="Your email" className="w-full text-sm rounded-l-xl p-2 bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" />
                          <button className="bg-indigo-600 text-white p-2 rounded-r-xl text-sm font-semibold hover:bg-indigo-500 transition-colors">Subscribe</button>
                      </form>
                  </div>
              </div>
              <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm">
                  <p>&copy; {new Date().getFullYear()} Synergize Inc. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;