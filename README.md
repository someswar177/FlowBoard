# FlowBoard: AI-Powered Kanban Project Management App

[![React](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

FlowBoard is a modern, full-stack project and task management system built with the MERN stack. It features an intuitive, Trello-like Kanban board interface with robust drag-and-drop functionality. The standout feature is the integration of Google's Gemini AI, which provides intelligent project summaries and an interactive Q&A assistant to enhance productivity.

**Live Demo:** `[Link to your deployed application]`


---

## ✨ Core Features

### Project & Task Management
- **Project CRUD:** Create, read, update, and delete projects, each with a name and description.
- **Task CRUD:** Within each project, create, read, update, and delete tasks (cards).
- **Persistent State:** All project and task data is securely stored in MongoDB, ensuring changes are saved across sessions.
- **Custom Columns:** Add custom columns to any project board beyond the default "To Do", "In Progress", and "Done".

### Interactive Kanban Board
- **Visual Workflow:** A clean, responsive Kanban board to visualize project progress.
- **Drag & Drop:** Seamlessly move tasks between columns to update their status. The order is persisted in the database.
- **Responsive UI:** The interface is fully responsive, providing a great user experience on both desktop and mobile devices.
- **Smooth Animations:** Built with `Framer Motion` for fluid animations and a delightful user experience.

### 🤖 AI-Powered Assistant (Gemini Integration)
- **AI Project Summary:** Generate a comprehensive "Project Health Check" with a single click. The AI analyzes task distribution, progress, and potential risks, then provides actionable next steps.
- **AI Q&A Panel:** Open an interactive chat panel to ask questions about the current project (e.g., "What are the next steps?", "Which tasks are in progress?"). The AI provides concise, context-aware answers based on the project's data.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                              |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend** | [React.js](https://reactjs.org/) (with Vite), [React Router](https://reactrouter.com/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Axios](https://axios-http.com/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)                                                                     |
| **Database** | [MongoDB](https://www.mongodb.com/) (with Mongoose)                                                                                     |
| **AI** | [Google Gemini AI](https://ai.google.dev/)                                                                                             |
| **Drag & Drop**| [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)                                                                                 |
| **UI Icons** | [Lucide React](https://lucide.dev/)                                                                                                     |

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB (local instance or a cloud service like MongoDB Atlas)
- A Google Gemini API Key

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Backend Setup

Navigate to the `server` directory and set up the environment variables.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:

```env
# Your MongoDB connection string
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>

# The port for the backend server
PORT=5000

# Your Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 3. Frontend Setup

Navigate to the `client` directory and set up the environment variables.

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory and add the following variable:

```env
# The base URL of your backend API
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

You'll need two separate terminal windows to run both the backend and frontend servers concurrently.

**In the first terminal (from the project root):**

```bash
# Start the backend server
cd server
npm run start
```

**In the second terminal (from the project root):**

```bash
# Start the frontend Vite development server
cd client
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

---

## 📜 Available Scripts

### Backend (`/server`)

- `npm run start`: Starts the backend server with `nodemon` for automatic restarts on file changes.

### Frontend (`/client`)

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the React app for production.
- `npm run lint`: Lints the code using ESLint.

---