import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../api/projectService';
import { taskService } from '../api/taskService';
import { useApp } from '../context/AppContext';

/**
 * @desc Custom hook for managing all Kanban board logic for a single project.
 * @returns {object} State and handler functions for the Kanban board.
 */
export function useKanban() {
  const { projectId } = useParams();
  const { showToast } = useApp();
  
  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }

    try {
      const fetchedProject = await projectService.getById(projectId, true);
      setProject(fetchedProject);

      const tasks = fetchedProject.tasks || [];
      const columnOrder = (fetchedProject.columnOrder?.length > 0)
        ? fetchedProject.columnOrder
        : ["To Do", "In Progress", "Done"];

      const initialColumns = columnOrder.reduce((acc, colName) => {
          acc[colName] = { id: colName, title: colName, tasks: [] };
          return acc;
      }, {});

      tasks.forEach((task) => {
        if (task.status && initialColumns[task.status]) {
          initialColumns[task.status].tasks.push(task);
        }
      });

      Object.values(initialColumns).forEach(col => col.tasks.sort((a, b) => a.order - b.order));
      
      setColumns(initialColumns);
      hasLoadedRef.current = true;
    } catch (error) {
      showToast(`Failed to load project: ${error.message}`, 'error');
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, showToast]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const saveTask = async (taskData, taskId) => {
    try {
      if (taskId) {
        await taskService.update(taskId, taskData);
        showToast('Task updated!');
      } else {
        await projectService.createTask(projectId, taskData);
        showToast('Task created!');
      }
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to save task: ${error.message}`, 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      showToast('Task deleted!');
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to delete task: ${error.message}`, 'error');
    }
  };

  const addColumn = async (columnName) => {
    if (!columnName.trim()) {
      showToast('Column name cannot be empty.', 'error');
      return;
    }
    if (columns && columns[columnName.trim()]) {
      showToast('A column with this name already exists.', 'error');
      return;
    }
    try {
      await projectService.addColumn(projectId, columnName.trim());
      showToast('Column added!', 'success');
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to add column: ${error.message}`, 'error');
    }
  };
  
  const renameColumn = async (oldName, newName) => {
     try {
      await projectService.update(projectId, { oldName, newName });
      showToast('Column renamed successfully!', 'success');
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to rename column: ${error.message}`, 'error');
    }
  };

  const deleteColumn = async (columnName) => {
    try {
      await projectService.deleteColumn(projectId, columnName);
      showToast('Column deleted successfully!');
      await fetchProjectData();
    } catch (error) {
      showToast(`Failed to delete column: ${error.message}`, 'error');
    }
  };
  
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];
    
    const sourceTasks = [...sourceCol.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);
    const updatedColumns = JSON.parse(JSON.stringify(columns));

    if (sourceColId === destColId) {
        sourceTasks.splice(destination.index, 0, movedTask);
        updatedColumns[sourceColId].tasks = sourceTasks;
    } else {
        const destTasks = [...destCol.tasks];
        destTasks.splice(destination.index, 0, movedTask);
        updatedColumns[sourceColId].tasks = sourceTasks;
        updatedColumns[destColId].tasks = destTasks;
    }
    
    let tasksToUpdateApi = [];
    Object.values(updatedColumns).forEach(col => {
        col.tasks.forEach((task, index) => {
            if (task.order !== index || task.status !== col.id) {
                task.order = index;
                task.status = col.id;
                tasksToUpdateApi.push({ _id: task._id, order: task.order, status: task.status });
            }
        });
    });

    setColumns(updatedColumns);

    try {
      if (tasksToUpdateApi.length > 0) {
        await taskService.updateOrder(tasksToUpdateApi);
      }
    } catch (error) {
      showToast(`Failed to move task: ${error.message}`, 'error');
      setColumns(columns);
    }
  };

  return {
    project,
    columns,
    isLoading,
    fetchProjectData,
    saveTask,
    deleteTask,
    addColumn,
    renameColumn,
    deleteColumn,
    handleDragEnd,
  };
}