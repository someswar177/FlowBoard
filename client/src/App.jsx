// src/App.jsx

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 👈 1. Import motion
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

  // 👇 2. Add a state to track if we are on a desktop-sized screen
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      // We only want the sidebar to auto-open/close on resize, not be forced
      if (isLargeScreen !== isDesktop) {
        setIsSidebarOpen(isLargeScreen);
        setIsDesktop(isLargeScreen);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDesktop]); // Depend on isDesktop

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

  // 👇 3. Define animation variants for the main content area
  const mainVariants = {
    open: {
      marginLeft: isDesktop ? '288px' : '0px', // 288px is w-72 from Tailwind
    },
    closed: {
      marginLeft: '0px',
    },
  };

  return (
    <>
      {/* 👇 4. Change the parent div slightly to handle overflow correctly */}
      <div className="relative h-screen bg-gray-100 text-foreground overflow-hidden">
        <Sidebar
          onNewProject={() => handleOpenProjectModal()}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        {/* 👇 5. Change <main> to <motion.main> and add animation props */}
        <motion.main
          className="flex-1 h-full" // Changed from overflow-hidden to h-full
          variants={mainVariants}
          animate={isSidebarOpen ? 'open' : 'closed'}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }} // MUST match sidebar's transition
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

// App and AppProvider remain the same...
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;