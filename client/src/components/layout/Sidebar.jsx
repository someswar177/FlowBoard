import { motion } from 'framer-motion';
import { Plus, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectService } from '../../api/projectService';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ onNewProject }) {
  const { projects, setProjects } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const { projectId: selectedProjectId } = useParams();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const fetchedProjects = await projectService.getAll();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [setProjects]);

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm"
    >
      <div className="p-6 border-b border-slate-100">
        <Link to="/projects">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">TaskFlow</h1>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Projects
          </h2>
          <div className="space-y-1">
            {isLoading ? (
              <p className="text-sm text-slate-400 px-3 py-2">Loading projects...</p>
            ) : (
              projects.map((project) => (
                <Link to={`/projects/${project._id}`} key={project._id}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                      selectedProjectId === project._id
                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm truncate block">{project.name}</span>
                  </motion.div>
                </Link>
              ))
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
  );
}