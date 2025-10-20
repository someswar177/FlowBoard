import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Calendar, FileText, Trash2, Edit2, Menu, Plus, Inbox } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../api/projectService';
import { useApp } from '../context/AppContext';

export default function ProjectsPage({
  onEditProject,
  onNewProject,
  onToggleSidebar,
  isSidebarOpen,
  isLoading = false,
}) {
  const { projects, setProjects, showToast } = useApp();
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  const handleDeleteProject = async (id) => {
    setShowMenu(null);
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await projectService.delete(id);
        setProjects(projects.filter((p) => p._id !== id));
        showToast('Project deleted successfully!');
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
      }
    }
  };

  const handleOpenEditModal = (project) => {
    onEditProject(project);
    setShowMenu(null);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
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
              <p className="text-slate-500 mt-1 text-sm sm:text-base">
                Select a project or create a new one
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewProject}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 sm:p-6">
        {/* ---- CHANGE START: Simplified logic to prevent flicker ---- */}
        
        {/* This part shows ONLY when loading */}
        {isLoading && (
          <motion.div
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-soft relative overflow-hidden"
              >
                <div className="animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="h-5 sm:h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                    <div className="w-4 h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-3 bg-slate-200 rounded w-20"></div>
                      <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* This part shows ONLY when NOT loading */}
        {!isLoading && (
          <div>
            {projects.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                <AnimatePresence>
                  {projects.map((project) => (
                    <motion.div
                      key={project._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      whileHover={{
                        y: -4,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      }}
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 cursor-pointer hover:border-blue-300 transition-all relative shadow-soft"
                    >
                      {/* Card Content... */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-8">
                          <h3 className="text-base sm:text-lg font-bold group-hover:text-blue-600 transition-colors truncate text-slate-900">
                            {project.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {project.description || 'No description provided.'}
                          </p>
                        </div>
                        <div className="relative">
                          <motion.button
                            whileHover={{ rotate: 90 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenu(showMenu === project._id ? null : project._id);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                          <AnimatePresence>
                            {showMenu === project._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-medium z-50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <motion.button whileHover={{ x: 4 }} onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left text-slate-700">
                                  <Edit2 className="w-4 h-4" /> Edit
                                </motion.button>
                                <motion.button whileHover={{ x: 4 }} onClick={(e) => { e.stopPropagation(); handleDeleteProject(project._id); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors text-left">
                                  <Trash2 className="w-4 h-4" /> Delete
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {`${project.taskCount ?? 0} tasks`}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Inbox className="w-16 h-16 mx-auto text-slate-300" />
                <h3 className="mt-4 text-xl font-semibold text-slate-600">No Projects Yet</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Click "New Project" to get started.
                </p>
              </motion.div>
            )}
          </div>
        )}
        {/* ---- CHANGE END ---- */}
      </div>
    </div>
  );
}