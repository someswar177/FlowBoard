import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';

import Sidebar from './components/layout/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import KanbanPage from './pages/KanbanPage';
import ProjectModal from './components/modals/ProjectModal';
import Toast from './components/ui/Toast';
import { useProjects } from './hooks/useProjects';

function AppContent() {
  const { toast, setToast } = useApp();
  const {
    isLoading,
    isModalOpen,
    editingProject,
    openProjectModal,
    closeProjectModal,
    saveProject,
    deleteProject,
  } = useProjects();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

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

  const mainVariants = {
    open: { marginLeft: isDesktop ? '288px' : '0px' },
    closed: { marginLeft: '0px' },
  };

  return (
    <>
      <div className="relative h-screen bg-gray-100 overflow-hidden">
        <Sidebar
          onNewProject={() => openProjectModal()}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <motion.main
          className="h-full"
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
                  onEditProject={openProjectModal}
                  onNewProject={() => openProjectModal()}
                  onDeleteProject={deleteProject}
                  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isSidebarOpen={isSidebarOpen}
                  isLoading={isLoading}
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

      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={closeProjectModal}
          onSave={saveProject}
        />
      )}
      
      {toast && (
        <Toast
          key={Date.now()}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}