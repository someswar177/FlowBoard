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
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../api/projectService';
import { useApp } from '../context/AppContext';
import ProjectsPageSkeleton from '../components/ui/ProjectsPageSkeleton';

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
  const deleteButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

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

  useEffect(() => {
    if (deleteConfirm) {
      setTimeout(() => {
        deleteButtonRef.current?.focus();
      }, 100);
    }
  }, [deleteConfirm]);

  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setDeleteConfirm(null);
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (document.activeElement === deleteButtonRef.current) {
        cancelButtonRef.current?.focus();
      }
    }
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (document.activeElement === cancelButtonRef.current) {
        deleteButtonRef.current?.focus();
      }
    }
  };

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

  // --- FIX: Add this block to render the skeleton ---
  // If the page is loading, return the skeleton component first.
  if (isLoading) {
    return (
      <ProjectsPageSkeleton
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    );
  }
  // --- END OF FIX ---

  // If not loading, return the main page content.
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 p-4 sm:p-6 z-10 shadow-sm"
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
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onNewProject}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 sm:w-auto rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-sm sm:text-base font-medium justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">New Project</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 sm:p-6">
        {/*
          --- FIX: The '!isLoading &&' check is removed ---
          It's no longer needed because the 'if (isLoading)'
          block above already handles the loading state.
        */}
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
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    whileHover={{
                      y: -6,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    }}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-6 cursor-pointer hover:border-blue-300 transition-all relative shadow-md"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-8">
                        <h3 className="text-base sm:text-lg font-bold group-hover:text-blue-600 transition-colors truncate text-slate-900">
                          {project.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {project.description || 'No description provided.'}
                        </p>
                      </div>
                      <div className="relative" ref={showMenu === project._id ? menuRef : null}>
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
                              className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditModal(project);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left text-slate-700"
                              >
                                <Edit2 className="w-4 h-4" /> Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ x: 4 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm(project);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors text-left"
                              >
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
              <p className="mt-2 text-sm text-slate-500">Click "New Project" to get started.</p>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={() => setDeleteConfirm(null)} // Close on overlay click
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()} // Stop click from bubbling to overlay
              onKeyDown={handleModalKeyDown} // Add keyboard handler
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Delete Project?</h3>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong> and all its tasks?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  ref={cancelButtonRef}
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"                >
                  Cancel
                </button>
                <button
                  ref={deleteButtonRef}
                  onClick={() => handleDeleteProject(deleteConfirm._id)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}