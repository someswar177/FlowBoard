# FlowBoard API (Node.js, Express, MongoDB)

[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blueviolet?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

This repository contains the backend API for FlowBoard, a project management application. It is a RESTful API built with Node.js, Express, and Mongoose for interacting with a MongoDB database. It includes a powerful integration with Google's Gemini AI to provide intelligent data analysis features.

---

## ✨ Features

- **RESTful Architecture:** A well-structured API for managing projects and tasks.
- **Full CRUD for Projects:** Endpoints to create, read, update, and delete projects. Also supports adding custom columns to a project's board.
- **Full CRUD for Tasks:** Endpoints to create, read, update, and delete tasks within a project.
- **Efficient Task Reordering:** A dedicated endpoint (`/tasks/update-order`) that uses `bulkWrite` to efficiently update the status and order of multiple tasks at once after a drag-and-drop operation.
- **Gemini AI Integration:**
    - **Summarization Endpoint:** Analyzes all tasks in a project to generate a "Project Health Check" summary, identifying progress, bottlenecks, and next steps.
    - **Q&A Endpoint:** Takes a user's question and project context to provide an intelligent, context-aware answer.
- **Data Validation:** Uses Mongoose schemas to ensure data integrity.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **AI:** Google Gemini (`@google/genai`)
- **Environment Variables:** `dotenv`
- **CORS:** `cors`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB (a local instance or a cloud service like MongoDB Atlas)
- A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/backend-repo-name.git](https://github.com/your-username/backend-repo-name.git)
    cd backend-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the following configuration:
    ```env
    # Your MongoDB connection string
    MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>

    # The port for the server to run on
    PORT=5000

    # Your Google Gemini API Key from Google AI Studio
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the server:**
    ```bash
    npm run start
    ```
    The API will be running on `http://localhost:5000`.

---

## 📜 API Endpoints

### Project Routes
`Base Path: /api/projects`
| Method | Endpoint                    | Description                                       |
|--------|-----------------------------|---------------------------------------------------|
| `GET`  | `/`                         | Get all projects.                                 |
| `POST` | `/`                         | Create a new project.                             |
| `GET`  | `/:id`                      | Get a single project by its ID.                   |
| `PUT`  | `/:id`                      | Update a project's details.                       |
| `DELETE`| `/:id`                      | Delete a project and all its associated tasks.    |
| `POST` | `/:id/columns`              | Add a new column to a project's board.            |

### Task Routes
`Base Path: /api`
| Method | Endpoint                    | Description                                       |
|--------|-----------------------------|---------------------------------------------------|
| `POST` | `/projects/:projectId/tasks`| Create a new task for a specific project.         |
| `PUT`  | `/tasks/:id`                | Update a task by its ID.                          |
| `DELETE`| `/tasks/:id`                | Delete a task by its ID.                          |
| `PUT`  | `/tasks/update-order`       | Batch update the order and status of multiple tasks.|

### AI Routes
`Base Path: /api/ai`
| Method | Endpoint                    | Description                                       |
|--------|-----------------------------|---------------------------------------------------|
| `POST` | `/summarize`                | Generate an AI summary for a given project ID.    |
| `POST` | `/ask`                      | Ask the AI a question in the context of a project.|

---