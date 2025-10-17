import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';

export const KanbanColumn = ({ column, tasks, onEditTask, onDeleteTask }) => {
  const columnColors = {
    'To Do': 'from-gray-500 to-gray-600',
    'In Progress': 'from-blue-500 to-blue-600',
    'Done': 'from-green-500 to-green-600',
  };

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="card overflow-hidden h-full flex flex-col">
        <div
          className={`px-4 py-3 bg-gradient-to-r ${
            columnColors[column.id] || columnColors['To Do']
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{column.title}</h3>
            <span className="bg-white bg-opacity-30 text-white text-xs font-medium px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
        </div>

        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 p-4 overflow-y-auto min-h-[200px] transition-colors ${
                snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Drop tasks here
                </div>
              ) : (
                tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};
