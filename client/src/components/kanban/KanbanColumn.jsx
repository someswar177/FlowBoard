import { motion } from 'framer-motion';
import {
  Plus,
  Sparkles,
  X,
  CircleDashed,
  CircleDot,
  CheckCircle2,
} from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import ColumnSummarizer from '../ai/ColumnSummarizer';

export default function KanbanColumn({
  column,
  isDraggingOver,
  isDragging,
  onAddTask,
  onEditTask,
  onDeleteTask,
  droppableProvided,
}) {
  const [showSummarizer, setShowSummarizer] = useState(false);
  const colorMap = {
    'To Do': 'bg-blue-50/80 border-blue-200',
    'In Progress': 'bg-amber-50/80 border-amber-200',
    'Done': 'bg-emerald-50/80 border-emerald-200',
  };
  const badgeColorMap = {
    'To Do': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    'Done': 'bg-emerald-100 text-emerald-700',
  };
  const headerBadgeColorMap = {
    'To Do': 'bg-blue-600',
    'In Progress': 'bg-amber-600',
    'Done': 'bg-emerald-600',
  };
  const statusIconMap = {
    'To Do': CircleDashed,
    'In Progress': CircleDot,
    'Done': CheckCircle2,
  };
  const IconComponent = statusIconMap[column.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col max-h-full rounded-2xl border-2 ${
        colorMap[column.id] || 'bg-slate-50/80 border-slate-200'
      } relative shadow-sm w-[280px] sm:w-86`}
    >
      <div className="p-3 sm:p-4 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-white font-semibold text-xs sm:text-sm ${
              headerBadgeColorMap[column.id] || 'bg-slate-500'
            }`}
          >
            {IconComponent && <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={3.2} />}
            <span>{column.title.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-1 relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSummarizer(!showSummarizer)}
              className="p-1.5 rounded-lg hover:bg-white/60 transition-colors text-slate-600 hover:text-blue-600"
              title="Summarize with AI"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.button>
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold ${
            badgeColorMap[column.id] || 'bg-slate-100 text-slate-700'
          }`}
        >
          {column.tasks.length} {column.tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div
        ref={droppableProvided ? droppableProvided.innerRef : null}
        {...(droppableProvided ? droppableProvided.droppableProps : {})}
        className={`p-2 sm:p-3 space-y-2 sm:space-y-2.5 transition-[height] duration-200 ease-in-out ${
          column.tasks.length > 3 ? 'overflow-y-auto' : 'overflow-visible'
        } ${isDraggingOver && column.tasks.length > 3 ? 'pb-24' : ''} ${
          isDragging && column.tasks.length === 0 ? 'min-h-[4.5rem]' : ''
        }`}
      >
        {column.tasks.map((task, index) => (
          <Draggable key={task._id} draggableId={task._id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => onEditTask(task)}
                className={`p-3 sm:p-4 rounded-xl bg-white border border-slate-200 cursor-grab active-cursor-grabbing group hover:shadow-md transition-all ${
                  snapshot.isDragging ? 'shadow-strong ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm mb-1.5 text-slate-900 group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all rounded-lg hover:bg-red-50 flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </Draggable>
        ))}

        {droppableProvided && droppableProvided.placeholder}
      </div>

      <div className="p-2 sm:p-3 border-t border-slate-200/60">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-semibold">Add Task</span>
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