// src/App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import KanbanPage from './pages/KanbanPage';
import { AppProvider, useApp } from './context/AppContext';
import ProjectModal from './components/modals/ProjectModal';
import { projectService } from './api/projectService';

function AppContent() {
  const { projects, setProjects, showToast } = useApp();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleOpenProjectModal = (project = null) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = async (formData) => {
    try {
      if (editingProject) {
        const updatedProject = await projectService.update(editingProject._id, formData);
        setProjects(projects.map((p) => (p._id === editingProject._id ? updatedProject : p)));
        showToast('Project updated successfully!');
      } else {
        const newProject = await projectService.create(formData);
        setProjects([...projects, newProject]);
        showToast('Project created successfully!');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      handleCloseProjectModal();
    }
  };

  return (
    <>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar onNewProject={() => handleOpenProjectModal()} />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route
              path="/projects"
              element={<ProjectsPage onEditProject={handleOpenProjectModal} />}
            />
            <Route path="/projects/:projectId" element={<KanbanPage />} />
          </Routes>
        </main>
      </div>
      {isProjectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={handleCloseProjectModal}
          onSave={handleSaveProject}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;