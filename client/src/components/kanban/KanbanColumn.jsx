// src/components/kanban/KanbanColumn.jsx
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Sparkles, X, Edit2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useState, useRef, useEffect } from 'react';
import ColumnSummarizer from '../ai/ColumnSummarizer';

export default function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onRenameColumn, // ADDED: Prop to handle renaming
}) {
  const [showSummarizer, setShowSummarizer] = useState(false);
  // ADDED: State to manage the column options dropdown
  const [showOptions, setShowOptions] = useState(false);
  // ADDED: State to manage when the column is in editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const inputRef = useRef(null);

  const colorMap = {
    'To Do': 'bg-blue-500/10 border-blue-500/20',
    'In Progress': 'bg-amber-500/10 border-amber-500/20',
    'Done': 'bg-green-500/10 border-green-500/20',
  };
  const titleColorMap = {
    'To Do': 'text-blue-600 dark:text-blue-400',
    'In Progress': 'text-amber-600 dark:text-amber-400',
    'Done': 'text-green-600 dark:text-green-400',
  };
  
  // ADDED: Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // ADDED: Handler to save the new column title
  const handleRename = () => {
    if (newTitle.trim() && newTitle.trim() !== column.title) {
      onRenameColumn(column.id, newTitle.trim());
    }
    setIsEditing(false);
    setShowOptions(false);
  };
  
  // ADDED: Handler for keyboard events in the input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewTitle(column.title);
      setIsEditing(false);
      setShowOptions(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col h-full rounded-xl border ${colorMap[column.id] || 'bg-muted/50 border-border'} relative`}
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="font-semibold bg-transparent border-b-2 border-primary focus:outline-none w-full"
            />
          ) : (
            <h3 className={`font-semibold ${titleColorMap[column.id] || 'text-foreground'}`}>{column.title}</h3>
          )}

          <div className="flex items-center gap-1 relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSummarizer(!showSummarizer)}
              className="p-1 rounded hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Summarize with AI"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
            {/* ADDED: Logic for the column options menu */}
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 w-32 bg-violet-50 border border-border rounded-lg shadow-lg z-20"
              >
                <button
                  onClick={() => { setIsEditing(true); setShowOptions(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Edit2 className="w-3 h-3" /> Rename
                </button>
              </motion.div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{column.tasks.length} tasks</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {column.tasks.map((task, index) => (
          <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided, snapshot) => (
              <motion.div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                whileHover={{ y: -2 }}
                onClick={() => onEditTask(task)}
                className={`p-3 rounded-lg bg-card border border-border cursor-grab active:cursor-grabbing transition-all group ${
                  snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </Draggable>
        ))}
      </div>

      <div className="p-3 border-t border-border/50">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Task</span>
        </motion.button>
      </div>

      {showSummarizer && (
        <ColumnSummarizer
          columnTitle={column.title}
          tasks={column.tasks}
          onClose={() => setShowSummarizer(false)}
        />
      )}
    </motion.div>
  );
}