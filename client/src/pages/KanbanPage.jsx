import { motion } from 'framer-motion';
import { Plus, ChevronLeft, Sparkles, Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskModal from '../components/modals/TaskModal';
import AIPanel from '../components/ai/AIPanel';
import { projectService } from '../api/projectService';
import { taskService } from '../api/taskService';
import { useApp } from '../context/AppContext';
import { Navigate } from "react-router-dom";
import ConfirmModal from '../components/modals/ConfirmModal';

export default function KanbanPage({ onToggleSidebar, isSidebarOpen }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useApp();
  const hasLoadedRef = useRef(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);


  const fetchProjectData = useCallback(async () => {
    try {
      if (!projectId) return;

      if (hasLoadedRef.current) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      const fetchedProject = await projectService.getById(projectId, true);
      setProject(fetchedProject);
      const tasks = fetchedProject.tasks || [];
      const initialColumns = {};

      const defaultColumns = ["To Do", "In Progress", "Done"];
      const customColumns = fetchedProject.columnOrder || [];
      const columnOrder = [...new Set([...defaultColumns, ...customColumns])];

      columnOrder.forEach((columnName) => {
        initialColumns[columnName] = {
          id: columnName,
          title: columnName,
          tasks: [],
        };
      });

      tasks.forEach((task) => {
        if (task.status && initialColumns[task.status]) {
          initialColumns[task.status].tasks.push(task);
        }
      });

      Object.values(initialColumns).forEach((col) => {
        col.tasks.sort((a, b) => a.order - b.order);
      });

      setColumns(initialColumns);
      hasLoadedRef.current = true;
    } catch (error) {
      showToast(`Failed to load project: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, showToast]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleRenameColumn = async (columnId, newTitle) => {
    console.log(columnId,newTitle)

    try {
      await projectService.update(projectId, { 
        oldName: columnId, 
        newName: newTitle 
      });
      showToast('Column renamed successfully!', 'success');
      
      await fetchProjectData(); 

    } catch (error) {
      showToast(`Failed to rename column: ${error.message}`, 'error');
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const originalColumns = JSON.parse(JSON.stringify(columns));
    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];
    const sourceTasks = [...sourceCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    let updatedColumns = { ...columns };
    let tasksToUpdate = [];

    if (sourceColId === destColId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      const reorderedTasks = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      updatedColumns[sourceColId] = { ...sourceCol, tasks: reorderedTasks };
      tasksToUpdate = reorderedTasks.map(({ _id, order, status }) => ({ _id, order, status }));
    } else {
      const destTasks = [...destCol.tasks];
      destTasks.splice(destination.index, 0, movedTask);
      const newSourceTasks = sourceTasks.map((task, index) => ({
        ...task,
        order: index,
      }));
      const newDestTasks = destTasks.map((task, index) => ({
        ...task,
        status: destColId,
        order: index,
      }));
      updatedColumns[sourceColId] = { ...sourceCol, tasks: newSourceTasks };
      updatedColumns[destColId] = { ...destCol, tasks: newDestTasks };
      tasksToUpdate = [
        ...newSourceTasks.map(({ _id, order, status }) => ({ _id, order, status })),
        ...newDestTasks.map(({ _id, order, status }) => ({ _id, order, status })),
      ];
    }

    setColumns(updatedColumns);

    try {
      await taskService.updateOrder(tasksToUpdate);
    } catch (error) {
      showToast(`Failed to move task: ${error.message}`, 'error');
      setColumns(originalColumns);
    }
  };

  const handleSaveTask = async (data) => {
    try {
      if (selectedTask) {
        await taskService.update(selectedTask._id, data);
        showToast('Task updated!');
      } else {
        await projectService.createTask(projectId, { ...data, status: selectedColumnId });
        showToast('Task created!');
      }
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to save task: ${error.message}`, 'error');
    } finally {
      setShowTaskModal(false);
      setSelectedTask(null);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await taskService.delete(taskToDelete);
      showToast('Task deleted!');
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to delete task: ${error.message}`, 'error');
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };


  const handleOpenCreateModal = (columnId) => {
    setSelectedColumnId(columnId);
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddNewColumn = async () => {
    const trimmedName = newColumnName.trim();
    if (!trimmedName) {
      showToast('Column name cannot be empty.', 'error');
      return;
    }
    if (columns[trimmedName]) {
      showToast('A column with this name already exists.', 'error');
      return;
    }
    try {
      await projectService.addColumn(projectId, trimmedName);
      showToast('Column added!', 'success');
      setNewColumnName('');
      setIsAddingColumn(false);
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to add column: ${error.message}`, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-slate-50">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            {!isSidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <div className="min-w-0 flex-1 animate-pulse">
              <div className="h-6 sm:h-8 bg-slate-200 rounded w-48 mb-1"></div>
              <div className="h-3 sm:h-4 bg-slate-200 rounded w-32 hidden sm:block"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-6 h-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[280px] sm:w-86 bg-white/50 border-2 border-slate-200 rounded-2xl shadow-sm animate-pulse"
              >
                <div className="p-3 sm:p-4 border-b border-slate-200">
                  <div className="h-8 bg-slate-200 rounded-lg w-32 mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                </div>
                <div className="p-2 sm:p-3 space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="p-3 sm:p-4 bg-white rounded-xl border border-slate-200">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/" replace />;
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
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </motion.button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{project.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
              Manage tasks and track progress
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-md transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">AI Assistant</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="sm:hidden p-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddingColumn(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 sm:w-auto rounded-lg border-2 border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-sm sm:text-base font-medium justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Column</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-6">
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(result) => {
            setIsDragging(false);
            handleDragEnd(result);
          }}
        >
          <div className="flex items-start gap-3 sm:gap-6 min-w-min h-full pb-4">
            {columns &&
              Object.values(columns).map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided, snapshot) => (
                    <KanbanColumn
                      projectId={projectId}
                      column={column}
                      isDraggingOver={snapshot.isDraggingOver}
                      isDragging={isDragging}
                      onAddTask={() => handleOpenCreateModal(column.id)}
                      onEditTask={(task) => handleOpenEditModal(task)}
                      onDeleteTask={handleDeleteTask}
                      onRenameColumn={handleRenameColumn}
                      droppableProvided={provided}
                    />
                  )}
                </Droppable>
              ))}
            {isAddingColumn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col rounded-2xl border-2 border-slate-200 bg-slate-50/80 shadow-sm w-[280px] sm:w-86 p-3 sm:p-4"
              >
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter column name..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNewColumn()}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                />
                <div className="flex items-center gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddingColumn(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 sm:w-auto rounded-lg border-2 border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-sm sm:text-base font-medium justify-center sm:justify-start"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Add Column</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsAddingColumn(false)}
                    className="p-2 hover:bg-slate-200/60 rounded-lg"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </DragDropContext>
      </div>

      {showTaskModal && (
        <TaskModal task={selectedTask} onClose={() => setShowTaskModal(false)} onSave={handleSaveTask} />
      )}

      {showAIPanel && <AIPanel projectContext={project} onClose={() => setShowAIPanel(false)} />}

      {showConfirmModal && (
        <ConfirmModal
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={confirmDeleteTask}
          onCancel={() => {
            setShowConfirmModal(false);
            setTaskToDelete(null);
          }}
        />
      )}
    </div>
  );
}