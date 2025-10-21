import { motion } from 'framer-motion';
import { Menu, Plus } from 'lucide-react';

export default function ProjectsPageSkeleton({ onToggleSidebar, isSidebarOpen }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const shimmer = {
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 sm:p-6 z-10 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Projects</h1>
              <p className="text-slate-500 mt-1 text-sm sm:text-base">Select a project or create a new one</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 sm:p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-soft relative overflow-hidden"
            >
              <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="h-5 sm:h-6 bg-slate-200 rounded w-3/4 mb-2 relative overflow-hidden" style={shimmer}></div>
                    <div className="h-4 bg-slate-200 rounded w-full mb-1 relative overflow-hidden" style={shimmer}></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3 relative overflow-hidden" style={shimmer}></div>
                  </div>
                  <div className="w-4 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-3 bg-slate-200 rounded w-20 relative overflow-hidden" style={shimmer}></div>
                    <div className="h-3 bg-slate-200 rounded w-16 relative overflow-hidden" style={shimmer}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}