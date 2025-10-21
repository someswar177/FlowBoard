import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Calendar,
  FileText,
  Trash2,
  Edit2,
  Menu,
  Plus,
  Inbox,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../api/projectService';
import { useApp } from '../context/AppContext';
import ProjectsPageSkeleton from '../components/ui/ProjectsPageSkeleton';
import ConfirmModal from '../components/modals/ConfirmModal';
export default function ProjectsPage({
  onEditProject,
  onNewProject,
  onToggleSidebar,
  isSidebarOpen,
  isLoading = false,
}) {
  const { projects, setProjects, showToast } = useApp();
  const [showMenu, setShowMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };

    if (showMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleDeleteProject = async (id) => {
    setShowMenu(null);
    try {
      await projectService.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
      showToast('Project deleted successfully!');
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleOpenEditModal = (project) => {
    onEditProject(project);
    setShowMenu(null);
  };

  if (isLoading) {
    return (
      <ProjectsPageSkeleton
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-sky-50/40">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-20 shadow-sm"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-blue-500/5" />

          <div className="relative px-4 sm:px-8 py-5 sm:py-6">
            <div className="flex items-center justify-between max-w-[1600px] mx-auto">
              <div className="flex items-center gap-4">
                {!isSidebarOpen && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onToggleSidebar}
                    className="p-2.5 hover:bg-slate-100/80 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    <Menu className="w-5 h-5 text-slate-700" />
                  </motion.button>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Projects
                    </h1>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span className="text-xs font-semibold text-white">{projects.length}</span>
                    </motion.div>
                  </div>
                  <p className="text-slate-600 mt-1.5 text-sm sm:text-base font-medium">
                    Manage and organize your work efficiently
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onNewProject}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 sm:w-auto rounded-lg border-2 border-dashed border-blue-400 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-sm sm:text-base font-medium justify-center sm:justify-start"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="hidden sm:inline text-blue-500">New Project</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative px-4 sm:px-8 py-6 sm:py-8">
        <div className="max-w-[1600px] mx-auto">
          {projects.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        delay: index * 0.05,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 }
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                    }}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 cursor-pointer hover:border-sky-300/60 transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-sky-500/10 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-blue-500/0 group-hover:from-sky-500/5 group-hover:to-blue-500/5 transition-all duration-500" />

                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 group-hover:scale-125 transition-transform duration-300" />
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors duration-300 truncate">
                              {project.name}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 group-hover:text-slate-700 transition-colors">
                            {project.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="relative" ref={showMenu === project._id ? menuRef : null}>
                          <motion.button
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowMenu(showMenu === project._id ? null : project._id);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all duration-200"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>

                          <AnimatePresence>
                            {showMenu === project._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <motion.button
                                    whileHover={{ x: 4, backgroundColor: 'rgb(248 250 252)' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEditModal(project);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all text-left text-slate-700 font-medium"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Edit Project</span>
                                  </motion.button>
                                  <div className="h-px bg-slate-100 mx-2" />
                                  <motion.button
                                    whileHover={{ x: 4, backgroundColor: 'rgb(254 242 242)' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirm(project);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-all text-left font-medium"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Project</span>
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 group-hover:border-sky-100 transition-colors">
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1.5 text-slate-500 group-hover:text-sky-600 transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 group-hover:bg-sky-50 rounded-lg text-slate-600 group-hover:text-sky-600 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{project.taskCount ?? 0}</span>
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <TrendingUp className="w-4 h-4 text-sky-500" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center py-20 sm:py-32"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/20 to-blue-400/20 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-full border-2 border-slate-200">
                  <Inbox className="w-16 h-16 text-slate-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center max-w-md"
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  No Projects Yet
                </h3>
                <p className="text-slate-600 text-base leading-relaxed mb-6">
                  Start your journey by creating your first project. Organize your tasks and boost your productivity.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNewProject}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Project</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <ConfirmModal
            title="Delete Project"
            message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
            onConfirm={() => handleDeleteProject(deleteConfirm._id)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}