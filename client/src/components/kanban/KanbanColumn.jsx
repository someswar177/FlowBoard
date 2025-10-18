// src/components/kanban/KanbanColumn.jsx
import { motion } from 'framer-motion';
import { Plus, MoreVertical, Sparkles, X } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import ColumnSummarizer from '../ai/ColumnSummarizer';

export default function KanbanColumn({ column, onAddTask, onEditTask, onDeleteTask }) {
  const [showSummarizer, setShowSummarizer] = useState(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col h-full rounded-xl border ${colorMap[column.id] || 'bg-muted/50 border-border'} relative`}
    >
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold ${titleColorMap[column.id] || 'text-foreground'}`}>{column.title}</h3>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSummarizer(!showSummarizer)}
              className="p-1 rounded hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
              title="Summarize with AI"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ rotate: 90 }} className="p-1 rounded hover:bg-muted/50 transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </motion.button>
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
                // The 'layout' prop has been removed from here to fix jerky drag-and-drop
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