import { useState, useEffect } from 'react';
import { projectService } from '../api/projectService';
import { ProjectCard } from '../components/project/ProjectCard';
import { ProjectForm } from '../components/project/ProjectForm';
import { Modal } from '../components/common/Modal';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { showToast } = useApp();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      showToast('Failed to load projects', 'error');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSubmitProject = async (formData) => {
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
        showToast('Project updated successfully');
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? { ...p, ...formData } : p))
        );
      } else {
        const newProject = await projectService.create(formData);
        showToast('Project created successfully');
        setProjects([...projects, newProject]);
      }
      setIsModalOpen(false);
    } catch (error) {
      showToast(
        `Failed to ${editingProject ? 'update' : 'create'} project`,
        'error'
      );
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      return;
    }

    try {
      await projectService.delete(project.id);
      showToast('Project deleted successfully');
      setProjects(projects.filter((p) => p.id !== project.id));
    } catch (error) {
      showToast('Failed to delete project', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your projects and track tasks</p>
        </div>
        <button onClick={handleCreateProject} className="btn-primary flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Project</span>
        </button>
      </motion.div>

      {projects.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="No projects yet"
          description="Get started by creating your first project"
          action={
            <button onClick={handleCreateProject} className="btn-primary">
              Create Project
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProjectCard
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmitProject}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
