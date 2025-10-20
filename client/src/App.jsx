import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import KanbanPage from './pages/KanbanPage';
import { AppProvider, useApp } from './context/AppContext';
import ProjectModal from './components/modals/ProjectModal';
import { projectService } from './api/projectService';
import Toast from './components/ui/Toast';

function AppContent() {
  const { projects, setProjects, showToast, toast, setToast } = useApp();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024;
  });
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      if (isLargeScreen !== isDesktop) {
        setIsSidebarOpen(isLargeScreen);
        setIsDesktop(isLargeScreen);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktop]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const fetchedProjects = await projectService.getAll(true);
        setProjects(fetchedProjects);
      } catch (error) {
        showToast(`Failed to load projects: ${error.message}`, 'error');
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [setProjects, showToast]);

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
        setProjects([newProject, ...projects]);
        showToast('Project created successfully!');
      }
    } catch (error) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      handleCloseProjectModal();
    }
  };

  const handleToastClose = () => {
    setToast(null);
  };

  const mainVariants = {
    open: {
      marginLeft: isDesktop ? '288px' : '0px',
    },
    closed: {
      marginLeft: '0px',
    },
  };

  return (
    <>
      <div className="relative h-screen bg-gray-100 text-foreground overflow-hidden">
        <Sidebar
          onNewProject={() => handleOpenProjectModal()}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <motion.main
          className="flex-1 h-full"
          variants={mainVariants}
          animate={isSidebarOpen ? 'open' : 'closed'}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route
              path="/projects"
              element={
                <ProjectsPage
                  onEditProject={handleOpenProjectModal}
                  onNewProject={() => handleOpenProjectModal()}
                  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isSidebarOpen={isSidebarOpen}
                  isLoading={isLoadingProjects}
                />
              }
            />
            <Route
              path="/projects/:projectId"
              element={
                <KanbanPage
                  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isSidebarOpen={isSidebarOpen}
                />
              }
            />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Routes>
        </motion.main>
      </div>

      {isProjectModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={handleCloseProjectModal}
          onSave={handleSaveProject}
        />
      )}

      {toast && (
        <Toast
          key={toast.message + (toast.type || '')}
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
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