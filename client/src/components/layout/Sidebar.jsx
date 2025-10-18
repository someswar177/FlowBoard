// src/components/layout/Sidebar.jsx
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectService } from '../../api/projectService';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ onNewProject }) {
  const { projects, setProjects } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const { projectId: selectedProjectId } = useParams(); // Get the active project ID from the URL

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
      className="w-72 bg-card border-r border-border flex flex-col"
    >
      <div className="p-6 border-b border-border">
        <Link to="/projects">
          <h1 className="text-xl font-bold">Kanban Pro</h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Projects
          </h2>
          <div className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading projects...</p>
            ) : (
              projects.map((project) => (
                <Link to={`/projects/${project._id}`} key={project._id}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedProjectId === project._id
                        ? 'bg-primary/20 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="text-sm font-medium truncate">{project.name}</span>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewProject}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Project</span>
        </motion.button>
      </div>
      <div className="p-4 border-t border-border">{/* ... User Profile ... */}</div>
    </motion.aside>
  );
}