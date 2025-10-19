import { motion } from 'framer-motion';
import { MoreVertical, Calendar, FileText, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../api/projectService';
import { useApp } from '../context/AppContext';

export default function ProjectsPage({ onEditProject }) {
  const { projects, setProjects, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await projectService.getAll(true);
        setProjects(fetchedProjects);
      } catch (error) {
        showToast(`Failed to load projects: ${error.message}`, 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [setProjects, showToast]);

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-6 z-10 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-500 mt-1">Select a project or create a new one</p>
          </div>
        </div>
      </motion.div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <p className="text-slate-500">Loading projects...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                variants={itemVariants}
                whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="group bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-blue-300 transition-all relative shadow-soft"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors truncate text-slate-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
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
                    {showMenu === project._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-medium z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors text-left text-slate-700"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ x: 4 }}
                          onClick={(e) => { e.stopPropagation(); handleDeleteProject(project._id); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors text-left"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      {`${project.taskCount ?? 0} tasks`}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}