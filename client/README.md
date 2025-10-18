# TaskFlow - Project Management System

A modern, feature-rich project management application built with Vite, React, and Tailwind CSS. This application provides an intuitive Kanban board interface for managing projects and tasks, enhanced with AI-powered features.

## Features

- **Project Management**: Create, edit, and organize multiple projects
- **Kanban Board**: Drag-and-drop task management with customizable columns (To Do, In Progress, Done)
- **AI Assistant**:
  - Floating AI panel for Q&A about your projects
  - Column-level AI summarization for quick insights
- **Modern UI/UX**: Smooth animations and transitions using Framer Motion
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Clean Architecture**: Well-organized component structure following best practices

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Drag & Drop**: @hello-pangea/dnd
- **Routing**: React Router DOM v6
- **Icons**: Lucide React

## Project Structure

```
src/
├── api/               # API client and service functions
│   └── apiClient.js   # Backend API integration
├── components/
│   ├── ai/           # AI-related components
│   │   ├── AIPanel.jsx
│   │   └── ColumnSummarizer.jsx
│   ├── kanban/       # Kanban board components
│   │   └── KanbanColumn.jsx
│   ├── layout/       # Layout components
│   │   └── Sidebar.jsx
│   └── modals/       # Modal dialogs
│       ├── ProjectModal.jsx
│       └── TaskModal.jsx
├── pages/            # Page components
│   ├── ProjectsPage.jsx
│   └── KanbanPage.jsx
├── utils/            # Utility functions
│   └── cn.js         # Tailwind merge utility
├── App.jsx           # Main app component
└── main.jsx          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow-vite-react
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your backend API URL:
```
VITE_API_URL=http://localhost:3000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Backend Integration

This frontend application requires a backend API with the following endpoints:

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project

### Tasks
- `GET /api/projects/:id/tasks` - Get tasks for a project
- `POST /api/projects/:id/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### AI Features
- `POST /api/ai/ask` - Ask AI assistant a question
- `POST /api/ai/summarize` - Generate column summary

## Features Overview

### Project Management
- Create and organize multiple projects
- View project details including creation date and task count
- Edit or delete existing projects
- Navigate between projects seamlessly

### Kanban Board
- Default columns: To Do, In Progress, Done
- Drag and drop tasks between columns
- Create tasks directly in any column
- Edit or delete tasks inline
- Visual feedback during drag operations

### AI Integration
- **AI Assistant Panel**: Ask questions about your projects and get intelligent responses
- **Column Summarizer**: Get AI-generated summaries of tasks in each column
- Contextual AI features integrated throughout the interface

### UI/UX Highlights
- Smooth animations and micro-interactions
- Responsive design for all screen sizes
- Dark mode support (via Tailwind CSS)
- Clean, modern interface
- Intuitive navigation

## Development Notes

- All components use `.jsx` extension (no TypeScript)
- Path aliases configured with `@/` pointing to `src/`
- Tailwind CSS for styling with custom design system
- Framer Motion for animations
- Industry-standard folder structure

## License

This project is created for educational and portfolio purposes.

## Contact

For questions or feedback, please reach out to the project maintainer.