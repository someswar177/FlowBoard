import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, X, PanelLeftClose } from 'lucide-react';
// 👇 1. Import `useLocation` instead of `useParams`
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const PROJECT_COLORS = [
  'bg-blue-200', 'bg-orange-200', 'bg-green-200', 'bg-indigo-200',
  'bg-pink-200', 'bg-yellow-200', 'bg-red-200', 'bg-teal-200',
  'bg-cyan-200', 'bg-lime-200', 'bg-emerald-200', 'bg-sky-200',
  'bg-violet-200', 'bg-purple-200', 'bg-fuchsia-200', 'bg-rose-200',
  'bg-amber-200', 'bg-gray-200', 'bg-slate-200', 'bg-zinc-200',
  'bg-neutral-200', 'bg-stone-200', 'bg-red-300', 'bg-teal-300',
  'bg-cyan-300', 'bg-lime-300', 'bg-violet-300', 'bg-purple-300',
  'bg-fuchsia-300', 'bg-rose-300', 'bg-amber-300', 'bg-gray-300',
];

export default function Sidebar({ onNewProject, isOpen, onToggle }) {
  const { projects } = useApp();
  // 👇 2. Use `useLocation` to get the current URL path
  const location = useLocation();

  // 👇 3. Extract the project ID from the URL path
  // For a URL like "/projects/xyz123", this code will get "xyz123"
  const pathParts = location.pathname.split('/');
  const selectedProjectId = pathParts.length === 3 && pathParts[1] === 'projects' 
    ? pathParts[2] 
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
            onClick={onToggle}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-lg fixed inset-y-0 left-0 z-40"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <Link to="/projects">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">FlowBoard</h1>
                  </div>
                </Link>
                <button
                  onClick={onToggle}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Close sidebar"
                >
                  <X className="w-5 h-5 text-slate-600 lg:hidden" />
                  <PanelLeftClose className="w-5 h-5 text-slate-600 hidden lg:block" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">
                  Projects
                </h2>
                <div className="space-y-1">
                  {projects.length === 0 ? (
                    <p className="text-sm italic text-slate-400 px-3 py-2">No projects yet</p>
                  ) : (
                    projects.map((project, index) => {
                      const dotColor = PROJECT_COLORS[index % PROJECT_COLORS.length];
                      const name = String(project?.name ?? 'Untitled');
                      return (
                        <Link to={`/projects/${project._id}`} key={project._id}>
                          <motion.div
                            whileHover={{ x: 2 }}
                            // 👇 4. This comparison will now work correctly!
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                              selectedProjectId === project._id
                                ? 'bg-blue-50 text-blue-700 shadow-sm'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
                              <span className="text-sm truncate font-medium">{name}</span>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onNewProject}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Project</span>
              </motion.button>
            </div>

            <div className="p-4 border-t border-slate-100">
              <div className="text-xs text-slate-400">v1.0.0</div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}