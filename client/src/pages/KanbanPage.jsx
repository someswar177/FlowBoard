import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, Sparkles, Menu } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { useKanban } from '../hooks/useKanban';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskModal from '../components/modals/TaskModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import AIPanel from '../components/ai/AIPanel';
import KanbanPageSkeleton from '../components/kanban/KanbanPageSkeleton';
import AddColumnForm from '../components/kanban/AddColumnForm';

export default function KanbanPage({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const {
    project,
    columns,
    isLoading,
    saveTask,
    deleteTask,
    addColumn,
    renameColumn,
    deleteColumn,
    handleDragEnd,
  } = useKanban();

  const [isDragging, setIsDragging] = useState(false);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  
  const [showConfirmDeleteTask, setShowConfirmDeleteTask] = useState(null);
  const [showConfirmDeleteColumn, setShowConfirmDeleteColumn] = useState(null);

  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleOpenCreateModal = (columnId) => {
    setSelectedColumnId(columnId);
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = (formData) => {
    saveTask({ ...formData, status: selectedColumnId }, selectedTask?._id);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return <KanbanPageSkeleton isSidebarOpen={isSidebarOpen} onToggleSidebar={onToggleSidebar} />;
  }

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-white shadow-sm"
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {!isSidebarOpen && (
            <button onClick={onToggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <motion.button whileHover={{ x: -4 }} onClick={() => navigate('/projects')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </motion.button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{project.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Manage tasks and track progress</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowAIPanel(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-md transition-all text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">AI Assistant</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsAddingColumn(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Column</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-6">
        <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={(result) => { setIsDragging(false); handleDragEnd(result); }}>
          <div className="flex items-start gap-3 sm:gap-6 min-w-min h-full pb-4">
            {columns && Object.values(columns).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <KanbanColumn
                    projectId={project._id}
                    column={column}
                    isDraggingOver={snapshot.isDraggingOver}
                    isDragging={isDragging}
                    onAddTask={() => handleOpenCreateModal(column.id)}
                    onEditTask={handleOpenEditModal}
                    onDeleteTask={(taskId) => setShowConfirmDeleteTask(taskId)}
                    onRenameColumn={renameColumn}
                    onDeleteColumn={(columnId) => setShowConfirmDeleteColumn(columnId)}
                    droppableProvided={provided}
                  />
                )}
              </Droppable>
            ))}
            {isAddingColumn && <AddColumnForm onAddColumn={addColumn} onCancel={() => setIsAddingColumn(false)} />}
          </div>
        </DragDropContext>
      </div>

      {showTaskModal && (
        <TaskModal task={selectedTask} onClose={() => setShowTaskModal(false)} onSave={handleSaveTask} />
      )}
      {showAIPanel && <AIPanel projectContext={project} onClose={() => setShowAIPanel(false)} />}
      {showConfirmDeleteTask && (
        <ConfirmModal
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={() => { deleteTask(showConfirmDeleteTask); setShowConfirmDeleteTask(null); }}
          onCancel={() => setShowConfirmDeleteTask(null)}
        />
      )}
      {showConfirmDeleteColumn && (
        <ConfirmModal
          title="Delete Column"
          message={`Are you sure you want to delete the "${showConfirmDeleteColumn}" column? All tasks within it will be permanently deleted.`}
          onConfirm={() => { deleteColumn(showConfirmDeleteColumn); setShowConfirmDeleteColumn(null); }}
          onCancel={() => setShowConfirmDeleteColumn(null)}
        />
      )}
    </div>
  );
}