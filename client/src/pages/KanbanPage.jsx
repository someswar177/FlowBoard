// src/pages/KanbanPage.jsx
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskModal from '../components/modals/TaskModal';
import AIPanel from '../components/ai/AIPanel';
import { projectService } from '../api/projectService';
import { taskService } from '../api/taskService';
import { useApp } from '../context/AppContext';

// The hardcoded titles are now just fallbacks. The actual title will come from the project data.
const COLUMN_CONFIG = {
  'To Do': { title: 'To Do' },
  'In Progress': { title: 'In Progress' },
  'Done': { title: 'Done' },
};


export default function KanbanPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState('');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const { showToast } = useApp();

  const fetchProjectData = useCallback(async () => {
    try {
      if (!projectId) return;
      setIsLoading(true);
      const fetchedProject = await projectService.getById(projectId, true);
      setProject(fetchedProject);
      const tasks = fetchedProject.tasks || [];
      
      // Initialize columns from the config
      const initialColumns = {};
      Object.keys(COLUMN_CONFIG).forEach(key => {
        initialColumns[key] = {
          id: key,
          // Use the title from project data if it exists, otherwise use the fallback
          title: fetchedProject.columnNames?.[key] || COLUMN_CONFIG[key].title,
          tasks: []
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
    } catch (error) {
      showToast(`Failed to load project: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, showToast]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // ADDED: Handler to process column renaming
  const handleRenameColumn = async (columnId, newTitle) => {
    const oldTitle = columns[columnId].title;
    // Optimistically update the UI
    const updatedColumns = {
      ...columns,
      [columnId]: { ...columns[columnId], title: newTitle },
    };
    setColumns(updatedColumns);

    try {
      // Update the project on the backend
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
      // Revert on error
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
      fetchProjectData();
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
        fetchProjectData();
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
    return <div className="flex items-center justify-center h-full text-muted-foreground">Loading Project Board...</div>;
  }
  
  if (!project) {
     return <div className="flex items-center justify-center h-full text-destructive">Could not load project. Please go back and try again.</div>;
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 border-b border-border"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">Manage tasks and track progress</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            AI Assistant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenCreateModal(Object.keys(COLUMN_CONFIG)[0])} // Default to the first column
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 min-w-min h-full">
            {columns && Object.values(columns).map((column, index) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-shrink-0 w-96 transition-colors h-full"
                  >
                    <KanbanColumn
                      column={column}
                      onAddTask={() => handleOpenCreateModal(column.id)}
                      onEditTask={(task) => handleOpenEditModal(task)}
                      onDeleteTask={handleDeleteTask}
                      onRenameColumn={handleRenameColumn} // Pass the handler down
                    />
                    {provided.placeholder}
                  </motion.div>
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