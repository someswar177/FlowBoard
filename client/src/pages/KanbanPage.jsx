import { motion } from 'framer-motion';
import { Plus, ChevronLeft, Sparkles, Menu } from 'lucide-react';
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

const COLUMN_CONFIG = {
  'To Do': { title: 'To Do' },
  'In Progress': { title: 'In Progress' },
  'Done': { title: 'Done' },
};

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
      Object.keys(COLUMN_CONFIG).forEach((key) => {
        initialColumns[key] = {
          id: key,
          title: fetchedProject.columnNames?.[key] || COLUMN_CONFIG[key].title,
          tasks: [],
        };
      });

      tasks.forEach((task) => {
        if (initialColumns[task.status]) {
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
    const oldTitle = columns[columnId].title;
    const updatedColumns = {
      ...columns,
      [columnId]: { ...columns[columnId], title: newTitle },
    };
    setColumns(updatedColumns);

    try {
      const currentColumnNames = project.columnNames || {
        'To Do': 'To Do',
        'In Progress': 'In Progress',
        'Done': 'Done',
      };
      const newColumnNames = { ...currentColumnNames, [columnId]: newTitle };
      await projectService.update(projectId, { columnNames: newColumnNames });
      showToast('Column renamed!');
    } catch (error) {
      showToast(`Failed to rename column: ${error.message}`, 'error');
      const revertedColumns = {
        ...columns,
        [columnId]: { ...columns[columnId], title: oldTitle },
      };
      setColumns(revertedColumns);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startCol = columns[source.droppableId];
    const endCol = columns[destination.droppableId];
    const originalColumns = JSON.parse(JSON.stringify(columns));

    const startTasks = Array.from(startCol.tasks);
    const [movedTask] = startTasks.splice(source.index, 1);

    if (startCol === endCol) {
      startTasks.splice(destination.index, 0, movedTask);
      const reorderedTasks = startTasks.map((task, index) => ({ ...task, order: index }));
      const newColumns = {
        ...columns,
        [startCol.id]: { ...startCol, tasks: reorderedTasks },
      };
      setColumns(newColumns);
    } else {
      const endTasks = Array.from(endCol.tasks);
      endTasks.splice(destination.index, 0, { ...movedTask, status: endCol.id });
      const newStartTasks = startTasks.map((task, index) => ({ ...task, order: index }));
      const newEndTasks = endTasks.map((task, index) => ({ ...task, order: index }));
      const newColumns = {
        ...columns,
        [startCol.id]: { ...startCol, tasks: newStartTasks },
        [endCol.id]: { ...endCol, tasks: newEndTasks },
      };
      setColumns(newColumns);
    }

    try {
      await taskService.update(draggableId, {
        status: destination.droppableId,
        order: destination.index,
      });
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

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        showToast('Task deleted!');
        await fetchProjectData();
      } catch (error) {
        showToast(`Failed to delete task: ${error.message}`, 'error');
      }
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
    // return (
    //   <div className="flex items-center justify-center h-full text-red-600">
    //     Could not load project. Please go back and try again.
    //   </div>
    // );
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
            onClick={() => handleOpenCreateModal(Object.keys(COLUMN_CONFIG)[0])}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Column</span>
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
                      column={column}
                      isDraggingOver={snapshot.isDraggingOver}
                      isDragging={isDragging}
                      onAddTask={() => handleOpenCreateModal(column.id)}
                      onEditTask={(task) => handleOpenEditModal(task)}
                      onDeleteTask={handleDeleteTask}
                      onRenameColumn={handleRenameColumn}
                      droppableProvided={provided}
                      droppableSnapshot={snapshot}
                    />
                  )}
                </Droppable>
              ))}
          </div>
        </DragDropContext>
      </div>

      {showTaskModal && (
        <TaskModal task={selectedTask} onClose={() => setShowTaskModal(false)} onSave={handleSaveTask} />
      )}

      {showAIPanel && <AIPanel projectContext={project} onClose={() => setShowAIPanel(false)} />}
    </div>
  );
}
