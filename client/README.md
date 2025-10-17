# TaskFlow - Project & Task Management System

A modern, professional project and task management application built with React, Vite, and Tailwind CSS.

## Features

- **Project Management**: Create, edit, and delete projects with descriptions
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **Task Operations**: Create, edit, delete, and move tasks between columns
- **AI Assistant**: Context-aware AI helper for task summaries and Q&A
- **Responsive Design**: Fully responsive UI that works on all devices
- **Smooth Animations**: Fluid micro-interactions using Framer Motion

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **@hello-pangea/dnd** - Drag and drop for Kanban board
- **Framer Motion** - Animation library

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # React components
│   ├── ai/          # AI Assistant
│   ├── common/      # Reusable components
│   ├── layout/      # Layout components
│   ├── project/     # Project-related components
│   └── task/        # Task-related components
├── context/         # React Context for state management
├── pages/           # Page components
└── utils/           # Utility functions
```

## API Endpoints

The application expects these REST API endpoints:

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/tasks` - Get project tasks
- `POST /api/projects/:id/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/ai/summarize` - Get AI summary
- `POST /api/ai/ask` - Ask AI a question

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Design Principles

- Clean, professional UI inspired by modern PM tools
- Consistent color palette with blue accents
- Smooth animations and transitions
- Intuitive user experience
- Responsive across all devices
