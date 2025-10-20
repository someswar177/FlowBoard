# FlowBoard Frontend (React + Vite)

[![React](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

This is the frontend for FlowBoard, a modern project management application. It's a responsive Single Page Application (SPA) built with React (using Vite) and styled with Tailwind CSS. It provides a rich user interface for managing projects and tasks on a Kanban board.


---

## ✨ Features

- **Project Dashboard:** A clean overview of all your projects, showing their name, description, and task count.
- **Interactive Kanban Board:** A Trello-like board with columns and draggable task cards.
- **Seamless CRUD Operations:** Intuitive modals for creating and editing projects and tasks without leaving the page.
- **AI-Powered Assistant:**
    - **Project Summarizer:** A pop-over that generates an AI summary of the current project's status and health.
    - **Q&A Panel:** A slide-out chat panel to ask the AI questions about the project.
- **Real-time Feedback:** Toast notifications for actions like creating, updating, or deleting items.
- **Loading Skeletons:** Smooth loading states ensure a great user experience while data is being fetched.
- **Fluid Animations:** Interface animations powered by `Framer Motion` make interactions feel natural and engaging.
- **Fully Responsive:** Designed to work beautifully on all screen sizes, from mobile phones to large desktops.

---

## 🛠️ Tech Stack & Libraries

- **Framework:** React.js (Vite)
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **API Communication:** Axios
- **Drag & Drop:** @hello-pangea/dnd
- **Icons:** Lucide React
- **Markdown Parsing:** Marked (for rendering AI responses)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A running instance of the [FlowBoard Backend API](https://github.com/your-username/backend-repo-link).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/frontend-repo-name.git](https://github.com/your-username/frontend-repo-name.git)
    cd frontend-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the following:
    ```env
    # The base URL of the backend API
    VITE_API_URL=http://localhost:5000/api
    ```
    *Replace `http://localhost:5000/api` with the actual URL if your backend is running elsewhere.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles the application for production into the `dist` folder.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run preview`: Serves the production build locally to preview it.

---