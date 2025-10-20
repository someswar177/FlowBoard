# FlowBoard Frontend (React + Vite)

[![React](https://img.shields.io/badge/React-Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

This is the frontend for FlowBoard, a modern project management application. It's a responsive Single Page Application (SPA) built with React (using Vite) and styled with Tailwind CSS. It provides a rich user interface for managing projects and tasks on a Kanban board.

**Live Demo:** **[https://flow-board-ivory.vercel.app/](https://flow-board-ivory.vercel.app/)**

**Backend API:** This frontend consumes the [FlowBoard Backend API](https://flowboard-0syv.onrender.com/).

---

## ✨ Features

- [cite_start]**Project Dashboard:** A clean overview of all your projects, showing their name, description, and task count[cite: 289, 301, 307].
- [cite_start]**Interactive Kanban Board:** A Trello-like board with columns and draggable task cards[cite: 206, 277].
- [cite_start]**Seamless CRUD Operations:** Intuitive modals for creating and editing projects and tasks without leaving the page[cite: 137, 154].
- **AI-Powered Assistant:**
    - [cite_start]**Project Summarizer:** A pop-over that generates an AI summary of the current project's status and health[cite: 44, 52].
    - [cite_start]**Q&A Panel:** A slide-out chat panel to ask the AI questions about the project[cite: 13, 19].
- [cite_start]**Real-time Feedback:** Toast notifications for actions like creating, updating, or deleting items[cite: 187, 202].
- [cite_start]**Loading Skeletons:** Smooth loading states ensure a great user experience while data is being fetched[cite: 171, 261].
- [cite_start]**Fluid Animations:** Interface animations powered by `Framer Motion` make interactions feel natural and engaging[cite: 359].
- **Fully Responsive:** Designed to work beautifully on all screen sizes, from mobile phones to large desktops.

---

## 🛠️ Tech Stack & Libraries

- **Framework:** React.js (Vite)
- [cite_start]**Routing:** React Router [cite: 339]
- [cite_start]**Styling:** Tailwind CSS [cite: 368]
- [cite_start]**Animations:** Framer Motion [cite: 389]
- [cite_start]**API Communication:** Axios [cite: 389]
- [cite_start]**Drag & Drop:** @hello-pangea/dnd [cite: 389]
- [cite_start]**Icons:** Lucide React [cite: 389]
- [cite_start]**Markdown Parsing:** Marked (for rendering AI responses) [cite: 15, 389]

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- A running instance of the backend API.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/someswar177/FlowBoard.git](https://github.com/someswar177/FlowBoard.git)
    cd FlowBoard/client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the `/client` directory and add the following:
    ```env
    # For local development against a local backend server
    VITE_API_URL=http://localhost:5000/api

    # To connect to the live, deployed backend
    # VITE_API_URL=[https://flowboard-0syv.onrender.com/api](https://flowboard-0syv.onrender.com/api)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles the application for production into the `dist` folder.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run preview`: Serves the production build locally to preview it.

---