import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../api/projectService';
import { useApp } from '../context/AppContext';

/**
 * @desc Custom hook for managing project-related state and actions.
 * @returns {object} State and handler functions for projects.
 */
export function useProjects() {
  const { projects, setProjects, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
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
  
  const openProjectModal = (project = null) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };
  
  const closeProjectModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const saveProject = async (formData) => {
    try {
      if (editingProject) {
        const updatedProject = await projectService.update(editingProject._id, formData);
        setProjects(projects.map((p) => (p._id === editingProject._id ? { ...p, ...updatedProject } : p)));
        showToast('Project updated successfully!');
      } else {
        const newProject = await projectService.create(formData);
        setProjects([newProject, ...projects]);
        showToast('Project created successfully!');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      closeProjectModal();
    }
  };

  const deleteProject = async (projectId) => {
      try {
        await projectService.delete(projectId);
        setProjects(projects.filter((p) => p._id !== projectId));
        showToast('Project deleted successfully!');
      } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
      }
  };

  return {
    projects,
    isLoading,
    isModalOpen,
    editingProject,
    openProjectModal,
    closeProjectModal,
    saveProject,
    deleteProject,
  };
}